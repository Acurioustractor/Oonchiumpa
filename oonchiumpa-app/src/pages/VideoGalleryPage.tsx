import { useEffect, useMemo, useState } from "react";
import { EditableImage } from "../components/EditableImage";
import { ServiceProgramsRail } from "../components/ServiceProgramsRail";
import { useMedia } from "../hooks/useEmpathyLedger";
import {
  fetchPublicVideos,
  type PublicVideo,
} from "../services/videoLibraryService";

type Video = PublicVideo;

const platformMeta: Record<Video["video_type"], { label: string; classes: string }> = {
  youtube: { label: "YouTube", classes: "bg-sunset-100 text-sunset-700 border border-sunset-200" },
  vimeo: { label: "Vimeo", classes: "bg-eucalyptus-100 text-eucalyptus-700 border border-eucalyptus-200" },
  descript: { label: "Descript", classes: "bg-eucalyptus-100 text-eucalyptus-700 border border-eucalyptus-200" },
  direct: { label: "Video", classes: "bg-earth-100 text-earth-700 border border-earth-200" },
};

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function VideoGalleryPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [filterTag, setFilterTag] = useState<string>("all");
  const { media: empathyVideos, loading: empathyVideosLoading } = useMedia({
    limit: 24,
    type: "video",
  });

  useEffect(() => {
    void loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    const { videos: data, error } = await fetchPublicVideos();

    if (error) {
      console.error("Failed to load video library:", error);
    }

    if (data) {
      setVideos(data);
    }
    setLoading(false);
  };

  const allTags = useMemo(
    () => Array.from(new Set(videos.flatMap((v) => v.tags || []))).sort(),
    [videos]
  );

  const filteredVideos = useMemo(
    () =>
      filterTag === "all"
        ? videos
        : videos.filter((video) => video.tags?.includes(filterTag)),
    [videos, filterTag]
  );

  const featuredVideo = filteredVideos[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ochre-600 mx-auto"></div>
          <p className="mt-4 text-earth-600">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        <EditableImage
          slotId="videos-hero-background"
          defaultSrc="/images/model/community-on-country.jpg"
          defaultAlt="Community moments on Country"
          className="absolute inset-0 w-full h-full object-cover"
          wrapperClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950/85 via-earth-950/55 to-earth-950/20" />

        <div className="relative z-10 container-custom pb-14 md:pb-18 pt-28">
          <p className="eyebrow text-ochre-200 mb-4">Video library</p>
          <h1 className="heading-lg text-white mb-5 max-w-4xl">
            Stories, services, and on-Country programs in motion
          </h1>
          <p className="text-white/80 text-lg max-w-3xl leading-relaxed mb-8">
            Curated video content showing how Oonchiumpa delivers culturally-led support in practice.
          </p>
          <div className="inline-flex items-center gap-3 rounded-full px-4 py-2 bg-white/15 border border-white/20 text-white/90 text-sm">
            <span className="text-lg font-display text-ochre-200">{videos.length}</span>
            Published videos
          </div>
        </div>
      </section>

      <section className="border-b border-earth-200 bg-sand-50">
        <div className="container-custom py-5 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterTag("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filterTag === "all"
                ? "bg-earth-900 text-white"
                : "bg-white text-earth-700 border border-earth-200 hover:border-earth-300"
            }`}
          >
            All videos
          </button>

          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filterTag === tag
                  ? "bg-ochre-600 text-white"
                  : "bg-white text-earth-700 border border-earth-200 hover:border-earth-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      <section className="container-custom py-12 md:py-16">
        {filteredVideos.length === 0 ? (
          <div className="section-shell p-12 text-center">
            <h2 className="text-2xl font-display text-earth-950 mb-3">No videos in this category yet</h2>
            <p className="text-earth-600">Try another filter or check back after new content is published.</p>
          </div>
        ) : (
          <>
            {featuredVideo && (
              <article
                className="grid lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden border border-earth-100 shadow-[0_12px_30px_rgba(47,30,26,0.12)] mb-10 cursor-pointer"
                onClick={() => setSelectedVideo(featuredVideo)}
              >
                <div className="relative min-h-[240px] lg:col-span-3 bg-earth-100">
                  {featuredVideo.thumbnail_url ? (
                    <img
                      src={featuredVideo.thumbnail_url}
                      alt={featuredVideo.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-earth-200 to-earth-100" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-earth-950/60 via-earth-950/10 to-transparent" />

                  <div className="absolute bottom-5 left-5 inline-flex items-center px-4 py-2 rounded-full bg-white/15 backdrop-blur border border-white/25 text-white text-sm">
                    Watch featured video
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white p-6 md:p-7">
                  <div
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mb-4 ${platformMeta[featuredVideo.video_type].classes}`}
                  >
                    {platformMeta[featuredVideo.video_type].label}
                  </div>
                  <h2 className="text-2xl font-display text-earth-950 mb-3 leading-tight">
                    {featuredVideo.title}
                  </h2>
                  {featuredVideo.description && (
                    <p className="text-earth-700 leading-relaxed mb-5">{featuredVideo.description}</p>
                  )}
                  <div className="text-sm text-earth-500 mb-4">Published {formatDate(featuredVideo.published_at)}</div>
                  <div className="flex flex-wrap gap-2">
                    {featuredVideo.tags?.slice(0, 4).map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-sand-100 text-earth-700 text-xs rounded-full border border-earth-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.slice(1).map((video) => (
                <article
                  key={video.id}
                  className="card cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative aspect-video bg-earth-100">
                    <div className="absolute top-3 right-3 z-10">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${platformMeta[video.video_type].classes}`}
                      >
                        {platformMeta[video.video_type].label}
                      </span>
                    </div>

                    {video.thumbnail_url ? (
                      <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-earth-200 to-earth-100" />
                    )}

                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200" />
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-display text-earth-950 mb-2 line-clamp-2 leading-snug">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-earth-600 line-clamp-2 mb-3 leading-relaxed">
                        {video.description}
                      </p>
                    )}
                    <p className="text-xs text-earth-500 mb-3">{formatDate(video.published_at)}</p>
                    <div className="flex flex-wrap gap-2">
                      {video.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-ochre-50 text-ochre-700 text-xs rounded-full border border-ochre-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <ServiceProgramsRail
        slotPrefix="videos-program"
        eyebrow="Program portfolio"
        title="See where each video fits across service delivery"
        description="Video content reflects active program streams. Open any service page for deeper delivery context and outcomes evidence."
      />

      {empathyVideos.length > 0 && (
        <section className="container-custom py-12 md:py-16">
          <div className="max-w-4xl mb-8">
            <p className="eyebrow mb-3">More from the field</p>
            <h2 className="heading-lg text-3xl md:text-4xl mb-4">
              Additional field videos
            </h2>
            <p className="text-earth-700 text-lg leading-relaxed">
              Recent videos from Oonchiumpa's programs and on-country work.
            </p>
          </div>

          {empathyVideosLoading ? (
            <div className="text-earth-500">Loading videos...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {empathyVideos.map((asset) => (
                <article key={asset.id} className="section-shell p-0 overflow-hidden">
                  <div className="aspect-video bg-earth-100">
                    {asset.url ? (
                      <video
                        src={asset.url}
                        poster={asset.thumbnailUrl || undefined}
                        controls
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    ) : asset.thumbnailUrl ? (
                      <img
                        src={asset.thumbnailUrl}
                        alt={asset.altText || asset.title || "Video thumbnail"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-earth-400">
                        Video asset
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-display text-earth-950 mb-2 line-clamp-2">
                      {asset.title || "Field video"}
                    </h3>
                    {asset.description && (
                      <p className="text-earth-600 text-base leading-relaxed line-clamp-2 mb-3">
                        {asset.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(asset.culturalTags || []).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-earth-100 text-earth-700 text-xs rounded-full border border-earth-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {asset.url && (
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-ochre-700 font-medium hover:text-ochre-800 transition-colors"
                      >
                        Open video source
                        <span className="ml-2">↗</span>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {selectedVideo && (
        <div
          className="fixed inset-0 bg-earth-950/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 z-10 bg-white/95 border border-earth-200 rounded-full p-2 hover:bg-earth-50 transition"
              aria-label="Close video"
            >
              <svg className="w-5 h-5 text-earth-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="aspect-video" dangerouslySetInnerHTML={{ __html: selectedVideo.embed_code }} />

            <div className="p-6 md:p-7">
              <div
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mb-3 ${platformMeta[selectedVideo.video_type].classes}`}
              >
                {platformMeta[selectedVideo.video_type].label}
              </div>
              <h2 className="text-2xl font-display text-earth-950 mb-2">{selectedVideo.title}</h2>
              {selectedVideo.description && (
                <p className="text-earth-700 mb-4 leading-relaxed">{selectedVideo.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedVideo.tags?.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 bg-earth-100 text-earth-700 text-xs rounded-full border border-earth-200">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-earth-500">Published {formatDate(selectedVideo.published_at)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
