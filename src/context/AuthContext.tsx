import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  role: 'corporate' | 'admin';
  corporateRole?: string; // e.g. "Asst. Sales Manager", "Senior Sales Manager"
  avlId?: string; // e.g. "AVL-74921"
  income?: number;
  progress?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface CorporateSignupPayload {
  name: string;
  phone: string;
  email: string;
  location: string;
  corporateRole: string;
  password: string;
  avlId: string;
}

export interface AdminSignupPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'signup';
  userType: 'corporate' | 'admin';
  setUserType: (type: 'corporate' | 'admin') => void;
  openAuthModal: (mode?: 'login' | 'signup', role?: 'corporate' | 'admin') => void;
  closeAuthModal: () => void;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signupCorporate: (data: CorporateSignupPayload) => Promise<{ success: boolean; error?: string }>;
  signupAdmin: (data: AdminSignupPayload) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  fetchAllCorporateUsers: () => Promise<UserProfile[]>;
  updateUserProgressByAdmin: (targetUid: string, data: { income?: number; progress?: number }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [userType, setUserType] = useState<'corporate' | 'admin'>('corporate');

  // Fetch or sync user profile from Firestore
  const fetchProfileForUid = async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        return data;
      }
      return null;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userProf = await fetchProfileForUid(currentUser.uid);
        if (userProf) {
          setProfile(userProf);
          setUserType(userProf.role || 'corporate');
        } else {
          // Fallback profile if document hasn't completed writing yet
          const fallbackProfile: UserProfile = {
            uid: currentUser.uid,
            name: currentUser.displayName || (currentUser.email?.split('@')[0] ?? 'User'),
            email: currentUser.email || '',
            phone: '',
            role: currentUser.email === 'priyanshukumarjha604@gmail.com' ? 'admin' : 'corporate',
            income: 0,
            progress: 0,
          };
          setProfile(fallbackProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' = 'login', role: 'corporate' | 'admin' = 'corporate') => {
    setAuthMode(mode);
    setUserType(role);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const refreshProfile = async () => {
    if (auth.currentUser) {
      const data = await fetchProfileForUid(auth.currentUser.uid);
      if (data) setProfile(data);
    }
  };

  // Dual Login: Supports either User ID (AVL ID) or Email Address
  const login = async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedId = identifier.trim();
    let emailToUse = trimmedId;

    // If identifier doesn't contain '@', resolve via avl_lookup or case-insensitive query
    if (!trimmedId.includes('@')) {
      const normalizedAvlId = trimmedId.toUpperCase();
      try {
        const lookupRef = doc(db, 'avl_lookup', normalizedAvlId);
        const lookupSnap = await getDoc(lookupRef);
        if (lookupSnap.exists() && lookupSnap.data()?.email) {
          emailToUse = lookupSnap.data().email;
        } else {
          return { success: false, error: 'Email or password is incorrect.' };
        }
      } catch (lookupErr) {
        console.error('AVL Lookup error:', lookupErr);
        return { success: false, error: 'Email or password is incorrect.' };
      }
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, emailToUse, password);
      const prof = await fetchProfileForUid(cred.user.uid);
      if (prof) {
        setProfile(prof);
        setUserType(prof.role);
      }
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
        return { success: false, error: 'Email or password is incorrect.' };
      } else if (code === 'auth/too-many-requests') {
        return { success: false, error: 'Too many attempts. Please try again later.' };
      }
      return { success: false, error: 'Email or password is incorrect.' };
    }
  };

  // Corporate Registration
  const signupCorporate = async (data: CorporateSignupPayload): Promise<{ success: boolean; error?: string }> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
      const newUid = cred.user.uid;
      const normalizedAvlId = data.avlId.trim().toUpperCase();

      const newProfile: UserProfile = {
        uid: newUid,
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim().toLowerCase(),
        location: data.location.trim(),
        corporateRole: data.corporateRole || 'Asst. Sales Manager',
        avlId: normalizedAvlId,
        role: 'corporate',
        income: 0,
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 1. Save user profile in Firestore
      try {
        await setDoc(doc(db, 'users', newUid), newProfile);
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.CREATE, `users/${newUid}`);
      }

      // 2. Save AVL lookup mapping for ID-based login
      try {
        await setDoc(doc(db, 'avl_lookup', normalizedAvlId), {
          avlId: normalizedAvlId,
          email: data.email.trim().toLowerCase(),
          uid: newUid,
          createdAt: new Date().toISOString(),
        });
      } catch (avlErr) {
        console.warn('AVL lookup registration notice:', avlErr);
      }

      setProfile(newProfile);
      setUserType('corporate');
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

  // Admin Registration
  const signupAdmin = async (data: AdminSignupPayload): Promise<{ success: boolean; error?: string }> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
      const newUid = cred.user.uid;

      const newProfile: UserProfile = {
        uid: newUid,
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim().toLowerCase(),
        role: 'admin',
        income: 0,
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', newUid), newProfile);
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.CREATE, `users/${newUid}`);
      }

      setProfile(newProfile);
      setUserType('admin');
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

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    try {
      const userRef = doc(db, 'users', uid);
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      // Never allow updating role via normal client update
      delete (updateData as any).role;
      delete (updateData as any).uid;
      delete (updateData as any).createdAt;

      await updateDoc(userRef, updateData);
      setProfile((prev) => (prev ? { ...prev, ...updateData } : null));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
    }
  };

  // Admin function: fetch all corporate users
  const fetchAllCorporateUsers = async (): Promise<UserProfile[]> => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'corporate'));
      const querySnapshot = await getDocs(q);
      const list: UserProfile[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push(docSnap.data() as UserProfile);
      });
      return list;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'users');
      return [];
    }
  };

  // Admin function: update corporate progress or income
  const updateUserProgressByAdmin = async (targetUid: string, data: { income?: number; progress?: number }) => {
    try {
      const targetRef = doc(db, 'users', targetUid);
      await updateDoc(targetRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${targetUid}`);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthModalOpen,
        authMode,
        userType,
        setUserType,
        openAuthModal,
        closeAuthModal,
        login,
        signupCorporate,
        signupAdmin,
        refreshProfile,
        updateProfile,
        fetchAllCorporateUsers,
        updateUserProgressByAdmin,
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
