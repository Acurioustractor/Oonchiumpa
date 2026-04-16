import React from "react";
import { useNavigate } from "react-router-dom";
import { useOrgPeople, useStories } from "../hooks/useEmpathyLedger";
import { EditableImage } from "../components/EditableImage";
import { HeroVideo } from "../components/HeroVideo";
import { ProgramGallery } from "../components/ProgramGallery";
import { VideoSpotlight } from "../components/VideoSpotlight";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { people: staffPeople } = useOrgPeople(["staff"]);
  const { stories } = useStories(10);

  // Homepage "Our team" shows Empathy Ledger staff (membership_type='staff',
  // is_public=true). Leaders and community partners live on /team.
  const withAvatars = staffPeople.filter((p) => p.avatarUrl);
  const whatWeDoCards = [
    {
      slotId: "home-what-diversion",
      defaultSrc: "/images/model/atnarpa-facilities.jpg",
      defaultAlt: "Young people at Oonchiumpa facilities",
      kicker: "Youth diversion",
      title: "Keeping young people in community, not detention",
      description:
        "Daily case work, court advocacy, and practical support across school, family, and service systems.",
      proof: "95% diversion success rate. 20 of 21 young people removed from Operation Luna.",
      imageCaption: "Court support and daily follow-up keep progress steady.",
    },
    {
      slotId: "home-what-country",
      defaultSrc: "/images/model/community-on-country.jpg",
      defaultAlt: "Young people and families on Country at Atnarpa",
      kicker: "On Country healing",
      title: "Culture-first learning and healing at Atnarpa",
      description:
        "Elder-led programs where young people reconnect to language, kinship, and identity on Arrernte Country.",
      proof: "7 language groups engaged with sustained participation in culturally-led support.",
      imageCaption: "On Country work is led by cultural authority and kinship.",
    },
    {
      slotId: "home-what-family",
      defaultSrc: "/images/stories/IMG_9698.jpg",
      defaultAlt: "Oonchiumpa team with community members",
      kicker: "Whole-of-family support",
      title: "Support that includes parents, carers, and kin",
      description:
        "Housing, health, school, and referral coordination designed around whole family systems.",
      proof: "2,464 meaningful contacts in six months and 71 successful service referrals.",
      imageCaption: "Strong family networks are part of every support plan.",
    },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <HeroVideo
          src="/videos/hero/first-part.mp4"
          poster="/videos/hero/first-part.jpg"
          alt="Oonchiumpa team at the Alice Springs war memorial"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20 md:pb-28">
          <p className="text-ochre-300 text-sm uppercase tracking-[0.24em] mb-4">
            Arrernte Country · Alice Springs
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-white leading-[1.1] mb-6">
            <span className="block">Culture-led futures</span>
            <span className="block">for young people</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Oonchiumpa is an Aboriginal community-controlled organisation
            working with young people on Arrernte Country. Run by Arrernte
            people, grounded in cultural authority.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/stories")}
              className="btn-primary px-7"
            >
              Our stories
            </button>
            <button
              onClick={() => navigate("/about")}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-white font-semibold bg-white/10 backdrop-blur border border-white/25 hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2"
            >
              About Oonchiumpa
            </button>
          </div>
        </div>
      </section>

      {/* ── Founders ── */}
      <section className="bg-sand-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 min-h-[70vh]">
            <EditableImage
              slotId="founders-photo"
              defaultSrc="/images/stories/IMG_9713.jpg"
              defaultAlt="Kristy Bloomfield and Tanya Turner at Atnarpa"
              className="absolute inset-0 w-full h-full object-cover"
              wrapperClassName="relative min-h-[400px] md:min-h-0"
            />
            <div className="flex items-center px-8 md:px-16 py-16 md:py-24">
              <div className="max-w-lg">
                <p className="text-ochre-600 text-sm uppercase tracking-[0.24em] mb-6">
                  Two-world leadership
                </p>
                <h2 className="text-3xl md:text-4xl font-display text-earth-950 leading-snug mb-6">
                  Cultural authority meets systems change
                </h2>
                <p className="text-earth-700 text-lg leading-relaxed mb-6">
                  Kristy Bloomfield brings Traditional Owner authority on
                  Arrernte Country: stewarding Elder councils, knowledge
                  protocols, and community healing.
                </p>
                <p className="text-earth-700 text-lg leading-relaxed mb-8">
                  Tanya Turner navigates the legal and policy systems .
                  translating community priorities into agreements, funding, and
                  reform.
                </p>
                <p className="text-earth-600 text-base leading-relaxed border-l-2 border-ochre-400 pl-5 italic">
                  "We're able to lead this youth space because cultural authority
                  guides every decision; our young people see their future on
                  Country, not in someone else's program."
                </p>
                <p className="text-earth-500 text-sm mt-3 pl-5">
                  Kristy Bloomfield, Director
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Impact strip ── */}
      <section className="bg-earth-900 text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-ochre-300 text-sm uppercase tracking-[0.24em] mb-10 text-center">
            NIAA Performance Report · Jan–June 2025
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "$91/day", label: "Our cost per young person", sub: "vs $3,852/day incarceration" },
              { value: "30", label: "Young people supported", sub: "Up from 19 since Dec 2023" },
              { value: "87–95%", label: "Engagement rate", sub: "With culturally-led support" },
              { value: "100%", label: "Aboriginal employment", sub: "Run by community, for community" },
            ].map((m, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="text-3xl md:text-4xl font-bold text-ochre-300 mb-2">{m.value}</div>
                <div className="text-white/90 font-medium text-sm mb-1">{m.label}</div>
                <div className="text-white/70 text-xs">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProgramGallery
        eyebrow="What we do in practice"
        title="Real work, with real outcomes"
        description="These images show how Oonchiumpa works day to day: cultural leadership, practical support, and measurable change for young people and families."
        items={whatWeDoCards}
        ctaLabel="Explore all services"
        onCtaClick={() => navigate("/services")}
      />

      <VideoSpotlight
        eyebrow="Watch the work"
        title="On-Country stories in motion"
        description="Video stories from community, programs, and outcomes so partners can see how services are delivered on the ground."
      />

      {/* ── Our people (from Empathy Ledger) ── */}
      {withAvatars.length > 0 && (
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-ochre-600 text-sm uppercase tracking-[0.24em] mb-4">
              Our team
            </p>
            <h2 className="text-3xl md:text-4xl font-display text-earth-950 mb-12">
              The people behind the work
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {withAvatars.map((s) => (
                <div key={s.id} className="text-center">
                  <img
                    src={s.avatarUrl!}
                    alt={s.displayName}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
                  />
                  <p className="text-earth-950 font-medium text-sm">{s.displayName}</p>
                  {s.roleTitle && <p className="text-earth-500 text-xs mt-0.5">{s.roleTitle}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Country ── */}
      <section>
        <div className="grid md:grid-cols-2">
          <EditableImage
            slotId="country-ranges"
            defaultSrc="/images/model/atnarpa-ranges.jpg"
            defaultAlt="MacDonnell Ranges from Atnarpa Station"
            className="absolute inset-0 w-full h-full object-cover"
            wrapperClassName="relative min-h-[400px] md:min-h-[600px]"
          />
          <div className="bg-white px-8 md:px-16 py-16 md:py-24 flex flex-col justify-center">
            <p className="text-ochre-600 text-sm uppercase tracking-[0.24em] mb-6">
              Atnarpa · Loves Creek Station
            </p>
            <h2 className="text-3xl md:text-4xl font-display text-earth-950 leading-snug mb-6">
              Returning to Country
            </h2>
            <p className="text-earth-700 text-lg leading-relaxed mb-6">
              The Bloomfield and Wiltshire families reclaimed their ancestral
              land at Atnarpa. Loves Creek Station, after generations of
              displacement. This country is where healing happens.
            </p>
            <p className="text-earth-700 text-lg leading-relaxed mb-8">
              Young people travel to Atnarpa for on-country programs: learning
              from Elders, connecting to language, and building identity through
              culture, not compliance.
            </p>
            <EditableImage
              slotId="country-land-claim"
              defaultSrc="/images/model/community-on-country.jpg"
              defaultAlt="Bloomfield and Wiltshire families at the Atnarpa land claim ceremony"
              className="w-full h-56 object-cover object-top rounded-lg"
              wrapperClassName="rounded-lg overflow-hidden"
            />
            <p className="text-earth-500 text-xs mt-3">
              The family at the Atnarpa land claim ceremony
            </p>
          </div>
        </div>
      </section>

      {/* ── What young people say ── */}
      <section className="bg-sand-50 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-ochre-600 text-sm uppercase tracking-[0.24em] mb-12 text-center">
            In their words
          </p>
          <div className="space-y-12">
            <blockquote className="text-center">
              <p className="text-2xl md:text-3xl text-earth-800 leading-relaxed font-display mb-4">
                "I think other kids should work with you mob. I think everyone
                should work with Oonchiumpa. You mob are good and help."
              </p>
              <cite className="text-earth-500 text-base not-italic">
                Young person, Oonchiumpa program
              </cite>
            </blockquote>
            <div className="w-16 h-px bg-ochre-300 mx-auto" />
            <blockquote className="text-center">
              <p className="text-xl md:text-2xl text-earth-700 leading-relaxed mb-4">
                "J's other caseworker came out but J didn't want to work with him
                she didn't feel comfortable. But J enjoys working with you two.
                She works really well, they like working with Oonchiumpa."
              </p>
              <cite className="text-earth-500 text-base not-italic">
                Family member of participant
              </cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Stories from Empathy Ledger ── */}
      {stories.length > 0 && (
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-ochre-600 text-sm uppercase tracking-[0.24em] mb-4">
              From the community
            </p>
            <h2 className="text-3xl md:text-4xl font-display text-earth-950 mb-12">
              Stories
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {stories.map((story) => (
                <article
                  key={story.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/stories/${story.id}`)}
                >
                  {story.imageUrl && (
                    <div className="rounded-lg overflow-hidden mb-4">
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="w-full h-56 object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-earth-950 mb-2 group-hover:text-ochre-700 transition-colors">
                    {story.title}
                  </h3>
                  {story.excerpt && (
                    <p className="text-earth-600 text-base leading-relaxed line-clamp-3">
                      {story.excerpt}
                    </p>
                  )}
                  {story.storyteller && (
                    <div className="flex items-center gap-3 mt-4">
                      {story.storyteller.avatarUrl && (
                        <img
                          src={story.storyteller.avatarUrl}
                          alt={story.storyteller.displayName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span className="text-earth-500 text-sm">
                        {story.storyteller.displayName}
                      </span>
                    </div>
                  )}
                </article>
              ))}
            </div>
            <div className="mt-12 text-center">
              <button
                onClick={() => navigate("/stories")}
                className="text-ochre-600 font-medium hover:text-ochre-700 transition-colors"
              >
                All stories →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Case studies ── */}
      <section className="bg-earth-50 py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-ochre-600 text-sm uppercase tracking-[0.24em] mb-4">
            From our NIAA report
          </p>
          <h2 className="text-3xl md:text-4xl font-display text-earth-950 mb-12">
            Stories of transformation
          </h2>
          <div className="space-y-8">
            <article className="bg-white border border-earth-100 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-semibold text-earth-950 mb-3">
                Three girls suspended, education didn't stop
              </h3>
              <p className="text-earth-700 text-base leading-relaxed mb-3">
                After a physical altercation, three young women were excluded
                from school. Oonchiumpa created a safe learning space in their
                office, mediated with the school, and coordinated with St
                Joseph's for continued curriculum. Daily mentoring and cultural
                support kept them on track.
              </p>
              <p className="text-earth-600 text-base">
                All three remained committed to their studies and career aspirations.
              </p>
            </article>
            <article className="bg-white border border-earth-100 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-semibold text-earth-950 mb-3">
                A 15-year-old with rheumatic heart disease hadn't seen a doctor since 2022
              </h3>
              <p className="text-earth-700 text-base leading-relaxed mb-3">
                Trauma and institutional mistrust kept her away from hospital for
                years. Three weeks of patient outreach, trauma-informed advocacy,
                and cultural safety practices got her through essential medical
                tests and treatment for the first time in years.
              </p>
              <p className="text-earth-600 text-base">
                Hospital staff acknowledged Oonchiumpa achieved what other services could not.
              </p>
            </article>
            <article className="bg-white border border-earth-100 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-semibold text-earth-950 mb-3">
                A 16-year-old struggling with peer pressure and cultural obligations
              </h3>
              <p className="text-earth-700 text-base leading-relaxed mb-3">
                Regular mentoring with a male youth worker and his father focused
                on cultural identity, leadership, and decision-making. He
                developed tools to manage peer pressure while staying connected
                to cultural values.
              </p>
              <p className="text-earth-600 text-base">
                He became a role model for younger family members and re-engaged
                with cultural activities.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Partners strip ── */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-ochre-600 text-sm uppercase tracking-[0.24em] mb-8 text-center">
            Who we work with
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-earth-600 text-sm">
            {[
              "Tangentyere", "Congress", "Lhere Artepe", "NAAJA",
              "Akeyulerre Healing", "NPY Lands", "St Joseph's School",
              "Yipirinya School", "Yirara College", "Gap Youth Centre",
              "YORET", "Headspace", "Territory Families", "NT Youth Justice",
              "Cruisers Basketball", "Anglicare",
            ].map((name) => (
              <span key={name} className="whitespace-nowrap">{name}</span>
            ))}
          </div>
          <div className="flex justify-center gap-12 mt-10 text-center">
            <div>
              <div className="text-2xl font-bold text-earth-800">18+</div>
              <div className="text-earth-500 text-xs mt-1">Partner organisations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-earth-800">71</div>
              <div className="text-earth-500 text-xs mt-1">Service referrals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-earth-800">7</div>
              <div className="text-earth-500 text-xs mt-1">Language groups</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Walker Inquest ── */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <EditableImage
          slotId="walker-inquest-bg"
          defaultSrc="/images/model/atnarpa-land.jpg"
          defaultAlt="Atnarpa Station looking toward the ranges"
          className="absolute inset-0 w-full h-full object-cover"
          wrapperClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
          <p className="text-ochre-300 text-sm uppercase tracking-[0.24em] mb-8">
            Kumanjayi Walker Coronial Inquest
          </p>
          <blockquote className="text-xl md:text-2xl text-white leading-relaxed mb-6 italic">
            "Robust and sustained funding for Oonchiumpa is not simply justified
            but imperative. Investing in services like Oonchiumpa is a direct
            answer to the call for systemic change."
          </blockquote>
          <p className="text-white/50 text-sm">
            The Coroner's report called for exactly the kind of
            culturally-competent, community-controlled services that Oonchiumpa
            delivers.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display text-earth-950 mb-6">
            Get involved
          </h2>
          <p className="text-earth-600 text-lg mb-10 max-w-xl mx-auto">
            Whether you're a funder, a partner organisation, or someone who
            wants to support Aboriginal-led youth work, we'd like to hear from
            you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/contact")}
              className="btn-primary px-7"
            >
              Contact us
            </button>
            <button
              onClick={() => navigate("/stories")}
              className="btn-secondary px-7 border-2"
            >
              Read our stories
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
