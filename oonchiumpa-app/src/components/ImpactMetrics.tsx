import { useEffect, useState } from 'react';

interface MetricProps {
  value: string;
  label: string;
  description: string;
  highlight?: boolean;
}

const AnimatedMetric = ({ value, label, description, highlight = false }: MetricProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`
        p-6 rounded-lg transition-all duration-700 transform
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        ${highlight 
          ? 'bg-gradient-to-br from-ochre-400 to-ochre-600 text-white' 
          : 'bg-white/90 backdrop-blur border border-earth-200'
        }
        hover:scale-105 hover:shadow-lg
      `}
    >
      <div className={`text-3xl md:text-4xl font-bold mb-2 ${highlight ? 'text-white' : 'text-earth-800'}`}>
        {value}
      </div>
      <div className={`text-sm font-semibold mb-1 ${highlight ? 'text-ochre-100' : 'text-earth-600'}`}>
        {label}
      </div>
      <div className={`text-xs leading-relaxed ${highlight ? 'text-ochre-100' : 'text-earth-500'}`}>
        {description}
      </div>
    </div>
  );
};

const ImpactMetrics = () => {
  const metrics = [
    {
      value: "97.6%",
      label: "More Cost Effective",
      description: "Than incarceration - $91/day vs $3,852/day",
      highlight: true
    },
    {
      value: "57%",
      label: "Client Growth",
      description: "Increased from 19 to 30 clients since Dec 2023"
    },
    {
      value: "87-95%",
      label: "Engagement Rate",
      description: "Exceptional retention with culturally-led support"
    },
    {
      value: "100%",
      label: "Aboriginal Employment",
      description: "Run by Arrernte people for community"
    },
    {
      value: "2,464",
      label: "Meaningful Contacts",
      description: "Individual engagements in 6 months"
    },
    {
      value: "100%",
      label: "Recidivism Reduction",
      description: "Only 1 of 7 previously convicted clients reoffended"
    },
    {
      value: "7",
      label: "Language Groups",
      description: "Arrernte, Warlpiri, Yankunytjatjara, Luritja, Pertame, Pitjantjatjara, Anmatyerr"
    },
    {
      value: "80%",
      label: "Graduated Support",
      description: "No longer require intensive case management"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-sand-50 to-eucalyptus-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-earth-800 mb-4">
            Real Impact, Measured Results
          </h2>
          <p className="text-lg text-earth-600 max-w-3xl mx-auto">
            From our NIAA Performance Report (Jan-June 2025): Evidence-based outcomes 
            that demonstrate the power of culturally-led, community-controlled services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <AnimatedMetric key={index} {...metric} />
          ))}
        </div>

        {/* Powerful Quote Section */}
        <div className="bg-earth-800 rounded-xl p-8 text-center">
          <blockquote className="text-xl md:text-2xl text-white font-medium italic mb-4">
            "Despite a significant increase in young people on the books, 
            Oonchiumpa is still operating with the same funding allocated 
            to operate for and service 18 clients"
          </blockquote>
          <cite className="text-ochre-300 font-semibold">
            — Kristy Bloofield, Director, Oonchiumpa
          </cite>
        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;