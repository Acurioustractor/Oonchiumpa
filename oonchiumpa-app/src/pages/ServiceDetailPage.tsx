import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Section } from '../components/Section';
import { EditableImage } from '../components/EditableImage';
import { Card, CardBody } from '../components/Card';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { HowToEngage } from '../components/HowToEngage';
import { Loading } from '../components/Loading';
import { useMedia, useSyndicatedService } from '../hooks/useEmpathyLedger';
import { applyPageMeta } from '../utils/seo';

interface ServiceData {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  outcomes: string[];
  galleryPhotos?: string[];
  /** Numbered steps showing how to engage with this service, start to finish. */
  howItWorks?: Array<{ step: string; detail: string }>;
  /** Name of the primary contact person for this service. Matches a team member name where possible. */
  contactPerson?: {
    name: string;
    role: string;
    email?: string;
    avatar?: string;
  };
  /** Which inquiry type the EOI form should use when submitting (matches contact.ts). */
  inquiryType?: "referral" | "partnership" | "funding" | "general";
  /** Short label for the primary CTA button — overrides "Enquire about this service". */
  ctaLabel?: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  stats?: Array<{
    value: string;
    label: string;
  }>;
  serviceTags?: string[];
  audience?: string[];
  cta?: {
    label: string;
    url: string;
    text?: string | null;
  };
  mediaEvidence?: {
    photoCount: number;
    videoCount: number;
    linkedStoryCount: number;
    syncedPhotoPreviews: Array<{
      id: string;
      url: string;
      title: string | null;
      altText: string | null;
    }>;
    syncedVideoPreviews: Array<{
      id: string;
      url: string | null;
      thumbnailUrl: string | null;
      title: string | null;
      duration: number | null;
    }>;
  };
  linkedStories?: Array<{
    id: string;
    title: string;
    summary: string | null;
    publishedAt: string | null;
    storyteller: {
      id: string | null;
      displayName: string;
      avatarUrl: string | null;
    } | null;
  }>;
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
    },
    inquiryType: "referral",
    ctaLabel: "Make a referral",
    howItWorks: [
      { step: "Get in touch", detail: "Send a referral through the form below, call the office, or ask a partner service to connect us. All referrals are confidential." },
      { step: "Initial conversation", detail: "We meet with the young person and their family to understand what's happening and what support looks like from their perspective." },
      { step: "Plan together", detail: "A case worker and the young person build a plan around school, family, court, and culture — whatever matters most right now." },
      { step: "Consistent support", detail: "Daily or weekly contact across school, home, court, and services. Not a one-off referral. We stay with each young person." },
      { step: "Review and adjust", detail: "Regular check-ins with family and partner services. The plan changes as the young person's situation changes." },
    ],
    contactPerson: {
      name: "Kristy Bloomfield",
      role: "Traditional Owner & Director",
      avatar: "/images/team/kristy.jpg",
    },
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
    },
    inquiryType: "partnership",
    ctaLabel: "Partner with us",
    howItWorks: [
      { step: "Institutional expression of interest", detail: "Law schools or faculty members submit an EOI to co-design a cohort. We only run what Country can hold — cohorts are small by design." },
      { step: "Co-design with Traditional Owners", detail: "Oonchiumpa's directors work with your faculty to shape the semester structure, pre-reading, and on-Country week." },
      { step: "Selection of 16 students", detail: "Students apply through your institution. Selection weighs readiness, commitment to Aboriginal justice work, and cultural humility." },
      { step: "Semester-long course + on-Country week", detail: "Pre-reading, seminars, and the week-long immersion on Arrernte Country. Traditional Owners lead every session." },
      { step: "Alumni and onward practice", detail: "Graduates join an alumni network. Many go on to policy, legal practice, and justice reform roles carrying deep Aboriginal knowledge." },
    ],
    contactPerson: {
      name: "Tanya Turner",
      role: "Legal Advocate & Strategist",
      avatar: "/images/team/tanya.jpg",
    },
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
    },
    inquiryType: "partnership",
    ctaLabel: "Book or enquire",
    howItWorks: [
      { step: "Expression of interest", detail: "Schools, services, or partner organisations submit a brief on what the experience needs to achieve — healing, cultural learning, youth diversion, or retreat." },
      { step: "Yarning session", detail: "A call with the directors to confirm cultural fit, timing, and what Country can hold for your group. Not every request can be accommodated — we're led by cultural authority." },
      { step: "Design the program", detail: "Co-design the week: accommodation, on-Country experiences, Elder-led sessions, food, and logistics. We handle the cultural side; you handle the administrative side." },
      { step: "On-Country experience", detail: "Arrive at Atnarpa. Traditional Owners lead every element. Participants disconnect from town, connect to land, and learn directly from the people who hold cultural authority on this Country." },
      { step: "Follow-up", detail: "Debrief with your team afterwards. Many groups return seasonally or build ongoing relationships with Atnarpa." },
    ],
    contactPerson: {
      name: "Kristy Bloomfield",
      role: "Traditional Owner, Atnarpa Station",
      avatar: "/images/team/kristy.jpg",
    },
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
    },
    inquiryType: "referral",
    ctaLabel: "Request a referral",
    howItWorks: [
      { step: "Someone flags a need", detail: "A family member, young person, school, police, court, or partner service reaches out about a specific need — housing, health, legal, education, ID documents." },
      { step: "We listen", detail: "A case worker takes the time to understand what's happening and what the young person or family actually wants — not what a form says they should have." },
      { step: "Warm handover", detail: "We connect them with the right partner service (not a cold referral). We know the people. We do the cultural groundwork. We make sure the service is ready to receive them." },
      { step: "Walk alongside", detail: "We don't drop out after the introduction. We stay involved, translating between systems and family, advocating when needed, and making sure the connection holds." },
      { step: "Close the loop", detail: "We confirm the service relationship is working and come back in if anything falls through. Brokerage isn't transactional — it's relational." },
    ],
    contactPerson: {
      name: "Tanya Turner",
      role: "Legal Advocate & Strategist",
      avatar: "/images/team/tanya.jpg",
    },
  },
  'education-pathways': {
    id: 'education-pathways',
    title: 'Education Pathways',
    description: 'School re-engagement, daily transport, in-class support, and alternative learning when mainstream schooling breaks down.',
    longDescription: `Oonchiumpa's Education Pathways work starts where the school system has stopped reaching a young person. When attendance has broken down, when suspension has stacked on suspension, when the classroom doesn't feel safe, we build a pathway back to learning.

For some young people that means daily transport to school, advocacy in meetings with principals, and in-class support. For others it means bridging to alternative education — flexi-schools, TAFE pathways, or school-of-the-air arrangements. For a few, it means building a temporary learning environment around them at Atnarpa or in community until they're ready to return.

The work is tailored and relentless. We don't accept "disengaged" as an endpoint. We know that school completion is one of the strongest predictors of long-term outcomes, and we know Aboriginal young people have been failed by mainstream education at scale. Every young person deserves a pathway that works for them.`,
    features: [
      'Daily pickup and drop-off for school attendance',
      'In-class support and advocacy with teachers',
      'Advocacy in suspension and re-enrolment meetings',
      'Bridging to alternative education (flexi-schools, TAFE, school-of-the-air)',
      'Learning environments at Atnarpa for young people not ready for mainstream',
      'Cultural safety briefings for partner schools',
      'School uniforms, stationery, and practical supports',
      'Coordination with families to rebuild the school-home connection',
    ],
    outcomes: [
      '72% of disengaged youth returned to education',
      'Multiple young people prevented from permanent exclusion',
      'Schools with Oonchiumpa support report stronger cultural safety',
      'Family-school relationships repaired after breakdown',
      'Bridge to TAFE and alternative pathways for older youth',
    ],
    stats: [
      { value: '72%', label: 'Returned to education' },
      { value: 'Daily', label: 'Attendance support' },
      { value: '6+', label: 'Partner schools' },
      { value: '11-17', label: 'Age range' },
    ],
    testimonial: {
      quote: "J hadn't been to school in months when we started. Three weeks in, she was asking to go. It wasn't magic — it was someone turning up every morning to get her, making sure school knew she was coming, and being there when it got hard.",
      author: "Oonchiumpa Case Worker",
      role: "Education Pathways",
    },
    inquiryType: "referral",
    ctaLabel: "Make a referral",
    howItWorks: [
      { step: "Referral arrives", detail: "From the family, a school, child protection, or partner service. Focus: what's happening for the young person, what's already been tried, and what school / pathway is in the picture." },
      { step: "Understand the young person", detail: "We meet with them and the family before talking to the school. Their story first, then the system." },
      { step: "Design the pathway", detail: "Sometimes it's re-entry to their current school with support. Sometimes it's an alternative setting. Sometimes it's a bridging period at Atnarpa. Always built around what the young person can carry right now." },
      { step: "Show up every day", detail: "Daily transport. In-class support when schools want it. Meetings and advocacy when they don't. Oonchiumpa doesn't disappear after the referral." },
      { step: "Track and adjust", detail: "Weekly check-ins with family and the school. The plan changes as things change. Stay with it." },
    ],
    contactPerson: {
      name: "Kristy Bloomfield",
      role: "Program Director",
      avatar: "/images/team/kristy.jpg",
    },
  },
  'family-kinship': {
    id: 'family-kinship',
    title: 'Family & Kinship Support',
    description: 'Whole-family support, kinship mapping, and protective networks around vulnerable young people.',
    longDescription: `No young person's story is just about them. It's about their parents, their aunties, their uncles, their siblings, their cousins — the kinship system that surrounds every Aboriginal young person. When that system is strong, young people are held. When it's strained or broken, young people fall.

Oonchiumpa's family and kinship work is about rebuilding the systems around young people. That means supporting parents and carers directly — with housing, Centrelink, advocacy, and practical help. It means mapping kinship networks that the system has often failed to see. It means reconnecting young people with family they didn't know they had.

This is slow work. It doesn't fit a 12-week case management program. It's intergenerational. But it's the work that changes trajectories — because when the family system is strong, the young person doesn't need a case worker forever.`,
    features: [
      'Kinship mapping — identifying protective family members the system has missed',
      'Direct support for parents and carers (housing, Centrelink, health, advocacy)',
      'Family reunification and reconnection',
      'Sibling support — preventing the next young person from entering the system',
      'Cultural safety briefings for child protection and other services working with the family',
      'Intergenerational healing work, often at Atnarpa',
      'Facilitation between family members where relationships have broken down',
    ],
    outcomes: [
      '2,464 meaningful contacts with families in 6 months',
      '87-95% engagement rate with culturally-led family support',
      'Young people reconnected with previously-unknown family members',
      'Whole-family housing pathways achieved',
      'Siblings diverted from justice system through family-level work',
    ],
    stats: [
      { value: '2,464', label: 'Family contacts / 6mo' },
      { value: '87-95%', label: 'Engagement rate' },
      { value: 'Whole-family', label: 'Approach' },
      { value: 'Intergenerational', label: 'Timeframe' },
    ],
    testimonial: {
      quote: "The work doesn't stop with the young person — it starts there. When we support the parents, the siblings, the aunties — when the whole family is stronger, the young person stops needing us to be there every day. That's the goal.",
      author: "Oonchiumpa Case Worker",
      role: "Family & Kinship Support",
    },
    inquiryType: "referral",
    ctaLabel: "Reach out about a family",
    howItWorks: [
      { step: "Initial contact", detail: "From a family member, a young person already on program, or a partner service. Confidential. No paperwork barrier to first contact." },
      { step: "Family yarn", detail: "We sit with the family and listen. What's happening. Who's in the kinship system. What's been tried. What they actually want — which is rarely what a referral form says they should want." },
      { step: "Kinship map", detail: "We work with the family to identify protective kin the system has missed. Often this unlocks supports that existed all along but weren't visible to case workers." },
      { step: "Practical and cultural support", detail: "Housing, Centrelink, health, court advocacy, cultural protocols, intergenerational healing. The mix depends on the family — not a template." },
      { step: "Release, not exit", detail: "When the family system is strong enough, we step back. But we stay connected. Intergenerational work doesn't have a discharge date." },
    ],
    contactPerson: {
      name: "Tanya Turner",
      role: "Legal Advocate & Strategist",
      avatar: "/images/team/tanya.jpg",
    },
  },
};


const serviceHeroDefaults: Record<string, string> = {
  'youth-mentorship': '/images/model/atnarpa-facilities.jpg',
  'law-students': '/images/stories/IMG_9713.jpg',
  'atnarpa-homestead': '/images/model/atnarpa-land.jpg',
  'cultural-brokerage': '/images/stories/IMG_9698.jpg',
};

interface ResolvedServiceData extends ServiceData {
  heroImage?: string;
}

const normalizeToken = (value: string) =>
  value
    .toLowerCase()
    .replace(/[_/]+/g, ' ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim();

const uniqueNonEmpty = (values: Array<string | null | undefined>) =>
  Array.from(
    new Set(
      values
        .map((value) => (typeof value === 'string' ? value.trim() : ''))
        .filter(Boolean),
    ),
  );

const formatStoryDate = (value: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const localService = serviceId ? servicesData[serviceId] : null;
  const shouldLoadSyndicated = Boolean(serviceId && !localService);
  const { service: syndicatedService, loading: syndicatedLoading } =
    useSyndicatedService(shouldLoadSyndicated ? serviceId || null : null);
  const { media: imageAssets, loading: imageAssetsLoading } = useMedia({
    limit: 120,
    type: 'image',
  });
  const { media: videoAssets, loading: videoAssetsLoading } = useMedia({
    limit: 120,
    type: 'video',
  });

  const service: ResolvedServiceData | null = React.useMemo(() => {
    if (localService) {
      return {
        ...localService,
        heroImage:
          serviceHeroDefaults[localService.id] || '/images/model/community-on-country.jpg',
      };
    }
    if (!syndicatedService) return null;

    const normalizedId = syndicatedService.slug || syndicatedService.id;
    const detail = syndicatedService.detail;
    const topThemes = syndicatedService.topThemes
      .map((theme) => theme.theme.replace(/_/g, ' ').trim())
      .filter(Boolean);
    const featureItems =
      detail.deliveryPillars.length > 0
        ? detail.deliveryPillars
        : [
            syndicatedService.serviceType
              ? `Service type: ${syndicatedService.serviceType}`
              : null,
            syndicatedService.status ? `Status: ${syndicatedService.status}` : null,
            topThemes.length > 0
              ? `Top themes: ${topThemes.slice(0, 5).join(', ')}`
              : null,
            syndicatedService.address
              ? `Service location: ${syndicatedService.address}`
              : null,
          ].filter((item): item is string => Boolean(item));

    const outcomeItems =
      detail.keyOutcomes.length > 0
        ? detail.keyOutcomes
        : [
            `${syndicatedService.storytellerCount} storytellers linked`,
            `${syndicatedService.linkedStoryCount} stories connected`,
            `${syndicatedService.quoteCount} approved quotes available`,
            ...syndicatedService.topThemes
              .slice(0, 3)
              .map(
                (theme) =>
                  `${theme.theme.replace(/_/g, ' ')} theme count: ${theme.count}`,
              ),
          ];

    const galleryPhotos = uniqueNonEmpty([
      syndicatedService.imageUrl,
      ...syndicatedService.media.photoPreviews.map((asset) => asset.url),
    ]);

    const hasDetailTestimonial = Boolean(detail.testimonial.quote);
    const serviceCtaUrl =
      detail.cta.url || `/contact?service=${encodeURIComponent(normalizedId)}`;
    const serviceCtaLabel = detail.cta.label || 'Enquire about this service';

    const serviceStats =
      detail.impactStats.length > 0
        ? detail.impactStats.map((stat) => ({
            value: stat.value,
            label: stat.label,
          }))
        : [
            {
              value: String(syndicatedService.storytellerCount),
              label: 'Storytellers linked',
            },
            {
              value: String(syndicatedService.linkedStoryCount),
              label: 'Stories connected',
            },
            { value: String(syndicatedService.quoteCount), label: 'Quotes' },
            ...(syndicatedService.serviceType
              ? [{ value: syndicatedService.serviceType, label: 'Service type' }]
              : []),
          ];

    return {
      id: normalizedId,
      title: syndicatedService.name,
      description:
        detail.overview ||
        syndicatedService.description ||
        'Syndicated service profile from Empathy Ledger.',
      longDescription:
        detail.longDescription ||
        syndicatedService.description ||
        'This service profile is syndicated from Empathy Ledger.',
      features:
        featureItems.length > 0
          ? featureItems
          : ['Service details are currently being expanded in Empathy Ledger.'],
      outcomes:
        outcomeItems.length > 0
          ? outcomeItems
          : ['Outcome metrics will appear as content is published.'],
      galleryPhotos: galleryPhotos.length > 0 ? galleryPhotos : undefined,
      testimonial: hasDetailTestimonial
        ? {
            quote: detail.testimonial.quote || '',
            author: detail.testimonial.author || 'Community voice',
            role: detail.testimonial.role || 'Syndicated service quote',
          }
        : syndicatedService.heroQuotes[0]
        ? {
            quote: syndicatedService.heroQuotes[0].text,
            author: syndicatedService.heroQuotes[0].author || 'Community voice',
            role: 'Syndicated service quote',
          }
        : undefined,
      stats: serviceStats.slice(0, 4),
      serviceTags: detail.serviceTags,
      audience: detail.audience,
      cta: {
        label: serviceCtaLabel,
        url: serviceCtaUrl,
        text: detail.cta.text,
      },
      mediaEvidence: {
        photoCount: syndicatedService.media.photoCount,
        videoCount: syndicatedService.media.videoCount,
        linkedStoryCount: syndicatedService.linkedStoryCount,
        syncedPhotoPreviews: syndicatedService.media.photoPreviews
          .filter((asset) => Boolean(asset.url))
          .map((asset) => ({
            id: asset.id,
            url: asset.url || '',
            title: asset.title,
            altText: asset.altText,
          })),
        syncedVideoPreviews: syndicatedService.media.videoPreviews,
      },
      linkedStories: syndicatedService.linkedStories,
      heroImage:
        syndicatedService.imageUrl ||
        syndicatedService.media.photoPreviews.find((asset) => Boolean(asset.url))
          ?.url ||
        '/images/model/community-on-country.jpg',
    };
  }, [localService, syndicatedService]);

  const discoveryTerms = React.useMemo(() => {
    if (!service) return [];
    const tokenSource = [
      service.id,
      service.title,
      ...service.features.slice(0, 6),
      ...service.outcomes.slice(0, 4),
    ]
      .map((value) => normalizeToken(value))
      .join(' ');

    const terms = tokenSource
      .split(/\s+/)
      .map((value) => value.trim())
      .filter((value) => value.length >= 4);

    return Array.from(new Set(terms));
  }, [service]);

  const matchAssetByTerms = React.useCallback(
    (
      asset: {
        title: string | null;
        description: string | null;
        culturalTags: string[] | null;
      },
      terms: string[],
    ) => {
      if (terms.length === 0) return false;
      const searchable = normalizeToken(
        `${asset.title || ''} ${asset.description || ''} ${(asset.culturalTags || []).join(' ')}`,
      );
      return terms.some((term) => searchable.includes(term));
    },
    [],
  );

  const matchedImageAssets = React.useMemo(() => {
    if (!service) return [];
    return imageAssets.filter((asset) => matchAssetByTerms(asset, discoveryTerms));
  }, [service, imageAssets, matchAssetByTerms, discoveryTerms]);

  const matchedVideoAssets = React.useMemo(() => {
    if (!service) return [];
    return videoAssets.filter((asset) => matchAssetByTerms(asset, discoveryTerms));
  }, [service, videoAssets, matchAssetByTerms, discoveryTerms]);

  const syncedPhotoPreviews = React.useMemo(() => {
    if (service?.mediaEvidence?.syncedPhotoPreviews?.length) {
      return service.mediaEvidence.syncedPhotoPreviews;
    }

    return matchedImageAssets.slice(0, 9).map((asset) => ({
      id: asset.id,
      url: asset.thumbnailUrl || asset.previewUrl || asset.url || '',
      title: asset.title,
      altText: asset.altText || null,
    }));
  }, [service, matchedImageAssets]);

  const syncedVideoPreviews = React.useMemo(() => {
    if (service?.mediaEvidence?.syncedVideoPreviews?.length) {
      return service.mediaEvidence.syncedVideoPreviews;
    }

    return matchedVideoAssets.slice(0, 4).map((asset) => ({
      id: asset.id,
      url: asset.url,
      thumbnailUrl: asset.thumbnailUrl || asset.previewUrl || null,
      title: asset.title,
      duration: null,
    }));
  }, [service, matchedVideoAssets]);

  const matchedImageCount = Math.max(
    service?.mediaEvidence?.photoCount || 0,
    syncedPhotoPreviews.length,
    matchedImageAssets.length,
  );
  const matchedVideoCount = Math.max(
    service?.mediaEvidence?.videoCount || 0,
    syncedVideoPreviews.length,
    matchedVideoAssets.length,
  );

  const mediaReadiness = React.useMemo(() => {
    if (!service) return { hasPhoto: false, hasVideo: false, hasQuote: false };
    const galleryCount = service.galleryPhotos?.length || 0;
    return {
      hasPhoto: Boolean(service.heroImage || galleryCount > 0 || matchedImageCount > 0),
      hasVideo: Boolean(matchedVideoCount > 0),
      hasQuote: Boolean(service.testimonial?.quote),
    };
  }, [service, matchedImageCount, matchedVideoCount]);

  const isLoading = shouldLoadSyndicated && syndicatedLoading;
  const heroDefaultImage = service
    ? service.heroImage || '/images/model/community-on-country.jpg'
    : '/images/model/community-on-country.jpg';

  const openServiceCta = React.useCallback(() => {
    if (!service?.cta?.url) {
      navigate(`/contact?service=${service?.id || ''}`);
      return;
    }

    const targetUrl = service.cta.url.trim();
    if (/^https?:\/\//i.test(targetUrl)) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (targetUrl.startsWith('/')) {
      navigate(targetUrl);
      return;
    }

    navigate(`/${targetUrl.replace(/^\/+/, '')}`);
  }, [navigate, service]);

  React.useEffect(() => {
    if (!service) return;

    const canonicalUrl = window.location.href.split('#')[0];
    applyPageMeta({
      title: service.title,
      description: service.description,
      image: heroDefaultImage,
      canonicalUrl,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        description: service.description,
        areaServed: {
          '@type': 'Place',
          name: 'Arrernte Country, Alice Springs',
        },
        provider: {
          '@type': 'Organization',
          name: 'Oonchiumpa',
        },
      },
    });
  }, [service, heroDefaultImage]);

  if (isLoading) return <Loading />;

  if (!service) {
    return (
      <Section>
        <div className="max-w-3xl mx-auto section-shell p-10 text-center">
          <h2 className="text-3xl font-display text-earth-950 mb-3">Service not found</h2>
          <p className="text-earth-600 mb-6">The service page you requested is unavailable.</p>
          <Link to="/services" className="btn-primary">
            Back to services
          </Link>
        </div>
      </Section>
    );
  }

  const isSyndicatedSource = Boolean(!localService && syndicatedService);
  const quickStats =
    service.stats && service.stats.length > 0
      ? service.stats
      : [
          { value: String(service.features.length), label: 'Delivery elements' },
          { value: String(service.outcomes.length), label: 'Outcome signals' },
          { value: String(service.galleryPhotos?.length || 0), label: 'Gallery photos' },
        ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        <EditableImage
          slotId={`service-${service.id}-hero`}
          defaultSrc={heroDefaultImage}
          defaultAlt={`${service.title} on Country and in community`}
          className="absolute inset-0 w-full h-full object-cover"
          wrapperClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950/85 via-earth-950/55 to-transparent" />

        <div className="relative z-10 container-custom pt-28 pb-14 md:pb-18">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: service.title },
            ]}
            onDark
            className="mb-6"
          />
          <p className="eyebrow text-ochre-200 mb-4">Service detail</p>
          <h1 className="heading-lg text-white max-w-4xl mb-5">{service.title}</h1>
          <p className="text-white/85 text-lg md:text-xl leading-relaxed max-w-3xl mb-8">
            {service.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={openServiceCta} className="btn-primary">
              {service.cta?.label || 'Enquire about this service'}
            </button>
            <button
              onClick={() => navigate('/stories')}
              className="btn-secondary border-white/50 bg-white/10 text-white hover:bg-white/20"
            >
              Read related stories
            </button>
          </div>
        </div>
      </section>

      <section className="bg-earth-950 text-white py-8 border-y border-earth-900">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-ochre-200 text-xs uppercase tracking-[0.2em] mb-2">
                Service profile status
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 rounded-full text-xs border border-white/25 bg-white/10">
                  {isSyndicatedSource ? 'Syndicated from Empathy Ledger' : 'Flagship service page'}
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs border border-white/25 bg-white/10">
                  {mediaReadiness.hasPhoto ? 'Photo-ready' : 'Needs photo assets'}
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs border border-white/25 bg-white/10">
                  {mediaReadiness.hasVideo ? 'Video-ready' : 'Needs video coverage'}
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs border border-white/25 bg-white/10">
                  {mediaReadiness.hasQuote ? 'Quote-ready' : 'Needs quote evidence'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickStats.slice(0, 4).map((stat, index) => (
                <div key={index} className="rounded-xl bg-white/10 border border-white/15 px-4 py-3">
                  <p className="text-2xl font-display text-ochre-300">{stat.value}</p>
                  <p className="text-xs text-white/75 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Card>
              <CardBody className="p-8 md:p-10">
                <p className="eyebrow mb-4">Program narrative</p>
                <h2 className="text-3xl font-display text-earth-950 mb-5">How this service works on the ground</h2>
                <div className="space-y-5">
                  {service.longDescription.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-earth-700 leading-relaxed text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-7 md:p-8">
                <p className="eyebrow mb-3">Delivery pillars</p>
                <h3 className="text-2xl font-display text-earth-950 mb-5">Core delivery elements</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {service.features.map((feature, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-earth-100 bg-earth-50 p-4 text-sm text-earth-700 leading-relaxed"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card className="bg-sand-50 border-sand-200">
              <CardBody className="p-7 md:p-8">
                <p className="eyebrow mb-3">Outcome evidence</p>
                <h3 className="text-2xl font-display text-earth-950 mb-5">Impact indicators and service signals</h3>
                <ul className="space-y-3">
                  {service.outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-2 text-earth-700 text-base leading-relaxed">
                      <span className="mt-1 block h-2 w-2 rounded-full bg-ochre-500" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>

            {service.linkedStories && service.linkedStories.length > 0 && (
              <Card>
                <CardBody className="p-7 md:p-8">
                  <p className="eyebrow mb-3">Lived experience stories</p>
                  <h3 className="text-2xl font-display text-earth-950 mb-5">
                    Community stories connected to this service
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {service.linkedStories.slice(0, 4).map((story) => {
                      const publishedLabel = formatStoryDate(story.publishedAt);
                      return (
                        <Link
                          key={story.id}
                          to={`/stories/${story.id}`}
                          className="group rounded-xl border border-earth-100 bg-earth-50 p-4 hover:border-ochre-200 hover:bg-white transition-colors"
                        >
                          <p className="text-sm font-semibold text-earth-950 group-hover:text-ochre-800 transition-colors">
                            {story.title}
                          </p>
                          {story.summary && (
                            <p className="mt-2 text-sm text-earth-600 line-clamp-3">
                              {story.summary}
                            </p>
                          )}
                          <div className="mt-4 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              {story.storyteller?.avatarUrl ? (
                                <img
                                  src={story.storyteller.avatarUrl}
                                  alt={story.storyteller.displayName}
                                  className="h-7 w-7 rounded-full object-cover border border-earth-200"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="h-7 w-7 rounded-full border border-earth-200 bg-earth-100 flex items-center justify-center text-[10px] text-earth-500">
                                  ST
                                </div>
                              )}
                              <p className="text-xs text-earth-500 truncate">
                                {story.storyteller?.displayName || 'Community storyteller'}
                              </p>
                            </div>
                            {publishedLabel && (
                              <p className="text-[11px] text-earth-500">{publishedLabel}</p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            )}

            {((service.serviceTags && service.serviceTags.length > 0) ||
              (service.audience && service.audience.length > 0)) && (
              <Card>
                <CardBody className="p-7 md:p-8">
                  <p className="eyebrow mb-3">Service footprint</p>
                  <h3 className="text-2xl font-display text-earth-950 mb-5">
                    Audience and focus areas
                  </h3>
                  {service.audience && service.audience.length > 0 && (
                    <div className="mb-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-earth-500 mb-2">
                        Audience
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {service.audience.map((item) => (
                          <span
                            key={`audience-${item}`}
                            className="px-3 py-1 rounded-full text-xs bg-earth-100 text-earth-700 border border-earth-200"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {service.serviceTags && service.serviceTags.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-earth-500 mb-2">
                        Tags
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {service.serviceTags.map((tag) => (
                          <span
                            key={`service-tag-${tag}`}
                            className="px-3 py-1 rounded-full text-xs bg-ochre-50 text-ochre-700 border border-ochre-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            )}

            {service.galleryPhotos && service.galleryPhotos.length > 0 && (
              <Card>
                <CardBody className="p-7 md:p-8">
                  <p className="eyebrow mb-3">Gallery</p>
                  <h3 className="text-2xl font-display text-earth-950 mb-5">Program moments and visual proof</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {service.galleryPhotos.map((url, index) => (
                      <div key={index} className="group relative aspect-square overflow-hidden rounded-xl bg-earth-100">
                        <img
                          src={url}
                          alt={`${service.title} photo ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {syncedPhotoPreviews.length > 0 && (
              <Card>
                <CardBody className="p-7 md:p-8">
                  <p className="eyebrow mb-3">Synced photos</p>
                  <h3 className="text-2xl font-display text-earth-950 mb-5">
                    Empathy Ledger image evidence
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {syncedPhotoPreviews.slice(0, 9).map((asset) => {
                      const imageUrl = asset.url;
                      if (!imageUrl) return null;
                      return (
                        <div
                          key={asset.id}
                          className="group relative aspect-square overflow-hidden rounded-xl bg-earth-100 border border-earth-100"
                        >
                          <img
                            src={imageUrl}
                            alt={asset.altText || asset.title || `${service.title} media evidence`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            )}

            {syncedVideoPreviews.length > 0 && (
              <Card>
                <CardBody className="p-7 md:p-8">
                  <p className="eyebrow mb-3">Synced videos</p>
                  <h3 className="text-2xl font-display text-earth-950 mb-5">
                    Matched video references
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {syncedVideoPreviews.slice(0, 4).map((asset) => (
                      <article
                        key={asset.id}
                        className="rounded-xl border border-earth-100 bg-earth-50 overflow-hidden"
                      >
                        {asset.thumbnailUrl ? (
                          <img
                            src={asset.thumbnailUrl}
                            alt={asset.title || 'Video preview'}
                            className="w-full h-36 object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-36 bg-earth-100 flex items-center justify-center text-earth-400 text-sm">
                            Video preview
                          </div>
                        )}
                        <div className="p-4">
                          <p className="text-sm font-medium text-earth-950 mb-1 line-clamp-2">
                            {asset.title || "Service-linked video"}
                          </p>
                          {asset.url && (
                            <a
                              href={asset.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center text-xs font-medium text-ochre-700 hover:text-ochre-800"
                            >
                              Open source video
                              <span className="ml-1">↗</span>
                            </a>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {service.testimonial && (
              <Card className="bg-earth-950 text-white border-earth-900">
                <CardBody className="p-8 md:p-10">
                  <p className="text-white/85 text-lg md:text-xl italic leading-relaxed mb-5">
                    "{service.testimonial.quote}"
                  </p>
                  <p className="text-ochre-200 font-semibold">{service.testimonial.author}</p>
                  <p className="text-white/65 text-sm mt-1">{service.testimonial.role}</p>
                </CardBody>
              </Card>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="sticky top-24">
              <CardBody className="p-6">
                <p className="eyebrow mb-3">Project snapshot</p>
                <h3 className="text-xl font-display text-earth-950 mb-4">Readiness and next actions</h3>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-earth-600">Photo coverage</span>
                    <span className={mediaReadiness.hasPhoto ? 'text-eucalyptus-700' : 'text-sunset-700'}>
                      {mediaReadiness.hasPhoto ? 'Ready' : 'Needs update'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-earth-600">Video coverage</span>
                    <span className={mediaReadiness.hasVideo ? 'text-eucalyptus-700' : 'text-sunset-700'}>
                      {mediaReadiness.hasVideo ? 'Ready' : 'Needs update'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-earth-600">Quote evidence</span>
                    <span className={mediaReadiness.hasQuote ? 'text-eucalyptus-700' : 'text-sunset-700'}>
                      {mediaReadiness.hasQuote ? 'Ready' : 'Needs update'}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-earth-100 bg-earth-50 p-4 mb-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-earth-500 mb-2">Empathy media matches</p>
                  <p className="text-sm text-earth-700">
                    {matchedImageCount} image match{matchedImageCount === 1 ? '' : 'es'} · {matchedVideoCount} video match{matchedVideoCount === 1 ? '' : 'es'}
                  </p>
                  {(imageAssetsLoading || videoAssetsLoading) && (
                    <p className="text-xs text-earth-500 mt-2">Checking latest media assets...</p>
                  )}
                </div>

                {service.cta?.text && (
                  <p className="text-xs text-earth-500 mb-4">{service.cta.text}</p>
                )}

                <div className="space-y-2">
                  <button
                    onClick={openServiceCta}
                    className="btn-primary w-full"
                  >
                    {service.cta?.label || 'Enquire about this service'}
                  </button>
                  <button onClick={() => navigate('/stories')} className="btn-secondary w-full">
                    View related stories
                  </button>
                  <button onClick={() => navigate('/videos')} className="btn-secondary w-full">
                    Review video library
                  </button>
                </div>
              </CardBody>
            </Card>

          </div>
        </div>
      </Section>

      {service.howItWorks && service.howItWorks.length > 0 && (
        <HowToEngage
          serviceId={service.id}
          serviceTitle={service.title}
          howItWorks={service.howItWorks}
          contactPerson={service.contactPerson}
          inquiryType={service.inquiryType}
          ctaLabel={service.ctaLabel}
        />
      )}

      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <p className="eyebrow mb-3">Keep exploring</p>
          <h2 className="heading-lg mb-5">Related ways to engage</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/services')} className="btn-secondary">
              View all services
            </button>
            <button onClick={() => navigate('/stories')} className="btn-secondary">
              Read stories
            </button>
            <button onClick={() => navigate('/team')} className="btn-secondary">
              Meet the team
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ServiceDetailPage;
