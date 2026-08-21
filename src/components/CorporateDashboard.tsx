import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  Layers,
  Calendar,
  LogOut,
  Shield,
  TrendingUp,
  DollarSign,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  AlertCircle,
  KeyRound,
  Send,
  RefreshCw,
  Edit3,
  Save,
  FileText,
  Briefcase,
  XCircle,
  FileSpreadsheet,
  Search,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth, AttendanceRecord, DailyReportItem } from '../context/AuthContext';
import { AGENCY_INFO, DIVISIONS } from '../data/agencyData';

type CorporateTab = 'dashboard' | 'profile' | 'portfolio' | 'attendance' | 'data-report';

export const CorporateDashboard: React.FC = () => {
  const {
    user,
    profile,
    logout,
    refreshProfile,
    updateProfile,
    changeUserPassword,
    submitAttendance,
    fetchUserAttendance,
    fetchEmployeeDailyReports,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<CorporateTab>('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Change Password State & Password Visibility
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Attendance Form State
  const [attendanceDate, setAttendanceDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [workHours, setWorkHours] = useState<number | string>(8);
  const [expectedClients, setExpectedClients] = useState<number | string>(5);
  const [isSubmittingAttendance, setIsSubmittingAttendance] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  // Daily Data Report State (Assigned to this employee)
  const [dailyReports, setDailyReports] = useState<DailyReportItem[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportSearch, setReportSearch] = useState('');

  const corporateId = profile?.corporateUserId || 'WDS-ACTIVE';
  const income = profile?.income || 0;
  const progress = profile?.progress || 0;

  // Initialize edit fields when profile changes
  useEffect(() => {
    if (profile) {
      setEditName(profile.name || '');
      setEditPhone(profile.phone || '');
      setEditLocation(profile.location || 'Pan-India Corporate');
    }
  }, [profile]);

  // Load attendance and daily data report records
  useEffect(() => {
    loadAttendance();
    loadReports();
  }, [user]);

  const loadAttendance = async () => {
    setLoadingAttendance(true);
    try {
      const records = await fetchUserAttendance();
      setAttendanceHistory(records);
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoadingAttendance(false);
    }
  };

  const loadReports = async () => {
    setLoadingReports(true);
    try {
      const reports = await fetchEmployeeDailyReports();
      setDailyReports(reports);
    } catch (err) {
      console.error('Failed to load employee daily reports:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProfile();
    await loadAttendance();
    await loadReports();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // 1. Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    if (!editName.trim()) {
      setProfileMessage({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const res = await updateProfile({
        name: editName.trim(),
        phone: editPhone.trim(),
        location: editLocation.trim(),
      });
      if (res.success) {
        setProfileMessage({ type: 'success', text: 'Profile updated successfully.' });
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

  // 2. Handle Password Change
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
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
      setPasswordMessage({ type: 'error', text: 'An error occurred while changing password.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // 3. Handle Attendance Submission
  const handleAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttendanceMessage(null);

    if (!attendanceDate) {
      setAttendanceMessage({ type: 'error', text: 'Please select a valid date.' });
      return;
    }

    const hours = Number(workHours);
    if (isNaN(hours) || hours <= 0 || hours > 24) {
      setAttendanceMessage({ type: 'error', text: 'Please enter valid work hours between 1 and 24.' });
      return;
    }

    const clients = Number(expectedClients);
    if (isNaN(clients) || clients < 0) {
      setAttendanceMessage({ type: 'error', text: 'Please enter a valid number of expected clients (0 or more).' });
      return;
    }

    setIsSubmittingAttendance(true);
    try {
      const res = await submitAttendance({
        date: attendanceDate,
        todayWorkHours: hours,
        expectedClients: clients,
      });

      if (res.success) {
        setAttendanceMessage({ type: 'success', text: 'Attendance submitted successfully! Status: Pending review.' });
        await loadAttendance();
      } else {
        setAttendanceMessage({ type: 'error', text: res.error || 'Failed to submit attendance.' });
      }
    } catch (err: any) {
      console.error('Corporate attendance submit exception:', err);
      const errMsg = err?.message || String(err) || 'Failed to submit attendance.';
      setAttendanceMessage({ type: 'error', text: `Error: ${errMsg}` });
    } finally {
      setIsSubmittingAttendance(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF3C7] text-amber-950 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* ========================================================================= */}
      {/* PURPLE HEADER */}
      {/* ========================================================================= */}
      <header className="bg-[#3B0764] text-white border-b border-purple-900 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* Brand and Corporate User Identification */}
            <div className="flex items-center gap-3">
              <img
                src={AGENCY_INFO.logoUrl}
                alt="Walt Designs & Studio"
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-400/50 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-white tracking-tight">
                    Walt Designs & Studio
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-purple-950 uppercase tracking-wider shadow-sm">
                    Corporate Portal
                  </span>
                </div>
                <p className="text-xs text-purple-200 font-mono">
                  Corporate ID: <span className="text-amber-300 font-bold">{corporateId}</span>
                </p>
              </div>
            </div>

            {/* Top Right Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-100 hover:text-white transition-all cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-semibold"
                title="Sync metrics & attendance"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>

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

        {/* CORPORATE NAVIGATION TABS ON PURPLE HEADER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-purple-800/80 overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-2 py-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-amber-400 text-purple-950 shadow-md font-extrabold'
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
                  ? 'bg-amber-400 text-purple-950 shadow-md font-extrabold'
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
                  ? 'bg-amber-400 text-purple-950 shadow-md font-extrabold'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Portfolio</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'attendance'
                  ? 'bg-amber-400 text-purple-950 shadow-md font-extrabold'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Attendance</span>
              {attendanceHistory.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'attendance' ? 'bg-purple-950 text-amber-300' : 'bg-purple-800 text-white'
                }`}>
                  {attendanceHistory.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('data-report')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'data-report'
                  ? 'bg-amber-400 text-purple-950 shadow-md font-extrabold'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Data Report Status</span>
              {dailyReports.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'data-report' ? 'bg-purple-950 text-amber-300' : 'bg-purple-800 text-white'
                }`}>
                  {dailyReports.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* GOLDEN DASHBOARD & SECTION WRAPPER */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ======================================================================= */}
        {/* TAB 1: DASHBOARD OVERVIEW (GOLDEN BG) */}
        {/* ======================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Welcome Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFBEB] border-2 border-amber-300 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wider font-mono shadow-sm">
                    {corporateId}
                  </span>
                  <span className="text-xs font-bold text-amber-800">
                    {profile?.corporateRole || 'Asst. Sales Manager'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
                  Welcome, {profile?.name || 'Sales Representative'}
                </h1>
                <p className="text-xs sm:text-sm text-amber-900/80 max-w-2xl">
                  Access your assigned enterprise sales metrics, target achievement indices, and daily attendance portal.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-extrabold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Submit Today's Attendance</span>
                </button>
              </div>
            </div>

            {/* Milestone Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-6 rounded-2xl bg-[#FFFBEB] border border-amber-300 shadow-sm">
                <div className="flex items-center justify-between text-amber-800 text-xs font-bold mb-2">
                  <span>My Accrued Sales Income</span>
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-800 font-mono">
                  ₹{income.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-amber-700 font-medium mt-1.5 block">Verified earned commissions</span>
              </div>

              <div className="p-6 rounded-2xl bg-[#FFFBEB] border border-amber-300 shadow-sm">
                <div className="flex items-center justify-between text-amber-800 text-xs font-bold mb-2">
                  <span>Target Achievement</span>
                  <TrendingUp className="w-5 h-5 text-amber-700" />
                </div>
                <div className="text-3xl font-extrabold text-amber-900 font-mono">
                  {progress}%
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2 mt-2.5 overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#FFFBEB] border border-amber-300 shadow-sm">
                <div className="flex items-center justify-between text-amber-800 text-xs font-bold mb-2">
                  <span>Corporate User ID</span>
                  <Shield className="w-5 h-5 text-purple-700" />
                </div>
                <div className="text-2xl font-extrabold text-amber-950 font-mono">
                  {corporateId}
                </div>
                <span className="text-[11px] text-amber-700 font-medium mt-1.5 block">Permanent Enterprise Identifier</span>
              </div>
            </div>

            {/* Quick Status / Recent Attendance Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFBEB] border border-amber-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-amber-950 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span>Latest Attendance Status</span>
                  </h3>
                  <p className="text-xs text-amber-800/80 mt-0.5">
                    Your daily work logs reviewed by agency management
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="text-xs text-amber-900 hover:text-purple-900 font-bold cursor-pointer underline"
                >
                  View All ({attendanceHistory.length}) →
                </button>
              </div>

              {attendanceHistory.length > 0 ? (
                <div className="p-4 rounded-2xl bg-white border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-950">
                        Date: {attendanceHistory[0].date}
                      </span>
                      <span className="text-xs text-amber-800 font-mono">
                        • Hours: {attendanceHistory[0].todayWorkHours}h • Clients: {attendanceHistory[0].expectedClients}
                      </span>
                    </div>
                    <p className="text-xs text-amber-700">
                      Attendance sent • Code: <span className="font-mono text-amber-900 font-bold">{attendanceHistory[0].employeeCode}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {attendanceHistory[0].status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 border border-amber-400 text-amber-900">
                        <Clock className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                        <span>Status: Pending</span>
                      </span>
                    )}
                    {attendanceHistory[0].status === 'approved' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 border border-emerald-400 text-emerald-900">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Status: Approved</span>
                      </span>
                    )}
                    {attendanceHistory[0].status === 'rejected' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 border border-red-400 text-red-900">
                        <XCircle className="w-3.5 h-3.5 text-red-700" />
                        <span>Status: Rejected</span>
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white border border-dashed border-amber-300 text-center space-y-2">
                  <p className="text-xs text-amber-800">No attendance submitted yet for today.</p>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-bold cursor-pointer shadow-sm"
                  >
                    Submit Attendance Now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 2: MY PROFILE (GOLDEN BG) */}
        {/* ======================================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Summary & Details */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFBEB] border-2 border-amber-300 shadow-md space-y-5">
                <div>
                  <h3 className="font-extrabold text-base text-amber-950 flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-700" />
                    <span>My Corporate Profile</span>
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Official enterprise credentials and representative identity
                  </p>
                </div>

                <div className="space-y-3 text-xs divide-y divide-amber-200/80 font-sans">
                  <div className="pt-2 flex justify-between">
                    <span className="text-amber-800">Corporate User ID</span>
                    <span className="font-mono font-bold text-amber-950">{corporateId}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-amber-800">Full Name</span>
                    <span className="font-bold text-zinc-900">{profile?.name || 'Representative'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-amber-800">Designation</span>
                    <span className="text-zinc-900 font-semibold">{profile?.corporateRole || 'Asst. Sales Manager'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-amber-800">Official Email</span>
                    <span className="font-mono text-zinc-900 truncate max-w-[150px]">{profile?.email || user?.email}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-amber-800">Phone</span>
                    <span className="font-mono text-zinc-900">{profile?.phone || '—'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-amber-800">Territory Location</span>
                    <span className="text-zinc-900 font-semibold">{profile?.location || 'Pan-India Corporate'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-amber-800">Security UID</span>
                    <span className="font-mono text-[10px] text-amber-700 truncate max-w-[130px]">{user?.uid}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-amber-300 text-[11px] text-amber-900 space-y-1">
                  <span className="font-bold text-amber-950 block">Note on Corporate ID:</span>
                  <span>Corporate users can authenticate using either their Email address or Corporate ID ({corporateId}).</span>
                </div>
              </div>

              {/* Edit Permitted Profile Details */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFBEB] border-2 border-amber-300 shadow-md space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-amber-950 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-amber-700" />
                    <span>Edit Profile Information</span>
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Update your contact and territory details
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

                <form onSubmit={handleSaveProfile} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-950">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-white border border-amber-300 focus:border-amber-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-950">Contact Phone</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full bg-white border border-amber-300 focus:border-amber-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-950">Territory / Location</label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      placeholder="e.g. Mumbai Corporate Division"
                      className="w-full bg-white border border-amber-300 focus:border-amber-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingProfile ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>Save Profile Changes</span>
                  </button>
                </form>
              </div>

              {/* Secure Password Change with Hide / Unhide Toggle */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFBEB] border-2 border-amber-300 shadow-md space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-amber-950 flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-700" />
                    <span>Change Password</span>
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
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

                <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
                  {/* Current Password with Hide/Unhide */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-950">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-amber-300 focus:border-amber-600 rounded-xl pl-3.5 pr-10 py-2 text-xs text-zinc-900 outline-none"
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
                    <label className="text-xs font-bold text-amber-950">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full bg-white border border-amber-300 focus:border-amber-600 rounded-xl pl-3.5 pr-10 py-2 text-xs text-zinc-900 outline-none"
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
                    <label className="text-xs font-bold text-amber-950">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full bg-white border border-amber-300 focus:border-amber-600 rounded-xl pl-3.5 pr-10 py-2 text-xs text-zinc-900 outline-none"
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
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isChangingPassword ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <KeyRound className="w-3.5 h-3.5" />
                    )}
                    <span>Update Password</span>
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 3: PORTFOLIO (GOLDEN BG) */}
        {/* ======================================================================= */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFBEB] border-2 border-amber-300 shadow-md space-y-5">
              <div>
                <h3 className="font-extrabold text-base text-amber-950 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-700" />
                  <span>Walt Designs & Studio — Core Services Portfolio</span>
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  Enterprise service lines available for client engagement and sales distribution
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {DIVISIONS.map((div) => (
                  <div
                    key={div.id}
                    className="p-5 rounded-2xl bg-white border border-amber-300 flex items-start gap-4 hover:border-amber-500 transition-colors shadow-sm"
                  >
                    <img
                      src={div.image}
                      alt={div.title}
                      className="w-16 h-16 rounded-xl object-cover ring-1 ring-amber-400 shrink-0 shadow-xs"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900">{div.title}</h4>
                      <p className="text-xs text-zinc-600 line-clamp-2 mt-1">{div.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {div.deliverables.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 border border-amber-300 text-amber-900 font-mono"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 4: ATTENDANCE (GOLDEN BG) */}
        {/* ======================================================================= */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Attendance Submission Form */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFBEB] border-2 border-amber-300 shadow-md space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-amber-950 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span>Submit Attendance</span>
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Log your daily work hours and client outreach
                  </p>
                </div>

                {attendanceMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      attendanceMessage.type === 'success'
                        ? 'bg-emerald-100 border border-emerald-400 text-emerald-900 font-medium'
                        : 'bg-red-100 border border-red-400 text-red-900 font-medium'
                    }`}
                  >
                    {attendanceMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                    )}
                    <span>{attendanceMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleAttendanceSubmit} className="space-y-3.5">
                  {/* Employee Code (Auto-filled & Read-only) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-950 block">
                      Employee Code
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={corporateId}
                      className="w-full bg-amber-100/70 border border-amber-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-amber-950 cursor-not-allowed outline-none"
                    />
                    <span className="text-[10px] text-amber-800 block pl-1">
                      Automatically linked to your verified Corporate ID
                    </span>
                  </div>

                  {/* Date Picker */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-950 block">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="w-full bg-white border border-amber-300 focus:border-amber-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  {/* Today's Work Hours */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-950 block">
                      Today's Work Hours
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={24}
                      value={workHours}
                      onChange={(e) => setWorkHours(e.target.value)}
                      placeholder="e.g. 8"
                      className="w-full bg-white border border-amber-300 focus:border-amber-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  {/* Expected Clients */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-950 block">
                      Expected Clients / Meetings
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={expectedClients}
                      onChange={(e) => setExpectedClients(e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full bg-white border border-amber-300 focus:border-amber-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingAttendance}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingAttendance ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting Attendance...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Attendance</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Attendance History & Real-Time Status Tracking */}
              <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-[#FFFBEB] border-2 border-amber-300 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-amber-950 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>My Attendance Records</span>
                    </h3>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Real-time approval status from Admin management
                    </p>
                  </div>

                  <button
                    onClick={loadAttendance}
                    className="p-1.5 px-2.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-300 text-amber-950 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingAttendance ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {attendanceHistory.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white border border-dashed border-amber-300 text-center space-y-2">
                    <Calendar className="w-8 h-8 text-amber-400 mx-auto" />
                    <p className="text-xs text-amber-950 font-bold">No attendance submissions yet.</p>
                    <p className="text-[11px] text-amber-800">
                      Submit today's work hours using the form to have it reviewed by Admin.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attendanceHistory.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-white border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500 transition-colors shadow-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-zinc-900 font-mono">{item.date}</span>
                            <span className="text-xs text-amber-900 font-mono">
                              • {item.todayWorkHours} Hours • {item.expectedClients} Clients
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-amber-800">
                            <span>Attendance sent</span>
                            <span>•</span>
                            <span className="font-mono text-amber-950 font-bold">Code: {item.employeeCode}</span>
                          </div>
                        </div>

                        <div>
                          {item.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 border border-amber-400 text-amber-900">
                              <Clock className="w-3.5 h-3.5 animate-pulse text-amber-700" />
                              <span>Status: Pending</span>
                            </span>
                          )}
                          {item.status === 'approved' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 border border-emerald-400 text-emerald-900">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Status: Approved</span>
                            </span>
                          )}
                          {item.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 border border-red-400 text-red-900">
                              <XCircle className="w-3.5 h-3.5 text-red-700" />
                              <span>Status: Rejected</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 5: DATA REPORT STATUS (GOLDEN BG) */}
        {/* ======================================================================= */}
        {activeTab === 'data-report' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFBEB] border-2 border-amber-300 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-amber-950 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-amber-700" />
                    <span>Data Report Status</span>
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    View daily client reports and lead assignments provisioned directly by Admin
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={reportSearch}
                      onChange={(e) => setReportSearch(e.target.value)}
                      placeholder="Search client, location..."
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-amber-300 text-xs text-zinc-900 focus:border-amber-600 outline-none w-44 shadow-xs"
                    />
                  </div>

                  <button
                    onClick={loadReports}
                    className="p-2 px-3 rounded-xl bg-white hover:bg-amber-50 text-amber-950 text-xs font-semibold flex items-center gap-1.5 border border-amber-300 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingReports ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-2xl border border-amber-300 bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-amber-100/90 text-amber-950 font-mono uppercase text-[10px] font-bold border-b border-amber-300">
                    <tr>
                      <th className="px-3.5 py-3">S.No</th>
                      <th className="px-3.5 py-3">Name</th>
                      <th className="px-3.5 py-3">Email</th>
                      <th className="px-3.5 py-3">Number</th>
                      <th className="px-3.5 py-3">Location</th>
                      <th className="px-3.5 py-3">Requirement</th>
                      <th className="px-3.5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {loadingReports ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-amber-800">
                          <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <span>Loading Assigned Reports...</span>
                        </td>
                      </tr>
                    ) : dailyReports.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-amber-800">
                          <FileSpreadsheet className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                          <p className="font-bold text-amber-950">No data reports assigned yet.</p>
                          <p className="text-[11px] text-amber-800 mt-0.5">
                            Any client reports or leads assigned to your Employee ID ({corporateId}) will appear here automatically.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      dailyReports
                        .filter((r) => {
                          const q = reportSearch.toLowerCase().trim();
                          return (
                            !q ||
                            r.name.toLowerCase().includes(q) ||
                            r.email.toLowerCase().includes(q) ||
                            r.number.toLowerCase().includes(q) ||
                            r.location.toLowerCase().includes(q) ||
                            r.requirement.toLowerCase().includes(q) ||
                            String(r.sNo).toLowerCase().includes(q)
                          );
                        })
                        .map((report) => (
                          <tr key={report.id} className="hover:bg-amber-50/80 transition-colors">
                            <td className="px-3.5 py-3 font-mono font-bold text-amber-900 whitespace-nowrap">
                              #{report.sNo}
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
                            <td className="px-3.5 py-3 text-zinc-800 max-w-sm" title={report.requirement}>
                              {report.requirement}
                            </td>
                            <td className="px-3.5 py-3 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 border border-amber-400 text-amber-950">
                                {report.status}
                              </span>
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
