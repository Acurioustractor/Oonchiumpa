import React from "react";
import { useNavigate } from "react-router-dom";
import { Section } from "../components/Section";
import { Card, CardBody } from "../components/Card";
import { EditableImage } from "../components/EditableImage";
import { HeroVideo } from "../components/HeroVideo";
import { ProgramGallery } from "../components/ProgramGallery";
import { VideoSpotlight } from "../components/VideoSpotlight";
import { useStorytellers } from "../hooks/useEmpathyLedger";

const values = [
  {
    title: "Cultural Authority",
    description:
      "Traditional Owner leadership makes support credible, trusted, and accountable to community.",
    accent: "ochre" as const,
  },
  {
    title: "Aboriginal-Led Delivery",
    description:
      "Every service is run by Aboriginal staff and mentors who understand kinship and local realities.",
    accent: "eucalyptus" as const,
  },
  {
    title: "Whole-of-Family Support",
    description:
      "We work with young people, parents, carers, and services as one connected support system.",
    accent: "sunset" as const,
  },
  {
    title: "Two Worlds, One Future",
    description:
      "Young people are supported to stay strong in culture and confident across mainstream systems.",
    accent: "earth" as const,
  },
];

const valueAccentClasses = {
  ochre: "from-ochre-500 to-ochre-300",
  eucalyptus: "from-eucalyptus-600 to-eucalyptus-400",
  sunset: "from-sunset-500 to-sunset-300",
  earth: "from-earth-700 to-earth-500",
};

const recognitionItems = [
  {
    title: "NIAA Funding",
    description:
      "Funded as a proven Aboriginal-led diversion model with measurable performance outcomes.",
  },
  {
    title: "Operation Luna Results",
    description:
      "20 of 21 referred young people removed from active high-risk police tracking.",
  },
  {
    title: "Cost Effectiveness",
    description:
      "$91/day support compared with $3,852/day incarceration.",
  },
  {
    title: "Research Partnerships",
    description:
      "Evidence-building with academic and sector partners to scale what works.",
  },
];

const practiceGallery = [
  {
    slotId: "about-practice-diversion",
    defaultSrc: "/images/model/atnarpa-facilities.jpg",
    defaultAlt: "Oonchiumpa team delivering youth diversion support",
    imageCaption: "Daily support follows each young person through school, court, and community.",
    kicker: "Youth diversion",
    title: "Practical support with cultural authority",
    description:
      "Case workers coordinate justice, education, housing, and health support with consistent follow-through.",
    proof: "95% diversion success and strong engagement across six-month reporting periods.",
    method:
      "Court advocacy, transport, mentoring, service coordination, and culturally safe case planning.",
  },
  {
    slotId: "about-practice-country",
    defaultSrc: "/images/model/community-on-country.jpg",
    defaultAlt: "Families and young people on Country at Atnarpa",
    imageCaption: "On Country programs reconnect identity, language, and belonging.",
    kicker: "On Country healing",
    title: "Programs led by Elders and Traditional Owners",
    description:
      "Atnarpa programs build pride, confidence, and cultural continuity through direct learning on Country.",
    proof: "7 language groups represented with sustained participation in cultural activities.",
    method:
      "Elder-led cultural sessions, family participation, and integration with schooling and referrals.",
  },
  {
    slotId: "about-practice-family",
    defaultSrc: "/images/stories/IMG_9698.jpg",
    defaultAlt: "Community members with Oonchiumpa staff",
    imageCaption: "Family and kinship networks are active partners in every support plan.",
    kicker: "Family and kinship",
    title: "Whole-family coordination",
    description:
      "Support plans include carers, siblings, and trusted services to build durable protective networks.",
    proof: "2,464 meaningful contacts and 71 successful service referrals over six months.",
    method:
      "Kinship-informed planning, practical coordination, and culturally safe communication across partners.",
  },
];

const timeline = [
  {
    year: "2022",
    title: "Program foundations",
    copy: "Work began under NAAJA with culturally-led youth diversion designed by Traditional Owners.",
  },
  {
    year: "2023",
    title: "Independent organisation",
    copy: "Oonchiumpa established independently and expanded participant and partner engagement rapidly.",
  },
  {
    year: "2024",
    title: "National attention",
    copy: "NIAA support and external recognition validated outcomes and model viability.",
  },
  {
    year: "2025+",
    title: "Scaling impact",
    copy: "Infrastructure, workforce, and policy collaborations are extending the model's reach.",
  },
];

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { storytellers } = useStorytellers(40);
  const activeTeam = storytellers.filter((s) => s.isActive);

  return (
    <div className="bg-white">
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <HeroVideo
          src="/videos/hero/country-pan.mp4"
          poster="/videos/hero/country-pan.jpg"
          alt="Water flowing through a creek bed on Arrernte Country"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950/85 via-earth-950/45 to-transparent" />

        <div className="relative z-10 container-custom pb-14 md:pb-20 pt-28 md:pt-40">
          <p className="eyebrow text-ochre-200 mb-5">About Oonchiumpa</p>
          <h1 className="heading-xl text-white max-w-4xl mb-6">
            Traditional Owner leadership changing youth outcomes on Arrernte Country
          </h1>
          <p className="text-white/85 text-lg md:text-xl max-w-3xl leading-relaxed mb-10">
            Oonchiumpa is an Aboriginal community-controlled organisation delivering youth diversion,
            cultural healing, and family support that is accountable to community and grounded in Country.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/services")}
              className="btn-primary"
            >
              Explore services
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="btn-secondary border-white/50 bg-white/10 text-white hover:bg-white/20"
            >
              Work with us
            </button>
          </div>
        </div>
      </section>

      <section className="bg-earth-950 text-white py-12">
        <div className="container-custom grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: "95%", label: "Diversion success" },
            { value: "$91/day", label: "Program cost" },
            { value: "100%", label: "Aboriginal employment" },
            { value: "20/21", label: "Removed from Op Luna" },
          ].map((item) => (
            <div key={item.label} className="text-center lg:text-left">
              <p className="text-3xl md:text-4xl font-display text-ochre-300">{item.value}</p>
              <p className="text-sm md:text-base text-white/75 mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-4">Why we exist</p>
            <h2 className="heading-lg mb-5">Born from community urgency</h2>
            <p className="lead-text mb-6">
              Oonchiumpa was created because mainstream responses were failing young people and families.
              The work started with local leadership, deep community trust, and practical support that
              could hold both cultural and systems complexity.
            </p>
            <p className="text-earth-700 leading-relaxed mb-8">
              We do not separate justice, education, wellbeing, and identity. Our model is integrated,
              relationship-based, and grounded in the authority of Traditional Owners to lead change on
              their own Country.
            </p>

            <EditableImage
              slotId="about-origin-image"
              defaultSrc="/images/model/atnarpa-land.jpg"
              defaultAlt="Landscape on Arrernte Country"
              className="w-full h-72 object-cover"
              wrapperClassName="rounded-2xl overflow-hidden border border-earth-100 shadow-[0_12px_28px_rgba(47,30,26,0.12)]"
            />
          </div>

          <div className="lg:col-span-6 space-y-4">
            {timeline.map((item) => (
              <div
                key={item.year}
                className="rounded-2xl border border-earth-100 bg-sand-50 p-5 md:p-6"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-ochre-700 font-semibold mb-2">
                  {item.year}
                </p>
                <h3 className="text-xl font-display text-earth-950 mb-2">{item.title}</h3>
                <p className="text-earth-700 leading-relaxed">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-sand-50">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <p className="eyebrow mb-4">How we work</p>
          <h2 className="heading-lg mb-5">A model shaped by culture, evidence, and trust</h2>
          <p className="lead-text">
            These principles guide service delivery decisions, workforce development, and partner collaboration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {values.map((value) => (
            <Card key={value.title} className="h-full">
              <CardBody className="p-7 md:p-8">
                <div
                  className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${valueAccentClasses[value.accent]} mb-5`}
                />
                <h3 className="text-2xl font-display text-earth-950 mb-3">{value.title}</h3>
                <p className="text-earth-700 leading-relaxed">{value.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <ProgramGallery
        eyebrow="Service delivery"
        title="What this looks like in practice"
        description="Program images and delivery details can be updated directly by your team, keeping the About page current without redesign work."
        variant="rows"
        items={practiceGallery}
      />

      <VideoSpotlight
        eyebrow="Video stories"
        title="See leadership and delivery in motion"
        description="Use curated videos to show partners, funders, and families how the work operates on the ground."
      />

      <Section id="team" className="bg-white">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <p className="eyebrow mb-4">Leadership</p>
          <h2 className="heading-lg mb-5">Led by community, accountable to community</h2>
          <p className="lead-text">
            Oonchiumpa leadership combines cultural authority, professional practice, and long-term commitment to families.
          </p>
        </div>

        {activeTeam.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-7 max-w-5xl mx-auto mb-12">
            {activeTeam.map((member) => (
              <div key={member.id} className="text-center">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.displayName}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border border-earth-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-ochre-100 flex items-center justify-center mx-auto mb-3 border border-ochre-200">
                    <span className="text-ochre-700 font-semibold text-xl">
                      {member.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                )}
                <p className="text-earth-950 font-medium text-sm">{member.displayName}</p>
                {member.isElder && <p className="text-ochre-700 text-xs">Elder</p>}
                {member.role && <p className="text-earth-500 text-xs mt-0.5">{member.role}</p>}
              </div>
            ))}
          </div>
        )}

        <div className="max-w-4xl mx-auto rounded-3xl bg-earth-950 text-white p-8 md:p-10">
          <h3 className="text-2xl font-display text-white mb-4">Building Aboriginal workforce pathways</h3>
          <p className="text-white/80 leading-relaxed text-lg">
            Oonchiumpa is not only supporting young people. It is also creating pathways for Aboriginal workers,
            mentors, and leaders whose lived experience and cultural grounding strengthen every outcome.
          </p>
        </div>
      </Section>

      <Section className="bg-sand-50">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <p className="eyebrow mb-4">Recognition</p>
          <h2 className="heading-lg mb-5">Outcomes recognised by partners and funders</h2>
          <p className="lead-text">
            Oonchiumpa's work is independently recognised for impact, value, and cultural legitimacy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10">
          {recognitionItems.map((item) => (
            <div key={item.title} className="section-shell p-6 md:p-7">
              <h3 className="text-2xl font-display text-earth-950 mb-3">{item.title}</h3>
              <p className="text-earth-700 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardBody className="p-8 md:p-10">
            <p className="text-earth-700 text-lg leading-relaxed">
              <span className="font-semibold text-earth-950">Evaluation insight:</span>{" "}
              "The program has had a significant positive impact on the broader community by addressing the underlying causes
              of youth offending and promoting cultural healing and cohesion."
            </p>
          </CardBody>
        </Card>
      </Section>

      <Section className="bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="eyebrow mb-4">Next chapter</p>
          <h2 className="heading-lg mb-5">A stronger platform for long-term change</h2>
          <p className="lead-text mb-10">
            The next phase includes expanded service infrastructure, stronger data and evidence systems,
            and deeper collaboration across community and government partners.
          </p>

          <div className="section-shell bg-earth-950 text-white p-8 md:p-12">
            <h3 className="text-3xl font-display text-white mb-4">Partner with Oonchiumpa</h3>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              If you are a funder, service partner, or researcher, we can work together on practical,
              community-led outcomes for young people and families.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/contact")}
                className="btn-primary"
              >
                Contact the team
              </button>
              <button
                onClick={() => navigate("/services")}
                className="btn-secondary border-white/50 bg-white/10 text-white hover:bg-white/20"
              >
                View services
              </button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
