import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Section } from '../components/Section';

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
    // Load blog post data - in real app this would come from API
    const samplePost: BlogPost = {
      id: id || '1',
      title: 'Kristy Bloomfield: Leading with Cultural Authority',
      excerpt: 'From the heartache of stolen generation trauma to the strength of traditional ownership, Kristy\'s story embodies the resilience that drives Oonchiumpa\'s exceptional outcomes.',
      content: `Kristy Bloomfield's voice carries the weight of generations when she speaks about her family's journey. "My grandfather was stolen generation," she explains, her words connecting past trauma to present strength. "He didn't want that same experience for his own children."

This profound understanding of intergenerational impact shapes everything Kristy does as Director of Oonchiumpa. Standing on the traditional lands of her ancestors, she leads with an authority that comes not from institutions, but from country itself.

## Cultural Authority in Action

"We're able to lead this youth space and lead most of our programs and services," Kristy explains, describing how cultural authority translates into practical outcomes. "Having that strength and empowerment from our old people, we know what we want to do to build on our legacy."

The numbers speak volumes: 87-95% engagement rates where other services struggle. But behind every statistic is a story of cultural connection.

### Daily Realities

Kristy's days are filled with the real work of community engagement. "We're always on the go. We go to one place with one client then go to another and spend hours with them," she describes. This isn't just service delivery - it's relationship building grounded in cultural understanding.

When young people act out, Kristy doesn't reward bad behavior like many services do. "We're in a position to pull 'em up when they are doing naughty things," she explains. This ability to hold young people accountable while maintaining connection comes from deep family and cultural relationships.

## Building Economic Empowerment

Looking to the future, Kristy sees economic empowerment on traditional lands. "Why don't we then create our own generational wealth and bring those entities with us," she says, speaking about partnerships with cattle and mining industries.

Her vision extends beyond individual transformation to community healing: "We wanna be able to share that history and showcase the Aboriginal art, the aboriginal photos and history."

### The Loves Creek Vision

At Loves Creek Station, Kristy envisions a multimillion-dollar operation that provides:

- **Training and development programs** for young people on country
- **Employment pathways** in the stock camp and stations across the region  
- **Cultural tourism** sharing both Aboriginal and non-Aboriginal history
- **Generational wealth** building on Aboriginal land

"Communities don't need saving. They need their solutions valued, documented, and funded," reflects the broader team philosophy that drives this vision.

## Leadership Through Connection

This is leadership that honors the past while building the future - exactly what makes Oonchiumpa's approach so powerful. When traditional owners lead with cultural authority, supported by community and family connections, the results speak for themselves.

As Kristy puts it: "Self-determination for us as aboriginal people, as we've, as our old people, have led the way for us."`,
      author: 'Generated from Interview',
      authorRole: 'AI Content Generator',
      publishedAt: '2025-08-22T10:30:00Z',
      readTime: 6,
      tags: ['Leadership', 'Cultural Authority', 'Traditional Ownership', 'Youth Work', 'Economic Development'],
      type: 'community-story',
      isAIGenerated: true,
      images: {
        hero: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1607274018776-c20d3aa9ad59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
      },
      stats: {
        views: 1247,
        likes: 156,
        shares: 23
      },
      culturalSensitivity: 'high',
      elderApproved: true
    };

    const sampleRelated: RelatedPost[] = [
      {
        id: '2',
        title: 'The Intervention Kids: Understanding Today\'s Crisis',
        excerpt: 'AI-generated analysis connecting historical policy to present realities...',
        type: 'historical-truth',
        readTime: 5,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      },
      {
        id: '3',
        title: 'From Don Dale to Mentorship: Jacqueline\'s Journey',
        excerpt: 'A powerful transformation story showing community-led success...',
        type: 'transformation',
        readTime: 4,
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      },
      {
        id: '4',
        title: 'Tanya Turner: Legal Excellence Serving Community',
        excerpt: 'Professional journey from Supreme Court to community advocacy...',
        type: 'community-story',
        readTime: 4,
        image: 'https://images.unsplash.com/photo-1589482125992-8a7ba6dc9e20?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      }
    ];

    setPost(samplePost);
    setRelatedPosts(sampleRelated);
    setIsLoading(false);
  }, [id]);

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
            variant="outline" 
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
              {post.isAIGenerated && (
                <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-medium">
                  🤖 AI-Generated
                </span>
              )}
              {post.elderApproved && (
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                  ✅ Elder Approved
                </span>
              )}
              <span className={`px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium`}>
                🛡️ {post.culturalSensitivity.toUpperCase()} Sensitivity
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
                __html: post.content
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/^/, '<p>')
                  .replace(/$/, '</p>')
                  .replace(/## (.*?)\n/g, '<h2 class="text-2xl font-bold text-earth-900 mt-8 mb-4">$1</h2>')
                  .replace(/### (.*?)\n/g, '<h3 class="text-xl font-semibold text-earth-800 mt-6 mb-3">$1</h3>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-earth-900">$1</strong>')
                  .replace(/- \*\*(.*?)\*\*/g, '<li class="mb-2"><strong class="font-semibold text-earth-900">$1</strong></li>')
                  .replace(/^"(.*?)"$/gm, '<blockquote class="border-l-4 border-ochre-400 pl-6 italic text-earth-700 my-6">$1</blockquote>')
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

          {/* Cultural Protocol Notice */}
          <Card className="p-6 mb-12 bg-ochre-50 border border-ochre-200">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🛡️</div>
              <div>
                <h3 className="text-lg font-semibold text-ochre-800 mb-2">
                  Cultural Protocols Observed
                </h3>
                <p className="text-ochre-700 text-sm mb-4">
                  This content has been generated with respect for Aboriginal cultural protocols 
                  and community voice. All AI-generated content undergoes cultural sensitivity 
                  analysis and community review.
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Community Reviewed</span>
                  </div>
                  {post.elderApproved && (
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Elder Approved</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>AI-Assisted</span>
                  </div>
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
                onClick={() => navigate(`/blog/${relatedPost.id}`)}
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