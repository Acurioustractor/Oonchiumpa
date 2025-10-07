/**
 * React hooks for Oonchiumpa content
 * Easy-to-use hooks for components to fetch stories, quotes, and profiles
 */

import { useState, useEffect } from 'react';
import { oonchiumpaData, contentHelpers, OonchiumpaStory, OonchiumpaProfile, OonchiumpaTranscript } from '../services/oonchiumpaData';

/**
 * Get featured stories for homepage
 */
export function useFeaturedStories(limit = 3) {
  const [stories, setStories] = useState<OonchiumpaStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    oonchiumpaData.getFeaturedStories(limit)
      .then(setStories)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [limit]);

  return { stories, loading, error };
}

/**
 * Get all public stories
 */
export function usePublicStories(limit?: number) {
  const [stories, setStories] = useState<OonchiumpaStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    oonchiumpaData.getPublicStories(limit)
      .then(setStories)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [limit]);

  return { stories, loading, error };
}

/**
 * Get storytellers
 */
export function useStorytellers() {
  const [storytellers, setStorytellers] = useState<OonchiumpaProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    oonchiumpaData.getStorytellers()
      .then(setStorytellers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { storytellers, loading, error };
}

/**
 * Get quotes by theme/impact area
 */
export function useQuotesByImpactArea(impactArea: string) {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    contentHelpers.getQuotesForImpactArea(impactArea)
      .then(setQuotes)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [impactArea]);

  return { quotes, loading, error };
}

/**
 * Get AI insights from transcripts
 */
export function useAIInsights(limit = 20) {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    oonchiumpaData.getAIInsights(limit)
      .then(setInsights)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [limit]);

  return { insights, loading, error };
}

/**
 * Get content aligned with Oonchiumpa philosophy
 */
export function usePhilosophyContent() {
  const [content, setContent] = useState<OonchiumpaStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    contentHelpers.getPhilosophyAlignedContent()
      .then(setContent)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { content, loading, error };
}

/**
 * Search stories by theme
 */
export function useStoriesByTheme(theme: string) {
  const [stories, setStories] = useState<OonchiumpaStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!theme) {
      setStories([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    oonchiumpaData.searchStoriesByTheme(theme)
      .then(setStories)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [theme]);

  return { stories, loading, error };
}

/**
 * Get storyteller with their content
 */
export function useStorytellerContent(storytellerId: string) {
  const [data, setData] = useState<{
    profile: OonchiumpaProfile | null;
    stories: any[];
    transcripts: any[];
  }>({
    profile: null,
    stories: [],
    transcripts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!storytellerId) {
      setLoading(false);
      return;
    }

    oonchiumpaData.getStorytellerWithContent(storytellerId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [storytellerId]);

  return { ...data, loading, error };
}

/**
 * Get diverse storytellers for showcase
 */
export function useDiverseStorytellers(limit = 6) {
  const [storytellers, setStorytellers] = useState<OonchiumpaProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    contentHelpers.getDiverseStorytellers(limit)
      .then(setStorytellers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [limit]);

  return { storytellers, loading, error };
}
