/**
 * Team & Community Directory
 *
 * Single source of truth for everyone displayed on the /team page.
 * To add a person: add an entry to the appropriate array below.
 *
 * Categories:
 *   leaders    — Directors, Traditional Owners, Elders
 *   staff      — Case workers, coordinators, program staff
 *   community  — Partners, volunteers, law students, supporters
 *
 * Photo tips:
 *   - Upload to Supabase Storage under profile-images/
 *   - Or use /images/team/ for local images
 *   - Square crop, minimum 400x400px
 *   - If no photo, initials are generated automatically
 */

export interface TeamMember {
  name: string;
  role: string;
  category: "leader" | "staff" | "community";
  photo?: string;
  bio?: string;
  quote?: string;
  isElder?: boolean;
  location?: string;
  specialties?: string[];
  order?: number; // lower = shown first within category
}

// ─── Leaders ─────────────────────────────────────────────────────────────────

export const leaders: TeamMember[] = [
  {
    name: "Kristy Bloomfield",
    role: "Traditional Owner & Director",
    category: "leader",
    photo:
      "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/profile-images/storytellers/kristy_bloomfield.jpg",
    bio: "Kristy brings Traditional Owner authority on Arrernte Country, stewarding Elder councils, knowledge systems, and land management at Atnarpa.",
    quote:
      "We want to create generational wealth on our own land and bring partners with us, not have solutions done to us.",
    isElder: false,
    location: "Arrernte Country",
    specialties: ["Generational Wealth", "Land Rights", "Youth Leadership"],
    order: 1,
  },
  {
    name: "Tanya Turner",
    role: "Legal Advocate & Strategist",
    category: "leader",
    photo:
      "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/profile-images/storytellers/tanya_turner.jpg",
    bio: "Tanya navigates the legal and policy systems, translating community priorities into agreements, funding, and reform.",
    quote:
      "I always had this sense of things needing to be just and fair and equal for people; that's why I brought the law home.",
    location: "Alice Springs",
    specialties: ["Justice Reform", "Systems Change", "Community Advocacy"],
    order: 2,
  },
];

// ─── Staff ───────────────────────────────────────────────────────────────────
// Add staff members here. Example:
//
// {
//   name: "First Last",
//   role: "Youth Case Worker",
//   category: "staff",
//   photo: "/images/team/first-last.jpg",
//   bio: "Short bio about their work and background.",
//   location: "Alice Springs",
//   order: 1,
// },

export const staff: TeamMember[] = [];

// ─── Community ───────────────────────────────────────────────────────────────

export const community: TeamMember[] = [
  {
    name: "Adelaide Hayes",
    role: "Law Student, ANU",
    category: "community",
    photo:
      "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/d0a162d2-282e-4653-9d12-aa934c9dfa4e/1759627920417_Screenshot_2025-10-05_at_10.56.42_am.png",
    quote:
      "Working with elders and hearing their call to action has been transformative.",
    specialties: ["Legal Education", "Cultural Protocol"],
    order: 1,
  },
  {
    name: "Chelsea Kenneally",
    role: "Law Student, ANU",
    category: "community",
    quote:
      "They're not lecturing at us in this formal sense — they're sitting on the same level, conversing with us.",
    specialties: ["Knowledge Transmission", "Cultural Protocol"],
    order: 2,
  },
  {
    name: "Aidan Harris",
    role: "Law & Public Policy Student, ANU",
    category: "community",
    photo:
      "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/d0a162d2-282e-4653-9d12-aa934c9dfa4e/1759628229515_Screenshot_2025-10-05_at_11.36.59_am.png",
    quote:
      "Learning about Aboriginal conceptions of law and kinship systems has been incredible.",
    specialties: ["Policy Reform", "Knowledge Transmission"],
    order: 3,
  },
  {
    name: "Suzie Ma",
    role: "Law & Accounting Student, ANU",
    category: "community",
    photo:
      "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/d0a162d2-282e-4653-9d12-aa934c9dfa4e/1759628112665_Screenshot_2025-10-05_at_11.35.02_am.png",
    quote:
      "Being on this country with these stunning views and learning our true history changes everything.",
    specialties: ["Cultural Protocol", "Deep Listening"],
    order: 4,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getAllMembers(): TeamMember[] {
  return [...leaders, ...staff, ...community].sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99),
  );
}

export function getByCategory(
  category: TeamMember["category"],
): TeamMember[] {
  const source =
    category === "leader"
      ? leaders
      : category === "staff"
        ? staff
        : community;
  return [...source].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
