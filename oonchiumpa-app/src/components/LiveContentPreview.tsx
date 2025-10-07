import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Loading } from './Loading';

interface ContentPreview {
  id: string;
  title: string;
  excerpt: string;
  type: string;
  generatedAt: string;
  status: 'generating' | 'complete' | 'error';
  source: string;
}

const LiveContentPreview: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentContent, setRecentContent] = useState<ContentPreview[]>([]);
  const [systemStats, setSystemStats] = useState({
    totalGenerated: 147,
    successRate: 94.6,
    avgGenerationTime: 4.2,
    activeProviders: 3
  });

  // Simulate real-time content generation
  const simulateGeneration = () => {
    setIsGenerating(true);
    
    const newContent: ContentPreview = {
      id: Date.now().toString(),
      title: 'Developing Community Content...',
      excerpt: 'Processing community conversation for authentic storytelling...',
      type: 'team-profile',
      generatedAt: new Date().toISOString(),
      status: 'generating',
      source: 'Kristy Bloomfield Interview'
    };

    setRecentContent(prev => [newContent, ...prev.slice(0, 4)]);

    // Simulate generation process
    setTimeout(() => {
      setRecentContent(prev => prev.map(item => 
        item.id === newContent.id 
          ? {
              ...item,
              title: 'Kristy Bloomfield: Cultural Leadership in Action',
              excerpt: 'AI-generated profile showcasing traditional ownership authority and community engagement excellence...',
              status: 'complete' as const
            }
          : item
      ));
      setIsGenerating(false);
      setSystemStats(prev => ({
        ...prev,
        totalGenerated: prev.totalGenerated + 1
      }));
    }, 3000);
  };

  // Load sample recent content
  useEffect(() => {
    const sampleContent: ContentPreview[] = [
      {
        id: '1',
        title: 'The Intervention Impact: Historical Truth-Telling',
        excerpt: 'AI analysis connecting 2007 policy decisions to current youth justice realities...',
        type: 'historical-piece',
        generatedAt: '2025-08-22T18:30:00Z',
        status: 'complete',
        source: 'Intervention Presentation'
      },
      {
        id: '2',
        title: 'Tanya Turner: Legal Excellence Serving Community',
        excerpt: 'Professional journey from Supreme Court to community advocacy...',
        type: 'team-profile',
        generatedAt: '2025-08-22T17:45:00Z',
        status: 'complete',
        source: 'Tanya Interview'
      },
      {
        id: '3',
        title: 'Daily Realities: Frontline Youth Engagement',
        excerpt: 'Insights from achieving 87-95% engagement through cultural connection...',
        type: 'blog-post',
        generatedAt: '2025-08-22T16:20:00Z',
        status: 'complete',
        source: 'Team Conversations'
      }
    ];
    setRecentContent(sampleContent);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generating': return '⏳';
      case 'complete': return '✅';
      case 'error': return '❌';
      default: return '📄';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'team-profile': return '👥';
      case 'blog-post': return '📝';
      case 'historical-piece': return '📜';
      case 'transformation-story': return '✨';
      default: return '📄';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-earth-900 mb-4">
          🔴 Live Content Development
        </h2>
        <p className="text-earth-700 mb-6">
          Watch authentic community stories being crafted in real-time by our editorial team
        </p>
        
        {/* System Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-800">{systemStats.totalGenerated}</div>
            <div className="text-green-600 text-sm">Generated</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-800">{systemStats.successRate}%</div>
            <div className="text-blue-600 text-sm">Success Rate</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-800">{systemStats.avgGenerationTime}s</div>
            <div className="text-purple-600 text-sm">Avg Time</div>
          </div>
          <div className="bg-ochre-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-ochre-800">{systemStats.activeProviders}/5</div>
            <div className="text-ochre-600 text-sm">AI Providers</div>
          </div>
        </div>

        <Button 
          variant="primary" 
          size="lg" 
          onClick={simulateGeneration}
          disabled={isGenerating}
        >
          {isGenerating ? <Loading /> : '🚀'} Develop New Content
        </Button>
      </div>

      {/* Live Content Feed */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-earth-900 mb-4">
          📡 Real-Time Content Development
        </h3>
        
        {recentContent.map((content) => (
          <Card 
            key={content.id} 
            className={`border-l-4 transition-all duration-300 ${
              content.status === 'generating' 
                ? 'border-l-yellow-500 bg-yellow-50 animate-pulse' 
                : content.status === 'complete'
                ? 'border-l-green-500 bg-green-50'
                : 'border-l-red-500 bg-red-50'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getStatusIcon(content.status)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getTypeIcon(content.type)}</span>
                      <span className="font-medium text-earth-800 capitalize">
                        {content.type.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-sm text-earth-600">
                      Source: {content.source}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-earth-500">
                  {new Date(content.generatedAt).toLocaleTimeString()}
                </div>
              </div>

              <h4 className="text-lg font-semibold text-earth-900 mb-2">
                {content.title}
              </h4>
              
              <p className="text-earth-700 text-sm mb-3">
                {content.excerpt}
              </p>

              {content.status === 'generating' && (
                <div className="flex items-center space-x-2 text-sm text-yellow-700">
                  <Loading />
                  <span>Processing with editorial review team...</span>
                </div>
              )}

              {content.status === 'complete' && (
                <div className="flex items-center space-x-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Full Content
                  </button>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    Publish
                  </button>
                  <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                    Cultural Review
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Cultural Protocols Notice */}
      <Card className="mt-8 bg-ochre-50 border border-ochre-200">
        <div className="p-6 text-center">
          <div className="text-3xl mb-4">🛡️</div>
          <h3 className="text-lg font-semibold text-ochre-800 mb-2">
            Cultural Protocols Active
          </h3>
          <p className="text-ochre-700 text-sm">
            All content undergoes cultural sensitivity review and Elder consultation 
            before publication. Community review processes ensure appropriate 
            representation of sacred or sensitive material.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LiveContentPreview;