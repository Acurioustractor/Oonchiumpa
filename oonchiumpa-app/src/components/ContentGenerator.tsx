import React, { useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Loading } from './Loading';
import LiveContentPreview from './LiveContentPreview';
import ImageUpload from './ImageUpload';

interface ContentType {
  id: string;
  name: string;
  description: string;
  icon: string;
  example: string;
}

interface GeneratedContent {
  title: string;
  excerpt: string;
  content: string;
  type: string;
  timestamp: string;
}

const ContentGenerator: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [currentDemo, setCurrentDemo] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const contentTypes: ContentType[] = [
    {
      id: 'team-profile',
      name: 'Team Profile',
      description: 'Generate authentic team member profiles from interview transcripts',
      icon: '👥',
      example: 'Create compelling profiles showcasing cultural authority and professional expertise'
    },
    {
      id: 'blog-post',
      name: 'Blog Post',
      description: 'Transform daily work insights into engaging blog content',
      icon: '📝',
      example: 'Share frontline experiences and community wisdom through accessible storytelling'
    },
    {
      id: 'historical-piece',
      name: 'Historical Education',
      description: 'Create truth-telling content about historical context and present impacts',
      icon: '📜',
      example: 'Connect historical events to current realities with empathy and respect'
    },
    {
      id: 'transformation-story',
      name: 'Transformation Story',
      description: 'Showcase community-led success stories and breakthrough moments',
      icon: '🌟',
      example: 'Highlight the power of culturally-led, community-controlled approaches'
    }
  ];

  const handleGenerateDemo = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:3001/api/content-generator/demo');
      const data = await response.json();
      
      if (data.success) {
        setCurrentDemo(data.samples);
        // Add to generated content list
        const newContent: GeneratedContent = {
          title: 'AI Content Demo Generated',
          excerpt: 'Demo content showcasing multi-format generation capabilities',
          content: JSON.stringify(data.samples, null, 2),
          type: 'demo',
          timestamp: new Date().toISOString()
        };
        setGeneratedContent(prev => [newContent, ...prev]);
      }
    } catch (error) {
      console.error('Demo generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateContent = async (type: string) => {
    setIsGenerating(true);
    setSelectedType(type);
    
    try {
      const documentsPath = '/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs/Interviews';
      let endpoint = '';
      let payload = {};

      switch (type) {
        case 'team-profile':
          endpoint = 'team-profile';
          payload = {
            memberName: 'Kristy Bloomfield',
            interviewFiles: [`${documentsPath}/Kristy1.md`]
          };
          break;
        case 'blog-post':
          endpoint = 'blog-post';
          payload = {
            theme: 'Daily Realities of Youth Work in Central Australia',
            recentDocuments: [`${documentsPath}/Kristy1.md`]
          };
          break;
        case 'historical-piece':
          endpoint = 'historical-piece';
          payload = {
            topic: 'Understanding the Intervention Impact',
            sourceDocuments: [`${documentsPath}/Intervention.md`]
          };
          break;
        case 'transformation-story':
          endpoint = 'transformation-story';
          payload = {
            focusArea: 'Cultural Identity and Youth Development',
            sourceDocuments: [`${documentsPath}/Kristy1.md`]
          };
          break;
      }

      const response = await fetch(`http://localhost:3001/api/content-generator/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        const content = data.profile || data.blogPost || data.content || data.story;
        const newContent: GeneratedContent = {
          title: content.title,
          excerpt: content.excerpt,
          content: content.content,
          type: type,
          timestamp: new Date().toISOString()
        };
        setGeneratedContent(prev => [newContent, ...prev]);
      }
    } catch (error) {
      console.error('Content generation error:', error);
    } finally {
      setIsGenerating(false);
      setSelectedType('');
    }
  };

  const handleBuildLibrary = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:3001/api/content-generator/build-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const newContent: GeneratedContent = {
          title: 'Complete Content Library Generated',
          excerpt: `Generated ${data.library.totalContent} pieces: ${data.library.teamProfiles} profiles, ${data.library.blogPosts} posts, ${data.library.caseStudies} case studies, ${data.library.historicalPieces} historical pieces`,
          content: `📚 CONTENT LIBRARY BUILT!\n\n${Object.entries(data.samples).map(([key, value]) => `${key}: ${value}`).join('\n')}`,
          type: 'library',
          timestamp: new Date().toISOString()
        };
        setGeneratedContent(prev => [newContent, ...prev]);
      }
    } catch (error) {
      console.error('Library generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-earth-900 mb-6">
          📝 Staff Content Management System
        </h1>
        <p className="text-xl text-earth-700 max-w-4xl mx-auto mb-8">
          Professional content creation tools for Oonchiumpa staff. 
          Transform community conversations into compelling stories, profiles, and educational content.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleGenerateDemo}
            disabled={isGenerating}
          >
            {isGenerating ? <Loading /> : '🚀'} Create Content Showcase
          </Button>
          
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={handleBuildLibrary}
            disabled={isGenerating}
          >
            {isGenerating ? <Loading /> : '📚'} Build Content Library
          </Button>
          
          <Button 
            variant="ghost" 
            size="lg" 
            onClick={() => setShowImageUpload(!showImageUpload)}
          >
            {showImageUpload ? '📝' : '📸'} {showImageUpload ? 'Hide' : 'Manage'} Images
          </Button>
        </div>
      </div>

      {/* Image Upload Section */}
      {showImageUpload && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-earth-800 mb-8 text-center">
            📸 Image Management for Content
          </h2>
          <ImageUpload 
            onImagesUploaded={setUploadedImages}
            maxImages={15}
            maxFileSize={10}
          />
          {uploadedImages.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ {uploadedImages.length} images ready for use in content
              </p>
              <p className="text-green-600 text-sm mt-1">
                These images are now available for content creation and can be included in published stories and articles.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Content Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {contentTypes.map((type) => (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
              selectedType === type.id 
                ? 'border-ochre-500 bg-ochre-50' 
                : 'border-earth-200 hover:border-ochre-300'
            }`}
            onClick={() => handleGenerateContent(type.id)}
          >
            <div className="text-center p-6">
              <div className="text-4xl mb-4">{type.icon}</div>
              <h3 className="text-xl font-bold text-earth-800 mb-2">{type.name}</h3>
              <p className="text-earth-600 text-sm mb-4">{type.description}</p>
              <div className="bg-eucalyptus-50 rounded-lg p-3">
                <p className="text-xs text-eucalyptus-800 italic">
                  {type.example}
                </p>
              </div>
              {isGenerating && selectedType === type.id && (
                <div className="mt-4">
                  <Loading />
                  <p className="text-sm text-ochre-600 mt-2">Generating content...</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Demo Results Display */}
      {currentDemo && (
        <div className="bg-gradient-to-br from-ochre-50 to-eucalyptus-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-earth-800 mb-6 text-center">
            🎯 AI Generation Demo Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(currentDemo).map(([key, value]: [string, any]) => (
              <div key={key} className="bg-white rounded-lg p-6 border border-earth-200">
                <h3 className="font-semibold text-earth-800 mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Title:</strong> {value.title}</p>
                  <p><strong>Excerpt:</strong> {value.excerpt}</p>
                  {value.themes && (
                    <p><strong>Themes:</strong> {value.themes.join(', ') || 'N/A'}</p>
                  )}
                  {value.keywords && (
                    <p><strong>Keywords:</strong> {value.keywords.join(', ') || 'N/A'}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Content History */}
      {generatedContent.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-earth-800 mb-8 text-center">
            📝 Generated Content Library
          </h2>
          <div className="space-y-6">
            {generatedContent.map((content, index) => (
              <Card key={index} className="border border-earth-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-earth-800 mb-2">
                        {content.title}
                      </h3>
                      <span className="inline-block px-3 py-1 bg-ochre-100 text-ochre-800 rounded-full text-xs font-medium capitalize">
                        {content.type.replace('-', ' ')}
                      </span>
                    </div>
                    <span className="text-sm text-earth-500">
                      {new Date(content.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-earth-700 mb-4">{content.excerpt}</p>
                  
                  <details className="bg-sand-50 rounded-lg p-4">
                    <summary className="cursor-pointer font-medium text-earth-800 mb-2">
                      View Full Content
                    </summary>
                    <pre className="text-sm text-earth-700 whitespace-pre-wrap overflow-x-auto">
                      {content.content}
                    </pre>
                  </details>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Live Content Preview */}
      <LiveContentPreview />

      {/* AI System Status */}
      <div className="bg-earth-800 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          📊 Content System Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-earth-700 rounded-lg p-4">
            <div className="text-green-400 text-2xl mb-2">✅</div>
            <div className="text-white font-semibold">System Online</div>
            <div className="text-earth-300 text-sm">Ready for content generation</div>
          </div>
          <div className="bg-earth-700 rounded-lg p-4">
            <div className="text-blue-400 text-2xl mb-2">🔄</div>
            <div className="text-white font-semibold">Content Processing</div>
            <div className="text-earth-300 text-sm">Advanced text analysis tools</div>
          </div>
          <div className="bg-earth-700 rounded-lg p-4">
            <div className="text-purple-400 text-2xl mb-2">🛡️</div>
            <div className="text-white font-semibold">Cultural Protocols</div>
            <div className="text-earth-300 text-sm">Sensitivity analysis enabled</div>
          </div>
        </div>
        <p className="text-ochre-200 text-lg">
          Professional tools to craft authentic community voices into powerful digital stories that honor culture and drive change.
        </p>
      </div>
    </div>
  );
};

export default ContentGenerator;