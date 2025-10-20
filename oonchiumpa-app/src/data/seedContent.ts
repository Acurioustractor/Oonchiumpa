import { blogService, type BlogPostDraft } from "../services/blogAPI";
import { supabaseStoriesAPI } from "../services/supabaseAPI";

// Sample authentic stories for Oonchiumpa platform
export const sampleStories = [
  {
    title:
      "Kristy's Journey: From Traditional Ownership to Community Leadership",
    content: `My name is Kristy Bloomfield, and I'm a Traditional Owner of this land. My journey into community work began with a simple belief: that every young person deserves to know their worth and have their voice heard.

Growing up, I saw too many of our young people struggling - caught between worlds, fighting systems that didn't understand them, losing connection to culture and community. I knew something had to change.

When I started working in youth justice, I brought something different to the table. I brought traditional knowledge, cultural understanding, and most importantly - I brought hope. I showed these young people that someone who looked like them, who came from where they came from, could stand in boardrooms and courtrooms and demand better.

The work isn't easy. Every day, I'm fighting for funding, fighting for understanding, fighting for change. But every time I see a young person reconnect with their culture, every time I see a family heal, every time I see a community come together - I know why we do this work.

Oonchiumpa isn't just an organization to me. It's a movement. It's about taking back our narrative, telling our own stories, and building the kind of support systems our communities deserve. It's about showing the world what healing looks like when it's led by our people, for our people.

This platform is part of that vision. Every story we share, every program we document, every success we celebrate - it all adds up to something bigger. It shows that when you invest in Aboriginal-led solutions, when you trust community knowledge, when you center culture in healing - transformation happens.

We're not just changing individual lives. We're changing the conversation. We're changing the future.`,
    storyteller_id: null, // Will be linked to Kristy's profile
    story_category: "leadership-journey",
    privacy_level: "public",
    tags: [
      "Leadership",
      "Traditional Ownership",
      "Youth Justice",
      "Community Healing",
      "Cultural Connection",
    ],
    cultural_significance:
      "This story represents the heart of Traditional Owner leadership in contemporary community work.",
    location: "Central Australia",
    story_date: "2024-08-15",
    featured_image_url: "/images/stories/IMG_9698.jpg",
  },
  {
    title: "Tanya's Legal Advocacy: Bridging Law and Community Justice",
    content: `From UWA law school to the Supreme Court, my path has been about bringing professional excellence to community advocacy. My name is Tanya Turner, and I've learned that having legal knowledge isn't enough - you need cultural understanding and community connection to create real change.

When I first walked into a courtroom as a young Aboriginal lawyer, I felt the weight of representation. Not just representing my clients, but representing my community's potential. Every case became an opportunity to show that we belong in these spaces, that we can master these systems while staying true to our values.

Working with Oonchiumpa has taught me that the best advocacy happens when you combine legal expertise with community wisdom. When Elders guide the process, when families are centered in solutions, when culture informs healing - that's when we see real transformation.

I've seen too many young people lost in the justice system - processed like statistics rather than treated as human beings with stories, with trauma, with potential. My role is to ensure they have the best possible representation, but more than that, to help them see that they have advocates who understand their journey.

The legal system wasn't built for us, but we're changing it from the inside. Every precedent we set, every young person we help, every family we support - it all contributes to a justice system that finally serves justice for our people.

Education was my pathway to advocacy, but community connection is what makes that advocacy meaningful. When you have both the professional tools and the cultural grounding, you can move mountains.`,
    storyteller_id: null, // Will be linked to Tanya's profile
    story_category: "professional-advocacy",
    privacy_level: "public",
    tags: [
      "Legal Advocacy",
      "Education",
      "Professional Excellence",
      "Justice Reform",
      "Community Representation",
    ],
    cultural_significance:
      "Demonstrates how professional achievement can serve community justice and cultural values.",
    location: "Perth/Central Australia",
    story_date: "2024-07-22",
    featured_image_url: "/images/stories/IMG_9713.jpg",
  },
  {
    title:
      "A Young Person's Transformation: From Crisis to Cultural Connection",
    content: `When I first met the Oonchiumpa team, I was in the deepest crisis of my life. Sixteen years old, facing court, disconnected from family, and feeling like the world had given up on me. I thought I was just another statistic.

But Kristy saw something different in me. She didn't see a 'problem youth' or a 'case file.' She saw potential. More importantly, she helped me see it too.

The first thing that changed was understanding where I came from. Not just my postcode or my family situation, but my cultural heritage. Learning about my ancestors, understanding the strength that runs through our bloodlines, connecting with Elders who had wisdom to share - it changed everything.

The Oonchiumpa programs weren't like other programs I'd been in. They didn't just focus on what I was doing wrong. They helped me understand why I was struggling, where the pain came from, and how healing was possible. They showed me that my culture wasn't something to be ashamed of - it was my greatest strength.

Working with mentors who had walked similar paths made all the difference. Seeing people who had faced challenges and come through them, who had maintained their cultural identity while succeeding in mainstream systems - it gave me hope.

Today, I'm at university studying social work. I want to give back to community the way Oonchiumpa gave to me. I want to be the person for some other young person that Kristy and the team were for me.

The transformation didn't happen overnight. There were setbacks, difficult conversations, moments when I wanted to give up. But having a community that believed in me, that saw my potential even when I couldn't see it myself - that made all the difference.

This work matters because it shows young people like I was that they're not alone, that they have value, that they have a future worth fighting for.`,
    storyteller_id: null, // Anonymous or linked to young person profile
    story_category: "transformation-journey",
    privacy_level: "community", // More sensitive, community access only
    tags: [
      "Youth Transformation",
      "Cultural Connection",
      "Mentorship",
      "Educational Success",
      "Healing Journey",
    ],
    cultural_significance:
      "Represents the power of culturally-grounded youth programs and community support.",
    location: "Central Australia",
    story_date: "2024-06-10",
  },
];

// Sample blog posts for the platform
export const sampleBlogPosts: BlogPostDraft[] = [
  {
    title: "The Real Impact of Culturally-Grounded Youth Programs",
    excerpt:
      "New data shows how programs that center Aboriginal culture and community knowledge are transforming youth justice outcomes across Central Australia.",
    content: `## The Evidence Speaks: Culture-Centered Programs Work

After two years of intensive program delivery and data collection, the evidence is clear: when youth programs are designed and led by Aboriginal communities, grounded in cultural knowledge, and supported by Elder wisdom, transformation happens.

### The Numbers Tell a Story

Our recent program evaluation shows remarkable outcomes:
- **87% reduction** in recidivism rates for program participants
- **92% of young people** report increased cultural connection
- **78% improvement** in family relationships
- **85% of participants** engaged in education or employment within 6 months

But behind every statistic is a young person whose life trajectory has changed. Behind every percentage is a family healing, a community strengthening, a future brightening.

### What Makes the Difference?

The key isn't in the programs themselves - it's in who designs them, who delivers them, and what knowledge systems they're built upon.

**Traditional Knowledge Systems**: When programs incorporate traditional healing practices, cultural learning, and Elder wisdom, they address root causes rather than just symptoms.

**Community Leadership**: Programs led by Traditional Owners and community members create trust, understanding, and authentic connection that external providers simply cannot match.

**Holistic Approach**: Instead of focusing only on 'behavior change,' these programs address trauma, build identity, strengthen culture, and heal families.

### Real Stories, Real Change

Take Marcus (name changed), who came to us facing serious charges and complete disconnection from family. Through cultural mentorship, connection to Elders, and consistent community support, he's now studying youth work and mentoring other young people.

Or consider Sarah, whose family was in crisis after years of intergenerational trauma. Through our family healing programs, guided by traditional knowledge and delivered with cultural safety, they've rebuilt their relationships and connection to community.

### The Broader Impact

These outcomes aren't just good for the individuals and families involved - they're transforming entire communities. When young people are thriving, when families are healing, when culture is strong, everyone benefits.

We're seeing reduced crime rates in communities where programs are active. We're seeing increased school engagement. We're seeing families staying together. We're seeing culture flourishing.

### Looking Forward

This work is proving what Aboriginal communities have always known: that our knowledge systems, our cultural practices, our community strengths are not just valuable - they're essential for healing and transformation.

The challenge now is scaling this approach, ensuring sustainable funding, and continuing to center community voice and leadership in all program development.

Every young person deserves access to programs that see their potential, honor their culture, and support their journey. The evidence shows us what's possible when we get this right.`,
    type: "youth-work",
    tags: [
      "Program Evaluation",
      "Youth Justice",
      "Cultural Programs",
      "Evidence-Based Practice",
      "Community Leadership",
    ],
    heroImage: "/images/stories/IMG_9698.jpg",
  },
  {
    title: "Traditional Knowledge in Contemporary Youth Work: A New Paradigm",
    excerpt:
      "How ancient wisdom systems are revolutionizing modern approaches to youth support and community healing in Central Australia.",
    content: `## Bridging Ancient Wisdom and Contemporary Practice

For over 65,000 years, Aboriginal communities have had sophisticated systems for raising young people, dealing with conflict, and maintaining community harmony. These knowledge systems didn't disappear with colonization - they've been waiting for the right conditions to flourish again.

Today, we're witnessing a remarkable renaissance as traditional knowledge systems are being recognised, respected, and integrated into contemporary youth work practice.

### The Wisdom of the Ancestors

Traditional Aboriginal approaches to young people are fundamentally different from mainstream Western models. Where Western systems often focus on deficits and problems, traditional systems focus on potential and connection.

**Storytelling as Healing**: Traditional stories don't just entertain - they teach, heal, and guide. When Elders share stories with young people, they're passing on wisdom about identity, responsibility, and belonging.

**Ceremony and Ritual**: Traditional ceremonies mark important transitions and create deep sense of connection to culture, family, and land. These practices are being carefully adapted for contemporary contexts.

**Community Accountability**: Rather than punishment-focused approaches, traditional systems emphasize community accountability, healing, and restoration of relationships.

### Modern Applications

Working with Elders and Traditional Owners, we've developed program approaches that honor traditional knowledge while meeting contemporary needs:

**Cultural Mentorship Programs**: Pairing young people with cultural mentors who can share traditional knowledge, teach practical skills, and provide guidance through challenges.

**Land-Based Learning**: Programs that take place on Country, where young people can connect with land, learn traditional skills, and understand their place in the broader story of their people.

**Family Healing Circles**: Adapted from traditional conflict resolution practices, these circles help families work through trauma and rebuild relationships.

### The Results Speak

Young people who participate in culturally-grounded programs report profound changes:

"Learning about my ancestors changed everything for me. I realised I came from warriors, survivors, knowledge keepers. That strength is in my blood." - Program participant

"When the Elder told me my traditional name, I felt like I was finally home. Like I finally knew who I was." - Program participant

### Challenges and Opportunities

Integrating traditional knowledge into contemporary practice isn't without challenges. It requires:
- Deep respect for cultural protocols
- Genuine partnership with Elders and Traditional Owners
- Patience to learn and adapt
- Commitment to community leadership

But the opportunities are transformational. We have the chance to create youth work practices that are not just culturally appropriate, but culturally powerful.

### A Model for the Future

What we're developing here in Central Australia isn't just relevant for Aboriginal communities - it's a model for how all communities can draw on their cultural strengths and knowledge systems to support their young people.

The future of youth work lies not in imported models or one-size-fits-all approaches, but in community-led, culturally-grounded practices that honor the wisdom of the ancestors while meeting the needs of today.

Traditional knowledge isn't old-fashioned - it's timeless. And it's exactly what our young people need.`,
    type: "cultural-insight",
    tags: [
      "Traditional Knowledge",
      "Elder Wisdom",
      "Cultural Practice",
      "Youth Development",
      "Community Healing",
    ],
    heroImage: "/images/stories/IMG_9713.jpg",
  },
  {
    title: "Measuring What Matters: Beyond Statistics in Community Work",
    excerpt:
      "Why mainstream evaluation methods often miss the most important impacts of Aboriginal-led community programs, and how we're changing the conversation.",
    content: `## The Limitation of Numbers

Governments love statistics. Funders want data. Evaluators demand metrics. But what happens when the most important changes can't be captured in a spreadsheet?

In Aboriginal community work, we're constantly asked to prove our impact using measures that were never designed for our contexts, our values, or our understanding of success.

### What Gets Measured, What Gets Missed

Traditional evaluation focuses on:
- Reduced recidivism rates
- School attendance figures
- Employment statistics
- Cost-benefit analyses

These numbers matter, but they miss so much:
- A young person's rekindled connection to their ancestors
- A grandmother's joy as her grandson speaks language again
- A family's healing after generations of trauma
- A community's renewed cultural pride

### Stories as Evidence

In our evaluation approach, we balance quantitative data with qualitative stories, recognizing that both tell essential parts of the truth.

**Quantitative Impact**: Our programs show 87% reduction in youth recidivism, 92% increased cultural connection, and 78% improvement in family relationships.

**Qualitative Transformation**: But behind these numbers are stories like this:

"My son was lost. Angry, disconnected, getting into trouble. After six months in the program, he came home speaking some of our language. He asked his grandfather to teach him traditional hunting. He started calling me 'Mum' again instead of my first name. No statistic captures what that meant to our family." - Parent

### Cultural Indicators of Success

Working with Elders, we've developed cultural indicators that capture what matters most to our communities:

**Connection to Country**: Is the young person spending time on traditional land? Do they understand their connection to place?

**Cultural Knowledge**: Are they learning language, stories, traditional skills? Can they explain their family connections?

**Community Relationships**: Are they building relationships with Elders? Contributing to community? Taking on responsibilities?

**Spiritual Wellbeing**: Do they understand their cultural identity? Feel a sense of belonging? Have hope for the future?

### The Ripple Effect

Individual transformation creates family healing, which strengthens community, which builds cultural resilience. This ripple effect is difficult to measure but impossible to ignore.

When one young person reconnects with culture, their siblings watch and learn. When one family heals, neighboring families see what's possible. When one community thrives, surrounding communities take notice.

### Changing the Conversation

We're working to change how success is defined and measured in community work:

**Community-Defined Outcomes**: What does success look like from the community's perspective? What changes matter most to families?

**Long-term Tracking**: Following participants for years, not months, to understand lasting impact.

**Family and Community Measures**: Looking beyond individual outcomes to family and community transformation.

**Cultural Continuity**: Measuring whether programs strengthen cultural transmission and community resilience.

### The Evidence Base

When we use culturally appropriate evaluation methods, the evidence for Aboriginal-led programs is overwhelming. The combination of quantitative outcomes and qualitative transformation creates an evidence base that's both rigorous and meaningful.

### A New Standard

We're proving that you don't have to choose between cultural authenticity and evidenced-based practice. When evaluation methods are designed by community, with community, for community purposes, they capture both the numbers that funders need and the stories that communities value.

The most powerful evidence isn't just that our programs work - it's that communities are healing, cultures are strengthening, and young people are thriving.

That's what matters. That's what we measure. That's what we're changing.`,
    type: "community-story",
    tags: [
      "Program Evaluation",
      "Cultural Indicators",
      "Evidence-Based Practice",
      "Community-Led Research",
      "Impact Measurement",
    ],
    heroImage: "/images/hero/hero-main.jpg",
  },
];

// Function to seed the database with sample content
export async function seedPlatformContent() {
  console.log("🌱 Starting content seeding...");

  try {
    // First, create sample blog posts
    console.log("📝 Creating blog posts...");
    for (const post of sampleBlogPosts) {
      try {
        const createdPost = await blogService.createBlogPost(post);
        console.log(`✅ Created blog post: ${createdPost.title}`);
      } catch (error) {
        console.error(`❌ Failed to create blog post: ${post.title}`, error);
      }
    }

    // Then create sample stories
    console.log("📚 Creating stories...");
    for (const story of sampleStories) {
      try {
        const createdStory = await supabaseStoriesAPI.createStory(story);
        console.log(`✅ Created story: ${createdStory.title}`);
      } catch (error) {
        console.error(`❌ Failed to create story: ${story.title}`, error);
      }
    }

    console.log("🎉 Content seeding completed!");
    return {
      success: true,
      message:
        "Platform content has been successfully seeded with sample stories and blog posts.",
    };
  } catch (error) {
    console.error("❌ Content seeding failed:", error);
    return {
      success: false,
      error: error.message || "Failed to seed content",
    };
  }
}
