import { useState } from 'react';

interface CaseStudyProps {
  title: string;
  category: string;
  challenge: string;
  intervention: string;
  outcome: string;
  impact: string;
  icon: string;
  color: 'ochre' | 'eucalyptus' | 'earth';
}

const CaseStudyCard = ({ title, category, challenge, intervention, outcome, impact, icon, color }: CaseStudyProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const colorClasses = {
    ochre: {
      bg: 'bg-ochre-50',
      border: 'border-ochre-200',
      text: 'text-ochre-800',
      accent: 'bg-ochre-500',
      hover: 'hover:border-ochre-400'
    },
    eucalyptus: {
      bg: 'bg-eucalyptus-50', 
      border: 'border-eucalyptus-200',
      text: 'text-eucalyptus-800',
      accent: 'bg-eucalyptus-500',
      hover: 'hover:border-eucalyptus-400'
    },
    earth: {
      bg: 'bg-earth-50',
      border: 'border-earth-200', 
      text: 'text-earth-800',
      accent: 'bg-earth-500',
      hover: 'hover:border-earth-400'
    }
  };

  const classes = colorClasses[color];

  return (
    <div 
      className={`
        ${classes.bg} rounded-xl p-6 border-2 ${classes.border} ${classes.hover}
        transition-all duration-300 cursor-pointer hover:shadow-lg
      `}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="flex items-start space-x-4 mb-6">
        <div className={`w-12 h-12 ${classes.accent} rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className={`text-xs font-semibold ${classes.text} opacity-70 mb-1`}>
            {category}
          </div>
          <h3 className={`text-xl font-bold ${classes.text} mb-2`}>
            {title}
          </h3>
          <p className={`${classes.text} opacity-80 text-sm`}>
            {challenge}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className={`${classes.text} opacity-90 text-sm mb-4`}>
        <strong>Key Outcome:</strong> {outcome}
      </div>

      {/* Expand indicator */}
      <div className={`${classes.text} opacity-70 text-xs font-medium flex items-center`}>
        {isExpanded ? '↑ Show less' : '↓ See full case study'}
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t-2 border-white/50 space-y-4 animate-fadeIn">
          <div>
            <h4 className={`font-semibold ${classes.text} mb-2`}>Our Intervention:</h4>
            <p className={`${classes.text} opacity-80 text-sm leading-relaxed`}>
              {intervention}
            </p>
          </div>
          
          <div>
            <h4 className={`font-semibold ${classes.text} mb-2`}>Lasting Impact:</h4>
            <p className={`${classes.text} opacity-80 text-sm leading-relaxed`}>
              {impact}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const CaseStudyHighlights = () => {
  const caseStudies: CaseStudyProps[] = [
    {
      title: "Educational Continuity Through Crisis",
      category: "Education & Retention",
      challenge: "Three female clients suspended from school after physical altercation, facing complete education disruption.",
      intervention: "Created safe office learning space, mediated with school, coordinated with St Joseph's for continued curriculum, provided daily mentoring and cultural support.",
      outcome: "Maintained educational engagement despite exclusion, with clients demonstrating strong educational goals and increased learning initiative.",
      impact: "Demonstrates how culturally-led, flexible support can maintain education pathways when institutional systems fail. All three clients remained committed to their studies and career aspirations.",
      icon: "📚",
      color: "ochre"
    },
    {
      title: "Cultural Identity & Leadership Development", 
      category: "Mentoring & Cultural Support",
      challenge: "16-year-old client struggling with cultural obligations, peer pressure, and making independent decisions without positive role models.",
      intervention: "Regular one-on-one mentoring with male youth worker and client's father, focusing on cultural identity strengthening, leadership development, and decision-making skills.",
      outcome: "Client developed tools to manage peer pressure, assert cultural leadership, and make decisions aligned with cultural values while maintaining family connections.",
      impact: "Client became a role model for younger family members and engaged actively in cultural activities, demonstrating renewed pride and self-worth through cultural strength.",
      icon: "🌱",
      color: "eucalyptus"
    },
    {
      title: "Trauma-Informed Healthcare Breakthrough",
      category: "Trust Building & Health",
      challenge: "15-year-old female client with rheumatic heart disease had not attended medical appointments or been seen at hospital since 2022 due to trauma and institutional mistrust.",
      intervention: "Three weeks of consistent, patient outreach, trauma-informed advocacy during hospital visits, cultural safety practices, and continuous emotional support throughout medical procedures.",
      outcome: "Client successfully completed essential medical tests and treatment, expressing gratitude and demonstrating significant trust-building breakthrough.",
      impact: "Enabled access to life-saving healthcare for first time in years. Hospital professionals acknowledged Oonchiumpa's success in achieving what other services could not accomplish.",
      icon: "🏥",
      color: "earth"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-white to-sand-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-earth-800 mb-4">
            Stories of Transformation
          </h2>
          <p className="text-lg text-earth-600 max-w-3xl mx-auto">
            Real case studies from our NIAA report showing how culturally-led, 
            trauma-informed approaches create lasting change in young people's lives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {caseStudies.map((study, index) => (
            <CaseStudyCard key={index} {...study} />
          ))}
        </div>

        {/* Walker Inquest Connection */}
        <div className="bg-gradient-to-r from-earth-800 to-earth-900 rounded-xl p-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              A Service That's Needed: The Walker Inquest Connection
            </h3>
            <p className="text-ochre-200 text-lg leading-relaxed mb-6">
              The Kumanjayi Walker Coroner's report called for exactly the kind of culturally-competent, 
              community-controlled services that Oonchiumpa delivers. Our work is a direct response 
              to systemic changes needed for Aboriginal youth justice.
            </p>
            <blockquote className="text-white italic text-xl border-l-4 border-ochre-400 pl-6">
              "Robust and sustained funding for Oonchiumpa is not simply justified but imperative. 
              Investing in services like Oonchiumpa is a direct answer to the call for systemic change."
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyHighlights;