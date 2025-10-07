import { google } from 'googleapis';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { aiOrchestrator } from './aiOrchestrator';
import { v2 as cloudinary } from 'cloudinary';

interface GooglePhotosConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

interface PhotoMetadata {
  id: string;
  filename: string;
  description: string;
  creationTime: string;
  mediaMetadata?: {
    width: string;
    height: string;
    photo?: any;
    video?: any;
  };
}

export class GooglePhotosIntegration {
  private oauth2Client: any;
  private prisma: PrismaClient;
  private baseURL = 'https://photoslibrary.googleapis.com/v1';

  constructor(config: GooglePhotosConfig) {
    this.prisma = new PrismaClient();
    
    // Initialize Google OAuth2
    this.oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Make authenticated request to Google Photos API
   */
  private async makeRequest(endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any) {
    const accessToken = this.oauth2Client.credentials.access_token;
    
    if (!accessToken) {
      throw new Error('Not authenticated with Google Photos');
    }

    try {
      const response = await axios({
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Google Photos authentication expired. Please re-authorize.');
      }
      throw error;
    }
  }

  /**
   * Get Google Photos authorization URL
   */
  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/photoslibrary.readonly',
      'https://www.googleapis.com/auth/photoslibrary.appendonly'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  /**
   * Set access token from OAuth callback
   */
  async setCredentials(authCode: string) {
    const { tokens } = await this.oauth2Client.getToken(authCode);
    this.oauth2Client.setCredentials(tokens);
    
    // Store tokens securely (you might want to encrypt these)
    return tokens;
  }

  /**
   * Get user's Google Photos albums
   */
  async getAlbums() {
    try {
      const response = await this.makeRequest('/albums?pageSize=50');

      return response.albums?.map((album: any) => ({
        id: album.id,
        title: album.title,
        productUrl: album.productUrl,
        mediaItemsCount: album.mediaItemsCount,
        coverPhotoBaseUrl: album.coverPhotoBaseUrl,
        coverPhotoMediaItemId: album.coverPhotoMediaItemId
      })) || [];
    } catch (error) {
      console.error('Error fetching Google Photos albums:', error);
      throw error;
    }
  }

  /**
   * Get photos from specific album or all photos
   */
  async getPhotos(albumId?: string, limit: number = 100): Promise<PhotoMetadata[]> {
    try {
      let searchParams: any = {
        pageSize: Math.min(limit, 100),
      };

      if (albumId) {
        searchParams.albumId = albumId;
      } else {
        // Search all photos with filters
        searchParams.filters = {
          mediaTypeFilter: {
            mediaTypes: ['PHOTO', 'VIDEO']
          },
          dateFilter: {
            ranges: [{
              startDate: {
                year: 2023,
                month: 1,
                day: 1
              },
              endDate: {
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                day: new Date().getDate()
              }
            }]
          }
        };
      }

      const response = await this.makeRequest('/mediaItems:search', 'POST', searchParams);
      
      return response.mediaItems?.map((item: any) => ({
        id: item.id,
        filename: item.filename,
        description: item.description || '',
        creationTime: item.mediaMetadata.creationTime,
        mediaMetadata: item.mediaMetadata,
        baseUrl: item.baseUrl,
        productUrl: item.productUrl,
        mimeType: item.mimeType
      })) || [];
    } catch (error) {
      console.error('Error fetching Google Photos:', error);
      throw error;
    }
  }

  /**
   * Import photos from Google Photos to our system
   */
  async importPhotos(
    photos: PhotoMetadata[], 
    options: {
      programId?: string;
      outcomeId?: string;
      storyId?: string;
      uploadedById: string;
      autoAnalyze?: boolean;
      tags?: string[];
    }
  ) {
    const importResults = [];

    for (const photo of photos) {
      try {
        console.log(`📸 Processing: ${photo.filename}`);

        // 1. Download photo from Google Photos
        const photoUrl = `${photo.baseUrl}=w2048-h2048`; // High quality
        
        // 2. Upload to Cloudinary for optimization and CDN
        const cloudinaryResult = await cloudinary.uploader.upload(photoUrl, {
          folder: 'oonchiumpa/imported',
          public_id: `google_${photo.id}`,
          resource_type: 'auto',
          transformation: [
            { width: 1920, height: 1080, crop: 'limit' },
            { quality: 'auto:good' },
            { format: 'auto' }
          ]
        });

        // 3. Create thumbnail
        const thumbnailUrl = cloudinary.url(cloudinaryResult.public_id, {
          width: 400,
          height: 300,
          crop: 'fill',
          gravity: 'center',
          quality: 'auto:good'
        });

        // 4. AI Analysis (if enabled)
        let aiAnalysis = null;
        if (options.autoAnalyze) {
          try {
            aiAnalysis = await aiOrchestrator.analyzeMedia(cloudinaryResult.secure_url, 'image');
            console.log(`🤖 AI Analysis completed for ${photo.filename}`);
          } catch (aiError) {
            console.warn(`⚠️ AI analysis failed for ${photo.filename}:`, aiError);
          }
        }

        // 5. Create media item in database
        const mediaItem = await this.prisma.mediaItem.create({
          data: {
            type: photo.mimeType?.startsWith('video/') ? 'VIDEO' : 'IMAGE',
            originalUrl: photoUrl,
            cdnUrl: cloudinaryResult.secure_url,
            thumbnailUrl,
            title: photo.filename || 'Imported from Google Photos',
            description: photo.description || aiAnalysis?.[0]?.content?.description || '',
            altText: aiAnalysis?.[0]?.content?.description || photo.description || '',
            tags: [
              ...(options.tags || []),
              'google-photos',
              'imported',
              ...(aiAnalysis?.[0]?.content?.tags || [])
            ],
            filename: photo.filename,
            fileSize: cloudinaryResult.bytes,
            mimeType: photo.mimeType || 'image/jpeg',
            width: cloudinaryResult.width,
            height: cloudinaryResult.height,
            uploadedById: options.uploadedById,
            aiDescription: aiAnalysis?.[0]?.content?.description,
            aiTags: aiAnalysis?.[0]?.content?.tags || [],
            culturalContext: {
              importedFrom: 'google-photos',
              originalId: photo.id,
              creationTime: photo.creationTime,
              importedAt: new Date().toISOString(),
              cloudinaryPublicId: cloudinaryResult.public_id
            }
          }
        });

        // 6. Link to programs/outcomes/stories if specified
        await this.linkToContent(mediaItem.id, options);

        importResults.push({
          originalId: photo.id,
          mediaItemId: mediaItem.id,
          filename: photo.filename,
          cloudinaryUrl: cloudinaryResult.secure_url,
          thumbnailUrl,
          aiAnalysis: aiAnalysis?.[0]?.content,
          status: 'success'
        });

        console.log(`✅ Successfully imported: ${photo.filename}`);

      } catch (error) {
        console.error(`❌ Error importing ${photo.filename}:`, error);
        importResults.push({
          originalId: photo.id,
          filename: photo.filename,
          error: error instanceof Error ? error.message : 'Import failed',
          status: 'error'
        });
      }
    }

    return {
      total: photos.length,
      successful: importResults.filter(r => r.status === 'success').length,
      failed: importResults.filter(r => r.status === 'error').length,
      results: importResults
    };
  }

  /**
   * Link imported media to content (stories, outcomes, programs)
   */
  private async linkToContent(mediaId: string, options: any) {
    try {
      if (options.storyId) {
        await this.prisma.story.update({
          where: { id: options.storyId },
          data: {
            mediaItems: {
              connect: { id: mediaId }
            }
          }
        });
      }

      if (options.outcomeId) {
        await this.prisma.outcome.update({
          where: { id: options.outcomeId },
          data: {
            mediaItems: {
              connect: { id: mediaId }
            }
          }
        });
      }
    } catch (error) {
      console.warn('Error linking media to content:', error);
    }
  }

  /**
   * Search Google Photos by date range
   */
  async searchPhotosByDateRange(startDate: Date, endDate: Date) {
    try {
      const searchParams = {
        pageSize: 100,
        filters: {
          dateFilter: {
            ranges: [{
              startDate: {
                year: startDate.getFullYear(),
                month: startDate.getMonth() + 1,
                day: startDate.getDate()
              },
              endDate: {
                year: endDate.getFullYear(),
                month: endDate.getMonth() + 1,
                day: endDate.getDate()
              }
            }]
          },
          mediaTypeFilter: {
            mediaTypes: ['PHOTO', 'VIDEO']
          }
        }
      };

      const response = await this.makeRequest('/mediaItems:search', 'POST', searchParams);
      return response.mediaItems || [];
    } catch (error) {
      console.error('Error searching photos by date:', error);
      throw error;
    }
  }

  /**
   * Get Google Photos sharing info
   */
  async getPhotoSharingInfo(mediaItemId: string) {
    try {
      const response = await this.makeRequest(`/mediaItems/${mediaItemId}`);

      return {
        id: response.id,
        productUrl: response.productUrl,
        baseUrl: response.baseUrl,
        filename: response.filename,
        description: response.description,
        mimeType: response.mimeType,
        mediaMetadata: response.mediaMetadata
      };
    } catch (error) {
      console.error('Error getting photo sharing info:', error);
      throw error;
    }
  }

  /**
   * Batch import from album with progress tracking
   */
  async batchImportFromAlbum(
    albumId: string,
    options: {
      uploadedById: string;
      programId?: string;
      outcomeId?: string;
      batchSize?: number;
      onProgress?: (progress: { current: number; total: number; filename: string }) => void;
    }
  ) {
    console.log(`🚀 Starting batch import from album: ${albumId}`);

    // Get all photos from album
    const photos = await this.getPhotos(albumId);
    console.log(`📊 Found ${photos.length} photos in album`);

    const batchSize = options.batchSize || 5;
    const results = [];

    // Process in batches to avoid overwhelming the system
    for (let i = 0; i < photos.length; i += batchSize) {
      const batch = photos.slice(i, i + batchSize);
      console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(photos.length / batchSize)}`);

      const batchResults = await this.importPhotos(batch, {
        ...options,
        autoAnalyze: true,
        tags: ['workshop', 'community', 'imported']
      });

      results.push(...batchResults.results);

      // Progress callback
      if (options.onProgress) {
        options.onProgress({
          current: Math.min(i + batchSize, photos.length),
          total: photos.length,
          filename: batch[batch.length - 1]?.filename || ''
        });
      }

      // Brief pause between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return {
      albumId,
      totalPhotos: photos.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      results
    };
  }
}

// Export singleton instance
export const googlePhotos = new GooglePhotosIntegration({
  clientId: process.env.GOOGLE_PHOTOS_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_PHOTOS_CLIENT_SECRET || '',
  redirectUri: process.env.GOOGLE_PHOTOS_REDIRECT_URI || 'http://localhost:3001/auth/google/callback'
});