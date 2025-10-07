import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../components/Section';
import { Card, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { MasonryGallery } from '../components/PhotoGallery';
import { VideoGrid } from '../components/VideoPlayer';
import { Loading } from '../components/Loading';
import { useApi } from '../hooks/useApi';
import { storiesAPI, mediaAPI } from '../services/api';
import { supabase } from '../config/supabase';

export const StoriesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stories' | 'photos' | 'videos'>('stories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ status: 'idle' | 'uploading' | 'success' | 'error', message?: string }>({ status: 'idle' });
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');

  const { data: stories, loading: storiesLoading, error: storiesError } = useApi(
    () => storiesAPI.getAll(),
    []
  );

  const { data: photos, loading: photosLoading } = useApi(
    () => mediaAPI.getGallery(),
    []
  );

  const { data: videos, loading: videosLoading } = useApi(
    () => mediaAPI.getVideos(),
    []
  );

  const categories = useMemo(() => {
    if (!stories) return [];
    // Use story_type instead of category for filtering
    const cats = stories.map(story => story.story_type || story.category).filter(Boolean);
    return ['all', ...Array.from(new Set(cats))];
  }, [stories]);

  const filteredStories = useMemo(() => {
    if (!stories) return [];

    return stories.filter(story => {
      const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          story.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          story.summary?.toLowerCase().includes(searchQuery.toLowerCase());
      const storyType = story.story_type || story.category;
      const matchesCategory = selectedCategory === 'all' || storyType === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [stories, searchQuery, selectedCategory]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';
    let successCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      setUploadStatus({
        status: 'uploading',
        message: `Uploading ${i + 1} of ${files.length}: ${file.name}`
      });

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        console.log(`Uploading ${file.name} to ${filePath}`);

        const { error: uploadError } = await supabase.storage
          .from('story-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error(`Upload error for ${file.name}:`, uploadError);
          errors.push(`${file.name}: ${uploadError.message}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('story-images')
          .getPublicUrl(filePath);

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

        if (dbError) {
          console.error(`Database error for ${file.name}:`, dbError);
          errors.push(`${file.name}: ${dbError.message}`);
          continue;
        }

        successCount++;
        console.log(`✓ Successfully uploaded ${file.name}`);
      } catch (error) {
        console.error('Error uploading photo:', error);
        errors.push(`${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (successCount === files.length) {
      setUploadStatus({ status: 'success', message: `✅ Successfully uploaded ${successCount} photo(s)!` });
      setShowPhotoUpload(false);
      setTimeout(() => window.location.reload(), 1500);
    } else if (successCount > 0) {
      setUploadStatus({
        status: 'error',
        message: `⚠️ Uploaded ${successCount} of ${files.length}. ${errors.length} failed. Check console for details.`
      });
      console.error('Upload errors:', errors);
    } else {
      setUploadStatus({ status: 'error', message: `❌ All uploads failed. Check console for details.` });
      console.error('Upload errors:', errors);
    }

    event.target.value = ''; // Clear file input
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoUrl.trim()) {
      setUploadStatus({ status: 'error', message: 'Video URL is required' });
      return;
    }

    setUploadStatus({ status: 'uploading', message: 'Adding video...' });

    try {
      const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

      let embedUrl = videoUrl;
      if (videoUrl.includes('share.descript.com') && !videoUrl.includes('/embed/')) {
        embedUrl = videoUrl.replace('/view/', '/embed/');
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

      setUploadStatus({ status: 'success', message: 'Video added successfully!' });
      setVideoUrl('');
      setVideoTitle('');
      setVideoDescription('');
      setShowVideoForm(false);
      window.location.reload(); // Refresh to show new video

    } catch (error) {
      console.error('Error adding video:', error);
      setUploadStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to add video'
      });
    }

    setTimeout(() => setUploadStatus({ status: 'idle' }), 3000);
  };

  if (storiesLoading) return <Loading />;

  if (storiesError) {
    return (
      <Section>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-earth-900 mb-4">Unable to load stories</h2>
          <p className="text-earth-600">Please try again later.</p>
        </div>
      </Section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-sand-50 via-sand-100 to-ochre-50 pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-earth-900 mb-6">
            Our <span className="text-gradient">Stories</span>
          </h1>
          <p className="text-lg md:text-xl text-earth-700 mb-8">
            Discover the rich tapestry of experiences, wisdom, and cultural heritage that shapes our community
          </p>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-full border border-earth-200 focus:border-ochre-500 focus:ring-2 focus:ring-ochre-200 outline-none transition-all"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-6 py-3 rounded-full border border-earth-200 focus:border-ochre-500 focus:ring-2 focus:ring-ochre-200 outline-none transition-all"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      {/* Navigation Tabs */}
      <Section className="pt-0">
        <div className="flex justify-center">
          <div className="flex bg-white rounded-full p-1 shadow-lg">
            {[
              { key: 'stories', label: 'Stories', count: stories?.length || 0 },
              { key: 'photos', label: 'Photos', count: photos?.length || 0 },
              { key: 'videos', label: 'Videos', count: videos?.length || 0 }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-ochre-600 text-white'
                    : 'text-earth-700 hover:text-ochre-600'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Content */}
      <Section className="pt-0">
        {activeTab === 'stories' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map(story => (
              <Card key={story.id} className="h-full flex flex-col overflow-hidden">
                {story.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                )}
                <CardBody className="flex flex-col flex-1">
                  <div className="flex-1 mb-4">
                    {(story.story_type || story.category) && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-ochre-700 bg-ochre-100 rounded-full mb-3">
                        {(story.story_type || story.category).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold text-earth-900 mb-2">
                      {story.title}
                    </h3>
                    {story.summary && (
                      <p className="text-earth-700 font-medium mb-3 line-clamp-2">
                        {story.summary}
                      </p>
                    )}
                    {!story.summary && story.subtitle && (
                      <p className="text-earth-600 font-medium mb-3">
                        {story.subtitle}
                      </p>
                    )}
                    {!story.summary && story.content && (
                      <p className="text-earth-600 mb-3 line-clamp-3">
                        {story.content.slice(0, 150)}...
                      </p>
                    )}
                  </div>
                  <div className="mt-auto pt-4 border-t border-earth-100">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-earth-500 flex-1">
                        {story.author && <div>By {story.author}</div>}
                        {story.date && <div className="text-earth-400">{formatDate(story.date)}</div>}
                      </div>
                      <Link to={`/stories/${story.id}`}>
                        <Button variant="ghost" size="sm">
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-6">
            {/* Upload Button */}
            <div className="flex justify-end">
              <Button onClick={() => setShowPhotoUpload(!showPhotoUpload)}>
                {showPhotoUpload ? '✖ Cancel' : '📤 Upload Photos'}
              </Button>
            </div>

            {/* Upload Form */}
            {showPhotoUpload && (
              <Card>
                <CardBody>
                  <h3 className="text-lg font-bold text-earth-900 mb-4">Upload Photos</h3>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    disabled={uploadStatus.status === 'uploading'}
                    className="block w-full text-sm text-earth-600
                      file:mr-4 file:py-3 file:px-6
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-ochre-600 file:text-white
                      hover:file:bg-ochre-700
                      file:cursor-pointer
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {uploadStatus.status !== 'idle' && (
                    <div className={`mt-4 p-4 rounded-lg ${
                      uploadStatus.status === 'success' ? 'bg-green-50 text-green-800' :
                      uploadStatus.status === 'error' ? 'bg-red-50 text-red-800' :
                      'bg-blue-50 text-blue-800'
                    }`}>
                      {uploadStatus.message}
                    </div>
                  )}
                </CardBody>
              </Card>
            )}

            {/* Gallery */}
            {photosLoading ? (
              <Loading />
            ) : photos && photos.length > 0 ? (
              <MasonryGallery
                photos={photos.map(photo => ({
                  id: photo.id,
                  src: photo.url,
                  title: photo.title,
                  description: photo.description,
                  alt: photo.title || 'Gallery photo'
                }))}
              />
            ) : (
              <div className="text-center">
                <p className="text-earth-600">No photos available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="space-y-6">
            {/* Upload Button */}
            <div className="flex justify-end">
              <Button onClick={() => setShowVideoForm(!showVideoForm)}>
                {showVideoForm ? '✖ Cancel' : '🎥 Add Video'}
              </Button>
            </div>

            {/* Video Form */}
            {showVideoForm && (
              <Card>
                <CardBody>
                  <h3 className="text-lg font-bold text-earth-900 mb-4">Add Video Embed</h3>
                  <form onSubmit={handleVideoSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Video URL (Descript, YouTube, Vimeo)
                      </label>
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://share.descript.com/view/..."
                        disabled={uploadStatus.status === 'uploading'}
                        className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:border-ochre-500 focus:ring-2 focus:ring-ochre-200 outline-none transition-all disabled:opacity-50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="Enter video title"
                        disabled={uploadStatus.status === 'uploading'}
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
                        disabled={uploadStatus.status === 'uploading'}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:border-ochre-500 focus:ring-2 focus:ring-ochre-200 outline-none transition-all disabled:opacity-50"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={uploadStatus.status === 'uploading'}
                      className="w-full"
                    >
                      {uploadStatus.status === 'uploading' ? 'Adding Video...' : 'Add Video'}
                    </Button>
                    {uploadStatus.status !== 'idle' && (
                      <div className={`p-4 rounded-lg ${
                        uploadStatus.status === 'success' ? 'bg-green-50 text-green-800' :
                        uploadStatus.status === 'error' ? 'bg-red-50 text-red-800' :
                        'bg-blue-50 text-blue-800'
                      }`}>
                        {uploadStatus.message}
                      </div>
                    )}
                  </form>
                </CardBody>
              </Card>
            )}

            {/* Video Grid */}
            {videosLoading ? (
              <Loading />
            ) : videos && videos.length > 0 ? (
              <VideoGrid
                videos={videos.map(video => ({
                  id: video.id,
                  url: video.url,
                  title: video.title || 'Untitled Video',
                  thumbnail: video.thumbnail,
                  description: video.description
                }))}
              />
            ) : (
              <div className="text-center">
                <p className="text-earth-600">No videos available</p>
              </div>
            )}
          </div>
        )}
      </Section>
    </>
  );
};