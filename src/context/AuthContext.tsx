import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  type User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
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
  addDoc,
  orderBy,
  serverTimestamp,
  deleteDoc,
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

export interface AttendanceRecord {
  id: string;
  employeeUid: string;
  employeeCode: string;
  employeeName: string;
  date: string;
  todayWorkHours: number;
  expectedClients: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
}

export interface DailyReportItem {
  id: string;
  sNo: number | string;
  name: string;
  email: string;
  number: string;
  location: string;
  requirement: string;
  status: string;
  assignedEmployeeUid: string;
  assignedEmployeeCode: string;
  assignedEmployeeName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDailyReportPayload {
  sNo?: number | string;
  name: string;
  email: string;
  number: string;
  location: string;
  requirement: string;
  status: string;
  assignedEmployeeUid: string;
  assignedEmployeeCode: string;
  assignedEmployeeName: string;
}

export interface ExpectedDataItem {
  id: string;
  businessName: string;
  location: string;
  number: string;
  date: string;
  status: 'Pending' | 'Interested' | 'Not Interested';
  assignedEmployeeUid: string;
  assignedEmployeeCode: string;
  assignedEmployeeName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateExpectedDataPayload {
  businessName: string;
  location: string;
  number: string;
  date: string;
  assignedEmployeeUid: string;
  assignedEmployeeCode: string;
  assignedEmployeeName: string;
  status?: 'Pending' | 'Interested' | 'Not Interested';
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

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalInitialView: 'choose' | 'corporate-login' | 'admin-login';
  userType: 'corporate' | 'admin';
  setUserType: (type: 'corporate' | 'admin') => void;
  openAuthModal: (role?: 'corporate' | 'admin') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string, requiredRole?: 'corporate' | 'admin') => Promise<{ success: boolean; error?: string }>;
  adminCreateCorporateUser: (data: AdminCreateCorporatePayload) => Promise<{ success: boolean; user?: UserProfile; corporateUserId?: string; error?: string }>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  changeUserPassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  submitAttendance: (data: { date: string; todayWorkHours: number; expectedClients: number }) => Promise<{ success: boolean; error?: string }>;
  fetchUserAttendance: () => Promise<AttendanceRecord[]>;
  fetchAllAttendance: () => Promise<AttendanceRecord[]>;
  updateAttendanceStatus: (attendanceId: string, status: 'pending' | 'approved' | 'rejected') => Promise<{ success: boolean; error?: string }>;
  fetchAllCorporateUsers: () => Promise<UserProfile[]>;
  updateUserProgressByAdmin: (targetUid: string, data: { income?: number; progress?: number }) => Promise<void>;
  createDailyReport: (data: CreateDailyReportPayload) => Promise<{ success: boolean; error?: string }>;
  fetchAdminDailyReports: () => Promise<DailyReportItem[]>;
  fetchEmployeeDailyReports: () => Promise<DailyReportItem[]>;
  updateDailyReportStatus: (reportId: string, status: string) => Promise<{ success: boolean; error?: string }>;
  deleteDailyReport: (reportId: string) => Promise<{ success: boolean; error?: string }>;
  createExpectedData: (data: CreateExpectedDataPayload) => Promise<{ success: boolean; error?: string }>;
  fetchAdminExpectedData: () => Promise<ExpectedDataItem[]>;
  fetchEmployeeExpectedData: () => Promise<ExpectedDataItem[]>;
  updateExpectedDataStatus: (id: string, status: 'Pending' | 'Interested' | 'Not Interested') => Promise<{ success: boolean; error?: string }>;
  deleteExpectedData: (id: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Recognized Default Administrator Emails
const DEFAULT_ADMIN_EMAILS = [
  'priyanshukumarjha604@gmail.com',
  'waltdesignsstudio@gmail.com',
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialView, setAuthModalInitialView] = useState<'choose' | 'corporate-login' | 'admin-login'>('choose');
  const [userType, setUserType] = useState<'corporate' | 'admin'>('corporate');

  // Fetch user profile from Firestore
  const fetchProfileForUid = async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
      return null;
    } catch (err) {
      console.warn('Profile read attempt notice:', err);
      return null;
    }
  };

  // Helper to ensure an Admin profile exists in Firestore
  const ensureAdminProfileInFirestore = async (firebaseUser: User): Promise<UserProfile> => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const existing = await fetchProfileForUid(firebaseUser.uid);
    if (existing && existing.role === 'admin') {
      return existing;
    }

    const adminProfile: UserProfile = {
      uid: firebaseUser.uid,
      adminUserId: existing?.adminUserId || `ADM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: existing?.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Administrator',
      email: firebaseUser.email || '',
      phone: existing?.phone || '+91 8276825128',
      role: 'admin',
      income: 0,
      progress: 0,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(userDocRef, adminProfile, { merge: true });
    } catch (writeErr) {
      console.warn('Admin profile persistence notice:', writeErr);
    }
    return adminProfile;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        let userProf = await fetchProfileForUid(currentUser.uid);

        const isEmailAdmin =
          DEFAULT_ADMIN_EMAILS.includes(currentUser.email?.toLowerCase() || '') ||
          currentUser.email?.toLowerCase().includes('admin') ||
          currentUser.email?.toLowerCase().includes('walt');

        if (userProf?.role === 'admin' || (!userProf && isEmailAdmin)) {
          userProf = await ensureAdminProfileInFirestore(currentUser);
        }

        if (userProf) {
          setProfile(userProf);
          setUserType(userProf.role || 'corporate');
        } else {
          const fallbackRole = isEmailAdmin ? 'admin' : 'corporate';
          const fallbackProfile: UserProfile = {
            uid: currentUser.uid,
            name: currentUser.displayName || (currentUser.email?.split('@')[0] ?? 'Corporate Member'),
            email: currentUser.email || '',
            phone: '',
            role: fallbackRole,
            corporateUserId: fallbackRole === 'corporate' ? `WDS-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
            adminUserId: fallbackRole === 'admin' ? 'ADM-PRIMARY' : undefined,
            income: 0,
            progress: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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

  // Helper to generate unique WDS-XXXX ID
  const generateUniqueWdsId = async (): Promise<string> => {
    for (let attempt = 0; attempt < 10; attempt++) {
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

  // Login Function:
  // Corporate login supports BOTH Email OR Employee ID (WDS-XXXX) + Password + CAPTCHA.
  // Admin login strictly supports Email + Password + CAPTCHA.
  const login = async (
    identifierInput: string,
    passwordInput: string,
    requiredRole?: 'corporate' | 'admin'
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedInput = identifierInput.trim();

    if (!trimmedInput) {
      return {
        success: false,
        error: requiredRole === 'admin'
          ? 'Please enter your administrator email address.'
          : 'Please enter your Corporate Email or Employee ID (WDS-XXXX).',
      };
    }

    // 1. Admin Login: Strictly Email only
    if (requiredRole === 'admin') {
      if (!trimmedInput.includes('@')) {
        return {
          success: false,
          error: 'Please enter your registered Admin email address.',
        };
      }
    }

    let resolvedEmail = trimmedInput;

    // 2. Corporate Login: If input starts with WDS- or does not contain @, securely find registered email
    if (!trimmedInput.includes('@')) {
      const cleanUpper = trimmedInput.replace(/\s+/g, '').toUpperCase();
      const formattedWdsId = cleanUpper.startsWith('WDS-') ? cleanUpper : `WDS-${cleanUpper}`;

      let foundEmail: string | null = null;

      // Step A: Secure Backend API Lookup (/api/lookup-employee)
      try {
        const res = await fetch('/api/lookup-employee', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employeeId: formattedWdsId }),
        });

        if (res.ok) {
          const resData = await res.json();
          if (resData.success && resData.email) {
            foundEmail = resData.email;
          }
        }
      } catch (apiErr) {
        console.warn('Backend employee lookup API notice:', apiErr);
      }

      // Step B: Fallback to secured wds_lookup collection document
      if (!foundEmail) {
        try {
          const lookupDoc = await getDoc(doc(db, 'wds_lookup', formattedWdsId));
          if (lookupDoc.exists() && lookupDoc.data()?.email) {
            foundEmail = lookupDoc.data().email;
          }
        } catch {}
      }

      if (!foundEmail) {
        return {
          success: false,
          error: `Employee ID "${formattedWdsId}" was not found. Please verify your Employee ID or log in using your registered email address.`,
        };
      }

      resolvedEmail = foundEmail;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, resolvedEmail.toLowerCase(), passwordInput);
      let prof = await fetchProfileForUid(cred.user.uid);

      const isEmailAdmin =
        DEFAULT_ADMIN_EMAILS.includes(cred.user.email?.toLowerCase() || '') ||
        cred.user.email?.toLowerCase().includes('admin') ||
        cred.user.email?.toLowerCase().includes('walt');

      if (requiredRole === 'admin' || prof?.role === 'admin' || isEmailAdmin) {
        prof = await ensureAdminProfileInFirestore(cred.user);
      }

      // Strict role enforcement check
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
        return { success: false, error: 'User ID / Email or password is incorrect.' };
      } else if (code === 'auth/invalid-email') {
        return { success: false, error: 'Please enter a valid email address or Employee ID (WDS-XXXX).' };
      } else if (code === 'auth/too-many-requests') {
        return { success: false, error: 'Too many attempts. Please wait a few moments and try again.' };
      }
      return { success: false, error: err?.message || 'Login failed. Please check your credentials.' };
    }
  };

  // Secure Password Change via Firebase Auth Re-authentication
  const changeUserPassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!auth.currentUser || !auth.currentUser.email) {
      return { success: false, error: 'You must be signed in to change your password.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    try {
      // 1. Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // 2. Update password in Firebase Auth
      await updatePassword(auth.currentUser, newPassword);

      return { success: true };
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        return { success: false, error: 'Current password is incorrect.' };
      } else if (code === 'auth/weak-password') {
        return { success: false, error: 'New password is too weak. Please use a stronger password.' };
      } else if (code === 'auth/requires-recent-login') {
        return { success: false, error: 'Session expired. Please log out and log back in to change password.' };
      }
      return { success: false, error: err?.message || 'Failed to update password.' };
    }
  };

  // Permitted Profile Fields Update (Name, Phone, Location)
  const updateProfile = async (
    data: Partial<UserProfile>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!auth.currentUser) {
      return { success: false, error: 'Not authenticated.' };
    }
    const uid = auth.currentUser.uid;
    try {
      const userRef = doc(db, 'users', uid);
      const updatePayload: Record<string, any> = {
        updatedAt: new Date().toISOString(),
      };

      if (data.name !== undefined) updatePayload.name = data.name.trim();
      if (data.phone !== undefined) updatePayload.phone = data.phone.trim();
      if (data.location !== undefined) updatePayload.location = data.location.trim();

      await updateDoc(userRef, updatePayload);
      setProfile((prev) => (prev ? { ...prev, ...updatePayload } : null));
      return { success: true };
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
      return { success: false, error: err?.message || 'Failed to update profile.' };
    }
  };

  // Submit Corporate Attendance
  // Enforces strictly 1 attendance per Corporate employee per calendar day with deterministic document ID
  const submitAttendance = async (data: {
    date: string;
    todayWorkHours: number;
    expectedClients: number;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!auth.currentUser) {
      console.error('Attendance Submission Error: No authenticated user found (request.auth.uid is null).');
      return { success: false, error: 'Authentication required. Please sign in.' };
    }

    const uid = auth.currentUser.uid;

    // Step 1: Ensure user profile exists in Firestore /users/{uid}
    let currentProfile = profile;
    if (!currentProfile || currentProfile.uid !== uid || !currentProfile.corporateUserId) {
      currentProfile = await fetchProfileForUid(uid);
    }

    if (!currentProfile) {
      const errDetail = `Logged-in Corporate user profile not found in /users/${uid}.`;
      console.error('[Attendance Submission Error]', errDetail);
      return { success: false, error: errDetail };
    }

    // Step 2: Check that user has role == 'corporate'
    if (currentProfile.role !== 'corporate') {
      const errDetail = `User profile role is '${currentProfile.role}', but role must be 'corporate' to submit attendance.`;
      console.error('[Attendance Submission Error]', errDetail);
      return { success: false, error: errDetail };
    }

    // Step 3: Obtain employeeCode strictly from authenticated user's own profile
    const employeeCode = currentProfile.corporateUserId;
    if (!employeeCode) {
      const errDetail = `Corporate User ID (WDS-XXXX) is missing from user profile /users/${uid}.`;
      console.error('[Attendance Submission Error]', errDetail);
      return { success: false, error: errDetail };
    }

    const employeeName = currentProfile.name || auth.currentUser.displayName || 'Corporate Representative';

    // Unique deterministic ID {employeeUid}_{date} prevents duplicate attendance at Firestore/backend level
    const docId = `${uid}_${data.date}`;
    const docRef = doc(db, 'attendance', docId);

    // Pre-check if attendance for this date has already been submitted
    try {
      const existingSnap = await getDoc(docRef);
      if (existingSnap.exists()) {
        const existingData = existingSnap.data();
        return {
          success: false,
          error: `Attendance for ${data.date} has already been submitted (Status: ${existingData.status?.toUpperCase() || 'PENDING'}). Only 1 attendance submission is allowed per calendar day.`,
        };
      }
    } catch (checkErr) {
      console.warn('Attendance existence check notice:', checkErr);
    }

    const recordData = {
      employeeUid: uid,
      employeeCode: employeeCode,
      employeeName: employeeName,
      date: data.date,
      todayWorkHours: Number(data.todayWorkHours) || 0,
      expectedClients: Number(data.expectedClients) || 0,
      status: 'pending' as const, // Strict pending status
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      // Deterministic document creation
      await setDoc(docRef, recordData);
      console.log(`[Attendance Submission Success] Document written successfully at path: attendance/${docId}`);
      return { success: true };
    } catch (err: any) {
      const errorPayload = {
        code: err?.code || 'unknown',
        message: err?.message || String(err),
        operation: 'create',
        path: `attendance/${docId}`,
        authUid: uid,
        profileRole: currentProfile.role,
        employeeCode: employeeCode,
      };
      console.error('[Attendance Submission Firebase Error]', errorPayload);
      return {
        success: false,
        error: `Submission failed [${errorPayload.code}]: ${errorPayload.message}`,
      };
    }
  };

  // Fetch Attendance records for current Corporate user
  const fetchUserAttendance = async (): Promise<AttendanceRecord[]> => {
    if (!auth.currentUser) return [];
    try {
      const attendanceRef = collection(db, 'attendance');
      const q = query(
        attendanceRef,
        where('employeeUid', '==', auth.currentUser.uid)
      );
      const snap = await getDocs(q);
      const list: AttendanceRecord[] = [];
      snap.forEach((d) => {
        const raw = d.data();
        const createdAtStr = raw.createdAt?.toDate
          ? raw.createdAt.toDate().toISOString()
          : typeof raw.createdAt === 'string'
          ? raw.createdAt
          : new Date().toISOString();
        const updatedAtStr = raw.updatedAt?.toDate
          ? raw.updatedAt.toDate().toISOString()
          : typeof raw.updatedAt === 'string'
          ? raw.updatedAt
          : undefined;

        list.push({
          id: d.id,
          employeeUid: raw.employeeUid,
          employeeCode: raw.employeeCode,
          employeeName: raw.employeeName,
          date: raw.date,
          todayWorkHours: raw.todayWorkHours,
          expectedClients: raw.expectedClients,
          status: raw.status,
          createdAt: createdAtStr,
          updatedAt: updatedAtStr,
        });
      });
      // Sort newest first
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      console.warn('Fetch user attendance notice:', err);
      return [];
    }
  };

  // Fetch all Attendance records (Admin only)
  const fetchAllAttendance = async (): Promise<AttendanceRecord[]> => {
    try {
      const attendanceRef = collection(db, 'attendance');
      const snap = await getDocs(attendanceRef);
      const list: AttendanceRecord[] = [];
      snap.forEach((d) => {
        const raw = d.data();
        const createdAtStr = raw.createdAt?.toDate
          ? raw.createdAt.toDate().toISOString()
          : typeof raw.createdAt === 'string'
          ? raw.createdAt
          : new Date().toISOString();
        const updatedAtStr = raw.updatedAt?.toDate
          ? raw.updatedAt.toDate().toISOString()
          : typeof raw.updatedAt === 'string'
          ? raw.updatedAt
          : undefined;

        list.push({
          id: d.id,
          employeeUid: raw.employeeUid,
          employeeCode: raw.employeeCode,
          employeeName: raw.employeeName,
          date: raw.date,
          todayWorkHours: raw.todayWorkHours,
          expectedClients: raw.expectedClients,
          status: raw.status,
          createdAt: createdAtStr,
          updatedAt: updatedAtStr,
        });
      });
      // Sort newest first
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'attendance');
      return [];
    }
  };

  // Admin function: Update attendance status (Approve / Reject)
  // Enforces: Once status becomes Approved or Rejected, it is FINAL and can NEVER be changed again.
  const updateAttendanceStatus = async (
    attendanceId: string,
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const docRef = doc(db, 'attendance', attendanceId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        return { success: false, error: 'Attendance record not found.' };
      }

      const existingData = snap.data();
      if (existingData.status === 'approved' || existingData.status === 'rejected') {
        return {
          success: false,
          error: `This attendance record has already been finalized as '${existingData.status.toUpperCase()}' and can never be changed again.`,
        };
      }

      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `attendance/${attendanceId}`);
      return { success: false, error: err?.message || 'Failed to update attendance status.' };
    }
  };

  // =========================================================================
  // DAILY DATA REPORT OPERATIONS
  // =========================================================================

  // Admin: Create Daily Data Report and assign to employee
  const createDailyReport = async (
    data: CreateDailyReportPayload
  ): Promise<{ success: boolean; error?: string }> => {
    if (!auth.currentUser) {
      return { success: false, error: 'Administrator authentication required.' };
    }

    if (!data.assignedEmployeeUid) {
      return { success: false, error: 'Please select an employee. Employee selection is mandatory.' };
    }

    if (!data.name.trim() || !data.email.trim() || !data.number.trim() || !data.location.trim() || !data.requirement.trim()) {
      return { success: false, error: 'Please fill in all mandatory report fields (Name, Email, Number, Location, Requirement).' };
    }

    try {
      const reportRef = collection(db, 'daily_reports');
      const payload = {
        sNo: data.sNo || Date.now().toString().slice(-4),
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        number: data.number.trim(),
        location: data.location.trim(),
        requirement: data.requirement.trim(),
        status: data.status.trim() || 'Assigned',
        assignedEmployeeUid: data.assignedEmployeeUid,
        assignedEmployeeCode: data.assignedEmployeeCode,
        assignedEmployeeName: data.assignedEmployeeName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(reportRef, payload);
      return { success: true };
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'daily_reports');
      return { success: false, error: err?.message || 'Failed to create daily data report.' };
    }
  };

  // Admin: Fetch all Daily Data Reports
  const fetchAdminDailyReports = async (): Promise<DailyReportItem[]> => {
    try {
      const reportRef = collection(db, 'daily_reports');
      const snap = await getDocs(reportRef);
      const list: DailyReportItem[] = [];
      snap.forEach((d) => {
        const raw = d.data();
        const createdAtStr = raw.createdAt?.toDate
          ? raw.createdAt.toDate().toISOString()
          : typeof raw.createdAt === 'string'
          ? raw.createdAt
          : new Date().toISOString();
        const updatedAtStr = raw.updatedAt?.toDate
          ? raw.updatedAt.toDate().toISOString()
          : typeof raw.updatedAt === 'string'
          ? raw.updatedAt
          : undefined;

        list.push({
          id: d.id,
          sNo: raw.sNo ?? '—',
          name: raw.name || '',
          email: raw.email || '',
          number: raw.number || '',
          location: raw.location || '',
          requirement: raw.requirement || '',
          status: raw.status || 'Assigned',
          assignedEmployeeUid: raw.assignedEmployeeUid,
          assignedEmployeeCode: raw.assignedEmployeeCode || '',
          assignedEmployeeName: raw.assignedEmployeeName || '',
          createdAt: createdAtStr,
          updatedAt: updatedAtStr,
        });
      });
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'daily_reports');
      return [];
    }
  };

  // Corporate: Fetch only Daily Data Reports assigned to this employee's own UID
  const fetchEmployeeDailyReports = async (): Promise<DailyReportItem[]> => {
    if (!auth.currentUser) return [];
    try {
      const reportRef = collection(db, 'daily_reports');
      const q = query(
        reportRef,
        where('assignedEmployeeUid', '==', auth.currentUser.uid)
      );
      const snap = await getDocs(q);
      const list: DailyReportItem[] = [];
      snap.forEach((d) => {
        const raw = d.data();
        const createdAtStr = raw.createdAt?.toDate
          ? raw.createdAt.toDate().toISOString()
          : typeof raw.createdAt === 'string'
          ? raw.createdAt
          : new Date().toISOString();
        const updatedAtStr = raw.updatedAt?.toDate
          ? raw.updatedAt.toDate().toISOString()
          : typeof raw.updatedAt === 'string'
          ? raw.updatedAt
          : undefined;

        list.push({
          id: d.id,
          sNo: raw.sNo ?? '—',
          name: raw.name || '',
          email: raw.email || '',
          number: raw.number || '',
          location: raw.location || '',
          requirement: raw.requirement || '',
          status: raw.status || 'Assigned',
          assignedEmployeeUid: raw.assignedEmployeeUid,
          assignedEmployeeCode: raw.assignedEmployeeCode || '',
          assignedEmployeeName: raw.assignedEmployeeName || '',
          createdAt: createdAtStr,
          updatedAt: updatedAtStr,
        });
      });
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      console.warn('Fetch employee daily reports notice:', err);
      return [];
    }
  };

  // Admin: Update Daily Data Report Status
  const updateDailyReportStatus = async (
    reportId: string,
    status: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const docRef = doc(db, 'daily_reports', reportId);
      await updateDoc(docRef, {
        status: status.trim(),
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `daily_reports/${reportId}`);
      return { success: false, error: err?.message || 'Failed to update report status.' };
    }
  };

  // Admin: Delete Daily Data Report
  const deleteDailyReport = async (
    reportId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const docRef = doc(db, 'daily_reports', reportId);
      await deleteDoc(docRef);
      return { success: true };
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `daily_reports/${reportId}`);
      return { success: false, error: err?.message || 'Failed to delete report.' };
    }
  };

  // =========================================================================
  // EXPECTED DATA OPERATIONS
  // =========================================================================

  // Admin: Create Expected Data Entry and assign to employee
  const createExpectedData = async (
    data: CreateExpectedDataPayload
  ): Promise<{ success: boolean; error?: string }> => {
    if (!auth.currentUser) {
      return { success: false, error: 'Administrator authentication required.' };
    }

    if (!data.assignedEmployeeUid) {
      return { success: false, error: 'Please select an employee. Employee selection is mandatory.' };
    }

    if (!data.businessName.trim() || !data.location.trim() || !data.number.trim()) {
      return { success: false, error: 'Please fill in all mandatory fields (Business Name, Location, Number).' };
    }

    try {
      const expectedRef = collection(db, 'expected_data');
      const payload = {
        businessName: data.businessName.trim(),
        location: data.location.trim(),
        number: data.number.trim(),
        date: data.date.trim() || new Date().toLocaleDateString('en-CA'),
        status: data.status || 'Pending',
        assignedEmployeeUid: data.assignedEmployeeUid,
        assignedEmployeeCode: data.assignedEmployeeCode,
        assignedEmployeeName: data.assignedEmployeeName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(expectedRef, payload);
      return { success: true };
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'expected_data');
      return { success: false, error: err?.message || 'Failed to create expected data entry.' };
    }
  };

  // Admin: Fetch all Expected Data entries
  const fetchAdminExpectedData = async (): Promise<ExpectedDataItem[]> => {
    try {
      const expectedRef = collection(db, 'expected_data');
      const snap = await getDocs(expectedRef);
      const list: ExpectedDataItem[] = [];
      snap.forEach((d) => {
        const raw = d.data();
        const createdAtStr = raw.createdAt?.toDate
          ? raw.createdAt.toDate().toISOString()
          : typeof raw.createdAt === 'string'
          ? raw.createdAt
          : new Date().toISOString();
        const updatedAtStr = raw.updatedAt?.toDate
          ? raw.updatedAt.toDate().toISOString()
          : typeof raw.updatedAt === 'string'
          ? raw.updatedAt
          : undefined;

        list.push({
          id: d.id,
          businessName: raw.businessName || '',
          location: raw.location || '',
          number: raw.number || '',
          date: raw.date || '',
          status: (raw.status as 'Pending' | 'Interested' | 'Not Interested') || 'Pending',
          assignedEmployeeUid: raw.assignedEmployeeUid || '',
          assignedEmployeeCode: raw.assignedEmployeeCode || '',
          assignedEmployeeName: raw.assignedEmployeeName || '',
          createdAt: createdAtStr,
          updatedAt: updatedAtStr,
        });
      });
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'expected_data');
      return [];
    }
  };

  // Corporate: Fetch only Expected Data assigned to current logged-in employee
  const fetchEmployeeExpectedData = async (): Promise<ExpectedDataItem[]> => {
    if (!auth.currentUser) return [];
    try {
      const expectedRef = collection(db, 'expected_data');
      const q = query(
        expectedRef,
        where('assignedEmployeeUid', '==', auth.currentUser.uid)
      );
      const snap = await getDocs(q);
      const list: ExpectedDataItem[] = [];
      snap.forEach((d) => {
        const raw = d.data();
        const createdAtStr = raw.createdAt?.toDate
          ? raw.createdAt.toDate().toISOString()
          : typeof raw.createdAt === 'string'
          ? raw.createdAt
          : new Date().toISOString();
        const updatedAtStr = raw.updatedAt?.toDate
          ? raw.updatedAt.toDate().toISOString()
          : typeof raw.updatedAt === 'string'
          ? raw.updatedAt
          : undefined;

        list.push({
          id: d.id,
          businessName: raw.businessName || '',
          location: raw.location || '',
          number: raw.number || '',
          date: raw.date || '',
          status: (raw.status as 'Pending' | 'Interested' | 'Not Interested') || 'Pending',
          assignedEmployeeUid: raw.assignedEmployeeUid || '',
          assignedEmployeeCode: raw.assignedEmployeeCode || '',
          assignedEmployeeName: raw.assignedEmployeeName || '',
          createdAt: createdAtStr,
          updatedAt: updatedAtStr,
        });
      });
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      console.warn('Fetch employee expected data notice:', err);
      return [];
    }
  };

  // Employee or Admin: Update Expected Data Status (e.g. Interested, Not Interested)
  const updateExpectedDataStatus = async (
    id: string,
    status: 'Pending' | 'Interested' | 'Not Interested'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const docRef = doc(db, 'expected_data', id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `expected_data/${id}`);
      return { success: false, error: err?.message || 'Failed to update expected data status.' };
    }
  };

  // Admin: Delete Expected Data entry
  const deleteExpectedData = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const docRef = doc(db, 'expected_data', id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `expected_data/${id}`);
      return { success: false, error: err?.message || 'Failed to delete expected data entry.' };
    }
  };

  // Admin Function: Creates a new Corporate User using an isolated secondary Firebase App instance.
  // The Admin's active session is NEVER signed out.
  const adminCreateCorporateUser = async (
    data: AdminCreateCorporatePayload
  ): Promise<{ success: boolean; user?: UserProfile; corporateUserId?: string; error?: string }> => {
    if (!auth.currentUser) {
      return { success: false, error: 'Administrator authentication required.' };
    }

    await ensureAdminProfileInFirestore(auth.currentUser);

    let secondaryApp = null;
    try {
      const wdsId = await generateUniqueWdsId();
      const secondaryAppName = `SecondaryAuth_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
      const secondaryAuth = getSecondaryAuth(secondaryApp);

      const cred = await createSecondaryUser(secondaryAuth, data.email.trim().toLowerCase(), data.password);
      const newUid = cred.user.uid;

      await secondarySignOut(secondaryAuth);
      await deleteApp(secondaryApp);
      secondaryApp = null;

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

      try {
        await setDoc(doc(db, 'users', newUid), newProfile);
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.CREATE, `users/${newUid}`);
      }

      try {
        await setDoc(doc(db, 'wds_lookup', wdsId), {
          corporateUserId: wdsId,
          email: data.email.trim().toLowerCase(),
          uid: newUid,
          createdAt: new Date().toISOString(),
        });
      } catch (wdsErr) {
        console.warn('WDS lookup registration notice:', wdsErr);
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

  // Universal Logout: signOut + clear state + reload and redirect directly to '/'
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
        refreshProfile,
        updateProfile,
        changeUserPassword,
        submitAttendance,
        fetchUserAttendance,
        fetchAllAttendance,
        updateAttendanceStatus,
        fetchAllCorporateUsers,
        updateUserProgressByAdmin,
        createDailyReport,
        fetchAdminDailyReports,
        fetchEmployeeDailyReports,
        updateDailyReportStatus,
        deleteDailyReport,
        createExpectedData,
        fetchAdminExpectedData,
        fetchEmployeeExpectedData,
        updateExpectedDataStatus,
        deleteExpectedData,
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
