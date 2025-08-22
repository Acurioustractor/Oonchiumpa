import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Section } from '../components/Section';
import { Card, CardBody } from '../components/Card';
import { Button } from '../components/Button';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    service: '',
    message: ''
  });

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      setFormData(prev => ({ ...prev, service: serviceParam }));
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-sand-50 via-sand-100 to-ochre-50 pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-earth-900 mb-6">
            Get In <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-earth-700">
            Ready to begin a meaningful cultural journey? We'd love to hear from you and explore how we can work together.
          </p>
        </div>
      </Section>

      {/* Contact Form and Info */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardBody className="p-8">
              <h2 className="text-2xl font-semibold text-earth-900 mb-6">
                Start a Conversation
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-earth-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:border-ochre-500 focus:ring-2 focus:ring-ochre-200 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-earth-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:border-ochre-500 focus:ring-2 focus:ring-ochre-200 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-earth-700 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:border-ochre-500 focus:ring-2 focus:ring-ochre-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-earth-700 mb-2">
                    Service of Interest
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:border-ochre-500 focus:ring-2 focus:ring-ochre-200 outline-none transition-all"
                  >
                    <option value="">Select a service...</option>
                    <option value="consulting">Cultural Consulting</option>
                    <option value="education">Education Programs</option>
                    <option value="community">Community Engagement</option>
                    <option value="art">Art & Design</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-earth-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:border-ochre-500 focus:ring-2 focus:ring-ochre-200 outline-none transition-all resize-none"
                    placeholder="Tell us about your project, goals, or how we can help..."
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" fullWidth>
                  Send Message
                </Button>
              </form>
            </CardBody>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardBody className="p-8">
                <h3 className="text-xl font-semibold text-earth-900 mb-6">
                  Other Ways to Connect
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-ochre-100 flex items-center justify-center text-ochre-600 flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-earth-900">Email</h4>
                      <p className="text-earth-600">hello@oonchiumpa.org</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-eucalyptus-100 flex items-center justify-center text-eucalyptus-600 flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-earth-900">Phone</h4>
                      <p className="text-earth-600">+61 (02) 1234 5678</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-sunset-100 flex items-center justify-center text-sunset-600 flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-earth-900">Location</h4>
                      <p className="text-earth-600">Sydney, Australia</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-8">
                <h3 className="text-xl font-semibold text-earth-900 mb-4">
                  Cultural Protocols
                </h3>
                <p className="text-earth-600 leading-relaxed">
                  We work in partnership with Aboriginal communities and follow traditional protocols. 
                  All cultural work is guided by Elders and done with respect for Country and community.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
};