import { supabase, SUPABASE_PROJECT_ID } from "../config/supabase";

const PROJECT_ID = SUPABASE_PROJECT_ID || "";

const applyProjectFilter = <T>(
  query: T & { eq: (key: string, value: string) => T },
) => (PROJECT_ID ? query.eq("project_id", PROJECT_ID) : query);

const ensureProjectId = () => {
  if (!PROJECT_ID) {
    throw new Error(
      "Supabase project ID is not configured. Set VITE_SUPABASE_PROJECT_ID.",
    );
  }
  return PROJECT_ID;
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  type:
    | "community-story"
    | "cultural-insight"
    | "youth-work"
    | "historical-truth"
    | "transformation";
  readTime: number;
  heroImage?: string;
  gallery?: string[];
  curatedBy?: string;
  culturalReview?: string;
  status: "draft" | "published" | "archived";
  storyteller_id?: string;
  elder_approved: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogPostDraft = {
  title: string;
  excerpt: string;
  content: string;
  type: BlogPost["type"];
  tags: string[];
  heroImage?: string;
  gallery?: string[];
  storyteller_id?: string;
};

export class BlogService {
  private static instance: BlogService;

  static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  // Get all published blog posts
  async getBlogPosts(
    filters: {
      type?: BlogPost["type"];
      author?: string;
      storyteller_id?: string;
      tags?: string[];
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<{ posts: BlogPost[]; total: number }> {
    let query = supabase
      .from("blog_posts")
      .select("*, storytellers(full_name)", { count: "exact" })
      .eq("status", "published")
      .eq("elder_approved", true);

    query = applyProjectFilter(query);

    if (filters.type) {
      query = query.eq("type", filters.type);
    }
    if (filters.storyteller_id) {
      query = query.eq("storyteller_id", filters.storyteller_id);
    }
    if (filters.author) {
      query = query.ilike("author", `%${filters.author}%`);
    }
    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps("tags", filters.tags);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 50) - 1,
      );
    }

    query = query.order("published_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    const posts: BlogPost[] = (data || []).map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author || post.storytellers?.full_name || "Oonchiumpa Team",
      publishedAt: post.published_at || post.created_at,
      tags: post.tags || [],
      type: post.type,
      readTime: this.calculateReadTime(post.content),
      heroImage: post.hero_image,
      gallery: post.gallery || [],
      curatedBy: post.curated_by,
      culturalReview: post.cultural_review,
      status: post.status,
      storyteller_id: post.storyteller_id,
      elder_approved: post.elder_approved,
      created_at: post.created_at,
      updated_at: post.updated_at,
    }));

    return { posts, total: count || 0 };
  }

  // Get single blog post by ID
  async getBlogPost(id: string): Promise<BlogPost> {
    let query = supabase
      .from("blog_posts")
      .select("*, storytellers(full_name)")
      .eq("id", id);

    query = applyProjectFilter(query);

    const { data, error } = await query.single();

    if (error) throw error;
    if (!data) throw new Error("Blog post not found");

    return {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author || data.storytellers?.full_name || "Oonchiumpa Team",
      publishedAt: data.published_at || data.created_at,
      tags: data.tags || [],
      type: data.type,
      readTime: this.calculateReadTime(data.content),
      heroImage: data.hero_image,
      gallery: data.gallery || [],
      curatedBy: data.curated_by,
      culturalReview: data.cultural_review,
      status: data.status,
      storyteller_id: data.storyteller_id,
      elder_approved: data.elder_approved,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  // Create new blog post
  async createBlogPost(draft: BlogPostDraft): Promise<BlogPost> {
    const postData = {
      ...draft,
      project_id: ensureProjectId(),
      author: draft.storyteller_id ? null : "Oonchiumpa Editorial Team", // Will be overridden by storyteller name
      status: "draft",
      elder_approved: false,
      curated_by: "Oonchiumpa Editorial Team",
      cultural_review: "Pending Elder Review",
      hero_image: draft.heroImage,
      read_time: this.calculateReadTime(draft.content),
      published_at: null, // Will be set when published
    };

    const { data, error } = await supabase
      .from("blog_posts")
      .insert(postData)
      .select("*, storytellers(full_name)")
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author || data.storytellers?.full_name || "Oonchiumpa Team",
      publishedAt: data.published_at || data.created_at,
      tags: data.tags || [],
      type: data.type,
      readTime: this.calculateReadTime(data.content),
      heroImage: data.hero_image,
      gallery: data.gallery || [],
      curatedBy: data.curated_by,
      culturalReview: data.cultural_review,
      status: data.status,
      storyteller_id: data.storyteller_id,
      elder_approved: data.elder_approved,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  // Update blog post
  async updateBlogPost(
    id: string,
    updates: Partial<BlogPostDraft>,
  ): Promise<BlogPost> {
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (updates.heroImage !== undefined) {
      updateData.hero_image = updates.heroImage;
      delete updateData.heroImage;
    }

    if (updates.content) {
      updateData.read_time = this.calculateReadTime(updates.content);
    }

    let query = supabase
      .from("blog_posts")
      .update(updateData)
      .eq("id", id)
      .select("*, storytellers(full_name)");

    query = applyProjectFilter(query);

    const { data, error } = await query.single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author || data.storytellers?.full_name || "Oonchiumpa Team",
      publishedAt: data.published_at || data.created_at,
      tags: data.tags || [],
      type: data.type,
      readTime: this.calculateReadTime(data.content),
      heroImage: data.hero_image,
      gallery: data.gallery || [],
      curatedBy: data.curated_by,
      culturalReview: data.cultural_review,
      status: data.status,
      storyteller_id: data.storyteller_id,
      elder_approved: data.elder_approved,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  // Publish blog post (requires elder approval)
  async publishBlogPost(id: string, elderId?: string): Promise<BlogPost> {
    const updates: any = {
      status: "published",
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (elderId) {
      updates.elder_approved = true;
      updates.approved_by = elderId;
      updates.approved_at = new Date().toISOString();
      updates.cultural_review = "Elder Approved";
    }

    let query = supabase
      .from("blog_posts")
      .update(updates)
      .eq("id", id)
      .select("*, storytellers(full_name)");

    query = applyProjectFilter(query);

    const { data, error } = await query.single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author || data.storytellers?.full_name || "Oonchiumpa Team",
      publishedAt: data.published_at || data.created_at,
      tags: data.tags || [],
      type: data.type,
      readTime: this.calculateReadTime(data.content),
      heroImage: data.hero_image,
      gallery: data.gallery || [],
      curatedBy: data.curated_by,
      culturalReview: data.cultural_review,
      status: data.status,
      storyteller_id: data.storyteller_id,
      elder_approved: data.elder_approved,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  // Delete blog post
  async deleteBlogPost(id: string): Promise<void> {
    let query = supabase
      .from("blog_posts")
      .delete()
      .eq("id", id);

    query = applyProjectFilter(query);

    const { error } = await query;

    if (error) throw error;
  }

  // Get blog stats
  async getBlogStats(): Promise<{
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    pendingReview: number;
    byType: Record<BlogPost["type"], number>;
    weeklyViews: number;
    culturalStories: number;
  }> {
    let query = supabase
      .from("blog_posts")
      .select("status, type, elder_approved, created_at");

    query = applyProjectFilter(query);

    const { data, error } = await query;

    if (error) throw error;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const stats = {
      totalPosts: data.length,
      publishedPosts: data.filter((p) => p.status === "published").length,
      draftPosts: data.filter((p) => p.status === "draft").length,
      pendingReview: data.filter(
        (p) => !p.elder_approved && p.status === "draft",
      ).length,
      byType: {} as Record<BlogPost["type"], number>,
      weeklyViews: 0, // TODO: Implement view tracking
      culturalStories: data.filter((p) => p.type === "cultural-insight").length,
    };

    data.forEach((post) => {
      stats.byType[post.type] = (stats.byType[post.type] || 0) + 1;
    });

    return stats;
  }

  // Generate content from stories (community blog creation)
  async generateBlogFromStory(
    storyId: string,
    type: BlogPost["type"],
  ): Promise<BlogPostDraft> {
    // Get the story content from Supabase
    const { data: story, error } = await supabase
      .from("stories")
      .select("*, storytellers(full_name)")
      .eq("id", storyId)
      .single();

    if (error) throw error;
    if (!story) throw new Error("Story not found");

    // Generate blog post based on story content
    // This creates blog content from community stories
    const blogDraft: BlogPostDraft = {
      title: `${story.storytellers?.full_name || "Community"} Story: ${story.title}`,
      excerpt:
        story.content?.substring(0, 200) + "..." ||
        "A powerful community story.",
      content: this.formatStoryAsBlogPost(story),
      type,
      tags: [...(story.tags || []), "Community Stories", "Real Experiences"],
      storyteller_id: story.storyteller_id,
    };

    return blogDraft;
  }

  // Helper: Calculate reading time
  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  // Helper: Format story content as blog post
  private formatStoryAsBlogPost(story: any): string {
    const storytellerName =
      story.storytellers?.full_name || "A Community Member";

    return `
*This blog post is curated from authentic community conversations and storytelling sessions.*

## About ${storytellerName}

${storytellerName} shares their experience and perspective as part of the Oonchiumpa community.

## Their Story

${story.content}

---

*This story has been shared with permission and has undergone cultural review to ensure respectful representation of community experiences.*

**Story Category**: ${story.story_category}
**Cultural Significance**: ${story.privacy_level}
${story.tags && story.tags.length > 0 ? `**Related Topics**: ${story.tags.join(", ")}` : ""}

---

*Oonchiumpa amplifies authentic Aboriginal voices while respecting cultural protocols and community sovereignty.*
    `.trim();
  }

  // Search blog posts
  async searchBlogPosts(
    query: string,
    filters?: {
      type?: BlogPost["type"];
      tags?: string[];
    },
  ): Promise<BlogPost[]> {
    let searchQuery = supabase
      .from("blog_posts")
      .select("*, storytellers(full_name)")
      .eq("status", "published")
      .eq("elder_approved", true)
      .or(
        `title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`,
      );

    searchQuery = applyProjectFilter(searchQuery);

    if (filters?.type) {
      searchQuery = searchQuery.eq("type", filters.type);
    }
    if (filters?.tags && filters.tags.length > 0) {
      searchQuery = searchQuery.overlaps("tags", filters.tags);
    }

    searchQuery = searchQuery
      .order("published_at", { ascending: false })
      .limit(20);

    const { data, error } = await searchQuery;

    if (error) throw error;

    return (data || []).map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author || post.storytellers?.full_name || "Oonchiumpa Team",
      publishedAt: post.published_at || post.created_at,
      tags: post.tags || [],
      type: post.type,
      readTime: this.calculateReadTime(post.content),
      heroImage: post.hero_image,
      gallery: post.gallery || [],
      curatedBy: post.curated_by,
      culturalReview: post.cultural_review,
      status: post.status,
      storyteller_id: post.storyteller_id,
      elder_approved: post.elder_approved,
      created_at: post.created_at,
      updated_at: post.updated_at,
    }));
  }
}

export const blogService = BlogService.getInstance();
