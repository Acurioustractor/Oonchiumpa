import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Section } from '../components/Section';
import { blogService } from '../services/blogAPI';
import { Loading } from '../components/Loading';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  type: 'community-story' | 'cultural-insight' | 'youth-work' | 'historical-truth' | 'transformation';
  isAIGenerated: boolean;
  images: {
    hero: string;
    gallery: string[];
  };
  stats: {
    views: number;
    likes: number;
    shares: number;
  };
  culturalSensitivity: 'low' | 'medium' | 'high';
  elderApproved?: boolean;
}

interface RelatedPost {
  id: string;
  title: string;
  excerpt: string;
  type: string;
  readTime: number;
  image: string;
}

const BlogPostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBlogPost = async () => {
      if (!id) {
        navigate('/blog');
        return;
      }

      try {
        setIsLoading(true);
        const blogPost = await blogService.getBlogPost(id);

        // Transform to match the component's interface
        const transformedPost: BlogPost = {
          id: blogPost.id,
          title: blogPost.title,
          excerpt: blogPost.excerpt,
          content: blogPost.content,
          author: blogPost.author,
          authorRole: blogPost.curatedBy || 'Oonchiumpa Editorial Team',
          publishedAt: blogPost.publishedAt,
          readTime: blogPost.readTime,
          tags: blogPost.tags,
          type: blogPost.type,
          isAIGenerated: false,
          images: {
            hero: blogPost.heroImage || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            gallery: blogPost.gallery || []
          },
          stats: {
            views: 0, // TODO: Implement view tracking
            likes: 0,
            shares: 0
          },
          culturalSensitivity: 'high',
          elderApproved: blogPost.elder_approved
        };

        setPost(transformedPost);

        // Load related stories from the gallery field (which now contains story IDs)
        if (blogPost.gallery && blogPost.gallery.length > 0) {
          // Import supabase client
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(
            import.meta.env.VITE_SUPABASE_URL,
            import.meta.env.VITE_SUPABASE_ANON_KEY
          );

          const { data: stories } = await supabase
            .from('stories')
            .select('id, title, summary, story_image_url, themes')
            .in('id', blogPost.gallery)
            .limit(3);

          if (stories && stories.length > 0) {
            const related = stories.map(story => ({
              id: story.id,
              title: story.title,
              excerpt: story.summary || '',
              type: 'story',
              readTime: 5, // Default read time for stories
              image: story.story_image_url || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
            }));
            setRelatedPosts(related);
          } else {
            setRelatedPosts([]);
          }
        } else {
          setRelatedPosts([]);
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
        navigate('/blog');
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogPost();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ochre-600 mx-auto mb-4"></div>
          <p className="text-earth-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-earth-900 mb-4">Story Not Found</h1>
          <Button onClick={() => navigate('/blog')}>Return to Blog</Button>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
      'community-story': 'eucalyptus',
      'cultural-insight': 'earth',
      'youth-work': 'sand',
      'historical-truth': 'sunset',
      'transformation': 'ochre'
    };
    return colorMap[type] || 'ochre';
  };

  const typeColor = getTypeColor(post.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-sand-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={post.images.hero} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900/70 to-transparent"></div>
        
        {/* Back Button */}
        <div className="absolute top-8 left-8 z-10">
          <Button
            variant="secondary"
            onClick={() => navigate('/blog')}
            className="bg-white/90 backdrop-blur-sm border-white text-earth-900 hover:bg-white"
          >
            ← Back to Blog
          </Button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 bg-${typeColor}-500 text-white rounded-full text-sm font-medium capitalize`}>
                {post.type.replace('-', ' ')}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            
            <p className="text-xl text-white/90 mb-6 max-w-3xl">
              {post.excerpt}
            </p>
            
            <div className="flex items-center space-x-6 text-white/80">
              <div className="flex items-center space-x-2">
                <span>📝</span>
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📅</span>
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⏱️</span>
                <span>{post.readTime} min read</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>👁️</span>
                <span>{post.stats.views.toLocaleString()} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* Article Body */}
          <div className="prose prose-lg max-w-none mb-12">
            <div
              className="text-earth-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: (() => {
                  let html = post.content;

                  // Convert markdown images
                  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="w-full rounded-lg shadow-lg my-8" />');

                  // Convert headings
                  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-bold text-earth-900 mt-8 mb-4">$1</h1>');
                  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-bold text-earth-900 mt-8 mb-4">$1</h2>');
                  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-xl font-semibold text-earth-800 mt-6 mb-3">$1</h3>');

                  // Convert bullet lists
                  html = html.replace(/((?:^- .*$\n?)+)/gm, (match) => {
                    const items = match.trim().split('\n').map(line =>
                      line.replace(/^- (.*)$/, '<li class="mb-2">$1</li>')
                    ).join('');
                    return `<ul class="list-disc ml-6 my-4">${items}</ul>`;
                  });

                  // Convert bold text
                  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-earth-900">$1</strong>');

                  // Convert paragraphs (only plain text lines, not HTML)
                  html = html.replace(/^(?!<|$)(.+)$/gm, '<p class="mb-4">$1</p>');

                  return html;
                })()
              }}
            />
          </div>

          {/* Image Gallery */}
          {post.images.gallery.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-earth-900 mb-6">Related Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {post.images.gallery.map((image, index) => (
                  <Card key={index} className="overflow-hidden">
                    <img 
                      src={image} 
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-earth-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className={`px-3 py-1 bg-${typeColor}-100 text-${typeColor}-800 rounded-full text-sm`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Engagement Stats */}
          <Card className="p-6 mb-12 bg-gradient-to-r from-ochre-50 to-eucalyptus-50">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-earth-900 mb-4">Community Engagement</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold text-ochre-600">{post.stats.views.toLocaleString()}</div>
                  <div className="text-earth-600">Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-eucalyptus-600">{post.stats.likes}</div>
                  <div className="text-earth-600">Likes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-earth-600">{post.stats.shares}</div>
                  <div className="text-earth-600">Shares</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* Related Posts */}
      <Section className="bg-earth-50 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-earth-900 mb-8 text-center">
            Related Stories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Card
                key={relatedPost.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => navigate(`/stories/${relatedPost.id}`)}
              >
                <img 
                  src={relatedPost.image} 
                  alt={relatedPost.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-earth-100 text-earth-800 rounded-full text-xs font-medium capitalize mb-3">
                    {relatedPost.type.replace('-', ' ')}
                  </span>
                  <h3 className="text-lg font-bold text-earth-900 mb-2 line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-earth-700 text-sm mb-4 line-clamp-3">
                    {relatedPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-earth-600">
                    <span>{relatedPost.readTime} min read</span>
                    <span className="text-ochre-600 font-medium">Read more →</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default BlogPostDetailPage;