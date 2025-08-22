import React from 'react';
import { Hero } from '../components/Hero';
import { Section } from '../components/Section';
import { FeatureCard } from '../components/FeatureCard';
import { StorySection } from '../components/StorySection';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import ImpactMetrics from '../components/ImpactMetrics';
import TeamProfiles from '../components/TeamProfiles';
import CaseStudyHighlights from '../components/CaseStudyHighlights';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Hero
        title="Connecting Communities Through Culture"
        subtitle="Welcome to Oonchiumpa"
        description="Bridging ancient wisdom with modern innovation, we create meaningful connections that honor our past while building our future together."
        primaryAction={{
          label: 'Explore Our Work',
          onClick: () => navigate('/stories')
        }}
        secondaryAction={{
          label: 'Learn More',
          onClick: () => navigate('/about')
        }}
      />
      
      <Section pattern>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-earth-900 mb-4">
            Our Core Values
          </h2>
          <p className="text-lg text-earth-700 max-w-2xl mx-auto">
            Guided by traditional principles and modern excellence
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            title="Cultural Heritage"
            description="Preserving and sharing the rich tapestry of Aboriginal culture through authentic storytelling and traditional practices."
            delay={0}
          />
          
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="Community Connection"
            description="Building bridges between communities through meaningful engagement and collaborative partnerships."
            delay={200}
          />
          
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            title="Innovation & Wisdom"
            description="Combining ancestral knowledge with contemporary solutions to create sustainable and impactful outcomes."
            delay={400}
          />
        </div>
      </Section>

      {/* Impact Metrics - Show the powerful data */}
      <ImpactMetrics />
      
      <StorySection
        title="Our Journey Begins"
        subtitle="The Oonchiumpa Story"
        content="Rooted in thousands of years of tradition, our organization emerged from a vision to preserve and share the profound wisdom of Aboriginal culture. We believe in the power of storytelling to heal, educate, and unite communities across all backgrounds. Through authentic cultural experiences and innovative programs, we're creating spaces where ancient knowledge meets modern understanding."
      />

      {/* Team Profiles - Show the authentic voices */}
      <TeamProfiles />

      {/* Case Study Highlights - Show transformation stories */}
      <CaseStudyHighlights />
      
      <Section className="bg-gradient-to-br from-ochre-50 to-eucalyptus-50">
        <div className="text-center">
          <h2 className="text-4xl font-display font-bold text-earth-900 mb-6">
            Join Our Journey
          </h2>
          <p className="text-lg text-earth-700 max-w-2xl mx-auto mb-8">
            Be part of a movement that honors the past, celebrates the present, and shapes the future through cultural connection and understanding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" onClick={() => navigate('/contact')}>
              Start Your Journey
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/stories')}>
              Learn Our Stories
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
};