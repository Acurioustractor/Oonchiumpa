import React from "react";
import { Link } from "react-router-dom";
import { EditableImage } from "./EditableImage";

interface FlagshipProgram {
  id: string;
  title: string;
  summary: string;
  stat: string;
  image: string;
  alt: string;
}

const flagshipPrograms: FlagshipProgram[] = [
  {
    id: "youth-mentorship",
    title: "Youth Mentorship & Cultural Healing",
    summary:
      "One-on-one mentorship, court support, and cultural connection that keeps young people engaged in community.",
    stat: "95% diversion success",
    image: "/images/model/atnarpa-facilities.jpg",
    alt: "Youth mentorship activities at Oonchiumpa",
  },
  {
    id: "law-students",
    title: "True Justice: Deep Listening on Country",
    summary:
      "Traditional Owner-led legal education helping students understand Aboriginal law, justice, and lived experience.",
    stat: "16 students per cohort",
    image: "/images/stories/IMG_9713.jpg",
    alt: "True Justice students learning on Country",
  },
  {
    id: "atnarpa-homestead",
    title: "Atnarpa Homestead Experiences",
    summary:
      "On-Country accommodation, cultural tourism, and healing experiences led by Eastern Arrernte Traditional Owners.",
    stat: "1.5 hours from Alice Springs",
    image: "/images/model/atnarpa-land.jpg",
    alt: "Atnarpa country and homestead landscape",
  },
  {
    id: "cultural-brokerage",
    title: "Cultural Brokerage & Navigation",
    summary:
      "Trusted coordination across health, education, housing, legal, and family services with culturally safe follow-through.",
    stat: "32+ partner organisations",
    image: "/images/stories/IMG_9698.jpg",
    alt: "Community coordination and support work",
  },
];

interface ServiceProgramsRailProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  slotPrefix?: string;
  className?: string;
}

export const ServiceProgramsRail: React.FC<ServiceProgramsRailProps> = ({
  eyebrow = "Flagship programs",
  title = "How Oonchiumpa delivers support",
  description = "Explore the core service streams and open each program page for delivery model, outcomes, and media detail.",
  slotPrefix = "service-program",
  className = "",
}) => {
  return (
    <section className={`bg-sand-50 py-16 md:py-20 ${className}`}>
      <div className="container-custom">
        <div className="max-w-3xl mb-10">
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2 className="heading-lg text-3xl md:text-4xl mb-4">{title}</h2>
          <p className="text-earth-700 text-lg leading-relaxed">{description}</p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {flagshipPrograms.map((program) => (
            <article key={program.id} className="section-shell p-0 overflow-hidden group h-full flex flex-col">
              <EditableImage
                slotId={`${slotPrefix}-${program.id}`}
                defaultSrc={program.image}
                defaultAlt={program.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                wrapperClassName="relative aspect-[4/3] overflow-hidden"
              />
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs uppercase tracking-[0.18em] text-ochre-700 mb-2">
                  {program.stat}
                </p>
                <h3 className="text-2xl font-display text-earth-950 mb-3">{program.title}</h3>
                <p className="text-earth-700 text-sm leading-relaxed mb-5 flex-1">{program.summary}</p>
                <Link
                  to={`/services/${program.id}`}
                  className="inline-flex items-center text-ochre-700 font-medium hover:text-ochre-800 transition-colors"
                >
                  View program details
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to="/services" className="btn-secondary">
            Browse all services
          </Link>
          <Link to="/contact?type=referral" className="btn-primary">
            Make a referral
          </Link>
        </div>
      </div>
    </section>
  );
};
