import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // For demo purposes
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: Record<UserRole, User> = {
  agent: {
    id: 'agent-1',
    email: 'agent@healthlink.com',
    name: 'Sarah Johnson',
    role: 'agent',
    onboardingComplete: false,
  },
  agency: {
    id: 'agency-1',
    email: 'agency@healthlink.com',
    name: 'MetroHealth Agency',
    role: 'agency',
    onboardingComplete: true,
  },
  ops: {
    id: 'ops-1',
    email: 'ops@healthlink.com',
    name: 'Michael Chen',
    role: 'ops',
    onboardingComplete: true,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Determine role from email for demo
    let role: UserRole = 'agent';
    if (email.includes('agency')) role = 'agency';
    if (email.includes('ops') || email.includes('admin')) role = 'ops';
    
    const user = { ...MOCK_USERS[role], email };
    
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setAuthState(prev => ({
      ...prev,
      user: prev.user ? { ...MOCK_USERS[role], email: prev.user.email } : MOCK_USERS[role],
      isAuthenticated: true,
    }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, switchRole }}>
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
