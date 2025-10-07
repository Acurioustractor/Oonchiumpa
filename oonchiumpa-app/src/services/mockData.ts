import type { Story, Outcome, Media } from './api';

export const mockStories: Story[] = [
  {
    id: '1',
    title: 'The Dreaming of the Rainbow Serpent',
    subtitle: 'Ancient waterways and spiritual connection',
    content: `The Rainbow Serpent is one of the most important ancestral spirits in Aboriginal Dreaming stories. This powerful creator being is said to have carved out the rivers, mountains, and valleys as it moved across the land during the Dreamtime.

In our community, the story of the Rainbow Serpent teaches us about the sacred relationship between water, land, and all living things. Elder Mary Thompson shares how her grandmother would tell this story by the billabong, pointing out how the winding river followed the serpent's path.

The Rainbow Serpent represents both creation and destruction - bringing life-giving rains but also floods that reshape the landscape. This duality reminds us of the need for respect and balance in our relationship with the natural world.

Today, as we face environmental challenges, these ancient stories offer wisdom about living in harmony with Country. The Rainbow Serpent's journey continues to guide us in understanding our responsibility as caretakers of the land.`,
    author: 'Elder Mary Thompson',
    date: '2024-01-15',
    category: 'Dreamtime Stories',
    imageUrl: '/images/stories/IMG_9698.jpg',
    tags: ['dreamtime', 'spirituality', 'environment', 'creation'],
    culturalSignificance: 'This story connects us to Country and teaches sustainable living practices that have been passed down for thousands of years.'
  },
  {
    id: '2',
    title: 'Community Healing Through Art',
    subtitle: 'Using traditional painting to process trauma',
    content: `Art has always been central to Aboriginal culture - it is our way of telling stories, passing on knowledge, and healing together as a community. In our recent workshop series, community members came together to create a large collaborative artwork that tells the story of resilience.

The workshop began with smoking ceremony led by Uncle Jim, clearing the space and calling in good spirits. Participants of all ages worked with ochre, charcoal, and contemporary paints to create symbols representing their personal journeys and collective strength.

Sarah, a young mother who participated, shared: "When I put my hand in that ochre and made my mark on the canvas, I felt connected to thousands of years of my ancestors doing the same thing. It wasn't just painting - it was healing."

The completed artwork now hangs in our community center, serving as a daily reminder of our shared strength and cultural continuity. It demonstrates how traditional practices can address contemporary challenges while keeping our culture alive and vibrant.`,
    author: 'David Nguyen',
    date: '2024-02-20',
    category: 'Community Programs',
    imageUrl: '/images/stories/IMG_9713.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tags: ['art', 'healing', 'community', 'tradition'],
    culturalSignificance: 'Art serves as both cultural preservation and contemporary healing, maintaining our connection to ancestral practices.'
  },
  {
    id: '3',
    title: 'Seasons of Learning',
    subtitle: 'Traditional ecological knowledge for modern times',
    content: `Our ancestors lived by the subtle changes in the natural world, reading the land like a library. Today, these skills are more important than ever as we face climate change and environmental challenges.

Elder Robert teaches young people to read the signs that indicate seasonal changes - the angle of the sun, the behavior of animals, the flowering of native plants. This knowledge system, developed over 65,000 years, offers insights that complement modern scientific understanding.

"When the wattle starts blooming in this way," Elder Robert explains, pointing to the golden flowers, "we know the fish will be running in the rivers soon. My grandfather taught me this, and his grandfather taught him."

These teaching sessions happen on Country, walking the same paths our ancestors walked. Participants learn not just what to observe, but how to develop the patience and attentiveness that this knowledge requires.`,
    author: 'James Mitchell',
    date: '2024-03-10',
    category: 'Traditional Knowledge',
    imageUrl: '/images/hero/hero-main.jpg',
    tags: ['seasons', 'ecology', 'education', 'elders'],
    culturalSignificance: 'Traditional ecological knowledge demonstrates the sophisticated understanding of Country that sustained our people for millennia.'
  }
];

export const mockOutcomes: Outcome[] = [
  {
    id: '1',
    title: 'Cultural Education Program Launch',
    description: 'Successfully launched a comprehensive cultural education program in partnership with local schools.',
    impact: 'Over 500 students have gained deeper understanding of Aboriginal culture and history through authentic, Elder-led experiences.',
    metrics: [
      { label: 'Students Reached', value: 523 },
      { label: 'Schools Participating', value: 12 },
      { label: 'Cultural Sessions', value: 48 }
    ],
    date: '2024-02-01',
    location: 'Greater Sydney Region',
    beneficiaries: 523,
    imageUrl: '/images/stories/IMG_9698.jpg',
    category: 'Education'
  },
  {
    id: '2',
    title: 'Community Art Installation',
    description: 'Created a large-scale community art installation representing the local Aboriginal history and connection to Country.',
    impact: 'The installation serves as a permanent reminder of Aboriginal presence and culture, fostering respect and understanding in the broader community.',
    metrics: [
      { label: 'Community Members Involved', value: 85 },
      { label: 'Hours of Community Engagement', value: 240 },
      { label: 'Visitors per Month', value: 1200 }
    ],
    date: '2024-01-15',
    location: 'Circular Quay, Sydney',
    beneficiaries: 85,
    imageUrl: '/images/stories/IMG_9713.jpg',
    category: 'Art & Culture'
  },
  {
    id: '3',
    title: 'Traditional Healing Workshop Series',
    description: 'Delivered healing workshops combining traditional Aboriginal practices with contemporary therapeutic approaches.',
    impact: 'Participants reported significant improvements in mental health and cultural connection, with 90% continuing to use learned practices.',
    metrics: [
      { label: 'Participants', value: 156 },
      { label: 'Workshop Sessions', value: 24 },
      { label: 'Follow-up Rate', value: '90%' }
    ],
    date: '2023-12-01',
    location: 'Redfern Community Centre',
    beneficiaries: 156,
    imageUrl: '/images/hero/hero-main.jpg',
    category: 'Health & Wellbeing'
  }
];

export const mockPhotos: Media[] = [
  {
    id: '1',
    type: 'image',
    url: '/images/stories/IMG_9698.jpg',
    title: 'Community Gathering',
    description: 'Annual community gathering celebrating culture and connection',
    tags: ['community', 'celebration', 'culture'],
    date: '2024-01-20'
  },
  {
    id: '2',
    type: 'image',
    url: '/images/stories/IMG_9713.jpg',
    title: 'Traditional Art Workshop',
    description: 'Elders teaching traditional dot painting techniques',
    tags: ['art', 'education', 'traditional'],
    date: '2024-02-05'
  },
  {
    id: '3',
    type: 'image',
    url: '/images/hero/hero-main.jpg',
    title: 'Country Walk',
    description: 'Learning about native plants and their traditional uses',
    tags: ['country', 'education', 'plants'],
    date: '2024-02-15'
  },
  {
    id: '4',
    type: 'image',
    url: '/api/placeholder/700/500',
    title: 'Cultural Performance',
    description: 'Young people performing traditional dance',
    tags: ['performance', 'youth', 'dance'],
    date: '2024-03-01'
  },
  {
    id: '5',
    type: 'image',
    url: '/api/placeholder/400/500',
    title: 'Healing Circle',
    description: 'Community healing circle in session',
    tags: ['healing', 'community', 'wellbeing'],
    date: '2024-03-10'
  },
  {
    id: '6',
    type: 'image',
    url: '/api/placeholder/600/800',
    title: 'Elder Teaching',
    description: 'Elder sharing traditional knowledge with youth',
    tags: ['education', 'elders', 'knowledge'],
    date: '2024-03-15'
  }
];

export const mockVideos: Media[] = [
  {
    id: '1',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: '/api/placeholder/600/400',
    title: 'Welcome to Oonchiumpa',
    description: 'An introduction to our mission and community',
    tags: ['welcome', 'mission', 'community'],
    date: '2024-01-01'
  },
  {
    id: '2',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: '/api/placeholder/600/400',
    title: 'Traditional Weaving Techniques',
    description: 'Elder demonstrates traditional basket weaving',
    tags: ['traditional', 'weaving', 'crafts'],
    date: '2024-01-15'
  },
  {
    id: '3',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: '/api/placeholder/600/400',
    title: 'Community Stories Project',
    description: 'Youth sharing their cultural identity stories',
    tags: ['stories', 'youth', 'identity'],
    date: '2024-02-01'
  }
];
