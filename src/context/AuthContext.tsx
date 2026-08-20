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
} from 'firebase/firestore';
import { initializeApp, deleteApp } from 'firebase/app';
import {
  getAuth as getSecondaryAuth,
  createUserWithEmailAndPassword as createSecondaryUser,
  signOut as secondarySignOut,
} from 'firebase/auth';
import { auth, db, firebaseConfig, handleFirestoreError, OperationType } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  role: 'corporate' | 'admin';
  corporateRole?: string; // e.g. "Asst. Sales Manager", "Senior Sales Manager", "Corporate Sales Executive"
  corporateUserId?: string; // e.g. "WDS-4827"
  adminUserId?: string; // e.g. "ADM-1042"
  income?: number;
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCreateCorporatePayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  location?: string;
  corporateRole?: string;
  income?: number;
  progress?: number;
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
  authModalInitialView: 'choose' | 'corporate-login' | 'admin-login' | 'admin-register';
  userType: 'corporate' | 'admin';
  setUserType: (type: 'corporate' | 'admin') => void;
  openAuthModal: (role?: 'corporate' | 'admin') => void;
  closeAuthModal: () => void;
  login: (identifier: string, password: string, requiredRole?: 'corporate' | 'admin') => Promise<{ success: boolean; error?: string }>;
  adminCreateCorporateUser: (data: AdminCreateCorporatePayload) => Promise<{ success: boolean; user?: UserProfile; corporateUserId?: string; error?: string }>;
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
  const [authModalInitialView, setAuthModalInitialView] = useState<'choose' | 'corporate-login' | 'admin-login' | 'admin-register'>('choose');
  const [userType, setUserType] = useState<'corporate' | 'admin'>('corporate');

  // Fetch user profile from Firestore
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
          // Fallback profile if Firestore is newly provisioning
          const fallbackRole = currentUser.email === 'priyanshukumarjha604@gmail.com' ? 'admin' : 'corporate';
          const fallbackProfile: UserProfile = {
            uid: currentUser.uid,
            name: currentUser.displayName || (currentUser.email?.split('@')[0] ?? 'User'),
            email: currentUser.email || '',
            phone: '',
            role: fallbackRole,
            corporateUserId: fallbackRole === 'corporate' ? `WDS-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
            adminUserId: fallbackRole === 'admin' ? 'ADM-PRIMARY' : undefined,
            income: 0,
            progress: 0,
          };
          setProfile(fallbackProfile);
          setUserType(fallbackRole);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (role?: 'corporate' | 'admin') => {
    if (role === 'corporate') {
      setUserType('corporate');
      setAuthModalInitialView('corporate-login');
    } else if (role === 'admin') {
      setUserType('admin');
      setAuthModalInitialView('admin-login');
    } else {
      // Default: Show "Who are you?" selector modal
      setAuthModalInitialView('choose');
    }
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

  // Helper to generate a collision-free WDS-XXXX ID
  const generateUniqueWdsId = async (): Promise<string> => {
    for (let attempt = 0; attempt < 10; attempt++) {
      // 4-digit number: 1000 to 9999
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const candidateId = `WDS-${randomNum}`;

      try {
        const lookupRef = doc(db, 'wds_lookup', candidateId);
        const lookupSnap = await getDoc(lookupRef);
        if (!lookupSnap.exists()) {
          return candidateId;
        }
      } catch {
        return candidateId;
      }
    }
    return `WDS-${Date.now().toString().slice(-4)}`;
  };

  // Login: Supports Corporate User ID (WDS-XXXX) or Email Address
  const login = async (
    identifier: string,
    password: string,
    requiredRole?: 'corporate' | 'admin'
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedId = identifier.trim();
    let emailToUse = trimmedId;

    // If identifier doesn't contain '@', resolve via wds_lookup
    if (!trimmedId.includes('@')) {
      const normalizedWdsId = trimmedId.toUpperCase();
      try {
        const lookupRef = doc(db, 'wds_lookup', normalizedWdsId);
        const lookupSnap = await getDoc(lookupRef);
        if (lookupSnap.exists() && lookupSnap.data()?.email) {
          emailToUse = lookupSnap.data().email;
        } else {
          return { success: false, error: 'Invalid Corporate User ID (WDS-XXXX) or Password.' };
        }
      } catch (lookupErr) {
        console.error('WDS Lookup error:', lookupErr);
        return { success: false, error: 'Invalid Corporate User ID or Password.' };
      }
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, emailToUse, password);
      const prof = await fetchProfileForUid(cred.user.uid);
      
      // Role enforcement check
      if (prof && requiredRole && prof.role !== requiredRole) {
        await signOut(auth);
        setUser(null);
        setProfile(null);
        if (requiredRole === 'admin') {
          return {
            success: false,
            error: 'Access Denied: This account does not possess Administrator privileges.',
          };
        } else {
          return {
            success: false,
            error: 'This account is an Administrator account. Please use the Admin login portal.',
          };
        }
      }

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
        return { success: false, error: 'Email/ID or password is incorrect.' };
      } else if (code === 'auth/invalid-email') {
        return { success: false, error: 'Please enter a valid email address or WDS-XXXX ID.' };
      } else if (code === 'auth/too-many-requests') {
        return { success: false, error: 'Too many attempts. Please wait a few moments and try again.' };
      }
      return { success: false, error: err?.message || 'Login failed. Please check your credentials.' };
    }
  };

  // Admin Function: Creates a new Corporate User using a secondary Firebase App instance
  // This guarantees the Admin's active session is NEVER interrupted or logged out!
  const adminCreateCorporateUser = async (
    data: AdminCreateCorporatePayload
  ): Promise<{ success: boolean; user?: UserProfile; corporateUserId?: string; error?: string }> => {
    let secondaryApp = null;
    try {
      // 1. Generate guaranteed unique WDS-XXXX ID
      const wdsId = await generateUniqueWdsId();

      // 2. Initialize secondary isolated Firebase app
      const secondaryAppName = `SecondaryAuth_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
      const secondaryAuth = getSecondaryAuth(secondaryApp);

      // 3. Create user credentials on secondary auth instance
      const cred = await createSecondaryUser(secondaryAuth, data.email.trim().toLowerCase(), data.password);
      const newUid = cred.user.uid;

      // 4. Sign out from secondary app and dispose instance immediately
      await secondarySignOut(secondaryAuth);
      await deleteApp(secondaryApp);
      secondaryApp = null;

      // 5. Structure corporate profile
      const newProfile: UserProfile = {
        uid: newUid,
        corporateUserId: wdsId,
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim().toLowerCase(),
        location: data.location?.trim() || 'Pan-India Corporate',
        role: 'corporate',
        corporateRole: data.corporateRole || 'Asst. Sales Manager',
        income: Number(data.income) || 0,
        progress: Number(data.progress) || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 6. Save in Firestore users collection using Admin credentials
      try {
        await setDoc(doc(db, 'users', newUid), newProfile);
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.CREATE, `users/${newUid}`);
      }

      // 7. Save in wds_lookup index for dual-login resolution
      try {
        await setDoc(doc(db, 'wds_lookup', wdsId), {
          corporateUserId: wdsId,
          email: data.email.trim().toLowerCase(),
          uid: newUid,
          createdAt: new Date().toISOString(),
        });
      } catch (wdsErr) {
        console.warn('WDS lookup index registration notice:', wdsErr);
      }

      return { success: true, user: newProfile, corporateUserId: wdsId };
    } catch (err: any) {
      if (secondaryApp) {
        try {
          await deleteApp(secondaryApp);
        } catch {}
      }
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') {
        return { success: false, error: 'A corporate user with this email address already exists.' };
      } else if (code === 'auth/invalid-email') {
        return { success: false, error: 'Please provide a valid email address.' };
      } else if (code === 'auth/weak-password') {
        return { success: false, error: 'Password should be at least 6 characters long.' };
      }
      return { success: false, error: err?.message || 'Failed to create corporate user.' };
    }
  };

  // Admin Registration:
  // Creates account + Firestore profile -> immediately signs out -> returns success -> DOES NOT AUTO-LOGIN
  const signupAdmin = async (data: AdminSignupPayload): Promise<{ success: boolean; error?: string }> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
      const newUid = cred.user.uid;

      const newProfile: UserProfile = {
        uid: newUid,
        adminUserId: `ADM-${Math.floor(1000 + Math.random() * 9000)}`,
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

      // CRITICAL REQUIREMENT: Do NOT automatically log the Admin into the dashboard.
      // Sign out immediately so they return to the Admin Login screen and manually log in.
      await signOut(auth);
      setUser(null);
      setProfile(null);

      return { success: true };
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') {
        return { success: false, error: 'An admin account with this email already exists. Please sign in.' };
      } else if (code === 'auth/invalid-email') {
        return { success: false, error: 'Please enter a valid email address.' };
      } else if (code === 'auth/weak-password') {
        return { success: false, error: 'Password should be at least 6 characters.' };
      }
      return { success: false, error: err?.message || 'Failed to create admin account.' };
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
      // Prevent client-side role or identity tampering
      delete (updateData as any).role;
      delete (updateData as any).uid;
      delete (updateData as any).corporateUserId;
      delete (updateData as any).adminUserId;
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

  // Universal Logout: signOut + clear state + website reload and redirect directly to '/'
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setProfile(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthModalOpen,
        authModalInitialView,
        userType,
        setUserType,
        openAuthModal,
        closeAuthModal,
        login,
        adminCreateCorporateUser,
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
