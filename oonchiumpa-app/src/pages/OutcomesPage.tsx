import React, { useState, useMemo } from 'react';
import { Section } from '../components/Section';
import { Card, CardBody, CardHeader } from '../components/Card';
import { Loading } from '../components/Loading';
import { useApi } from '../hooks/useApi';
import { outcomesAPI } from '../services/api';

export const OutcomesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: outcomes, loading, error } = useApi(
    () => outcomesAPI.getAll(),
    []
  );

  const categories = useMemo(() => {
    if (!outcomes) return [];
    const cats = outcomes.map(outcome => outcome.category).filter(Boolean);
    return ['all', ...Array.from(new Set(cats))];
  }, [outcomes]);

  const filteredOutcomes = useMemo(() => {
    if (!outcomes) return [];
    
    return outcomes.filter(outcome => {
      return selectedCategory === 'all' || outcome.category === selectedCategory;
    });
  }, [outcomes, selectedCategory]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long'
    });
  };

  const formatNumber = (num?: number) => {
    if (!num) return '';
    return num.toLocaleString();
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <Section>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-earth-900 mb-4">Unable to load outcomes</h2>
          <p className="text-earth-600">Please try again later.</p>
        </div>
      </Section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-eucalyptus-50 via-sand-50 to-ochre-50 pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-earth-900 mb-6">
            Our <span className="text-gradient">Impact</span>
          </h1>
          <p className="text-lg md:text-xl text-earth-700 mb-8">
            Measuring the meaningful change we create together through cultural connection and community engagement
          </p>
          
          {/* Filter */}
          <div className="flex justify-center">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-6 py-3 rounded-full border border-earth-200 focus:border-ochre-500 focus:ring-2 focus:ring-ochre-200 outline-none transition-all"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Impact Areas' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      {/* Impact Stats Overview */}
      <Section>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-ochre-600 mb-2">
              {filteredOutcomes.length}
            </div>
            <div className="text-earth-700 font-medium">Total Outcomes</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-eucalyptus-600 mb-2">
              {formatNumber(filteredOutcomes.reduce((sum, outcome) => sum + (outcome.beneficiaries || 0), 0))}
            </div>
            <div className="text-earth-700 font-medium">Lives Impacted</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-sunset-600 mb-2">
              {categories.length - 1}
            </div>
            <div className="text-earth-700 font-medium">Impact Areas</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-sand-700 mb-2">
              {new Set(filteredOutcomes.map(o => o.location).filter(Boolean)).size}
            </div>
            <div className="text-earth-700 font-medium">Locations</div>
          </div>
        </div>
      </Section>

      {/* Outcomes Grid */}
      <Section className="pt-0">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOutcomes.map(outcome => (
            <Card key={outcome.id} className="h-full">
              {outcome.imageUrl && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={outcome.imageUrl}
                    alt={outcome.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {outcome.category && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-eucalyptus-700 bg-eucalyptus-100 rounded-full mb-3">
                        {outcome.category}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold text-earth-900">
                      {outcome.title}
                    </h3>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="flex flex-col h-full">
                <div className="flex-1 space-y-4">
                  <p className="text-earth-600">
                    {outcome.description}
                  </p>
                  
                  <div className="p-4 bg-ochre-50 rounded-xl">
                    <h4 className="font-semibold text-earth-900 mb-2">Impact Achieved</h4>
                    <p className="text-earth-700 text-sm">
                      {outcome.impact}
                    </p>
                  </div>

                  {outcome.metrics && outcome.metrics.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-earth-900 mb-3">Key Metrics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {outcome.metrics.map((metric, index) => (
                          <div key={index} className="text-center p-3 bg-eucalyptus-50 rounded-lg">
                            <div className="text-2xl font-bold text-eucalyptus-600">
                              {metric.value}
                            </div>
                            <div className="text-xs text-earth-600">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-earth-100 text-sm text-earth-500 space-y-1">
                  {outcome.location && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {outcome.location}
                    </div>
                  )}
                  {outcome.beneficiaries && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {formatNumber(outcome.beneficiaries)} people impacted
                    </div>
                  )}
                  {outcome.date && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(outcome.date)}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
};