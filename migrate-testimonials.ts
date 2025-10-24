import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Current testimonials from communityVoices.ts
const testimonials = [
  {
    name: "Adelaide Hayes",
    role: "Law Student, ANU",
    quote: "Coming to the end of my law degree, I wanted an experience that was genuinely enriching, genuinely challenging, and genuinely subversive. Working with elders and hearing their call to action has been transformative.",
    context: "Adelaide pursues a Bachelor of Law with Honors, seeking to infuse her legal education with Indigenous perspectives through engagement with Oonchiumpa and learning on country.",
    avatar_url: "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/d0a162d2-282e-4653-9d12-aa934c9dfa4e/1759627920417_Screenshot_2025-10-05_at_10.56.42_am.png",
    specialties: ["Legal Education", "Cultural Protocol", "Intergenerational Connection"],
    source: "Adelaide Hayes Law Student Reflection (2024)",
    impact_statement: "Adelaide's experience demonstrates how Oonchiumpa bridges legal education with lived Aboriginal experience. Law students engaging on country with elders transforms their understanding of justice from abstract principles to relational practice - exactly the shift needed in Australia's legal systems.",
    category: "law_student",
    display_order: 1,
    is_visible: true
  },
  {
    name: "Chelsea Kenneally",
    role: "Law Student, ANU",
    quote: "They're not lecturing at us in this formal sense - they're sitting on the same level, conversing with us. That's so beautiful because it comes from their passion for knowledge being passed down to them and now passing it on to us.",
    context: "Chelsea reflects on the relational approach to learning about Aboriginal law and culture, emphasizing the importance of respectful engagement and challenging media narratives.",
    specialties: ["Relationship Building", "Knowledge Transmission", "Cultural Protocol"],
    source: "Chelsea Kenneally Law Student Reflection (2024)",
    impact_statement: "Chelsea's reflection highlights Oonchiumpa's pedagogical approach - knowledge is shared through relationship, not hierarchy. This relational learning model, guided by cultural protocol, creates space for genuine understanding rather than extractive education.",
    category: "law_student",
    display_order: 2,
    is_visible: true
  },
  {
    name: "Aidan Harris",
    role: "Law & Public Policy Student, ANU",
    quote: "Learning about Aboriginal conceptions of law and kinship systems has been incredible. This program is so important for anyone going into a policy or legal role in government.",
    context: "Aidan studies law and public policy at ANU, dedicated to understanding multicultural Australia and preventing harmful policies born from ignorance about Indigenous communities.",
    avatar_url: "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/d0a162d2-282e-4653-9d12-aa934c9dfa4e/1759628229515_Screenshot_2025-10-05_at_11.36.59_am.png",
    specialties: ["System Navigation", "Knowledge Transmission", "Policy Reform"],
    source: "Aidan Harris Law Student Reflections (2024)",
    impact_statement: "Aidan's insight underscores why Oonchiumpa partners with future policymakers - understanding Aboriginal conceptions of law and kinship prevents the harmful interventions that have plagued Indigenous policy for generations. Cultural education creates better governance.",
    category: "law_student",
    display_order: 3,
    is_visible: true
  },
  {
    name: "Suzie Ma",
    role: "Law & Accounting Student, ANU",
    quote: "The law reduces people to categories and makes things really simplistic when in reality they're not. Being on this country with these stunning views and learning our true history changes everything.",
    context: "In her fifth year at ANU, Suzie seeks to transform her understanding of justice through a relational approach that honors community experiences and challenges reductive legal frameworks.",
    avatar_url: "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/d0a162d2-282e-4653-9d12-aa934c9dfa4e/1759628112665_Screenshot_2025-10-05_at_11.35.02_am.png",
    specialties: ["Cultural Protocol", "Relationship Building", "Deep Listening"],
    source: "Suzie Ma Law Student Reflection (2024)",
    impact_statement: "Suzie captures the transformation Oonchiumpa facilitates - moving from reductive legal categories to complex relational understanding. Learning on country, with true history, dismantles the simplistic frameworks that have failed Aboriginal people for decades.",
    category: "law_student",
    display_order: 4,
    is_visible: true
  },
  {
    name: "Youth Participant",
    role: "Program Participant",
    quote: "I think other kids should work with you mob; I think everyone should work with Oonchiumpa. I like working with you because you mob are good and help, it's good working with you mob.",
    context: "Young people describing their experience with Oonchiumpa's culturally-led approach, highlighting the trust and connection built through Aboriginal leadership and cultural authority.",
    specialties: ["Cultural Connection", "Youth Voice", "Trust Building"],
    source: "Oonchiumpa Project Evaluation Report (2024), Cultural Connection section",
    impact_statement: "This young person's endorsement reflects Oonchiumpa's core success - cultural authority and Aboriginal leadership create trust where mainstream services have failed. Youth recommend Oonchiumpa to their peers because they feel genuinely helped, not just managed or monitored.",
    category: "youth",
    display_order: 5,
    is_visible: true
  },
  {
    name: "Responsible Adult",
    role: "Family Member of Participant",
    quote: "J's other caseworker came out to visit, but J didn't want to work with him at the start she didn't feel comfortable, but J enjoys working with you two she works really well, they like working with Oonchiumpa.",
    context: "Family members describing how young people engage differently with Oonchiumpa compared to mainstream services, demonstrating the power of cultural safety and relationship-based practice.",
    specialties: ["Cultural Safety", "Family Partnership", "Service Engagement"],
    source: "Oonchiumpa Project Evaluation Report (2024), Participant Feedback section",
    impact_statement: "Family members witness what Oonchiumpa achieves - young people who refuse mainstream caseworkers engage willingly with Aboriginal-led services. Cultural safety isn't a buzzword; it's the measurable difference between disengagement and connection, between intervention failure and youth transformation.",
    category: "family",
    display_order: 6,
    is_visible: true
  }
];

async function migrateTestimonials() {
  console.log('🔄 Migrating testimonials data to database...\n');

  for (const testimonial of testimonials) {
    console.log(`Inserting: ${testimonial.name}`);

    const { error } = await supabase
      .from('testimonials')
      .insert(testimonial);

    if (error) {
      console.error(`❌ Error inserting ${testimonial.name}:`, error.message);
    } else {
      console.log(`✅ ${testimonial.name} inserted successfully`);
    }
  }

  console.log('\n✨ Testimonials migration complete!');

  // Verify
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order');

  if (error) {
    console.error('❌ Error verifying:', error);
  } else {
    console.log(`\n📊 Total testimonials in database: ${data?.length}`);
    console.log('\nBy category:');
    const byCat = data?.reduce((acc: any, t: any) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});
    console.log(byCat);
  }
}

migrateTestimonials();
