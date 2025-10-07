import axios from "axios";
import { mockStories, mockOutcomes, mockPhotos, mockVideos } from "./mockData";
import {
  supabaseStoriesAPI,
  supabaseOutcomesAPI,
  supabaseMediaAPI,
  supabaseDashboardAPI,
} from "./supabaseAPI";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true"; // Changed: now defaults to false (use real data)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type Story = {
  id: string;
  title: string;
  subtitle?: string;
  summary?: string;
  content: string;
  author?: string;
  date?: string;
  category?: string;
  story_type?: string;
  themes?: string[];
  cultural_themes?: string[];
  imageUrl?: string;
  media_urls?: string[];
  videoUrl?: string;
  tags?: string[];
  culturalSignificance?: string;
  media_metadata?: {
    source_document?: string;
    impact_highlights?: string[];
    participants?: string[];
    location?: string;
    date_period?: string;
    image_count?: number;
    has_images?: boolean;
  };
};

export type Outcome = {
  id: string;
  title: string;
  description: string;
  impact: string;
  metrics?: {
    label: string;
    value: string | number;
  }[];
  date?: string;
  location?: string;
  beneficiaries?: number;
  imageUrl?: string;
  category?: string;
};

export type Media = {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  tags?: string[];
  date?: string;
};

export type DashboardMetric = {
  id: string;
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  description?: string;
  category?: string;
  lastUpdated?: string;
};

export type DashboardData = {
  keyMetrics: DashboardMetric[];
  recentOutcomes: Array<{
    title: string;
    impact: string;
    description: string;
    status: "active" | "emerging" | "future";
    horizon: number;
    date?: string;
  }>;
  summary: {
    totalClients: number;
    totalContacts: number;
    costEffectiveness: number;
    engagementRate: number;
  };
};

// Stories API - Now using Supabase with mock fallback
export const storiesAPI = {
  getAll: async (): Promise<Story[]> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return mockStories;
    }
    try {
      return await supabaseStoriesAPI.getAll();
    } catch (error) {
      console.warn("Supabase unavailable, using mock data");
      await delay(500);
      return mockStories;
    }
  },

  getById: async (id: string): Promise<Story> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const story = mockStories.find((s) => s.id === id);
      if (!story) throw new Error("Story not found");
      return story;
    }
    try {
      return await supabaseStoriesAPI.getById(id);
    } catch (error) {
      console.warn("Supabase unavailable, using mock data");
      await delay(300);
      const story = mockStories.find((s) => s.id === id);
      if (!story) throw new Error("Story not found");
      return story;
    }
  },

  getByCategory: async (category: string): Promise<Story[]> => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return mockStories.filter((s) => s.category === category);
    }
    try {
      return await supabaseStoriesAPI.getByCategory(category);
    } catch (error) {
      console.warn("Supabase unavailable, using mock data");
      await delay(400);
      return mockStories.filter((s) => s.category === category);
    }
  },

  search: async (query: string): Promise<Story[]> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const searchTerm = query.toLowerCase();
      return mockStories.filter(
        (s) =>
          s.title.toLowerCase().includes(searchTerm) ||
          s.content.toLowerCase().includes(searchTerm) ||
          s.tags?.some((tag) => tag.toLowerCase().includes(searchTerm)),
      );
    }
    try {
      return await supabaseStoriesAPI.search(query);
    } catch (error) {
      console.warn("Supabase unavailable, using mock data");
      await delay(300);
      const searchTerm = query.toLowerCase();
      return mockStories.filter(
        (s) =>
          s.title.toLowerCase().includes(searchTerm) ||
          s.content.toLowerCase().includes(searchTerm) ||
          s.tags?.some((tag) => tag.toLowerCase().includes(searchTerm)),
      );
    }
  },
};

// Outcomes API - Using Supabase with mock fallback
export const outcomesAPI = {
  getAll: async (): Promise<Outcome[]> => {
    if (USE_MOCK_DATA) {
      await delay(600);
      return mockOutcomes;
    }
    try {
      return await supabaseOutcomesAPI.getAll();
    } catch (error) {
      console.warn("Outcomes not yet implemented in Supabase, using mock data");
      await delay(600);
      return mockOutcomes;
    }
  },

  getById: async (id: string): Promise<Outcome> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const outcome = mockOutcomes.find((o) => o.id === id);
      if (!outcome) throw new Error("Outcome not found");
      return outcome;
    }
    try {
      return await supabaseOutcomesAPI.getById(id);
    } catch (error) {
      console.warn("Outcomes not yet implemented in Supabase, using mock data");
      await delay(300);
      const outcome = mockOutcomes.find((o) => o.id === id);
      if (!outcome) throw new Error("Outcome not found");
      return outcome;
    }
  },

  getByCategory: async (category: string): Promise<Outcome[]> => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return mockOutcomes.filter((o) => o.category === category);
    }
    try {
      return await supabaseOutcomesAPI.getByCategory(category);
    } catch (error) {
      console.warn("Outcomes not yet implemented in Supabase, using mock data");
      await delay(400);
      return mockOutcomes.filter((o) => o.category === category);
    }
  },
};

// Media API - Using Supabase with mock fallback
export const mediaAPI = {
  getGallery: async (): Promise<Media[]> => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return mockPhotos;
    }
    try {
      return await supabaseMediaAPI.getGallery();
    } catch (error) {
      console.warn("Media not yet implemented in Supabase, using mock data");
      await delay(400);
      return mockPhotos;
    }
  },

  getVideos: async (): Promise<Media[]> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return mockVideos;
    }
    try {
      return await supabaseMediaAPI.getVideos();
    } catch (error) {
      console.warn("Media not yet implemented in Supabase, using mock data");
      await delay(500);
      return mockVideos;
    }
  },

  getByTags: async (tags: string[]): Promise<Media[]> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return [...mockPhotos, ...mockVideos].filter((media) =>
        media.tags?.some((tag) => tags.includes(tag)),
      );
    }
    try {
      return await supabaseMediaAPI.getByTags(tags);
    } catch (error) {
      console.warn("Media not yet implemented in Supabase, using mock data");
      await delay(300);
      return [...mockPhotos, ...mockVideos].filter((media) =>
        media.tags?.some((tag) => tags.includes(tag)),
      );
    }
  },
};

// Mock dashboard data
const mockDashboardData: DashboardData = {
  keyMetrics: [
    {
      id: "1",
      title: "Active Clients",
      value: 30,
      change: "+57%",
      changeType: "positive",
      description: "Increased from 19 clients in Dec 2023",
      category: "clients",
    },
    {
      id: "2",
      title: "Meaningful Contacts",
      value: 2464,
      change: "+23%",
      changeType: "positive",
      description: "Individual engagements in 6 months",
      category: "engagement",
    },
    {
      id: "3",
      title: "Cost Effectiveness",
      value: 97.6,
      suffix: "%",
      change: "vs incarceration",
      changeType: "positive",
      description: "$91/day vs $3,852/day incarceration",
      category: "financial",
    },
    {
      id: "4",
      title: "Engagement Rate",
      value: 91,
      suffix: "%",
      change: "87-95% range",
      changeType: "positive",
      description: "Exceptional retention with cultural support",
      category: "engagement",
    },
  ],
  recentOutcomes: [
    {
      title: "School Re-engagement Program",
      impact: "72% success rate",
      description: "Young people returning to education",
      status: "active",
      horizon: 1,
      date: "2024-08-01",
    },
    {
      title: "Operation Luna Reduction",
      impact: "95% reduction",
      description: "Dramatic decrease in police interactions",
      status: "active",
      horizon: 1,
      date: "2024-07-15",
    },
    {
      title: "Digital Content Platform",
      impact: "Launch phase",
      description: "Community storytelling platform",
      status: "emerging",
      horizon: 2,
      date: "2024-08-20",
    },
    {
      title: "Cultural Campus Vision",
      impact: "Planning phase",
      description: "Integrated community hub development",
      status: "future",
      horizon: 3,
      date: "2024-12-01",
    },
  ],
  summary: {
    totalClients: 30,
    totalContacts: 2464,
    costEffectiveness: 97.6,
    engagementRate: 91,
  },
};

// Dashboard API - Using Supabase with mock fallback
export const dashboardAPI = {
  getMetrics: async (): Promise<DashboardData> => {
    if (USE_MOCK_DATA) {
      await delay(800);
      return mockDashboardData;
    }
    try {
      return await supabaseDashboardAPI.getMetrics();
    } catch (error) {
      console.warn("Supabase unavailable, using mock dashboard data");
      await delay(800);
      return mockDashboardData;
    }
  },

  getMetricsByCategory: async (
    category: string,
  ): Promise<DashboardMetric[]> => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return mockDashboardData.keyMetrics.filter(
        (m) => m.category === category,
      );
    }
    try {
      return await supabaseDashboardAPI.getMetricsByCategory(category);
    } catch (error) {
      console.warn("Supabase unavailable, using mock data");
      await delay(400);
      return mockDashboardData.keyMetrics.filter(
        (m) => m.category === category,
      );
    }
  },

  getSummary: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockDashboardData.summary;
    }
    try {
      return await supabaseDashboardAPI.getSummary();
    } catch (error) {
      console.warn("Supabase unavailable, using mock data");
      await delay(300);
      return mockDashboardData.summary;
    }
  },
};

export default api;
