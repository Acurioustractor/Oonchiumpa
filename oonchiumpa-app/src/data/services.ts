/**
 * Services & Projects — single source of truth.
 *
 * Every page that lists or links to services pulls from here:
 *   - /services                            (ServicesPage)
 *   - /services/:id                        (ServiceDetailPage)
 *   - /contact?service=<id>&type=referral  (ContactPage prefill)
 *   - Home + About service rails           (ServiceProgramsRail component)
 *
 * To add a service: add an entry below.
 * To retire one: remove it here.
 */

export interface Service {
  /** URL slug: /services/:id */
  id: string;

  /** Display title */
  title: string;

  /** Short summary (1-2 sentences) — used on cards/rails */
  summary: string;

  /** Longer description (3-5 sentences) — used on listing and detail pages */
  description: string;

  /** Measurable outcome line */
  outcome: string;

  /** Primary image (path under /images/) */
  image: string;

  /** Alt text for the image */
  alt: string;

  /** Tags for filtering/matching EL media + stories */
  tags: string[];

  /** Which inquiry type this service routes to in the contact form */
  inquiryType: "referral" | "partnership" | "funding" | "general";

  /** Whether this service accepts direct community referrals */
  acceptsReferrals: boolean;

  /** Short label for the "how to engage" CTA — e.g. "Make a referral" */
  ctaLabel: string;
}

export const services: Service[] = [
  {
    id: "youth-mentorship",
    title: "Youth Diversion & Case Management",
    summary:
      "Culturally-led case management, court support, and mentoring for young people in contact with the justice system.",
    description:
      "One-on-one Aboriginal mentorship paired with practical support across court, school, home, and daily life. Case workers stay with each young person across every system so support never drops after one referral.",
    outcome: "95% diversion success rate. 20 of 21 young people removed from Operation Luna police taskforce.",
    image: "/images/model/atnarpa-facilities.jpg",
    alt: "Oonchiumpa case worker with a young person in the community",
    tags: ["youth", "justice", "case-management", "mentoring"],
    inquiryType: "referral",
    acceptsReferrals: true,
    ctaLabel: "Make a referral",
  },
  {
    id: "atnarpa-homestead",
    title: "On Country Cultural Programs",
    summary:
      "On-Country healing, language, and identity programs at Atnarpa (Loves Creek Station), led by Traditional Owners and Elders.",
    description:
      "Young people travel to Atnarpa for cultural connection, language learning, and Elder-led healing. Programs build belonging and identity through culture, not compliance. Accommodation and on-Country experiences also available for partner organisations.",
    outcome: "7 language groups engaged with sustained participation in culturally-led support.",
    image: "/images/model/atnarpa-land.jpg",
    alt: "Atnarpa Station — Eastern Arrernte country",
    tags: ["country", "healing", "culture", "elders", "language"],
    inquiryType: "partnership",
    acceptsReferrals: true,
    ctaLabel: "Book or refer",
  },
  {
    id: "law-students",
    title: "True Justice: Deep Listening on Country",
    summary:
      "Immersive legal education on Country, led by Traditional Owners. Law students learn Aboriginal conceptions of justice from the source.",
    description:
      "Cohorts of 16 law and policy students spend time at Atnarpa with Elders, Oonchiumpa leaders, and Traditional Owners. A complete rethink of how Australian legal education can work — relational, land-based, and led by cultural authority.",
    outcome: "16 students per cohort. Partnerships with ANU and Supreme Court of Victoria.",
    image: "/images/stories/IMG_9713.jpg",
    alt: "Law students learning on Country with Traditional Owners",
    tags: ["education", "justice", "country", "university"],
    inquiryType: "partnership",
    acceptsReferrals: false,
    ctaLabel: "Partner with us",
  },
  {
    id: "cultural-brokerage",
    title: "Cultural Brokerage & Navigation",
    summary:
      "Trusted coordination and advocacy across health, education, housing, legal, and family service systems.",
    description:
      "Oonchiumpa connects young people and families with Aboriginal-led programs, businesses, and services across Central Australia. Every referral maintains cultural safety and every handover is actively held — not simply dispatched.",
    outcome: "71 successful service referrals in six months. 32+ active partner organisations.",
    image: "/images/stories/IMG_9698.jpg",
    alt: "Oonchiumpa team coordinating family support",
    tags: ["family", "navigation", "coordination", "partnerships"],
    inquiryType: "referral",
    acceptsReferrals: true,
    ctaLabel: "Request a referral",
  },
  {
    id: "education-pathways",
    title: "Education Pathways",
    summary:
      "School re-engagement, daily transport, in-class support, and alternative learning when mainstream schooling breaks down.",
    description:
      "When school attendance breaks down, Oonchiumpa creates safe learning spaces and coordinates continued curriculum delivery. Daily pickups and drop-offs, classroom support, and alternative pathways for young people excluded from mainstream schools.",
    outcome: "72% of disengaged youth returned to education.",
    image: "/images/model/community-on-country.jpg",
    alt: "Young people learning together in community",
    tags: ["education", "youth", "school"],
    inquiryType: "referral",
    acceptsReferrals: true,
    ctaLabel: "Make a referral",
  },
  {
    id: "family-kinship",
    title: "Family & Kinship Support",
    summary:
      "Whole-family support, kinship mapping, and protective networks around vulnerable young people.",
    description:
      "Working with entire kinship systems — parents, siblings, aunties, uncles — to build stable support around each young person. Reconnecting young people with family they didn't know they had, strengthening the people who love them most.",
    outcome: "87-95% engagement rate with culturally-led family support. 2,464 meaningful contacts in 6 months.",
    image: "/images/stories/IMG_9713.jpg",
    alt: "Oonchiumpa leaders with families and young people",
    tags: ["family", "kinship", "youth"],
    inquiryType: "referral",
    acceptsReferrals: true,
    ctaLabel: "Reach out",
  },
];

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

/** URL to the contact form pre-filled for this service */
export function contactUrlFor(service: Service): string {
  const params = new URLSearchParams({
    type: service.inquiryType,
    service: service.id,
  });
  return `/contact?${params.toString()}`;
}
