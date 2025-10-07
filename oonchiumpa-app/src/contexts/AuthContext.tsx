import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  authService,
  type User,
  type LoginCredentials,
  type AuthResponse,
} from "../services/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  canApproveContent: () => boolean;
  hasCulturalAuthority: () => boolean;
  isAdmin: () => boolean;
  isElder: () => boolean;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange((user: User | null) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (
    credentials: LoginCredentials,
  ): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const response = await authService.signIn(credentials);
      if (response.user) {
        setUser(response.user);
      }
      return response;
    } catch (error: any) {
      return { user: null, session: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    return authService.hasPermission(user, permission);
  };

  const canApproveContent = (): boolean => {
    return authService.canApproveContent(user);
  };

  const hasCulturalAuthority = (): boolean => {
    return authService.hasCulturalAuthority(user);
  };

  const isAdmin = (): boolean => {
    return user?.role === "admin" || false;
  };

  const isElder = (): boolean => {
    return user?.role === "elder" || false;
  };

  const isAuthenticated = (): boolean => {
    return user !== null;
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    hasPermission,
    canApproveContent,
    hasCulturalAuthority,
    isAdmin,
    isElder,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
