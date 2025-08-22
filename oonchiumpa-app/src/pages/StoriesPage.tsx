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

export const StoriesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stories' | 'photos' | 'videos'>('stories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
    const cats = stories.map(story => story.category).filter(Boolean);
    return ['all', ...Array.from(new Set(cats))];
  }, [stories]);

  const filteredStories = useMemo(() => {
    if (!stories) return [];
    
    return stories.filter(story => {
      const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          story.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
      
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
              <Card key={story.id} className="h-full">
                {story.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                )}
                <CardBody className="flex flex-col h-full">
                  <div className="flex-1">
                    {story.category && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-ochre-700 bg-ochre-100 rounded-full mb-3">
                        {story.category}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold text-earth-900 mb-2">
                      {story.title}
                    </h3>
                    {story.subtitle && (
                      <p className="text-earth-600 font-medium mb-3">
                        {story.subtitle}
                      </p>
                    )}
                    <p className="text-earth-600 mb-4 line-clamp-3">
                      {story.content.slice(0, 150)}...
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-earth-500">
                      {story.author && <span>By {story.author}</span>}
                      {story.date && <span className="ml-2">• {formatDate(story.date)}</span>}
                    </div>
                    <Link to={`/stories/${story.id}`}>
                      <Button variant="ghost" size="sm">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'photos' && (
          <div>
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
          <div>
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