import React from 'react';
import { Section } from '../components/Section';
import { Card, CardBody, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 'consulting',
      title: 'Cultural Consulting',
      description: 'Expert guidance for organizations seeking to respectfully engage with Aboriginal culture and communities.',
      features: [
        'Cultural awareness training',
        'Protocol development',
        'Community engagement strategies',
        'Reconciliation planning'
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'education',
      title: 'Education Programs',
      description: 'Transformative learning experiences that honor Aboriginal knowledge systems and ways of knowing.',
      features: [
        'School curriculum development',
        'Teacher training workshops',
        'Student cultural immersion',
        'Elder-in-residence programs'
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: 'community',
      title: 'Community Engagement',
      description: 'Building lasting relationships through authentic dialogue and collaborative partnerships.',
      features: [
        'Community forums',
        'Stakeholder consultation',
        'Partnership development',
        'Event planning and facilitation'
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      id: 'art',
      title: 'Art & Design',
      description: 'Creating visual narratives that celebrate and preserve Aboriginal artistic traditions.',
      features: [
        'Traditional art workshops',
        'Digital storytelling',
        'Exhibition curation',
        'Artist mentorship programs'
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 21h10a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-eucalyptus-50 via-sand-50 to-ochre-50 pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-earth-900 mb-6">
            Our <span className="text-gradient">Services</span>
          </h1>
          <p className="text-lg md:text-xl text-earth-700 mb-8">
            Comprehensive cultural services designed to build understanding, respect, and meaningful connections between communities
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate('/contact')}>
            Start Your Journey
          </Button>
        </div>
      </Section>

      {/* Services Grid */}
      <Section>
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="h-full">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full bg-ochre-100 flex items-center justify-center text-ochre-600 flex-shrink-0">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-earth-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-earth-600">
                      {service.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardBody>
                <h4 className="font-semibold text-earth-900 mb-4">What's Included:</h4>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-earth-700">
                      <svg className="w-5 h-5 text-eucalyptus-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="secondary" 
                  fullWidth 
                  onClick={() => navigate(`/contact?service=${service.id}`)}
                >
                  Learn More
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      {/* Process Section */}
      <Section className="bg-earth-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-earth-900 mb-4">
            Our Approach
          </h2>
          <p className="text-lg text-earth-700 max-w-2xl mx-auto">
            Every engagement begins with listening, respect, and a commitment to authentic cultural exchange
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'Listen & Learn', description: 'We begin by understanding your needs and cultural context' },
            { step: '02', title: 'Collaborate', description: 'Working together with Elders and community leaders' },
            { step: '03', title: 'Design', description: 'Creating culturally appropriate solutions and experiences' },
            { step: '04', title: 'Deliver', description: 'Implementing with ongoing support and cultural guidance' }
          ].map((process, processIndex) => (
            <div key={processIndex} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ochre-600 text-white flex items-center justify-center text-xl font-bold">
                {process.step}
              </div>
              <h3 className="text-xl font-semibold text-earth-900 mb-2">
                {process.title}
              </h3>
              <p className="text-earth-600">
                {process.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="text-center bg-gradient-to-br from-ochre-50 to-eucalyptus-50 rounded-3xl p-12">
          <h2 className="text-3xl font-display font-bold text-earth-900 mb-4">
            Ready to Begin?
          </h2>
          <p className="text-lg text-earth-700 mb-8 max-w-2xl mx-auto">
            Let's start a conversation about how we can work together to honor Aboriginal culture and build meaningful connections in your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" onClick={() => navigate('/contact')}>
              Get Started
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/stories')}>
              See Our Work
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
};