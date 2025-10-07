import { PrismaClient } from '@prisma/client';

export async function seedCulturalAdvisorySystem(prisma: PrismaClient) {
  console.log('🌱 Seeding cultural advisory system...');

  // Create Cultural Advisors
  const culturalAdvisors = [
    {
      name: 'Krusty Bloofield',
      title: 'Elder and Traditional Knowledge Keeper',
      community: 'Yuin Nation',
      specialties: ['Dreamtime Stories', 'Traditional Healing', 'Ceremony', 'Women\'s Business'],
      contactEmail: 'krusty.bloofield@community.org',
      contactPhone: '+61 400 123 456',
      bio: 'Krusty Bloofield is a respected Elder of the Yuin Nation with over 40 years of experience in cultural teaching and community leadership. She specializes in women\'s business, traditional healing practices, and the preservation of Dreamtime stories. Krusty has been instrumental in establishing cultural protocols for sharing sacred stories and ensuring proper cultural consultation processes.',
      profileImage: '/api/placeholder/200/200'
    },
    {
      name: 'Uncle Robert Williams',
      title: 'Senior Cultural Advisor',
      community: 'Dharug Nation',
      specialties: ['Men\'s Business', 'Land Management', 'Traditional Ecological Knowledge'],
      contactEmail: 'robert.williams@community.org',
      contactPhone: '+61 400 234 567',
      bio: 'Uncle Robert Williams brings decades of experience in traditional ecological knowledge and land management. He works closely with communities to ensure cultural practices are maintained and properly shared. His expertise in men\'s business and ceremonial protocols makes him invaluable for cultural consultations.',
      profileImage: '/api/placeholder/200/200'
    },
    {
      name: 'Aunty Patricia Thompson',
      title: 'Cultural Protocol Specialist',
      community: 'Wiradjuri Nation',
      specialties: ['Art and Symbols', 'Cultural Protocols', 'Youth Education'],
      contactEmail: 'patricia.thompson@community.org',
      contactPhone: '+61 400 345 678',
      bio: 'Aunty Patricia Thompson is a leading authority on Aboriginal art, symbols, and cultural protocols. She has worked extensively with schools and cultural institutions to ensure appropriate representation of Aboriginal culture. Her focus on youth education helps bridge traditional knowledge with contemporary learning.',
      profileImage: '/api/placeholder/200/200'
    }
  ];

  // Clear existing data
  await prisma.dreamingStoryProtocol.deleteMany();
  await prisma.culturalConsultation.deleteMany();
  await prisma.culturalAdvisor.deleteMany();

  // Create advisors
  const createdAdvisors = [];
  for (const advisorData of culturalAdvisors) {
    const advisor = await prisma.culturalAdvisor.create({
      data: advisorData
    });
    createdAdvisors.push(advisor);
  }

  // Create some sample Dreaming story protocols
  const dreamingProtocols = [
    {
      storyTitle: 'The Dreaming of the Rainbow Serpent',
      storyType: 'Creation Dreaming',
      traditionalOwners: ['Yuin Nation', 'Multiple Nations'],
      geographicOrigin: 'South Coast NSW',
      seasonalRestrictions: [],
      genderRestrictions: 'Suitable for all',
      ageRestrictions: 'Suitable for children and adults',
      ceremonialContext: 'General teaching story, appropriate for public sharing',
      sharingPermissions: 'PUBLIC_WITH_ATTRIBUTION',
      consultationRequired: true,
      advisorId: createdAdvisors[0].id, // Krusty Bloofield
      validatedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    },
    {
      storyTitle: 'Women\'s Healing Ceremonies',
      storyType: 'Healing Practices',
      traditionalOwners: ['Yuin Nation'],
      geographicOrigin: 'South Coast NSW',
      seasonalRestrictions: ['Summer ceremonies', 'Full moon gatherings'],
      genderRestrictions: 'Women only',
      ageRestrictions: 'Initiated women 18+',
      ceremonialContext: 'Sacred women\'s business - restricted sharing',
      sharingPermissions: 'RESTRICTED_ELDERS',
      consultationRequired: true,
      advisorId: createdAdvisors[0].id, // Krusty Bloofield
      validatedAt: new Date(),
      expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
    },
    {
      storyTitle: 'Traditional Fire Management',
      storyType: 'Ecological Knowledge',
      traditionalOwners: ['Dharug Nation'],
      geographicOrigin: 'Sydney Region',
      seasonalRestrictions: ['Cool season burns only', 'Post-breeding season'],
      genderRestrictions: 'Suitable for all',
      ageRestrictions: 'Adult supervision required for children',
      ceremonialContext: 'Traditional ecological practice for land management',
      sharingPermissions: 'COMMUNITY_ONLY',
      consultationRequired: true,
      advisorId: createdAdvisors[1].id, // Uncle Robert Williams
      validatedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    }
  ];

  for (const protocolData of dreamingProtocols) {
    await prisma.dreamingStoryProtocol.create({
      data: protocolData
    });
  }

  // Get admin user for sample consultations
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@oonchiumpa.org' }
  });

  if (adminUser) {
    // Create some sample consultations
    const sampleConsultations = [
      {
        contentType: 'story',
        contentId: 'sample-story-1',
        purpose: 'Need cultural validation for new Dreamtime story about water spirits before publishing',
        status: 'SCHEDULED',
        priority: 'HIGH',
        requestedById: adminUser.id,
        advisorId: createdAdvisors[0].id, // Krusty Bloofield
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        notes: 'Story involves sacred water sites and traditional women\'s knowledge',
      },
      {
        contentType: 'outcome',
        contentId: 'healing-workshop-outcome',
        purpose: 'Review healing workshop content for cultural appropriateness and sensitivity',
        status: 'COMPLETED',
        priority: 'MEDIUM',
        requestedById: adminUser.id,
        advisorId: createdAdvisors[0].id, // Krusty Bloofield
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        notes: 'Reviewed workshop materials and participant feedback',
        recommendations: 'Workshop content is culturally appropriate. Recommend adding acknowledgment of traditional healing practices and ensuring Elder presence at future workshops.',
        culturalSensitivityRating: 4,
        approvalStatus: 'APPROVED',
      },
      {
        contentType: 'media',
        contentId: 'art-installation-photos',
        purpose: 'Cultural consultation for community art installation documentation',
        status: 'IN_PROGRESS',
        priority: 'LOW',
        requestedById: adminUser.id,
        advisorId: createdAdvisors[2].id, // Aunty Patricia Thompson
        notes: 'Photos include traditional symbols and community members',
      }
    ];

    for (const consultationData of sampleConsultations) {
      await prisma.culturalConsultation.create({
        data: consultationData
      });
    }
  }

  console.log('✅ Cultural advisory system seeded successfully!');
  console.log('👩‍🏫 Cultural Advisors created:');
  console.log('   - Krusty Bloofield (Elder and Traditional Knowledge Keeper)');
  console.log('   - Uncle Robert Williams (Senior Cultural Advisor)');
  console.log('   - Aunty Patricia Thompson (Cultural Protocol Specialist)');
  console.log('📋 Created protocols for Dreaming stories and cultural practices');
  console.log('🤝 Sample consultations created for testing workflow');
}