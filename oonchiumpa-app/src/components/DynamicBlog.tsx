import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./Card";
import { Button } from "./Button";
import { Loading } from "./Loading";
import { blogService } from "../services/blogAPI";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  type:
    | "community-story"
    | "cultural-insight"
    | "youth-work"
    | "historical-truth"
    | "transformation";
  readTime: number;
  heroImage?: string;
  gallery?: string[];
  curatedBy?: string;
  culturalReview?: string;
}

const DynamicBlog: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: "all", name: "All Stories", icon: "📚", color: "ochre" },
    {
      id: "community-story",
      name: "Community Stories",
      icon: "🏘️",
      color: "eucalyptus",
    },
    {
      id: "cultural-insight",
      name: "Cultural Insights",
      icon: "🪃",
      color: "earth",
    },
    { id: "youth-work", name: "Youth Work", icon: "🌱", color: "sand" },
    {
      id: "historical-truth",
      name: "Historical Truth",
      icon: "📜",
      color: "sunset",
    },
    {
      id: "transformation",
      name: "Transformation",
      icon: "✨",
      color: "ochre",
    },
  ];

  // Load real data from backend API
  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      // Use the real blog service
      const { posts: blogPosts } = await blogService.getBlogPosts({
        limit: 50, // Load up to 50 posts
      });

      setPosts(blogPosts);
    } catch (error) {
      console.error("Error loading blog posts:", error);
      setPosts([]);
    }
  };

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) => post.type === selectedCategory);

  const generateNewContent = async () => {
    setIsLoading(true);
    try {
      // Simulate content generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newPost: BlogPost = {
        id: Date.now().toString(),
        title:
          "Tanya Turner's Legal Journey: From Law School to Community Advocacy",
        excerpt:
          "From UWA law student to Supreme Court associate to community advocate - Tanya's path shows how professional excellence can serve community healing.",
        content:
          "A comprehensive look at Tanya's incredible legal journey and commitment to justice...",
        author: "Tanya Turner",
        publishedAt: new Date().toISOString().split("T")[0],
        tags: ["Legal Advocacy", "Professional Journey", "Community Service"],
        type: "community-story",
        readTime: 3,
        curatedBy: "Oonchiumpa Editorial Team",
        culturalReview: "Elder Approved",
      };

      setPosts((prev) => [newPost, ...prev]);
    } catch (error) {
      console.error("Content generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-earth-900 mb-6">
          📖 Community Stories & Insights
        </h1>
        <p className="text-xl text-earth-700 max-w-4xl mx-auto mb-8">
          Authentic voices from Central Australia, sharing community wisdom,
          cultural knowledge, and the truth about our work in youth justice and
          healing.
        </p>
      </div>

      {/* Category Filter & Generate Button */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? `bg-${category.color}-500 text-white`
                  : `bg-${category.color}-100 text-${category.color}-800 hover:bg-${category.color}-200`
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          onClick={generateNewContent}
          disabled={isLoading}
        >
          {isLoading ? <Loading /> : "📝"} Publish New Story
        </Button>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
        {filteredPosts.map((post) => (
          <Card
            key={post.id}
            className="border border-earth-200 hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
            onClick={() => navigate(`/blog/${post.id}`)}
          >
            {/* Hero Image */}
            {post.heroImage && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.heroImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Type Badge on Image */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize backdrop-blur-sm ${
                      post.type === "community-story"
                        ? "bg-eucalyptus-500/90 text-white"
                        : post.type === "cultural-insight"
                          ? "bg-earth-500/90 text-white"
                          : post.type === "youth-work"
                            ? "bg-sand-500/90 text-white"
                            : post.type === "historical-truth"
                              ? "bg-sunset-500/90 text-white"
                              : "bg-ochre-500/90 text-white"
                    }`}
                  >
                    {post.type.replace("-", " ")}
                  </span>
                </div>

                {/* Read Time on Image */}
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-black/50 text-white rounded text-xs font-medium backdrop-blur-sm">
                    {post.readTime} min
                  </span>
                </div>
              </div>
            )}

            <div className="p-6">
              {/* Cultural Review Badge */}
              {post.culturalReview && (
                <div className="mb-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    ✓ {post.culturalReview}
                  </span>
                </div>
              )}

              {/* Title */}
              <h3 className="text-lg font-bold text-earth-900 mb-3 line-clamp-2 group-hover:text-ochre-700 transition-colors">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-earth-700 mb-4 line-clamp-3 text-sm leading-relaxed">
                {post.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-earth-100 text-earth-700 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 2 && (
                  <span className="text-xs text-earth-500">
                    +{post.tags.length - 2} more
                  </span>
                )}
              </div>

              {/* Photo Gallery Indicator */}
              {post.gallery && post.gallery.length > 0 && (
                <div className="flex items-center text-xs text-earth-500 mb-4">
                  <span className="mr-2">📸</span>
                  <span>{post.gallery.length} photos</span>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-earth-500 pt-4 border-t border-earth-100">
                <span>By {post.author}</span>
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>

              {/* Read More Indicator */}
              <div className="mt-3 text-center">
                <span className="text-ochre-600 hover:text-ochre-700 font-medium text-sm group-hover:underline">
                  Read Full Story →
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Editorial Team Info */}
      <div className="bg-gradient-to-r from-earth-800 to-earth-900 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          📚 Curated by Community Leaders
        </h2>
        <p className="text-ochre-200 text-lg leading-relaxed max-w-4xl mx-auto">
          Every story on this platform is carefully authored and curated by our
          team, with Elder consultation and cultural oversight to ensure
          authentic representation of our community's voice and wisdom.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="text-3xl mb-2">🎤</div>
            <div className="text-white font-semibold">Authentic Voice</div>
            <div className="text-earth-300 text-sm">
              Direct from community conversations
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🛡️</div>
            <div className="text-white font-semibold">Cultural Protocols</div>
            <div className="text-earth-300 text-sm">
              Elder consultation and approval
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">✨</div>
            <div className="text-white font-semibold">Community Authority</div>
            <div className="text-earth-300 text-sm">
              Traditional ownership leadership
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicBlog;
