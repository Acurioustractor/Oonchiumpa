/**
 * Oonchiumpa Data Service
 *
 * Query transcripts, stories, profiles, and AI analysis
 * for CORE TEAM ONLY: Kristy Bloomfield, Tanya Turner, Aunty Bev & Uncle Terry,
 * Law Students (Adelaide, Aidan, Chelsea, Suzie), and Patricia Ann Miller
 */

import { supabase } from '../config/supabase';

// Oonchiumpa tenant ID (core team)
const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

// Core team member IDs
export const CORE_TEAM_IDS = {
  // Primary Leadership
  kristy_bloomfield: 'b59a1f4c-94fd-4805-a2c5-cac0922133e0',
  tanya_turner: 'dc85700d-f139-46fa-9074-6afee55ea801',

  // Connected Elders
  aunty_bev_terry: 'f8e99ed8-723a-48bc-a346-40f4f7a4032e',

  // Law Student Partners
  adelaide_hayes: 'faa011c7-0343-409a-8e56-c35c9d83b58d',
  aidan_harris: 'e948d0a2-2d77-429d-a538-7d03ace499ad',
  chelsea_kenneally: '28d3d9ea-3e0c-4642-b6d8-a6ebc22cac23',
  suzie_ma: 'a16991fb-11eb-4ac9-89df-c7994a2b9617',

  // Community Voice
  patricia_miller: '1971d21d-5037-4f7b-90ce-966a4e74d398',
};

// Team categories
export const LEADERSHIP_IDS = [
  CORE_TEAM_IDS.kristy_bloomfield,
  CORE_TEAM_IDS.tanya_turner,
];

export const ELDER_IDS = [
  CORE_TEAM_IDS.aunty_bev_terry,
];

export const LAW_STUDENT_IDS = [
  CORE_TEAM_IDS.adelaide_hayes,
  CORE_TEAM_IDS.aidan_harris,
  CORE_TEAM_IDS.chelsea_kenneally,
  CORE_TEAM_IDS.suzie_ma,
];

export const ALL_CORE_TEAM_IDS = Object.values(CORE_TEAM_IDS);

// TypeScript interfaces matching actual Supabase schema
export interface OonchiumpaProfile {
  id: string;
  full_name: string;
  display_name: string;
  email?: string;
  bio?: string;
  profile_image_url?: string;
  cultural_background?: string;
  tenant_roles: string[];
  is_storyteller: boolean;
  is_elder: boolean;
  geographic_connections?: string[];
  story_visibility_level?: string;
}

export interface OonchiumpaStory {
  id: string;
  title: string;
  content: string;
  summary?: string;
  author_id: string;
  organization_id?: string;
  themes: string[];
  cultural_themes?: string[];
  story_type: string;
  privacy_level: string;
  is_public: boolean;
  is_featured: boolean;
  cultural_sensitivity_level: string;
  created_at: string;
  author?: OonchiumpaProfile;
}

export interface OonchiumpaTranscript {
  id: string;
  storyteller_id: string;
  title?: string;
  transcript_content: string;
  ai_summary?: string;
  themes?: string[];
  key_quotes?: string[];
  recording_date: string;
  word_count: number;
  cultural_sensitivity: string;
  privacy_level: string;
  ai_processing_status: string;
  metadata?: {
    ai_analysis?: {
      key_insights?: string[];
      emotional_tone?: string;
      related_topics?: string[];
    };
  };
  storyteller?: OonchiumpaProfile;
}

/**
 * Core query functions for Oonchiumpa content
 */
export const oonchiumpaData = {

  /**
   * Get all core team members
   */
  async getStorytellers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('id', ALL_CORE_TEAM_IDS)
      .order('full_name');

    if (error) throw error;
    return data as OonchiumpaProfile[];
  },

  /**
   * Get core leadership (Kristy + Tanya)
   */
  async getCoreLeadership() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('id', LEADERSHIP_IDS)
      .order('full_name');

    if (error) throw error;
    return data as OonchiumpaProfile[];
  },

  /**
   * Get connected elders (Aunty Bev & Uncle Terry)
   */
  async getElders() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('id', ELDER_IDS);

    if (error) throw error;
    return data as OonchiumpaProfile[];
  },

  /**
   * Get law student partners
   */
  async getLawStudents() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('id', LAW_STUDENT_IDS)
      .order('full_name');

    if (error) throw error;
    return data as OonchiumpaProfile[];
  },

  /**
   * Get published stories (core team only)
   */
  async getPublicStories(limit?: number) {
    let query = supabase
      .from('stories')
      .select(`
        *,
        author:profiles!author_id(
          full_name,
          display_name,
          profile_image_url,
          cultural_background
        )
      `)
      .in('author_id', ALL_CORE_TEAM_IDS)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as OonchiumpaStory[];
  },

  /**
   * Get featured stories for homepage (leadership first)
   */
  async getFeaturedStories(limit = 3) {
    // First try to get stories from leadership
    const { data: leadershipData, error: leadershipError } = await supabase
      .from('stories')
      .select(`
        *,
        author:profiles!author_id(
          full_name,
          display_name,
          profile_image_url
        )
      `)
      .in('author_id', LEADERSHIP_IDS)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (leadershipError) throw leadershipError;

    // If we need more stories, get from all core team
    if ((leadershipData?.length || 0) < limit) {
      const { data: allData, error: allError } = await supabase
        .from('stories')
        .select(`
          *,
          author:profiles!author_id(
            full_name,
            display_name,
            profile_image_url
          )
        `)
        .in('author_id', ALL_CORE_TEAM_IDS)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (allError) throw allError;
      return allData as OonchiumpaStory[];
    }

    return leadershipData as OonchiumpaStory[];
  },

  /**
   * Get transcripts with AI analysis (core team only)
   */
  async getTranscripts(options?: {
    withConsent?: boolean;
    processed?: boolean;
    limit?: number;
  }) {
    let query = supabase
      .from('transcripts')
      .select(`
        *,
        storyteller:profiles!storyteller_id(
          full_name,
          display_name,
          profile_image_url
        )
      `)
      .in('storyteller_id', ALL_CORE_TEAM_IDS)
      .order('recording_date', { ascending: false });

    if (options?.withConsent) {
      query = query.eq('ai_processing_consent', true);
    }

    if (options?.processed) {
      query = query.eq('ai_processing_status', 'completed');
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as OonchiumpaTranscript[];
  },

  /**
   * Search stories by theme (core team only)
   */
  async searchStoriesByTheme(theme: string) {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        author:profiles!author_id(full_name, display_name, profile_image_url)
      `)
      .in('author_id', ALL_CORE_TEAM_IDS)
      .eq('is_public', true)
      .contains('themes', [theme])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as OonchiumpaStory[];
  },

  /**
   * Search transcripts by theme (core team only)
   */
  async searchTranscriptsByTheme(theme: string) {
    const { data, error } = await supabase
      .from('transcripts')
      .select(`
        *,
        storyteller:profiles!storyteller_id(full_name, display_name)
      `)
      .in('storyteller_id', ALL_CORE_TEAM_IDS)
      .eq('ai_processing_status', 'completed')
      .contains('themes', [theme]);

    if (error) throw error;
    return data as OonchiumpaTranscript[];
  },

  /**
   * Get key quotes from transcripts (core team only)
   */
  async getQuotes(options?: {
    theme?: string;
    culturalSensitivity?: 'standard' | 'sensitive' | 'sacred';
    limit?: number;
    fromLeadership?: boolean;  // Prioritize Kristy + Tanya quotes
  }) {
    const storytellerIds = options?.fromLeadership ? LEADERSHIP_IDS : ALL_CORE_TEAM_IDS;

    let query = supabase
      .from('transcripts')
      .select(`
        id,
        title,
        key_quotes,
        themes,
        cultural_sensitivity,
        storyteller:profiles!storyteller_id(full_name, display_name)
      `)
      .in('storyteller_id', storytellerIds)
      .eq('ai_processing_status', 'completed')
      .not('key_quotes', 'is', null);

    if (options?.theme) {
      query = query.contains('themes', [options.theme]);
    }

    if (options?.culturalSensitivity) {
      query = query.eq('cultural_sensitivity', options.culturalSensitivity);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Flatten quotes with context
    const quotes = data?.flatMap(transcript =>
      (transcript.key_quotes || []).map(quote => ({
        quote,
        storyteller: transcript.storyteller,
        themes: transcript.themes,
        transcriptId: transcript.id,
        transcriptTitle: transcript.title
      }))
    ) || [];

    return quotes;
  },

  /**
   * Get AI insights from transcripts (core team only)
   */
  async getAIInsights(limit = 20) {
    const { data, error } = await supabase
      .from('transcripts')
      .select(`
        id,
        title,
        themes,
        ai_summary,
        metadata,
        cultural_sensitivity,
        storyteller:profiles!storyteller_id(full_name)
      `)
      .in('storyteller_id', ALL_CORE_TEAM_IDS)
      .eq('ai_processing_status', 'completed')
      .not('metadata', 'is', null)
      .limit(limit);

    if (error) throw error;

    return data?.map(item => ({
      id: item.id,
      title: item.title,
      storyteller: item.storyteller?.full_name,
      themes: item.themes || [],
      summary: item.ai_summary,
      insights: item.metadata?.ai_analysis?.key_insights || [],
      emotionalTone: item.metadata?.ai_analysis?.emotional_tone,
      relatedTopics: item.metadata?.ai_analysis?.related_topics || []
    })) || [];
  },

  /**
   * Get content by cultural theme (core team only)
   */
  async getContentByCulturalTheme(culturalTheme: string) {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        author:profiles!author_id(
          full_name,
          display_name,
          profile_image_url,
          cultural_background
        )
      `)
      .in('author_id', ALL_CORE_TEAM_IDS)
      .eq('is_public', true)
      .contains('cultural_themes', [culturalTheme])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as OonchiumpaStory[];
  },

  /**
   * Get storyteller profile with their content (core team only)
   */
  async getStorytellerWithContent(storytellerId: string) {
    // Verify this is a core team member
    if (!ALL_CORE_TEAM_IDS.includes(storytellerId)) {
      throw new Error('Storyteller not in core team');
    }

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', storytellerId)
      .single();

    if (profileError) throw profileError;

    // Get their stories
    const { data: stories } = await supabase
      .from('stories')
      .select('*')
      .eq('author_id', storytellerId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    // Get their transcripts
    const { data: transcripts } = await supabase
      .from('transcripts')
      .select('id, title, themes, ai_summary, recording_date, key_quotes')
      .eq('storyteller_id', storytellerId)
      .eq('ai_processing_status', 'completed')
      .order('recording_date', { ascending: false });

    return {
      profile: profile as OonchiumpaProfile,
      stories: stories || [],
      transcripts: transcripts || []
    };
  }
};

/**
 * Helper functions for content presentation
 */
export const contentHelpers = {

  /**
   * Extract relevant quotes for a specific philosophy/impact area
   */
  async getQuotesForImpactArea(impactArea: string, options?: { fromLeadership?: boolean }) {
    // Map impact areas to themes from core team transcripts
    const themeMap: Record<string, string[]> = {
      'community_empowerment': ['community_empowerment', 'community_development', 'advocacy'],
      'cultural_identity': ['Cultural Identity', 'cultural_identity', 'cultural_protocol', 'Cultural Connection to Land'],
      'indigenous_justice': ['Indigenous justice', 'Legal practice', 'self-determination'],
      'intergenerational_wisdom': ['Intergenerational Knowledge', 'intergenerational_connection', 'Intergenerational Wisdom', 'knowledge_transmission'],
      'community_resilience': ['Community Resilience', 'community_resilience', 'relationship_building'],
      'youth_empowerment': ['Youth empowerment', 'education', 'Education and Advocacy'],
    };

    const themes = themeMap[impactArea] || [impactArea];

    // Search across themes
    const quoteSets = await Promise.all(
      themes.map(theme => oonchiumpaData.getQuotes({
        theme,
        limit: 5,
        fromLeadership: options?.fromLeadership
      }))
    );

    // Flatten and deduplicate
    const allQuotes = quoteSets.flat();
    const uniqueQuotes = Array.from(
      new Map(allQuotes.map(q => [q.quote, q])).values()
    );

    return uniqueQuotes.slice(0, 10);
  },

  /**
   * Get stories that align with Oonchiumpa philosophy
   */
  async getPhilosophyAlignedContent() {
    const philosophyThemes = [
      'Community Resilience',
      'Cultural Identity',
      'Intergenerational Knowledge',
      'community_empowerment',
      'Indigenous justice',
      'relationship_building',
      'cultural_protocol'
    ];

    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        author:profiles!author_id(full_name, display_name, profile_image_url)
      `)
      .in('author_id', ALL_CORE_TEAM_IDS)
      .eq('is_public', true)
      .or(philosophyThemes.map(t => `themes.cs.{${t}}`).join(','))
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data as OonchiumpaStory[];
  },

  /**
   * Get core team for showcase
   */
  async getCoreTeamShowcase() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('id', ALL_CORE_TEAM_IDS)
      .not('profile_image_url', 'is', null)
      .order('full_name');

    if (error) throw error;
    return data as OonchiumpaProfile[];
  },

  /**
   * Format quote with attribution
   */
  formatQuote(quote: {
    quote: string;
    storyteller?: { full_name?: string; display_name?: string };
  }) {
    const attribution = quote.storyteller?.display_name ||
                       quote.storyteller?.full_name ||
                       'Community Member';

    return {
      text: quote.quote,
      attribution,
      formatted: `"${quote.quote}"\n— ${attribution}`
    };
  },

  /**
   * Get story excerpt for preview
   */
  getStoryExcerpt(story: OonchiumpaStory, maxLength = 200) {
    const text = story.summary || story.content;
    if (text.length <= maxLength) return text;

    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substring(0, lastSpace) + '...';
  }
};

export default oonchiumpaData;
