import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./Card";
import { Button } from "./Button";
import { Section } from "./Section";

interface ShowcaseItem {
  id: string;
  title: string;
  excerpt: string;
  type: "story" | "blog-post" | "team-profile" | "transformation";
  icon: string;
  color: string;
  stats: {
    views: number;
    engagement: number;
  };
}

const ContentShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const showcaseItems: ShowcaseItem[] = [
    {
      id: "1",
      title: "Kristy Bloomfield: Leading with Cultural Authority",
      excerpt:
        "From stolen generation trauma to traditional ownership strength - discover how cultural authority drives exceptional outcomes...",
      type: "team-profile",
      icon: "👑",
      color: "ochre",
      stats: { views: 1247, engagement: 94 },
    },
    {
      id: "2",
      title: "The Intervention Kids: Understanding Today's Crisis",
      excerpt:
        "Community analysis connecting historical policy to present realities, revealing the truth behind youth justice challenges...",
      type: "story",
      icon: "📜",
      color: "earth",
      stats: { views: 2156, engagement: 87 },
    },
    {
      id: "3",
      title: "From Don Dale to Mentorship: Jacqueline's Journey",
      excerpt:
        "A powerful transformation story showing how culturally-connected support creates community leaders...",
      type: "transformation",
      icon: "✨",
      color: "eucalyptus",
      stats: { views: 1834, engagement: 96 },
    },
    {
      id: "4",
      title: "Daily Realities of Youth Work in Central Australia",
      excerpt:
        "Frontline insights from community workers achieving 87-95% engagement rates through cultural connection...",
      type: "blog-post",
      icon: "🌱",
      color: "sand",
      stats: { views: 892, engagement: 91 },
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: {
      [key: string]: {
        bg: string;
        text: string;
        accent: string;
        hover: string;
      };
    } = {
      ochre: {
        bg: "bg-ochre-50",
        text: "text-ochre-800",
        accent: "bg-ochre-500",
        hover: "hover:border-ochre-400",
      },
      earth: {
        bg: "bg-earth-50",
        text: "text-earth-800",
        accent: "bg-earth-500",
        hover: "hover:border-earth-400",
      },
      eucalyptus: {
        bg: "bg-eucalyptus-50",
        text: "text-eucalyptus-800",
        accent: "bg-eucalyptus-500",
        hover: "hover:border-eucalyptus-400",
      },
      sand: {
        bg: "bg-sand-50",
        text: "text-sand-800",
        accent: "bg-sand-500",
        hover: "hover:border-sand-400",
      },
    };
    return colorMap[color] || colorMap.ochre;
  };

  return (
    <Section className="bg-gradient-to-br from-white to-earth-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-display font-bold text-earth-900 mb-4">
          📖 Community Storytelling Platform
        </h2>
        <p className="text-lg text-earth-700 max-w-3xl mx-auto mb-6">
          Our platform transforms authentic community conversations into
          compelling digital stories that honor culture and drive change.
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-earth-600">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Live Content Creation</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Cultural Protocols</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span>Community Voice</span>
          </div>
        </div>
      </div>

      {/* Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {showcaseItems.map((item) => {
          const colors = getColorClasses(item.color);
          return (
            <Card
              key={item.id}
              className={`cursor-pointer transition-all duration-300 transform ${colors.bg} border-2 border-transparent ${colors.hover} ${
                hoveredItem === item.id
                  ? "scale-105 shadow-xl"
                  : "hover:scale-102 hover:shadow-lg"
              }`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => navigate("/blog")}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 ${colors.accent} rounded-lg flex items-center justify-center text-white text-xl`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <span
                        className={`inline-block px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-medium capitalize`}
                      >
                        {item.type.replace("-", " ")}
                      </span>
                      {item.type === "story" && (
                        <span className="ml-2 inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                          📖 Community Story
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3
                  className={`text-xl font-bold ${colors.text} mb-3 line-clamp-2`}
                >
                  {item.title}
                </h3>

                <p className={`${colors.text} opacity-80 mb-4 line-clamp-3`}>
                  {item.excerpt}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className={`${colors.text} opacity-70`}>
                      👁️ {item.stats.views.toLocaleString()} views
                    </div>
                    <div className={`${colors.text} opacity-70`}>
                      ❤️ {item.stats.engagement}% engagement
                    </div>
                  </div>
                  <div className={`${colors.text} opacity-70 text-sm`}>
                    Read more →
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate("/content-generator")}
        >
          🚀 Try Content Generator
        </Button>

        <Button variant="secondary" size="lg" onClick={() => navigate("/blog")}>
          📖 Explore All Stories
        </Button>

        <Button variant="outline" size="lg" onClick={() => navigate("/admin")}>
          🏛️ Admin Dashboard
        </Button>
      </div>

      {/* System Status */}
      <div className="mt-12 bg-gradient-to-r from-earth-800 to-earth-900 rounded-xl p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            📖 Platform Status: LIVE
          </h3>
          <p className="text-ochre-200">
            Real-time content creation for community storytelling
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              ✅
            </div>
            <div className="text-white font-semibold">System Online</div>
            <div className="text-earth-300 text-sm">Ready for generation</div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              🔄
            </div>
            <div className="text-white font-semibold">Content Systems</div>
            <div className="text-earth-300 text-sm">Ready for creation</div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
              🛡️
            </div>
            <div className="text-white font-semibold">Cultural Protocols</div>
            <div className="text-earth-300 text-sm">
              Respectful representation
            </div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-ochre-500 rounded-full flex items-center justify-center mx-auto mb-2">
              📊
            </div>
            <div className="text-white font-semibold">94.6% Success Rate</div>
            <div className="text-earth-300 text-sm">High-quality content</div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ContentShowcase;
