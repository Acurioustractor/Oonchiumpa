export interface LeadershipVoice {
  name: string;
  role: string;
  quote: string;
  context: string;
  avatar?: string;
  specialties?: string[];
  source?: string;
}

export const leadershipVoices: LeadershipVoice[] = [
  {
    name: "Kristy Bloomfield",
    role: "Traditional Owner & Director",
    quote:
      "We want to create generational wealth on our own land and bring partners with us, not have solutions done to us.",
    context:
      "Kristy speaks from Arrernte Country about using cultural authority to drive economic development that keeps young people connected to home.",
    avatar: "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/profile-images/storytellers/kristy_bloomfield.jpg",
    specialties: ["Generational Wealth", "Land Rights", "Youth Leadership"],
    source: "Kristy Bloomfield interview (Loves Creek, 2024)",
  },
  {
    name: "Tanya Turner",
    role: "Legal Advocate & Strategist",
    quote:
      "I always had this sense of things needing to be just and fair and equal for people; that's why I brought the law home.",
    context:
      "Tanya returned from the Supreme Court of Victoria to Central Australia so legal systems and community wisdom could work side by side.",
    avatar: "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/profile-images/storytellers/tanya_turner.jpg",
    specialties: ["Justice Reform", "Systems Change", "Community Advocacy"],
    source: "Tanya Turner interview (Two-World Leadership, 2024)",
  },
];
