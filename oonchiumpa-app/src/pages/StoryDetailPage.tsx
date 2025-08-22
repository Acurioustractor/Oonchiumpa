import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Section } from '../components/Section';
import { Button } from '../components/Button';
import { VideoPlayer } from '../components/VideoPlayer';
import { Loading } from '../components/Loading';
import { useApi } from '../hooks/useApi';
import { storiesAPI } from '../services/api';

export const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: story, loading, error } = useApi(
    () => storiesAPI.getById(id!),
    [id]
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <Loading />;

  if (error || !story) {
    return (
      <Section className="pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-earth-900 mb-4">Story not found</h2>
          <p className="text-earth-600 mb-6">The story you're looking for doesn't exist or has been moved.</p>
          <Link to="/stories">
            <Button variant="primary">Back to Stories</Button>
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-sand-50 via-sand-100 to-ochre-50 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link 
              to="/stories"
              className="inline-flex items-center text-ochre-600 hover:text-ochre-700 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Stories
            </Link>
          </div>
          
          {story.category && (
            <span className="inline-block px-4 py-2 text-sm font-semibold text-ochre-700 bg-ochre-100 rounded-full mb-4">
              {story.category}
            </span>
          )}
          
          <h1 className="text-4xl md:text-5xl font-display font-bold text-earth-900 mb-4">
            {story.title}
          </h1>
          
          {story.subtitle && (
            <h2 className="text-xl md:text-2xl text-earth-700 font-medium mb-6">
              {story.subtitle}
            </h2>
          )}
          
          <div className="flex items-center text-earth-600 text-sm">
            {story.author && <span>By {story.author}</span>}
            {story.date && <span className="ml-3">• {formatDate(story.date)}</span>}
          </div>
        </div>
      </Section>

      {/* Content */}
      <Section>
        <div className="max-w-4xl mx-auto">
          {/* Featured Media */}
          {story.videoUrl && (
            <div className="mb-8">
              <VideoPlayer
                url={story.videoUrl}
                title={story.title}
                poster={story.imageUrl}
                className="aspect-video"
              />
            </div>
          )}
          
          {!story.videoUrl && story.imageUrl && (
            <div className="mb-8">
              <img
                src={story.imageUrl}
                alt={story.title}
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          )}

          {/* Story Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-earth-700 leading-relaxed whitespace-pre-line">
              {story.content}
            </div>
          </div>

          {/* Cultural Significance */}
          {story.culturalSignificance && (
            <div className="mt-12 p-8 bg-ochre-50 rounded-2xl">
              <h3 className="text-2xl font-semibold text-earth-900 mb-4">
                Cultural Significance
              </h3>
              <p className="text-earth-700 leading-relaxed">
                {story.culturalSignificance}
              </p>
            </div>
          )}

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-earth-200">
              <h4 className="text-sm font-semibold text-earth-900 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium text-earth-600 bg-earth-100 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-earth-200">
            <div className="flex justify-between items-center">
              <Link to="/stories">
                <Button variant="secondary">
                  View All Stories
                </Button>
              </Link>
              <div className="flex space-x-4">
                <button className="p-2 text-earth-600 hover:text-ochre-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
                <button className="p-2 text-earth-600 hover:text-ochre-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};