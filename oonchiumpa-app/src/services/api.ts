import axios from 'axios';
import { mockStories, mockOutcomes, mockPhotos, mockVideos } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface Story {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  author?: string;
  date?: string;
  category?: string;
  imageUrl?: string;
  videoUrl?: string;
  tags?: string[];
  culturalSignificance?: string;
}

export interface Outcome {
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
}

export interface Media {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  tags?: string[];
  date?: string;
}

// Stories API
export const storiesAPI = {
  getAll: async (): Promise<Story[]> => {
    if (USE_MOCK_DATA) {
      await delay(500); // Simulate network delay
      return mockStories;
    }
    try {
      const response = await api.get('/stories');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await delay(500);
      return mockStories;
    }
  },
  
  getById: async (id: string): Promise<Story> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const story = mockStories.find(s => s.id === id);
      if (!story) throw new Error('Story not found');
      return story;
    }
    try {
      const response = await api.get(`/stories/${id}`);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await delay(300);
      const story = mockStories.find(s => s.id === id);
      if (!story) throw new Error('Story not found');
      return story;
    }
  },
  
  getByCategory: async (category: string): Promise<Story[]> => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return mockStories.filter(s => s.category === category);
    }
    try {
      const response = await api.get(`/stories/category/${category}`);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await delay(400);
      return mockStories.filter(s => s.category === category);
    }
  },
  
  search: async (query: string): Promise<Story[]> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const searchTerm = query.toLowerCase();
      return mockStories.filter(s => 
        s.title.toLowerCase().includes(searchTerm) ||
        s.content.toLowerCase().includes(searchTerm) ||
        s.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    try {
      const response = await api.get('/stories/search', { params: { q: query } });
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await delay(300);
      const searchTerm = query.toLowerCase();
      return mockStories.filter(s => 
        s.title.toLowerCase().includes(searchTerm) ||
        s.content.toLowerCase().includes(searchTerm) ||
        s.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
  }
};

// Outcomes API
export const outcomesAPI = {
  getAll: async (): Promise<Outcome[]> => {
    if (USE_MOCK_DATA) {
      await delay(600);
      return mockOutcomes;
    }
    try {
      const response = await api.get('/outcomes');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await delay(600);
      return mockOutcomes;
    }
  },
  
  getById: async (id: string): Promise<Outcome> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const outcome = mockOutcomes.find(o => o.id === id);
      if (!outcome) throw new Error('Outcome not found');
      return outcome;
    }
    try {
      const response = await api.get(`/outcomes/${id}`);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await delay(300);
      const outcome = mockOutcomes.find(o => o.id === id);
      if (!outcome) throw new Error('Outcome not found');
      return outcome;
    }
  },
  
  getByCategory: async (category: string): Promise<Outcome[]> => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return mockOutcomes.filter(o => o.category === category);
    }
    try {
      const response = await api.get(`/outcomes/category/${category}`);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await delay(400);
      return mockOutcomes.filter(o => o.category === category);
    }
  }
};

// Media API
export const mediaAPI = {
  getGallery: async (): Promise<Media[]> => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return mockPhotos;
    }
    try {
      const response = await api.get('/media/gallery');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
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
      const response = await api.get('/media/videos');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await delay(500);
      return mockVideos;
    }
  },
  
  getByTags: async (tags: string[]): Promise<Media[]> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return [...mockPhotos, ...mockVideos].filter(media =>
        media.tags?.some(tag => tags.includes(tag))
      );
    }
    try {
      const response = await api.get('/media/tags', { params: { tags: tags.join(',') } });
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      await delay(300);
      return [...mockPhotos, ...mockVideos].filter(media =>
        media.tags?.some(tag => tags.includes(tag))
      );
    }
  }
};

export default api;