import { supabase, SUPABASE_PROJECT_ID } from "../config/supabase";

const PROJECT_ID = SUPABASE_PROJECT_ID || "";

export type UserRole =
  | "admin"
  | "editor"
  | "contributor"
  | "elder"
  | "storyteller";

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  project_id: string;
  avatar_url?: string;
  permissions: string[];
  created_at: string;
  last_login: string;
  is_active: boolean;
  cultural_authority: boolean; // For Elders and Traditional Owners
  can_approve_content: boolean;
};

export type AuthResponse = {
  user: User | null;
  session: any;
  error?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignUpData = {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
};

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Sign in with email and password - DIRECT API CALL
  async signIn({ email, password }: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Starting sign in...', { email });

      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      console.log('🔐 Making direct API call to Supabase...');

      // Call Supabase auth API directly using fetch
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log('🔐 Direct API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('🔐 API error:', errorData);
        throw new Error(errorData.error_description || errorData.msg || 'Authentication failed');
      }

      const data = await response.json();
      console.log('🔐 Auth successful, user ID:', data.user?.id);

      // Set the session in Supabase client
      if (data.access_token) {
        await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
      }

      if (data.user) {
        console.log('🔐 Getting user profile...');
        // Get user profile from our custom users table
        const userProfile = await this.getUserProfile(data.user.id);

        console.log('🔐 User profile retrieved:', { hasProfile: !!userProfile });

        // Update last login (don't await - do in background)
        this.updateLastLogin(data.user.id).catch(err =>
          console.warn('Failed to update last login:', err)
        );

        return {
          user: userProfile,
          session: {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            user: data.user,
          },
        };
      }

      return { user: null, session: null, error: "No user found" };
    } catch (error: any) {
      console.error('🔐 Sign in error:', error);
      return { user: null, session: null, error: error.message };
    }
  }

  // Sign up new user (admin only)
  async signUp({
    email,
    password,
    full_name,
    role = "contributor",
  }: SignUpData): Promise<AuthResponse> {
    try {
      if (!PROJECT_ID) {
        throw new Error(
          "Supabase project ID is not configured. Set VITE_SUPABASE_PROJECT_ID.",
        );
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile in our custom table
        const userProfile = await this.createUserProfile({
          id: data.user.id,
          email,
          full_name,
          role,
          project_id: PROJECT_ID,
          permissions: this.getDefaultPermissions(role),
          is_active: true,
          cultural_authority: role === "elder" || role === "admin",
          can_approve_content: role === "elder" || role === "admin",
        });

        return {
          user: userProfile,
          session: data.session,
        };
      }

      return { user: null, session: null, error: "Failed to create user" };
    } catch (error: any) {
      return { user: null, session: null, error: error.message };
    }
  }

  // Sign out
  async signOut(): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      return await this.getUserProfile(user.id);
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // Get user profile from auth metadata (fallback if users table doesn't exist)
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      // First try to get from users table
      let query = supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .eq("is_active", true);

      if (PROJECT_ID) {
        query = query.eq("project_id", PROJECT_ID);
      }

      const { data, error } = await query.single();

      if (data && !error) {
        return data;
      }

      // Fallback: Use auth metadata if users table doesn't exist
      console.log("Users table not found, using auth metadata");
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user || user.id !== userId) {
        return null;
      }

      // Build user object from auth metadata
      const metadata = user.user_metadata || {};
      return {
        id: user.id,
        email: user.email || '',
        full_name: metadata.full_name || metadata.name || 'User',
        role: metadata.role || 'contributor',
        project_id: PROJECT_ID || '',
        avatar_url: metadata.avatar_url,
        permissions: this.getDefaultPermissions(metadata.role || 'contributor'),
        created_at: user.created_at,
        last_login: user.last_sign_in_at || user.created_at,
        is_active: true,
        cultural_authority: metadata.role === 'elder' || metadata.role === 'admin',
        can_approve_content: metadata.role === 'elder' || metadata.role === 'admin',
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }

  // Create user profile
  private async createUserProfile(
    userData: Omit<User, "created_at" | "last_login">,
  ): Promise<User> {
    const payload = {
      ...userData,
      project_id: userData.project_id || PROJECT_ID,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };

    if (!payload.project_id) {
      throw new Error(
        "Supabase project ID is not configured. Set VITE_SUPABASE_PROJECT_ID.",
      );
    }

    const { data, error } = await supabase
      .from("users")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update last login
  private async updateLastLogin(userId: string): Promise<void> {
    await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", userId);
  }

  // Get default permissions for role
  private getDefaultPermissions(role: UserRole): string[] {
    const permissions = {
      admin: [
        "create_content",
        "edit_content",
        "delete_content",
        "approve_content",
        "manage_users",
        "manage_media",
        "view_analytics",
        "cultural_authority",
      ],
      elder: [
        "create_content",
        "edit_content",
        "approve_content",
        "cultural_authority",
        "view_all_content",
      ],
      editor: [
        "create_content",
        "edit_content",
        "manage_media",
        "view_analytics",
      ],
      contributor: ["create_content", "edit_own_content"],
      storyteller: ["create_stories", "edit_own_stories"],
    };

    return permissions[role] || permissions.contributor;
  }

  // Check if user has permission
  hasPermission(user: User | null, permission: string): boolean {
    if (!user) return false;
    return user.permissions.includes(permission) || user.role === "admin";
  }

  // Check if user can approve content (Elder or Admin)
  canApproveContent(user: User | null): boolean {
    if (!user) return false;
    return (
      user.can_approve_content || user.role === "admin" || user.role === "elder"
    );
  }

  // Check if user has cultural authority
  hasCulturalAuthority(user: User | null): boolean {
    if (!user) return false;
    return (
      user.cultural_authority || user.role === "elder" || user.role === "admin"
    );
  }

  // Get all users (admin only)
  async getUsers(): Promise<User[]> {
    try {
      let query = supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (PROJECT_ID) {
        query = query.eq("project_id", PROJECT_ID);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  // Update user profile (admin only)
  async updateUserProfile(
    userId: string,
    updates: Partial<User>,
  ): Promise<User | null> {
    try {
      let query = supabase
        .from("users")
        .update(updates)
        .eq("id", userId);

      if (PROJECT_ID) {
        query = query.eq("project_id", PROJECT_ID);
      }

      const { data, error } = await query.select().single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      return null;
    }
  }

  // Deactivate user (admin only)
  async deactivateUser(userId: string): Promise<boolean> {
    try {
      let query = supabase
        .from("users")
        .update({ is_active: false })
        .eq("id", userId);

      if (PROJECT_ID) {
        query = query.eq("project_id", PROJECT_ID);
      }

      const { error } = await query;

      return !error;
    } catch (error) {
      console.error("Error deactivating user:", error);
      return false;
    }
  }

  // Listen for auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userProfile = await this.getUserProfile(session.user.id);
        callback(userProfile);
      } else {
        callback(null);
      }
    });
  }

  // Reset password
  async resetPassword(email: string): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Update password
  async updatePassword(newPassword: string): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  }
}

export const authService = AuthService.getInstance();
