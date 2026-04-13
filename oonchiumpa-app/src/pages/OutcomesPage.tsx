import React, { useMemo, useState } from 'react';
import { Section } from '../components/Section';
import { Card, CardBody, CardHeader } from '../components/Card';
import { Loading } from '../components/Loading';
import { EditableImage } from '../components/EditableImage';
import { ServiceProgramsRail } from '../components/ServiceProgramsRail';
import { useApi } from '../hooks/useApi';
import { outcomesAPI, type Outcome } from '../services/api';

export const OutcomesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: outcomes, loading, error } = useApi<Outcome[]>(() => outcomesAPI.getAll(), []);

  const categories = useMemo(() => {
    if (!outcomes) return [];
    const categoryValues = outcomes.map((outcome) => outcome.category).filter(Boolean) as string[];
    return ['all', ...Array.from(new Set(categoryValues))];
  }, [outcomes]);

  const filteredOutcomes = useMemo(() => {
    if (!outcomes) return [];
    return outcomes.filter((outcome) => selectedCategory === 'all' || outcome.category === selectedCategory);
  }, [outcomes, selectedCategory]);

  const totals = useMemo(() => {
    const totalBeneficiaries = filteredOutcomes.reduce((sum, outcome) => sum + (outcome.beneficiaries || 0), 0);
    const locationCount = new Set(filteredOutcomes.map((outcome) => outcome.location).filter(Boolean)).size;
    return {
      totalBeneficiaries,
      locationCount,
      outcomesCount: filteredOutcomes.length,
    };
  }, [filteredOutcomes]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
    });
  };

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <Section>
        <div className="text-center">
          <h2 className="text-2xl font-display text-earth-950 mb-3">Unable to load outcomes</h2>
          <p className="text-earth-600">Please try again shortly.</p>
        </div>
      </Section>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <EditableImage
          slotId="outcomes-hero-background"
          defaultSrc="/images/model/atnarpa-land.jpg"
          defaultAlt="Outcomes and impact on Country"
          className="absolute inset-0 w-full h-full object-cover"
          wrapperClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950/85 via-earth-950/50 to-transparent" />

        <div className="relative z-10 container-custom pt-28 pb-14">
          <p className="eyebrow text-ochre-200 mb-4">Outcomes dashboard</p>
          <h1 className="heading-lg text-white mb-5 max-w-4xl">Measured community outcomes</h1>
          <p className="text-white/85 text-lg max-w-3xl leading-relaxed mb-8">
            Track real-world outcomes by category, location, and beneficiary impact from Oonchiumpa programs.
          </p>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === category
                      ? 'bg-ochre-600 text-white'
                      : 'bg-white/15 border border-white/25 text-white hover:bg-white/25'
                  }`}
                >
                  {category === 'all' ? 'All impact areas' : category}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-earth-950 text-white py-12">
        <div className="container-custom grid grid-cols-2 lg:grid-cols-4 gap-7">
          <div className="text-center lg:text-left">
            <p className="text-3xl md:text-4xl font-display text-ochre-300">{totals.outcomesCount}</p>
            <p className="text-sm md:text-base text-white/85 mt-2">Outcomes tracked</p>
          </div>
          <div className="text-center lg:text-left">
            <p className="text-3xl md:text-4xl font-display text-ochre-300">{formatNumber(totals.totalBeneficiaries)}</p>
            <p className="text-sm md:text-base text-white/85 mt-2">Lives impacted</p>
          </div>
          <div className="text-center lg:text-left">
            <p className="text-3xl md:text-4xl font-display text-ochre-300">{categories.length > 0 ? categories.length - 1 : 0}</p>
            <p className="text-sm md:text-base text-white/85 mt-2">Impact categories</p>
          </div>
          <div className="text-center lg:text-left">
            <p className="text-3xl md:text-4xl font-display text-ochre-300">{totals.locationCount}</p>
            <p className="text-sm md:text-base text-white/85 mt-2">Locations represented</p>
          </div>
        </div>
      </section>

      <Section className="bg-sand-50">
        {filteredOutcomes.length === 0 ? (
          <div className="section-shell p-10 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-display text-earth-950 mb-3">No outcomes found</h2>
            <p className="text-earth-600">Try selecting a different category filter.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOutcomes.map((outcome) => (
              <Card key={outcome.id} className="h-full">
                {outcome.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={outcome.imageUrl}
                      alt={outcome.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )}

                <CardHeader>
                  {outcome.category && (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-eucalyptus-700 bg-eucalyptus-100 rounded-full mb-3">
                      {outcome.category}
                    </span>
                  )}
                  <h3 className="text-xl font-display text-earth-950">{outcome.title}</h3>
                </CardHeader>

                <CardBody className="flex flex-col h-full">
                  <div className="flex-1 space-y-4">
                    <p className="text-earth-700 leading-relaxed">{outcome.description}</p>

                    <div className="p-4 bg-ochre-50 rounded-xl border border-ochre-100">
                      <p className="text-xs uppercase tracking-[0.18em] text-earth-500 mb-2">Impact achieved</p>
                      <p className="text-sm text-earth-800 leading-relaxed">{outcome.impact}</p>
                    </div>

                    {outcome.metrics && outcome.metrics.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-earth-500 mb-3">Key metrics</p>
                        <div className="grid grid-cols-2 gap-3">
                          {outcome.metrics.map((metric) => (
                            <div key={`${outcome.id}-${metric.label}`} className="text-center p-3 bg-eucalyptus-50 rounded-lg border border-eucalyptus-100">
                              <p className="text-xl font-display text-eucalyptus-700">{metric.value}</p>
                              <p className="text-xs text-earth-600 mt-1">{metric.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-5 mt-5 border-t border-earth-100 text-sm text-earth-500 space-y-1.5">
                    {outcome.location && <p>{outcome.location}</p>}
                    {outcome.beneficiaries && <p>{formatNumber(outcome.beneficiaries)} people impacted</p>}
                    {outcome.date && <p>{formatDate(outcome.date)}</p>}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </Section>

      <ServiceProgramsRail
        slotPrefix="outcomes-program"
        eyebrow="Program pathways"
        title="See the services behind these outcomes"
        description="Outcomes data links directly back to service delivery streams designed and led by community."
        className="bg-white"
      />
    </div>
  );
};
