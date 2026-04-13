import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VideoPlayer } from "./VideoPlayer";
import {
  fetchPublicVideos,
  type PublicVideo,
} from "../services/videoLibraryService";

type SpotlightVideo = PublicVideo;

interface VideoSpotlightProps {
  eyebrow: string;
  title: string;
  description: string;
  limit?: number;
  serviceArea?: string;
  ctaLabel?: string;
  ctaPath?: string;
  className?: string;
}

export const VideoSpotlight: React.FC<VideoSpotlightProps> = ({
  eyebrow,
  title,
  description,
  limit = 3,
  serviceArea,
  ctaLabel = "View all videos",
  ctaPath = "/videos",
  className = "",
}) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<SpotlightVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadVideos = async () => {
      setLoading(true);
      const { videos: data, error } = await fetchPublicVideos({
        limit,
        serviceArea,
      });
      if (error) {
        console.error("Failed to load spotlight videos:", error);
      }

      if (isMounted) {
        setVideos((data || []).filter((v) => Boolean(v.video_url)));
        setLoading(false);
      }
    };

    void loadVideos();
    return () => {
      isMounted = false;
    };
  }, [limit, serviceArea]);

  return (
    <section className={`bg-white py-20 md:py-24 ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <p className="text-ochre-600 text-sm uppercase tracking-[0.25em] mb-3">
              {eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-display text-earth-950 mb-4">
              {title}
            </h2>
            <p className="text-earth-700 text-lg leading-relaxed">{description}</p>
          </div>
          <button
            onClick={() => navigate(ctaPath)}
            className="px-6 py-3 bg-earth-900 text-white rounded-lg hover:bg-earth-800 transition-colors font-medium"
          >
            {ctaLabel}
          </button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video rounded-xl bg-earth-100 mb-4" />
                <div className="h-5 w-3/4 bg-earth-100 rounded mb-2" />
                <div className="h-4 w-full bg-earth-100 rounded" />
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="rounded-2xl border border-earth-200 bg-earth-50 p-8 text-center">
            <p className="text-earth-700 font-medium mb-2">No published videos yet</p>
            <p className="text-earth-600 text-sm">
              Add videos in the staff media flow and they will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <article
                key={video.id}
                className="bg-white border border-earth-100 rounded-2xl overflow-hidden shadow-sm"
              >
                <VideoPlayer
                  url={video.video_url}
                  title={video.title}
                  poster={video.thumbnail_url || undefined}
                  className="aspect-video"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-earth-950 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-earth-600 text-sm leading-relaxed line-clamp-3 mb-3">
                      {video.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {video.service_area && (
                      <span className="px-2.5 py-1 bg-earth-100 text-earth-700 text-xs rounded-full">
                        {video.service_area.replace(/_/g, " ")}
                      </span>
                    )}
                    {(video.tags || []).slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-ochre-100 text-ochre-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
