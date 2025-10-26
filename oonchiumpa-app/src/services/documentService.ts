import { supabase } from '../config/supabase';

// Oonchiumpa Organization Constants (from Phase 1)
const OONCHIUMPA_ORG_ID = 'c53077e1-98de-4216-9149-6268891ff62e';
const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';
const OONCHIUMPA_PROJECT_ID = '5b853f55-c01e-4f1d-9e16-b99290ee1a2c';

export interface DocumentMetadata {
  title: string;
  description?: string;
  storyteller_id?: string;
  cultural_sensitivity?: 'public' | 'community' | 'private' | 'sacred';
  requires_elder_review?: boolean;
  tags?: string[];
  duration_seconds?: number;
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

export interface TranscriptRecord {
  id: string;
  storyteller_id?: string;
  tenant_id: string;
  title: string;
  transcript_content?: string;
  recording_date?: string;
  duration_seconds?: number;
  ai_processing_consent: boolean;
  processing_status: string;
  transcript_quality?: string;
  cultural_sensitivity: string;
  requires_elder_review: boolean;
  audio_url?: string;
  video_url?: string;
  media_metadata: any;
  status: string;
  created_at: string;
  updated_at: string;
}

class DocumentService {
  /**
   * Upload a document file to Supabase Storage
   */
  async uploadDocument(
    file: File,
    metadata: DocumentMetadata,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<TranscriptRecord> {
    const progress: UploadProgress = {
      file,
      progress: 0,
      status: 'uploading'
    };

    try {
      onProgress?.(progress);

      // Determine bucket based on file type
      const bucket = this.getBucketForFile(file);
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `oonchiumpa/${fileName}`;

      // Update progress
      progress.progress = 10;
      onProgress?.(progress);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      progress.progress = 50;
      onProgress?.(progress);

      // Get public URL (if public bucket) or signed URL (if private)
      const { data: { publicUrl } } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(filePath);

      progress.progress = 60;
      onProgress?.(progress);

      // Create transcript record in database
      const transcriptData = {
        tenant_id: OONCHIUMPA_TENANT_ID,
        storyteller_id: metadata.storyteller_id || null,
        title: metadata.title,
        transcript_content: '', // Will be populated after processing
        recording_date: new Date().toISOString(),
        duration_seconds: metadata.duration_seconds || null,
        ai_processing_consent: false, // Default to false, user must explicitly consent
        processing_status: 'pending',
        transcript_quality: 'unknown',
        cultural_sensitivity: metadata.cultural_sensitivity || 'community',
        requires_elder_review: metadata.requires_elder_review || false,
        audio_url: file.type.startsWith('audio/') ? publicUrl : null,
        video_url: file.type.startsWith('video/') ? publicUrl : null,
        media_metadata: {
          original_filename: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: filePath,
          bucket: bucket,
          uploaded_at: new Date().toISOString(),
          description: metadata.description,
          tags: metadata.tags || [],
          duration_seconds: metadata.duration_seconds
        },
        status: 'pending',
        project_id: OONCHIUMPA_PROJECT_ID,
        organization_id: OONCHIUMPA_ORG_ID
      };

      progress.progress = 80;
      onProgress?.(progress);

      const { data: transcript, error: dbError } = await supabase
        .from('transcripts')
        .insert(transcriptData)
        .select()
        .single();

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from(bucket).remove([filePath]);
        throw new Error(`Database error: ${dbError.message}`);
      }

      progress.progress = 100;
      progress.status = 'complete';
      onProgress?.(progress);

      return transcript as TranscriptRecord;

    } catch (error) {
      progress.status = 'error';
      progress.error = error instanceof Error ? error.message : 'Unknown error';
      onProgress?.(progress);
      throw error;
    }
  }

  /**
   * Get all documents for Oonchiumpa organization
   */
  async getDocuments(filters?: {
    status?: string;
    storyteller_id?: string;
    limit?: number;
  }): Promise<TranscriptRecord[]> {
    let query = supabase
      .from('transcripts')
      .select('*')
      .eq('tenant_id', OONCHIUMPA_TENANT_ID)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.storyteller_id) {
      query = query.eq('storyteller_id', filters.storyteller_id);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }

    return (data || []) as TranscriptRecord[];
  }

  /**
   * Get a single document by ID
   */
  async getDocument(id: string): Promise<TranscriptRecord | null> {
    const { data, error } = await supabase
      .from('transcripts')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', OONCHIUMPA_TENANT_ID)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch document: ${error.message}`);
    }

    return data as TranscriptRecord | null;
  }

  /**
   * Update document metadata
   */
  async updateDocument(id: string, updates: Partial<DocumentMetadata>): Promise<TranscriptRecord> {
    const updateData: any = {};

    if (updates.title) updateData.title = updates.title;
    if (updates.description) {
      updateData.media_metadata = {
        ...updateData.media_metadata,
        description: updates.description
      };
    }
    if (updates.cultural_sensitivity) {
      updateData.cultural_sensitivity = updates.cultural_sensitivity;
    }
    if (updates.requires_elder_review !== undefined) {
      updateData.requires_elder_review = updates.requires_elder_review;
    }
    if (updates.tags) {
      updateData.media_metadata = {
        ...updateData.media_metadata,
        tags: updates.tags
      };
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('transcripts')
      .update(updateData)
      .eq('id', id)
      .eq('tenant_id', OONCHIUMPA_TENANT_ID)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update document: ${error.message}`);
    }

    return data as TranscriptRecord;
  }

  /**
   * Delete a document and its associated file
   */
  async deleteDocument(id: string): Promise<void> {
    // Get document to find storage path
    const document = await this.getDocument(id);

    if (!document) {
      throw new Error('Document not found');
    }

    // Delete from storage if file exists
    if (document.media_metadata?.storage_path && document.media_metadata?.bucket) {
      await supabase
        .storage
        .from(document.media_metadata.bucket)
        .remove([document.media_metadata.storage_path]);
    }

    // Delete from database
    const { error } = await supabase
      .from('transcripts')
      .delete()
      .eq('id', id)
      .eq('tenant_id', OONCHIUMPA_TENANT_ID);

    if (error) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  /**
   * Update document processing status
   */
  async updateProcessingStatus(
    id: string,
    status: 'pending' | 'processing' | 'completed' | 'failed',
    transcript_content?: string
  ): Promise<TranscriptRecord> {
    const updateData: any = {
      processing_status: status,
      updated_at: new Date().toISOString()
    };

    if (transcript_content) {
      updateData.transcript_content = transcript_content;
      updateData.word_count = transcript_content.split(/\s+/).length;
      updateData.character_count = transcript_content.length;
    }

    if (status === 'completed') {
      updateData.ai_processing_date = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('transcripts')
      .update(updateData)
      .eq('id', id)
      .eq('tenant_id', OONCHIUMPA_TENANT_ID)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update processing status: ${error.message}`);
    }

    return data as TranscriptRecord;
  }

  /**
   * Get download URL for a document
   */
  async getDownloadUrl(id: string, expiresIn: number = 3600): Promise<string> {
    const document = await this.getDocument(id);

    if (!document || !document.media_metadata?.storage_path || !document.media_metadata?.bucket) {
      throw new Error('Document not found or has no associated file');
    }

    const { data, error } = await supabase
      .storage
      .from(document.media_metadata.bucket)
      .createSignedUrl(document.media_metadata.storage_path, expiresIn);

    if (error) {
      throw new Error(`Failed to generate download URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  /**
   * Determine which storage bucket to use based on file type
   */
  private getBucketForFile(file: File): string {
    if (file.type.startsWith('audio/')) {
      return 'documents'; // Audio files go to documents bucket
    } else if (file.type.startsWith('video/')) {
      return 'documents'; // Video files go to documents bucket
    } else if (file.type.startsWith('image/')) {
      return 'media'; // Images go to media bucket
    } else {
      return 'documents'; // PDFs, DOCX, TXT go to documents bucket
    }
  }

  /**
   * Get file type label for display
   */
  getFileTypeLabel(file: File): string {
    if (file.type.startsWith('audio/')) return 'Audio Recording';
    if (file.type.startsWith('video/')) return 'Video Recording';
    if (file.type.startsWith('image/')) return 'Image';
    if (file.type === 'application/pdf') return 'PDF Document';
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'Word Document';
    }
    if (file.type === 'text/plain') return 'Text File';
    return 'Document';
  }

  /**
   * Get file icon emoji for display
   */
  getFileIcon(file: File): string {
    if (file.type.startsWith('audio/')) return '🎵';
    if (file.type.startsWith('video/')) return '🎥';
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type === 'application/pdf') return '📕';
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return '📄';
    }
    if (file.type === 'text/plain') return '📝';
    return '📎';
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size (50MB limit for most files)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size (${this.formatFileSize(file.size)}) exceeds maximum allowed size (50MB)`
      };
    }

    // Check file type
    const allowedTypes = [
      'audio/mpeg',
      'audio/wav',
      'audio/mp4',
      'audio/m4a',
      'video/mp4',
      'video/quicktime',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type '${file.type}' is not supported. Allowed types: Audio (MP3, WAV, M4A), Video (MP4, MOV), Documents (PDF, DOCX, TXT), Images (JPG, PNG, WebP)`
      };
    }

    return { valid: true };
  }
}

export const documentService = new DocumentService();
