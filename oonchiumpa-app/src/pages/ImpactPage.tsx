import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { Section } from '../components/Section';

interface MetricCardProps {
  value: string;
  label: string;
  description: string;
  icon: string;
  highlight?: boolean;
  trend?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  description,
  icon,
  highlight = false,
  trend
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        relative p-8 rounded-2xl transition-all duration-700 transform
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        ${highlight
          ? 'bg-gradient-to-br from-ochre-500 to-ochre-700 text-white shadow-2xl scale-105'
          : 'bg-white/95 backdrop-blur border border-earth-200 shadow-lg'
        }
        hover:scale-110 hover:shadow-2xl group
      `}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <div className={`text-4xl md:text-5xl font-bold mb-3 ${highlight ? 'text-white' : 'text-ochre-600'}`}>
        {value}
      </div>
      <div className={`text-base font-bold mb-2 uppercase tracking-wide ${highlight ? 'text-ochre-100' : 'text-earth-800'}`}>
        {label}
      </div>
      <div className={`text-sm leading-relaxed ${highlight ? 'text-ochre-50' : 'text-earth-600'}`}>
        {description}
      </div>
      {trend && (
        <div className={`mt-3 text-xs font-semibold ${highlight ? 'text-ochre-100' : 'text-eucalyptus-600'}`}>
          {trend}
        </div>
      )}
    </div>
  );
};

interface ImpactAreaProps {
  title: string;
  description: string;
  icon: string;
  stats: Array<{ label: string; value: string }>;
  color: 'ochre' | 'eucalyptus' | 'sunset';
}

const ImpactArea: React.FC<ImpactAreaProps> = ({ title, description, icon, stats, color }) => {
  const colorClasses = {
    ochre: 'bg-ochre-50 border-ochre-200 text-ochre-800',
    eucalyptus: 'bg-eucalyptus-50 border-eucalyptus-200 text-eucalyptus-800',
    sunset: 'bg-orange-50 border-orange-200 text-orange-800'
  };

  const accentClasses = {
    ochre: 'text-ochre-600',
    eucalyptus: 'text-eucalyptus-600',
    sunset: 'text-orange-600'
  };

  return (
    <div className={`p-8 rounded-2xl border-2 ${colorClasses[color]} hover:shadow-xl transition-all duration-300`}>
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 text-earth-900">{title}</h3>
      <p className="text-earth-700 mb-6 leading-relaxed">{description}</p>
      <div className="space-y-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex justify-between items-baseline">
            <span className="text-sm font-medium text-earth-700">{stat.label}</span>
            <span className={`text-2xl font-bold ${accentClasses[color]}`}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  image?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, role, image }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-ochre-500">
      <div className="flex items-start space-x-4 mb-4">
        {image ? (
          <img
            src={image}
            alt={author}
            className="w-16 h-16 rounded-full object-cover border-2 border-ochre-300"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-ochre-100 flex items-center justify-center text-2xl font-bold text-ochre-600">
            {author.charAt(0)}
          </div>
        )}
        <div>
          <div className="font-bold text-earth-900 text-lg">{author}</div>
          <div className="text-sm text-ochre-600 font-medium">{role}</div>
        </div>
      </div>
      <blockquote className="text-earth-700 italic leading-relaxed">
        "{quote}"
      </blockquote>
    </div>
  );
};

const GeographicImpactMap: React.FC = () => {
  const communities = [
    { name: 'Alice Springs', participants: 19, primary: true },
    { name: 'Hermannsburg', language: 'Western Arrernte' },
    { name: 'Santa Teresa', language: 'Eastern Arrernte' },
    { name: 'Papunya', language: 'Luritja' },
    { name: 'Kintore', language: 'Pitjantjatjara' },
    { name: 'Yuendumu', language: 'Warlpiri' },
    { name: 'Yuelamu', language: 'Anmatyerr' }
  ];

  return (
    <div className="bg-gradient-to-br from-earth-50 to-sand-50 rounded-2xl p-8 border border-earth-200">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-earth-900 mb-2">Geographic Reach</h3>
        <p className="text-earth-600">Serving Aboriginal communities across Central Australia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {communities.map((community, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg transition-all duration-300 ${
              community.primary
                ? 'bg-ochre-500 text-white font-bold'
                : 'bg-white border border-earth-200 hover:border-ochre-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className={community.primary ? 'text-lg' : 'text-base font-semibold text-earth-900'}>
                  {community.name}
                </div>
                {community.language && (
                  <div className="text-sm text-earth-600 mt-1">{community.language}</div>
                )}
              </div>
              {community.participants && (
                <div className="text-2xl font-bold">{community.participants}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 text-ochre-600 font-semibold">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
          </svg>
          <span>7 Language Groups Represented</span>
        </div>
      </div>
    </div>
  );
};

const CostEffectivenessChart: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-earth-200">
      <h3 className="text-2xl font-bold text-earth-900 mb-6 text-center">Cost Effectiveness Analysis</h3>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-earth-700">Oonchiumpa Program</span>
            <span className="text-lg font-bold text-eucalyptus-600">$91/day</span>
          </div>
          <div className="relative h-4 bg-earth-100 rounded-full overflow-hidden">
            <div className="absolute h-full bg-gradient-to-r from-eucalyptus-500 to-eucalyptus-600 rounded-full" style={{ width: '2.36%' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-earth-700">Youth Detention</span>
            <span className="text-lg font-bold text-red-600">$3,852/day</span>
          </div>
          <div className="relative h-4 bg-earth-100 rounded-full overflow-hidden">
            <div className="absolute h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-eucalyptus-50 rounded-xl">
        <div className="text-center">
          <div className="text-4xl font-bold text-eucalyptus-700 mb-2">97.6%</div>
          <div className="text-sm font-semibold text-eucalyptus-800">MORE COST EFFECTIVE</div>
          <p className="text-xs text-earth-600 mt-2">
            Investing in community-led prevention saves millions while transforming lives
          </p>
        </div>
      </div>
    </div>
  );
};

const RecidivismComparison: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-ochre-500 to-ochre-700 rounded-2xl p-8 shadow-2xl text-white">
      <h3 className="text-2xl font-bold mb-6 text-center">Breaking the Cycle</h3>

      <div className="grid grid-cols-2 gap-6">
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">20</div>
          <div className="text-sm font-semibold text-ochre-100 uppercase tracking-wide">
            Removed from Op Luna List
          </div>
          <p className="text-xs text-ochre-100 mt-2">Out of 21 referred youth</p>
        </div>

        <div className="text-center">
          <div className="text-6xl font-bold mb-2">1</div>
          <div className="text-sm font-semibold text-ochre-100 uppercase tracking-wide">
            Reoffended
          </div>
          <p className="text-xs text-ochre-100 mt-2">Out of 7 previously convicted</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-ochre-400">
        <div className="text-center">
          <div className="text-sm font-semibold text-ochre-100 mb-2">OUTCOME</div>
          <div className="text-3xl font-bold">95% Success Rate</div>
          <p className="text-sm text-ochre-100 mt-2">
            in diverting youth from justice system involvement
          </p>
        </div>
      </div>
    </div>
  );
};

export const ImpactPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Hero
        title="Our Impact"
        subtitle="Transforming Lives Through Cultural Authority"
        description="Evidence-based outcomes that demonstrate the power of culturally-led, community-controlled services in Central Australia. Every number represents a young life changed, a family strengthened, and a community healed."
        backgroundImage="/images/hero/hero-main.jpg"
        overlayOpacity={55}
        primaryAction={{
          label: "Support Our Work",
          onClick: () => navigate("/contact"),
        }}
        secondaryAction={{
          label: "Read Stories",
          onClick: () => navigate("/stories"),
        }}
      />

      {/* Key Impact Metrics */}
      <Section className="bg-gradient-to-br from-sand-50 to-eucalyptus-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-earth-800 mb-4">
            Real Impact, Measured Results
          </h2>
          <p className="text-lg text-earth-600 max-w-3xl mx-auto">
            From our NIAA Performance Report (Jan-June 2025): Evidence-based outcomes
            that demonstrate what happens when cultural authority leads youth services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <MetricCard
            icon="💰"
            value="97.6%"
            label="More Cost Effective"
            description="Than incarceration - $91/day vs $3,852/day"
            highlight={true}
            trend="↑ Saving millions in justice costs"
          />
          <MetricCard
            icon="📈"
            value="57%"
            label="Client Growth"
            description="Increased from 19 to 30 clients since Dec 2023"
            trend="↑ Growing demand shows effectiveness"
          />
          <MetricCard
            icon="🎯"
            value="87-95%"
            label="Engagement Rate"
            description="Exceptional retention with culturally-led support"
            trend="↑ Highest in the region"
          />
          <MetricCard
            icon="👥"
            value="100%"
            label="Aboriginal Employment"
            description="Run by Arrernte people for community"
          />
          <MetricCard
            icon="🤝"
            value="2,464"
            label="Meaningful Contacts"
            description="Individual engagements in 6 months"
            trend="↑ 410 contacts per month average"
          />
          <MetricCard
            icon="🛡️"
            value="95%"
            label="Diversion Success"
            description="Only 1 of 20 youth remained on Op Luna list"
            highlight={true}
            trend="↑ Breaking the cycle"
          />
          <MetricCard
            icon="🗣️"
            value="7"
            label="Language Groups"
            description="Arrernte, Warlpiri, Yankunytjatjara, Luritja, Pertame, Pitjantjatjara, Anmatyerr"
          />
          <MetricCard
            icon="✨"
            value="80%"
            label="Graduated Support"
            description="No longer require intensive case management"
            trend="↑ Building independence"
          />
        </div>

        {/* Director Quote */}
        <div className="bg-earth-800 rounded-2xl p-10 text-center shadow-2xl">
          <blockquote className="text-2xl md:text-3xl text-white font-medium italic mb-6 leading-relaxed">
            "We're able to lead this youth space because cultural authority guides every decision;
            our young people see their future on Country, not in someone else's program."
          </blockquote>
          <cite className="text-ochre-300 font-semibold text-xl">
            Kristy Bloomfield, Director, Oonchiumpa
          </cite>
        </div>
      </Section>

      {/* Cost Effectiveness Section */}
      <Section pattern>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-earth-900 mb-4">
            Smart Investment in Prevention
          </h2>
          <p className="text-lg text-earth-600 max-w-3xl mx-auto">
            Community-led programs don't just change lives - they save taxpayer money while
            delivering superior outcomes for young people and their families.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CostEffectivenessChart />
          <RecidivismComparison />
        </div>
      </Section>

      {/* Impact Areas */}
      <Section className="bg-gradient-to-br from-eucalyptus-50 to-sand-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-earth-900 mb-4">
            Holistic Impact Across All Areas
          </h2>
          <p className="text-lg text-earth-600 max-w-3xl mx-auto">
            Our culturally-grounded approach addresses every aspect of young people's lives,
            creating sustainable change that ripples through families and communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ImpactArea
            icon="🎓"
            title="Education & Employment"
            description="Breaking barriers to learning and career pathways"
            color="eucalyptus"
            stats={[
              { label: 'Returned to School', value: '72%' },
              { label: 'Starting Education', value: '95%' },
              { label: 'Seeking Work', value: '40%' }
            ]}
          />
          <ImpactArea
            icon="❤️"
            title="Mental Health & Wellbeing"
            description="Cultural healing and emotional resilience"
            color="sunset"
            stats={[
              { label: 'Improved Wellbeing', value: '80%' },
              { label: 'Feeling Happy', value: '4 of 5' },
              { label: 'Feel Understood', value: '75%' }
            ]}
          />
          <ImpactArea
            icon="🏡"
            title="Housing & Stability"
            description="Safe sleeping and stable living conditions"
            color="ochre"
            stats={[
              { label: 'Independent Living', value: '67%' },
              { label: 'Safe Sleeping Access', value: '100%' },
              { label: 'Own Income', value: '67%' }
            ]}
          />
          <ImpactArea
            icon="🌏"
            title="Cultural Connection"
            description="Strengthening identity and community ties"
            color="eucalyptus"
            stats={[
              { label: 'Cultural Activities', value: '100%' },
              { label: 'On Country Trips', value: '40%' },
              { label: 'Cultural Authority', value: '100%' }
            ]}
          />
          <ImpactArea
            icon="👨‍👩‍👧‍👦"
            title="Family & Community"
            description="Healing intergenerational trauma"
            color="sunset"
            stats={[
              { label: 'Family Supports', value: '32 refs' },
              { label: 'Service Connections', value: '71' },
              { label: 'Community Safety', value: '↑95%' }
            ]}
          />
          <ImpactArea
            icon="⚖️"
            title="Justice Diversion"
            description="Breaking the cycle of incarceration"
            color="ochre"
            stats={[
              { label: 'Removed from Op Luna', value: '20/21' },
              { label: 'Prevented Reoffending', value: '6/7' },
              { label: 'Court Support', value: '100%' }
            ]}
          />
        </div>
      </Section>

      {/* Geographic Impact */}
      <Section pattern>
        <GeographicImpactMap />
      </Section>

      {/* Testimonials */}
      <Section className="bg-earth-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-earth-900 mb-4">
            Voices from the Community
          </h2>
          <p className="text-lg text-earth-600 max-w-3xl mx-auto">
            The real measure of our impact is in the words of the young people, families,
            and community members whose lives have been transformed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Testimonial
            quote="I think other kids should work with you mob; I think everyone should work with Oonchiumpa. I like working with you because you mob are good and help, it's good working with you mob."
            author="Young Participant"
            role="Oonchiumpa Client"
          />
          <Testimonial
            quote="You know I try get these kids up for school every day try to wake them up to come with me but nothing they don't get up. You mob come see them they up straight away, it's good they listen get up straight away and get ready."
            author="Family Member"
            role="Responsible Adult"
          />
          <Testimonial
            quote="The girls have a good connection with you and Tamara that's why I want you to come into the classroom with them until they are comfortable. The girls are really comfortable with you and Tamara, and they work well with you, and they listen to you."
            author="St Joseph's School"
            role="Education Partner"
          />
          <Testimonial
            quote="CB understands since becoming a man he has more responsibility and is now becoming more of a role model and leader in the Town Camp. He didn't understand the importance of his cultural role before. He is now able to reflect on his actions in the past and feeling remorse. He knows he can be a leader."
            author="Oonchiumpa Team Leader"
            role="Cultural Mentor"
          />
        </div>
      </Section>

      {/* Success Stories Highlight */}
      <Section className="bg-gradient-to-br from-ochre-50 to-eucalyptus-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-earth-900 mb-4">
            Transformation Stories
          </h2>
          <p className="text-lg text-earth-600 max-w-3xl mx-auto">
            Behind every statistic is a young person finding their way, reconnecting with
            culture, and building a positive future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-xl font-bold text-earth-900 mb-3">MS: From Disconnected to Empowered</h3>
            <p className="text-earth-700 mb-4 leading-relaxed">
              Disengaged from all services with a history of offending, MS had lost connection
              to family, culture, and identity. Through on-country experiences and family
              reconnection, MS now has stable housing, an income, and is developing a cultural
              tourism venture on their country.
            </p>
            <div className="flex items-center text-eucalyptus-600 font-semibold">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>File Closed - No Further Offending</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="text-4xl mb-4">💪</div>
            <h3 className="text-xl font-bold text-earth-900 mb-3">M: Building Independence</h3>
            <p className="text-earth-700 mb-4 leading-relaxed">
              After losing her father, M lived in a town camp with no personal space or
              belongings. Through Oonchiumpa's support, M and her mother now have independent
              accommodation, M has her own income, and is actively seeking employment.
            </p>
            <div className="flex items-center text-eucalyptus-600 font-semibold">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Independent Living Achieved</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-bold text-earth-900 mb-3">J & A: Finding Their Voice</h3>
            <p className="text-earth-700 mb-4 leading-relaxed">
              Previously guarded and lacking engagement, J and A now come to the office
              independently, articulate their needs, and advocate for themselves. Their
              transformation from "grumpy and heavy with worries" to "happy, laughing,
              dancing, and free to be themselves" shows the power of cultural connection.
            </p>
            <div className="flex items-center text-eucalyptus-600 font-semibold">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Confidence & Self-Advocacy Gained</span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/stories')}
            className="btn-primary text-lg px-8 py-4"
          >
            Read More Success Stories
          </button>
        </div>
      </Section>

      {/* Partnership Impact */}
      <Section pattern>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-earth-900 mb-4">
            Collaborative Impact
          </h2>
          <p className="text-lg text-earth-600 max-w-3xl mx-auto">
            Working with 71 service providers to create wraparound support that addresses
            every aspect of young people's needs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl font-bold text-ochre-600 mb-2">71</div>
            <div className="text-sm font-semibold text-earth-700">Service Referrals</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl font-bold text-ochre-600 mb-2">32</div>
            <div className="text-sm font-semibold text-earth-700">Girls Supported</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl font-bold text-ochre-600 mb-2">39</div>
            <div className="text-sm font-semibold text-earth-700">Young Men Supported</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl font-bold text-ochre-600 mb-2">0</div>
            <div className="text-sm font-semibold text-earth-700">Referrals Declined</div>
          </div>
        </div>

        <div className="bg-eucalyptus-50 rounded-2xl p-8 border-2 border-eucalyptus-200">
          <h3 className="text-2xl font-bold text-earth-900 mb-4">Key Partner Organizations</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
            {[
              'Congress', 'Tangentyere', 'NAAJA', 'YORET', 'Saltbush',
              'St Joseph\'s School', 'Yipirinya School', 'Yirara College',
              'Gap Youth Centre', 'Headspace', 'Spirit of the Gumtree',
              'Cruisers Basketball', 'Lhere Artepe', 'Territory Families',
              'NT Youth Justice', 'Akeyulerre Healing', 'Anglicare Housing'
            ].map((partner, idx) => (
              <div key={idx} className="bg-white px-4 py-2 rounded-lg text-center font-medium text-earth-700 border border-eucalyptus-200">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section className="bg-gradient-to-br from-ochre-500 to-ochre-700 text-white">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Be Part of This Transformation
          </h2>
          <p className="text-xl mb-8 text-ochre-50 leading-relaxed">
            Every young person we support represents a life changed, a family strengthened,
            and a community healed. Your support enables us to continue this vital work
            and expand our reach to more young people who need culturally-grounded care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-white text-ochre-700 rounded-full hover:bg-ochre-50 transition-all duration-200 transform hover:scale-105 font-bold text-lg shadow-xl"
            >
              Partner With Us
            </button>
            <button
              onClick={() => navigate('/about')}
              className="px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white/10 transition-all duration-200 font-bold text-lg"
            >
              Learn About Our Approach
            </button>
          </div>
        </div>
      </Section>
    </>
  );
};

export default ImpactPage;
