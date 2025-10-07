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
}

const ContentShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const showcaseItems: ShowcaseItem[] = [
    {
      id: "eee28c15-fba7-4a5c-bd06-290f0df4cb46",
      title: "Returning Home to Atnarpa: The Bloomfield Family's Journey",
      excerpt:
        "The Bloomfield/Wiltshire family shares the historic journey of reclaiming their ancestral land at Atnarpa (Loves Creek Station) - a story of connection to country and cultural restoration...",
      type: "story",
      icon: "🏞️",
      color: "earth",
    },
    {
      id: "bfde4125-ec37-4456-a1c5-b3b61a32eec0",
      title: "Healing Journey to Country: Young Men Find Connection",
      excerpt:
        "Three young Aboriginal men traveled to Atnarpa Station for a healing and connection to country day that transformed their understanding of identity and belonging...",
      type: "story",
      icon: "🌿",
      color: "eucalyptus",
    },
    {
      id: "2c7a2131-c371-4ff5-8d83-b7707f412404",
      title: "Young Women Discover Basketball Community",
      excerpt:
        "A group of young Aboriginal women attended their first basketball game at the local stadium, watching players from their own communities - inspiring dreams and connection...",
      type: "story",
      icon: "🏀",
      color: "ochre",
    },
    {
      id: "e6cade16-1143-4b85-a0b3-08ecb49676cc",
      title: "Cultural Connection at Standley Chasm",
      excerpt:
        "Fred and Tyrone took young men Darius Ross and Jayden White on a cultural journey to Standley Chasm, sharing knowledge and creating lasting connections to country...",
      type: "story",
      icon: "⛰️",
      color: "sand",
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
          📖 Community Stories
        </h2>
        <p className="text-lg text-earth-700 max-w-3xl mx-auto mb-6">
          Real stories from our community - journeys of connection to country, cultural healing, and personal transformation shared with respect and authenticity.
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-earth-600">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-eucalyptus-500 rounded-full"></span>
            <span>On Country Experiences</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-ochre-500 rounded-full"></span>
            <span>Youth Success</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-earth-500 rounded-full"></span>
            <span>Community Connection</span>
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
              onClick={() => navigate(`/stories/${item.id}`)}
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

                {/* Read More Link */}
                <div className="flex items-center justify-end">
                  <div className={`${colors.text} opacity-70 text-sm font-medium hover:opacity-100 transition-opacity`}>
                    Read more →
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button variant="primary" size="lg" onClick={() => navigate("/stories")}>
          📖 Explore All Stories
        </Button>
      </div>

      {/* Community Impact Note */}
      <div className="mt-12 bg-gradient-to-r from-ochre-50 to-eucalyptus-50 rounded-xl p-8 border-2 border-ochre-200">
        <div className="text-center">
          <h3 className="text-xl font-bold text-earth-900 mb-3">
            🛡️ Sharing Stories with Cultural Respect
          </h3>
          <p className="text-earth-700 max-w-2xl mx-auto">
            All stories shared on our platform honor cultural protocols and have been approved for public sharing.
            We celebrate our community's journeys while respecting cultural sensitivity and individual privacy.
          </p>
        </div>
      </div>
    </Section>
  );
};

export default ContentShowcase;
