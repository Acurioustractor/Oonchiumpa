import { supabase } from "../config/supabase";

export interface PublicVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  tags: string[];
  service_area: string | null;
  category: string | null;
  video_type: "youtube" | "vimeo" | "descript" | "direct";
  video_id: string;
  embed_code: string;
  published_at: string;
  duration: number | null;
}

interface FetchPublicVideosOptions {
  limit?: number;
  serviceArea?: string;
}

const VIDEO_SELECT =
  "id, title, description, video_url, thumbnail_url, tags, service_area, category, video_type, video_id, embed_code, published_at, created_at, updated_at, duration";

const VIDEO_LINK_SELECT =
  "id, title, description, video_url, thumbnail_url, platform, status, created_at, updated_at, duration";

const toText = (value: unknown): string => (typeof value === "string" ? value : "");

const normalizeTags = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeVideoType = (value: unknown): PublicVideo["video_type"] => {
  const normalized = toText(value).toLowerCase();
  if (normalized === "youtube" || normalized === "vimeo" || normalized === "descript") {
    return normalized;
  }
  return "direct";
};

const isMissingTableError = (error: unknown, tableName: string): boolean => {
  if (!error || typeof error !== "object") return false;
  const maybe = error as { code?: string; message?: string };
  return (
    maybe.code === "PGRST205" &&
    typeof maybe.message === "string" &&
    maybe.message.includes(`public.${tableName}`)
  );
};

const normalizeRow = (row: Record<string, unknown>): PublicVideo | null => {
  const videoUrl = toText(row.video_url);
  if (!videoUrl) return null;

  const id = toText(row.id);
  if (!id) return null;

  const status = toText(row.status).toLowerCase();
  if (status && status !== "published") return null;

  return {
    id,
    title: toText(row.title) || "Community video",
    description: toText(row.description) || null,
    video_url: videoUrl,
    thumbnail_url: toText(row.thumbnail_url) || null,
    tags: normalizeTags(row.tags),
    service_area: toText(row.service_area) || null,
    category: toText(row.category) || null,
    video_type: normalizeVideoType(row.video_type || row.platform),
    video_id: toText(row.video_id),
    embed_code: toText(row.embed_code),
    published_at:
      toText(row.published_at) ||
      toText(row.created_at) ||
      toText(row.updated_at) ||
      new Date().toISOString(),
    duration: typeof row.duration === "number" ? row.duration : null,
  };
};

const normalizeRows = (rows: Record<string, unknown>[] | null): PublicVideo[] =>
  (rows || [])
    .map((row) => normalizeRow(row))
    .filter((video): video is PublicVideo => Boolean(video));

async function fetchFromVideosTable(
  options: FetchPublicVideosOptions,
): Promise<{ videos: PublicVideo[]; error: unknown | null }> {
  let query = supabase
    .from("videos")
    .select(VIDEO_SELECT)
    .eq("status", "published")
    .eq("is_public", true)
    .not("video_url", "is", null)
    .order("published_at", { ascending: false });

  if (options.serviceArea) {
    query = query.eq("service_area", options.serviceArea);
  }

  if (typeof options.limit === "number") {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    return { videos: [], error };
  }

  return { videos: normalizeRows((data || []) as Record<string, unknown>[]), error: null };
}

async function fetchFromVideoLinksTable(
  options: FetchPublicVideosOptions,
): Promise<{ videos: PublicVideo[]; error: unknown | null }> {
  let query = supabase
    .from("video_links")
    .select(VIDEO_LINK_SELECT)
    .not("video_url", "is", null)
    .order("created_at", { ascending: false });

  if (typeof options.limit === "number") {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    return { videos: [], error };
  }

  const videos = normalizeRows((data || []) as Record<string, unknown>[]);

  if (!options.serviceArea) {
    return { videos, error: null };
  }

  const serviceNeedle = options.serviceArea.toLowerCase();
  return {
    videos: videos.filter((video) =>
      [video.title, video.description || "", video.category || ""]
        .join(" ")
        .toLowerCase()
        .includes(serviceNeedle),
    ),
    error: null,
  };
}

export async function fetchPublicVideos(
  options: FetchPublicVideosOptions = {},
): Promise<{ videos: PublicVideo[]; error: unknown | null }> {
  const primary = await fetchFromVideoLinksTable(options);
  if (!primary.error) {
    return primary;
  }

  if (!isMissingTableError(primary.error, "video_links")) {
    return primary;
  }

  return fetchFromVideosTable(options);
}
