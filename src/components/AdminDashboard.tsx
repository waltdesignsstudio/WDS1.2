import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  Layers,
  UserPlus,
  Calendar,
  LogOut,
  Shield,
  Search,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Edit3,
  Save,
  DollarSign,
  TrendingUp,
  Users,
  MapPin,
  Mail,
  Phone,
  KeyRound,
  Terminal,
  Clock,
  RefreshCw,
  XCircle,
  AlertCircle,
  Check,
  X,
  Filter,
  FileSpreadsheet,
  Lock,
  Trash2,
  Plus,
  Send,
} from 'lucide-react';
import { useAuth, UserProfile, AttendanceRecord, DailyReportItem } from '../context/AuthContext';
import { AGENCY_INFO } from '../data/agencyData';

type AdminTab = 'dashboard' | 'profile' | 'portfolio' | 'corporate-registration' | 'attendance' | 'daily-report';

export const AdminDashboard: React.FC = () => {
  const {
    user,
    profile,
    logout,
    fetchAllCorporateUsers,
    adminCreateCorporateUser,
    updateUserProgressByAdmin,
    refreshProfile,
    updateProfile,
    changeUserPassword,
    fetchAllAttendance,
    updateAttendanceStatus,
    createDailyReport,
    fetchAdminDailyReports,
    updateDailyReportStatus,
    deleteDailyReport,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [corporateList, setCorporateList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Attendance management state
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [attendanceActionId, setAttendanceActionId] = useState<string | null>(null);

  // Daily Data Report state
  const [dailyReportList, setDailyReportList] = useState<DailyReportItem[]>([]);
  const [loadingDailyReports, setLoadingDailyReports] = useState(false);
  const [reportSearchQuery, setReportSearchQuery] = useState('');
  const [reportFilterEmployee, setReportFilterEmployee] = useState<string>('all');
  const [reportActionId, setReportActionId] = useState<string | null>(null);

  // Daily Data Report creation form state
  const [reportSNo, setReportSNo] = useState<string>('');
  const [reportName, setReportName] = useState<string>('');
  const [reportEmail, setReportEmail] = useState<string>('');
  const [reportNumber, setReportNumber] = useState<string>('');
  const [reportLocation, setReportLocation] = useState<string>('');
  const [reportRequirement, setReportRequirement] = useState<string>('');
  const [reportStatus, setReportStatus] = useState<string>('Assigned');
  const [selectedEmployeeUid, setSelectedEmployeeUid] = useState<string>('');
  const [reportFormError, setReportFormError] = useState<string | null>(null);
  const [isCreatingReport, setIsCreatingReport] = useState<boolean>(false);

  // Admin Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Admin Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Editing state for Portfolio
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editIncome, setEditIncome] = useState<number>(0);
  const [editProgress, setEditProgress] = useState<number>(0);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  // Corporate Registration form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regRole, setRegRole] = useState('Asst. Sales Manager');
  const [regPassword, setRegPassword] = useState('');
  const [regIncome, setRegIncome] = useState<number>(0);
  const [regProgress, setRegProgress] = useState<number>(0);
  const [regError, setRegError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Created Corporate User notification state
  const [createdUser, setCreatedUser] = useState<{
    name: string;
    email: string;
    corporateUserId: string;
    password: string;
    role: string;
  } | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  useEffect(() => {
    loadCorporateData();
    loadAttendanceData();
    loadDailyReports();
  }, []);

  useEffect(() => {
    if (profile) {
      setAdminName(profile.name || '');
      setAdminPhone(profile.phone || '');
    }
  }, [profile]);

  const loadCorporateData = async () => {
    setLoadingUsers(true);
    try {
      const list = await fetchAllCorporateUsers();
      setCorporateList(list);
    } catch (err) {
      console.error('Failed to load corporate users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadAttendanceData = async () => {
    setLoadingAttendance(true);
    try {
      const list = await fetchAllAttendance();
      setAttendanceList(list);
    } catch (err) {
      console.error('Failed to load attendance records:', err);
    } finally {
      setLoadingAttendance(false);
    }
  };

  const loadDailyReports = async () => {
    setLoadingDailyReports(true);
    try {
      const list = await fetchAdminDailyReports();
      setDailyReportList(list);
    } catch (err) {
      console.error('Failed to load daily reports:', err);
    } finally {
      setLoadingDailyReports(false);
    }
  };

  // Profile Edit for Admin
  const handleSaveAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    if (!adminName.trim()) {
      setProfileMessage({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const res = await updateProfile({
        name: adminName.trim(),
        phone: adminPhone.trim(),
      });
      if (res.success) {
        setProfileMessage({ type: 'success', text: 'Administrator profile updated.' });
        setIsEditingProfile(false);
        await refreshProfile();
      } else {
        setProfileMessage({ type: 'error', text: res.error || 'Failed to update profile.' });
      }
    } catch {
      setProfileMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Password Change for Admin
  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!currentPassword) {
      setPasswordMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changeUserPassword(currentPassword, newPassword);
      if (res.success) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMessage({ type: 'error', text: res.error || 'Failed to change password.' });
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'Failed to change password.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Attendance Status Update (Approve / Reject)
  // Enforces: Once Approved or Rejected, status is permanent and final.
  const handleUpdateAttendanceStatus = async (attendanceId: string, newStatus: 'approved' | 'rejected') => {
    setAttendanceActionId(attendanceId);
    try {
      const res = await updateAttendanceStatus(attendanceId, newStatus);
      if (res.success) {
        setAttendanceList((prev) =>
          prev.map((item) => (item.id === attendanceId ? { ...item, status: newStatus } : item))
        );
        setUpdateSuccess(`Attendance status finalized as ${newStatus.toUpperCase()}. Status is permanent.`);
        setTimeout(() => setUpdateSuccess(null), 3000);
      } else {
        setProfileMessage({ type: 'error', text: res.error || 'Failed to update attendance status.' });
      }
    } catch (err) {
      console.error('Failed to update attendance status:', err);
    } finally {
      setAttendanceActionId(null);
    }
  };

  // Daily Data Report: Create new report assigned to employee
  const handleCreateDailyReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportFormError(null);

    // Mandatory Employee Selection Validation
    if (!selectedEmployeeUid) {
      setReportFormError('Please select a corporate employee. Employee selection is mandatory.');
      return;
    }

    if (!reportName.trim() || !reportEmail.trim() || !reportNumber.trim() || !reportLocation.trim() || !reportRequirement.trim()) {
      setReportFormError('Please fill in all mandatory fields (Name, Email, Number, Location, Requirement).');
      return;
    }

    const assignedEmp = corporateList.find((c) => c.uid === selectedEmployeeUid);
    if (!assignedEmp) {
      setReportFormError('Selected corporate employee profile not found.');
      return;
    }

    setIsCreatingReport(true);
    try {
      const nextSNo = reportSNo.trim() || (dailyReportList.length + 1).toString();
      const res = await createDailyReport({
        sNo: nextSNo,
        name: reportName.trim(),
        email: reportEmail.trim().toLowerCase(),
        number: reportNumber.trim(),
        location: reportLocation.trim(),
        requirement: reportRequirement.trim(),
        status: reportStatus.trim() || 'Assigned',
        assignedEmployeeUid: assignedEmp.uid,
        assignedEmployeeCode: assignedEmp.corporateUserId || 'WDS-CORP',
        assignedEmployeeName: assignedEmp.name || 'Corporate Employee',
      });

      if (res.success) {
        setUpdateSuccess(`Daily Data Report #${nextSNo} created and assigned to ${assignedEmp.name} (${assignedEmp.corporateUserId}).`);
        setReportSNo('');
        setReportName('');
        setReportEmail('');
        setReportNumber('');
        setReportLocation('');
        setReportRequirement('');
        setReportStatus('Assigned');
        setSelectedEmployeeUid('');
        await loadDailyReports();
        setTimeout(() => setUpdateSuccess(null), 4000);
      } else {
        setReportFormError(res.error || 'Failed to create daily data report.');
      }
    } catch (err: any) {
      setReportFormError(err?.message || 'An error occurred while creating daily report.');
    } finally {
      setIsCreatingReport(false);
    }
  };

  // Daily Data Report: Update Status
  const handleUpdateReportStatus = async (reportId: string, newStatus: string) => {
    setReportActionId(reportId);
    try {
      const res = await updateDailyReportStatus(reportId, newStatus);
      if (res.success) {
        setDailyReportList((prev) =>
          prev.map((item) => (item.id === reportId ? { ...item, status: newStatus } : item))
        );
        setUpdateSuccess(`Report status updated to '${newStatus}'.`);
        setTimeout(() => setUpdateSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Failed to update report status:', err);
    } finally {
      setReportActionId(null);
    }
  };

  // Daily Data Report: Delete
  const handleDeleteReport = async (reportId: string) => {
    if (!window.confirm('Are you sure you want to delete this Daily Data Report?')) return;
    setReportActionId(reportId);
    try {
      const res = await deleteDailyReport(reportId);
      if (res.success) {
        setDailyReportList((prev) => prev.filter((item) => item.id !== reportId));
        setUpdateSuccess('Daily Data Report deleted successfully.');
        setTimeout(() => setUpdateSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Failed to delete daily report:', err);
    } finally {
      setReportActionId(null);
    }
  };

  // Portfolio Milestone Editing
  const handleStartEdit = (item: UserProfile) => {
    setEditingUid(item.uid);
    setEditIncome(item.income || 0);
    setEditProgress(item.progress || 0);
  };

  const handleSaveProgress = async (targetUid: string) => {
    try {
      await updateUserProgressByAdmin(targetUid, {
        income: Number(editIncome),
        progress: Number(editProgress),
      });
      setUpdateSuccess('Corporate milestones updated successfully.');
      setEditingUid(null);
      await loadCorporateData();
      setTimeout(() => setUpdateSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to update corporate progress:', err);
    }
  };

  // Corporate Registration
  const handleCorporateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regPhone.trim() || !regEmail.trim() || !regPassword) {
      setRegError('Please complete all required fields (Name, Phone, Email, Password).');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }

    setIsRegistering(true);
    try {
      const res = await adminCreateCorporateUser({
        name: regName.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim().toLowerCase(),
        location: regLocation.trim() || 'Pan-India Corporate',
        corporateRole: regRole,
        password: regPassword,
        income: Number(regIncome) || 0,
        progress: Number(regProgress) || 0,
      });

      if (res.success && res.user && res.corporateUserId) {
        setCreatedUser({
          name: res.user.name,
          email: res.user.email,
          corporateUserId: res.corporateUserId,
          password: regPassword,
          role: res.user.corporateRole || regRole,
        });

        // Reset form
        setRegName('');
        setRegPhone('');
        setRegEmail('');
        setRegLocation('');
        setRegPassword('');
        setRegIncome(0);
        setRegProgress(0);

        await loadCorporateData();
      } else {
        setRegError(res.error || 'Failed to create corporate user.');
      }
    } catch (err: any) {
      setRegError(err?.message || 'An unexpected error occurred during corporate registration.');
    } finally {
      setIsRegistering(false);
    }
  };

  const copyCreatedCredentials = () => {
    if (!createdUser) return;
    const text = `WALT DESIGNS & STUDIO - CORPORATE CREDENTIALS\nName: ${createdUser.name}\nDesignation: ${createdUser.role}\nCorporate User ID: ${createdUser.corporateUserId}\nLogin Email: ${createdUser.email}\nPassword: ${createdUser.password}\nPortal URL: ${window.location.origin}/dashboard`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  // Computed Metrics
  const totalFleetIncome = corporateList.reduce((acc, curr) => acc + (curr.income || 0), 0);
  const avgProgress = corporateList.length
    ? Math.round(corporateList.reduce((acc, curr) => acc + (curr.progress || 0), 0) / corporateList.length)
    : 0;

  const filteredCorporateList = corporateList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.corporateUserId && u.corporateUserId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAttendanceList = attendanceList.filter((item) => {
    if (attendanceFilter === 'all') return true;
    return item.status === attendanceFilter;
  });

  const pendingAttendanceCount = attendanceList.filter((a) => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#1a021e] text-white flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* ========================================================================= */}
      {/* DEDICATED ADMIN TOP BAR */}
      {/* ========================================================================= */}
      <header className="bg-[#240528] border-b border-amber-500/30 sticky top-0 z-40 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* Admin Brand & Operations Identity */}
            <div className="flex items-center gap-3">
              <img
                src={AGENCY_INFO.logoUrl}
                alt="Walt Designs & Studio"
                className="w-10 h-10 rounded-lg object-cover ring-1 ring-amber-500/40"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-white tracking-tight">
                    Walt Designs & Studio
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black uppercase tracking-wider">
                    Admin IT Hub
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono hidden sm:block">
                  Admin User ID: <span className="text-amber-300 font-bold">{profile?.adminUserId || 'ADM-PRIMARY'}</span> • {user?.email}
                </p>
              </div>
            </div>

            {/* Admin Header Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs font-mono text-zinc-300">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>IT & Data Operations</span>
              </div>

              <button
                onClick={() => logout()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-950/70 hover:bg-red-900 border border-red-500/40 text-red-200 shadow-sm transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

          </div>
        </div>

        {/* ADMIN DASHBOARD NAVIGATION TABS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10 overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-2 py-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'portfolio'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Portfolio</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'portfolio' ? 'bg-black/30 text-black' : 'bg-white/10 text-zinc-300'
              }`}>
                {corporateList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('corporate-registration')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'corporate-registration'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Corporate Registration</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'attendance'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Attendance</span>
              {pendingAttendanceCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-black animate-pulse">
                  {pendingAttendanceCount} Pending
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('daily-report')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'daily-report'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Daily Data Report</span>
              {dailyReportList.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === 'daily-report' ? 'bg-black/30 text-black' : 'bg-white/10 text-zinc-300'
                }`}>
                  {dailyReportList.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN ADMIN DASHBOARD BODY */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Global Toast for Success */}
        {updateSuccess && (
          <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{updateSuccess}</span>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 1: DASHBOARD (MAIN LANDING & METRICS) */}
        {/* ======================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Welcome Banner */}
            <div className="p-6 rounded-2xl bg-[#250529] border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 uppercase tracking-wider">
                    Master Administrator
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    ID: {profile?.adminUserId || 'ADM-PRIMARY'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome back, {profile?.name || 'Administrator'}
                </h1>
                <p className="text-xs text-zinc-300">
                  Control center for corporate user provisioning, attendance validation, and platform data maintenance.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Review Attendance ({pendingAttendanceCount} Pending)</span>
                </button>

                <button
                  onClick={() => setActiveTab('corporate-registration')}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register Corporate User</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#250529] border border-white/10 shadow-md">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
                  <span>Corporate Reps</span>
                  <Users className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {corporateList.length}
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Active sales team members</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#250529] border border-white/10 shadow-md">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
                  <span>Cumulative Fleet Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  ₹{totalFleetIncome.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Total distributed income</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#250529] border border-white/10 shadow-md">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
                  <span>Avg Target Progress</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-amber-400 font-mono">
                  {avgProgress}%
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Fleet execution efficiency</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#250529] border border-white/10 shadow-md">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
                  <span>Pending Attendance</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-amber-300 font-mono">
                  {pendingAttendanceCount}
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Submissions awaiting review</span>
              </div>
            </div>

            {/* Quick Actions & Recent Attendance Review */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-2xl bg-[#250529] border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>Recent Attendance Submissions</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Review and manage employee work hours
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    Open Attendance Tab ({attendanceList.length}) →
                  </button>
                </div>

                {attendanceList.length === 0 ? (
                  <p className="text-xs text-zinc-400 p-4 text-center">No attendance records submitted yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {attendanceList.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{item.employeeName}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300">
                              {item.employeeCode}
                            </span>
                            <span className="text-xs text-zinc-400">• {item.date}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 font-mono">
                            Work: {item.todayWorkHours} hrs • Expected Clients: {item.expectedClients}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono ${
                              item.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : item.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-red-500/20 text-red-300 border border-red-500/40'
                            }`}
                          >
                            {item.status}
                          </span>

                          {item.status === 'pending' && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleUpdateAttendanceStatus(item.id, 'approved')}
                                className="p-1 rounded bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 transition-colors"
                                title="Approve"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleUpdateAttendanceStatus(item.id, 'rejected')}
                                className="p-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
                                title="Reject"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* System Security Card */}
              <div className="p-6 rounded-2xl bg-[#250529] border border-white/10 shadow-xl space-y-4">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Security & Compliance</span>
                </h3>
                <div className="space-y-3 text-xs text-zinc-300 divide-y divide-white/5">
                  <div className="pt-2">
                    <span className="text-zinc-400 block">Isolated Secondary Provisioning:</span>
                    <span className="text-emerald-400 font-mono text-[11px]">ACTIVE (Zero Session Reset)</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-zinc-400 block">Cloudflare Turnstile CAPTCHA:</span>
                    <span className="text-emerald-400 font-mono text-[11px]">ENABLED on All Logins</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-zinc-400 block">Firestore Security Rules:</span>
                    <span className="text-emerald-400 font-mono text-[11px]">ENFORCED (Role-Based + Attendance Guard)</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-zinc-400 block">Public Registration:</span>
                    <span className="text-zinc-300 font-mono text-[11px]">DISABLED (Admin-Only Creation)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 2: MY PROFILE (DETAILS + EDITING + PASSWORD CHANGE) */}
        {/* ======================================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Details */}
              <div className="p-6 rounded-2xl bg-[#250529] border border-white/10 shadow-xl space-y-6">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-400" />
                    <span>Administrator Credentials</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Authorized Master IT Administrator Profile
                  </p>
                </div>

                <div className="space-y-3 text-xs divide-y divide-white/5 font-sans">
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Admin User ID</span>
                    <span className="font-mono font-bold text-amber-300">{profile?.adminUserId || 'ADM-PRIMARY'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Full Name</span>
                    <span className="font-semibold text-white">{profile?.name || 'Administrator'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Official Email</span>
                    <span className="font-mono text-zinc-300 truncate max-w-[150px]">{profile?.email || user?.email}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Phone</span>
                    <span className="font-mono text-zinc-300">{profile?.phone || '—'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">System Role</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-black uppercase">
                      {profile?.role || 'admin'}
                    </span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Security UID</span>
                    <span className="font-mono text-[10px] text-zinc-400 truncate max-w-[130px]">{user?.uid}</span>
                  </div>
                </div>
              </div>

              {/* Edit Permitted Profile Details */}
              <div className="p-6 rounded-2xl bg-[#250529] border border-white/10 shadow-xl space-y-4">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-amber-400" />
                    <span>Edit Profile Information</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Update your administrative contact details
                  </p>
                </div>

                {profileMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      profileMessage.type === 'success'
                        ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200'
                        : 'bg-red-950/80 border border-red-500/40 text-red-200'
                    }`}
                  >
                    {profileMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span>{profileMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleSaveAdminProfile} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Full Name</label>
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Contact Phone</label>
                    <input
                      type="text"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      placeholder="+91 8276825128"
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingProfile ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>Save Changes</span>
                  </button>
                </form>
              </div>

              {/* Secure Password Change */}
              <div className="p-6 rounded-2xl bg-[#250529] border border-white/10 shadow-xl space-y-4">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>Change Password</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Update your Firebase Authentication password
                  </p>
                </div>

                {passwordMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      passwordMessage.type === 'success'
                        ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200'
                        : 'bg-red-950/80 border border-red-500/40 text-red-200'
                    }`}
                  >
                    {passwordMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span>{passwordMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleChangeAdminPassword} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isChangingPassword ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    ) : (
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>Update Password</span>
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 3: PORTFOLIO (CORPORATE EMPLOYEES & MILESTONES) */}
        {/* ======================================================================= */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 rounded-2xl bg-[#250529] border border-white/10 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Corporate Sales Representatives</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Manage corporate milestones, earned commissions, and target completion indices
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by ID, name, email..."
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 outline-none"
                    />
                  </div>

                  <button
                    onClick={loadCorporateData}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs flex items-center gap-1.5 cursor-pointer"
                    title="Reload data"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/30">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/60 text-zinc-400 font-mono uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3">Corporate ID</th>
                      <th className="px-4 py-3">Representative</th>
                      <th className="px-4 py-3">Designation / Location</th>
                      <th className="px-4 py-3">Sales Income (₹)</th>
                      <th className="px-4 py-3">Target Progress</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <span>Loading corporate records...</span>
                        </td>
                      </tr>
                    ) : filteredCorporateList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                          No corporate representatives found.
                        </td>
                      </tr>
                    ) : (
                      filteredCorporateList.map((item) => {
                        const isEditing = editingUid === item.uid;
                        return (
                          <tr key={item.uid} className="hover:bg-white/5 transition-colors">
                            {/* Corporate User ID */}
                            <td className="px-4 py-3.5 font-mono font-bold text-amber-300 whitespace-nowrap">
                              {item.corporateUserId || 'WDS-XXXX'}
                            </td>

                            {/* Representative */}
                            <td className="px-4 py-3.5">
                              <div className="font-bold text-white">{item.name}</div>
                              <div className="text-[11px] text-zinc-400 font-mono">{item.email}</div>
                              <div className="text-[10px] text-zinc-500 font-mono">{item.phone}</div>
                            </td>

                            {/* Role / Location */}
                            <td className="px-4 py-3.5">
                              <div className="text-zinc-200">{item.corporateRole || 'Sales Rep'}</div>
                              <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-amber-400" />
                                <span>{item.location || 'Pan-India'}</span>
                              </div>
                            </td>

                            {/* Income */}
                            <td className="px-4 py-3.5 font-mono">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={editIncome}
                                  onChange={(e) => setEditIncome(Number(e.target.value))}
                                  className="w-28 bg-black/60 border border-amber-500 rounded px-2 py-1 text-xs text-emerald-400 font-bold outline-none"
                                />
                              ) : (
                                <span className="font-bold text-emerald-400">
                                  ₹{(item.income || 0).toLocaleString('en-IN')}
                                </span>
                              )}
                            </td>

                            {/* Progress */}
                            <td className="px-4 py-3.5 font-mono">
                              {isEditing ? (
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={editProgress}
                                  onChange={(e) => setEditProgress(Number(e.target.value))}
                                  className="w-20 bg-black/60 border border-amber-500 rounded px-2 py-1 text-xs text-amber-400 font-bold outline-none"
                                />
                              ) : (
                                <div className="space-y-1">
                                  <span className="font-bold text-amber-400">{item.progress || 0}%</span>
                                  <div className="w-20 bg-white/10 rounded-full h-1 overflow-hidden">
                                    <div
                                      className="bg-amber-500 h-full rounded-full"
                                      style={{ width: `${Math.min(item.progress || 0, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                              {isEditing ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleSaveProgress(item.uid)}
                                    className="px-2.5 py-1 rounded bg-amber-500 text-black font-bold text-xs flex items-center gap-1 cursor-pointer"
                                  >
                                    <Save className="w-3 h-3" />
                                    <span>Save</span>
                                  </button>
                                  <button
                                    onClick={() => setEditingUid(null)}
                                    className="px-2.5 py-1 rounded bg-white/10 text-zinc-300 text-xs cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleStartEdit(item)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-amber-400 transition-colors cursor-pointer"
                                  title="Edit Income and Target Progress"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 4: CORPORATE REGISTRATION (ADMIN ONLY) */}
        {/* ======================================================================= */}
        {activeTab === 'corporate-registration' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Success modal after user created */}
            {createdUser && (
              <div className="p-6 rounded-2xl bg-[#1e2f1e] border border-emerald-500/50 shadow-2xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-white">Corporate Account Provisioned Successfully</h4>
                      <p className="text-xs text-zinc-300">The Admin active session remains uninterrupted.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCreatedUser(null)}
                    className="p-1.5 rounded-lg bg-white/10 text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-400 block">Generated Corporate User ID:</span>
                    <span className="font-mono text-base font-bold text-amber-300">{createdUser.corporateUserId}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Representative Name:</span>
                    <span className="font-bold text-white">{createdUser.name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Login Email (Used for Login):</span>
                    <span className="font-mono text-zinc-200">{createdUser.email}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Temporary Password:</span>
                    <span className="font-mono text-amber-400 font-bold">{createdUser.password}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={copyCreatedCredentials}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedNotification ? 'Credentials Copied!' : 'Copy Credentials to Clipboard'}</span>
                  </button>

                  <button
                    onClick={() => setCreatedUser(null)}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-[#250529] border border-white/10 shadow-xl space-y-6">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <span>Register New Corporate Sales Representative</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Provisions a new Firebase Auth account and generates a unique WDS-XXXX Corporate ID
                </p>
              </div>

              {regError && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleCorporateRegistration} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Contact Phone *</label>
                    <input
                      type="text"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Official Email *</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="rahul.sharma@waltdesigns.com"
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Initial Password *</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Designation Role</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full bg-[#1b031e] border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    >
                      <option value="Asst. Sales Manager">Asst. Sales Manager</option>
                      <option value="Senior Sales Manager">Senior Sales Manager</option>
                      <option value="Corporate Sales Executive">Corporate Sales Executive</option>
                      <option value="Enterprise Consultant">Enterprise Consultant</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Territory / Location</label>
                    <input
                      type="text"
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      placeholder="e.g. Delhi NCR Region"
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Initial Sales Income (₹)</label>
                    <input
                      type="number"
                      value={regIncome}
                      onChange={(e) => setRegIncome(Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Initial Target Progress (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={regProgress}
                      onChange={(e) => setRegProgress(Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isRegistering ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Provisioning Corporate Account...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Create Corporate Account</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 5: ATTENDANCE (ADMIN MANAGEMENT & APPROVALS) */}
        {/* ======================================================================= */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 rounded-2xl bg-[#250529] border border-white/10 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Employee Attendance Management</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Review submitted daily logs and approve or reject attendance records
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
                    <button
                      onClick={() => setAttendanceFilter('all')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        attendanceFilter === 'all' ? 'bg-amber-500 text-black' : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      All ({attendanceList.length})
                    </button>
                    <button
                      onClick={() => setAttendanceFilter('pending')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        attendanceFilter === 'pending' ? 'bg-amber-500 text-black' : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      Pending ({pendingAttendanceCount})
                    </button>
                    <button
                      onClick={() => setAttendanceFilter('approved')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        attendanceFilter === 'approved' ? 'bg-amber-500 text-black' : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      Approved
                    </button>
                    <button
                      onClick={() => setAttendanceFilter('rejected')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        attendanceFilter === 'rejected' ? 'bg-amber-500 text-black' : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      Rejected
                    </button>
                  </div>

                  <button
                    onClick={loadAttendanceData}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs flex items-center gap-1 cursor-pointer"
                    title="Refresh attendance records"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingAttendance ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/30">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/60 text-zinc-400 font-mono uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3">Employee Code</th>
                      <th className="px-4 py-3">Employee Name</th>
                      <th className="px-4 py-3">Attendance Date</th>
                      <th className="px-4 py-3">Work Hours</th>
                      <th className="px-4 py-3">Expected Clients</th>
                      <th className="px-4 py-3">Submission Timestamp</th>
                      <th className="px-4 py-3">Current Status</th>
                      <th className="px-4 py-3 text-right">Approval Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loadingAttendance ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-zinc-400">
                          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <span>Loading attendance submissions...</span>
                        </td>
                      </tr>
                    ) : filteredAttendanceList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-zinc-400">
                          No attendance records found matching this filter.
                        </td>
                      </tr>
                    ) : (
                      filteredAttendanceList.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          {/* Employee Code */}
                          <td className="px-4 py-3.5 font-mono font-bold text-amber-300 whitespace-nowrap">
                            {item.employeeCode}
                          </td>

                          {/* Employee Name */}
                          <td className="px-4 py-3.5 font-semibold text-white">
                            {item.employeeName}
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3.5 font-mono text-zinc-200">
                            {item.date}
                          </td>

                          {/* Work Hours */}
                          <td className="px-4 py-3.5 font-mono text-zinc-300">
                            {item.todayWorkHours} Hours
                          </td>

                          {/* Expected Clients */}
                          <td className="px-4 py-3.5 font-mono text-zinc-300">
                            {item.expectedClients} Clients
                          </td>

                          {/* Submission Date */}
                          <td className="px-4 py-3.5 font-mono text-[11px] text-zinc-400">
                            {item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                          </td>

                          {/* Current Status */}
                          <td className="px-4 py-3.5">
                            {item.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 border border-amber-500/40 text-amber-300">
                                <Clock className="w-3 h-3 animate-pulse" />
                                <span>Pending</span>
                              </span>
                            )}
                            {item.status === 'approved' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Approved</span>
                              </span>
                            )}
                            {item.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-500/20 border border-red-500/40 text-red-300">
                                <XCircle className="w-3 h-3" />
                                <span>Rejected</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            {item.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleUpdateAttendanceStatus(item.id, 'approved')}
                                  disabled={attendanceActionId === item.id}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Approve</span>
                                </button>

                                <button
                                  onClick={() => handleUpdateAttendanceStatus(item.id, 'rejected')}
                                  disabled={attendanceActionId === item.id}
                                  className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
                                >
                                  <X className="w-3 h-3" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 border border-white/10 text-zinc-400">
                                <Lock className="w-3 h-3 text-zinc-500" />
                                <span>Finalized</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 6: DAILY DATA REPORT (ADMIN ENTRY & EMPLOYEE ASSIGNMENT) */}
        {/* ======================================================================= */}
        {activeTab === 'daily-report' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header / Intro Card */}
            <div className="p-6 rounded-2xl bg-[#250529] border border-amber-500/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                    <span>Daily Data Report Hub</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Create client lead reports and assign them directly to verified Corporate employees
                  </p>
                </div>

                <button
                  onClick={loadDailyReports}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto border border-white/10"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingDailyReports ? 'animate-spin' : ''}`} />
                  <span>Refresh Reports</span>
                </button>
              </div>

              {/* Create Report Form Card */}
              <div className="p-5 rounded-xl bg-black/40 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Plus className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Create New Daily Data Report
                  </h4>
                </div>

                {reportFormError && (
                  <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{reportFormError}</span>
                  </div>
                )}

                <form onSubmit={handleCreateDailyReportSubmit} className="space-y-4">
                  {/* Mandatory Employee Selection */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                    <label className="text-xs font-bold text-amber-300 flex items-center justify-between">
                      <span>Select Employee (MANDATORY) *</span>
                      <span className="text-[10px] font-normal text-amber-400">
                        {corporateList.length} Active Corporate Representatives Available
                      </span>
                    </label>
                    <select
                      required
                      value={selectedEmployeeUid}
                      onChange={(e) => setSelectedEmployeeUid(e.target.value)}
                      className="w-full bg-[#1e0524] border border-amber-500/50 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-medium cursor-pointer"
                    >
                      <option value="">-- Select Active Corporate Employee (Mandatory) * --</option>
                      {corporateList.map((emp) => (
                        <option key={emp.uid} value={emp.uid}>
                          {emp.name} ({emp.corporateUserId || 'WDS-ACTIVE'}) • {emp.corporateRole || 'Sales'} • {emp.location || 'Corporate'}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-zinc-400">
                      The report will be tied to this employee's unique Firebase UID and will only be visible in their portal.
                    </p>
                  </div>

                  {/* Report Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {/* S.No */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300">S.No (Optional / Auto)</label>
                      <input
                        type="text"
                        value={reportSNo}
                        onChange={(e) => setReportSNo(e.target.value)}
                        placeholder={`e.g. ${dailyReportList.length + 1}`}
                        className="w-full bg-black/50 border border-white/15 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                      />
                    </div>

                    {/* Client Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300">Client / Lead Name *</label>
                      <input
                        type="text"
                        required
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                        placeholder="e.g. Acme Retail Enterprises"
                        className="w-full bg-black/50 border border-white/15 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={reportEmail}
                        onChange={(e) => setReportEmail(e.target.value)}
                        placeholder="client@example.com"
                        className="w-full bg-black/50 border border-white/15 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300">Contact Number *</label>
                      <input
                        type="tel"
                        required
                        value={reportNumber}
                        onChange={(e) => setReportNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-black/50 border border-white/15 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300">Location / City *</label>
                      <input
                        type="text"
                        required
                        value={reportLocation}
                        onChange={(e) => setReportLocation(e.target.value)}
                        placeholder="e.g. Connaught Place, New Delhi"
                        className="w-full bg-black/50 border border-white/15 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    {/* Initial Status */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300">Lead Status</label>
                      <select
                        value={reportStatus}
                        onChange={(e) => setReportStatus(e.target.value)}
                        className="w-full bg-[#1e0524] border border-white/15 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      >
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Meeting Scheduled">Meeting Scheduled</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Closed / Won">Closed / Won</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                  </div>

                  {/* Requirement Details */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Design / Business Requirement *</label>
                    <textarea
                      required
                      rows={2}
                      value={reportRequirement}
                      onChange={(e) => setReportRequirement(e.target.value)}
                      placeholder="e.g. Complete luxury corporate branding, 3D interior renders, and full packaging kit for new flagship branch."
                      className="w-full bg-black/50 border border-white/15 focus:border-amber-500 rounded-xl p-3 text-xs text-white outline-none resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isCreatingReport}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isCreatingReport ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Assigning Report...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Save & Assign Daily Data Report</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Data Reports List & Filter */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      All Daily Data Reports ({dailyReportList.length})
                    </h4>
                  </div>

                  {/* Search and Employee Filter */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Search */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={reportSearchQuery}
                        onChange={(e) => setReportSearchQuery(e.target.value)}
                        placeholder="Search name, requirement..."
                        className="pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-amber-500 outline-none w-48"
                      />
                    </div>

                    {/* Employee Filter */}
                    <select
                      value={reportFilterEmployee}
                      onChange={(e) => setReportFilterEmployee(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-zinc-200 outline-none"
                    >
                      <option value="all">All Assigned Employees</option>
                      {corporateList.map((emp) => (
                        <option key={emp.uid} value={emp.uid}>
                          {emp.name} ({emp.corporateUserId})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Reports Table */}
                <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/30">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/60 text-zinc-400 font-mono uppercase text-[10px] border-b border-white/10">
                      <tr>
                        <th className="px-3.5 py-3">S.No</th>
                        <th className="px-3.5 py-3">Client Name</th>
                        <th className="px-3.5 py-3">Email</th>
                        <th className="px-3.5 py-3">Number</th>
                        <th className="px-3.5 py-3">Location</th>
                        <th className="px-3.5 py-3">Requirement</th>
                        <th className="px-3.5 py-3">Assigned Employee</th>
                        <th className="px-3.5 py-3">Status</th>
                        <th className="px-3.5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loadingDailyReports ? (
                        <tr>
                          <td colSpan={9} className="px-4 py-8 text-center text-zinc-400">
                            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            <span>Loading Daily Data Reports...</span>
                          </td>
                        </tr>
                      ) : dailyReportList.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-4 py-8 text-center text-zinc-400">
                            No daily data reports created yet. Use the form above to assign your first report.
                          </td>
                        </tr>
                      ) : (
                        dailyReportList
                          .filter((item) => {
                            const matchesEmp =
                              reportFilterEmployee === 'all' || item.assignedEmployeeUid === reportFilterEmployee;
                            const q = reportSearchQuery.toLowerCase().trim();
                            const matchesSearch =
                              !q ||
                              item.name.toLowerCase().includes(q) ||
                              item.email.toLowerCase().includes(q) ||
                              item.number.toLowerCase().includes(q) ||
                              item.location.toLowerCase().includes(q) ||
                              item.requirement.toLowerCase().includes(q) ||
                              item.assignedEmployeeName.toLowerCase().includes(q) ||
                              item.assignedEmployeeCode.toLowerCase().includes(q) ||
                              String(item.sNo).toLowerCase().includes(q);
                            return matchesEmp && matchesSearch;
                          })
                          .map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                              {/* S.No */}
                              <td className="px-3.5 py-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                                #{item.sNo}
                              </td>

                              {/* Client Name */}
                              <td className="px-3.5 py-3 font-semibold text-white">
                                {item.name}
                              </td>

                              {/* Email */}
                              <td className="px-3.5 py-3 font-mono text-zinc-300">
                                {item.email}
                              </td>

                              {/* Number */}
                              <td className="px-3.5 py-3 font-mono text-zinc-300 whitespace-nowrap">
                                {item.number}
                              </td>

                              {/* Location */}
                              <td className="px-3.5 py-3 text-zinc-300">
                                {item.location}
                              </td>

                              {/* Requirement */}
                              <td className="px-3.5 py-3 text-zinc-200 max-w-xs truncate" title={item.requirement}>
                                {item.requirement}
                              </td>

                              {/* Assigned Employee */}
                              <td className="px-3.5 py-3 whitespace-nowrap">
                                <div className="font-semibold text-white">{item.assignedEmployeeName}</div>
                                <div className="text-[10px] font-mono text-amber-300">{item.assignedEmployeeCode}</div>
                              </td>

                              {/* Status with Quick Change */}
                              <td className="px-3.5 py-3 whitespace-nowrap">
                                <select
                                  value={item.status}
                                  onChange={(e) => handleUpdateReportStatus(item.id, e.target.value)}
                                  disabled={reportActionId === item.id}
                                  className="bg-black/50 border border-white/20 rounded-lg px-2 py-1 text-[11px] font-semibold text-amber-300 outline-none cursor-pointer hover:border-amber-500"
                                >
                                  <option value="Assigned">Assigned</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Meeting Scheduled">Meeting Scheduled</option>
                                  <option value="Proposal Sent">Proposal Sent</option>
                                  <option value="Closed / Won">Closed / Won</option>
                                  <option value="Pending">Pending</option>
                                </select>
                              </td>

                              {/* Actions */}
                              <td className="px-3.5 py-3 text-right whitespace-nowrap">
                                <button
                                  onClick={() => handleDeleteReport(item.id)}
                                  disabled={reportActionId === item.id}
                                  className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs transition-colors cursor-pointer disabled:opacity-50"
                                  title="Delete Report"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
