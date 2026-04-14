import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMedia, useStories, useStorytellers } from "../hooks/useEmpathyLedger";
import { EditableImage } from "../components/EditableImage";
import { HeroVideo } from "../components/HeroVideo";
import { ServiceProgramsRail } from "../components/ServiceProgramsRail";

interface StorytellerCircle {
  id: string;
  name: string;
  avatarUrl: string | null;
  isElder: boolean;
  storyCount: number;
}

const initialsFromName = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const StoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { stories, loading: storiesLoading } = useStories(80);
  const { storytellers } = useStorytellers(40);
  const { media: storytellerPhotos, loading: photosLoading } = useMedia({
    limit: 12,
    type: "image",
  });

  const [selectedStorytellerId, setSelectedStorytellerId] = React.useState("all");
  const [showStoriesWithPhotos, setShowStoriesWithPhotos] = React.useState(false);

  const formatDate = (d?: string | null) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const storytellerCircles = React.useMemo(() => {
    const countByStoryteller = new Map<string, number>();
    for (const story of stories) {
      if (!story.storyteller?.id) continue;
      countByStoryteller.set(
        story.storyteller.id,
        (countByStoryteller.get(story.storyteller.id) || 0) + 1,
      );
    }

    const merged = new Map<string, StorytellerCircle>();

    for (const storyteller of storytellers) {
      if (!storyteller.isActive) continue;
      merged.set(storyteller.id, {
        id: storyteller.id,
        name: storyteller.displayName,
        avatarUrl: storyteller.avatarUrl,
        isElder: storyteller.isElder,
        storyCount:
          countByStoryteller.get(storyteller.id) ?? storyteller.storyCount ?? 0,
      });
    }

    for (const story of stories) {
      if (!story.storyteller?.id) continue;
      const existing = merged.get(story.storyteller.id);
      if (existing) {
        if (!existing.avatarUrl && story.storyteller.avatarUrl) {
          existing.avatarUrl = story.storyteller.avatarUrl;
        }
        continue;
      }
      merged.set(story.storyteller.id, {
        id: story.storyteller.id,
        name: story.storyteller.displayName,
        avatarUrl: story.storyteller.avatarUrl,
        isElder: false,
        storyCount: countByStoryteller.get(story.storyteller.id) || 1,
      });
    }

    return Array.from(merged.values())
      .filter((s) => s.storyCount > 0)
      .sort((a, b) => b.storyCount - a.storyCount || a.name.localeCompare(b.name));
  }, [stories, storytellers]);

  const filteredStories = React.useMemo(
    () =>
      stories.filter((story) => {
        const storytellerMatches =
          selectedStorytellerId === "all" ||
          story.storyteller?.id === selectedStorytellerId;
        const photoMatches = !showStoriesWithPhotos || Boolean(story.imageUrl);
        return storytellerMatches && photoMatches;
      }),
    [stories, selectedStorytellerId, showStoriesWithPhotos],
  );

  const featuredStory = filteredStories[0];
  const remainingStories = filteredStories.slice(1);

  const selectedStorytellerName =
    selectedStorytellerId === "all"
      ? "All storytellers"
      : storytellerCircles.find((s) => s.id === selectedStorytellerId)?.name ||
        "Selected storyteller";

  return (
    <div className="min-h-screen bg-white">
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        <HeroVideo
          src="/videos/hero/boxing.mp4"
          poster="/videos/hero/boxing.jpg"
          alt="Young people training in the gym"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950/80 via-earth-950/45 to-transparent" />

        <div className="relative z-10 container-custom pb-14 pt-28">
          <p className="eyebrow text-ochre-200 mb-4">From the community</p>
          <h1 className="heading-lg text-white mb-5">Stories</h1>
          <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
            Journeys of connection to Country, cultural healing, and transformation,
            shared with care and cultural respect.
          </p>
        </div>
      </section>

      <section className="px-6 py-10 border-b border-earth-100 bg-sand-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-ochre-600 text-xs uppercase tracking-[0.24em] mb-2">
                Storyteller circles
              </p>
              <h2 className="text-2xl md:text-3xl font-display text-earth-950">
                Filter stories by storyteller and photo coverage
              </h2>
            </div>

            <button
              onClick={() => setShowStoriesWithPhotos((prev) => !prev)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                showStoriesWithPhotos
                  ? "bg-earth-900 text-white"
                  : "bg-white text-earth-700 border border-earth-200 hover:border-earth-300"
              }`}
            >
              {showStoriesWithPhotos ? "Showing photo stories" : "Only stories with photos"}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedStorytellerId("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedStorytellerId === "all"
                  ? "bg-ochre-600 text-white"
                  : "bg-white text-earth-700 border border-earth-200 hover:border-earth-300"
              }`}
            >
              All storytellers
            </button>

            {storytellerCircles.map((storyteller) => (
              <button
                key={storyteller.id}
                onClick={() => setSelectedStorytellerId(storyteller.id)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-full transition ${
                  selectedStorytellerId === storyteller.id
                    ? "bg-earth-900 text-white"
                    : "bg-white text-earth-700 border border-earth-200 hover:border-earth-300"
                }`}
              >
                {storyteller.avatarUrl ? (
                  <img
                    src={storyteller.avatarUrl}
                    alt={storyteller.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-ochre-100 text-ochre-700 flex items-center justify-center text-xs font-semibold">
                    {initialsFromName(storyteller.name)}
                  </div>
                )}
                <span className="text-sm">{storyteller.name}</span>
                <span className="text-xs opacity-80">({storyteller.storyCount})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 pt-10">
        <div className="max-w-5xl mx-auto">
          {storiesLoading ? (
            <div className="text-earth-400 text-center py-20">Loading stories...</div>
          ) : stories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-earth-500 text-lg mb-2">No stories published yet.</p>
              <p className="text-earth-400 text-sm">
                Stories are written in Empathy Ledger and syndicated here automatically.
              </p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="section-shell p-10 text-center max-w-3xl mx-auto">
              <h3 className="text-2xl font-display text-earth-950 mb-3">
                No stories match this filter
              </h3>
              <p className="text-earth-600 mb-6">
                Try another storyteller selection or turn off the photos-only filter.
              </p>
              <button
                onClick={() => {
                  setSelectedStorytellerId("all");
                  setShowStoriesWithPhotos(false);
                }}
                className="btn-secondary"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {featuredStory && (
                <article className="section-shell overflow-hidden p-0">
                  <Link
                    to={`/stories/${featuredStory.id}`}
                    className="group grid lg:grid-cols-2 gap-0 items-stretch"
                  >
                    {featuredStory.imageUrl ? (
                      <div className="min-h-[280px] lg:min-h-[360px] overflow-hidden">
                        <img
                          src={featuredStory.imageUrl}
                          alt={featuredStory.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full min-h-[280px] lg:min-h-[360px] bg-earth-100 flex items-center justify-center">
                        <span className="text-earth-300 text-7xl font-display">
                          {featuredStory.title.charAt(0)}
                        </span>
                      </div>
                    )}

                    <div className="p-7 md:p-9 flex flex-col justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-ochre-700 mb-3">
                          Featured story
                        </p>
                        <h2 className="text-3xl md:text-4xl font-display text-earth-950 mb-4 group-hover:text-ochre-700 transition-colors leading-snug">
                          {featuredStory.title}
                        </h2>
                        {featuredStory.excerpt && (
                          <p className="text-earth-700 leading-relaxed mb-6 text-lg line-clamp-4">
                            {featuredStory.excerpt}
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          {featuredStory.storyteller?.avatarUrl ? (
                            <img
                              src={featuredStory.storyteller.avatarUrl}
                              alt={featuredStory.storyteller.displayName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-ochre-100 flex items-center justify-center">
                              <span className="text-ochre-700 font-semibold text-sm">
                                {initialsFromName(
                                  featuredStory.storyteller?.displayName || "OC",
                                )}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-earth-950 text-sm font-medium">
                              {featuredStory.storyteller?.displayName || "Community voice"}
                            </p>
                            {featuredStory.publishedAt && (
                              <p className="text-earth-500 text-xs">
                                {formatDate(featuredStory.publishedAt)}
                              </p>
                            )}
                          </div>
                        </div>

                        <p className="text-sm font-medium text-ochre-700 group-hover:text-ochre-800 transition-colors">
                          Read full story →
                        </p>
                      </div>
                    </div>
                  </Link>
                </article>
              )}

              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-sm text-earth-500">
                  {filteredStories.length}{" "}
                  {filteredStories.length === 1 ? "story" : "stories"} shown ·{" "}
                  {selectedStorytellerName}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate("/videos")}
                    className="btn-secondary text-sm py-2 px-4"
                  >
                    Watch videos
                  </button>
                  <button
                    onClick={() => navigate("/services")}
                    className="btn-secondary text-sm py-2 px-4"
                  >
                    View services
                  </button>
                </div>
              </div>

              {remainingStories.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {remainingStories.map((story) => (
                    <article key={story.id} className="section-shell p-5 md:p-6">
                      <Link to={`/stories/${story.id}`} className="group block">
                        {story.imageUrl ? (
                          <div className="rounded-lg overflow-hidden mb-4">
                            <img
                              src={story.imageUrl}
                              alt={story.title}
                              className="w-full h-56 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-56 rounded-lg bg-earth-100 flex items-center justify-center mb-4">
                            <span className="text-earth-300 text-5xl font-display">
                              {story.title.charAt(0)}
                            </span>
                          </div>
                        )}

                        <h3 className="text-2xl font-display text-earth-950 mb-3 group-hover:text-ochre-700 transition-colors leading-snug">
                          {story.title}
                        </h3>

                        {story.excerpt && (
                          <p className="text-earth-600 leading-relaxed mb-5 line-clamp-3">
                            {story.excerpt}
                          </p>
                        )}

                        <div className="flex items-center justify-between gap-3">
                          {story.storyteller ? (
                            <div className="flex items-center gap-2">
                              {story.storyteller.avatarUrl ? (
                                <img
                                  src={story.storyteller.avatarUrl}
                                  alt={story.storyteller.displayName}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-ochre-100 flex items-center justify-center">
                                  <span className="text-ochre-700 font-bold text-xs">
                                    {initialsFromName(story.storyteller.displayName)}
                                  </span>
                                </div>
                              )}
                              <p className="text-earth-500 text-xs">
                                {story.storyteller.displayName}
                              </p>
                            </div>
                          ) : (
                            <span />
                          )}
                          {story.publishedAt && (
                            <p className="text-earth-400 text-xs">
                              {formatDate(story.publishedAt)}
                            </p>
                          )}
                        </div>

                        {story.themes?.filter(Boolean).length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {story.themes
                              .filter(Boolean)
                              .slice(0, 3)
                              .map((theme, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 text-xs text-earth-600 bg-earth-100 rounded-lg"
                                >
                                  {theme}
                                </span>
                              ))}
                          </div>
                        )}
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="section-shell p-8 text-center text-earth-600">
                  No additional stories in this filtered view.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {(photosLoading || storytellerPhotos.length > 0) && (
        <section className="bg-earth-50 py-16 px-6 border-y border-earth-100">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <p className="text-ochre-600 text-sm uppercase tracking-[0.24em] mb-3">
                Storyteller photos
              </p>
              <h2 className="text-3xl font-display text-earth-950 mb-3">
                Recent photos synced from Empathy Ledger
              </h2>
              <p className="text-earth-600">
                Photo assets update automatically when new approved media is published.
              </p>
            </div>

            {photosLoading ? (
              <div className="text-earth-500">Loading storyteller photos...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {storytellerPhotos.map((asset) => (
                  <article
                    key={asset.id}
                    className="section-shell p-0 overflow-hidden"
                  >
                    {asset.thumbnailUrl || asset.url ? (
                      <img
                        src={asset.thumbnailUrl || asset.url || ""}
                        alt={asset.altText || asset.title || "Storyteller photo"}
                        className="w-full h-36 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-36 bg-earth-100 flex items-center justify-center text-earth-400 text-xs">
                        No preview
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <ServiceProgramsRail
        slotPrefix="stories-program"
        eyebrow="From story to service"
        title="The programs behind community stories"
        description="Stories come from active service delivery. Explore each program stream to see how support is designed and delivered."
      />

      <section className="bg-earth-950 text-white py-14 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display mb-4">
            Want to see the programs behind these stories?
          </h2>
          <p className="text-white/80 leading-relaxed mb-8">
            Explore service detail pages, media galleries, and referral pathways for each area of work.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate("/services")} className="btn-primary">
              Explore services
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="btn-secondary border-white/35 bg-white/10 text-white hover:bg-white/20"
            >
              Contact the team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
