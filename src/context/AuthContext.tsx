import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return { success: true };
    } catch (err: any) {
      const code = err?.code || '';
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-login-credentials'
      ) {
        return { success: false, error: 'Email or password is incorrect.' };
      } else if (code === 'auth/invalid-email') {
        return { success: false, error: 'Please enter a valid email address.' };
      } else if (code === 'auth/too-many-requests') {
        return { success: false, error: 'Too many attempts. Please try again later.' };
      }
      return { success: false, error: 'Email or password is incorrect.' };
    }
  };

  const signup = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      return { success: true };
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') {
        return { success: false, error: 'User already exists. Please sign in.' };
      } else if (code === 'auth/invalid-email') {
        return { success: false, error: 'Please enter a valid email address.' };
      } else if (code === 'auth/weak-password') {
        return { success: false, error: 'Password should be at least 6 characters.' };
      }
      return { success: false, error: err?.message || 'Failed to create account.' };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
