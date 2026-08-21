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
  Eye,
  EyeOff,
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

  // Admin Change Password State & Password Visibility
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  const [showRegPassword, setShowRegPassword] = useState(false);
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
    <div className="min-h-screen bg-[#FDF2F4] text-zinc-900 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      
      {/* ========================================================================= */}
      {/* PURPLE HEADER */}
      {/* ========================================================================= */}
      <header className="bg-[#3B0764] text-white border-b border-purple-900 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* Admin Brand & Operations Identity */}
            <div className="flex items-center gap-3">
              <img
                src={AGENCY_INFO.logoUrl}
                alt="Walt Designs & Studio"
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-pink-400/50 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-white tracking-tight">
                    Walt Designs & Studio
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-500 text-white uppercase tracking-wider shadow-sm">
                    Admin IT Hub
                  </span>
                </div>
                <p className="text-xs text-purple-200 font-mono hidden sm:block">
                  Admin User ID: <span className="text-amber-300 font-bold">{profile?.adminUserId || 'ADM-PRIMARY'}</span> • {user?.email}
                </p>
              </div>
            </div>

            {/* Admin Header Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-700/60 text-xs font-mono text-purple-200">
                <Terminal className="w-3.5 h-3.5 text-pink-400" />
                <span>IT & Data Operations</span>
              </div>

              <button
                onClick={() => logout()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

          </div>
        </div>

        {/* ADMIN DASHBOARD NAVIGATION TABS ON PURPLE HEADER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-purple-800/80 overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-2 py-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-pink-500 text-white shadow-md font-extrabold'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-pink-500 text-white shadow-md font-extrabold'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'portfolio'
                  ? 'bg-pink-500 text-white shadow-md font-extrabold'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Portfolio</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'portfolio' ? 'bg-purple-950 text-pink-300' : 'bg-purple-800 text-white'
              }`}>
                {corporateList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('corporate-registration')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'corporate-registration'
                  ? 'bg-pink-500 text-white shadow-md font-extrabold'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Corporate Registration</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'attendance'
                  ? 'bg-pink-500 text-white shadow-md font-extrabold'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Attendance</span>
              {pendingAttendanceCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-purple-950 animate-pulse">
                  {pendingAttendanceCount} Pending
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('daily-report')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'daily-report'
                  ? 'bg-pink-500 text-white shadow-md font-extrabold'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Daily Data Report</span>
              {dailyReportList.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'daily-report' ? 'bg-purple-950 text-pink-300' : 'bg-purple-800 text-white'
                }`}>
                  {dailyReportList.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* BABY PINK ADMIN DASHBOARD BODY */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Global Toast for Success */}
        {updateSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-md animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{updateSuccess}</span>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 1: DASHBOARD (BABY PINK BG & CLEAN WHITE/PINK CARDS) */}
        {/* ======================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Welcome Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-pink-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-pink-100 text-purple-950 uppercase tracking-wider border border-pink-300">
                    Master Administrator
                  </span>
                  <span className="text-xs font-mono font-bold text-pink-700">
                    ID: {profile?.adminUserId || 'ADM-PRIMARY'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 tracking-tight">
                  Welcome back, {profile?.name || 'Administrator'}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl">
                  Walt Designs & Studio operational oversight node. Manage corporate sales forces, verify employee attendance records, and assign daily data reports.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('corporate-registration')}
                  className="px-4 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-pink-300" />
                  <span>Register Corporate User</span>
                </button>
                <button
                  onClick={() => setActiveTab('daily-report')}
                  className="px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-white" />
                  <span>Daily Data Report</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-pink-200 shadow-sm">
                <div className="flex items-center justify-between text-zinc-500 text-xs font-bold mb-2">
                  <span>Corporate Reps</span>
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-3xl font-extrabold text-purple-950 font-mono">
                  {corporateList.length}
                </div>
                <span className="text-[11px] text-pink-700 font-medium mt-1 block">Active sales team members</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-pink-200 shadow-sm">
                <div className="flex items-center justify-between text-zinc-500 text-xs font-bold mb-2">
                  <span>Cumulative Sales</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-700 font-mono">
                  ₹{totalFleetIncome.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 block">Fleet income tracked</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-pink-200 shadow-sm">
                <div className="flex items-center justify-between text-zinc-500 text-xs font-bold mb-2">
                  <span>Pending Attendance</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-3xl font-extrabold text-amber-600 font-mono">
                  {pendingAttendanceCount}
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 block">Awaiting admin review</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-pink-200 shadow-sm">
                <div className="flex items-center justify-between text-zinc-500 text-xs font-bold mb-2">
                  <span>Daily Data Reports</span>
                  <FileSpreadsheet className="w-4 h-4 text-pink-500" />
                </div>
                <div className="text-3xl font-extrabold text-pink-600 font-mono">
                  {dailyReportList.length}
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 block">Total client lead records</span>
              </div>
            </div>

            {/* Quick Actions / Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                onClick={() => setActiveTab('corporate-registration')}
                className="p-6 rounded-2xl bg-white border border-pink-200 hover:border-pink-400 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-purple-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-purple-950">Add Corporate Representative</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Provision new employee accounts and generate unique WDS Corporate IDs with initial target quotas.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('attendance')}
                className="p-6 rounded-2xl bg-white border border-pink-200 hover:border-pink-400 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-purple-950">Verify Daily Attendance</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Review logged work hours, examine reported expected clients, and approve or reject submissions permanently.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('daily-report')}
                className="p-6 rounded-2xl bg-white border border-pink-200 hover:border-pink-400 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-purple-950">Daily Data Report Hub</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Create daily lead reports and assign client requirements to specific sales employees with tracking.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 2: MY PROFILE (BABY PINK BG) */}
        {/* ======================================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Admin Profile Overview */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-pink-200 shadow-md space-y-5">
                <div>
                  <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-pink-600" />
                    <span>Administrator Identity</span>
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Root administrative authority credentials
                  </p>
                </div>

                <div className="space-y-3 text-xs divide-y divide-pink-100 font-sans">
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-500">Admin User ID</span>
                    <span className="font-mono font-bold text-purple-950">{profile?.adminUserId || 'ADM-PRIMARY'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-500">Authority Role</span>
                    <span className="font-bold text-purple-900">Master Agency Administrator</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-500">Full Name</span>
                    <span className="font-bold text-zinc-900">{profile?.name || 'Administrator'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-500">Login Email</span>
                    <span className="font-mono text-zinc-900 truncate max-w-[160px]">{user?.email}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-500">Contact Phone</span>
                    <span className="font-mono text-zinc-900">{profile?.phone || '—'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-500">Security UID</span>
                    <span className="font-mono text-[10px] text-zinc-400 truncate max-w-[140px]">{user?.uid}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200 text-[11px] text-pink-900 space-y-1">
                  <span className="font-bold text-purple-950 block">Administrator Privilege Notice:</span>
                  <span>You have root privileges to provision corporate accounts, review attendance, and assign client lead reports.</span>
                </div>
              </div>

              {/* Edit Admin Contact Info */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-pink-200 shadow-md space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-pink-600" />
                    <span>Edit Profile Details</span>
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Update your official display name and contact phone
                  </p>
                </div>

                {profileMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      profileMessage.type === 'success'
                        ? 'bg-emerald-100 border border-emerald-400 text-emerald-900 font-medium'
                        : 'bg-red-100 border border-red-400 text-red-900 font-medium'
                    }`}
                  >
                    {profileMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-700" />
                    )}
                    <span>{profileMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleSaveAdminProfile} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Display Name</label>
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="e.g. Priyanshu Kumar"
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Contact Phone</label>
                    <input
                      type="text"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      placeholder="+91 8276825128"
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="w-full py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingProfile ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5 text-pink-300" />
                    )}
                    <span>Save Administrator Profile</span>
                  </button>
                </form>
              </div>

              {/* Change Admin Password with Hide / Unhide Toggle */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-pink-200 shadow-md space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-pink-600" />
                    <span>Change Password</span>
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Update your Firebase Authentication password
                  </p>
                </div>

                {passwordMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      passwordMessage.type === 'success'
                        ? 'bg-emerald-100 border border-emerald-400 text-emerald-900 font-medium'
                        : 'bg-red-100 border border-red-400 text-red-900 font-medium'
                    }`}
                  >
                    {passwordMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-700" />
                    )}
                    <span>{passwordMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleChangeAdminPassword} className="space-y-3">
                  {/* Current Password with Hide/Unhide */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl pl-3.5 pr-10 py-2 text-xs text-zinc-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 cursor-pointer p-1"
                        title={showCurrentPassword ? 'Hide password' : 'Show password'}
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password with Hide/Unhide */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl pl-3.5 pr-10 py-2 text-xs text-zinc-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 cursor-pointer p-1"
                        title={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password with Hide/Unhide */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl pl-3.5 pr-10 py-2 text-xs text-zinc-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 cursor-pointer p-1"
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isChangingPassword ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <KeyRound className="w-3.5 h-3.5 text-pink-300" />
                    )}
                    <span>Update Password</span>
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 3: PORTFOLIO (CORPORATE EMPLOYEES & MILESTONES) (BABY PINK BG) */}
        {/* ======================================================================= */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-pink-200 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-pink-600" />
                    <span>Corporate Sales Representatives</span>
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
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
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none shadow-xs"
                    />
                  </div>

                  <button
                    onClick={loadCorporateData}
                    className="p-2 px-3 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-purple-950 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Reload data"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-pink-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-pink-100/90 text-purple-950 font-mono uppercase text-[10px] font-bold border-b border-pink-200">
                    <tr>
                      <th className="px-4 py-3">Corporate ID</th>
                      <th className="px-4 py-3">Representative</th>
                      <th className="px-4 py-3">Designation / Location</th>
                      <th className="px-4 py-3">Sales Income (₹)</th>
                      <th className="px-4 py-3">Target Progress</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                          <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <span>Loading corporate records...</span>
                        </td>
                      </tr>
                    ) : filteredCorporateList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                          No corporate representatives found.
                        </td>
                      </tr>
                    ) : (
                      filteredCorporateList.map((item) => {
                        const isEditing = editingUid === item.uid;

                        return (
                          <tr key={item.uid} className="hover:bg-pink-50/80 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-purple-950 whitespace-nowrap">
                              {item.corporateUserId || 'WDS-XXXX'}
                            </td>

                            <td className="px-4 py-3">
                              <div className="font-bold text-zinc-900">{item.name}</div>
                              <div className="text-[11px] font-mono text-zinc-500 truncate max-w-[150px]">
                                {item.email}
                              </div>
                            </td>

                            <td className="px-4 py-3">
                              <div className="text-zinc-800 font-medium">{item.corporateRole || 'Sales Rep'}</div>
                              <div className="text-[11px] text-zinc-500">{item.location || 'Pan-India'}</div>
                            </td>

                            <td className="px-4 py-3">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={editIncome}
                                  onChange={(e) => setEditIncome(Number(e.target.value))}
                                  className="w-28 bg-white border border-pink-400 rounded-lg px-2 py-1 text-xs text-zinc-900 font-mono"
                                />
                              ) : (
                                <span className="font-mono font-bold text-emerald-700">
                                  ₹{(item.income || 0).toLocaleString('en-IN')}
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3">
                              {isEditing ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={editProgress}
                                    onChange={(e) => setEditProgress(Number(e.target.value))}
                                    className="w-16 bg-white border border-pink-400 rounded-lg px-2 py-1 text-xs text-zinc-900 font-mono"
                                  />
                                  <span className="text-xs text-zinc-500">%</span>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <span className="font-mono font-bold text-purple-900">
                                    {item.progress || 0}%
                                  </span>
                                  <div className="w-24 bg-pink-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className="bg-pink-500 h-full rounded-full"
                                      style={{ width: `${Math.min(item.progress || 0, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </td>

                            <td className="px-4 py-3 text-right">
                              {isEditing ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleSaveProgress(item.uid)}
                                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Save</span>
                                  </button>
                                  <button
                                    onClick={() => setEditingUid(null)}
                                    className="p-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Cancel</span>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleStartEdit(item)}
                                  className="p-1.5 px-2.5 rounded-lg bg-pink-100 hover:bg-pink-200 text-purple-950 text-xs font-bold flex items-center gap-1 ml-auto cursor-pointer shadow-xs"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
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
        {/* TAB 4: CORPORATE REGISTRATION (ADMIN ONLY) (BABY PINK BG) */}
        {/* ======================================================================= */}
        {activeTab === 'corporate-registration' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Success modal after user created */}
            {createdUser && (
              <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-400 shadow-xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-200 border border-emerald-400 flex items-center justify-center text-emerald-800">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-emerald-950">Corporate Account Provisioned Successfully</h4>
                      <p className="text-xs text-emerald-800">The Admin active session remains uninterrupted.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCreatedUser(null)}
                    className="p-1.5 rounded-lg bg-emerald-200 hover:bg-emerald-300 text-emerald-900 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-emerald-300 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-500 block">Generated Corporate User ID:</span>
                    <span className="font-mono text-base font-bold text-purple-950">{createdUser.corporateUserId}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Representative Name:</span>
                    <span className="font-bold text-zinc-900">{createdUser.name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Login Email (Used for Login):</span>
                    <span className="font-mono text-zinc-800">{createdUser.email}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Temporary Password:</span>
                    <span className="font-mono text-purple-900 font-bold">{createdUser.password}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={copyCreatedCredentials}
                    className="px-4 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Copy className="w-3.5 h-3.5 text-pink-300" />
                    <span>{copiedNotification ? 'Credentials Copied!' : 'Copy Credentials to Clipboard'}</span>
                  </button>

                  <button
                    onClick={() => setCreatedUser(null)}
                    className="text-xs text-zinc-600 hover:text-zinc-900 font-medium cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Registration Form with Password Hide/Unhide */}
            <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border-2 border-pink-200 shadow-md space-y-6">
              <div>
                <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-pink-600" />
                  <span>Register New Corporate Sales Representative</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Provisions a new Firebase Auth account and generates a unique WDS-XXXX Corporate ID
                </p>
              </div>

              {regError && (
                <div className="p-3 rounded-xl bg-red-100 border border-red-400 text-red-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleCorporateRegistration} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Contact Phone *</label>
                    <input
                      type="text"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Official Email *</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="rahul.sharma@waltdesigns.com"
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  {/* Initial Password with Hide/Unhide */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Initial Password *</label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-zinc-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 cursor-pointer p-1"
                        title={showRegPassword ? 'Hide password' : 'Show password'}
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Designation Role</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none"
                    >
                      <option value="Asst. Sales Manager">Asst. Sales Manager</option>
                      <option value="Senior Sales Manager">Senior Sales Manager</option>
                      <option value="Corporate Sales Executive">Corporate Sales Executive</option>
                      <option value="Enterprise Consultant">Enterprise Consultant</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Territory / Location</label>
                    <input
                      type="text"
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      placeholder="e.g. Delhi NCR Region"
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Initial Sales Income (₹)</label>
                    <input
                      type="number"
                      value={regIncome}
                      onChange={(e) => setRegIncome(Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Initial Target Progress (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={regProgress}
                      onChange={(e) => setRegProgress(Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full py-3 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isRegistering ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-pink-300" />
                  ) : (
                    <UserPlus className="w-4 h-4 text-pink-300" />
                  )}
                  <span>{isRegistering ? 'Provisioning Account...' : 'Provision Corporate Account'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 5: ATTENDANCE (BABY PINK BG) */}
        {/* ======================================================================= */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-pink-200 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-pink-600" />
                    <span>Corporate Attendance Logs</span>
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Review and finalize attendance records. Decisions once submitted are permanent.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-pink-50 p-1 rounded-xl border border-pink-200 text-xs">
                    <button
                      onClick={() => setAttendanceFilter('all')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        attendanceFilter === 'all' ? 'bg-purple-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      All ({attendanceList.length})
                    </button>
                    <button
                      onClick={() => setAttendanceFilter('pending')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        attendanceFilter === 'pending' ? 'bg-amber-500 text-black shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      Pending ({pendingAttendanceCount})
                    </button>
                    <button
                      onClick={() => setAttendanceFilter('approved')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        attendanceFilter === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      Approved
                    </button>
                    <button
                      onClick={() => setAttendanceFilter('rejected')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        attendanceFilter === 'rejected' ? 'bg-red-600 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      Rejected
                    </button>
                  </div>

                  <button
                    onClick={loadAttendanceData}
                    className="p-2 px-3 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-purple-950 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingAttendance ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto rounded-2xl border border-pink-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-pink-100/90 text-purple-950 font-mono uppercase text-[10px] font-bold border-b border-pink-200">
                    <tr>
                      <th className="px-4 py-3">Employee Code / Name</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Work Hours</th>
                      <th className="px-4 py-3">Expected Clients</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Approval Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100">
                    {loadingAttendance ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                          <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <span>Loading attendance logs...</span>
                        </td>
                      </tr>
                    ) : filteredAttendanceList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                          No attendance records found matching this filter.
                        </td>
                      </tr>
                    ) : (
                      filteredAttendanceList.map((item) => {
                        const isActioning = attendanceActionId === item.id;
                        const isFinalized = item.status === 'approved' || item.status === 'rejected';

                        return (
                          <tr key={item.id} className="hover:bg-pink-50/80 transition-colors">
                            <td className="px-4 py-3">
                              <div className="font-mono font-bold text-purple-950">{item.employeeCode}</div>
                              <div className="text-[11px] text-zinc-600 font-medium">{item.employeeName || 'Corporate Rep'}</div>
                            </td>

                            <td className="px-4 py-3 font-mono text-zinc-900 font-semibold whitespace-nowrap">
                              {item.date}
                            </td>

                            <td className="px-4 py-3 font-mono text-zinc-800">
                              {item.todayWorkHours} Hours
                            </td>

                            <td className="px-4 py-3 font-mono text-zinc-800">
                              {item.expectedClients} Clients
                            </td>

                            <td className="px-4 py-3 whitespace-nowrap">
                              {item.status === 'pending' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 border border-amber-300 text-amber-900">
                                  <Clock className="w-3 h-3 text-amber-700 animate-pulse" />
                                  <span>Pending Review</span>
                                </span>
                              )}
                              {item.status === 'approved' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 border border-emerald-300 text-emerald-900">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                  <span>Approved</span>
                                </span>
                              )}
                              {item.status === 'rejected' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 border border-red-300 text-red-900">
                                  <XCircle className="w-3 h-3 text-red-700" />
                                  <span>Rejected</span>
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3 text-right">
                              {isFinalized ? (
                                <span className="text-[11px] font-mono font-bold text-zinc-400 italic">
                                  Decision Finalized
                                </span>
                              ) : (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleUpdateAttendanceStatus(item.id, 'approved')}
                                    disabled={isActioning}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer disabled:opacity-50"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Approve</span>
                                  </button>

                                  <button
                                    onClick={() => handleUpdateAttendanceStatus(item.id, 'rejected')}
                                    disabled={isActioning}
                                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer disabled:opacity-50"
                                  >
                                    <X className="w-3 h-3" />
                                    <span>Reject</span>
                                  </button>
                                </div>
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
        {/* TAB 6: DAILY DATA REPORT (BABY PINK BG) */}
        {/* ======================================================================= */}
        {activeTab === 'daily-report' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Create Daily Report Form Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-pink-200 shadow-md space-y-6">
              <div>
                <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-pink-600" />
                  <span>Create Daily Data Report (Assign to Corporate Rep)</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Input incoming client data and assign the task to an employee. Employee selection is mandatory.
                </p>
              </div>

              {reportFormError && (
                <div className="p-3.5 rounded-2xl bg-red-100 border border-red-400 text-red-900 text-xs flex items-start gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <span>{reportFormError}</span>
                </div>
              )}

              <form onSubmit={handleCreateDailyReportSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Assign To Employee *</label>
                    <select
                      required
                      value={selectedEmployeeUid}
                      onChange={(e) => setSelectedEmployeeUid(e.target.value)}
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none"
                    >
                      <option value="">-- Select Corporate Employee --</option>
                      {corporateList.map((emp) => (
                        <option key={emp.uid} value={emp.uid}>
                          {emp.name} ({emp.corporateUserId || 'WDS-CORP'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">S.No (Optional)</label>
                    <input
                      type="text"
                      value={reportSNo}
                      onChange={(e) => setReportSNo(e.target.value)}
                      placeholder={`Auto: #${dailyReportList.length + 1}`}
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Client Name *</label>
                    <input
                      type="text"
                      required
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      placeholder="e.g. Amit Kumar"
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Client Email *</label>
                    <input
                      type="email"
                      required
                      value={reportEmail}
                      onChange={(e) => setReportEmail(e.target.value)}
                      placeholder="client@company.in"
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Contact Number *</label>
                    <input
                      type="text"
                      required
                      value={reportNumber}
                      onChange={(e) => setReportNumber(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Client Location *</label>
                    <input
                      type="text"
                      required
                      value={reportLocation}
                      onChange={(e) => setReportLocation(e.target.value)}
                      placeholder="e.g. Noida / New Delhi"
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Client Requirement / Brief *</label>
                    <textarea
                      required
                      rows={2}
                      value={reportRequirement}
                      onChange={(e) => setReportRequirement(e.target.value)}
                      placeholder="e.g. Looking for e-commerce website redesign with custom payment gateway integration and fast delivery."
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Report Status</label>
                    <select
                      value={reportStatus}
                      onChange={(e) => setReportStatus(e.target.value)}
                      className="w-full bg-white border border-pink-300 focus:border-purple-600 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none"
                    >
                      <option value="Assigned">Assigned</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Discussion in Progress">Discussion in Progress</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Converted">Converted</option>
                      <option value="Closed / Not Interested">Closed / Not Interested</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isCreatingReport}
                    className="px-6 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isCreatingReport ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-pink-300" />
                    ) : (
                      <Send className="w-3.5 h-3.5 text-pink-300" />
                    )}
                    <span>{isCreatingReport ? 'Creating & Assigning...' : 'Create & Assign Daily Report'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* List & Search Assigned Daily Data Reports */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-pink-200 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-pink-600" />
                    <span>All Daily Data Reports & Assigned Leads</span>
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Track client requirement fulfillment and update status directly
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={reportSearchQuery}
                      onChange={(e) => setReportSearchQuery(e.target.value)}
                      placeholder="Search client, location..."
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-pink-300 text-xs text-zinc-900 focus:border-purple-600 outline-none w-44 shadow-xs"
                    />
                  </div>

                  <select
                    value={reportFilterEmployee}
                    onChange={(e) => setReportFilterEmployee(e.target.value)}
                    className="py-1.5 px-3 rounded-xl bg-white border border-pink-300 text-xs text-zinc-900 outline-none shadow-xs"
                  >
                    <option value="all">All Corporate Reps</option>
                    {corporateList.map((emp) => (
                      <option key={emp.uid} value={emp.uid}>
                        {emp.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={loadDailyReports}
                    className="p-2 px-3 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-purple-950 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingDailyReports ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-2xl border border-pink-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-pink-100/90 text-purple-950 font-mono uppercase text-[10px] font-bold border-b border-pink-200">
                    <tr>
                      <th className="px-3.5 py-3">S.No</th>
                      <th className="px-3.5 py-3">Assigned Rep</th>
                      <th className="px-3.5 py-3">Client Name</th>
                      <th className="px-3.5 py-3">Email</th>
                      <th className="px-3.5 py-3">Number</th>
                      <th className="px-3.5 py-3">Location</th>
                      <th className="px-3.5 py-3">Requirement</th>
                      <th className="px-3.5 py-3">Status</th>
                      <th className="px-3.5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100">
                    {loadingDailyReports ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-zinc-500">
                          <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <span>Loading daily reports...</span>
                        </td>
                      </tr>
                    ) : dailyReportList.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-zinc-500">
                          No Daily Data Reports created yet. Use the form above to add a client record.
                        </td>
                      </tr>
                    ) : (
                      dailyReportList
                        .filter((r) => {
                          const matchesEmployee = reportFilterEmployee === 'all' || r.assignedEmployeeUid === reportFilterEmployee;
                          const q = reportSearchQuery.toLowerCase().trim();
                          const matchesQuery =
                            !q ||
                            r.name.toLowerCase().includes(q) ||
                            r.email.toLowerCase().includes(q) ||
                            r.number.toLowerCase().includes(q) ||
                            r.location.toLowerCase().includes(q) ||
                            r.requirement.toLowerCase().includes(q) ||
                            String(r.sNo).toLowerCase().includes(q) ||
                            (r.assignedEmployeeName && r.assignedEmployeeName.toLowerCase().includes(q)) ||
                            (r.assignedEmployeeCode && r.assignedEmployeeCode.toLowerCase().includes(q));
                          return matchesEmployee && matchesQuery;
                        })
                        .map((report) => (
                          <tr key={report.id} className="hover:bg-pink-50/80 transition-colors">
                            <td className="px-3.5 py-3 font-mono font-bold text-purple-950 whitespace-nowrap">
                              #{report.sNo}
                            </td>

                            <td className="px-3.5 py-3">
                              <div className="font-bold text-zinc-900">{report.assignedEmployeeName}</div>
                              <div className="font-mono text-[10px] text-pink-700">{report.assignedEmployeeCode}</div>
                            </td>

                            <td className="px-3.5 py-3 font-bold text-zinc-900">
                              {report.name}
                            </td>

                            <td className="px-3.5 py-3 font-mono text-zinc-700">
                              {report.email}
                            </td>

                            <td className="px-3.5 py-3 font-mono text-zinc-700 whitespace-nowrap">
                              {report.number}
                            </td>

                            <td className="px-3.5 py-3 text-zinc-700">
                              {report.location}
                            </td>

                            <td className="px-3.5 py-3 text-zinc-800 max-w-xs" title={report.requirement}>
                              {report.requirement}
                            </td>

                            <td className="px-3.5 py-3 whitespace-nowrap">
                              <select
                                value={report.status}
                                onChange={(e) => handleUpdateReportStatus(report.id, e.target.value)}
                                className="bg-pink-50 border border-pink-300 rounded-lg px-2 py-1 text-[11px] font-bold text-purple-950 outline-none"
                              >
                                <option value="Assigned">Assigned</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Discussion in Progress">In Progress</option>
                                <option value="Proposal Sent">Proposal Sent</option>
                                <option value="Converted">Converted</option>
                                <option value="Closed / Not Interested">Closed</option>
                              </select>
                            </td>

                            <td className="px-3.5 py-3 text-right">
                              <button
                                onClick={() => handleDeleteReport(report.id)}
                                className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-xs transition-colors cursor-pointer"
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
        )}

      </main>
    </div>
  );
};
