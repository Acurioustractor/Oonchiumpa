import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface PresentationSection {
  id: string;
  title: string;
  icon: string;
  summary: string;
  keyPoints: string[];
  impact: {
    metric: string;
    value: string;
    context: string;
  }[];
  stories: string[];
}

const PresentationPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const sections: PresentationSection[] = [
    {
      id: 'historical-truth',
      title: 'Historical Truth-Telling & The Intervention Impact',
      icon: '📜',
      summary: 'Understanding the direct connection between 2007 policy decisions and today\'s youth justice crisis',
      keyPoints: [
        'Young people in headlines today are "intervention kids" - children who grew up during 17 years of systematic dismantling',
        'Before 2007: Communities had Aboriginal councils, work programs, self-governance, and cultural leadership',
        'The intervention stripped communities of governance, replacing Aboriginal leadership with white government managers',
        'Predicted consequences (community warnings ignored): theft, dysfunction, loss of role models',
        'Aboriginal men were demonized - the very people who could have been mentors for young people'
      ],
      impact: [
        { metric: 'Timeline', value: '2007-2025', context: '18 years of intervention effects' },
        { metric: 'Current Headlines', value: 'Intervention Kids', context: 'Direct policy causation' },
        { metric: 'Community Warning', value: 'Ignored', context: 'Predicted theft and dysfunction' }
      ],
      stories: [
        'Christie\'s account: "A lot of our aboriginal men, our uncles, our fathers, you know, they were looked upon as pedophiles"',
        'Tanya\'s insight: "Aboriginal people told the government that this is what\'s gonna happen if you do these things"',
        'Community impact: "They had their own rubbish collection... They ran their communities"'
      ]
    },
    {
      id: 'pragmatic-outcomes',
      title: 'Pragmatic Program Outcomes & Cost-Effectiveness',
      icon: '📊',
      summary: 'Exceptional results that demonstrate the power of community-controlled, culturally-led approaches',
      keyPoints: [
        'Oonchiumpa achieves 87-95% engagement rates where other services struggle',
        '97.6% more cost-effective than incarceration ($85,000 vs $3,500 per young person)',
        '57% growth in client numbers while maintaining high engagement',
        'Community-controlled approach restored what the intervention destroyed',
        'Cultural authority translates directly into practical outcomes'
      ],
      impact: [
        { metric: 'Engagement Rate', value: '87-95%', context: 'vs industry standard 30-40%' },
        { metric: 'Cost Effectiveness', value: '97.6%', context: 'More effective than incarceration' },
        { metric: 'Client Growth', value: '57%', context: 'Expanding reach while maintaining quality' },
        { metric: 'Cost Per Person', value: '$3,500', context: 'vs $85,000 incarceration' }
      ],
      stories: [
        'Kristy: "We\'re able to lead this youth space and lead most of our programs and services"',
        'Real accountability: "We\'re in a position to pull \'em up when they are doing naughty things"',
        'Transformation: Young people saying "they wanna be youth workers here with us"'
      ]
    },
    {
      id: 'cultural-authority',
      title: 'Cultural Authority & Community Control',
      icon: '🏛️',
      summary: 'Traditional ownership and cultural authority as the foundation for effective youth justice',
      keyPoints: [
        'Kristy\'s grandfather was stolen generation - intergenerational trauma informs strength',
        'Traditional ownership provides authority that comes from country, not institutions',
        'Cultural connection enables accountability without losing relationship',
        'Elder empowerment: "having that strength and empowerment from our old people"',
        'Community-led approach restores Aboriginal leadership stripped by intervention'
      ],
      impact: [
        { metric: 'Cultural Authority', value: 'Traditional Ownership', context: 'Authority from country itself' },
        { metric: 'Elder Support', value: 'Active', context: 'Empowerment from old people' },
        { metric: 'Accountability', value: 'Cultural', context: 'Can hold young people accountable' }
      ],
      stories: [
        'Kristy: "We know what we want to do to build on our legacy"',
        'Direct engagement: "We go to one place with one client then go to another and spend hours with them"',
        'Cultural strength: "Standing on the traditional lands of her ancestors"'
      ]
    },
    {
      id: 'transformation-stories',
      title: 'Transformation Stories & Future Vision',
      icon: '✨',
      summary: 'Real examples of change and the economic empowerment vision for traditional lands',
      keyPoints: [
        'Jacqueline: From Don Dale to community mentor - "he doesn\'t wanna be caught up in the system"',
        'Young people articulating their own desire for change through rap and verse',
        'From gang member to role model: "The young people... are stating that they wanna be youth workers"',
        'Economic vision: "Why don\'t we then create our own generational wealth"',
        'Partnerships with cattle and mining industries on traditional lands'
      ],
      impact: [
        { metric: 'Individual Transformation', value: 'Jacqueline Story', context: 'Don Dale to mentor' },
        { metric: 'Ripple Effect', value: 'Inspiring Others', context: 'Young people want to follow' },
        { metric: 'Economic Vision', value: 'Generational Wealth', context: 'Traditional lands development' }
      ],
      stories: [
        'Success story: "That\'s now led him to... take a realization of what he needs to do to stay outta trouble"',
        'Community aspiration: "I wanna be like Jack one"',
        'Future vision: "We wanna be able to share that history and showcase the Aboriginal art, the aboriginal photos and history"'
      ]
    }
  ];

  const overviewStats = [
    { label: 'Engagement Rate', value: '87-95%', description: 'vs 30-40% industry standard' },
    { label: 'Cost Effectiveness', value: '97.6%', description: 'More effective than incarceration' },
    { label: 'Client Growth', value: '57%', description: 'Expanding while maintaining quality' },
    { label: 'Years of Impact', value: '18+', description: 'Deep community relationships' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 to-eucalyptus-50">
      {/* Header */}
      <div className="bg-earth-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Oonchiumpa Platform Presentation
            </h1>
            <p className="text-xl text-ochre-200 max-w-4xl mx-auto mb-8">
              Strategic overview for Kristy Bloomfield and Tanya Turner: 
              Demonstrating the power of community-controlled approaches to youth justice
            </p>
            <div className="text-lg text-earth-300">
              Version 1.0 • Prepared for Executive Review • August 2025
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-earth-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveSection('overview')}
              className={`py-4 px-2 whitespace-nowrap border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'overview'
                  ? 'border-ochre-500 text-ochre-600'
                  : 'border-transparent text-earth-500 hover:text-earth-700'
              }`}
            >
              📋 Executive Overview
            </button>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-2 whitespace-nowrap border-b-2 font-medium text-sm transition-colors ${
                  activeSection === section.id
                    ? 'border-ochre-500 text-ochre-600'
                    : 'border-transparent text-earth-500 hover:text-earth-700'
                }`}
              >
                {section.icon} {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeSection === 'overview' && (
          <div className="space-y-12">
            {/* Executive Summary */}
            <Card className="p-8 bg-gradient-to-r from-ochre-50 to-eucalyptus-50">
              <h2 className="text-3xl font-bold text-earth-900 mb-6">Executive Summary</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-earth-800 mb-4">The Opportunity</h3>
                  <p className="text-earth-700 leading-relaxed mb-4">
                    Oonchiumpa represents a paradigm shift in youth justice - from punitive, expensive 
                    approaches to culturally-grounded, cost-effective community healing. Our platform 
                    demonstrates this success at scale.
                  </p>
                  <p className="text-earth-700 leading-relaxed">
                    This digital platform transforms authentic community conversations into powerful 
                    stories that showcase the effectiveness of traditional ownership leadership and 
                    community-controlled approaches.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-earth-800 mb-4">Strategic Impact</h3>
                  <ul className="space-y-2 text-earth-700">
                    <li>• <strong>Truth-telling:</strong> Direct connection between intervention policies and current crisis</li>
                    <li>• <strong>Evidence base:</strong> Exceptional outcomes that speak for themselves</li>
                    <li>• <strong>Cultural authority:</strong> Traditional ownership as foundation for success</li>
                    <li>• <strong>Economic case:</strong> 97.6% more cost-effective than incarceration</li>
                    <li>• <strong>Future vision:</strong> Economic empowerment on traditional lands</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {overviewStats.map((stat, index) => (
                <Card key={index} className="p-6 text-center border-l-4 border-l-ochre-500">
                  <div className="text-3xl font-bold text-ochre-600 mb-2">{stat.value}</div>
                  <div className="font-semibold text-earth-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-earth-600">{stat.description}</div>
                </Card>
              ))}
            </div>

            {/* Strategic Themes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sections.map((section) => (
                <Card key={section.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{section.icon}</span>
                    <h3 className="text-lg font-bold text-earth-900">{section.title}</h3>
                  </div>
                  <p className="text-earth-700 mb-4">{section.summary}</p>
                  <Button 
                    variant="ghost" 
                    onClick={() => setActiveSection(section.id)}
                    className="w-full"
                  >
                    Explore Section →
                  </Button>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <Card className="p-8 bg-earth-800 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Present</h2>
              <p className="text-ochre-200 text-lg mb-6">
                This platform provides compelling evidence of community-controlled success, 
                ready to demonstrate the effectiveness of the Oonchiumpa approach.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="primary">
                  📊 View Impact Metrics
                </Button>
                <Button variant="secondary">
                  📖 Read Community Stories
                </Button>
                <Button variant="ghost">
                  🎯 Strategic Recommendations
                </Button>
              </div>
            </Card>
          </div>
        )}

        {sections.filter(section => section.id === activeSection).map((section) => (
          <div key={section.id} className="space-y-8">
            {/* Section Header */}
            <Card className="p-8 bg-gradient-to-r from-ochre-50 to-eucalyptus-50">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">{section.icon}</span>
                <h2 className="text-3xl font-bold text-earth-900">{section.title}</h2>
              </div>
              <p className="text-xl text-earth-700">{section.summary}</p>
            </Card>

            {/* Key Points */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-earth-900 mb-6">Key Points</h3>
              <div className="space-y-4">
                {section.keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-ochre-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-earth-700 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Impact Metrics */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-earth-900 mb-6">Impact Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {section.impact.map((metric, index) => (
                  <div key={index} className="text-center p-6 bg-earth-50 rounded-lg">
                    <div className="text-2xl font-bold text-earth-800 mb-2">{metric.value}</div>
                    <div className="font-semibold text-earth-900 mb-1">{metric.metric}</div>
                    <div className="text-sm text-earth-600">{metric.context}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Community Voices */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-earth-900 mb-6">Community Voices</h3>
              <div className="space-y-6">
                {section.stories.map((story, index) => (
                  <div key={index} className="border-l-4 border-l-eucalyptus-500 pl-6 py-2 bg-eucalyptus-50 rounded-r-lg">
                    <p className="text-earth-700 italic leading-relaxed">"{story}"</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresentationPage;