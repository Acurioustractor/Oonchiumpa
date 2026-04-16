import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeroVideo } from "../components/HeroVideo";
import { Section } from "../components/Section";
import { Card, CardBody } from "../components/Card";
import { useOrgPeople, useStories } from "../hooks/useEmpathyLedger";

// ── Timeline Data ──────────────────────────────────────────────────────────────

interface Milestone {
  year: string;
  title: string;
  narrative: string;
  person?: { name: string; role: string; avatarUrl?: string };
  accent: "ochre" | "eucalyptus" | "earth";
}

const milestones: Milestone[] = [
  {
    year: "2020–21",
    title: "Seeds in the ground",
    narrative:
      "Kristy Bloomfield and Tanya Turner began youth diversion work under NAAJA, drawing on kinship networks and cultural authority that no government program could replicate. The approach was simple: meet young people where they are, with people they trust.",
    person: {
      name: "Kristy Bloomfield",
      role: "Co-founder, Traditional Owner",
    },
    accent: "ochre",
  },
  {
    year: "2022",
    title: "Program foundations",
    narrative:
      "Culturally-led youth diversion took shape on Arrernte Country. Traditional Owners designed the model from the inside out — identity first, then family, then services. Staff were hired from community, not recruited from agencies.",
    accent: "eucalyptus",
  },
  {
    year: "2023",
    title: "Standing on our own",
    narrative:
      "Oonchiumpa incorporated as an independent Aboriginal community-controlled organisation. Partnerships expanded rapidly because the model worked: families trusted the team, and young people kept showing up.",
    person: {
      name: "Tanya Turner",
      role: "Co-founder, Director",
    },
    accent: "ochre",
  },
  {
    year: "2024",
    title: "The evidence speaks",
    narrative:
      "NIAA funding and external evaluations validated what community already knew: 95% diversion success, 72% return to education, and a program cost of $91 per day versus $3,852 for detention. National attention followed.",
    accent: "earth",
  },
  {
    year: "2025+",
    title: "Growing through kinship",
    narrative:
      "Infrastructure, workforce development, and policy partnerships are extending the model's reach. New families, new communities, new partners — each relationship built the same way: through trust, culture, and showing up.",
    accent: "eucalyptus",
  },
];

// ── Circles of Care Data ───────────────────────────────────────────────────────

interface CareCircle {
  id: string;
  name: string;
  arrernte: string;
  color: string;
  description: string;
  elements: string[];
}

const careCircles: CareCircle[] = [
  {
    id: "self",
    name: "The Young Person",
    arrernte: "Apmere-kenhe",
    color: "#fbbf24",
    description:
      "At the centre is the whole young person — not a case number or a risk score. A person with identity, dreams, language, and belonging. Everything radiates from here.",
    elements: ["Identity & skin name", "Voice & agency", "Strength & resilience", "Cultural safety"],
  },
  {
    id: "family",
    name: "Family & Kinship",
    arrernte: "Apmere Aknganentye",
    color: "#34d399",
    description:
      "Family in Arrernte kinship is not nuclear. It's a wide web of responsibility and care that runs across clans, country, and generations.",
    elements: ["Grandmothers & grandfathers", "Parents & siblings", "Kinship network", "Family navigation"],
  },
  {
    id: "community",
    name: "Community & Place",
    arrernte: "Apmere Uthene",
    color: "#6ee7b7",
    description:
      "The young person belongs to a place: a town camp, a homeland, a community. The hub goes to where people are.",
    elements: ["Town camps & homelands", "Schools & safe spaces", "Peer connection", "Elders & ceremony"],
  },
  {
    id: "culture",
    name: "Culture & Country",
    arrernte: "Apmere Altyerre-kenhe",
    color: "#f59e0b",
    description:
      "Language, law, ceremony, and connection to country. In the Aboriginal wellbeing framework, this is the foundation of all wellbeing.",
    elements: ["7 language groups", "Law & ceremony", "Atnarpa Homestead", "Story & Dreaming"],
  },
];

// ── Accent Helpers ─────────────────────────────────────────────────────────────

const accentLine: Record<Milestone["accent"], string> = {
  ochre: "bg-gradient-to-b from-ochre-500 to-ochre-600",
  eucalyptus: "bg-gradient-to-b from-eucalyptus-500 to-eucalyptus-600",
  earth: "bg-gradient-to-b from-earth-500 to-earth-600",
};

const accentDot: Record<Milestone["accent"], string> = {
  ochre: "bg-ochre-500 ring-ochre-100",
  eucalyptus: "bg-eucalyptus-500 ring-eucalyptus-100",
  earth: "bg-earth-500 ring-earth-100",
};

// ── Page Component ─────────────────────────────────────────────────────────────

export const OurJourneyPage: React.FC = () => {
  const navigate = useNavigate();
  const { people, loading: peopleLoading } = useOrgPeople(["leadership", "staff"]);
  const { stories, loading: storiesLoading } = useStories(3);
  const [activeCircle, setActiveCircle] = useState<string>("self");

  const activeDetail = careCircles.find((c) => c.id === activeCircle) ?? careCircles[0];
  const leaders = people.filter((p) => p.membershipType === "leadership").slice(0, 6);
  const staff = people.filter((p) => p.membershipType === "staff").slice(0, 6);
  const displayPeople = [...leaders, ...staff].slice(0, 8);

  return (
    <div className="bg-white">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <HeroVideo
          src="/videos/hero/country-pan.mp4"
          poster="/videos/hero/country-pan.jpg"
          alt="Sunlight across Arrernte Country"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950/85 via-earth-950/45 to-transparent" />

        <div className="relative z-10 container-custom pb-14 md:pb-20 pt-28 md:pt-40">
          <p className="eyebrow text-ochre-200 mb-5">Our Journey</p>
          <h1 className="heading-xl text-white max-w-4xl">
            Built on kinship.{" "}
            <span className="text-ochre-300">Grown through culture.</span>
          </h1>
          <p className="text-white/85 text-lg max-w-3xl leading-relaxed mt-6">
            Oonchiumpa didn't come from a funding round or a policy paper. It grew from
            relationships — between families, between generations, between people and
            Country. This is how kinship built an organisation.
          </p>
        </div>
      </section>

      {/* ── Kinship Timeline ─────────────────────────────────────────── */}
      <Section className="bg-white">
        <div className="text-center max-w-4xl mx-auto mb-14">
          <p className="eyebrow mb-4">Timeline</p>
          <h2 className="heading-lg mb-5">How we got here</h2>
          <p className="lead-text">
            Not a corporate timeline. A story of relationships, trust, and cultural authority
            compounding over time.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-earth-200" />

          <div className="space-y-12 md:space-y-16">
            {milestones.map((ms, i) => {
              const isLeft = i % 2 === 0;

              return (
                <div key={ms.year} className="relative">
                  {/* Dot */}
                  <div
                    className={`absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ring-4 z-10 ${accentDot[ms.accent]}`}
                  />

                  {/* Card */}
                  <div
                    className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isLeft ? "md:mr-auto md:pr-0" : "md:ml-auto md:pl-0"
                    }`}
                  >
                    <div className="section-shell p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`h-1 w-8 rounded-full ${accentLine[ms.accent]}`} />
                        <span className="text-xs uppercase tracking-[0.22em] text-ochre-600 font-semibold">
                          {ms.year}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-display text-earth-950 mb-3">
                        {ms.title}
                      </h3>
                      <p className="text-earth-700 leading-relaxed">{ms.narrative}</p>

                      {ms.person && (
                        <div className="mt-5 pt-4 border-t border-earth-100 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-ochre-100 flex items-center justify-center text-ochre-700 font-display font-semibold text-sm flex-none">
                            {ms.person.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-earth-950">
                              {ms.person.name}
                            </p>
                            <p className="text-xs text-earth-600">{ms.person.role}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ── Circles of Care ──────────────────────────────────────────── */}
      <Section className="bg-sand-50" pattern>
        <div className="text-center max-w-4xl mx-auto mb-14">
          <p className="eyebrow mb-4">The model</p>
          <h2 className="heading-lg mb-5">Circles of care</h2>
          <p className="lead-text">
            Oonchiumpa works from the inside out. The young person is at the centre,
            surrounded by expanding circles of kinship, community, and culture.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* SVG Rings */}
          <div className="flex justify-center">
            <svg viewBox="0 0 400 400" className="w-full max-w-md" role="img" aria-label="Concentric circles showing the Oonchiumpa care model">
              {/* Outer rings first (painted back to front) */}
              {[...careCircles].reverse().map((circle, ri) => {
                const radii = [170, 130, 90, 50];
                const r = radii[ri];
                const isActive = activeCircle === circle.id;

                return (
                  <g key={circle.id}>
                    <circle
                      cx={200}
                      cy={200}
                      r={r}
                      fill={isActive ? circle.color + "30" : circle.color + "15"}
                      stroke={circle.color}
                      strokeWidth={isActive ? 3 : 1.5}
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setActiveCircle(circle.id)}
                    />
                    <text
                      x={200}
                      y={200 - r + 20}
                      textAnchor="middle"
                      className="fill-earth-800 text-[11px] font-semibold pointer-events-none"
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      {circle.arrernte}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Detail panel */}
          <div className="section-shell p-7 md:p-8">
            <div
              className="h-1.5 w-16 rounded-full mb-5"
              style={{ backgroundColor: activeDetail.color }}
            />
            <h3 className="text-2xl font-display text-earth-950 mb-2">
              {activeDetail.name}
            </h3>
            <p className="text-sm text-ochre-600 font-semibold mb-4 italic">
              {activeDetail.arrernte}
            </p>
            <p className="text-earth-700 leading-relaxed mb-5">
              {activeDetail.description}
            </p>
            <ul className="space-y-2">
              {activeDetail.elements.map((el) => (
                <li key={el} className="text-sm text-earth-700 flex items-start gap-2">
                  <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-ochre-500 flex-none" />
                  <span>{el}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── Our People ───────────────────────────────────────────────── */}
      <Section className="bg-white">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <p className="eyebrow mb-4">Our people</p>
          <h2 className="heading-lg mb-5">The kinship network behind the work</h2>
          <p className="lead-text">
            Aboriginal-led at every level. Our team comes from community, works in community,
            and answers to community.
          </p>
        </div>

        {peopleLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-2xl bg-earth-100 mb-3" />
                <div className="h-4 bg-earth-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-earth-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {displayPeople.map((person) => (
              <div key={person.id} className="text-center group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-earth-100 mb-3 border border-earth-100">
                  {person.avatarUrl ? (
                    <img
                      src={person.avatarUrl}
                      alt={person.displayName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-ochre-50 text-ochre-600 font-display font-bold text-2xl">
                      {person.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-earth-950">{person.displayName}</h3>
                {person.roleTitle && (
                  <p className="text-xs text-earth-600 mt-0.5">{person.roleTitle}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <button onClick={() => navigate("/team")} className="btn-secondary">
            Meet the full team
          </button>
        </div>
      </Section>

      {/* ── Community Voices ─────────────────────────────────────────── */}
      {!storiesLoading && stories.length > 0 && (
        <Section className="bg-sand-50" pattern>
          <div className="text-center max-w-4xl mx-auto mb-12">
            <p className="eyebrow mb-4">Community voices</p>
            <h2 className="heading-lg mb-5">Stories from the ground</h2>
            <p className="lead-text">
              Real stories from families, young people, and the team — told in their own words.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Card
                key={story.id}
                className="cursor-pointer"
                onClick={() => navigate(`/stories/${story.id}`)}
              >
                {story.imageUrl && (
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardBody className="p-6">
                  <h3 className="text-lg font-display text-earth-950 mb-2 line-clamp-2">
                    {story.title}
                  </h3>
                  {story.excerpt && (
                    <p className="text-sm text-earth-700 leading-relaxed line-clamp-3">
                      {story.excerpt}
                    </p>
                  )}
                  {story.storyteller && (
                    <div className="mt-4 flex items-center gap-2">
                      {story.storyteller.avatarUrl ? (
                        <img
                          src={story.storyteller.avatarUrl}
                          alt={story.storyteller.displayName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-ochre-100 flex items-center justify-center text-ochre-700 text-xs font-semibold">
                          {story.storyteller.displayName[0]}
                        </div>
                      )}
                      <span className="text-xs text-earth-600">
                        {story.storyteller.displayName}
                      </span>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <button onClick={() => navigate("/stories")} className="btn-secondary">
              Read more stories
            </button>
          </div>
        </Section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <Section className="bg-earth-950">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display text-white mb-5">
            Walk with us
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Whether you're a funder, a partner, or a family looking for support —
            kinship starts with showing up.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate("/contact?type=partnership")} className="btn-primary">
              Partner with Oonchiumpa
            </button>
            <button
              onClick={() => navigate("/contact?type=referral")}
              className="btn-secondary border-white/50 bg-white/10 text-white hover:bg-white/20"
            >
              Make a referral
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default OurJourneyPage;
