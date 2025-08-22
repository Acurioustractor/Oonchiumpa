import { useState } from 'react';

interface TeamMemberProps {
  name: string;
  role: string;
  quote: string;
  context: string;
  avatar?: string;
  specialties?: string[];
}

const TeamMember = ({ name, role, quote, context, specialties = [] }: TeamMemberProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-white/90 backdrop-blur rounded-lg p-6 border border-earth-200 hover:border-ochre-300 transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="w-16 h-16 bg-gradient-to-br from-ochre-400 to-ochre-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-earth-800 mb-1">{name}</h3>
          <p className="text-ochre-600 font-semibold mb-3">{role}</p>
          
          {/* Quote */}
          <blockquote className="text-earth-700 italic mb-3 border-l-4 border-ochre-400 pl-4">
            "{quote}"
          </blockquote>
          
          {/* Context */}
          <p className="text-earth-600 text-sm mb-3">{context}</p>
          
          {/* Specialties */}
          {specialties.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {specialties.map((specialty, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-eucalyptus-100 text-eucalyptus-800 rounded-full text-xs font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          )}
          
          {/* Expand indicator */}
          <div className="text-ochre-500 text-sm font-medium flex items-center">
            {isExpanded ? '↑ Less' : '↓ More about their work'}
          </div>
        </div>
      </div>
      
      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-earth-200 animate-fadeIn">
          <div className="bg-ochre-50 rounded-lg p-4">
            <h4 className="font-semibold text-earth-800 mb-2">Impact in Action:</h4>
            <p className="text-earth-700 text-sm leading-relaxed">
              This quote reflects the day-to-day reality of community-led youth engagement. 
              Our team's dedication to being present, available, and responsive to young people's 
              needs is what drives our exceptional engagement rates and positive outcomes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const TeamProfiles = () => {
  const teamMembers = [
    {
      name: "Kristy Bloofield",
      role: "Director & Cultural Leader",
      quote: "Oonchiumpa has consistently met or exceeded targets in deliverables and young people's engagement",
      context: "Leading strategic direction while maintaining deep community connections and Elder consultation processes.",
      specialties: ["Cultural Leadership", "Elder Engagement", "Strategic Planning", "Community Relations"]
    },
    {
      name: "Megan",
      role: "Youth Engagement Officer",
      quote: "We're always on the go. We go to one place with one client then go to another and spend hours with them",
      context: "Providing direct support and mentoring to young people across multiple locations and language groups.",
      specialties: ["Direct Youth Support", "Mentoring", "School Advocacy", "Cultural Mentoring"]
    },
    {
      name: "Our Cultural Team",
      role: "100% Aboriginal Staff",
      quote: "Communities don't need saving. They need their solutions valued, documented, and funded",
      context: "11 staff members providing culturally-informed support across 7 language groups with deep community connections.",
      specialties: ["Cultural Competency", "Multi-lingual Support", "Community Advocacy", "Traditional Knowledge"]
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-eucalyptus-50 to-sand-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-earth-800 mb-4">
            Voices from the Community
          </h2>
          <p className="text-lg text-earth-600 max-w-3xl mx-auto">
            Our team's words, captured from real conversations and reports, 
            show the authentic commitment behind our exceptional outcomes.
          </p>
        </div>

        <div className="space-y-8 mb-12">
          {teamMembers.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </div>

        {/* Community Connection Highlight */}
        <div className="bg-earth-800 rounded-xl p-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Connected to Country, Connected to Community
            </h3>
            <p className="text-ochre-200 text-lg leading-relaxed">
              Our staff are not just employees - they are family, community members, and cultural leaders. 
              This deep connection is why we achieve 87-95% engagement rates where other services struggle.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamProfiles;