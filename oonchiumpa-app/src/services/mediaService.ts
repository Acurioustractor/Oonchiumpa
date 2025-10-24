import { supabase, SUPABASE_PROJECT_ID } from "../config/supabase";

const PROJECT_ID = SUPABASE_PROJECT_ID || "";

export type MediaFile = {
  id: string;
  title: string;
  description?: string;
  type: "image" | "video" | "audio" | "document";
  category:
    | "story-media"
    | "team-photos"
    | "service-photos"
    | "cultural-artifacts"
    | "community-events"
    | "educational";
  url: string;
  thumbnail_url?: string;
  file_size: number;
  duration?: number; // for videos/audio in seconds
  dimensions?: {
    width: number;
    height: number;
  };
  tags: string[];
  created_by: string;
  storyteller_id?: string;
  story_id?: string;
  cultural_sensitivity: "public" | "community" | "private" | "sacred";
  elder_approved: boolean;
  created_at: string;
  updated_at: string;
};

export type MediaUploadProgress = {
  file: File;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
  error?: string;
  url?: string;
};

export class MediaService {
  private static instance: MediaService;
  private uploadCallbacks: Map<
    string,
    (progress: MediaUploadProgress) => void
  > = new Map();

  static getInstance(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }
    return MediaService.instance;
  }

  // Upload media files to Supabase Storage
  async uploadMedia(
    file: File,
    metadata: {
      title: string;
      description?: string;
      category: MediaFile["category"];
      tags: string[];
      storyteller_id?: string;
      story_id?: string;
      cultural_sensitivity: MediaFile["cultural_sensitivity"];
    },
    onProgress?: (progress: MediaUploadProgress) => void,
  ): Promise<MediaFile> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `oonchiumpa/${metadata.category}/${fileName}`;

    const progressCallback = onProgress || (() => {});
    const uploadId = Math.random().toString(36);

    try {
      progressCallback({
        file,
        progress: 0,
        status: "uploading",
      });

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      progressCallback({
        file,
        progress: 50,
        status: "processing",
      });

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(filePath);

      // Generate thumbnail for images/videos
      let thumbnailUrl;
      if (file.type.startsWith("image/")) {
        thumbnailUrl = await this.generateImageThumbnail(publicUrl);
      } else if (file.type.startsWith("video/")) {
        thumbnailUrl = await this.generateVideoThumbnail(file);
      }

      // Get file dimensions if it's an image or video
      let dimensions;
      let duration;

      if (file.type.startsWith("image/")) {
        dimensions = await this.getImageDimensions(file);
      } else if (file.type.startsWith("video/")) {
        const videoData = await this.getVideoMetadata(file);
        dimensions = videoData.dimensions;
        duration = videoData.duration;
      }

      progressCallback({
        file,
        progress: 75,
        status: "processing",
      });

      // Save metadata to database
      const mediaData: Record<string, unknown> = {
        title: metadata.title,
        description: metadata.description,
        type: this.getMediaType(file.type),
        category: metadata.category,
        url: publicUrl,
        thumbnail_url: thumbnailUrl,
        file_size: file.size,
        duration,
        dimensions,
        tags: metadata.tags,
        created_by: "current-user", // TODO: Get from auth context
        storyteller_id: metadata.storyteller_id,
        story_id: metadata.story_id,
        cultural_sensitivity: metadata.cultural_sensitivity,
        elder_approved: false, // Default to requiring approval
      };

      if (PROJECT_ID) {
        mediaData.project_id = PROJECT_ID;
      }

      const { data: dbData, error: dbError } = await supabase
        .from("media_files")
        .insert(mediaData)
        .select()
        .single();

      if (dbError) throw dbError;

      const result: MediaFile = {
        id: dbData.id,
        ...mediaData,
        created_at: dbData.created_at,
        updated_at: dbData.updated_at,
      };

      progressCallback({
        file,
        progress: 100,
        status: "complete",
        url: publicUrl,
      });

      return result;
    } catch (error) {
      progressCallback({
        file,
        progress: 0,
        status: "error",
        error: error.message,
      });
      throw error;
    }
  }

  // Get media files with filtering
  async getMedia(
    filters: {
      category?: MediaFile["category"];
      type?: MediaFile["type"];
      storyteller_id?: string;
      story_id?: string;
      tags?: string[];
      cultural_sensitivity?: MediaFile["cultural_sensitivity"][];
      elder_approved?: boolean;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<MediaFile[]> {
    let query = supabase.from("media_files").select("*");

    if (PROJECT_ID) {
      query = query.eq("project_id", PROJECT_ID);
    }

    if (filters.category) {
      query = query.eq("category", filters.category);
    }
    if (filters.type) {
      query = query.eq("type", filters.type);
    }
    if (filters.storyteller_id) {
      query = query.eq("storyteller_id", filters.storyteller_id);
    }
    if (filters.story_id) {
      query = query.eq("story_id", filters.story_id);
    }
    if (filters.cultural_sensitivity) {
      query = query.in("cultural_sensitivity", filters.cultural_sensitivity);
    }
    if (filters.elder_approved !== undefined) {
      query = query.eq("elder_approved", filters.elder_approved);
    }
    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps("tags", filters.tags);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 50) - 1,
      );
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  // Delete media file
  async deleteMedia(mediaId: string): Promise<void> {
    // First get the media file to get the storage path
    let fetchQuery = supabase
      .from("media_files")
      .select("url")
      .eq("id", mediaId);

    if (PROJECT_ID) {
      fetchQuery = fetchQuery.eq("project_id", PROJECT_ID);
    }

    const { data: mediaFile, error: fetchError } = await fetchQuery.single();

    if (fetchError) throw fetchError;

    // Extract file path from URL
    const url = new URL(mediaFile.url);
    const filePath = url.pathname.split("/storage/v1/object/public/media/")[1];

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("media")
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete from database
    let deleteQuery = supabase
      .from("media_files")
      .delete()
      .eq("id", mediaId);

    if (PROJECT_ID) {
      deleteQuery = deleteQuery.eq("project_id", PROJECT_ID);
    }

    const { error: dbError } = await deleteQuery;

    if (dbError) throw dbError;
  }

  // Update media metadata
  async updateMedia(
    mediaId: string,
    updates: Partial<
      Pick<
        MediaFile,
        | "title"
        | "description"
        | "tags"
        | "cultural_sensitivity"
        | "elder_approved"
      >
    >,
  ): Promise<MediaFile> {
    let updateQuery = supabase
      .from("media_files")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", mediaId);

    if (PROJECT_ID) {
      updateQuery = updateQuery.eq("project_id", PROJECT_ID);
    }

    const { data, error } = await updateQuery.select().single();

    if (error) throw error;
    return data;
  }

  // Helper functions
  private getMediaType(mimeType: string): MediaFile["type"] {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    return "document";
  }

  private async generateImageThumbnail(imageUrl: string): Promise<string> {
    // For now, return the same URL - in production, you'd generate actual thumbnails
    // You could use services like Cloudinary, ImageKit, or generate them server-side
    return imageUrl;
  }

  private async generateVideoThumbnail(videoFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = 1; // Get frame at 1 second
      };

      video.onseekingcomplete = video.onseeked = () => {
        ctx?.drawImage(video, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const thumbnailUrl = URL.createObjectURL(blob);
              resolve(thumbnailUrl);
            } else {
              reject(new Error("Failed to generate video thumbnail"));
            }
          },
          "image/jpeg",
          0.8,
        );
      };

      video.src = URL.createObjectURL(videoFile);
    });
  }

  private async getImageDimensions(
    file: File,
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private async getVideoMetadata(file: File): Promise<{
    dimensions: { width: number; height: number };
    duration: number;
  }> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.onloadedmetadata = () => {
        resolve({
          dimensions: { width: video.videoWidth, height: video.videoHeight },
          duration: Math.floor(video.duration),
        });
      };
      video.onerror = reject;
      video.src = URL.createObjectURL(file);
    });
  }

  // Get media statistics
  async getMediaStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    byType: Record<MediaFile["type"], number>;
    byCategory: Record<MediaFile["category"], number>;
    pendingApproval: number;
  }> {
    let query = supabase
      .from("media_files")
      .select("type, category, file_size, elder_approved");

    if (PROJECT_ID) {
      query = query.eq("project_id", PROJECT_ID);
    }

    const { data, error } = await query;

    if (error) throw error;

    const stats = {
      totalFiles: data.length,
      totalSize: data.reduce((sum, file) => sum + file.file_size, 0),
      byType: {} as Record<MediaFile["type"], number>,
      byCategory: {} as Record<MediaFile["category"], number>,
      pendingApproval: data.filter((file) => !file.elder_approved).length,
    };

    data.forEach((file) => {
      stats.byType[file.type] = (stats.byType[file.type] || 0) + 1;
      stats.byCategory[file.category] =
        (stats.byCategory[file.category] || 0) + 1;
    });

    return stats;
  }
}

export const mediaService = MediaService.getInstance();
