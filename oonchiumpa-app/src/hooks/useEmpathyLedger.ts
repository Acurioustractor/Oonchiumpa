/**
 * React hooks for Empathy Ledger v2 API
 *
 * Fetches storytellers, stories, media, and transcripts
 * scoped to the Oonchiumpa organisation via org API key.
 */

import { useState, useEffect } from 'react';
import * as el from '../services/empathyLedgerClient';

export function useOrgPeople(types: el.MembershipType[]) {
  const [people, setPeople] = useState<el.OrgPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const typesKey = types.join(',');

  useEffect(() => {
    const parsed = typesKey ? (typesKey.split(',') as el.MembershipType[]) : [];
    if (parsed.length === 0) {
      setPeople([]);
      setLoading(false);
      return;
    }
    el.getOrgPeople(parsed)
      .then(setPeople)
      .catch((err) => {
        setError(err as Error);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [typesKey]);

  return { people, loading, error };
}

export function useStorytellers(limit = 20) {
  const [storytellers, setStorytellers] = useState<el.Storyteller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    el.getStorytellers({ limit })
      .then((r) => setStorytellers(r.data))
      .catch((err) => {
        setError(err as Error);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [limit]);

  return { storytellers, loading, error };
}

export function useStories(limit = 10) {
  const [stories, setStories] = useState<el.Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    el.getStories({ limit })
      .then((r) => setStories(r.data))
      .catch((err) => {
        setError(err as Error);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [limit]);

  return { stories, loading, error };
}

export function useStoryDetail(id: string | null) {
  const [story, setStory] = useState<el.StoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    el.getStoryDetail(id)
      .then(setStory)
      .catch((err) => {
        setError(err as Error);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { story, loading, error };
}

export function useMedia(params?: { limit?: number; galleryId?: string; type?: string }) {
  const [media, setMedia] = useState<el.MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mediaParamsKey = JSON.stringify({
    limit: params?.limit,
    galleryId: params?.galleryId,
    type: params?.type,
  });

  useEffect(() => {
    const parsedParams = JSON.parse(mediaParamsKey) as {
      limit?: number;
      galleryId?: string;
      type?: string;
    };
    el.getMedia(parsedParams)
      .then((r) => setMedia(r.data))
      .catch((err) => {
        setError(err as Error);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [mediaParamsKey]);

  return { media, loading, error };
}

export function useGalleries(limit = 20) {
  const [galleries, setGalleries] = useState<el.Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    el.getGalleries({ limit })
      .then((r) => setGalleries(r.data))
      .catch((err) => {
        setError(err as Error);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [limit]);

  return { galleries, loading, error };
}

export function useTranscripts(params?: {
  limit?: number;
  storytellerId?: string;
  includeAnalysis?: boolean;
  project?: string;
  search?: string;
}) {
  const [transcripts, setTranscripts] = useState<el.Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const transcriptParamsKey = JSON.stringify({
    limit: params?.limit,
    storytellerId: params?.storytellerId,
    includeAnalysis: params?.includeAnalysis,
    project: params?.project,
    search: params?.search,
  });

  useEffect(() => {
    const parsedParams = JSON.parse(transcriptParamsKey) as {
      limit?: number;
      storytellerId?: string;
      includeAnalysis?: boolean;
      project?: string;
      search?: string;
    };
    el.getTranscripts(parsedParams)
      .then((r) => setTranscripts(r.data))
      .catch((err) => {
        setError(err as Error);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [transcriptParamsKey]);

  return { transcripts, loading, error };
}

export function useArticles(limit = 12) {
  const [articles, setArticles] = useState<el.Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // EL's list endpoint can return stale storyteller / featured-image data
        // even after admin edits. Fetch each article's detail and overlay the
        // fresh fields so cards always match the article page.
        const r = await el.getArticles({ limit });
        if (cancelled) return;
        setArticles(r.data);

        const details = await Promise.all(
          r.data.map((a) =>
            el
              .getArticleDetail(a.slug || a.id)
              .catch(() => null),
          ),
        );
        if (cancelled) return;

        setArticles(
          r.data.map((a, i) => {
            const d = details[i];
            if (!d) return a;
            return {
              ...a,
              title: d.title || a.title,
              authorName: d.authorName || a.authorName,
              featuredImageUrl: d.featuredImageUrl ?? a.featuredImageUrl,
              featuredImageAlt: d.featuredImageAlt ?? a.featuredImageAlt,
              storyteller: d.storyteller ?? a.storyteller,
              media: d.media ?? a.media,
            };
          }),
        );
      } catch (err) {
        if (cancelled) return;
        setError(err as Error);
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { articles, loading, error };
}

export function useArticleDetail(slug: string | null) {
  const [article, setArticle] = useState<el.ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    el.getArticleDetail(slug)
      .then(setArticle)
      .catch((err) => {
        setError(err as Error);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return { article, loading, error };
}

export function useProjectAnalysis(projectSlug?: string) {
  const [analysis, setAnalysis] = useState<el.ProjectAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    el.getProjectAnalysis(projectSlug)
      .then(setAnalysis)
      .catch((err) => {
        setError(err as Error);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [projectSlug]);

  return { analysis, loading, error };
}

export function useSyndicatedServices(limit = 12, withQuotes = true) {
  const [services, setServices] = useState<el.SyndicatedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    el.getServices({ limit, withQuotes })
      .then((r) => setServices(r.data))
      .catch((err) => {
        setError(err as Error);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [limit, withQuotes]);

  return { services, loading, error };
}

export function useSyndicatedService(slugOrId: string | null) {
  const [service, setService] = useState<el.SyndicatedService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slugOrId) {
      setLoading(false);
      return;
    }

    el.getServiceDetail(slugOrId)
      .then(setService)
      .catch((err) => {
        setError(err as Error);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [slugOrId]);

  return { service, loading, error };
}
