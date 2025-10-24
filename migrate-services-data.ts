import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Current services data from ServicesPage.tsx
const services = [
  {
    slug: 'youth-mentorship',
    title: 'Youth Mentorship & Cultural Healing',
    description: 'Culturally-led mentorship for at-risk Aboriginal young people, providing connection to culture, education, and pathways to healing.',
    image_url: 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/services/service-mentoring.jpg',
    features: [
      'One-on-one mentorship by Aboriginal staff',
      'School re-engagement support (95% success rate)',
      'Life skills and independence training',
      'Connection to family and cultural identity',
      'Mental health and wellbeing support'
    ],
    icon_svg: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    display_order: 1,
    is_visible: true
  },
  {
    slug: 'law-students',
    title: 'True Justice: Deep Listening on Country',
    description: 'Transformative legal education program where law students learn from Traditional Owners on country, understanding Aboriginal law, justice, and lived experiences beyond what textbooks can teach.',
    image_url: 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/services/service-law.jpg',
    features: [
      'Week-long immersive on-country experience in Central Australia',
      'Deep listening to Aboriginal lore and lived experiences of law',
      'Travel from Alice Springs through Arrernte Country to Uluru',
      'Aboriginal conceptions of justice and kinship systems',
      'Designed and led by Traditional Owners Kristy Bloomfield and Tanya Turner',
      'Partnership with ANU Law School since 2022'
    ],
    icon_svg: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    display_order: 2,
    is_visible: true
  },
  {
    slug: 'atnarpa-homestead',
    title: 'Atnarpa Homestead On-Country Experiences',
    description: 'Experience Eastern Arrernte country at Loves Creek Station. Accommodation, cultural tourism, and healing programs on Traditional Owner-led country.',
    image_url: 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/services/service-homestead.jpg',
    features: [
      'Accommodation and camping facilities',
      'On-country cultural learning experiences',
      'Bush medicine workshops and knowledge sharing',
      'Storytelling and cultural connection',
      'School group hosting and education programs',
      'Cultural tourism experiences'
    ],
    icon_svg: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    display_order: 3,
    is_visible: true
  },
  {
    slug: 'cultural-brokerage',
    title: 'Cultural Brokerage & Service Navigation',
    description: 'Connecting Aboriginal young people and families to essential services through trusted partnerships with over 32 community organizations.',
    image_url: 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/services/service-brokerage.jpg',
    features: [
      'Service coordination with 32+ partner organizations',
      'Health service connections (Congress, Headspace)',
      'Education pathway support',
      'Employment and training referrals',
      'Housing and accommodation assistance',
      'Legal and justice system navigation'
    ],
    icon_svg: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    display_order: 4,
    is_visible: true
  }
];

async function migrateServices() {
  console.log('🔄 Migrating services data to database...\n');

  for (const service of services) {
    console.log(`Inserting: ${service.title}`);

    const { error } = await supabase
      .from('services')
      .insert(service);

    if (error) {
      console.error(`❌ Error inserting ${service.title}:`, error.message);
    } else {
      console.log(`✅ ${service.title} inserted successfully`);
    }
  }

  console.log('\n✨ Services migration complete!');

  // Verify
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order');

  if (error) {
    console.error('❌ Error verifying:', error);
  } else {
    console.log(`\n📊 Total services in database: ${data?.length}`);
  }
}

migrateServices();
