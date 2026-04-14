import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loading } from '../components/Loading';
import { useApi } from '../hooks/useApi';
import { storiesAPI } from '../services/api';
import { useStoryDetail } from '../hooks/useEmpathyLedger';
import { applyPageMeta } from '../utils/seo';

interface NormalizedStory {
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string | null;
  themes: string[];
  location: string;
  storytellerName: string | null;
  storytellerAvatar: string | null;
  publishedAt: string | null;
  mediaUrls: string[];
  videoLink: string | null;
}

const toEmbedUrl = (url: string) => {
  if (!url) return url;

  if (url.includes('youtube.com/watch?v=')) {
    return url.replace('watch?v=', 'embed/');
  }

  if (url.includes('youtu.be/')) {
    return url.replace('youtu.be/', 'youtube.com/embed/');
  }

  if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com/video/')) {
    const parts = url.split('/').filter(Boolean);
    const id = parts[parts.length - 1];
    return id ? `https://player.vimeo.com/video/${id}` : url;
  }

  return url;
};

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

export const EnhancedStoryDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const storyId = id || '';

  const { story: elStory, loading: elLoading } = useStoryDetail(storyId || null);
  const shouldLoadLegacy =
    Boolean(storyId) && isUuid(storyId) && !elLoading && !elStory;
  const { data: legacyStory, loading: legacyLoading } = useApi(
    () => (shouldLoadLegacy ? storiesAPI.getById(storyId) : Promise.resolve(null)),
    [storyId, shouldLoadLegacy],
  );

  const isLoading = elLoading || (shouldLoadLegacy && legacyLoading);

  const story: NormalizedStory | null = React.useMemo(
    () =>
      elStory
        ? {
            title: elStory.title,
            content: elStory.content || '',
            excerpt: elStory.excerpt || '',
            imageUrl: elStory.imageUrl,
            themes: elStory.themes?.filter(Boolean) || [],
            location: elStory.location || '',
            storytellerName: elStory.storyteller?.displayName || null,
            storytellerAvatar: elStory.storyteller?.avatarUrl || null,
            publishedAt: elStory.publishedAt,
            mediaUrls: elStory.mediaUrls || [],
            videoLink: elStory.videoLink || null,
          }
        : legacyStory
        ? {
            title: legacyStory.title,
            content: legacyStory.content || '',
            excerpt: legacyStory.summary || '',
            imageUrl: legacyStory.imageUrl,
            themes: legacyStory.themes || [],
            location: legacyStory.media_metadata?.location || '',
            storytellerName: null,
            storytellerAvatar: null,
            publishedAt: legacyStory.published_at,
            mediaUrls: legacyStory.media_urls || [],
            videoLink: null,
          }
        : null,
    [elStory, legacyStory],
  );

  const formatDate = (d?: string | null) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  React.useEffect(() => {
    if (!story) return;

    const canonicalUrl = window.location.href.split('#')[0];
    const fallbackImage = '/images/model/community-on-country.jpg';
    const selectedImage = story.imageUrl || story.mediaUrls[0] || fallbackImage;
    const structuredImage = selectedImage.startsWith('http')
      ? selectedImage
      : `${window.location.origin}${selectedImage.startsWith('/') ? selectedImage : `/${selectedImage}`}`;
    const trimmedExcerpt = story.excerpt?.trim();
    const contentSnippet = story.content
      ?.replace(/\s+/g, ' ')
      .trim()
      .slice(0, 180);
    const description =
      trimmedExcerpt && trimmedExcerpt.length > 0
        ? trimmedExcerpt
        : contentSnippet || 'Community story from Oonchiumpa.';
    applyPageMeta({
      title: story.title,
      description,
      image: selectedImage,
      canonicalUrl,
      ogType: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: story.title,
        description,
        image: [structuredImage],
        ...(story.publishedAt ? { datePublished: story.publishedAt } : {}),
        author: {
          '@type': 'Organization',
          name: 'Oonchiumpa',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Oonchiumpa',
        },
      },
    });
  }, [story]);

  if (isLoading) return <Loading />;

  if (!story) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
        <div className="section-shell max-w-2xl text-center p-10">
          <h1 className="text-3xl font-display text-earth-950 mb-4">Story not found</h1>
          <p className="text-earth-600 mb-8">
            This story may have moved or is not available yet.
          </p>
          <Link to="/stories" className="btn-primary">
            Back to stories
          </Link>
        </div>
      </div>
    );
  }

  const paragraphs = story.content
    ? story.content.split('\n\n').map((block) => block.trim()).filter(Boolean)
    : [];

  const embedVideoUrl = story.videoLink ? toEmbedUrl(story.videoLink) : null;

  return (
    <div className="min-h-screen bg-white">
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        {story.imageUrl ? (
          <img src={story.imageUrl} alt={story.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-earth-300 via-earth-200 to-sand-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950/85 via-earth-950/50 to-transparent" />

        <div className="relative z-10 container-custom pt-28 pb-14">
          <Link
            to="/stories"
            className="inline-flex items-center text-white/90 hover:text-white text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All stories
          </Link>

          <h1 className="heading-lg text-white max-w-4xl mb-5">{story.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            {story.storytellerName && <span>{story.storytellerName}</span>}
            {story.publishedAt && <span>{formatDate(story.publishedAt)}</span>}
            {story.location && <span>{story.location}</span>}
          </div>
        </div>
      </section>

      <section className="py-14 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">
          <article className="lg:col-span-8 space-y-8">
            {story.excerpt && (
              <div className="section-shell p-7 md:p-8">
                <p className="text-xl leading-relaxed text-earth-700 font-medium">{story.excerpt}</p>
              </div>
            )}

            <div className="section-shell p-7 md:p-8">
              <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-earth-950 prose-p:text-earth-700 prose-p:leading-relaxed">
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h2 key={index}>
                          {paragraph.replace(/^##\s*/, '')}
                        </h2>
                      );
                    }

                    if (paragraph.startsWith('# ')) {
                      return (
                        <h2 key={index}>
                          {paragraph.replace(/^#\s*/, '')}
                        </h2>
                      );
                    }

                    return <p key={index}>{paragraph}</p>;
                  })
                ) : (
                  <p>{story.excerpt || 'Story content will be published soon.'}</p>
                )}
              </div>
            </div>

            {embedVideoUrl && (
              <div className="section-shell p-6 md:p-7">
                <h2 className="text-2xl font-display text-earth-950 mb-4">Watch this story</h2>
                <div className="relative w-full rounded-xl overflow-hidden bg-earth-100" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={embedVideoUrl}
                    title={`Video for ${story.title}`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {story.mediaUrls.length > 0 && (
              <div className="section-shell p-6 md:p-7">
                <h2 className="text-2xl font-display text-earth-950 mb-4">Photo gallery</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {story.mediaUrls.map((url, index) => (
                    <div key={index} className="rounded-xl overflow-hidden bg-earth-100">
                      <img
                        src={url}
                        alt={`${story.title} photo ${index + 1}`}
                        className="w-full h-56 md:h-64 object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {story.themes.length > 0 && (
              <div className="section-shell p-6 md:p-7">
                <h2 className="text-lg font-display text-earth-950 mb-3">Themes</h2>
                <div className="flex flex-wrap gap-2">
                  {story.themes.map((theme, index) => (
                    <span key={index} className="px-3 py-1.5 text-xs text-earth-700 bg-earth-100 rounded-lg border border-earth-200">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          <aside className="lg:col-span-4 space-y-5">
            <div className="section-shell p-6 sticky top-24">
              <h3 className="text-xl font-display text-earth-950 mb-4">Story details</h3>

              {(story.storytellerName || story.storytellerAvatar) && (
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-earth-100">
                  {story.storytellerAvatar ? (
                    <img
                      src={story.storytellerAvatar}
                      alt={story.storytellerName || 'Storyteller'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-ochre-100 flex items-center justify-center">
                      <span className="text-ochre-700 font-semibold">
                        {(story.storytellerName || 'OC').charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-earth-950 font-medium text-sm">{story.storytellerName || 'Community storyteller'}</p>
                    <p className="text-earth-500 text-xs">Oonchiumpa story archive</p>
                  </div>
                </div>
              )}

              <ul className="space-y-3 text-sm text-earth-700 mb-6">
                {story.publishedAt && (
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-ochre-500" />
                    <span>Published {formatDate(story.publishedAt)}</span>
                  </li>
                )}
                {story.location && (
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-eucalyptus-600" />
                    <span>{story.location}</span>
                  </li>
                )}
                {story.mediaUrls.length > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-earth-500" />
                    <span>{story.mediaUrls.length} photos attached</span>
                  </li>
                )}
                {embedVideoUrl && (
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-sunset-500" />
                    <span>Includes video</span>
                  </li>
                )}
              </ul>

              <div className="space-y-2">
                <button onClick={() => navigate('/services')} className="btn-primary w-full">
                  Explore services
                </button>
                <button onClick={() => navigate('/videos')} className="btn-secondary w-full">
                  Watch more videos
                </button>
                <button onClick={() => navigate('/contact')} className="btn-secondary w-full">
                  Contact Oonchiumpa
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-sand-50 py-14 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display text-earth-950 mb-4">Keep exploring community stories</h2>
          <p className="text-earth-600 leading-relaxed mb-8">
            Read more lived experiences from families, young people, and service partners across Arrernte Country.
          </p>
          <Link to="/stories" className="btn-primary">
            Back to all stories
          </Link>
        </div>
      </section>
    </div>
  );
};

export default EnhancedStoryDetailPage;
