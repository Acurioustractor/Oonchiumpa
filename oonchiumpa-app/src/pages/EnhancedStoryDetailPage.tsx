import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Section } from '../components/Section';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { useApi } from '../hooks/useApi';
import { storiesAPI } from '../services/api';

export const EnhancedStoryDetailPage: React.FC = () => {
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
          <Link to="/stories">
            <Button variant="primary">Back to Stories</Button>
          </Link>
        </div>
      </Section>
    );
  }

  // Extract metadata
  const metadata = story.media_metadata || {};
  const imageCount = metadata.image_count || 0;
  const participants = metadata.participants || [];
  const location = metadata.location || '';
  const datePeriod = metadata.date_period || '';
  const impactHighlights = metadata.impact_highlights || [];

  // Parse content into sections (paragraphs and headings)
  const contentSections = story.content?.split('\n\n') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sand-50/30 to-ochre-50/20">
      {/* Hero Section with Breadcrumb */}
      <Section className="pt-24 pb-8">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/stories"
            className="inline-flex items-center text-ochre-600 hover:text-ochre-700 font-medium mb-6 transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Stories
          </Link>

          {/* Story Type Badge */}
          {story.story_type && (
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-ochre-500 to-ochre-600 rounded-full shadow-sm">
                {story.story_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-earth-900 mb-6 leading-tight">
            {story.title}
          </h1>

          {/* Summary */}
          {story.summary && (
            <p className="text-xl md:text-2xl text-earth-700 font-medium mb-8 leading-relaxed max-w-4xl">
              {story.summary}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-earth-600 text-sm border-b border-earth-200 pb-6">
            {datePeriod && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-ochre-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{datePeriod}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-ochre-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{location}</span>
              </div>
            )}
            {imageCount > 0 && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-ochre-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{imageCount} {imageCount === 1 ? 'photo' : 'photos'}</span>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Main Content Area */}
      <Section className="py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Story Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-8">

              {/* Story Content with elegant typography */}
              <Card className="p-8 md:p-12 shadow-sm">
                <div className="prose prose-lg max-w-none">
                  {contentSections.map((section, index) => {
                    // Check if section is a heading
                    if (section.startsWith('##')) {
                      const headingText = section.replace(/^##\s*/, '');
                      return (
                        <h2 key={index} className="text-2xl md:text-3xl font-bold text-earth-900 mt-8 mb-4 first:mt-0">
                          {headingText}
                        </h2>
                      );
                    }
                    // Regular paragraph
                    return (
                      <p key={index} className="text-earth-700 leading-relaxed mb-6 text-lg">
                        {section}
                      </p>
                    );
                  })}
                </div>
              </Card>

              {/* Hero Image */}
              {story.imageUrl && (
                <Card className="overflow-hidden">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full aspect-video object-cover rounded-xl"
                  />
                </Card>
              )}

              {/* Image Gallery */}
              {story.media_urls && story.media_urls.length > 0 && (
                <Card className="p-6 bg-gradient-to-br from-sand-50 to-ochre-50/50">
                  <h3 className="text-2xl font-bold text-earth-900 mb-6 flex items-center gap-3">
                    <svg className="w-7 h-7 text-ochre-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Photo Gallery ({story.media_urls.length} photos)
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {story.media_urls.map((url, index) => (
                      <div key={index} className="group relative aspect-square overflow-hidden rounded-xl bg-earth-100 cursor-pointer">
                        <img
                          src={url}
                          alt={`${story.title} - Photo ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-earth-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <span className="text-white text-sm font-medium">Photo {index + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Cultural Themes */}
              {story.cultural_themes && story.cultural_themes.length > 0 && (
                <Card className="p-8 bg-gradient-to-r from-eucalyptus-50 to-earth-50 border border-eucalyptus-100">
                  <h3 className="text-xl font-bold text-earth-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🪃</span>
                    Cultural Elements
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {story.cultural_themes.map((theme, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 text-sm font-medium text-eucalyptus-800 bg-eucalyptus-100 rounded-full border border-eucalyptus-200"
                      >
                        {theme.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="lg:col-span-1 space-y-6">

              {/* Impact Highlights */}
              {impactHighlights.length > 0 && (
                <Card className="p-6 bg-gradient-to-br from-ochre-50 to-sunset-50 border border-ochre-200 sticky top-24">
                  <h3 className="text-lg font-bold text-earth-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    Impact Highlights
                  </h3>
                  <ul className="space-y-3">
                    {impactHighlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3 text-earth-700">
                        <svg className="w-5 h-5 text-ochre-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Participants */}
              {participants.length > 0 && (
                <Card className="p-6 bg-sand-50 border border-sand-200">
                  <h3 className="text-lg font-bold text-earth-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">👥</span>
                    Participants
                  </h3>
                  <div className="space-y-2">
                    {participants.map((participant, index) => (
                      <div key={index} className="flex items-center gap-2 text-earth-700">
                        <div className="w-2 h-2 bg-ochre-400 rounded-full"></div>
                        <span className="text-sm">{participant}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Themes */}
              {story.themes && story.themes.length > 0 && (
                <Card className="p-6 bg-white border border-earth-100">
                  <h3 className="text-lg font-bold text-earth-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🏷️</span>
                    Themes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {story.themes.map((theme, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 text-xs font-medium text-earth-700 bg-earth-100 rounded-full hover:bg-earth-200 transition-colors"
                      >
                        {theme.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              {/* Share */}
              <Card className="p-6 bg-white border border-earth-100">
                <h3 className="text-lg font-bold text-earth-900 mb-4">Share this story</h3>
                <div className="flex gap-3">
                  <button className="flex-1 p-3 bg-earth-100 hover:bg-earth-200 rounded-lg transition-colors flex items-center justify-center gap-2 text-earth-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </button>
                  <button className="flex-1 p-3 bg-earth-100 hover:bg-earth-200 rounded-lg transition-colors flex items-center justify-center gap-2 text-earth-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* Bottom Navigation */}
      <Section className="py-12 bg-earth-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link to="/stories">
            <Button variant="secondary" size="lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              View All Stories
            </Button>
          </Link>
          <div className="text-earth-600 text-sm">
            {story.story_type?.replace(/_/g, ' ')}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default EnhancedStoryDetailPage;
