import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Loading } from '../components/Loading';
import { applyPageMeta } from '../utils/seo';
import { useArticleDetail } from '../hooks/useEmpathyLedger';

const formatDate = (iso?: string | null) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const resolveCtaHref = (value?: string | null) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.includes('{')) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};

const BlogPostDetailPage: React.FC = () => {
  const { id } = useParams();
  const slug = id || null;
  const { article, loading } = useArticleDetail(slug);

  React.useEffect(() => {
    if (!article) return;
    const canonicalUrl = window.location.href.split('#')[0];
    const description =
      article.metaDescription ||
      article.excerpt ||
      'Article syndicated from Empathy Ledger.';
    applyPageMeta({
      title: article.metaTitle || article.title,
      description,
      image: article.featuredImageUrl || '/images/stories/IMG_9713.jpg',
      canonicalUrl,
      ogType: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description,
        author: {
          '@type': 'Person',
          name: article.authorName,
        },
        ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
      },
    });
  }, [article]);

  if (loading) return <Loading />;
  if (!article) {
    return (
      <div className="min-h-screen bg-white px-6 py-20">
        <div className="section-shell max-w-3xl mx-auto text-center p-10">
          <p className="eyebrow mb-3">Blog</p>
          <h1 className="text-4xl font-display text-earth-950 mb-4">Article not found</h1>
          <p className="text-earth-600 mb-8">
            This article may not be published yet or the link is out of date.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/blog" className="btn-primary">
              Back to blog
            </Link>
            <Link to="/stories" className="btn-secondary">
              Browse stories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasHtml = /<[^>]+>/.test(article.content || '');
  const paragraphs = (article.content || '')
    .split('\n\n')
    .map((block) => block.trim())
    .filter(Boolean);
  const photoPreviews = article.media.photoPreviews.filter((item) => Boolean(item.url));
  const videoPreviews = article.media.videoPreviews.filter((item) => Boolean(item.url));
  const ctas = article.ctas
    .map((cta) => ({
      ...cta,
      href: resolveCtaHref(cta.urlTemplate),
    }))
    .filter((cta) => Boolean(cta.href));

  return (
    <div className="min-h-screen bg-white">
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        {article.featuredImageUrl ? (
          <img
            src={article.featuredImageUrl}
            alt={article.featuredImageAlt || article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-earth-300 via-earth-200 to-sand-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950/85 via-earth-950/55 to-transparent" />

        <div className="relative z-10 container-custom pt-28 pb-14">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: article.title },
            ]}
            onDark
            className="mb-6"
          />
          <p className="text-xs uppercase tracking-[0.24em] text-ochre-200 mb-3 font-semibold">
            {article.articleType || 'Article'}
          </p>
          <h1 className="heading-lg text-white max-w-4xl mb-4">{article.title}</h1>
          {article.subtitle && (
            <p className="text-white/85 text-lg max-w-3xl leading-relaxed mb-4">{article.subtitle}</p>
          )}
          <div className="text-white/75 text-sm flex flex-wrap items-center gap-3">
            {article.storyteller?.avatarUrl ? (
              <img
                src={article.storyteller.avatarUrl}
                alt={article.storyteller.displayName}
                className="w-8 h-8 rounded-full object-cover border border-white/30"
              />
            ) : null}
            <span>
              {article.authorName} {article.publishedAt ? `· ${formatDate(article.publishedAt)}` : ''}
            </span>
          </div>
          {(article.storyteller?.bio || article.authorBio) && (
            <p className="text-white/75 text-sm max-w-3xl mt-3 leading-relaxed">
              {article.storyteller?.bio || article.authorBio}
            </p>
          )}
        </div>
      </section>

      <section className="py-14 px-6">
        <article className="max-w-4xl mx-auto section-shell p-7 md:p-10">
          {hasHtml ? (
            <div
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-earth-950 prose-p:text-earth-700 prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content || '' }}
            />
          ) : (
            <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-earth-950 prose-p:text-earth-700 prose-p:leading-relaxed">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
          {article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-earth-100 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs text-earth-700 bg-earth-100 rounded-lg border border-earth-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {article.themes.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {article.themes.map((theme) => (
                <span
                  key={theme}
                  className="px-3 py-1 text-xs text-ochre-800 bg-ochre-50 rounded-lg border border-ochre-200"
                >
                  {theme}
                </span>
              ))}
            </div>
          )}

          {(photoPreviews.length > 0 || videoPreviews.length > 0) && (
            <div className="mt-10 pt-8 border-t border-earth-100 space-y-8">
              <div>
                <p className="eyebrow mb-2">Syndicated media evidence</p>
                <h2 className="text-2xl font-display text-earth-950">
                  Photos and videos linked from Empathy Ledger
                </h2>
              </div>

              {photoPreviews.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-earth-950 mb-4">Photos</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {photoPreviews.map((photo, index) => (
                      <figure key={`photo-${index}`} className="rounded-2xl overflow-hidden border border-earth-200 bg-earth-50">
                        <img
                          src={photo.url || ''}
                          alt={photo.altText || photo.title || `${article.title} photo ${index + 1}`}
                          className="w-full h-56 object-cover"
                          loading="lazy"
                        />
                        {(photo.title || photo.altText) && (
                          <figcaption className="px-4 py-3 text-sm text-earth-700">
                            {photo.title || photo.altText}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                </div>
              )}

              {videoPreviews.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-earth-950 mb-4">Videos</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {videoPreviews.map((video, index) => {
                      const href = video.url || '';
                      const external = /^https?:\/\//i.test(href);
                      return (
                        <article
                          key={`video-${index}`}
                          className="rounded-2xl border border-earth-200 bg-white overflow-hidden"
                        >
                          {video.thumbnailUrl ? (
                            <img
                              src={video.thumbnailUrl}
                              alt={video.title || `Video ${index + 1}`}
                              className="w-full h-44 object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-44 bg-earth-100 flex items-center justify-center text-earth-500 text-sm">
                              Video preview
                            </div>
                          )}
                          <div className="p-4">
                            <p className="text-earth-950 font-medium mb-3">
                              {video.title || `Video reference ${index + 1}`}
                            </p>
                            <a
                              href={href}
                              target={external ? '_blank' : undefined}
                              rel={external ? 'noreferrer' : undefined}
                              className="inline-flex items-center text-ochre-700 font-medium hover:text-ochre-800 transition-colors"
                            >
                              Open video
                              <span className="ml-2">↗</span>
                            </a>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {ctas.length > 0 && (
            <div className="mt-10 pt-8 border-t border-earth-100">
              <h2 className="text-2xl font-display text-earth-950 mb-4">Next step</h2>
              <div className="flex flex-wrap gap-3">
                {ctas.map((cta, index) => {
                  const isExternal = /^https?:\/\//i.test(cta.href || '');
                  return (
                    <a
                      key={`cta-${index}`}
                      href={cta.href || '#'}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noreferrer' : undefined}
                      className="btn-primary"
                    >
                      {cta.buttonText || 'Learn more'}
                    </a>
                  );
                })}
              </div>
              {ctas[0]?.description && (
                <p className="text-sm text-earth-600 mt-4">{ctas[0].description}</p>
              )}
            </div>
          )}
        </article>
      </section>
    </div>
  );
};

export default BlogPostDetailPage;
