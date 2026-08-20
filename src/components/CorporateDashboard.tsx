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
} from 'lucide-react';
import { useAuth, AttendanceRecord } from '../context/AuthContext';
import { AGENCY_INFO, DIVISIONS } from '../data/agencyData';

type CorporateTab = 'dashboard' | 'profile' | 'portfolio' | 'attendance';

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

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  // Load attendance records
  useEffect(() => {
    loadAttendance();
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProfile();
    await loadAttendance();
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
    } catch {
      setAttendanceMessage({ type: 'error', text: 'An unexpected error occurred while submitting attendance.' });
    } finally {
      setIsSubmittingAttendance(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a021e] text-white flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* ========================================================================= */}
      {/* DEDICATED CORPORATE TOP BAR */}
      {/* ========================================================================= */}
      <header className="bg-[#240528] border-b border-amber-500/30 sticky top-0 z-40 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* Brand and Corporate User Identification */}
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
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 uppercase tracking-wider">
                    Corporate Portal
                  </span>
                </div>
                <p className="text-xs text-zinc-300 font-mono">
                  Corporate ID: <span className="text-amber-300 font-bold">{corporateId}</span>
                </p>
              </div>
            </div>

            {/* Top Right Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white transition-all cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-semibold"
                title="Sync metrics & attendance"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>

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

        {/* CORPORATE NAVIGATION TABS */}
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
              {attendanceHistory.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === 'attendance' ? 'bg-black/30 text-black' : 'bg-white/10 text-zinc-300'
                }`}>
                  {attendanceHistory.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CORPORATE CONTENT */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ======================================================================= */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ======================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Welcome Banner */}
            <div className="p-6 rounded-2xl bg-[#250529] border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-black uppercase tracking-wider font-mono">
                    {corporateId}
                  </span>
                  <span className="text-xs text-zinc-300">
                    {profile?.corporateRole || 'Asst. Sales Manager'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome, {profile?.name || 'Sales Representative'}
                </h1>
                <p className="text-xs text-zinc-300">
                  Access your assigned enterprise sales metrics, target achievement indices, and daily attendance portal.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Submit Today's Attendance</span>
                </button>
              </div>
            </div>

            {/* Milestone Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#250529] border border-white/10 shadow-md">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
                  <span>My Accrued Sales Income</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  ₹{income.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Verified earned commissions</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#250529] border border-white/10 shadow-md">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
                  <span>Target Achievement</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-amber-400 font-mono">
                  {progress}%
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#250529] border border-white/10 shadow-md">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
                  <span>Corporate User ID</span>
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {corporateId}
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Permanent Enterprise Identifier</span>
              </div>
            </div>

            {/* Quick Status / Recent Attendance Card */}
            <div className="p-6 rounded-2xl bg-[#250529] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Latest Attendance Status</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Your daily work logs reviewed by agency management
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                >
                  View All ({attendanceHistory.length}) →
                </button>
              </div>

              {attendanceHistory.length > 0 ? (
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-zinc-300">
                        Date: {attendanceHistory[0].date}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">
                        • Hours: {attendanceHistory[0].todayWorkHours}h • Clients: {attendanceHistory[0].expectedClients}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Attendance sent • Code: <span className="font-mono text-amber-400">{attendanceHistory[0].employeeCode}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {attendanceHistory[0].status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                        <Clock className="w-3.5 h-3.5 animate-pulse" />
                        <span>Status: Pending</span>
                      </span>
                    )}
                    {attendanceHistory[0].status === 'approved' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Status: Approved</span>
                      </span>
                    )}
                    {attendanceHistory[0].status === 'rejected' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 border border-red-500/40 text-red-300">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Status: Rejected</span>
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-black/30 border border-dashed border-white/10 text-center space-y-2">
                  <p className="text-xs text-zinc-400">No attendance submitted yet for today.</p>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold cursor-pointer"
                  >
                    Submit Attendance Now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 2: MY PROFILE (DETAILS + EDITING + PASSWORD CHANGE) */}
        {/* ======================================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Summary & Details */}
              <div className="p-6 rounded-2xl bg-[#250529] border border-white/10 shadow-xl space-y-6">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-400" />
                    <span>My Corporate Profile</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Official enterprise credentials and representative identity
                  </p>
                </div>

                <div className="space-y-3 text-xs divide-y divide-white/5 font-sans">
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Corporate User ID</span>
                    <span className="font-mono font-bold text-amber-300">{corporateId}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Full Name</span>
                    <span className="font-semibold text-white">{profile?.name || 'Representative'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Designation</span>
                    <span className="text-zinc-200">{profile?.corporateRole || 'Asst. Sales Manager'}</span>
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
                    <span className="text-zinc-400">Territory Location</span>
                    <span className="text-zinc-200">{profile?.location || 'Pan-India Corporate'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Security UID</span>
                    <span className="font-mono text-[10px] text-zinc-400 truncate max-w-[130px]">{user?.uid}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] text-zinc-400 space-y-1">
                  <span className="font-semibold text-amber-300 block">Note on Corporate ID:</span>
                  <span>Corporate users authenticate using their Email address. The WDS-XXXX ID is your permanent business identifier.</span>
                </div>
              </div>

              {/* Edit Permitted Profile Details */}
              <div className="p-6 rounded-2xl bg-[#250529] border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-amber-400" />
                      <span>Edit Profile Information</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Update your contact and territory details
                    </p>
                  </div>
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

                <form onSubmit={handleSaveProfile} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Contact Phone</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Territory / Location</label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      placeholder="e.g. Mumbai Corporate Division"
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
                    <span>Save Profile Changes</span>
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

                <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
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
        {/* TAB 3: PORTFOLIO */}
        {/* ======================================================================= */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 rounded-2xl bg-[#250529] border border-white/10 shadow-xl space-y-4">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Walt Designs & Studio — Core Services Portfolio</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Enterprise service lines available for client engagement and sales distribution
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {DIVISIONS.map((div) => (
                  <div
                    key={div.id}
                    className="p-4 rounded-xl bg-black/30 border border-white/10 flex items-start gap-3.5 hover:border-amber-500/40 transition-colors"
                  >
                    <img
                      src={div.image}
                      alt={div.title}
                      className="w-14 h-14 rounded-lg object-cover ring-1 ring-amber-500/20 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white">{div.title}</h4>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{div.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {div.deliverables.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono"
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
        {/* TAB 4: ATTENDANCE (SUBMISSION FORM + ATTENDANCE HISTORY) */}
        {/* ======================================================================= */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Attendance Submission Form */}
              <div className="p-6 rounded-2xl bg-[#250529] border border-amber-500/30 shadow-xl space-y-4">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Submit Attendance</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Log your daily work hours and client outreach
                  </p>
                </div>

                {attendanceMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      attendanceMessage.type === 'success'
                        ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200'
                        : 'bg-red-950/80 border border-red-500/40 text-red-200'
                    }`}
                  >
                    {attendanceMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span>{attendanceMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleAttendanceSubmit} className="space-y-3.5">
                  {/* Employee Code (Auto-filled & Read-only) */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300 block">
                      Employee Code
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={corporateId}
                      className="w-full bg-black/60 border border-amber-500/30 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-amber-400 cursor-not-allowed outline-none"
                    />
                    <span className="text-[10px] text-zinc-400 block pl-1">
                      Automatically linked to your verified Corporate ID
                    </span>
                  </div>

                  {/* Date Picker */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300 block">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  {/* Today's Work Hours */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300 block">
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
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  {/* Expected Clients */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300 block">
                      Expected Clients / Meetings
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={expectedClients}
                      onChange={(e) => setExpectedClients(e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingAttendance}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
              <div className="lg:col-span-2 p-6 rounded-2xl bg-[#250529] border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>My Attendance Records</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Real-time approval status from Admin management
                    </p>
                  </div>

                  <button
                    onClick={loadAttendance}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingAttendance ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {attendanceHistory.length === 0 ? (
                  <div className="p-8 rounded-xl bg-black/30 border border-dashed border-white/10 text-center space-y-2">
                    <Calendar className="w-8 h-8 text-zinc-500 mx-auto" />
                    <p className="text-xs text-zinc-400 font-semibold">No attendance submissions yet.</p>
                    <p className="text-[11px] text-zinc-500">
                      Submit today's work hours using the form to have it reviewed by Admin.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attendanceHistory.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/30 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white font-mono">{item.date}</span>
                            <span className="text-xs text-zinc-400 font-mono">
                              • {item.todayWorkHours} Hours • {item.expectedClients} Clients
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <span>Attendance sent</span>
                            <span>•</span>
                            <span className="font-mono text-zinc-300">Code: {item.employeeCode}</span>
                          </div>
                        </div>

                        <div>
                          {item.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                              <Clock className="w-3.5 h-3.5 animate-pulse" />
                              <span>Status: Pending</span>
                            </span>
                          )}
                          {item.status === 'approved' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Status: Approved</span>
                            </span>
                          )}
                          {item.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-500/20 border border-red-500/40 text-red-300">
                              <XCircle className="w-3.5 h-3.5" />
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

      </main>
    </div>
  );
};
