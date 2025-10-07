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
export declare class GooglePhotosIntegration {
    private oauth2Client;
    private prisma;
    private baseURL;
    constructor(config: GooglePhotosConfig);
    /**
     * Make authenticated request to Google Photos API
     */
    private makeRequest;
    /**
     * Get Google Photos authorization URL
     */
    getAuthUrl(): string;
    /**
     * Set access token from OAuth callback
     */
    setCredentials(authCode: string): Promise<any>;
    /**
     * Get user's Google Photos albums
     */
    getAlbums(): Promise<any>;
    /**
     * Get photos from specific album or all photos
     */
    getPhotos(albumId?: string, limit?: number): Promise<PhotoMetadata[]>;
    /**
     * Import photos from Google Photos to our system
     */
    importPhotos(photos: PhotoMetadata[], options: {
        programId?: string;
        outcomeId?: string;
        storyId?: string;
        uploadedById: string;
        autoAnalyze?: boolean;
        tags?: string[];
    }): Promise<{
        total: number;
        successful: number;
        failed: number;
        results: ({
            originalId: string;
            mediaItemId: string;
            filename: string;
            cloudinaryUrl: string;
            thumbnailUrl: string;
            aiAnalysis: any;
            status: string;
            error?: undefined;
        } | {
            originalId: string;
            filename: string;
            error: string;
            status: string;
            mediaItemId?: undefined;
            cloudinaryUrl?: undefined;
            thumbnailUrl?: undefined;
            aiAnalysis?: undefined;
        })[];
    }>;
    /**
     * Link imported media to content (stories, outcomes, programs)
     */
    private linkToContent;
    /**
     * Search Google Photos by date range
     */
    searchPhotosByDateRange(startDate: Date, endDate: Date): Promise<any>;
    /**
     * Get Google Photos sharing info
     */
    getPhotoSharingInfo(mediaItemId: string): Promise<{
        id: any;
        productUrl: any;
        baseUrl: any;
        filename: any;
        description: any;
        mimeType: any;
        mediaMetadata: any;
    }>;
    /**
     * Batch import from album with progress tracking
     */
    batchImportFromAlbum(albumId: string, options: {
        uploadedById: string;
        programId?: string;
        outcomeId?: string;
        batchSize?: number;
        onProgress?: (progress: {
            current: number;
            total: number;
            filename: string;
        }) => void;
    }): Promise<{
        albumId: string;
        totalPhotos: number;
        successful: number;
        failed: number;
        results: ({
            originalId: string;
            mediaItemId: string;
            filename: string;
            cloudinaryUrl: string;
            thumbnailUrl: string;
            aiAnalysis: any;
            status: string;
            error?: undefined;
        } | {
            originalId: string;
            filename: string;
            error: string;
            status: string;
            mediaItemId?: undefined;
            cloudinaryUrl?: undefined;
            thumbnailUrl?: undefined;
            aiAnalysis?: undefined;
        })[];
    }>;
}
export declare const googlePhotos: GooglePhotosIntegration;
export {};
//# sourceMappingURL=googlePhotosIntegration.d.ts.map