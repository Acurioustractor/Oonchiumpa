import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { 
  UserRole, 
  ContentStatus, 
  SensitivityLevel, 
  MediaType, 
  ProcessingStatus 
} from '@prisma/client';

export async function seedDatabase(prisma: PrismaClient) {
  console.log('🌱 Seeding database...');

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 12);
  const elderPassword = await bcrypt.hash('elder123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@oonchiumpa.org' },
    update: {},
    create: {
      email: 'admin@oonchiumpa.org',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  const elder = await prisma.user.upsert({
    where: { email: 'elder@oonchiumpa.org' },
    update: {},
    create: {
      email: 'elder@oonchiumpa.org',
      name: 'Elder Mary Thompson',
      password: elderPassword,
      role: UserRole.ELDER,
    },
  });

  // Create stories
  const stories = [
    {
      title: 'The Dreaming of the Rainbow Serpent',
      subtitle: 'Ancient waterways and spiritual connection',
      content: `The Rainbow Serpent is one of the most important ancestral spirits in Aboriginal Dreaming stories. This powerful creator being is said to have carved out the rivers, mountains, and valleys as it moved across the land during the Dreamtime.

In our community, the story of the Rainbow Serpent teaches us about the sacred relationship between water, land, and all living things. Elder Mary Thompson shares how her grandmother would tell this story by the billabong, pointing out how the winding river followed the serpent's path.

The Rainbow Serpent represents both creation and destruction - bringing life-giving rains but also floods that reshape the landscape. This duality reminds us of the need for respect and balance in our relationship with the natural world.

Today, as we face environmental challenges, these ancient stories offer wisdom about living in harmony with Country. The Rainbow Serpent's journey continues to guide us in understanding our responsibility as caretakers of the land.`,
      author: 'Elder Mary Thompson',
      category: 'Dreamtime Stories',
      culturalSignificance: 'This story connects us to Country and teaches sustainable living practices that have been passed down for thousands of years.',
      tags: ['dreamtime', 'spirituality', 'environment', 'creation'],
      status: ContentStatus.PUBLISHED,
      sensitivityLevel: SensitivityLevel.COMMUNITY,
      publishedAt: new Date('2024-01-15'),
      authorUserId: elder.id,
    },
    {
      title: 'Community Healing Through Art',
      subtitle: 'Using traditional painting to process trauma',
      content: `Art has always been central to Aboriginal culture - it is our way of telling stories, passing on knowledge, and healing together as a community. In our recent workshop series, community members came together to create a large collaborative artwork that tells the story of resilience.

The workshop began with smoking ceremony led by Uncle Jim, clearing the space and calling in good spirits. Participants of all ages worked with ochre, charcoal, and contemporary paints to create symbols representing their personal journeys and collective strength.

Sarah, a young mother who participated, shared: "When I put my hand in that ochre and made my mark on the canvas, I felt connected to thousands of years of my ancestors doing the same thing. It wasn't just painting - it was healing."

The completed artwork now hangs in our community center, serving as a daily reminder of our shared strength and cultural continuity. It demonstrates how traditional practices can address contemporary challenges while keeping our culture alive and vibrant.`,
      author: 'David Nguyen',
      category: 'Community Programs',
      culturalSignificance: 'Art serves as both cultural preservation and contemporary healing, maintaining our connection to ancestral practices.',
      tags: ['art', 'healing', 'community', 'tradition'],
      status: ContentStatus.PUBLISHED,
      sensitivityLevel: SensitivityLevel.PUBLIC,
      publishedAt: new Date('2024-02-20'),
      authorUserId: admin.id,
    },
    {
      title: 'Seasons of Learning',
      subtitle: 'Traditional ecological knowledge for modern times',
      content: `Our ancestors lived by the subtle changes in the natural world, reading the land like a library. Today, these skills are more important than ever as we face climate change and environmental challenges.

Elder Robert teaches young people to read the signs that indicate seasonal changes - the angle of the sun, the behavior of animals, the flowering of native plants. This knowledge system, developed over 65,000 years, offers insights that complement modern scientific understanding.

"When the wattle starts blooming in this way," Elder Robert explains, pointing to the golden flowers, "we know the fish will be running in the rivers soon. My grandfather taught me this, and his grandfather taught him."

These teaching sessions happen on Country, walking the same paths our ancestors walked. Participants learn not just what to observe, but how to develop the patience and attentiveness that this knowledge requires.`,
      author: 'James Mitchell',
      category: 'Traditional Knowledge',
      culturalSignificance: 'Traditional ecological knowledge demonstrates the sophisticated understanding of Country that sustained our people for millennia.',
      tags: ['seasons', 'ecology', 'education', 'elders'],
      status: ContentStatus.PUBLISHED,
      sensitivityLevel: SensitivityLevel.COMMUNITY,
      publishedAt: new Date('2024-03-10'),
      authorUserId: elder.id,
    },
  ];

  // Clear existing stories first
  await prisma.story.deleteMany();
  
  // Create stories
  await prisma.story.createMany({
    data: stories,
  });

  // Create outcomes
  const outcomes = [
    {
      title: 'Cultural Education Program Launch',
      description: 'Successfully launched a comprehensive cultural education program in partnership with local schools.',
      impact: 'Over 500 students have gained deeper understanding of Aboriginal culture and history through authentic, Elder-led experiences.',
      category: 'Education',
      location: 'Greater Sydney Region',
      beneficiaries: 523,
      date: new Date('2024-02-01'),
      status: ContentStatus.PUBLISHED,
      sensitivityLevel: SensitivityLevel.PUBLIC,
      authorUserId: admin.id,
      metrics: {
        create: [
          { label: 'Students Reached', value: '523' },
          { label: 'Schools Participating', value: '12' },
          { label: 'Cultural Sessions', value: '48' },
        ],
      },
    },
    {
      title: 'Community Art Installation',
      description: 'Created a large-scale community art installation representing the local Aboriginal history and connection to Country.',
      impact: 'The installation serves as a permanent reminder of Aboriginal presence and culture, fostering respect and understanding in the broader community.',
      category: 'Art & Culture',
      location: 'Circular Quay, Sydney',
      beneficiaries: 85,
      date: new Date('2024-01-15'),
      status: ContentStatus.PUBLISHED,
      sensitivityLevel: SensitivityLevel.PUBLIC,
      authorUserId: elder.id,
      metrics: {
        create: [
          { label: 'Community Members Involved', value: '85' },
          { label: 'Hours of Community Engagement', value: '240' },
          { label: 'Visitors per Month', value: '1200' },
        ],
      },
    },
    {
      title: 'Traditional Healing Workshop Series',
      description: 'Delivered healing workshops combining traditional Aboriginal practices with contemporary therapeutic approaches.',
      impact: 'Participants reported significant improvements in mental health and cultural connection, with 90% continuing to use learned practices.',
      category: 'Health & Wellbeing',
      location: 'Redfern Community Centre',
      beneficiaries: 156,
      date: new Date('2023-12-01'),
      status: ContentStatus.PUBLISHED,
      sensitivityLevel: SensitivityLevel.COMMUNITY,
      authorUserId: elder.id,
      metrics: {
        create: [
          { label: 'Participants', value: '156' },
          { label: 'Workshop Sessions', value: '24' },
          { label: 'Follow-up Rate', value: '90%' },
        ],
      },
    },
  ];

  // Clear existing outcomes first
  await prisma.outcome.deleteMany();
  
  // Create outcomes
  for (const outcomeData of outcomes) {
    await prisma.outcome.create({
      data: outcomeData,
    });
  }

  // Create media items
  const mediaItems = [
    {
      type: MediaType.IMAGE,
      originalUrl: '/api/placeholder/400/600',
      cdnUrl: '/api/placeholder/400/600',
      title: 'Community Gathering',
      description: 'Annual community gathering celebrating culture and connection',
      tags: ['community', 'celebration', 'culture'],
      filename: 'community-gathering.jpg',
      processingStatus: ProcessingStatus.COMPLETED,
      uploadedById: admin.id,
    },
    {
      type: MediaType.IMAGE,
      originalUrl: '/api/placeholder/600/400',
      cdnUrl: '/api/placeholder/600/400',
      title: 'Traditional Art Workshop',
      description: 'Elders teaching traditional dot painting techniques',
      tags: ['art', 'education', 'traditional'],
      filename: 'art-workshop.jpg',
      processingStatus: ProcessingStatus.COMPLETED,
      uploadedById: elder.id,
    },
    {
      type: MediaType.VIDEO,
      originalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      cdnUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: '/api/placeholder/600/400',
      title: 'Welcome to Oonchiumpa',
      description: 'An introduction to our mission and community',
      tags: ['welcome', 'mission', 'community'],
      filename: 'welcome-video.mp4',
      processingStatus: ProcessingStatus.COMPLETED,
      uploadedById: admin.id,
    },
  ];

  // Clear existing media items first
  await prisma.mediaItem.deleteMany();
  
  // Create media items
  await prisma.mediaItem.createMany({
    data: mediaItems,
  });

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin login: admin@oonchiumpa.org / admin123');
  console.log('👤 Elder login: elder@oonchiumpa.org / elder123');
}

export async function clearDatabase(prisma: PrismaClient) {
  console.log('🧹 Clearing database...');
  
  await prisma.contentApproval.deleteMany();
  await prisma.outcomeMetric.deleteMany();
  await prisma.mediaItem.deleteMany();
  await prisma.outcome.deleteMany();
  await prisma.story.deleteMany();
  await prisma.reportDocument.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('✅ Database cleared!');
}