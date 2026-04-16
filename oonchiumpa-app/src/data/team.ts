/**
 * Team & Community Directory
 * ===========================
 *
 * The /team page reads people from TWO sources, in this order:
 *
 *   1. Empathy Ledger (live)  — preferred source of truth.
 *      Anyone added in EL with `membership_type` of `leadership`,
 *      `staff`, or `partner` and `is_public = true` is fetched at
 *      runtime via `useOrgPeople()` and REPLACES the matching list
 *      below. This means adding a real staff record in EL silently
 *      retires the placeholders here — no code change needed.
 *
 *   2. Static fallback (this file) — shown only when EL returns
 *      nothing for a given category. Use it to publish names quickly
 *      while the EL record is still being prepared.
 *
 * ── Adding a person RIGHT NOW (static, no EL needed) ──────────────
 *   • Find the right array below: leaders / staff / community.
 *   • For staff, replace one of the existing entries — just fill in
 *     `name`, optional `role`, `bio`, `quote`, `location`. Keep the
 *     `slotId` and `photo` so the Photo Swap Widget can swap the
 *     portrait later from Empathy Ledger.
 *   • For leaders/community, add a new object to the array with the
 *     same shape; give it a fresh `slotId` (e.g. team-leader-aliname).
 *   • Photos: either point `photo` at /images/team/<file>.jpg or paste
 *     a Supabase Storage URL. Square crop, ≥400×400. With a `slotId`
 *     editors can also swap the photo from the Media Widget.
 *
 * ── Adding a person THE PROPER WAY (Empathy Ledger) ───────────────
 *   • Go to Empathy Ledger admin (https://www.empathyledger.com).
 *   • Create a person under the "oonchiumpa" organisation.
 *   • Set `membership_type` to one of: leadership | staff | partner.
 *   • Mark `is_public = true` and upload `public_avatar_url`.
 *   • Refresh the site — the new record appears automatically and
 *     overrides the static list above for that category.
 *
 * Categories:
 *   leaders   : Directors, Traditional Owners, Elders     → EL `leadership`
 *   staff     : Case workers, coordinators, program staff → EL `staff`
 *   community : Partners, volunteers, supporters          → EL `partner`
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
  /**
   * Optional Empathy Ledger slot id. When set, the photo renders through
   * EditableImage and becomes swappable from the Photo Swap Widget.
   */
  slotId?: string;
}

// ─── Leaders ─────────────────────────────────────────────────────────────────

export const leaders: TeamMember[] = [
  {
    name: "Kristy Bloomfield",
    role: "Traditional Owner & Director",
    category: "leader",
    slotId: "team-leader-kristy",
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
    slotId: "team-leader-tanya",
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
//
// Eleven staff tiles, in the order they appear in the 2024 group photo
// (back row L→R = 1-8, front row L→R = 9-11). Photos exist on disk at
// /images/team/staff-NN.jpg and render through EditableImage so editors
// can also swap a portrait via the Photo Swap Widget.
//
// To name a staff member: replace `name: ""` with the real name, set
// `role` to their actual title, and (optionally) add `bio`, `quote`,
// `location`, `specialties`. Keep the `slotId` and `photo` so the
// existing photo and any Empathy Ledger override survive.
//
// Once a staff record is created in Empathy Ledger with
// membership_type='staff', is_public=true, the live EL feed REPLACES
// this whole list at runtime — at that point you can delete the
// matching entry below (the EL avatar takes over).

export const staff: TeamMember[] = [
  // Back row, left → right
  { name: "", role: "Oonchiumpa staff", category: "staff", photo: "/images/team/staff-01.jpg", slotId: "team-staff-01", order: 1 },
  { name: "", role: "Oonchiumpa staff", category: "staff", photo: "/images/team/staff-02.jpg", slotId: "team-staff-02", order: 2 },
  { name: "", role: "Oonchiumpa staff", category: "staff", photo: "/images/team/staff-03.jpg", slotId: "team-staff-03", order: 3 },
  { name: "", role: "Oonchiumpa staff", category: "staff", photo: "/images/team/staff-04.jpg", slotId: "team-staff-04", order: 4 },
  { name: "", role: "Oonchiumpa staff", category: "staff", photo: "/images/team/staff-05.jpg", slotId: "team-staff-05", order: 5 },
  { name: "", role: "Oonchiumpa staff", category: "staff", photo: "/images/team/staff-06.jpg", slotId: "team-staff-06", order: 6 },
  { name: "", role: "Oonchiumpa staff", category: "staff", photo: "/images/team/staff-07.jpg", slotId: "team-staff-07", order: 7 },
  { name: "", role: "Oonchiumpa staff", category: "staff", photo: "/images/team/staff-08.jpg", slotId: "team-staff-08", order: 8 },
  // Front row, left → right
  { name: "", role: "Oonchiumpa staff", category: "staff", photo: "/images/team/staff-09.jpg", slotId: "team-staff-09", order: 9 },
  { name: "", role: "Oonchiumpa staff", category: "staff", photo: "/images/team/staff-10.jpg", slotId: "team-staff-10", order: 10 },
  { name: "", role: "Oonchiumpa staff", category: "staff", photo: "/images/team/staff-11.jpg", slotId: "team-staff-11", order: 11 },
];

// ─── Community ───────────────────────────────────────────────────────────────

export const community: TeamMember[] = [
  {
    name: "Adelaide Hayes",
    role: "Law Student, ANU",
    category: "community",
    slotId: "team-community-adelaide",
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
    slotId: "team-community-chelsea",
    quote:
      "They're not lecturing at us in this formal sense: they're sitting on the same level, conversing with us.",
    specialties: ["Knowledge Transmission", "Cultural Protocol"],
    order: 2,
  },
  {
    name: "Aidan Harris",
    role: "Law & Public Policy Student, ANU",
    category: "community",
    slotId: "team-community-aidan",
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
    slotId: "team-community-suzie",
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
