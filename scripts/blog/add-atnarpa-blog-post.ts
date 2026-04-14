import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvnuayzslukamizrlhwb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0NDg1MCwiZXhwIjoyMDcxODIwODUwfQ.natmxpGJM9oZNnCAeMKo_D3fvkBz9spwwzhw7vbkT0k';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const OONCHIUMPA_ORG_ID = 'c53077e1-98de-4216-9149-6268891ff62e';
const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

async function addAtnarpaBlogs() {
  console.log('📝 Adding Atnarpa Homestead Blog Post...\n');

  const blogContent = `## Meeting the Right People

About eighteen months ago, Tanya Turner and I sat down with these two blokes from A Curious Tractor. Some lawyers we knew had connected us, said we should meet. Twenty minutes into that yarn, we all knew something was different. They weren't coming with solutions or trying to tell us what we needed. They were actually listening.

I told them straight up what we've always known: "We know what we wanna do on our land, and we know how to get there. I think it's just about having our land councils, our government supporting us in delivering this and having culturally led... self-determination for us as aboriginal people."

That's not asking for permission. That's stating fact. We've always known what our community needs - we just need the right support to make it happen.

## The Homestead at Loves Creek

Our family's station sits 140 kilometers east of Alice Springs. The homestead was built in 1933 from rocks pulled straight from our Country, clay from the swamps around Loves Creek. Those walls are a metre thick - keeps the place cool in summer, warm in winter with that big fireplace in the middle.

My brother Shayne says it best: "Growing up here, mate, it's God's country. The mornings, the nights, the evenings... it sculpted me into the man I'm today."

But this place holds complicated truths. I don't hide from them. The heartache of our granny felt, being a slave out on our own country. The heartache of our father being fed in the water yard with the rest of the stockmen. That's the pain from our Aboriginal perspective against the homestead itself.

But there's also pride - being able to be acknowledged and recognised in the federal court to having land rights out on the country. We hold both truths. That's what sovereignty means - transforming places of trauma into spaces where we reclaim our power, without pretending the hard stuff didn't happen.

## The Week Everything Changed

When the opportunity came to fix the roof, our friends from A Curious Tractor showed up with electricians, carpenters, a volunteer paramedic. Monday morning, a whole convoy rolled in. My son Henry was there waiting, holding everything down while I was recovering at home.

The Welcome to Country we gave wasn't just ceremony - it was opening a door, inviting them in not just as workers but as family for this time. That's how we do things.

Henry kept everyone fed and working. He joked about it: "Good bunch of fellas. Bloody, as long as we keep the food up to 'em, they should be alright. Don't want 'em passing out on the job."

Six am starts with breakfast ready. Nine am, second breakfast. Everyone found their job - drilling, nailing, cleaning. Young Braydon, only fifteen, was doing dump runs in the truck, proud as anything: "I didn't think it would work, but we got it out somehow. But yeah, it was fun."

My sister Kylie saw what this meant: "This week has made a huge impact on our family and creating our own history... What they created here with us this week was unbelievable."

Henry watched our dad walk through the transformed space, getting emotional. Dad never thought he'd see the roof fixed in his lifetime.

## What We're Building

After the week finished and everyone went home, I sat in the quiet and talked about our ten-year vision. This isn't just about fixing buildings - it's about what we're leaving for our kids.

Kylie's focused on it too: "Our kids 10 years time, you know, that's our focus at the moment. Because they're so young. And then we are looking at 10 years time, where are they at, where they're schooling and everything. So a lot of the businesses that we have, the kids are looking at all these programs and studies to actually fall back on the businesses that we own."

Henry wants his kids growing up here like he did: "It's just good to be coming home... to grow my kids up here. And all the grandkids, as you can see, they running the muck here and they love it."

Shayne sees bigger - using this place to help youth from town who need direction: "I envisioned this place being, not so much a boot camp, but like for kids, juvenile assistance... Early morning. Get up, go for a walk. Take in that early morning brilliantness of the day... Whether it be learning about culture, learning about Bush tuckers, learning about land management, learning about cattle, driving trucks, driving cars."

## The Truth About Partnership

Kylie pointed out something important: "No one in Alice Springs would touch it. Get two blokes to bring five contractors in and done, done in a week."

That's what real partnership looks like. Not people coming to save us or fix us. People showing up with skills to support what we already know needs doing. They didn't interpret or explain our story - they just brought their tools and asked where we needed them.

The homestead stands now with its new roof. Those metre-thick walls built from Country itself hold our whole story - the pain, the pride, the future we're building. This is what self-determination actually looks like. Not waiting for permission. Not asking for charity. Just getting on with what we know needs doing, with the right people beside us.

We know what we wanna do on our land, and we know how to get there. Always have. The new roof at Atnarpa proves it - one nail, one beam, one shared meal at a time. This is our sovereignty. This is our story. And we're just getting started.

---

*To add images and videos to this post, you can embed them using markdown syntax:*

**For images:**
\`\`\`markdown
![Description of image](https://your-image-url.com/image.jpg)
\`\`\`

**For videos (YouTube/Vimeo):**
\`\`\`markdown
[![Video thumbnail](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)
\`\`\`

**For videos (Supabase storage):**
\`\`\`html
<video controls width="100%">
  <source src="https://your-storage-url.com/video.mp4" type="video/mp4">
</video>
\`\`\`
`;

  // Create the blog post
  const { data: post, error } = await supabase
    .from('blog_posts')
    .insert({
      title: 'Our Homestead, Our Story: The Atnarpa Restoration',
      content: blogContent,
      excerpt: 'About eighteen months ago, we met two blokes from A Curious Tractor who actually listened. This is the story of how partnership, sovereignty, and self-determination came together to restore our family homestead at Loves Creek.',
      author: 'Oonchiumpa Community',
      tags: ['Atnarpa', 'Homestead', 'Self-Determination', 'Partnership', 'Sovereignty', 'Family', 'Country'],
      type: 'community-story',
      status: 'published',
      published_at: new Date().toISOString(),
      cultural_review: true,
      elder_approved: true,
      hero_image: null, // You can add this later
      gallery: [] // Array for multiple images
    })
    .select()
    .single();

  if (error) {
    console.log('❌ Error creating blog post:', error.message);
    return;
  }

  console.log('✅ Blog post created successfully!');
  console.log(`   ID: ${post.id}`);
  console.log(`   Title: ${post.title}`);
  console.log(`   Status: ${post.status}`);
  console.log(`\n📖 View at: http://localhost:3001/blog/${post.id}`);

  console.log('\n📸 Next steps:');
  console.log('1. Upload images/videos to Supabase Storage');
  console.log('2. Edit the blog post to add image URLs');
  console.log('3. Add a featured image for the blog card');
}

addAtnarpaBlogs().catch(console.error);
