import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { supabase } from '../config/supabase';

interface Video {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  video_type: 'youtube' | 'vimeo' | 'descript' | 'direct';
  video_id: string;
  embed_code: string;
  thumbnail_url?: string;
  tags: string[];
  category?: string;
  service_area?: string;
  published_at: string;
}

export default function VideoGalleryPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [filterTag, setFilterTag] = useState<string>('all');

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('status', 'published')
      .eq('is_public', true)
      .order('published_at', { ascending: false });

    if (!error && data) {
      setVideos(data);
    }
    setLoading(false);
  };

  const allTags = Array.from(
    new Set(videos.flatMap(v => v.tags || []))
  ).sort();

  const filteredVideos = filterTag === 'all'
    ? videos
    : videos.filter(v => v.tags?.includes(filterTag));

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ochre-600 mx-auto"></div>
            <p className="mt-4 text-earth-600">Loading videos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-ochre-600 to-earth-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🎬 Video Gallery
            </h1>
            <p className="text-xl text-ochre-100 max-w-3xl">
              Stories from Country, our community, and our journey toward self-determination
            </p>
            <div className="mt-6 flex items-center space-x-4 text-ochre-200">
              <span className="text-2xl font-bold">{videos.length}</span>
              <span>videos shared</span>
            </div>
          </div>
        </div>

        {/* Filter Tags */}
        {allTags.length > 0 && (
          <div className="border-b border-earth-200 bg-earth-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterTag('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    filterTag === 'all'
                      ? 'bg-ochre-600 text-white'
                      : 'bg-white text-earth-700 hover:bg-earth-100'
                  }`}
                >
                  All Videos
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      filterTag === tag
                        ? 'bg-ochre-600 text-white'
                        : 'bg-white text-earth-700 hover:bg-earth-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Video Grid */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {filteredVideos.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold text-earth-900 mb-2">
                No videos yet
              </h3>
              <p className="text-earth-600">
                Videos will appear here when blog posts with videos are synced from Notion
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map(video => (
                <div
                  key={video.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-earth-100">
                    {/* Platform Badge */}
                    <div className="absolute top-2 right-2 z-10">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        video.video_type === 'youtube' ? 'bg-red-600 text-white' :
                        video.video_type === 'vimeo' ? 'bg-blue-600 text-white' :
                        video.video_type === 'descript' ? 'bg-purple-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {video.video_type === 'youtube' ? 'YouTube' :
                         video.video_type === 'vimeo' ? 'Vimeo' :
                         video.video_type === 'descript' ? 'Descript' :
                         'Video'}
                      </span>
                    </div>

                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-4xl">🎬</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition flex items-center justify-center">
                      <div className="bg-white bg-opacity-90 rounded-full p-4 opacity-0 hover:opacity-100 transition">
                        <svg className="w-8 h-8 text-ochre-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-earth-900 mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-sm text-earth-600 line-clamp-2 mb-3">
                        {video.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {video.tags?.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-ochre-100 text-ochre-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div
              className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Player */}
              <div
                className="aspect-video"
                dangerouslySetInnerHTML={{ __html: selectedVideo.embed_code }}
              />

              {/* Video Info */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-earth-900 mb-2">
                  {selectedVideo.title}
                </h2>
                {selectedVideo.description && (
                  <p className="text-earth-600 mb-4">
                    {selectedVideo.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedVideo.tags?.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-ochre-100 text-ochre-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-earth-500">
                  Published {new Date(selectedVideo.published_at).toLocaleDateString()}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-earth-100 transition"
              >
                <svg className="w-6 h-6 text-earth-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
