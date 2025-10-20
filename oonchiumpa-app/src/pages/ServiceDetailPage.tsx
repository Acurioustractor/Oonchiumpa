import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Section } from '../components/Section';
import { Button } from '../components/Button';
import { Card, CardBody, CardHeader } from '../components/Card';

interface ServiceData {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  outcomes: string[];
  galleryPhotos?: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  stats?: Array<{
    value: string;
    label: string;
  }>;
  relatedStories?: string[];
}

const servicesData: Record<string, ServiceData> = {
  'youth-mentorship': {
    id: 'youth-mentorship',
    title: 'Youth Mentorship & Cultural Healing',
    description: 'Culturally-led mentorship for at-risk Aboriginal young people, providing connection to culture, education, and pathways to healing.',
    longDescription: `Our youth mentorship program provides intensive, culturally-grounded support for Aboriginal young people aged 11-17 who are at-risk. Led by Aboriginal staff with deep cultural knowledge and community connections, we work with young people referred through Operation Luna and other pathways.

The program is built on the foundation that cultural connection is healing. Our mentors work one-on-one with young people to rebuild their connection to family, country, culture, and identity while supporting them through education, life skills development, and navigating complex service systems.

Led by Kristy Bloomfield and our team of Aboriginal mentors, the program has achieved remarkable outcomes, with 20 out of 21 participants removed from Operation Luna case management and a 95% success rate in school re-engagement.`,
    features: [
      'One-on-one mentorship by Aboriginal staff with cultural authority',
      'School re-engagement support with 95% success rate',
      'Life skills training including budgeting, shopping, and independent living',
      'Connection to family, country, and cultural identity',
      'Mental health and wellbeing support',
      'Housing assistance and pathway to independence',
      'Sports and recreation programs',
      'Cultural healing experiences on country'
    ],
    outcomes: [
      '21 young people served in 2023-24',
      '90% retention rate throughout the program',
      '20 out of 21 youth removed from Operation Luna case management',
      '95% of participants re-engaged with school or alternative education',
      '72% moved from disengaged to engaged/re-engaged status',
      'Youth moved from town camps to independent living with families',
      'Significant improvement in emotional wellbeing and mental health'
    ],
    stats: [
      { value: '90%', label: 'Retention Rate' },
      { value: '21', label: 'Young People Served' },
      { value: '95%', label: 'School Re-engagement' },
      { value: '20/21', label: 'Removed from Operation Luna' }
    ],
    testimonial: {
      quote: "The program provides what young people need most - connection to culture, family, and people who understand them. When young people are connected to their culture and community, healing happens naturally.",
      author: "Kristy Bloomfield",
      role: "Program Director, Eastern Arrernte Traditional Owner"
    }
  },
  'law-students': {
    id: 'law-students',
    title: 'True Justice: Deep Listening on Country',
    description: 'Transformative legal education program where law students learn from Traditional Owners on country, understanding Aboriginal law, justice, and lived experiences beyond what textbooks can teach.',
    longDescription: `Legal Education for True Justice: Indigenous Perspectives and Deep Listening on Country is a semester-long immersive course that redefines what it means to study law in Australia. Originally co-designed by Oonchiumpa Consultancy Services and ANU Law School, this program has been transforming law students since 2022.

The philosophy behind True Justice is simple yet profound: "Law school can only teach you what is written, whereas Aboriginal lore and Aboriginal experiences of law are seen, felt and heard by the people it impacts most. The only true way to understand this is to be with the people and listen deeply to their stories."

At the heart of the course is a week-long immersion on Country in Central Australia, where 16 selected students travel from Mparntwe (Alice Springs) through Arrernte Country to Uluru. Designed and led by Traditional Owners Kristy Bloomfield and Tanya Turner, students engage in deep listening - learning Aboriginal conceptions of law, justice systems, and kinship that exist beyond written texts. This isn't theoretical learning - students are on country, learning from the land and from those who hold cultural authority to speak.`,
    features: [
      'Week-long intensive immersion on Arrernte Country in Central Australia',
      'Deep listening to Traditional Owners and Aboriginal legal perspectives',
      'Journey from Alice Springs through country to Uluru',
      'Aboriginal lore and lived experiences of law and justice',
      'Semester-long course combining on-country experience with ongoing learning',
      'Designed and led by Traditional Owners Kristy Bloomfield and Tanya Turner',
      '16 carefully selected students per cohort',
      'Partnership with ANU Law School since 2022',
      'Integration with Royal Commission insights and UN advocacy work'
    ],
    outcomes: [
      'Transformative shift in understanding Aboriginal legal systems',
      'Students progress to policy, government, and legal roles with First Nations knowledge',
      'Deep cultural competency in working with Aboriginal communities',
      'Alumni network carrying knowledge into professional practice',
      'Recognized as exemplar course transforming legal education in Australia',
      'Influence on next generation of justice reform leaders',
      'Students equipped to work respectfully within Aboriginal justice contexts'
    ],
    stats: [
      { value: '2022', label: 'Established' },
      { value: '16', label: 'Students Per Year' },
      { value: '7 Days', label: 'On Country' },
      { value: '1 Semester', label: 'Full Course' }
    ],
    testimonial: {
      quote: "Law school can only teach you what is written, whereas Aboriginal lore and Aboriginal experiences of law are seen, felt and heard by the people it impacts most. The only true way to understand this is to be with the people and listen deeply to their stories.",
      author: "Kristy Bloomfield & Tanya Turner",
      role: "Traditional Owners, True Justice Program Designers"
    }
  },
  'atnarpa-homestead': {
    id: 'atnarpa-homestead',
    title: 'Atnarpa Homestead On-Country Experiences',
    description: 'Experience Eastern Arrernte country at Loves Creek Station. Accommodation, cultural tourism, and healing programs on Traditional Owner-led country.',
    longDescription: `Atnarpa Homestead at Loves Creek Station is Traditional Eastern Arrernte country, owned and managed by the Bloomfield/Wiltshire family. Located 1.5 hours by 4WD east of Alice Springs, Atnarpa offers a rare opportunity to experience Aboriginal country led by Traditional Owners.

The homestead provides accommodation facilities, camping areas, and most importantly - genuine cultural experiences on country. From bush medicine workshops to storytelling sessions, visitors learn directly from Traditional Owners in the place where this knowledge belongs.

For Aboriginal young people, Atnarpa is a place of healing and cultural reconnection. We've seen profound transformations as young people cook kangaroo tails, learn language, and connect with country in ways that aren't possible in town. Atnarpa also hosts school groups, cultural tourism experiences, and provides a base for on-country programs.`,
    galleryPhotos: [
      'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/stories/eee28c15-fba7-4a5c-bd06-290f0df4cb46/2.jpeg',
      'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/stories/eee28c15-fba7-4a5c-bd06-290f0df4cb46/3.png',
      'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/stories/eee28c15-fba7-4a5c-bd06-290f0df4cb46/4.jpeg',
      'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/stories/eee28c15-fba7-4a5c-bd06-290f0df4cb46/5.jpeg',
      'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/stories/eee28c15-fba7-4a5c-bd06-290f0df4cb46/6.jpeg',
      'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/stories/eee28c15-fba7-4a5c-bd06-290f0df4cb46/7.png',
      'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/stories/eee28c15-fba7-4a5c-bd06-290f0df4cb46/8.jpeg',
      'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/stories/eee28c15-fba7-4a5c-bd06-290f0df4cb46/9.png',
      'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/stories/eee28c15-fba7-4a5c-bd06-290f0df4cb46/10.jpeg',
      'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/stories/eee28c15-fba7-4a5c-bd06-290f0df4cb46/11.jpeg',
      'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/stories/eee28c15-fba7-4a5c-bd06-290f0df4cb46/12.jpeg',
      'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/stories/bfde4125-ec37-4456-a1c5-b3b61a32eec0/2.png',
      'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/stories/bfde4125-ec37-4456-a1c5-b3b61a32eec0/3.png',
    ],
    features: [
      'Traditional Eastern Arrernte country owned by Bloomfield/Wiltshire family',
      '3 accommodation blocks with beds, kitchen, and facilities',
      'Camping facilities for tents, campervans, and caravans',
      'Bush medicine workshops and knowledge sharing',
      'Cultural storytelling and history on country',
      'Traditional food preparation and cultural practices',
      'School group hosting and educational programs',
      'Cultural tourism experiences led by Traditional Owners',
      'Healing and connection programs for Aboriginal young people'
    ],
    outcomes: [
      '29 interstate students hosted for cultural learning',
      'Regular cultural healing programs for at-risk youth',
      'Successful cultural tourism experiences',
      'Safe space for intergenerational knowledge transfer',
      'Documented transformative healing experiences for young people',
      'Ongoing cultural education for diverse visitor groups'
    ],
    stats: [
      { value: '1.5hrs', label: 'From Alice Springs' },
      { value: '3', label: 'Accommodation Blocks' },
      { value: 'Traditional', label: 'Owner-Led Experiences' },
      { value: 'Year-Round', label: 'Availability' }
    ],
    testimonial: {
      quote: "Atnarpa is where young people reconnect with who they are. On country, learning from elders, cooking traditional food - this is where healing happens. The land teaches in ways we never can in town.",
      author: "Kristy Bloomfield",
      role: "Traditional Owner, Eastern Arrernte Country"
    }
  },
  'cultural-brokerage': {
    id: 'cultural-brokerage',
    title: 'Cultural Brokerage & Service Navigation',
    description: 'Connecting Aboriginal young people and families to essential services through trusted partnerships with over 32 community organizations.',
    longDescription: `Cultural brokerage is about trust, relationships, and navigating systems. Aboriginal young people often struggle to access mainstream services due to cultural barriers, mistrust, and complex bureaucratic systems. Our cultural brokerage service bridges this gap.

Working with over 32 partner organizations across Alice Springs, we connect young people and families to health services, education pathways, employment opportunities, housing support, and legal assistance. More importantly, we walk alongside them through these systems, providing cultural interpretation and advocacy.

Our team has deep relationships with service providers built on years of partnership and cultural respect. When we make a referral, services know that we've already done the cultural groundwork, and young people trust us to connect them with services that will respect their cultural identity.`,
    features: [
      'Service coordination with 32+ partner organizations',
      'Health service connections (Congress Health, Headspace, Back on Track)',
      'Education pathway support (Yipirinya School, St Joseph School, Kintore School)',
      'Employment and training referrals (YORET, Tangentyere Employment)',
      'Housing and accommodation assistance (Anglicare)',
      'Legal and justice system navigation (Jesuit Social Services, Salt Bush)',
      'Cultural advocacy and support through service systems',
      'Youth allowance and Centrelink navigation',
      'Birth certificates and ID document assistance'
    ],
    outcomes: [
      '71 service referrals made in 2023-24 reporting period',
      '32 referrals for girls across multiple service types',
      '39 referrals for young men to partner organizations',
      'High success rate in service connection and follow-through',
      'Strong partnerships with health, education, and justice services',
      'Improved service accessibility for Aboriginal young people',
      'Cultural bridge between mainstream services and community'
    ],
    stats: [
      { value: '32+', label: 'Partner Organizations' },
      { value: '71', label: 'Service Referrals (2023-24)' },
      { value: '100%', label: 'Culturally Safe' },
      { value: 'Trusted', label: 'Community Partnerships' }
    ],
    testimonial: {
      quote: "When Oonchiumpa makes a referral, we know it's appropriate, culturally grounded, and that the young person is ready. Their brokerage service makes our work more effective and culturally safe.",
      author: "Partner Service Provider",
      role: "Community Health Service, Alice Springs"
    }
  }
};

export const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const service = serviceId ? servicesData[serviceId] : null;

  if (!service) {
    return (
      <Section className="pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-earth-900 mb-4">Service not found</h2>
          <Link to="/services">
            <Button variant="primary">Back to Services</Button>
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sand-50/30 to-ochre-50/20">
      {/* Hero Section with Breadcrumb */}
      <Section className="pt-24 pb-8">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/services"
            className="inline-flex items-center text-ochre-600 hover:text-ochre-700 font-medium mb-6 transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </Link>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-earth-900 mb-6 leading-tight">
            {service.title}
          </h1>

          {/* Summary */}
          <p className="text-xl md:text-2xl text-earth-700 font-medium mb-8 leading-relaxed max-w-4xl">
            {service.description}
          </p>

          {/* Stats Grid */}
          {service.stats && service.stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {service.stats.map((stat, index) => (
                <Card key={index} className="text-center p-6 bg-gradient-to-br from-ochre-50 to-sunset-50 border-ochre-200">
                  <div className="text-3xl md:text-4xl font-bold text-ochre-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-earth-700 font-medium">
                    {stat.label}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="lg" onClick={() => navigate(`/contact?service=${service.id}`)}>
              Get Started
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/stories')}>
              See Stories
            </Button>
          </div>
        </div>
      </Section>

      {/* Main Content Area */}
      <Section className="py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-8">

              {/* About This Service */}
              <Card className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-earth-900 mb-6">About This Service</h2>
                <div className="prose prose-lg max-w-none">
                  {service.longDescription.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-earth-700 leading-relaxed mb-6">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Card>

              {/* Photo Gallery Placeholder - We'll populate this from the database */}
              {service.galleryPhotos && service.galleryPhotos.length > 0 && (
                <Card className="p-6 bg-gradient-to-br from-sand-50 to-ochre-50/50">
                  <h3 className="text-2xl font-bold text-earth-900 mb-6 flex items-center gap-3">
                    <svg className="w-7 h-7 text-ochre-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Photo Gallery
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {service.galleryPhotos.map((url, index) => (
                      <div key={index} className="group relative aspect-square overflow-hidden rounded-xl bg-earth-100 cursor-pointer">
                        <img
                          src={url}
                          alt={`${service.title} - Photo ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-earth-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <span className="text-white text-sm font-medium">Photo {index + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Testimonial */}
              {service.testimonial && (
                <Card className="p-8 bg-gradient-to-br from-eucalyptus-50 to-earth-50 border border-eucalyptus-100">
                  <div className="flex gap-4 mb-4">
                    <svg className="w-8 h-8 text-ochre-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-lg text-earth-700 italic mb-6 leading-relaxed">
                    "{service.testimonial.quote}"
                  </p>
                  <div className="border-l-4 border-ochre-500 pl-4">
                    <div className="font-semibold text-earth-900">{service.testimonial.author}</div>
                    <div className="text-sm text-earth-600">{service.testimonial.role}</div>
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="lg:col-span-1 space-y-6">

              {/* What's Included */}
              <Card className="p-6 bg-white border border-earth-100 sticky top-24">
                <h3 className="text-lg font-bold text-earth-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  What's Included
                </h3>
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-earth-700">
                      <svg className="w-5 h-5 text-eucalyptus-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Outcomes & Impact */}
              <Card className="p-6 bg-gradient-to-br from-ochre-50 to-sunset-50 border border-ochre-200">
                <h3 className="text-lg font-bold text-earth-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Outcomes & Impact
                </h3>
                <ul className="space-y-3">
                  {service.outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-3 text-earth-700">
                      <svg className="w-5 h-5 text-ochre-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm leading-relaxed">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Contact CTA */}
              <Card className="p-6 bg-gradient-to-br from-eucalyptus-50 to-sand-50">
                <h3 className="text-lg font-bold text-earth-900 mb-3">Interested in this service?</h3>
                <p className="text-earth-700 text-sm mb-4">
                  Get in touch to learn more about how we can work together.
                </p>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate(`/contact?service=${service.id}`)}
                >
                  Contact Us
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* Bottom CTA Section */}
      <Section className="py-12 bg-gradient-to-br from-ochre-50 to-eucalyptus-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-earth-900 mb-4">
            Ready to Begin?
          </h2>
          <p className="text-lg text-earth-700 mb-8 max-w-2xl mx-auto">
            Let's start a conversation about how this service can support your community, organization, or young people.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" onClick={() => navigate(`/contact?service=${service.id}`)}>
              Get Started
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/services')}>
              View All Services
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ServiceDetailPage;
