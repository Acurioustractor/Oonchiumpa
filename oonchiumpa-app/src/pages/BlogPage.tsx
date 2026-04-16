import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useArticles } from '../hooks/useEmpathyLedger';
import { EditableImage } from '../components/EditableImage';
import { HeroVideo } from '../components/HeroVideo';
import { applyPageMeta } from '../utils/seo';

const formatDate = (iso?: string | null) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { articles, loading } = useArticles(18);

  React.useEffect(() => {
    const canonicalUrl = window.location.href.split('#')[0];
    applyPageMeta({
      title: 'Blog',
      description:
        'Field stories, analysis, and community-led insights from Oonchiumpa.',
      image: '/images/stories/IMG_9713.jpg',
      canonicalUrl,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Oonchiumpa Blog',
        url: canonicalUrl,
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        <HeroVideo
          src="/videos/hero/youth-drone.mp4"
          poster="/videos/hero/youth-drone.jpg"
          alt="Young people operating a drone on Country"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950/85 via-earth-950/50 to-transparent" />

        <div className="relative z-10 container-custom pt-28 pb-14">
          <p className="eyebrow text-ochre-200 mb-4">From the field</p>
          <h1 className="heading-lg text-white mb-5 max-w-4xl">Blog & Articles</h1>
          <p className="text-white/85 text-lg max-w-3xl leading-relaxed">
            Field stories, analysis, and community-led insights — told with
            storyteller identity, photo evidence, and linked video context.
          </p>
        </div>
      </section>

      <section className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center text-earth-500 py-16">Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className="section-shell p-10 text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-display text-earth-950 mb-3">No articles yet</h2>
              <p className="text-earth-600 mb-6">
                Check back soon for the latest stories from the community.
              </p>
              <button onClick={() => navigate('/stories')} className="btn-secondary">
                Browse stories
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8 text-sm text-earth-500">
                {articles.length} article{articles.length !== 1 ? 's' : ''} available
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <article key={article.id} className="section-shell p-0 overflow-hidden group">
                    {article.featuredImageUrl ? (
                      <img
                        src={article.featuredImageUrl}
                        alt={article.featuredImageAlt || article.title}
                        className="w-full h-52 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-52 bg-earth-100 flex items-center justify-center text-earth-400 font-display text-4xl">
                        {article.title.charAt(0)}
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-ochre-700">
                          {article.articleType || 'Article'}
                        </p>
                        {article.media.photoCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-earth-100 text-earth-700 border border-earth-200">
                            {article.media.photoCount} photo{article.media.photoCount === 1 ? '' : 's'}
                          </span>
                        )}
                        {article.media.videoCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-earth-100 text-earth-700 border border-earth-200">
                            {article.media.videoCount} video{article.media.videoCount === 1 ? '' : 's'}
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-display text-earth-950 mb-3 leading-snug">
                        {article.title}
                      </h2>
                      {article.excerpt && (
                        <p className="text-earth-700 text-base leading-relaxed mb-5 line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between gap-3 text-xs text-earth-500 mb-4">
                        <div className="flex items-center gap-2 min-w-0">
                          {article.storyteller?.avatarUrl ? (
                            <img
                              src={article.storyteller.avatarUrl}
                              alt={article.storyteller.displayName}
                              className="w-6 h-6 rounded-full object-cover border border-earth-200"
                              loading="lazy"
                            />
                          ) : null}
                          <span className="truncate">{article.authorName}</span>
                        </div>
                        <span className="shrink-0">{formatDate(article.publishedAt)}</span>
                      </div>
                      {(article.themes.length > 0 || article.tags.length > 0) && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {article.themes.slice(0, 2).map((theme) => (
                            <span
                              key={`theme-${article.id}-${theme}`}
                              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-ochre-50 text-ochre-800 border border-ochre-200"
                            >
                              {theme}
                            </span>
                          ))}
                          {article.tags.slice(0, 2).map((tag) => (
                            <span
                              key={`tag-${article.id}-${tag}`}
                              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-earth-50 text-earth-700 border border-earth-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <Link
                        to={`/blog/${article.slug || article.id}`}
                        className="inline-flex items-center text-ochre-700 font-medium hover:text-ochre-800 transition-colors"
                      >
                        Read article
                        <span className="ml-2">→</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
