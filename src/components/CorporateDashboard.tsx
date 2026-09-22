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
  Briefcase,
  XCircle,
  FileSpreadsheet,
  Search,
  Eye,
  EyeOff,
  Lock,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Sparkles,
  X,
  Target,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Check,
  PhoneCall,
  MessageSquare,
  Bell,
  Megaphone,
  Trophy,
  Crown,
  ChevronRight,
  Bot,
  HelpCircle,
} from 'lucide-react';
import {
  useAuth,
  AttendanceRecord,
  DailyReportItem,
  ExpectedDataItem,
  NotificationItem,
  NoticeItem,
  LeaderboardItem,
} from '../context/AuthContext';
import { AGENCY_INFO, DIVISIONS } from '../data/agencyData';
import { CorporateNotificationsSection } from './corporate/CorporateNotificationsSection';
import { CorporateNoticesSection } from './corporate/CorporateNoticesSection';
import { CorporateLeaderboardSection } from './corporate/CorporateLeaderboardSection';
import { CorporateAiSupport } from './corporate/CorporateAiSupport';
import { CorporateAccountRestricted } from './corporate/CorporateAccountRestricted';

type CorporateTab =
  | 'dashboard'
  | 'profile'
  | 'portfolio'
  | 'attendance'
  | 'data-report'
  | 'expected-data';

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
    fetchEmployeeExpectedData,
    updateExpectedDataStatus,
    fetchEmployeeNotifications,
    fetchNotices,
    fetchLeaderboard,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<CorporateTab>('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // If corporate account is banned, suspended, or terminated: block access to dashboard
  if (profile && profile.accountStatus && profile.accountStatus !== 'active') {
    return (
      <CorporateAccountRestricted
        profile={profile}
        onRefresh={refreshProfile}
        onLogout={logout}
      />
    );
  }

  // Live Timing Clock (Ticks every 1s)
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper for consistent local YYYY-MM-DD calculation
  const getLocalDateString = (d: Date = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const localTodayStr = getLocalDateString(currentTime);

  // Compute Time Greeting & Icon based on local hour
  const getGreetingData = (date: Date) => {
    const hours = date.getHours();
    if (hours >= 5 && hours < 12) {
      return {
        greeting: 'Good Morning',
        icon: Sunrise,
        color: 'text-amber-600',
        bg: 'bg-amber-100',
      };
    } else if (hours >= 12 && hours < 17) {
      return {
        greeting: 'Good Afternoon',
        icon: Sun,
        color: 'text-orange-600',
        bg: 'bg-orange-100',
      };
    } else if (hours >= 17 && hours < 21) {
      return {
        greeting: 'Good Evening',
        icon: Sunset,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
      };
    } else {
      return {
        greeting: 'Good Night',
        icon: Moon,
        color: 'text-indigo-600',
        bg: 'bg-indigo-100',
      };
    }
  };

  const greetingInfo = getGreetingData(currentTime);
  const GreetingIcon = greetingInfo.icon;

  // Unified Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  
  // Password Fields inside Unified Profile
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Attendance Form State (Clear initially)
  const [attendanceDate, setAttendanceDate] = useState<string>(localTodayStr);
  const [workHours, setWorkHours] = useState<string>('');
  const [expectedClients, setExpectedClients] = useState<string>('');
  const [isSubmittingAttendance, setIsSubmittingAttendance] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  // Daily Data Report State (Assigned to this employee)
  const [dailyReports, setDailyReports] = useState<DailyReportItem[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportSearch, setReportSearch] = useState('');

  // Expected Data State (Assigned to this employee)
  const [expectedDataList, setExpectedDataList] = useState<ExpectedDataItem[]>([]);
  const [loadingExpectedData, setLoadingExpectedData] = useState(false);
  const [expectedSearch, setExpectedSearch] = useState('');
  const [expectedStatusFilter, setExpectedStatusFilter] = useState<'all' | 'Pending' | 'Interested' | 'Not Interested'>('all');
  const [expectedDateFilter, setExpectedDateFilter] = useState<string>('all');
  const [expectedLocationFilter, setExpectedLocationFilter] = useState<string>('all');
  const [updatingExpectedId, setUpdatingExpectedId] = useState<string | null>(null);
  const [expectedFeedbackMsg, setExpectedFeedbackMsg] = useState<{ id: string; text: string } | null>(null);
  const [selectedExpectedStatuses, setSelectedExpectedStatuses] = useState<Record<string, 'Interested' | 'Not Interested'>>({});

  // Dashboard Extras (Notifications, Notices, Leaderboard, AI Support)
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
  const [recentNoticesList, setRecentNoticesList] = useState<NoticeItem[]>([]);
  const [topLeaderboardList, setTopLeaderboardList] = useState<LeaderboardItem[]>([]);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isNoticesModalOpen, setIsNoticesModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isAiSupportOpen, setIsAiSupportOpen] = useState(false);

  const corporateId = profile?.corporateUserId || 'WDS-ACTIVE';
  const basicSalary = profile?.basicSalary ?? 25000;
  const income = profile?.income || 0;
  const target = profile?.target ?? 100000;
  const calculatedProgress =
    profile?.progress ??
    (target > 0 ? Math.min(100, Math.max(0, Math.round(((basicSalary + income) / target) * 100))) : 0);

  // Check if attendance has already been submitted for today (using localTodayStr)
  const todayAttendanceRecord = attendanceHistory.find((record) => record.date === localTodayStr);
  const hasMarkedTodayAttendance = Boolean(todayAttendanceRecord);

  // Calculate live countdown to next day 12:00 AM (Midnight)
  const getMidnightUnlockCountdown = () => {
    const nextMidnight = new Date(currentTime);
    nextMidnight.setHours(24, 0, 0, 0); // Next 12:00 AM
    const diffMs = Math.max(0, nextMidnight.getTime() - currentTime.getTime());
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Initialize edit fields when profile changes
  useEffect(() => {
    if (profile) {
      setEditName(profile.name || '');
      setEditPhone(profile.phone || '');
      setEditLocation(profile.location || 'Pan-India Corporate');
    }
  }, [profile]);

  // Keep attendanceDate synced with localTodayStr if not customized
  useEffect(() => {
    if (!attendanceDate || attendanceDate !== localTodayStr) {
      setAttendanceDate(localTodayStr);
    }
  }, [localTodayStr]);

  // Load attendance, daily data reports, expected data, and dashboard extras
  useEffect(() => {
    loadAttendance();
    loadReports();
    loadExpectedData();
    loadDashboardExtras();
  }, [user]);

  const loadDashboardExtras = async () => {
    try {
      const [notifs, notices, leaders] = await Promise.all([
        fetchEmployeeNotifications().catch(() => []),
        fetchNotices().catch(() => []),
        fetchLeaderboard().catch(() => []),
      ]);
      setUnreadNotificationsCount(notifs.filter((n: NotificationItem) => !n.isRead).length);
      setRecentNoticesList(notices);
      setTopLeaderboardList(leaders);
    } catch (e) {
      console.error('Failed to load dashboard widgets data:', e);
    }
  };

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

  const loadExpectedData = async () => {
    setLoadingExpectedData(true);
    try {
      const list = await fetchEmployeeExpectedData();
      setExpectedDataList(list);
    } catch (err) {
      console.error('Failed to load employee expected data:', err);
    } finally {
      setLoadingExpectedData(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProfile();
    await loadAttendance();
    await loadReports();
    await loadExpectedData();
    await loadDashboardExtras();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Unified Profile & Password Save Handler
  const handleSaveUnifiedProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    if (!editName.trim()) {
      setProfileMessage({ type: 'error', text: 'Display Name cannot be empty.' });
      return;
    }

    // If user wants to change password
    const hasPasswordInput = currentPassword || newPassword || confirmPassword;
    if (hasPasswordInput) {
      if (!currentPassword) {
        setProfileMessage({ type: 'error', text: 'Please enter your current password to authorize password update.' });
        return;
      }
      if (!newPassword || newPassword.length < 6) {
        setProfileMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setProfileMessage({ type: 'error', text: 'New passwords do not match.' });
        return;
      }
    }

    setIsUpdatingProfile(true);
    try {
      // 1. Update basic profile info
      const res = await updateProfile({
        name: editName.trim(),
        phone: editPhone.trim(),
        location: editLocation.trim(),
      });

      if (!res.success) {
        setProfileMessage({ type: 'error', text: res.error || 'Failed to update profile details.' });
        setIsUpdatingProfile(false);
        return;
      }

      // 2. Change password if requested
      if (hasPasswordInput) {
        const passRes = await changeUserPassword(currentPassword, newPassword);
        if (!passRes.success) {
          setProfileMessage({
            type: 'error',
            text: `Profile updated, but password change failed: ${passRes.error || 'Incorrect current password.'}`,
          });
          setIsUpdatingProfile(false);
          return;
        }
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }

      setProfileMessage({
        type: 'success',
        text: hasPasswordInput
          ? 'Profile details and password updated successfully!'
          : 'Corporate profile details updated successfully!',
      });
      setIsEditingProfile(false);
      await refreshProfile();
    } catch {
      setProfileMessage({ type: 'error', text: 'An unexpected error occurred while saving profile settings.' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Attendance Submission (1 attendance per calendar day limit with auto-lock until next 12 AM)
  const handleAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttendanceMessage(null);

    // Strict local date lock check
    if (hasMarkedTodayAttendance && attendanceDate === localTodayStr) {
      setAttendanceMessage({
        type: 'error',
        text: `You have already marked attendance for today (${localTodayStr}). The portal is locked and will automatically reopen tomorrow after 12:00 AM.`,
      });
      return;
    }

    if (!attendanceDate) {
      setAttendanceMessage({ type: 'error', text: 'Please select a valid date.' });
      return;
    }

    const hours = Number(workHours);
    if (!workHours || isNaN(hours) || hours <= 0 || hours > 24) {
      setAttendanceMessage({ type: 'error', text: 'Please enter valid work hours between 1 and 24.' });
      return;
    }

    const clients = Number(expectedClients);
    if (expectedClients === '' || isNaN(clients) || clients < 0) {
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
        setAttendanceMessage({
          type: 'success',
          text: `Attendance for ${attendanceDate} submitted successfully! Your submission is recorded and locked until tomorrow 12:00 AM.`,
        });
        // Clear form fields as requested
        setWorkHours('');
        setExpectedClients('');
        setAttendanceDate(localTodayStr);
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

  // Employee: Handle Expected Data Status Change and Submit (Interested / Not Interested)
  const handleEmployeeExpectedStatusSubmit = async (
    item: ExpectedDataItem,
    targetStatus?: 'Interested' | 'Not Interested'
  ) => {
    const statusToSubmit =
      targetStatus ||
      selectedExpectedStatuses[item.id] ||
      (item.status === 'Interested' || item.status === 'Not Interested'
        ? item.status
        : 'Interested');

    setUpdatingExpectedId(item.id);
    setExpectedFeedbackMsg(null);

    try {
      const res = await updateExpectedDataStatus(item.id, statusToSubmit);
      if (res.success) {
        // Update local selected state
        setSelectedExpectedStatuses((prev) => ({ ...prev, [item.id]: statusToSubmit }));
        // Fresh re-fetch from Firestore to guarantee UI displays the latest document state
        await loadExpectedData();
        setExpectedFeedbackMsg({
          id: item.id,
          text: `Status for "${item.businessName}" updated to '${statusToSubmit}' & synced with Admin Expected Data!`,
        });
        setTimeout(() => setExpectedFeedbackMsg(null), 5000);
      } else {
        alert(res.error || 'Failed to update status in Firestore.');
      }
    } catch (err: any) {
      console.error('Error updating expected data status:', err);
      alert(err?.message || 'Failed to update status.');
    } finally {
      setUpdatingExpectedId(null);
    }
  };

  // Formatted Live Time and Date strings
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Expected Data Filter Calculations
  const expectedUniqueLocations = Array.from(
    new Set(expectedDataList.map((i) => i.location).filter(Boolean))
  );
  const expectedUniqueDates = Array.from(
    new Set(expectedDataList.map((i) => i.date).filter(Boolean))
  );

  const filteredExpectedData = expectedDataList.filter((item) => {
    const q = expectedSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.businessName.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.number.toLowerCase().includes(q);

    const matchesStatus =
      expectedStatusFilter === 'all' || item.status === expectedStatusFilter;

    const matchesDate =
      expectedDateFilter === 'all' || item.date === expectedDateFilter;

    const matchesLocation =
      expectedLocationFilter === 'all' || item.location === expectedLocationFilter;

    return matchesSearch && matchesStatus && matchesDate && matchesLocation;
  });

  // KPI calculations for Expected Data
  const totalExpectedAssigned = expectedDataList.length;
  const totalInterested = expectedDataList.filter((i) => i.status === 'Interested').length;
  const totalNotInterested = expectedDataList.filter((i) => i.status === 'Not Interested').length;
  const totalPendingAction = expectedDataList.filter((i) => i.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-[#FEF3C7] text-amber-950 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* ========================================================================= */}
      {/* PURPLE HEADER WITH LIVE CLOCK */}
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
                <p className="text-xs text-purple-200 font-mono flex items-center gap-1.5">
                  Corporate ID: <span className="text-amber-300 font-bold">{corporateId}</span>
                </p>
              </div>
            </div>

            {/* Top Right: Live Timing Clock & User Controls */}
            <div className="flex items-center gap-3">
              
              {/* Live Timing Clock on Purple Header */}
              <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-purple-950/80 border border-purple-700/70 shadow-inner">
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-amber-300 tracking-wider">
                    {formattedTime}
                  </div>
                  <div className="text-[10px] text-purple-200 font-medium">
                    {formattedDate}
                  </div>
                </div>
              </div>

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
              {hasMarkedTodayAttendance ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-emerald-950 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Marked Today
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-purple-950 animate-pulse">
                  Pending Today
                </span>
              )}
            </button>

            {/* EXPECTED DATA TAB WITH PROMINENT POP-UP HIGHLIGHT WHEN DATA RECEIVED */}
            <button
              onClick={() => setActiveTab('expected-data')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap relative ${
                activeTab === 'expected-data'
                  ? 'bg-amber-400 text-purple-950 shadow-md font-black ring-2 ring-amber-300'
                  : expectedDataList.length > 0
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-purple-950 font-black shadow-xl ring-2 ring-yellow-400 ring-offset-1 ring-offset-purple-950 animate-bounce hover:scale-105 transform'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Target className={`w-4 h-4 ${expectedDataList.length > 0 ? 'text-purple-950 animate-spin' : ''}`} />
              <span>Expected Data</span>
              {expectedDataList.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-purple-950 text-amber-300 animate-pulse shadow-xs">
                  {expectedDataList.length}
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

            {/* AI HELP DESK QUICK CHAT TRIGGER IN NAV */}
            <button
              type="button"
              onClick={() => setIsAiSupportOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400 hover:text-purple-950 shadow-sm"
              title="Open AI Help Desk & Strategy Assistant"
            >
              <Bot className="w-4 h-4 text-amber-300 hover:text-purple-950" />
              <span>AI Help Desk</span>
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            </button>
          </nav>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* GOLDEN DASHBOARD & SECTION WRAPPER */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ======================================================================= */}
        {/* TAB 1: DASHBOARD OVERVIEW WITH TIME-BASED GREETING & CLOCK */}
        {/* ======================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Top Welcome Banner with Live Timing Greeting & Dry Leaves Wallpaper Background */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#fef9ee] border-2 border-amber-400/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group">
              
              {/* Light & Transparent Dry Leaves Wallpaper Texture Background */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80"
                  alt="Dry Leaves Wallpaper Background"
                  className="w-full h-full object-cover opacity-30 mix-blend-multiply transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50/85 via-amber-100/60 to-orange-50/80 backdrop-blur-[0.5px]" />
                
                {/* Subtle Decorative Autumn Leaf Vectors / Light Accents */}
                <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-300/30 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-orange-300/20 rounded-full blur-2xl" />
              </div>

              <div className="space-y-2.5 z-10 relative">
                
                {/* Time-Based Greeting Badge & Corporate Role */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${greetingInfo.bg} ${greetingInfo.color} border border-amber-400/80 shadow-xs backdrop-blur-md`}>
                    <GreetingIcon className="w-3.5 h-3.5" />
                    <span>{greetingInfo.greeting}</span>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wider font-mono shadow-sm border border-amber-500/40">
                    {corporateId}
                  </span>
                  
                  <span className="text-xs font-extrabold text-amber-900 bg-white/80 px-2.5 py-0.5 rounded-full border border-amber-300/60 shadow-2xs">
                    {profile?.corporateRole || 'Asst. Sales Manager'}
                  </span>
                </div>

                {/* Personalized Greeting Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight drop-shadow-2xs">
                  {greetingInfo.greeting}, {profile?.name || 'Sales Representative'}
                </h1>
                
                <p className="text-xs sm:text-sm text-amber-950 font-medium max-w-2xl leading-relaxed bg-white/60 p-2 rounded-xl border border-amber-200/60 shadow-2xs backdrop-blur-xs">
                  Access your assigned enterprise sales metrics, expected client prospects, target achievement indices, and daily attendance logs.
                </p>

                {/* Mobile Live Clock Display */}
                <div className="flex md:hidden items-center gap-2 pt-1 font-mono text-xs font-bold text-amber-900">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>{formattedTime} • {formattedDate}</span>
                </div>
              </div>

              {/* HIGHLIGHTED "SUBMIT TODAY'S ATTENDANCE" BUTTON & DASHBOARD HUB ACTIONS */}
              <div className="flex flex-wrap items-center gap-3 z-10 relative">
                {/* AI HELP DESK BUTTON */}
                <button
                  type="button"
                  onClick={() => setIsAiSupportOpen(true)}
                  className="relative p-3 px-3.5 rounded-2xl bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 border-2 border-amber-400 text-amber-300 hover:text-white shadow-md hover:shadow-lg transition-all cursor-pointer group flex items-center gap-2"
                  title="Ask AI Corporate Support & Strategy Desk"
                >
                  <Bot className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span className="font-extrabold text-xs text-amber-300">AI Help Desk</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                </button>

                {/* NOTIFICATION BELL BUTTON */}
                <button
                  type="button"
                  onClick={() => setIsNotificationsModalOpen(true)}
                  className="relative p-3 rounded-2xl bg-white/95 border-2 border-amber-300 hover:border-purple-600 text-purple-950 hover:bg-amber-50 shadow-sm transition-all cursor-pointer group flex items-center gap-2"
                  title="View Notifications"
                >
                  <div className="relative">
                    <Bell className="w-5 h-5 text-amber-700 group-hover:text-purple-900 group-hover:rotate-12 transition-transform" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-4 min-w-4 px-1 items-center justify-center text-[10px] font-black text-white bg-red-600 rounded-full animate-bounce shadow-xs">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </div>
                  <span className="font-extrabold text-xs text-amber-950 hidden sm:inline">Notifications</span>
                </button>

                {/* NOTICES BUTTON */}
                <button
                  type="button"
                  onClick={() => setIsNoticesModalOpen(true)}
                  className="relative p-3 rounded-2xl bg-white/95 border-2 border-amber-300 hover:border-purple-600 text-purple-950 hover:bg-amber-50 shadow-sm transition-all cursor-pointer group flex items-center gap-2"
                  title="View Official Notices"
                >
                  <Megaphone className="w-5 h-5 text-amber-700 group-hover:text-purple-900 transition-transform" />
                  <span className="font-extrabold text-xs text-amber-950 hidden sm:inline">Notices</span>
                  {recentNoticesList.length > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-black text-purple-950 bg-amber-300 rounded-full font-mono shadow-xs">
                      {recentNoticesList.length}
                    </span>
                  )}
                </button>

                {/* SHINING AND HIGHLIGHTED LEADERBOARD BUTTON */}
                <button
                  type="button"
                  onClick={() => setIsLeaderboardModalOpen(true)}
                  className="relative overflow-hidden px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-purple-950 font-black text-xs sm:text-sm shadow-xl hover:shadow-2xl ring-4 ring-yellow-400/80 hover:ring-yellow-300 transition-all duration-300 flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 animate-gold-glow group"
                  title="Open Animated Sales Leaderboard"
                >
                  {/* Continuous Shimmer Light Beam Effect */}
                  <div className="absolute inset-0 w-1/2 bg-white/40 skew-x-[-20deg] animate-shine-sweep pointer-events-none" />

                  <Crown className="w-4 h-4 text-amber-950 group-hover:rotate-12 transition-transform animate-pulse" />
                  <span className="tracking-wide uppercase font-extrabold text-purple-950 drop-shadow-xs">Leaderboard</span>
                  <Trophy className="w-4 h-4 text-amber-950 group-hover:scale-110 transition-transform" />
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-950 text-amber-300 font-mono shadow-xs">
                    RANKINGS
                  </span>
                </button>

                {/* Attendance CTA with Accurate Status Color Mapping */}
                {hasMarkedTodayAttendance ? (
                  <div
                    className={`p-3 px-4 rounded-2xl border-2 flex items-center gap-2.5 shadow-md ${
                      todayAttendanceRecord?.status === 'rejected'
                        ? 'bg-red-50/95 border-red-500 text-red-950 ring-2 ring-red-300'
                        : todayAttendanceRecord?.status === 'approved'
                        ? 'bg-emerald-50/95 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300'
                        : todayAttendanceRecord?.status === 'in_review' || todayAttendanceRecord?.status === 'under_review'
                        ? 'bg-orange-50/95 border-orange-500 text-orange-950 ring-2 ring-orange-300'
                        : 'bg-yellow-50/95 border-yellow-400 text-yellow-950 ring-2 ring-yellow-300'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
                        todayAttendanceRecord?.status === 'rejected'
                          ? 'bg-red-600'
                          : todayAttendanceRecord?.status === 'approved'
                          ? 'bg-emerald-600'
                          : todayAttendanceRecord?.status === 'in_review' || todayAttendanceRecord?.status === 'under_review'
                          ? 'bg-orange-600'
                          : 'bg-yellow-500'
                      }`}
                    >
                      {todayAttendanceRecord?.status === 'rejected' ? (
                        <XCircle className="w-4 h-4" />
                      ) : todayAttendanceRecord?.status === 'approved' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-extrabold text-[11px] uppercase tracking-wide">
                        Attendance Marked
                      </div>
                      <div className="text-[10px] font-mono font-bold">
                        {todayAttendanceRecord?.todayWorkHours}h •{' '}
                        <span
                          className={`${
                            todayAttendanceRecord?.status === 'rejected'
                              ? 'text-red-700 font-black'
                              : todayAttendanceRecord?.status === 'approved'
                              ? 'text-emerald-700 font-black'
                              : todayAttendanceRecord?.status === 'in_review' || todayAttendanceRecord?.status === 'under_review'
                              ? 'text-orange-700 font-black'
                              : 'text-yellow-800 font-black'
                          }`}
                        >
                          {todayAttendanceRecord?.status === 'in_review' || todayAttendanceRecord?.status === 'under_review'
                            ? 'IN REVIEW'
                            : (todayAttendanceRecord?.status || 'PENDING').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="relative group px-5 py-3 rounded-2xl bg-[#3B0764] hover:bg-purple-900 text-white font-extrabold text-xs sm:text-sm shadow-xl ring-2 ring-purple-400 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-amber-300 font-bold" />
                    <span>Submit Attendance</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
                  </button>
                )}
              </div>
            </div>

            {/* Milestone Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Basic Salary */}
              <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-amber-300 shadow-sm">
                <div className="flex items-center justify-between text-amber-800 text-xs font-bold mb-2">
                  <span>Basic Salary</span>
                  <DollarSign className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-2xl font-extrabold text-amber-950 font-mono">
                  ₹{basicSalary.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-amber-700 font-medium mt-1.5 block">Fixed baseline pay</span>
              </div>

              {/* My Current Earnings */}
              <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-amber-300 shadow-sm">
                <div className="flex items-center justify-between text-amber-800 text-xs font-bold mb-2">
                  <span>My Current Earnings</span>
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-800 font-mono">
                  ₹{income.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-emerald-700 font-medium mt-1.5 block">Accrued sales income</span>
              </div>

              {/* Sales Target */}
              <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-amber-300 shadow-sm">
                <div className="flex items-center justify-between text-amber-800 text-xs font-bold mb-2">
                  <span>Monthly Sales Target</span>
                  <Target className="w-5 h-5 text-purple-700" />
                </div>
                <div className="text-2xl font-extrabold text-purple-950 font-mono">
                  ₹{target.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-amber-700 font-medium mt-1.5 block">Assigned milestone quota</span>
              </div>

              {/* Target Achievement */}
              <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-amber-300 shadow-sm">
                <div className="flex items-center justify-between text-amber-800 text-xs font-bold mb-2">
                  <span>Target Progress</span>
                  <span className="text-[10px] text-amber-700 font-sans font-bold">Auto</span>
                </div>
                <div className="text-2xl font-extrabold text-amber-900 font-mono">
                  {calculatedProgress}%
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2 mt-2.5 overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(calculatedProgress, 100)}%` }}
                  />
                </div>
              </div>

              {/* Expected Data Leads */}
              <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-amber-300 shadow-sm">
                <div className="flex items-center justify-between text-amber-800 text-xs font-bold mb-2">
                  <span>Expected Data Leads</span>
                  <Target className="w-5 h-5 text-purple-700" />
                </div>
                <div className="text-2xl font-extrabold text-purple-950 font-mono flex items-center gap-1.5">
                  <span>{expectedDataList.length}</span>
                  <span className="text-xs font-normal text-emerald-700 font-sans">({totalInterested} yes)</span>
                </div>
                <button
                  onClick={() => setActiveTab('expected-data')}
                  className="text-[11px] text-purple-900 font-bold hover:underline mt-1.5 block cursor-pointer"
                >
                  Manage expected leads →
                </button>
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
                    Your daily work logs reviewed by agency management (Opens daily at 12:00 AM)
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
                    {attendanceHistory[0].status === 'approved' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 border-2 border-emerald-500 text-emerald-950 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Status: Approved</span>
                      </span>
                    )}
                    {attendanceHistory[0].status === 'rejected' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-100 border-2 border-red-500 text-red-950 shadow-2xs">
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                        <span>Status: Rejected</span>
                      </span>
                    )}
                    {(attendanceHistory[0].status === 'in_review' || attendanceHistory[0].status === 'under_review') && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-orange-100 border-2 border-orange-500 text-orange-950 shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
                        <span>Status: In Review</span>
                      </span>
                    )}
                    {(!attendanceHistory[0].status || attendanceHistory[0].status === 'pending') && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-yellow-100 border-2 border-yellow-400 text-yellow-950 shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-yellow-700" />
                        <span>Status: Pending</span>
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white border border-dashed border-amber-300 text-center space-y-2">
                  <p className="text-xs text-amber-800">No attendance submitted yet for today.</p>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-extrabold cursor-pointer shadow-md"
                  >
                    Submit Attendance Now
                  </button>
                </div>
              )}
            </div>

            {/* NOTICES & LEADERBOARDS DASHBOARD SECTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* COMPANY NOTICES PREVIEW CARD */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFBEB] border-2 border-amber-300 shadow-md space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-900 text-amber-300 flex items-center justify-center font-bold">
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base text-amber-950">
                          Official Notices & Circulars
                        </h3>
                        <p className="text-[11px] text-amber-800">
                          Administrative updates and enterprise announcements
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsNoticesModalOpen(true)}
                      className="text-xs font-extrabold text-purple-950 hover:text-purple-700 underline cursor-pointer"
                    >
                      View All ({recentNoticesList.length}) →
                    </button>
                  </div>

                  {recentNoticesList.length === 0 ? (
                    <div className="p-5 rounded-2xl bg-white border border-amber-200 text-center text-xs text-amber-900">
                      No active notices posted. All department circulars will appear here.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {recentNoticesList.slice(0, 3).map((notice) => (
                        <div
                          key={notice.id}
                          onClick={() => setIsNoticesModalOpen(true)}
                          className="p-3.5 rounded-2xl bg-white border border-amber-200 hover:border-amber-400 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-xs text-amber-950 group-hover:text-purple-900 transition-colors line-clamp-1">
                              {notice.title}
                            </h4>
                            <span className="text-[10px] font-mono text-amber-800 shrink-0 font-bold">
                              {notice.date}
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-900/80 line-clamp-2 mt-1">
                            {notice.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsNoticesModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Open Full Notice Board</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* SALES LEADERBOARD HIGHLIGHTS CARD */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border-2 border-amber-400 shadow-md space-y-4 flex flex-col justify-between relative overflow-hidden">
                {/* Background Shimmer Ribbon */}
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-amber-300/30 rounded-full blur-xl pointer-events-none" />

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between pb-3 border-b border-amber-300">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-purple-950 flex items-center justify-center font-black shadow-xs">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-sm sm:text-base text-purple-950">
                            Sales Leaderboard
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-950 text-amber-300">
                            TOP 3
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-900 font-medium">
                          Company top sales closers & monthly volume leaders
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsLeaderboardModalOpen(true)}
                      className="text-xs font-extrabold text-purple-950 hover:text-purple-700 underline cursor-pointer"
                    >
                      View Rank →
                    </button>
                  </div>

                  {(() => {
                    const fallbackLeaders = [
                      { id: 'def-1', name: 'Priyanshu Kumar', employeeCode: 'WDS-DIR01', dealsClosed: 14, earnings: 185000, incentives: 22200, rank: 1 },
                      { id: 'def-2', name: 'Rahul Verma', employeeCode: 'WDS-9421', dealsClosed: 9, earnings: 120000, incentives: 14400, rank: 2 },
                      { id: 'def-3', name: 'Ananya Sen', employeeCode: 'WDS-8302', dealsClosed: 6, earnings: 95000, incentives: 11400, rank: 3 },
                    ];
                    const leadersToShow = topLeaderboardList.length > 0 ? topLeaderboardList.slice(0, 3) : fallbackLeaders;

                    return (
                      <div className="space-y-2">
                        {leadersToShow.map((leader, index) => {
                          const isFirst = index === 0;
                          const isSecond = index === 1;
                          const leaderName = (leader as any).name || (leader as any).employeeName || (index === 0 ? 'Priyanshu Kumar' : index === 1 ? 'Rahul Verma' : 'Ananya Sen');
                          const empCode = (leader as any).employeeCode || (leader as any).corporateId || (index === 0 ? 'WDS-DIR01' : index === 1 ? 'WDS-9421' : 'WDS-8302');
                          const deals = (leader as any).dealsClosed !== undefined ? (leader as any).dealsClosed : (index === 0 ? 14 : index === 1 ? 9 : 6);
                          const sales = (leader as any).earnings || (leader as any).totalSales || (index === 0 ? 185000 : index === 1 ? 120000 : 95000);
                          const inc = (leader as any).incentives || Math.round(sales * 0.12);

                          return (
                            <div
                              key={leader.id || index}
                              onClick={() => setIsLeaderboardModalOpen(true)}
                              className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                isFirst
                                  ? 'bg-amber-100/95 border-amber-400 shadow-sm'
                                  : isSecond
                                  ? 'bg-white/95 border-amber-300 shadow-2xs'
                                  : 'bg-white/80 border-amber-200'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs ${
                                    isFirst
                                      ? 'bg-amber-500 text-purple-950 ring-2 ring-amber-300 shadow-xs'
                                      : isSecond
                                      ? 'bg-zinc-200 text-zinc-900 border border-zinc-300'
                                      : 'bg-amber-700 text-amber-100'
                                  }`}
                                >
                                  #{leader.rank || index + 1}
                                </div>
                                <div>
                                  <div className="font-extrabold text-xs text-purple-950 flex items-center gap-1.5">
                                    <span>{leaderName}</span>
                                    {isFirst && <Crown className="w-3.5 h-3.5 text-amber-700 fill-amber-500" />}
                                  </div>
                                  <div className="text-[10px] font-mono text-amber-900 font-bold">
                                    {empCode} • {deals} deals
                                  </div>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="font-mono font-black text-xs text-purple-950">
                                  ₹{Number(sales).toLocaleString('en-IN')}
                                </div>
                                <div className="text-[10px] text-emerald-800 font-extrabold">
                                  +₹{Number(inc).toLocaleString('en-IN')} inc.
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Animated Shining Button to Open Full Leaderboard */}
                <button
                  type="button"
                  onClick={() => setIsLeaderboardModalOpen(true)}
                  className="relative overflow-hidden w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 hover:from-purple-900 hover:to-purple-900 text-amber-300 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg border-2 border-amber-400 group animate-gold-glow"
                >
                  <div className="absolute inset-0 w-1/2 bg-white/20 skew-x-[-20deg] animate-shine-sweep pointer-events-none" />
                  <Trophy className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                  <span className="uppercase tracking-wider">Open Full Animated Leaderboard</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 2: MY PROFILE (UNIFIED & MERGED CARD WITH EDIT TOGGLE) */}
        {/* ======================================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFBEB] border-2 border-amber-300 shadow-md space-y-6">
              
              {/* Header with Title & Edit Toggle Icon */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200">
                <div>
                  <h2 className="font-extrabold text-xl text-amber-950 flex items-center gap-2.5">
                    <User className="w-5 h-5 text-amber-700" />
                    <span>My Corporate Profile</span>
                  </h2>
                  <p className="text-xs text-amber-800 mt-1">
                    Official enterprise credentials and representative identity
                  </p>
                </div>

                {/* Edit Profile Button / Icon */}
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingProfile(!isEditingProfile);
                    setProfileMessage(null);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                    isEditingProfile
                      ? 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800'
                      : 'bg-amber-500 hover:bg-amber-600 text-amber-950 ring-2 ring-amber-400/50'
                  }`}
                >
                  {isEditingProfile ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>Cancel Editing</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile Settings</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Message */}
              {profileMessage && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
                    profileMessage.type === 'success'
                      ? 'bg-emerald-100 border border-emerald-400 text-emerald-900 font-medium'
                      : 'bg-red-100 border border-red-400 text-red-900 font-medium'
                  }`}
                >
                  {profileMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                  )}
                  <span>{profileMessage.text}</span>
                </div>
              )}

              {/* MODE A: READ-ONLY OVERVIEW */}
              {!isEditingProfile ? (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-xs space-y-1">
                      <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                        Corporate User ID
                      </span>
                      <div className="font-mono text-base font-extrabold text-amber-950 flex items-center gap-2">
                        <span>{corporateId}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          Active
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-xs space-y-1">
                      <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                        Full Name
                      </span>
                      <div className="text-base font-extrabold text-zinc-900">
                        {profile?.name || 'Sales Representative'}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-xs space-y-1">
                      <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                        Designation / Role
                      </span>
                      <div className="text-sm font-bold text-zinc-900">
                        {profile?.corporateRole || 'Asst. Sales Manager'}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-xs space-y-1">
                      <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                        Official Login Email
                      </span>
                      <div className="font-mono text-xs font-semibold text-zinc-800 truncate">
                        {profile?.email || user?.email}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-xs space-y-1">
                      <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                        Contact Phone
                      </span>
                      <div className="font-mono text-sm font-semibold text-zinc-800">
                        {profile?.phone || 'Not configured'}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-xs space-y-1">
                      <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                        Territory / Location
                      </span>
                      <div className="text-sm font-semibold text-zinc-800">
                        {profile?.location || 'Pan-India Corporate'}
                      </div>
                    </div>

                  </div>

                  <div className="p-4 rounded-2xl bg-amber-100/60 border border-amber-300 text-xs text-amber-950 flex items-start gap-3">
                    <Shield className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Enterprise Authentication Note:</span>
                      <p className="text-amber-900 mt-0.5">
                        You can sign in using your Corporate ID (<strong className="font-mono">{corporateId}</strong>) or registered email address. Click <strong>"Edit Profile Settings"</strong> above to update your contact information or change your password.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* MODE B: UNIFIED INLINE EDIT FORM (INFO + PASSWORD) */
                <form onSubmit={handleSaveUnifiedProfile} className="space-y-6 animate-in fade-in">
                  
                  {/* Part 1: Contact & Location Information */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-amber-200">
                      <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                      <span>Contact & Representative Details</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-amber-950">Display Name</label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="e.g. Priyanshu Kumar"
                          className="w-full bg-white border border-amber-300 focus:border-amber-600 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none shadow-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-amber-950">Contact Phone</label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="+91 9876543210"
                          className="w-full bg-white border border-amber-300 focus:border-amber-600 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none shadow-xs font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-amber-950">Territory / Location</label>
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          placeholder="e.g. Mumbai Corporate Headquarters"
                          className="w-full bg-white border border-amber-300 focus:border-amber-600 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Part 2: Change Password (Optional) */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between pb-1 border-b border-amber-200">
                      <h3 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                        <span>Change Password (Optional)</span>
                      </h3>
                      <span className="text-[10px] text-amber-700 font-medium">Leave blank if not changing</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      {/* Current Password */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-amber-950">Current Password</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white border border-amber-300 focus:border-amber-600 rounded-xl pl-3 pr-9 py-2 text-xs text-zinc-900 outline-none shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 p-1 cursor-pointer"
                            title={showCurrentPassword ? 'Hide password' : 'Show password'}
                          >
                            {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-amber-950">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            className="w-full bg-white border border-amber-300 focus:border-amber-600 rounded-xl pl-3 pr-9 py-2 text-xs text-zinc-900 outline-none shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 p-1 cursor-pointer"
                            title={showNewPassword ? 'Hide password' : 'Show password'}
                          >
                            {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-amber-950">Confirm New</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            className="w-full bg-white border border-amber-300 focus:border-amber-600 rounded-xl pl-3 pr-9 py-2 text-xs text-zinc-900 outline-none shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 p-1 cursor-pointer"
                            title={showConfirmPassword ? 'Hide password' : 'Show password'}
                          >
                            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-amber-200">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileMessage(null);
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold text-xs cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isUpdatingProfile ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

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
        {/* TAB 4: ATTENDANCE (1 PER DAY STRICT LOCK & UNLOCKS AT NEXT 12:00 AM) */}
        {/* ======================================================================= */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Attendance Submission Form Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFBEB] border-2 border-amber-300 shadow-md space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-amber-950 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span>Submit Attendance</span>
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Log your daily work hours and client outreach (1 submission / calendar day)
                  </p>
                </div>

                {/* Daily Submission Limit Alert Notice */}
                {hasMarkedTodayAttendance ? (
                  <div className="p-4 rounded-2xl bg-amber-100 border-2 border-amber-400 text-amber-950 space-y-2 shadow-sm">
                    <div className="flex items-center gap-2 font-extrabold text-xs text-amber-950">
                      <Lock className="w-4 h-4 text-amber-800" />
                      <span>Today's Attendance Locked</span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      You have already marked your attendance for today ({localTodayStr}). Status: <strong className="font-mono uppercase">{todayAttendanceRecord?.status}</strong>.
                    </p>
                    <div className="p-2 rounded-xl bg-amber-200/80 border border-amber-300 text-[11px] text-amber-950 flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                      <span>Unlocks after 12:00 AM in: <strong>{getMidnightUnlockCountdown()}</strong></span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-100/70 border border-amber-300 text-[11px] text-amber-900 flex items-center gap-2 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Portal is open for today: <strong className="font-mono">{localTodayStr}</strong></span>
                  </div>
                )}

                {/* Status Message */}
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

                  {/* Attendance Date (Locked & Auto-filled to Today's date) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-amber-950 block">
                        Attendance Date
                      </label>
                      <span className="text-[10px] text-amber-800 font-mono font-bold">
                        Auto-locked to Today
                      </span>
                    </div>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={localTodayStr}
                      className="w-full bg-amber-100/70 border border-amber-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-amber-950 cursor-not-allowed outline-none"
                    />
                    <span className="text-[10px] text-amber-800 block pl-1">
                      Attendance date is automatically set by the system clock and locked.
                    </span>
                  </div>

                  {/* Today's Work Hours (Clear initially) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-950 block">
                      Today's Work Hours
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={24}
                      disabled={hasMarkedTodayAttendance}
                      value={workHours}
                      onChange={(e) => setWorkHours(e.target.value)}
                      placeholder="Enter work hours (e.g. 8)"
                      className="w-full bg-white disabled:bg-zinc-100 disabled:cursor-not-allowed border border-amber-300 focus:border-amber-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none placeholder:text-zinc-400"
                    />
                  </div>

                  {/* Expected Clients (Clear initially) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-950 block">
                      Expected Clients / Meetings
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      disabled={hasMarkedTodayAttendance}
                      value={expectedClients}
                      onChange={(e) => setExpectedClients(e.target.value)}
                      placeholder="Enter expected clients (e.g. 5)"
                      className="w-full bg-white disabled:bg-zinc-100 disabled:cursor-not-allowed border border-amber-300 focus:border-amber-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none placeholder:text-zinc-400"
                    />
                  </div>

                  {/* Submit Button (Locked if marked today) */}
                  <button
                    type="submit"
                    disabled={isSubmittingAttendance || hasMarkedTodayAttendance}
                    className={`w-full py-3 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      hasMarkedTodayAttendance
                        ? 'bg-zinc-300 text-zinc-600 cursor-not-allowed border border-zinc-400 shadow-none'
                        : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 ring-2 ring-amber-400/60'
                    }`}
                  >
                    {isSubmittingAttendance ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting Attendance...</span>
                      </>
                    ) : hasMarkedTodayAttendance ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-zinc-600" />
                        <span>Attendance Marked for Today (Locked)</span>
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

              {/* Attendance History Table Card */}
              <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-[#FFFBEB] border-2 border-amber-300 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
                  <div>
                    <h3 className="font-extrabold text-base text-amber-950 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>My Attendance Log</span>
                    </h3>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Historical log of your daily attendance and admin approval statuses
                    </p>
                  </div>

                  <button
                    onClick={loadAttendance}
                    className="p-2 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingAttendance ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-amber-300 bg-white shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-amber-100/90 text-amber-950 font-mono uppercase text-[10px] font-bold border-b border-amber-300">
                      <tr>
                        <th className="px-3.5 py-3">Date</th>
                        <th className="px-3.5 py-3">Employee Code</th>
                        <th className="px-3.5 py-3">Work Hours</th>
                        <th className="px-3.5 py-3">Expected Clients</th>
                        <th className="px-3.5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100">
                      {loadingAttendance ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-amber-800">
                            <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            <span>Loading Attendance Logs...</span>
                          </td>
                        </tr>
                      ) : attendanceHistory.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-amber-800">
                            <Calendar className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                            <p className="font-bold text-amber-950">No attendance submitted yet.</p>
                            <p className="text-[11px] text-amber-800 mt-0.5">
                              Fill in the form on the left to log your work hours for today ({localTodayStr}).
                            </p>
                          </td>
                        </tr>
                      ) : (
                        attendanceHistory.map((rec) => (
                          <tr key={rec.id} className="hover:bg-amber-50/80 transition-colors">
                            <td className="px-3.5 py-3 font-mono font-bold text-amber-950">
                              {rec.date}
                            </td>
                            <td className="px-3.5 py-3 font-mono text-zinc-700">
                              {rec.employeeCode}
                            </td>
                            <td className="px-3.5 py-3 font-mono font-bold text-zinc-900">
                              {rec.todayWorkHours} hrs
                            </td>
                            <td className="px-3.5 py-3 font-mono text-zinc-800">
                              {rec.expectedClients} clients
                            </td>
                            <td className="px-3.5 py-3 whitespace-nowrap">
                              {rec.status === 'approved' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 border-2 border-emerald-500 text-emerald-950 shadow-2xs">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Approved</span>
                                </span>
                              )}
                              {rec.status === 'rejected' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-red-100 border-2 border-red-500 text-red-950 shadow-2xs">
                                  <XCircle className="w-3 h-3 text-red-600" />
                                  <span>Rejected</span>
                                </span>
                              )}
                              {(rec.status === 'in_review' || rec.status === 'under_review') && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-orange-100 border-2 border-orange-500 text-orange-950 shadow-2xs">
                                  <Clock className="w-3 h-3 text-orange-600 animate-pulse" />
                                  <span>In Review</span>
                                </span>
                              )}
                              {(!rec.status || rec.status === 'pending') && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-yellow-100 border-2 border-yellow-400 text-yellow-950 shadow-2xs">
                                  <Clock className="w-3 h-3 text-yellow-700" />
                                  <span>Pending</span>
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
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 5: EXPECTED DATA (EMPLOYEE VIEW & STATUS SELECTOR: INTERESTED / NOT INTERESTED) */}
        {/* ======================================================================= */}
        {activeTab === 'expected-data' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFBEB] border-2 border-amber-300 shadow-md space-y-6">
              
              {/* Header & KPI Summary */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-200">
                <div>
                  <h2 className="font-extrabold text-xl text-amber-950 flex items-center gap-2.5">
                    <Target className="w-5 h-5 text-amber-700" />
                    <span>My Expected Data Prospects</span>
                  </h2>
                  <p className="text-xs text-amber-800 mt-1">
                    Client prospects assigned by administration. Review contact details and mark status as <strong>Interested</strong> or <strong>Not Interested</strong>.
                  </p>
                </div>

                <button
                  onClick={loadExpectedData}
                  className="px-3.5 py-2 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 self-start md:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingExpectedData ? 'animate-spin' : ''}`} />
                  <span>Sync Expected Data</span>
                </button>
              </div>

              {/* KPI Quick Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-amber-300 shadow-xs">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    Total Assigned
                  </span>
                  <div className="text-xl font-extrabold text-amber-950 font-mono mt-0.5">
                    {totalExpectedAssigned}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-emerald-300 shadow-xs">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Interested
                  </span>
                  <div className="text-xl font-extrabold text-emerald-700 font-mono mt-0.5">
                    {totalInterested}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-red-300 shadow-xs">
                  <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block">
                    Not Interested
                  </span>
                  <div className="text-xl font-extrabold text-red-700 font-mono mt-0.5">
                    {totalNotInterested}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-amber-300 shadow-xs">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    Pending Action
                  </span>
                  <div className="text-xl font-extrabold text-amber-800 font-mono mt-0.5">
                    {totalPendingAction}
                  </div>
                </div>
              </div>

              {/* Toast / Notification on status change */}
              {expectedFeedbackMsg && (
                <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{expectedFeedbackMsg.text}</span>
                </div>
              )}

              {/* Filters Bar */}
              <div className="p-4 rounded-2xl bg-white border border-amber-300 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                  <Filter className="w-4 h-4 text-amber-700" />
                  <span>Filter Expected Leads</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={expectedSearch}
                      onChange={(e) => setExpectedSearch(e.target.value)}
                      placeholder="Search business, location, number..."
                      className="w-full bg-amber-50/50 border border-amber-200 focus:border-amber-500 rounded-xl pl-8 pr-3 py-2 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      value={expectedStatusFilter}
                      onChange={(e) => setExpectedStatusFilter(e.target.value as any)}
                      className="w-full bg-amber-50/50 border border-amber-200 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none cursor-pointer"
                    >
                      <option value="all">All Statuses ({expectedDataList.length})</option>
                      <option value="Interested">Interested ({totalInterested})</option>
                      <option value="Not Interested">Not Interested ({totalNotInterested})</option>
                      <option value="Pending">Pending ({totalPendingAction})</option>
                    </select>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <select
                      value={expectedDateFilter}
                      onChange={(e) => setExpectedDateFilter(e.target.value)}
                      className="w-full bg-amber-50/50 border border-amber-200 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none cursor-pointer"
                    >
                      <option value="all">All Dates</option>
                      {expectedUniqueDates.map((dt) => (
                        <option key={dt} value={dt}>
                          {dt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <select
                      value={expectedLocationFilter}
                      onChange={(e) => setExpectedLocationFilter(e.target.value)}
                      className="w-full bg-amber-50/50 border border-amber-200 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none cursor-pointer"
                    >
                      <option value="all">All Locations</option>
                      {expectedUniqueLocations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Reset Filters button */}
                {(expectedSearch || expectedStatusFilter !== 'all' || expectedDateFilter !== 'all' || expectedLocationFilter !== 'all') && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        setExpectedSearch('');
                        setExpectedStatusFilter('all');
                        setExpectedDateFilter('all');
                        setExpectedLocationFilter('all');
                      }}
                      className="text-xs text-amber-900 hover:text-purple-900 font-bold underline cursor-pointer"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-2xl border border-amber-300 bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-amber-100/90 text-amber-950 font-mono uppercase text-[10px] font-bold border-b border-amber-300">
                    <tr>
                      <th className="px-3.5 py-3">Business Name</th>
                      <th className="px-3.5 py-3">Location</th>
                      <th className="px-3.5 py-3">Contact Number</th>
                      <th className="px-3.5 py-3">Assigned Date</th>
                      <th className="px-3.5 py-3">Current Status</th>
                      <th className="px-3.5 py-3 text-center">Select Status & Submit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {loadingExpectedData ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-amber-800">
                          <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <span>Loading Assigned Expected Leads...</span>
                        </td>
                      </tr>
                    ) : filteredExpectedData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-amber-800">
                          <Target className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                          <p className="font-bold text-amber-950">No expected data records found.</p>
                          <p className="text-[11px] text-amber-800 mt-0.5">
                            {expectedDataList.length === 0
                              ? `Admin has not assigned any expected data entries to your Corporate ID (${corporateId}) yet.`
                              : 'No records matched your selected search filters.'}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredExpectedData.map((item) => {
                        const isUpdating = updatingExpectedId === item.id;
                        const currentSelectVal =
                          selectedExpectedStatuses[item.id] ||
                          (item.status === 'Not Interested' ? 'Not Interested' : 'Interested');
                        return (
                          <tr key={item.id} className="hover:bg-amber-50/80 transition-colors">
                            
                            {/* Business Name */}
                            <td className="px-3.5 py-3 font-bold text-zinc-900">
                              <div className="flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                <span>{item.businessName}</span>
                              </div>
                            </td>

                            {/* Location */}
                            <td className="px-3.5 py-3 text-zinc-700">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span>{item.location}</span>
                              </div>
                            </td>

                            {/* Contact Number */}
                            <td className="px-3.5 py-3 font-mono text-zinc-800 whitespace-nowrap">
                              <a
                                href={`tel:${item.number}`}
                                className="inline-flex items-center gap-1.5 text-purple-900 font-bold hover:underline"
                                title="Click to call"
                              >
                                <PhoneCall className="w-3.5 h-3.5 text-purple-700" />
                                <span>{item.number}</span>
                              </a>
                            </td>

                            {/* Date */}
                            <td className="px-3.5 py-3 font-mono text-zinc-700 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span>{item.date}</span>
                              </div>
                            </td>

                            {/* Current Status Badge */}
                            <td className="px-3.5 py-3 whitespace-nowrap">
                              {item.status === 'Interested' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 border border-emerald-400 text-emerald-900 shadow-2xs">
                                  <ThumbsUp className="w-3 h-3 text-emerald-700" />
                                  <span>Interested</span>
                                </span>
                              )}
                              {item.status === 'Not Interested' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-red-100 border border-red-400 text-red-900 shadow-2xs">
                                  <ThumbsDown className="w-3 h-3 text-red-700" />
                                  <span>Not Interested</span>
                                </span>
                              )}
                              {(!item.status || item.status === 'Pending') && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 border border-amber-400 text-amber-900 shadow-2xs">
                                  <Clock className="w-3 h-3 text-amber-700 animate-pulse" />
                                  <span>Pending Response</span>
                                </span>
                              )}
                            </td>

                            {/* Select Status & Submit Action */}
                            <td className="px-3.5 py-3 text-center whitespace-nowrap">
                              <div className="inline-flex items-center gap-2 p-1.5 bg-amber-100/90 border border-amber-300 rounded-2xl shadow-2xs">
                                
                                {/* Status Selector Dropdown */}
                                <select
                                  disabled={isUpdating}
                                  value={currentSelectVal}
                                  onChange={(e) => {
                                    const val = e.target.value as 'Interested' | 'Not Interested';
                                    setSelectedExpectedStatuses((prev) => ({ ...prev, [item.id]: val }));
                                  }}
                                  className="bg-white border border-amber-300 text-amber-950 font-bold text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-purple-600 cursor-pointer shadow-2xs"
                                >
                                  <option value="Interested">👍 Interested</option>
                                  <option value="Not Interested">👎 Not Interested</option>
                                </select>

                                {/* Submit Button */}
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() => handleEmployeeExpectedStatusSubmit(item, currentSelectVal)}
                                  className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-[#3B0764] hover:bg-purple-900 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                                  title="Submit Status to Firestore"
                                >
                                  {isUpdating ? (
                                    <>
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                                      <span>Saving...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-amber-300" />
                                      <span>Submit</span>
                                    </>
                                  )}
                                </button>

                              </div>
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
        {/* TAB 6: DATA REPORT (READ-ONLY ASSIGNED LEADS) */}
        {/* ======================================================================= */}
        {activeTab === 'data-report' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFBEB] border-2 border-amber-300 shadow-md space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-amber-200">
                <div>
                  <h3 className="font-extrabold text-base text-amber-950 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-amber-700" />
                    <span>Assigned Client Data Reports</span>
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Client leads and service requirements allocated to your Corporate ID
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={reportSearch}
                      onChange={(e) => setReportSearch(e.target.value)}
                      placeholder="Search reports..."
                      className="w-48 sm:w-64 bg-white border border-amber-300 focus:border-amber-600 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <button
                    onClick={loadReports}
                    className="p-2 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
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

        {/* MODAL POPUPS FOR NOTIFICATIONS, NOTICES, AND LEADERBOARD */}
        {isNotificationsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
              <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 text-white flex items-center justify-between border-b border-amber-400/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center font-bold">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-amber-300">
                      My Notifications
                    </h3>
                    <p className="text-[11px] text-purple-200">
                      Direct alerts, attendance confirmations & task assignments
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsNotificationsModalOpen(false);
                    loadDashboardExtras();
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-amber-50/40">
                <CorporateNotificationsSection />
              </div>
            </div>
          </div>
        )}

        {isNoticesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
              <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 text-white flex items-center justify-between border-b border-amber-400/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center font-bold">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-amber-300">
                      Company Circulars & Notices
                    </h3>
                    <p className="text-[11px] text-purple-200">
                      Agency administrative directives and team announcements
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsNoticesModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-amber-50/40">
                <CorporateNoticesSection />
              </div>
            </div>
          </div>
        )}

        {isLeaderboardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border-2 border-amber-500 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
              <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-purple-950 flex items-center justify-between border-b-2 border-amber-400 relative overflow-hidden">
                <div className="absolute inset-0 w-1/2 bg-white/30 skew-x-[-20deg] animate-shine-sweep pointer-events-none" />
                <div className="flex items-center gap-2.5 relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-purple-950 text-amber-300 flex items-center justify-center font-black shadow-md">
                    <Trophy className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-sm sm:text-base text-purple-950 uppercase tracking-wide">
                        Enterprise Sales Leaderboard
                      </h3>
                      <Crown className="w-4 h-4 text-amber-950 fill-amber-700" />
                    </div>
                    <p className="text-[11px] text-purple-900 font-bold">
                      Real-time rankings based on completed transactions and revenue quota
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLeaderboardModalOpen(false)}
                  className="p-2 rounded-xl bg-purple-950/10 hover:bg-purple-950/20 text-purple-950 transition-all cursor-pointer relative z-10"
                >
                  <X className="w-5 h-5 font-bold" />
                </button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-amber-50/40">
                <CorporateLeaderboardSection />
              </div>
            </div>
          </div>
        )}

        {/* AI CORPORATE SUPPORT / HELP DESK CHAT MODAL */}
        <CorporateAiSupport
          isOpen={isAiSupportOpen}
          onClose={() => setIsAiSupportOpen(false)}
        />

        {/* FLOATING QUICK AI HELP BUTTON (BOTTOM RIGHT) */}
        <button
          type="button"
          onClick={() => setIsAiSupportOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-purple-950 via-purple-900 to-amber-500 text-white shadow-2xl border-2 border-amber-400 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2 group animate-bounce"
          title="Walt AI Corporate Help Desk & Sales Assistant"
        >
          <Bot className="w-6 h-6 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span className="font-extrabold text-xs text-amber-200 pr-1 hidden sm:inline">AI Help Desk</span>
        </button>

      </main>
    </div>
  );
};
