import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: null;
  session: null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    return {
      error: new Error('Frontend admin is disabled. Please use Django Admin to manage content.'),
    };
  };

  const signUp = async (email: string, password: string) => {
    return {
      error: new Error('Sign up is managed via Django Admin.'),
    };
  };

  const signOut = async () => {
    return;
  };

  return (
    <AuthContext.Provider value={{ user: null, session: null, isAdmin: false, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
