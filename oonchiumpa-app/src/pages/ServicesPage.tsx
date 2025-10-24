import React, { useState, useEffect } from 'react';
import { Section } from '../components/Section';
import { Card, CardBody, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

interface ServiceData {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  features: string[];
  icon_svg: string | null;
}

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [servicesData, setServicesData] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_visible', true)
      .order('display_order');

    if (error) {
      console.error('Error loading services:', error);
    } else {
      setServicesData(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  const services = servicesData.map(service => ({
    id: service.slug,
    title: service.title,
    description: service.description,
    image: service.image_url,
    features: service.features,
    icon: service.icon_svg ? (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon_svg} />
      </svg>
    ) : null
  }));

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
            <Card key={service.id} className="h-full overflow-hidden group">
              {/* Hero Image */}
              {service.image && (
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-earth-900/60 via-earth-900/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-ochre-600 mb-3 shadow-lg">
                      {service.icon}
                    </div>
                  </div>
                </div>
              )}

              <CardHeader>
                <h3 className="text-2xl font-semibold text-earth-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-earth-600">
                  {service.description}
                </p>
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
                  onClick={() => navigate(`/services/${service.id}`)}
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