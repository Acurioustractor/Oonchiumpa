import { useState } from 'react';
import { communityVoices, type CommunityVoice } from '../data/communityVoices';

const VoiceCard = ({
  name,
  role,
  quote,
  context,
  specialties = [],
  avatar,
  source,
  impactStatement,
}: CommunityVoice) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-white/90 backdrop-blur rounded-lg p-6 border border-earth-200 hover:border-ochre-300 transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ochre-400 to-ochre-600 flex items-center justify-center text-white font-bold text-xl">
              {name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
          )}
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

        {source && (
          <p className="text-xs text-earth-500">{source}</p>
        )}
          
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
      {isExpanded && impactStatement && (
        <div className="mt-6 pt-6 border-t border-earth-200 animate-fadeIn">
          <div className="bg-ochre-50 rounded-lg p-4">
            <h4 className="font-semibold text-earth-800 mb-2">Impact in Action:</h4>
            <p className="text-earth-700 text-sm leading-relaxed">
              {impactStatement}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const TeamProfiles = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-eucalyptus-50 to-sand-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-earth-800 mb-4">
            Voices from the Community
          </h2>
          <p className="text-lg text-earth-600 max-w-3xl mx-auto">
            Our community’s words, captured from interviews, workshops, and lived experience, 
            show how Oonchiumpa blends cultural authority with contemporary systems.
          </p>
        </div>

        <div className="space-y-8 mb-12">
          {communityVoices.map((voice, index) => (
            <VoiceCard key={index} {...voice} />
          ))}
        </div>

        {/* Community Connection Highlight */}
        <div className="bg-earth-800 rounded-xl p-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Two Worlds, One Story
            </h3>
            <p className="text-ochre-200 text-lg leading-relaxed">
              Cultural leadership and legal strategy travel together across every program. 
              That is how Oonchiumpa keeps stories sovereign while turning them into evidence, advocacy, and healing-led futures.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamProfiles;
