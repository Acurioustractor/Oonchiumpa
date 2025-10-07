import React, { useState } from 'react';
import { Section } from '../components/Section';
import { Card, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { supabase } from '../config/supabase';

interface UploadStatus {
  status: 'idle' | 'uploading' | 'success' | 'error';
  message?: string;
  uploadedCount?: number;
  totalCount?: number;
}

export const GalleryUploadPage: React.FC = () => {
  const [photoStatus, setPhotoStatus] = useState<UploadStatus>({ status: 'idle' });
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoStatus, setVideoStatus] = useState<UploadStatus>({ status: 'idle' });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setPhotoStatus({ status: 'uploading', uploadedCount: 0, totalCount: files.length });

    const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('story-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('story-images')
          .getPublicUrl(filePath);

        // Add to gallery_media table
        const { error: dbError } = await supabase
          .from('gallery_media')
          .insert({
            tenant_id: OONCHIUMPA_TENANT_ID,
            title: file.name.replace(/\.[^/.]+$/, ''),
            url: publicUrl,
            media_type: 'photo',
            category: 'gallery',
            display_order: i
          });

        if (dbError) throw dbError;

        successCount++;
        setPhotoStatus({
          status: 'uploading',
          uploadedCount: successCount,
          totalCount: files.length
        });

      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    }

    if (successCount === files.length) {
      setPhotoStatus({
        status: 'success',
        message: `Successfully uploaded ${successCount} photo${successCount > 1 ? 's' : ''}!`
      });
    } else {
      setPhotoStatus({
        status: 'error',
        message: `Uploaded ${successCount} of ${files.length} photos. Some failed.`
      });
    }

    // Reset after 3 seconds
    setTimeout(() => {
      setPhotoStatus({ status: 'idle' });
      event.target.value = ''; // Clear file input
    }, 3000);
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoUrl.trim()) {
      setVideoStatus({ status: 'error', message: 'Video URL is required' });
      return;
    }

    setVideoStatus({ status: 'uploading' });

    try {
      const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

      // Extract embed URL from various Descript formats
      let embedUrl = videoUrl;
      if (videoUrl.includes('share.descript.com')) {
        // If it's already an embed URL, use it directly
        if (!videoUrl.includes('/embed/')) {
          // Convert share URL to embed URL
          embedUrl = videoUrl.replace('/view/', '/embed/');
        }
      }

      const { error } = await supabase
        .from('gallery_media')
        .insert({
          tenant_id: OONCHIUMPA_TENANT_ID,
          title: videoTitle.trim() || 'Untitled Video',
          description: videoDescription.trim() || null,
          url: embedUrl,
          media_type: 'video',
          category: 'gallery'
        });

      if (error) throw error;

      setVideoStatus({ status: 'success', message: 'Video added successfully!' });

      // Clear form
      setVideoUrl('');
      setVideoTitle('');
      setVideoDescription('');

      // Reset status after 3 seconds
      setTimeout(() => setVideoStatus({ status: 'idle' }), 3000);

    } catch (error) {
      console.error('Error adding video:', error);
      setVideoStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to add video'
      });
      setTimeout(() => setVideoStatus({ status: 'idle' }), 5000);
    }
  };

  return (
    <>
      <Section className="bg-gradient-to-br from-sand-50 via-sand-100 to-ochre-50 pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-earth-900 mb-6">
            Media <span className="text-gradient">Upload</span>
          </h1>
          <p className="text-lg md:text-xl text-earth-700">
            Upload photos and add video embeds to your gallery
          </p>
        </div>
      </Section>

      <Section>
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Photo Upload */}
          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold text-earth-900 mb-4">
                📸 Upload Photos
              </h2>
              <p className="text-earth-600 mb-6">
                Select one or multiple photos from your computer to add to the gallery
              </p>

              <div className="space-y-4">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    disabled={photoStatus.status === 'uploading'}
                    className="block w-full text-sm text-earth-600
                      file:mr-4 file:py-3 file:px-6
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-ochre-600 file:text-white
                      hover:file:bg-ochre-700
                      file:cursor-pointer
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </label>

                {photoStatus.status === 'uploading' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">
                      Uploading... {photoStatus.uploadedCount} of {photoStatus.totalCount}
                    </p>
                  </div>
                )}

                {photoStatus.status === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                      ✅ {photoStatus.message}
                    </p>
                  </div>
                )}

                {photoStatus.status === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium">
                      ❌ {photoStatus.message}
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Video Embed */}
          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold text-earth-900 mb-4">
                🎥 Add Video Embed
              </h2>
              <p className="text-earth-600 mb-6">
                Add videos from Descript or other platforms using embed URLs
              </p>

              <form onSubmit={handleVideoSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Video URL (Descript share/embed link)
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://share.descript.com/view/..."
                    disabled={videoStatus.status === 'uploading'}
                    className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:border-ochre-500 focus:ring-2 focus:ring-ochre-200 outline-none transition-all disabled:opacity-50"
                    required
                  />
                  <p className="text-xs text-earth-500 mt-1">
                    Supports Descript, YouTube, Vimeo, and other embed URLs
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Video Title
                  </label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Enter video title"
                    disabled={videoStatus.status === 'uploading'}
                    className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:border-ochre-500 focus:ring-2 focus:ring-ochre-200 outline-none transition-all disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder="Enter video description"
                    disabled={videoStatus.status === 'uploading'}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:border-ochre-500 focus:ring-2 focus:ring-ochre-200 outline-none transition-all disabled:opacity-50"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={videoStatus.status === 'uploading'}
                  className="w-full"
                >
                  {videoStatus.status === 'uploading' ? 'Adding Video...' : 'Add Video'}
                </Button>

                {videoStatus.status === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                      ✅ {videoStatus.message}
                    </p>
                  </div>
                )}

                {videoStatus.status === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium">
                      ❌ {videoStatus.message}
                    </p>
                  </div>
                )}
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">💡 How to get Descript embed URLs:</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Open your video in Descript</li>
                  <li>Click "Publish" or "Share"</li>
                  <li>Copy the share link (it will be converted to embed format automatically)</li>
                  <li>Paste the link above</li>
                </ol>
              </div>
            </CardBody>
          </Card>

        </div>
      </Section>
    </>
  );
};
