/**
 * Empathy Ledger v2 API Client for Oonchiumpa
 *
 * Org-scoped API key returns only Oonchiumpa storytellers, stories, and media.
 * Calls the public v2 REST API directly from the browser (CORS enabled).
 */

const BASE_URL = import.meta.env.VITE_EMPATHY_LEDGER_URL || '';
const API_KEY = import.meta.env.VITE_EMPATHY_LEDGER_API_KEY || '';
const ORGANIZATION_SLUG =
  import.meta.env.VITE_EMPATHY_LEDGER_ORGANIZATION || 'oonchiumpa';
const PROJECT_SLUG = import.meta.env.VITE_EMPATHY_LEDGER_PROJECT || '';

export const isConfigured = Boolean(BASE_URL && API_KEY);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Storyteller {
  id: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  culturalBackground: string[] | null;
  location: string | null;
  role: string | null;
  isElder: boolean;
  isActive: boolean;
  storyCount: number;
  createdAt: string;
}

export interface Story {
  id: string;
  title: string;
  excerpt: string | null;
  themes: string[];
  status: string;
  publishedAt: string | null;
  culturalLevel: string | null;
  imageUrl: string | null;
  storyteller: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    culturalBackground: string[] | null;
  } | null;
  createdAt: string;
  detailUrl: string;
}

export interface StoryDetail extends Story {
  content: string | null;
  culturalWarnings: string[] | null;
  hasTranscript: boolean;
  wordCount: number | null;
  location: string | null;
  mediaUrls: string[];
  videoLink: string | null;
}

export interface MediaAsset {
  id: string;
  title: string | null;
  description: string | null;
  filename: string | null;
  contentType: string | null;
  url: string | null;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  dimensions: { width: number; height: number } | null;
  altText: string | null;
  culturalTags: string[] | null;
  culturalLevel: string | null;
  location: string | null;
  galleryId: string | null;
  galleryCaption: string | null;
  createdAt: string;
}

export interface Gallery {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  coverImage: string | null;
  photoCount: number;
  mediaAssetCount: number;
  createdAt: string;
  mediaUrl: string;
}

export interface Transcript {
  id: string;
  title: string | null;
  content: string | null;
  status: string | null;
  wordCount: number | null;
  hasVideo: boolean;
  videoUrl: string | null;
  videoThumbnail: string | null;
  storyteller: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  } | null;
  analysis?: {
    themes: string[];
    quotes: Array<{
      text: string;
      context?: string;
      impactScore?: number;
    }>;
    impactAssessment?: unknown;
    culturalFlags?: unknown;
    qualityMetrics?: unknown;
  } | null;
  createdAt: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  authorName: string;
  articleType: string | null;
  primaryProject: string | null;
  publishedAt: string | null;
  tags: string[];
  themes: string[];
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  storyteller: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
  } | null;
  media: {
    photoCount: number;
    videoCount: number;
    photoPreviews: Array<{
      url: string | null;
      title: string | null;
      altText: string | null;
    }>;
    videoPreviews: Array<{
      url: string | null;
      title: string | null;
      thumbnailUrl: string | null;
    }>;
  };
  ctas: Array<{
    position: string | null;
    ctaType: string | null;
    buttonText: string | null;
    description: string | null;
    urlTemplate: string | null;
    style: string | null;
    actionType: string | null;
  }>;
}

export interface ArticleDetail extends Article {
  content: string | null;
  authorBio: string | null;
  relatedProjects: string[];
  visibility: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface ProjectAnalysis {
  project: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  };
  themes: Array<{
    name: string;
    count: number;
    confidence?: number;
  }>;
  quotes: Array<{
    text: string;
    context?: string;
    impactScore?: number;
    storytellerId?: string | null;
  }>;
  storytellerCount: number;
  transcriptCount: number;
  qualityScore: number;
  analyzed: boolean;
  analyzedAt?: string | null;
}

export interface SyndicatedService {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  serviceType: string | null;
  status: string | null;
  imageUrl: string | null;
  address: string | null;
  location: { lat: number; lng: number } | null;
  storytellerCount: number;
  linkedStoryCount: number;
  linkedStories: Array<{
    id: string;
    title: string;
    summary: string | null;
    publishedAt: string | null;
    storyteller: {
      id: string | null;
      displayName: string;
      avatarUrl: string | null;
    } | null;
  }>;
  quoteCount: number;
  galleryIds: string[];
  detail: {
    overview: string | null;
    longDescription: string | null;
    deliveryPillars: string[];
    keyOutcomes: string[];
    audience: string[];
    serviceTags: string[];
    cta: {
      label: string | null;
      url: string | null;
      text: string | null;
    };
    testimonial: {
      quote: string | null;
      author: string | null;
      role: string | null;
    };
    impactStats: Array<{
      label: string;
      value: string;
    }>;
  };
  media: {
    photoCount: number;
    videoCount: number;
    photoPreviews: Array<{
      id: string;
      url: string | null;
      title: string | null;
      altText: string | null;
    }>;
    videoPreviews: Array<{
      id: string;
      url: string | null;
      thumbnailUrl: string | null;
      title: string | null;
      duration: number | null;
    }>;
  };
  topThemes: Array<{
    theme: string;
    count: number;
  }>;
  heroQuotes: Array<{
    id: string;
    text: string;
    author: string | null;
    eraLabel: string | null;
    eventYear: number | null;
    isFeatured: boolean;
  }>;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

interface ApiResponse<T> {
  data: T[];
  pagination: Pagination;
}

function slugToLabel(value: string): string {
  if (!value) return 'Project';
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
}

function mapArticleStoryteller(value: unknown): Article['storyteller'] {
  const storyteller = readRecord(value);
  if (!storyteller) return null;

  const id = readString(storyteller.id);
  if (!id) return null;

  return {
    id,
    displayName:
      readString(storyteller.displayName) ||
      readString(storyteller.display_name) ||
      readString(storyteller.name) ||
      'Storyteller',
    avatarUrl:
      readString(storyteller.avatarUrl) ||
      readString(storyteller.avatar_url) ||
      null,
    bio: readString(storyteller.bio),
  };
}

function mapArticleMedia(value: unknown): Article['media'] {
  const media = readRecord(value);
  if (!media) {
    return {
      photoCount: 0,
      videoCount: 0,
      photoPreviews: [],
      videoPreviews: [],
    };
  }

  const photoPreviewsRaw =
    (Array.isArray(media.photoPreviews) ? media.photoPreviews : null) ||
    (Array.isArray(media.photo_previews) ? media.photo_previews : null) ||
    [];

  const videoPreviewsRaw =
    (Array.isArray(media.videoPreviews) ? media.videoPreviews : null) ||
    (Array.isArray(media.video_previews) ? media.video_previews : null) ||
    [];

  const photoPreviews = photoPreviewsRaw
    .map((item) => {
      const row = readRecord(item);
      return {
        url: readString(row?.url),
        title: readString(row?.title),
        altText: readString(row?.altText) || readString(row?.alt_text),
      };
    })
    .filter((item) => Boolean(item.url));

  const videoPreviews = videoPreviewsRaw
    .map((item) => {
      const row = readRecord(item);
      return {
        url: readString(row?.url),
        title: readString(row?.title),
        thumbnailUrl:
          readString(row?.thumbnailUrl) || readString(row?.thumbnail_url),
      };
    })
    .filter((item) => Boolean(item.url));

  return {
    photoCount:
      readNumber(media.photoCount) ??
      readNumber(media.photo_count) ??
      photoPreviews.length,
    videoCount:
      readNumber(media.videoCount) ??
      readNumber(media.video_count) ??
      videoPreviews.length,
    photoPreviews,
    videoPreviews,
  };
}

function mapArticleCtas(value: unknown): Article['ctas'] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const cta = readRecord(item);
      return {
        position: readString(cta?.position),
        ctaType: readString(cta?.ctaType) || readString(cta?.cta_type),
        buttonText:
          readString(cta?.buttonText) || readString(cta?.button_text),
        description: readString(cta?.description),
        urlTemplate:
          readString(cta?.urlTemplate) ||
          readString(cta?.url_template) ||
          readString(cta?.custom_url),
        style: readString(cta?.style),
        actionType:
          readString(cta?.actionType) || readString(cta?.action_type),
      };
    })
    .filter((cta) => Boolean(cta.buttonText) || Boolean(cta.urlTemplate));
}

function extractQualityScore(qualityMetrics: unknown): number | null {
  if (!qualityMetrics || typeof qualityMetrics !== 'object') return readNumber(qualityMetrics);
  const metrics = qualityMetrics as Record<string, unknown>;
  return (
    readNumber(metrics.qualityScore) ??
    readNumber(metrics.quality_score) ??
    readNumber(metrics.overallScore) ??
    readNumber(metrics.overall_score) ??
    readNumber(metrics.score)
  );
}

function mapSyndicatedService(service: Record<string, unknown>): SyndicatedService {
  let location: { lat: number; lng: number } | null = null;
  if (
    service.location &&
    typeof service.location === 'object' &&
    !Array.isArray(service.location)
  ) {
    const lat = readNumber((service.location as Record<string, unknown>).lat);
    const lng = readNumber((service.location as Record<string, unknown>).lng);
    if (lat !== null && lng !== null) {
      location = { lat, lng };
    }
  }

  const detailRaw = readRecord(service.detail);
  const detailCtaRaw = readRecord(detailRaw?.cta);
  const detailTestimonialRaw = readRecord(detailRaw?.testimonial);
  const mediaRaw = readRecord(service.media);

  const detail = {
    overview: readString(detailRaw?.overview),
    longDescription:
      readString(detailRaw?.long_description) ||
      readString(detailRaw?.longDescription),
    deliveryPillars: readStringArray(detailRaw?.delivery_pillars || detailRaw?.deliveryPillars),
    keyOutcomes: readStringArray(detailRaw?.key_outcomes || detailRaw?.keyOutcomes),
    audience: readStringArray(detailRaw?.audience),
    serviceTags: readStringArray(detailRaw?.service_tags || detailRaw?.serviceTags),
    cta: {
      label: readString(detailCtaRaw?.label),
      url: readString(detailCtaRaw?.url),
      text: readString(detailCtaRaw?.text),
    },
    testimonial: {
      quote: readString(detailTestimonialRaw?.quote),
      author: readString(detailTestimonialRaw?.author),
      role: readString(detailTestimonialRaw?.role),
    },
    impactStats: Array.isArray(detailRaw?.impact_stats)
      ? (detailRaw?.impact_stats as Array<Record<string, unknown>>)
          .map((stat) => ({
            label: String(stat.label || '').trim(),
            value: String(stat.value || '').trim(),
          }))
          .filter((stat) => Boolean(stat.label) && Boolean(stat.value))
      : [],
  };

  const media = {
    photoCount: Number(mediaRaw?.photo_count || 0),
    videoCount: Number(mediaRaw?.video_count || 0),
    photoPreviews: Array.isArray(mediaRaw?.photo_previews)
      ? (mediaRaw?.photo_previews as Array<Record<string, unknown>>).map((asset) => ({
          id: String(asset.id || ''),
          url: readString(asset.url),
          title: readString(asset.title),
          altText: readString(asset.alt_text),
        }))
      : [],
    videoPreviews: Array.isArray(mediaRaw?.video_previews)
      ? (mediaRaw?.video_previews as Array<Record<string, unknown>>).map((asset) => ({
          id: String(asset.id || ''),
          url: readString(asset.url),
          thumbnailUrl: readString(asset.thumbnail_url),
          title: readString(asset.title),
          duration: readNumber(asset.duration),
        }))
      : [],
  };

  return {
    id: String(service.id || ''),
    slug: String(service.slug || service.id || ''),
    name: String(service.name || ''),
    description: (service.description as string) || null,
    serviceType: (service.service_type as string) || null,
    status: (service.status as string) || null,
    imageUrl: (service.image_url as string) || null,
    address: (service.address as string) || null,
    location,
    storytellerCount: Number(service.storyteller_count || 0),
    linkedStoryCount: Number(service.linked_story_count || 0),
    linkedStories: (
      (Array.isArray(service.linked_stories) ? service.linked_stories : null) ||
      (Array.isArray(service.linkedStories) ? service.linkedStories : [])
    )
      .map((entry) => {
        const story = readRecord(entry);
        const id = readString(story?.id);
        if (!id) return null;

        const storytellerRaw = readRecord(story?.storyteller);
        const storytellerId = readString(storytellerRaw?.id);
        const storytellerName =
          readString(storytellerRaw?.display_name) ||
          readString(storytellerRaw?.displayName);
        const storytellerAvatar =
          readString(storytellerRaw?.avatar_url) ||
          readString(storytellerRaw?.avatarUrl);

        return {
          id,
          title: readString(story?.title) || 'Community story',
          summary: readString(story?.summary),
          publishedAt:
            readString(story?.published_at) || readString(story?.publishedAt),
          storyteller:
            storytellerId || storytellerName
              ? {
                  id: storytellerId,
                  displayName: storytellerName || 'Community member',
                  avatarUrl: storytellerAvatar,
                }
              : null,
        };
      })
      .filter((story): story is SyndicatedService['linkedStories'][number] => Boolean(story)),
    quoteCount: Number(service.quote_count || 0),
    galleryIds: Array.isArray(service.gallery_ids)
      ? (service.gallery_ids as string[])
      : [],
    detail,
    media,
    topThemes: Array.isArray(service.top_themes)
      ? (service.top_themes as Array<Record<string, unknown>>).map((theme) => ({
          theme: String(theme.theme || ''),
          count: Number(theme.count || 0),
        }))
      : [],
    heroQuotes: Array.isArray(service.hero_quotes)
      ? (service.hero_quotes as Array<Record<string, unknown>>).map((quote) => ({
          id: String(quote.id || ''),
          text: String(quote.text || ''),
          author: (quote.author as string) || null,
          eraLabel: (quote.era_label as string) || null,
          eventYear: readNumber(quote.event_year),
          isFeatured: Boolean(quote.is_featured),
        }))
      : [],
  };
}

function buildTranscriptAnalysisSummary(
  transcripts: Transcript[],
  slugOverride?: string,
): ProjectAnalysis | null {
  if (!transcripts.length) return null;

  const storytellerIds = new Set<string>();
  const themeCounts = new Map<string, number>();
  const quotes: ProjectAnalysis['quotes'] = [];
  const qualityScores: number[] = [];
  let analyzedTranscriptCount = 0;

  for (const transcript of transcripts) {
    if (transcript.storyteller?.id) {
      storytellerIds.add(transcript.storyteller.id);
    }

    const analysis = transcript.analysis;
    if (!analysis) continue;

    analyzedTranscriptCount += 1;

    for (const theme of analysis.themes || []) {
      const normalized = String(theme || '').trim();
      if (!normalized) continue;
      themeCounts.set(normalized, (themeCounts.get(normalized) || 0) + 1);
    }

    for (const quote of analysis.quotes || []) {
      const text = String(quote.text || '').trim();
      if (!text) continue;
      quotes.push({
        text,
        context: quote.context || undefined,
        impactScore:
          quote.impactScore !== undefined ? Number(quote.impactScore) : undefined,
        storytellerId: transcript.storyteller?.id || null,
      });
    }

    const extractedScore = extractQualityScore(analysis.qualityMetrics);
    if (extractedScore !== null) {
      qualityScores.push(extractedScore <= 1 ? extractedScore * 100 : extractedScore);
    }
  }

  const themes = Array.from(themeCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  const sortedQuotes = quotes
    .sort((a, b) => (b.impactScore || 0) - (a.impactScore || 0))
    .slice(0, 20);

  const fallbackQuality =
    transcripts.length > 0 ? (analyzedTranscriptCount / transcripts.length) * 100 : 0;
  const qualityScore =
    qualityScores.length > 0
      ? qualityScores.reduce((sum, value) => sum + value, 0) / qualityScores.length
      : fallbackQuality;

  const resolvedSlug = slugOverride || ORGANIZATION_SLUG || 'organization';

  return {
    project: {
      id: resolvedSlug,
      name: slugToLabel(resolvedSlug),
      slug: resolvedSlug,
      description: null,
    },
    themes,
    quotes: sortedQuotes,
    storytellerCount: storytellerIds.size,
    transcriptCount: transcripts.length,
    qualityScore,
    analyzed: analyzedTranscriptCount > 0,
    analyzedAt: new Date().toISOString(),
  };
}

async function fetchTranscriptAnalysisSample(
  projectSlug?: string,
): Promise<Transcript[]> {
  const baseParams = {
    limit: 100,
    includeAnalysis: true,
    ...(projectSlug ? { project: projectSlug } : {}),
  };

  const first = await getTranscripts({ ...baseParams, page: 1 });
  const transcripts = [...first.data];
  let page = 1;
  let hasMore = first.pagination.hasMore;

  while (hasMore && page < 3) {
    page += 1;
    const next = await getTranscripts({ ...baseParams, page });
    transcripts.push(...next.data);
    hasMore = next.pagination.hasMore;
  }

  return transcripts;
}

// ─── Client ───────────────────────────────────────────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  params?: Record<string, string | number | undefined>,
): Promise<ApiResponse<T>> {
  if (!isConfigured) {
    return { data: [], pagination: { page: 1, limit: 20, total: 0, hasMore: false } };
  }

  const url = new URL(`/api/v2/${endpoint}`, BASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      'X-API-Key': API_KEY,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    console.error(`Empathy Ledger API error ${res.status}:`, await res.text());
    return { data: [], pagination: { page: 1, limit: 20, total: 0, hasMore: false } };
  }

  return res.json();
}

async function apiFetchOne<T>(endpoint: string): Promise<T | null> {
  if (!isConfigured) return null;

  const url = new URL(`/api/v2/${endpoint}`, BASE_URL);
  const res = await fetch(url.toString(), {
    headers: { 'X-API-Key': API_KEY, Accept: 'application/json' },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? json;
}

async function apiFetchContentHub(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<Record<string, unknown> | null> {
  if (!isConfigured) return null;

  const url = new URL(`/api/v1/content-hub/${endpoint}`, BASE_URL);
  if (ORGANIZATION_SLUG) {
    url.searchParams.set('organization', ORGANIZATION_SLUG);
  }
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      'X-API-Key': API_KEY,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    console.error(
      `Empathy Ledger Content Hub API error ${res.status}:`,
      await res.text(),
    );
    return null;
  }

  return res.json();
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getStorytellers(params?: {
  limit?: number;
  page?: number;
}): Promise<ApiResponse<Storyteller>> {
  return apiFetch<Storyteller>('storytellers', params);
}

// ─── Org People (Unified Org People Model) ────────────────────────────────────

export type MembershipType =
  | 'storyteller'
  | 'staff'
  | 'leadership'
  | 'board'
  | 'volunteer'
  | 'partner';

export interface OrgPerson {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  membershipType: MembershipType;
  roleTitle: string | null;
  displayOrder: number;
}

/**
 * Fetch people for the configured org, filtered by membership type(s).
 * Calls the CORS-open Empathy Ledger public endpoint
 * /api/public/organizations/[slug]/people.
 * No API key required — only is_public=true rows are returned.
 */
export async function getOrgPeople(
  types: MembershipType[],
  orgSlug: string = ORGANIZATION_SLUG,
): Promise<OrgPerson[]> {
  if (!BASE_URL || !orgSlug) return [];
  const url = new URL(`/api/public/organizations/${orgSlug}/people`, BASE_URL);
  for (const t of types) url.searchParams.append('type', t);

  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    console.error(`Empathy Ledger people API error ${res.status}:`, await res.text());
    return [];
  }
  const json = (await res.json()) as {
    storytellers?: Array<{
      id: string;
      display_name: string;
      public_avatar_url: string | null;
      bio: string | null;
      membership_type: MembershipType;
      role_title: string | null;
      display_order: number;
    }>;
  };
  return (json.storytellers || []).map((s) => ({
    id: s.id,
    displayName: s.display_name,
    avatarUrl: s.public_avatar_url,
    bio: s.bio,
    membershipType: s.membership_type,
    roleTitle: s.role_title,
    displayOrder: s.display_order,
  }));
}

export async function getStories(params?: {
  limit?: number;
  page?: number;
  storytellerId?: string;
  theme?: string;
}): Promise<ApiResponse<Story>> {
  return apiFetch<Story>('stories', params);
}

export async function getStoryDetail(id: string): Promise<StoryDetail | null> {
  return apiFetchOne<StoryDetail>(`stories/${id}`);
}

export async function getMedia(params?: {
  limit?: number;
  page?: number;
  galleryId?: string;
  type?: string;
  storytellerId?: string;
}): Promise<ApiResponse<MediaAsset>> {
  return apiFetch<MediaAsset>('media', params);
}

/**
 * Fetch every media item across all pages. Use when you need the full library
 * (e.g. the photo picker). EL API caps at 100 per page, this walks the pagination.
 */
export async function getAllMedia(params?: {
  galleryId?: string;
  type?: string;
  storytellerId?: string;
  maxItems?: number;
}): Promise<MediaAsset[]> {
  const maxItems = params?.maxItems ?? 1000;
  const all: MediaAsset[] = [];
  let page = 1;
  while (all.length < maxItems) {
    const res = await apiFetch<MediaAsset>('media', {
      limit: 100,
      page,
      galleryId: params?.galleryId,
      type: params?.type,
      storytellerId: params?.storytellerId,
    });
    all.push(...res.data);
    if (!res.pagination.hasMore || res.data.length === 0) break;
    page += 1;
    if (page > 50) break; // safety
  }
  return all.slice(0, maxItems);
}

export async function getGalleries(params?: {
  limit?: number;
  page?: number;
}): Promise<ApiResponse<Gallery>> {
  return apiFetch<Gallery>('galleries', params);
}

export async function getTranscripts(params?: {
  limit?: number;
  page?: number;
  storytellerId?: string;
  includeAnalysis?: boolean;
  search?: string;
  project?: string;
}): Promise<ApiResponse<Transcript>> {
  if (params?.includeAnalysis) {
    const contentHub = await apiFetchContentHub('transcripts', {
      limit: params.limit,
      page: params.page,
      storyteller: params.storytellerId,
      search: params.search,
      project: params.project || PROJECT_SLUG || undefined,
      include_analysis: true,
    });

    const transcripts = Array.isArray(contentHub?.transcripts)
      ? (contentHub?.transcripts as Array<Record<string, unknown>>).map((t) => ({
          id: String(t.id || ''),
          title: (t.title as string) || null,
          content: (t.content as string) || null,
          status: (t.status as string) || null,
          wordCount:
            typeof t.wordCount === 'number'
              ? t.wordCount
              : typeof t.word_count === 'number'
                ? (t.word_count as number)
                : null,
          hasVideo: Boolean(t.videoUrl || t.video_url),
          videoUrl: (t.videoUrl as string) || (t.video_url as string) || null,
          videoThumbnail:
            (t.videoThumbnail as string) ||
            (t.video_thumbnail as string) ||
            null,
          storyteller: t.storyteller
            ? {
                id: String((t.storyteller as Record<string, unknown>).id || ''),
                displayName:
                  ((t.storyteller as Record<string, unknown>).displayName as string) ||
                  ((t.storyteller as Record<string, unknown>).name as string) ||
                  '',
                avatarUrl:
                  ((t.storyteller as Record<string, unknown>).avatarUrl as string) ||
                  null,
              }
            : null,
          analysis: (t.analysis as Transcript['analysis']) || null,
          createdAt: (t.createdAt as string) || (t.created_at as string) || '',
        }))
      : [];

    return {
      data: transcripts,
      pagination: {
        page:
          (contentHub?.pagination as Record<string, unknown> | undefined)
            ?.page as number || params?.page || 1,
        limit:
          (contentHub?.pagination as Record<string, unknown> | undefined)
            ?.limit as number || params?.limit || 20,
        total:
          (contentHub?.pagination as Record<string, unknown> | undefined)
            ?.total as number || transcripts.length,
        hasMore:
          Boolean(
            (contentHub?.pagination as Record<string, unknown> | undefined)
              ?.hasMore,
          ) ||
          Boolean(
            (contentHub?.pagination as Record<string, unknown> | undefined)
              ?.pages &&
              (contentHub?.pagination as Record<string, unknown>).page &&
              Number(
                (contentHub?.pagination as Record<string, unknown>).page,
              ) <
                Number(
                  (contentHub?.pagination as Record<string, unknown>).pages,
                ),
          ),
      },
    };
  }

  return apiFetch<Transcript>('transcripts', params);
}

export async function getArticles(params?: {
  limit?: number;
  page?: number;
  type?: string;
  tag?: string;
  theme?: string;
  destination?: string;
}): Promise<ApiResponse<Article>> {
  const contentHub = await apiFetchContentHub('articles', {
    limit: params?.limit,
    page: params?.page,
    type: params?.type,
    tag: params?.tag,
    theme: params?.theme,
    destination: params?.destination,
  });

  const articles = Array.isArray(contentHub?.articles)
    ? (contentHub?.articles as Array<Record<string, unknown>>).map((a) => ({
        id: String(a.id || ''),
        slug: String(a.slug || ''),
        title: String(a.title || ''),
        subtitle: (a.subtitle as string) || null,
        excerpt: (a.excerpt as string) || null,
        authorName: String(a.authorName || 'Staff'),
        articleType: (a.articleType as string) || null,
        primaryProject: (a.primaryProject as string) || null,
        publishedAt: (a.publishedAt as string) || null,
        tags: Array.isArray(a.tags) ? (a.tags as string[]) : [],
        themes: Array.isArray(a.themes) ? (a.themes as string[]) : [],
        featuredImageUrl: (a.featuredImageUrl as string) || null,
        featuredImageAlt: (a.featuredImageAlt as string) || null,
        storyteller: mapArticleStoryteller(a.storyteller),
        media: mapArticleMedia(a.media),
        ctas: mapArticleCtas(a.ctas),
      }))
    : [];

  return {
    data: articles,
    pagination: {
      page:
        (contentHub?.pagination as Record<string, unknown> | undefined)
          ?.page as number || params?.page || 1,
      limit:
        (contentHub?.pagination as Record<string, unknown> | undefined)
          ?.limit as number || params?.limit || 20,
      total:
        (contentHub?.pagination as Record<string, unknown> | undefined)
          ?.total as number || articles.length,
      hasMore: Boolean(
        (contentHub?.pagination as Record<string, unknown> | undefined)?.hasMore,
      ),
    },
  };
}

export async function getArticleDetail(
  slug: string,
): Promise<ArticleDetail | null> {
  const article = await apiFetchContentHub(`articles/${slug}`);
  if (!article || !article.id) return null;

  return {
    id: String(article.id || ''),
    slug: String(article.slug || slug),
    title: String(article.title || ''),
    subtitle: (article.subtitle as string) || null,
    excerpt: (article.excerpt as string) || null,
    content: (article.content as string) || null,
    authorName: String(article.authorName || 'Staff'),
    authorBio: (article.authorBio as string) || null,
    articleType: (article.articleType as string) || null,
    primaryProject: (article.primaryProject as string) || null,
    relatedProjects: Array.isArray(article.relatedProjects)
      ? (article.relatedProjects as string[])
      : [],
    publishedAt: (article.publishedAt as string) || null,
    tags: Array.isArray(article.tags) ? (article.tags as string[]) : [],
    themes: Array.isArray(article.themes) ? (article.themes as string[]) : [],
    featuredImageUrl: (article.featuredImageUrl as string) || null,
    featuredImageAlt: (article.featuredImageAlt as string) || null,
    storyteller: mapArticleStoryteller(article.storyteller),
    media: mapArticleMedia(article.media),
    ctas: mapArticleCtas(article.ctas),
    visibility: (article.visibility as string) || null,
    metaTitle: (article.metaTitle as string) || null,
    metaDescription: (article.metaDescription as string) || null,
  };
}

export async function getServices(params?: {
  limit?: number;
  withQuotes?: boolean;
}): Promise<ApiResponse<SyndicatedService>> {
  const contentHub = await apiFetchContentHub('services', {
    limit: params?.limit,
    with_quotes: params?.withQuotes ?? true,
  });

  const services = Array.isArray(contentHub?.services)
    ? (contentHub?.services as Array<Record<string, unknown>>).map((service) =>
        mapSyndicatedService(service),
      )
    : [];

  return {
    data: services,
    pagination: {
      page: 1,
      limit: params?.limit || services.length || 20,
      total: Number(contentHub?.count || services.length),
      hasMore: false,
    },
  };
}

export async function getServiceDetail(
  slugOrId: string,
): Promise<SyndicatedService | null> {
  const contentHub = await apiFetchContentHub('services', {
    slug: slugOrId,
    with_quotes: true,
  });
  if (!contentHub || !contentHub.service) return null;

  return mapSyndicatedService(contentHub.service as Record<string, unknown>);
}

export async function getProjectAnalysis(
  projectSlug?: string,
): Promise<ProjectAnalysis | null> {
  const resolvedProjectSlug = (projectSlug || PROJECT_SLUG || '').trim();

  if (resolvedProjectSlug) {
    const analysis = await apiFetchContentHub('analysis', { project: resolvedProjectSlug });
    if (analysis && analysis.project) {
      return {
        project: {
          id: String((analysis.project as Record<string, unknown>).id || ''),
          name: String((analysis.project as Record<string, unknown>).name || ''),
          slug: String((analysis.project as Record<string, unknown>).slug || ''),
          description:
            ((analysis.project as Record<string, unknown>).description as string) ||
            null,
        },
        themes: Array.isArray(analysis.themes)
          ? (analysis.themes as Array<Record<string, unknown>>).map((theme) => ({
              name: String(theme.name || ''),
              count: Number(theme.count || 0),
              confidence:
                theme.confidence !== undefined ? Number(theme.confidence) : undefined,
            }))
          : [],
        quotes: Array.isArray(analysis.quotes)
          ? (analysis.quotes as Array<Record<string, unknown>>).map((quote) => ({
              text: String(quote.text || ''),
              context: (quote.context as string) || undefined,
              impactScore:
                quote.impactScore !== undefined
                  ? Number(quote.impactScore)
                  : quote.impact_score !== undefined
                    ? Number(quote.impact_score)
                    : undefined,
              storytellerId: (quote.storytellerId as string) || null,
            }))
          : [],
        storytellerCount: Number(analysis.storytellerCount || 0),
        transcriptCount: Number(analysis.transcriptCount || 0),
        qualityScore: Number(analysis.qualityScore || 0),
        analyzed: Boolean(analysis.analyzed),
        analyzedAt: (analysis.analyzedAt as string) || null,
      };
    }
  }

  const scopedTranscripts = await fetchTranscriptAnalysisSample(resolvedProjectSlug || undefined);
  const scopedSummary = buildTranscriptAnalysisSummary(
    scopedTranscripts,
    resolvedProjectSlug || undefined,
  );
  if (scopedSummary) return scopedSummary;

  if (resolvedProjectSlug) {
    const orgTranscripts = await fetchTranscriptAnalysisSample();
    return buildTranscriptAnalysisSummary(orgTranscripts);
  }

  return null;
}
