import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { EditableImage } from "../components/EditableImage";
import { HeroVideo } from "../components/HeroVideo";
import { ProgramGallery } from "../components/ProgramGallery";
import { VideoSpotlight } from "../components/VideoSpotlight";
import { useMedia, useSyndicatedServices } from "../hooks/useEmpathyLedger";
import { services, contactUrlFor } from "../data/services";

const detailedPrograms = [
  {
    id: "youth-mentorship",
    title: "Youth Mentorship & Cultural Healing",
    summary:
      "One-on-one Aboriginal mentorship, school re-engagement, and family support for young people at risk.",
    media: "/images/model/atnarpa-facilities.jpg",
    stat: "95% school re-engagement",
  },
  {
    id: "law-students",
    title: "True Justice: Deep Listening on Country",
    summary:
      "Immersive legal education led by Traditional Owners, connecting students to Aboriginal law and justice in practice.",
    media: "/images/stories/IMG_9713.jpg",
    stat: "16 students per cohort",
  },
  {
    id: "atnarpa-homestead",
    title: "Atnarpa Homestead Experiences",
    summary:
      "Traditional Owner-led on-Country accommodation, cultural tourism, and healing programs at Loves Creek Station.",
    media: "/images/model/atnarpa-land.jpg",
    stat: "1.5 hours from Alice Springs",
  },
  {
    id: "cultural-brokerage",
    title: "Cultural Brokerage & Navigation",
    summary:
      "Trusted service coordination and advocacy across health, education, housing, legal, and family systems.",
    media: "/images/stories/IMG_9698.jpg",
    stat: "32+ partner organisations",
  },
];

const serviceShowcase = [
  {
    slotId: "services-showcase-diversion",
    defaultSrc: "/images/model/atnarpa-facilities.jpg",
    defaultAlt: "Youth program activities at Oonchiumpa",
    service: "Youth Diversion & Case Management",
    headline: "Justice support that keeps young people connected to community",
    description:
      "Case workers stay close to each young person across court, school, home, and daily life so support does not drop away after one referral.",
    evidence:
      "95% diversion success rate and 20 of 21 young people removed from Operation Luna.",
    method:
      "One-on-one mentoring, court advocacy, safety planning, and practical transport and follow-through.",
    imageCaption: "Consistent mentoring turns one-off contact into sustained change.",
  },
  {
    slotId: "services-showcase-country",
    defaultSrc: "/images/model/community-on-country.jpg",
    defaultAlt: "Young people and families together on Country",
    service: "Cultural Connection & On Country Programs",
    headline: "Healing and identity built on Country, with Elders",
    description:
      "Programs at Atnarpa are led by cultural authority and designed around belonging, language, and strong relationships.",
    evidence:
      "7 language groups engaged with sustained participation in culturally-led support.",
    method:
      "Elder-led sessions, cultural learning, family participation, and continuity across school and community settings.",
    imageCaption: "Atnarpa programs strengthen identity, belonging, and leadership.",
  },
  {
    slotId: "services-showcase-family",
    defaultSrc: "/images/stories/IMG_9713.jpg",
    defaultAlt: "Oonchiumpa leaders and community members",
    service: "Family & Kinship Support",
    headline: "Support designed around whole family systems",
    description:
      "The team works with parents, carers, siblings, and trusted services to build stable support networks around each young person.",
    evidence:
      "87–95% engagement rate and 71 successful service referrals in six months.",
    method:
      "Kinship mapping, referral brokerage, practical coordination, and culturally safe communication between services.",
    imageCaption: "Family and kinship support is core service delivery, not an add-on.",
  },
];

interface ServiceProjectCard {
  id: string;
  routeId: string;
  title: string;
  summary: string;
  image: string | null;
  metric: string;
  tags: string[];
  source: "flagship" | "syndicated";
  quote?: string | null;
  hasPhoto: boolean;
  hasVideo: boolean;
  hasQuote: boolean;
  matchedPhotoCount: number;
  matchedVideoCount: number;
  matchedPhotoPreviews: Array<{
    id: string;
    url: string;
    title: string | null;
  }>;
  matchedVideoPreviews: Array<{
    id: string;
    title: string | null;
    thumbnailUrl: string | null;
    url: string | null;
  }>;
}

const flagshipProjectCards: ServiceProjectCard[] = [
  {
    id: "project-flagship-youth-mentorship",
    routeId: "youth-mentorship",
    title: "Youth Mentorship & Cultural Healing",
    summary:
      "One-on-one Aboriginal mentorship, school re-engagement, and family support for young people at risk.",
    image: "/images/model/atnarpa-facilities.jpg",
    metric: "95% school re-engagement",
    tags: ["youth", "justice", "case-management"],
    source: "flagship",
    hasPhoto: true,
    hasVideo: false,
    hasQuote: false,
    matchedPhotoCount: 0,
    matchedVideoCount: 0,
    matchedPhotoPreviews: [],
    matchedVideoPreviews: [],
  },
  {
    id: "project-flagship-law-students",
    routeId: "law-students",
    title: "True Justice: Deep Listening on Country",
    summary:
      "Immersive legal education led by Traditional Owners, connecting students to Aboriginal law and justice in practice.",
    image: "/images/stories/IMG_9713.jpg",
    metric: "16 students per cohort",
    tags: ["education", "justice", "country"],
    source: "flagship",
    hasPhoto: true,
    hasVideo: false,
    hasQuote: false,
    matchedPhotoCount: 0,
    matchedVideoCount: 0,
    matchedPhotoPreviews: [],
    matchedVideoPreviews: [],
  },
  {
    id: "project-flagship-atnarpa",
    routeId: "atnarpa-homestead",
    title: "Atnarpa Homestead Experiences",
    summary:
      "Traditional Owner-led on-Country accommodation, cultural tourism, and healing programs at Loves Creek Station.",
    image: "/images/model/atnarpa-land.jpg",
    metric: "1.5 hours from Alice Springs",
    tags: ["country", "healing", "culture"],
    source: "flagship",
    hasPhoto: true,
    hasVideo: false,
    hasQuote: false,
    matchedPhotoCount: 0,
    matchedVideoCount: 0,
    matchedPhotoPreviews: [],
    matchedVideoPreviews: [],
  },
  {
    id: "project-flagship-brokerage",
    routeId: "cultural-brokerage",
    title: "Cultural Brokerage & Navigation",
    summary:
      "Trusted service coordination and advocacy across health, education, housing, legal, and family systems.",
    image: "/images/stories/IMG_9698.jpg",
    metric: "32+ partner organisations",
    tags: ["family", "navigation", "coordination"],
    source: "flagship",
    hasPhoto: true,
    hasVideo: false,
    hasQuote: false,
    matchedPhotoCount: 0,
    matchedVideoCount: 0,
    matchedPhotoPreviews: [],
    matchedVideoPreviews: [],
  },
];

const normalizeTag = (value: string) =>
  value
    .replace(/_/g, "-")
    .trim()
    .toLowerCase();

const formatTagLabel = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const normalizeSearchText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[_/]+/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim();

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { services: syndicatedServices, loading: syndicatedServicesLoading } =
    useSyndicatedServices(12, true);
  const { media: empathyImageMedia, loading: empathyImageLoading } = useMedia({
    limit: 120,
    type: "image",
  });
  const { media: empathyVideoMedia, loading: empathyVideoLoading } = useMedia({
    limit: 120,
    type: "video",
  });
  const [activeProjectTag, setActiveProjectTag] = React.useState("all");

  const serviceProjectCards = React.useMemo(() => {
    const byRoute = new Map<string, ServiceProjectCard>();

    for (const card of flagshipProjectCards) {
      byRoute.set(card.routeId, card);
    }

    for (const service of syndicatedServices) {
      const routeId = service.slug || service.id;
      const detailTags = service.detail.serviceTags
        .slice(0, 6)
        .map((tag) => normalizeTag(tag))
        .filter(Boolean);
      const fromThemes = service.topThemes
        .slice(0, 4)
        .map((theme) => normalizeTag(theme.theme))
        .filter(Boolean);
      const typeTag = service.serviceType
        ? [normalizeTag(service.serviceType)]
        : [];
      const tags = Array.from(new Set([...typeTag, ...detailTags, ...fromThemes]));
      const existing = byRoute.get(routeId);
      const syncedPhotoPreviews = service.media.photoPreviews
        .filter((asset) => Boolean(asset.url))
        .slice(0, 3)
        .map((asset) => ({
          id: asset.id,
          url: asset.url || "",
          title: asset.title,
        }));
      const syncedVideoPreviews = service.media.videoPreviews
        .slice(0, 2)
        .map((asset) => ({
          id: asset.id,
          title: asset.title,
          thumbnailUrl: asset.thumbnailUrl || null,
          url: asset.url || null,
        }));
      const hasSyncedPhotos =
        service.media.photoCount > 0 || syncedPhotoPreviews.length > 0;
      const hasSyncedVideos =
        service.media.videoCount > 0 || syncedVideoPreviews.length > 0;
      const quoteText =
        service.detail.testimonial.quote ||
        service.heroQuotes[0]?.text ||
        existing?.quote ||
        null;

      const nextCard: ServiceProjectCard = {
        id: `project-syndicated-${service.id}`,
        routeId,
        title: service.name,
        summary:
          service.detail.overview ||
          service.description ||
          existing?.summary ||
          "Service profile.",
        image: service.imageUrl || existing?.image || null,
        metric:
          service.storytellerCount > 0 ||
          service.quoteCount > 0 ||
          service.linkedStoryCount > 0
            ? `${service.storytellerCount} storytellers · ${service.linkedStoryCount} stories · ${service.quoteCount} quotes`
            : existing?.metric || "Synced service profile",
        tags: Array.from(new Set([...(existing?.tags || []), ...tags])),
        source: existing ? "flagship" : "syndicated",
        quote: quoteText,
        hasPhoto: Boolean(service.imageUrl || hasSyncedPhotos || existing?.hasPhoto),
        hasVideo: Boolean(hasSyncedVideos || existing?.hasVideo),
        hasQuote: Boolean(quoteText || existing?.hasQuote),
        matchedPhotoCount: Math.max(
          existing?.matchedPhotoCount || 0,
          service.media.photoCount,
          syncedPhotoPreviews.length,
        ),
        matchedVideoCount: Math.max(
          existing?.matchedVideoCount || 0,
          service.media.videoCount,
          syncedVideoPreviews.length,
        ),
        matchedPhotoPreviews:
          syncedPhotoPreviews.length > 0
            ? syncedPhotoPreviews
            : existing?.matchedPhotoPreviews || [],
        matchedVideoPreviews:
          syncedVideoPreviews.length > 0
            ? syncedVideoPreviews
            : existing?.matchedVideoPreviews || [],
      };

      byRoute.set(routeId, nextCard);
    }

    return Array.from(byRoute.values());
  }, [syndicatedServices]);

  const projectTags = React.useMemo(() => {
    const tags = new Set<string>();
    for (const card of serviceProjectCards) {
      for (const tag of card.tags) {
        if (tag) tags.add(tag);
      }
    }
    return Array.from(tags).sort();
  }, [serviceProjectCards]);

  React.useEffect(() => {
    if (activeProjectTag === "all") return;
    if (!projectTags.includes(activeProjectTag)) {
      setActiveProjectTag("all");
    }
  }, [activeProjectTag, projectTags]);

  const serviceProjectCardsWithMediaSignals = React.useMemo(() => {
    const matchMediaByTerms = (
      text: string,
      terms: string[],
    ) => terms.some((term) => text.includes(term));

    return serviceProjectCards.map((card) => {
      const terms = Array.from(
        new Set(
          [
            ...card.routeId.split("-"),
            ...card.tags.flatMap((tag) => tag.split("-")),
            ...normalizeSearchText(card.title).split(/\s+/),
          ].filter((term) => term.length >= 4),
        ),
      );

      const matchedPhotos = empathyImageMedia.filter((asset) =>
        matchMediaByTerms(
          normalizeSearchText(
            `${asset.title || ""} ${asset.description || ""} ${(asset.culturalTags || []).join(" ")}`,
          ),
          terms,
        ),
      );

      const matchedVideos = empathyVideoMedia.filter((asset) =>
        matchMediaByTerms(
          normalizeSearchText(
            `${asset.title || ""} ${asset.description || ""} ${(asset.culturalTags || []).join(" ")}`,
          ),
          terms,
        ),
      );

      const matchedPhotoCount = matchedPhotos.length;
      const matchedVideoCount = matchedVideos.length;
      const fallbackPhotoPreviews = matchedPhotos
        .slice(0, 3)
        .map((asset) => ({
          id: asset.id,
          url: asset.thumbnailUrl || asset.previewUrl || asset.url || "",
          title: asset.title,
        }))
        .filter((asset) => Boolean(asset.url));
      const fallbackVideoPreviews = matchedVideos.slice(0, 2).map((asset) => ({
        id: asset.id,
        title: asset.title,
        thumbnailUrl: asset.thumbnailUrl || asset.previewUrl || null,
        url: asset.url,
      }));
      const resolvedPhotoCount = Math.max(card.matchedPhotoCount, matchedPhotoCount);
      const resolvedVideoCount = Math.max(card.matchedVideoCount, matchedVideoCount);

      return {
        ...card,
        hasPhoto: card.hasPhoto || resolvedPhotoCount > 0,
        hasVideo: card.hasVideo || resolvedVideoCount > 0,
        hasQuote: card.hasQuote || Boolean(card.quote),
        matchedPhotoCount: resolvedPhotoCount,
        matchedVideoCount: resolvedVideoCount,
        matchedPhotoPreviews:
          card.matchedPhotoPreviews.length > 0
            ? card.matchedPhotoPreviews
            : fallbackPhotoPreviews,
        matchedVideoPreviews:
          card.matchedVideoPreviews.length > 0
            ? card.matchedVideoPreviews
            : fallbackVideoPreviews,
      };
    });
  }, [serviceProjectCards, empathyImageMedia, empathyVideoMedia]);

  const filteredProjectCards = React.useMemo(
    () =>
      serviceProjectCardsWithMediaSignals.filter(
        (card) => activeProjectTag === "all" || card.tags.includes(activeProjectTag),
      ),
    [serviceProjectCardsWithMediaSignals, activeProjectTag],
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        <HeroVideo
          src="/videos/hero/boxing.mp4"
          poster="/videos/hero/boxing.jpg"
          alt="Young person training at the boxing gym"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-16">
          <p className="text-ochre-300 text-sm uppercase tracking-[0.25em] mb-4">
            What we do
          </p>
          <h1 className="text-4xl md:text-5xl font-display text-white mb-4">
            Our Services
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-8">
            Culturally-led, community-controlled services for young people
            on Arrernte Country. Run by Aboriginal people, for community.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact?type=referral" className="btn-primary px-7">
              Make a referral
            </Link>
            <Link
              to="/contact?type=partnership"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-white font-semibold bg-white/10 backdrop-blur border border-white/25 hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2"
            >
              Partner with us
            </Link>
          </div>
        </div>
      </section>

      <ProgramGallery
        eyebrow="In practice"
        title="How support looks on the ground"
        description="Each service combines cultural leadership, practical delivery, and measurable outcomes. These images are editable so your team can keep this showcase current."
        variant="rows"
        items={serviceShowcase.map((item) => ({
          slotId: item.slotId,
          defaultSrc: item.defaultSrc,
          defaultAlt: item.defaultAlt,
          imageCaption: item.imageCaption,
          kicker: item.service,
          title: item.headline,
          description: item.description,
          proof: item.evidence,
          proofLabel: "Evidence",
          method: item.method,
        }))}
      />

      <section className="py-16 px-6 bg-earth-950 text-white border-y border-earth-900">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl mb-8">
            <p className="text-ochre-200 text-sm uppercase tracking-[0.24em] mb-3">
              Service projects showcase
            </p>
            <h2 className="text-3xl md:text-4xl font-display mb-4">
              Browse active project streams with media and impact markers
            </h2>
            <p className="text-white/75 leading-relaxed">
              Browse active project streams across Oonchiumpa's flagship services.
              Use tags to find where photo and video storytelling is strongest.
            </p>
            {(empathyImageLoading || empathyVideoLoading) && (
              <p className="text-white/55 text-sm mt-3">
                Updating media completeness signals...
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveProjectTag("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeProjectTag === "all"
                  ? "bg-ochre-600 text-white"
                  : "bg-white/10 text-white border border-white/20 hover:bg-white/15"
              }`}
            >
              All projects
            </button>
            {projectTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveProjectTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeProjectTag === tag
                    ? "bg-ochre-600 text-white"
                    : "bg-white/10 text-white border border-white/20 hover:bg-white/15"
                }`}
              >
                {formatTagLabel(tag)}
              </button>
            ))}
          </div>

          {filteredProjectCards.length === 0 ? (
            <div className="rounded-2xl border border-white/15 bg-white/5 p-8 text-white/80">
              No service projects match this tag yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjectCards.map((card) => (
                <article
                  key={card.id}
                  className="rounded-2xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-sm flex flex-col"
                >
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-44 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-44 bg-white/10 flex items-center justify-center text-white/45 font-display text-4xl">
                      {card.title.charAt(0)}
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full text-xs bg-white/10 border border-white/20 text-white/85">
                        {card.metric}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.16em] text-white/60">
                        {card.source === "flagship" ? "Flagship" : "Project"}
                      </span>
                    </div>

                    <h3 className="text-2xl font-display mb-3 text-white">{card.title}</h3>
                    <p className="text-white/75 text-base leading-relaxed mb-4">{card.summary}</p>

                    {card.quote && (
                      <p className="text-white/65 text-sm italic leading-relaxed mb-4 line-clamp-3">
                        "{card.quote}"
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-5">
                      {card.tags.slice(0, 4).map((tag) => (
                        <span
                          key={`${card.id}-${tag}`}
                          className="px-2 py-1 rounded-full text-xs bg-ochre-200/20 text-ochre-100 border border-ochre-100/20"
                        >
                          {formatTagLabel(tag)}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-5">
                      <div
                        className={`rounded-md px-2 py-1 text-[11px] text-center border ${
                          card.hasPhoto
                            ? "bg-eucalyptus-200/20 text-eucalyptus-100 border-eucalyptus-200/30"
                            : "bg-sunset-300/20 text-sunset-100 border-sunset-300/30"
                        }`}
                      >
                        {card.hasPhoto ? "Photos ready" : "Photos needed"}
                      </div>
                      <div
                        className={`rounded-md px-2 py-1 text-[11px] text-center border ${
                          card.hasVideo
                            ? "bg-eucalyptus-200/20 text-eucalyptus-100 border-eucalyptus-200/30"
                            : "bg-sunset-300/20 text-sunset-100 border-sunset-300/30"
                        }`}
                      >
                        {card.hasVideo ? "Video ready" : "Video needed"}
                      </div>
                      <div
                        className={`rounded-md px-2 py-1 text-[11px] text-center border ${
                          card.hasQuote
                            ? "bg-eucalyptus-200/20 text-eucalyptus-100 border-eucalyptus-200/30"
                            : "bg-sunset-300/20 text-sunset-100 border-sunset-300/30"
                        }`}
                      >
                        {card.hasQuote ? "Quotes ready" : "Quotes needed"}
                      </div>
                    </div>

                    {(card.matchedPhotoCount > 0 || card.matchedVideoCount > 0) && (
                      <p className="text-[11px] text-white/60 mb-4">
                        Empathy matches: {card.matchedPhotoCount} photos · {card.matchedVideoCount} videos
                      </p>
                    )}

                    {card.matchedPhotoPreviews.length > 0 && (
                      <div className="mb-4">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-white/55 mb-2">
                          Photo preview
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {card.matchedPhotoPreviews.map((asset) => (
                            <div
                              key={asset.id}
                              className="aspect-square rounded-md overflow-hidden border border-white/20 bg-white/10"
                              title={asset.title || "Matched image"}
                            >
                              <img
                                src={asset.url}
                                alt={asset.title || `${card.title} matched photo`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {card.matchedVideoPreviews.length > 0 && (
                      <div className="mb-5 space-y-1">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-white/55">
                          Video preview
                        </p>
                        {card.matchedVideoPreviews.map((asset) => (
                          <div key={asset.id} className="flex items-center gap-2 text-xs text-white/70">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/30 text-[10px]">
                              ▶
                            </span>
                            <span className="line-clamp-1">{asset.title || "Matched video asset"}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <Link
                      to={`/services/${card.routeId}`}
                      className="inline-flex items-center text-ochre-200 font-medium hover:text-ochre-100 transition-colors mt-auto"
                    >
                      Open service project
                      <span className="ml-2">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {!syndicatedServicesLoading && syndicatedServices.length > 0 && (
      <section className="py-16 px-6 border-t border-earth-100 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-8">
            <p className="text-ochre-600 text-sm uppercase tracking-[0.24em] mb-3">
              Active projects
            </p>
            <h2 className="text-3xl md:text-4xl font-display text-earth-950 mb-4">
              Service profiles and community impact
            </h2>
            <p className="text-earth-600 leading-relaxed">
              Public service profiles, hero quotes, and theme signals from
              Oonchiumpa's current programs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {syndicatedServices.map((service) => (
                <article
                  key={service.id}
                  className="section-shell p-0 overflow-hidden flex flex-col"
                >
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-44 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-44 bg-earth-100 flex items-center justify-center text-earth-400 text-4xl font-display">
                      {service.name.charAt(0)}
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full text-xs bg-earth-100 text-earth-700 border border-earth-200">
                        {service.storytellerCount} storytellers
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs bg-earth-100 text-earth-700 border border-earth-200">
                        {service.linkedStoryCount} stories
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs bg-earth-100 text-earth-700 border border-earth-200">
                        {service.quoteCount} quotes
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs bg-earth-100 text-earth-700 border border-earth-200">
                        {service.media.photoCount} photos · {service.media.videoCount} videos
                      </span>
                    </div>
                    <h3 className="text-2xl font-display text-earth-950 mb-3">
                      {service.name}
                    </h3>
                    {(service.detail.overview || service.description) && (
                      <p className="text-earth-700 text-base leading-relaxed mb-4">
                        {service.detail.overview || service.description}
                      </p>
                    )}
                    {service.heroQuotes[0]?.text && (
                      <p className="text-earth-600 text-sm italic leading-relaxed mb-4 line-clamp-3">
                        "{service.heroQuotes[0].text}"
                      </p>
                    )}
                    {(service.detail.serviceTags.length > 0 || service.topThemes.length > 0) && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {service.detail.serviceTags.slice(0, 3).map((tag) => (
                          <span
                            key={`${service.id}-service-tag-${tag}`}
                            className="px-2 py-1 rounded-full text-xs bg-eucalyptus-50 text-eucalyptus-700 border border-eucalyptus-100"
                          >
                            {tag}
                          </span>
                        ))}
                        {service.topThemes.slice(0, 3).map((theme) => (
                          <span
                            key={`${service.id}-${theme.theme}`}
                            className="px-2 py-1 rounded-full text-xs bg-ochre-50 text-ochre-700 border border-ochre-100"
                          >
                            {theme.theme}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link
                      to={`/services/${service.slug || service.id}`}
                      className="inline-flex items-center text-ochre-700 font-medium hover:text-ochre-800 transition-colors mt-auto"
                    >
                      Open service detail
                      <span className="ml-2">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
        </div>
      </section>
      )}

      <section className="py-20 px-6 bg-sand-50">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-10">
            <p className="text-ochre-600 text-sm uppercase tracking-[0.24em] mb-3">
              Program deep dives
            </p>
            <h2 className="text-3xl md:text-4xl font-display text-earth-950 mb-4">
              Explore each flagship program
            </h2>
            <p className="text-earth-600 leading-relaxed">
              Detailed pages include delivery model, outcomes evidence, media galleries, and inquiry pathways.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {detailedPrograms.map((program) => (
              <article
                key={program.id}
                className="section-shell overflow-hidden p-0 group"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={program.media}
                    alt={`${program.title} showcase`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-ochre-700 mb-2">
                    {program.stat}
                  </p>
                  <h3 className="text-2xl font-display text-earth-950 mb-3">{program.title}</h3>
                  <p className="text-earth-700 leading-relaxed mb-5">{program.summary}</p>
                  <Link
                    to={`/services/${program.id}`}
                    className="inline-flex items-center text-ochre-700 font-medium hover:text-ochre-800 transition-colors"
                  >
                    View full service detail
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="max-w-3xl">
            <p className="text-ochre-600 text-sm uppercase tracking-[0.25em] mb-3">
              Full service list
            </p>
            <h2 className="text-3xl font-display text-earth-950 mb-4">
              Complete support areas
            </h2>
            <p className="text-earth-600 leading-relaxed">
              Oonchiumpa delivers integrated support across justice, education,
              culture, health, and family wellbeing.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="group flex flex-col rounded-3xl border border-earth-100 bg-white overflow-hidden hover:border-ochre-200 hover:shadow-[0_16px_40px_rgba(47,30,26,0.12)] transition-[border-color,box-shadow] duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden bg-earth-100">
                  <img
                    src={service.image}
                    alt={service.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col flex-1 p-7 md:p-8">
                  <h3 className="text-2xl font-display text-earth-950 mb-3 group-hover:text-ochre-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-earth-700 text-base leading-relaxed mb-5 flex-1">
                    {service.summary}
                  </p>
                  <div className="rounded-xl bg-sand-50 border border-earth-100 p-4 mb-5">
                    <p className="text-ochre-600 text-[11px] uppercase tracking-[0.24em] mb-2 font-semibold">
                      Outcome
                    </p>
                    <p className="text-earth-700 text-sm leading-relaxed">{service.outcome}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-earth-100">
                    <span className="inline-flex items-center gap-2 text-ochre-700 font-semibold text-base group-hover:gap-3 transition-[gap]">
                      Learn more
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(contactUrlFor(service));
                      }}
                      className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl bg-ochre-50 text-ochre-700 hover:bg-ochre-100 transition-colors"
                    >
                      {service.ctaLabel}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <VideoSpotlight
        eyebrow="Service videos"
        title="See programs in action"
        description="A rotating set of published videos from field delivery, family support, and on-Country work."
      />

      {/* CTA */}
      <section className="bg-earth-900 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-display text-white mb-4">
            Need support for a young person?
          </h2>
          <p className="text-white/70 mb-8">
            We accept referrals from families, schools, police, youth justice,
            and other services. All inquiries are confidential.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/contact?type=referral")}
              className="btn-primary px-7"
            >
              Make a referral
            </button>
            <a
              href="tel:0474702523"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-white font-semibold bg-white/10 backdrop-blur border border-white/25 hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2"
            >
              Call 0474 702 523
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
