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
  RefreshCw,
  Edit3,
  Save,
  Briefcase,
  XCircle,
  FileSpreadsheet,
  Search,
  Eye,
  EyeOff,
  UserPlus,
  Users,
  Copy,
  Check,
  Building,
  CheckSquare,
  Trash2,
  Send,
  Target,
  ThumbsUp,
  ThumbsDown,
  Filter,
  PhoneCall,
} from 'lucide-react';
import {
  useAuth,
  UserProfile,
  AttendanceRecord,
  DailyReportItem,
  ExpectedDataItem,
} from '../context/AuthContext';
import { AGENCY_INFO } from '../data/agencyData';

type AdminTab = 'dashboard' | 'profile' | 'portfolio' | 'corporate-registration' | 'attendance' | 'daily-report' | 'expected-data';

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
    createExpectedData,
    fetchAdminExpectedData,
    updateExpectedDataStatus,
    deleteExpectedData,
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

  // Expected Data state
  const [expectedDataList, setExpectedDataList] = useState<ExpectedDataItem[]>([]);
  const [loadingExpectedData, setLoadingExpectedData] = useState(false);
  const [expectedSearchQuery, setExpectedSearchQuery] = useState('');
  const [expectedFilterEmployee, setExpectedFilterEmployee] = useState<string>('all');
  const [expectedFilterStatus, setExpectedFilterStatus] = useState<string>('all');
  const [expectedFilterDate, setExpectedFilterDate] = useState<string>('all');
  const [expectedFilterLocation, setExpectedFilterLocation] = useState<string>('all');
  const [expectedActionId, setExpectedActionId] = useState<string | null>(null);

  // Expected Data creation form state
  const getTodayLocalStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [expectedBusinessName, setExpectedBusinessName] = useState<string>('');
  const [expectedLocation, setExpectedLocation] = useState<string>('');
  const [expectedNumber, setExpectedNumber] = useState<string>('');
  const [expectedDate, setExpectedDate] = useState<string>(getTodayLocalStr());
  const [expectedSelectedEmployeeUid, setExpectedSelectedEmployeeUid] = useState<string>('');
  const [expectedStatus, setExpectedStatus] = useState<'Pending' | 'Interested' | 'Not Interested'>('Pending');
  const [expectedFormError, setExpectedFormError] = useState<string | null>(null);
  const [isCreatingExpected, setIsCreatingExpected] = useState<boolean>(false);

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
    loadExpectedData();
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

  const loadExpectedData = async () => {
    setLoadingExpectedData(true);
    try {
      const list = await fetchAdminExpectedData();
      setExpectedDataList(list);
    } catch (err) {
      console.error('Failed to load admin expected data:', err);
    } finally {
      setLoadingExpectedData(false);
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

  // =========================================================================
  // EXPECTED DATA OPERATIONS
  // =========================================================================

  // Admin: Create Expected Data and assign to employee
  const handleCreateExpectedDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setExpectedFormError(null);

    if (!expectedSelectedEmployeeUid) {
      setExpectedFormError('Please select a corporate employee. Employee selection is mandatory.');
      return;
    }

    if (!expectedBusinessName.trim() || !expectedLocation.trim() || !expectedNumber.trim()) {
      setExpectedFormError('Please fill in all mandatory fields (Business Name, Location, Contact Number).');
      return;
    }

    const assignedEmp = corporateList.find((c) => c.uid === expectedSelectedEmployeeUid);
    if (!assignedEmp) {
      setExpectedFormError('Selected corporate employee profile not found.');
      return;
    }

    setIsCreatingExpected(true);
    try {
      const res = await createExpectedData({
        businessName: expectedBusinessName.trim(),
        location: expectedLocation.trim(),
        number: expectedNumber.trim(),
        date: expectedDate.trim() || getTodayLocalStr(),
        status: expectedStatus || 'Pending',
        assignedEmployeeUid: assignedEmp.uid,
        assignedEmployeeCode: assignedEmp.corporateUserId || 'WDS-CORP',
        assignedEmployeeName: assignedEmp.name || 'Corporate Employee',
      });

      if (res.success) {
        setUpdateSuccess(`Expected Data for "${expectedBusinessName.trim()}" created & assigned to ${assignedEmp.name} (${assignedEmp.corporateUserId})!`);
        // Reset form fields
        setExpectedBusinessName('');
        setExpectedLocation('');
        setExpectedNumber('');
        setExpectedDate(getTodayLocalStr());
        setExpectedSelectedEmployeeUid('');
        setExpectedStatus('Pending');
        await loadExpectedData();
        setTimeout(() => setUpdateSuccess(null), 4000);
      } else {
        setExpectedFormError(res.error || 'Failed to create expected data entry.');
      }
    } catch (err: any) {
      setExpectedFormError(err?.message || 'An error occurred while creating expected data entry.');
    } finally {
      setIsCreatingExpected(false);
    }
  };

  // Admin: Update Expected Data Status (Interested / Not Interested / Pending)
  const handleAdminUpdateExpectedStatus = async (
    id: string,
    newStatus: 'Pending' | 'Interested' | 'Not Interested'
  ) => {
    setExpectedActionId(id);
    try {
      const res = await updateExpectedDataStatus(id, newStatus);
      if (res.success) {
        setExpectedDataList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        setUpdateSuccess(`Expected data status updated to '${newStatus}'.`);
        setTimeout(() => setUpdateSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Failed to update expected data status:', err);
    } finally {
      setExpectedActionId(null);
    }
  };

  // Admin: Delete Expected Data Entry
  const handleDeleteExpectedData = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this Expected Data entry?')) return;
    setExpectedActionId(id);
    try {
      const res = await deleteExpectedData(id);
      if (res.success) {
        setExpectedDataList((prev) => prev.filter((item) => item.id !== id));
        setUpdateSuccess('Expected Data entry deleted successfully.');
        setTimeout(() => setUpdateSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Failed to delete expected data entry:', err);
    } finally {
      setExpectedActionId(null);
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
    const text = `WALT DESIGNS & STUDIO - CORPORATE ACCESS CREDENTIALS\nName: ${createdUser.name}\nDesignation: ${createdUser.role}\nCorporate User ID: ${createdUser.corporateUserId}\nEmail: ${createdUser.email}\nPassword: ${createdUser.password}\nPortal URL: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  // Calculations for KPI summaries
  const pendingAttendanceCount = attendanceList.filter((a) => a.status === 'pending').length;
  const approvedAttendanceCount = attendanceList.filter((a) => a.status === 'approved').length;

  const totalExpectedCount = expectedDataList.length;
  const expectedInterestedCount = expectedDataList.filter((i) => i.status === 'Interested').length;
  const expectedNotInterestedCount = expectedDataList.filter((i) => i.status === 'Not Interested').length;
  const expectedPendingCount = expectedDataList.filter((i) => i.status === 'Pending' || !i.status).length;

  const expectedUniqueLocations = Array.from(
    new Set(expectedDataList.map((i) => i.location).filter(Boolean))
  );
  const expectedUniqueDates = Array.from(
    new Set(expectedDataList.map((i) => i.date).filter(Boolean))
  );

  const filteredExpectedList = expectedDataList.filter((item) => {
    const matchesEmployee =
      expectedFilterEmployee === 'all' || item.assignedEmployeeUid === expectedFilterEmployee;

    const matchesStatus =
      expectedFilterStatus === 'all' || item.status === expectedFilterStatus;

    const matchesDate =
      expectedFilterDate === 'all' || item.date === expectedFilterDate;

    const matchesLocation =
      expectedFilterLocation === 'all' || item.location === expectedFilterLocation;

    const q = expectedSearchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.businessName.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.number.toLowerCase().includes(q) ||
      (item.assignedEmployeeName && item.assignedEmployeeName.toLowerCase().includes(q)) ||
      (item.assignedEmployeeCode && item.assignedEmployeeCode.toLowerCase().includes(q));

    return matchesEmployee && matchesStatus && matchesDate && matchesLocation && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#FCE7F3] text-purple-950 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      
      {/* ========================================================================= */}
      {/* PURPLE HEADER FOR ADMIN DASHBOARD */}
      {/* ========================================================================= */}
      <header className="bg-[#3B0764] text-white border-b border-purple-900 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* Brand Title */}
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
                    Admin Executive
                  </span>
                </div>
                <p className="text-xs text-purple-200 font-mono">
                  Super Administrator Control Center • {user?.email}
                </p>
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  loadCorporateData();
                  loadAttendanceData();
                  loadDailyReports();
                  loadExpectedData();
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-100 hover:text-white transition-all cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-semibold"
                title="Refresh All Database Records"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-pink-300 ${loadingUsers ? 'animate-spin' : ''}`} />
                <span>Sync Data</span>
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

            {/* NEW EXPECTED DATA TAB */}
            <button
              onClick={() => setActiveTab('expected-data')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'expected-data'
                  ? 'bg-pink-500 text-white shadow-md font-extrabold'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Expected Data</span>
              {expectedDataList.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'expected-data' ? 'bg-purple-950 text-pink-300' : 'bg-purple-800 text-white'
                }`}>
                  {expectedDataList.length}
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

        {/* Global Toast Success Message */}
        {updateSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-semibold flex items-center gap-2.5 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{updateSuccess}</span>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ======================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Top Metrics Cards in Baby Pink Frame */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-6 rounded-3xl bg-[#FDF2F8] border border-pink-300 shadow-sm">
                <div className="flex items-center justify-between text-pink-900 text-xs font-bold mb-2">
                  <span>Registered Corporate Staff</span>
                  <Users className="w-5 h-5 text-pink-600" />
                </div>
                <div className="text-3xl font-extrabold text-purple-950 font-mono">
                  {corporateList.length}
                </div>
                <button
                  onClick={() => setActiveTab('corporate-registration')}
                  className="text-[11px] text-pink-700 hover:text-purple-900 font-bold mt-2 inline-flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3 h-3" /> Register new employee →
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-[#FDF2F8] border border-pink-300 shadow-sm">
                <div className="flex items-center justify-between text-pink-900 text-xs font-bold mb-2">
                  <span>Pending Attendance</span>
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-3xl font-extrabold text-amber-700 font-mono">
                  {pendingAttendanceCount}
                </div>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="text-[11px] text-pink-700 hover:text-purple-900 font-bold mt-2 inline-flex items-center gap-1 cursor-pointer"
                >
                  Review daily logs ({attendanceList.length} total) →
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-[#FDF2F8] border border-pink-300 shadow-sm">
                <div className="flex items-center justify-between text-pink-900 text-xs font-bold mb-2">
                  <span>Expected Data Leads</span>
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-3xl font-extrabold text-purple-950 font-mono flex items-center gap-2">
                  <span>{expectedDataList.length}</span>
                  <span className="text-xs font-normal text-emerald-700 font-sans">({expectedInterestedCount} interested)</span>
                </div>
                <button
                  onClick={() => setActiveTab('expected-data')}
                  className="text-[11px] text-pink-700 hover:text-purple-900 font-bold mt-2 inline-flex items-center gap-1 cursor-pointer"
                >
                  Manage expected leads →
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-[#FDF2F8] border border-pink-300 shadow-sm">
                <div className="flex items-center justify-between text-pink-900 text-xs font-bold mb-2">
                  <span>Daily Data Reports</span>
                  <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-3xl font-extrabold text-purple-950 font-mono">
                  {dailyReportList.length}
                </div>
                <button
                  onClick={() => setActiveTab('daily-report')}
                  className="text-[11px] text-pink-700 hover:text-purple-900 font-bold mt-2 inline-flex items-center gap-1 cursor-pointer"
                >
                  Manage client reports →
                </button>
              </div>

            </div>

            {/* Quick Actions & Recent Employees Table */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FDF2F8] border-2 border-pink-300 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-lg text-purple-950 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-pink-600" />
                    <span>Active Corporate Representatives</span>
                  </h3>
                  <p className="text-xs text-pink-900/80 mt-0.5">
                    Live roster of authorized sales staff and performance status
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('corporate-registration')}
                  className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register Employee</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-pink-300 bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-pink-100 text-purple-950 font-mono uppercase text-[10px] font-bold border-b border-pink-300">
                    <tr>
                      <th className="px-3.5 py-3">Corporate ID</th>
                      <th className="px-3.5 py-3">Name</th>
                      <th className="px-3.5 py-3">Email</th>
                      <th className="px-3.5 py-3">Designation</th>
                      <th className="px-3.5 py-3">Location</th>
                      <th className="px-3.5 py-3">Sales Income</th>
                      <th className="px-3.5 py-3">Target Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-pink-800">
                          <div className="w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <span>Loading corporate accounts...</span>
                        </td>
                      </tr>
                    ) : corporateList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-pink-800">
                          <Users className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                          <p className="font-bold">No corporate users registered yet.</p>
                          <p className="text-[11px] mt-0.5">Use "Corporate Registration" to create staff credentials.</p>
                        </td>
                      </tr>
                    ) : (
                      corporateList.slice(0, 5).map((corp) => (
                        <tr key={corp.uid} className="hover:bg-pink-50/80 transition-colors">
                          <td className="px-3.5 py-3 font-mono font-bold text-purple-950">
                            {corp.corporateUserId || 'WDS-ACTIVE'}
                          </td>
                          <td className="px-3.5 py-3 font-bold text-zinc-900">
                            {corp.name}
                          </td>
                          <td className="px-3.5 py-3 font-mono text-zinc-700">
                            {corp.email}
                          </td>
                          <td className="px-3.5 py-3 text-zinc-800">
                            {corp.corporateRole || 'Asst. Sales Manager'}
                          </td>
                          <td className="px-3.5 py-3 text-zinc-700">
                            {corp.location || 'Pan-India Corporate'}
                          </td>
                          <td className="px-3.5 py-3 font-mono font-bold text-emerald-700">
                            ₹{(corp.income || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="px-3.5 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-zinc-900">{corp.progress || 0}%</span>
                              <div className="w-16 bg-pink-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-pink-600 h-full rounded-full"
                                  style={{ width: `${Math.min(corp.progress || 0, 100)}%` }}
                                />
                              </div>
                            </div>
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
        {/* TAB 2: ADMIN PROFILE & PASSWORD MANAGEMENT */}
        {/* ======================================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
            
            {/* Admin Profile Details Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FDF2F8] border-2 border-pink-300 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-200">
                <div>
                  <h2 className="font-extrabold text-xl text-purple-950 flex items-center gap-2">
                    <User className="w-5 h-5 text-pink-600" />
                    <span>Administrator Profile Settings</span>
                  </h2>
                  <p className="text-xs text-pink-900 mt-0.5">
                    Manage executive identity and super-user contact credentials
                  </p>
                </div>

                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>
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
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                  )}
                  <span>{profileMessage.text}</span>
                </div>
              )}

              {!isEditingProfile ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-pink-300 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-pink-900 uppercase tracking-wider block">Role</span>
                    <div className="font-mono text-base font-extrabold text-purple-950 flex items-center gap-2">
                      <span>SUPER ADMINISTRATOR</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-800 border border-pink-300">
                        Root Executive
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-pink-300 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-pink-900 uppercase tracking-wider block">Name</span>
                    <div className="text-base font-extrabold text-zinc-900">{profile?.name || 'Priyanshu Kumar'}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-pink-300 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-pink-900 uppercase tracking-wider block">Official Email</span>
                    <div className="font-mono text-xs font-semibold text-zinc-800">{user?.email}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-pink-300 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-pink-900 uppercase tracking-wider block">Phone Number</span>
                    <div className="font-mono text-sm font-semibold text-zinc-800">{profile?.phone || 'Not configured'}</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveAdminProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-purple-950">Display Name</label>
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        placeholder="Administrator Name"
                        className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-purple-950">Phone Number</label>
                      <input
                        type="text"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-extrabold shadow-md cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                    >
                      {isUpdatingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Change Password Card with Hide & Show toggles */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FDF2F8] border-2 border-pink-300 shadow-md space-y-4">
              <div>
                <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-pink-600" />
                  <span>Update Admin Password</span>
                </h3>
                <p className="text-xs text-pink-900 mt-0.5">
                  Change your secure administrative access credentials
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
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                  )}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleChangeAdminPassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl pl-3 pr-9 py-2 text-xs text-zinc-900 outline-none"
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

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl pl-3 pr-9 py-2 text-xs text-zinc-900 outline-none"
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

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950">Confirm New</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl pl-3 pr-9 py-2 text-xs text-zinc-900 outline-none"
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

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-extrabold shadow-md cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    {isChangingPassword ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 3: PORTFOLIO / STAFF PERFORMANCE */}
        {/* ======================================================================= */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FDF2F8] border-2 border-pink-300 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-pink-600" />
                    <span>Corporate Staff Portfolio & Performance Indices</span>
                  </h3>
                  <p className="text-xs text-pink-900 mt-0.5">
                    Adjust employee sales income figures and monthly target progress metrics
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search staff name, code, email..."
                    className="w-full sm:w-64 bg-white border border-pink-300 focus:border-pink-600 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-900 outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-pink-300 bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-pink-100 text-purple-950 font-mono uppercase text-[10px] font-bold border-b border-pink-300">
                    <tr>
                      <th className="px-3.5 py-3">Corporate ID</th>
                      <th className="px-3.5 py-3">Employee Details</th>
                      <th className="px-3.5 py-3">Designation</th>
                      <th className="px-3.5 py-3">Sales Income (₹)</th>
                      <th className="px-3.5 py-3">Target Progress (%)</th>
                      <th className="px-3.5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-pink-800">
                          <div className="w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <span>Loading performance data...</span>
                        </td>
                      </tr>
                    ) : corporateList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-pink-800">
                          <Users className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                          <p className="font-bold">No staff records available.</p>
                        </td>
                      </tr>
                    ) : (
                      corporateList
                        .filter((c) => {
                          const q = searchQuery.toLowerCase().trim();
                          return (
                            !q ||
                            c.name.toLowerCase().includes(q) ||
                            c.email.toLowerCase().includes(q) ||
                            (c.corporateUserId && c.corporateUserId.toLowerCase().includes(q))
                          );
                        })
                        .map((corp) => {
                          const isEditing = editingUid === corp.uid;
                          return (
                            <tr key={corp.uid} className="hover:bg-pink-50/80 transition-colors">
                              <td className="px-3.5 py-3 font-mono font-bold text-purple-950">
                                {corp.corporateUserId || 'WDS-ACTIVE'}
                              </td>
                              <td className="px-3.5 py-3">
                                <div className="font-bold text-zinc-900">{corp.name}</div>
                                <div className="font-mono text-[11px] text-zinc-600">{corp.email}</div>
                              </td>
                              <td className="px-3.5 py-3 text-zinc-800">
                                {corp.corporateRole || 'Asst. Sales Manager'}
                              </td>
                              
                              {/* Income Edit */}
                              <td className="px-3.5 py-3">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    min={0}
                                    value={editIncome}
                                    onChange={(e) => setEditIncome(Number(e.target.value))}
                                    className="w-28 bg-pink-50 border border-pink-300 rounded-lg px-2 py-1 text-xs font-mono font-bold text-purple-950 outline-none"
                                  />
                                ) : (
                                  <span className="font-mono font-bold text-emerald-700">
                                    ₹{(corp.income || 0).toLocaleString('en-IN')}
                                  </span>
                                )}
                              </td>

                              {/* Progress Edit */}
                              <td className="px-3.5 py-3">
                                {isEditing ? (
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      value={editProgress}
                                      onChange={(e) => setEditProgress(Number(e.target.value))}
                                      className="w-20 bg-pink-50 border border-pink-300 rounded-lg px-2 py-1 text-xs font-mono font-bold text-purple-950 outline-none"
                                    />
                                    <span className="text-xs font-mono text-zinc-600">%</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold text-zinc-900">{corp.progress || 0}%</span>
                                    <div className="w-16 bg-pink-100 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className="bg-pink-600 h-full rounded-full"
                                        style={{ width: `${Math.min(corp.progress || 0, 100)}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="px-3.5 py-3 text-right">
                                {isEditing ? (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleSaveProgress(corp.uid)}
                                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs transition-colors cursor-pointer"
                                      title="Save milestones"
                                    >
                                      <Save className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setEditingUid(null)}
                                      className="p-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs transition-colors cursor-pointer"
                                      title="Cancel"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleStartEdit(corp)}
                                    className="p-1.5 rounded-lg bg-pink-200 hover:bg-pink-300 text-purple-950 text-xs transition-colors cursor-pointer"
                                    title="Edit sales milestones"
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
        {/* TAB 4: CORPORATE REGISTRATION (PROVISION NEW STAFF) */}
        {/* ======================================================================= */}
        {activeTab === 'corporate-registration' && (
          <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
            
            {/* Created Staff Account Credentials Card (If just created) */}
            {createdUser && (
              <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <h3 className="font-extrabold text-sm text-emerald-950">
                      Corporate Staff Account Created Successfully!
                    </h3>
                  </div>
                  <button
                    onClick={copyCreatedCredentials}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedNotification ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNotification ? 'Copied!' : 'Copy Credentials'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-white border border-emerald-300 shadow-xs">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Employee Name</span>
                    <span className="font-extrabold text-xs text-zinc-900">{createdUser.name}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-emerald-300 shadow-xs">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Corporate User ID</span>
                    <span className="font-mono font-extrabold text-xs text-purple-950">{createdUser.corporateUserId}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-emerald-300 shadow-xs">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Login Email</span>
                    <span className="font-mono text-xs text-zinc-800 truncate block">{createdUser.email}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-emerald-300 shadow-xs">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Assigned Password</span>
                    <span className="font-mono font-extrabold text-xs text-red-700">{createdUser.password}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Form Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FDF2F8] border-2 border-pink-300 shadow-md space-y-4">
              <div>
                <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-pink-600" />
                  <span>Register New Corporate Staff Representative</span>
                </h3>
                <p className="text-xs text-pink-900 mt-0.5">
                  Generate official WDS employee credentials with automated corporate identifier
                </p>
              </div>

              {regError && (
                <div className="p-3 rounded-xl bg-red-100 border border-red-400 text-red-900 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleCorporateRegistration} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Priyanshu Kumar"
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950">Contact Phone *</label>
                    <input
                      type="text"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950">Official Email *</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="staff@waltdesigns.com"
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950">Password *</label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl pl-3.5 pr-9 py-2 text-xs text-zinc-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 p-1 cursor-pointer"
                        title={showRegPassword ? 'Hide password' : 'Show password'}
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950">Designation / Role</label>
                    <input
                      type="text"
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      placeholder="Asst. Sales Manager"
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950">Territory / Location</label>
                    <input
                      type="text"
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      placeholder="e.g. Mumbai Corporate HQ"
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950">Initial Sales Income (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={regIncome}
                      onChange={(e) => setRegIncome(Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950">Initial Target Progress (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={regProgress}
                      onChange={(e) => setRegProgress(Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none font-mono"
                    />
                  </div>

                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isRegistering ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Provisioning Corporate Account...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Create Corporate Staff Credentials</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 5: ATTENDANCE MANAGEMENT (ADMIN REVIEW & ACTIONS) */}
        {/* ======================================================================= */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FDF2F8] border-2 border-pink-300 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-pink-200">
                <div>
                  <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-pink-600" />
                    <span>Employee Daily Attendance Records</span>
                  </h3>
                  <p className="text-xs text-pink-900 mt-0.5">
                    Review, approve, and track staff working hours and client outreach
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Filter */}
                  <select
                    value={attendanceFilter}
                    onChange={(e) => setAttendanceFilter(e.target.value as any)}
                    className="bg-white border border-pink-300 rounded-xl px-3 py-1.5 text-xs text-purple-950 font-bold outline-none cursor-pointer"
                  >
                    <option value="all">All Statuses ({attendanceList.length})</option>
                    <option value="pending">Pending ({pendingAttendanceCount})</option>
                    <option value="approved">Approved ({approvedAttendanceCount})</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <button
                    onClick={loadAttendanceData}
                    className="p-2 rounded-xl bg-pink-200 hover:bg-pink-300 text-purple-950 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingAttendance ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-pink-300 bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-pink-100 text-purple-950 font-mono uppercase text-[10px] font-bold border-b border-pink-300">
                    <tr>
                      <th className="px-3.5 py-3">Date</th>
                      <th className="px-3.5 py-3">Corporate ID</th>
                      <th className="px-3.5 py-3">Staff Name</th>
                      <th className="px-3.5 py-3">Work Hours</th>
                      <th className="px-3.5 py-3">Expected Clients</th>
                      <th className="px-3.5 py-3">Current Status</th>
                      <th className="px-3.5 py-3 text-right">Approval Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100">
                    {loadingAttendance ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-pink-800">
                          <div className="w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <span>Loading attendance logs...</span>
                        </td>
                      </tr>
                    ) : attendanceList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-pink-800">
                          <Calendar className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                          <p className="font-bold">No attendance records submitted yet.</p>
                        </td>
                      </tr>
                    ) : (
                      attendanceList
                        .filter((item) => attendanceFilter === 'all' || item.status === attendanceFilter)
                        .map((rec) => {
                          const isProcessing = attendanceActionId === rec.id;
                          return (
                            <tr key={rec.id} className="hover:bg-pink-50/80 transition-colors">
                              <td className="px-3.5 py-3 font-mono font-bold text-purple-950 whitespace-nowrap">
                                {rec.date}
                              </td>
                              <td className="px-3.5 py-3 font-mono text-zinc-700">
                                {rec.employeeCode}
                              </td>
                              <td className="px-3.5 py-3 font-bold text-zinc-900">
                                {rec.userName}
                              </td>
                              <td className="px-3.5 py-3 font-mono font-bold text-zinc-900">
                                {rec.todayWorkHours} hrs
                              </td>
                              <td className="px-3.5 py-3 font-mono text-zinc-800">
                                {rec.expectedClients} clients
                              </td>
                              <td className="px-3.5 py-3 whitespace-nowrap">
                                {rec.status === 'pending' && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 border border-amber-400 text-amber-900">
                                    <Clock className="w-3 h-3 text-amber-700 animate-pulse" />
                                    <span>Pending</span>
                                  </span>
                                )}
                                {rec.status === 'approved' && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 border border-emerald-400 text-emerald-900">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                    <span>Approved</span>
                                  </span>
                                )}
                                {rec.status === 'rejected' && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 border border-red-400 text-red-900">
                                    <XCircle className="w-3 h-3 text-red-700" />
                                    <span>Rejected</span>
                                  </span>
                                )}
                              </td>
                              <td className="px-3.5 py-3 text-right whitespace-nowrap">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleUpdateAttendanceStatus(rec.id, 'approved')}
                                    disabled={isProcessing || rec.status === 'approved'}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                      rec.status === 'approved'
                                        ? 'bg-emerald-100 text-emerald-800 opacity-60 cursor-not-allowed'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                    }`}
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Approve</span>
                                  </button>

                                  <button
                                    onClick={() => handleUpdateAttendanceStatus(rec.id, 'rejected')}
                                    disabled={isProcessing || rec.status === 'rejected'}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                      rec.status === 'rejected'
                                        ? 'bg-red-100 text-red-800 opacity-60 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                                    }`}
                                  >
                                    <XCircle className="w-3 h-3" />
                                    <span>Reject</span>
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
        {/* TAB 6: EXPECTED DATA MANAGEMENT (CREATE, ASSIGN, FILTER, STATUS SYNC) */}
        {/* ======================================================================= */}
        {activeTab === 'expected-data' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Create Expected Data Entry Form Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FDF2F8] border-2 border-pink-300 shadow-md space-y-4">
              <div>
                <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
                  <Target className="w-4 h-4 text-pink-600" />
                  <span>Create & Assign Expected Data Entry</span>
                </h3>
                <p className="text-xs text-pink-900 mt-0.5">
                  Assign business prospects directly to corporate staff. Once submitted, the lead immediately appears in the selected employee's portal for review.
                </p>
              </div>

              {expectedFormError && (
                <div className="p-3 rounded-xl bg-red-100 border border-red-400 text-red-900 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                  <span>{expectedFormError}</span>
                </div>
              )}

              <form onSubmit={handleCreateExpectedDataSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* Business Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950 block">Business Name *</label>
                    <input
                      type="text"
                      required
                      value={expectedBusinessName}
                      onChange={(e) => setExpectedBusinessName(e.target.value)}
                      placeholder="e.g. Apex Global Logistics"
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none shadow-xs"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950 block">Location *</label>
                    <input
                      type="text"
                      required
                      value={expectedLocation}
                      onChange={(e) => setExpectedLocation(e.target.value)}
                      placeholder="e.g. Bangalore Tech Park"
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none shadow-xs"
                    />
                  </div>

                  {/* Contact Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950 block">Contact Number *</label>
                    <input
                      type="text"
                      required
                      value={expectedNumber}
                      onChange={(e) => setExpectedNumber(e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none font-mono shadow-xs"
                    />
                  </div>

                  {/* Date (Auto-filled with today's date) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950 block">Date (Auto-filled) *</label>
                    <input
                      type="date"
                      required
                      value={expectedDate}
                      onChange={(e) => setExpectedDate(e.target.value)}
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none shadow-xs"
                    />
                  </div>

                  {/* Select Employee (Mandatory) */}
                  <div className="space-y-1 sm:col-span-2 lg:col-span-2">
                    <label className="text-xs font-bold text-purple-950 block">
                      Select Corporate Employee (Mandatory) *
                    </label>
                    <select
                      required
                      value={expectedSelectedEmployeeUid}
                      onChange={(e) => setExpectedSelectedEmployeeUid(e.target.value)}
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none font-medium cursor-pointer shadow-xs"
                    >
                      <option value="">-- Choose Corporate Employee --</option>
                      {corporateList.map((corp) => (
                        <option key={corp.uid} value={corp.uid}>
                          {corp.name} ({corp.corporateUserId || 'WDS-ACTIVE'}) — {corp.corporateRole || 'Sales Rep'}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isCreatingExpected}
                    className="px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isCreatingExpected ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting Expected Data...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Assign Expected Data to Employee</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Expected Data Table & Filters Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FDF2F8] border-2 border-pink-300 shadow-md space-y-4">
              
              {/* Header & Counters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-pink-200">
                <div>
                  <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
                    <Building className="w-4 h-4 text-pink-600" />
                    <span>Expected Data Directory & Status Overview</span>
                  </h3>
                  <p className="text-xs text-pink-900 mt-0.5">
                    Live tracking of employee responses (Interested vs Not Interested)
                  </p>
                </div>

                <button
                  onClick={loadExpectedData}
                  className="p-2 rounded-xl bg-pink-200 hover:bg-pink-300 text-purple-950 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 self-start md:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingExpectedData ? 'animate-spin' : ''}`} />
                  <span>Refresh Expected Data</span>
                </button>
              </div>

              {/* KPI Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-pink-300 shadow-xs">
                  <span className="text-[10px] font-bold text-pink-800 uppercase tracking-wider block">
                    Total Assigned
                  </span>
                  <div className="text-xl font-extrabold text-purple-950 font-mono mt-0.5">
                    {totalExpectedCount}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-emerald-300 shadow-xs">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Interested
                  </span>
                  <div className="text-xl font-extrabold text-emerald-700 font-mono mt-0.5">
                    {expectedInterestedCount}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-red-300 shadow-xs">
                  <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block">
                    Not Interested
                  </span>
                  <div className="text-xl font-extrabold text-red-700 font-mono mt-0.5">
                    {expectedNotInterestedCount}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-amber-300 shadow-xs">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    Pending Action
                  </span>
                  <div className="text-xl font-extrabold text-amber-800 font-mono mt-0.5">
                    {expectedPendingCount}
                  </div>
                </div>
              </div>

              {/* Comprehensive Filter Row */}
              <div className="p-4 rounded-2xl bg-white border border-pink-300 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-950">
                  <Filter className="w-4 h-4 text-pink-600" />
                  <span>Filters</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* Search Query */}
                  <div className="relative lg:col-span-2">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={expectedSearchQuery}
                      onChange={(e) => setExpectedSearchQuery(e.target.value)}
                      placeholder="Search business, location, number, staff..."
                      className="w-full bg-pink-50/50 border border-pink-200 focus:border-pink-500 rounded-xl pl-8 pr-3 py-2 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  {/* Filter by Employee */}
                  <div>
                    <select
                      value={expectedFilterEmployee}
                      onChange={(e) => setExpectedFilterEmployee(e.target.value)}
                      className="w-full bg-pink-50/50 border border-pink-200 focus:border-pink-500 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none cursor-pointer"
                    >
                      <option value="all">All Employees ({corporateList.length})</option>
                      {corporateList.map((c) => (
                        <option key={c.uid} value={c.uid}>
                          {c.name} ({c.corporateUserId || 'WDS'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter by Status */}
                  <div>
                    <select
                      value={expectedFilterStatus}
                      onChange={(e) => setExpectedFilterStatus(e.target.value)}
                      className="w-full bg-pink-50/50 border border-pink-200 focus:border-pink-500 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none cursor-pointer"
                    >
                      <option value="all">All Statuses ({expectedDataList.length})</option>
                      <option value="Interested">Interested ({expectedInterestedCount})</option>
                      <option value="Not Interested">Not Interested ({expectedNotInterestedCount})</option>
                      <option value="Pending">Pending ({expectedPendingCount})</option>
                    </select>
                  </div>

                  {/* Filter by Location */}
                  <div>
                    <select
                      value={expectedFilterLocation}
                      onChange={(e) => setExpectedFilterLocation(e.target.value)}
                      className="w-full bg-pink-50/50 border border-pink-200 focus:border-pink-500 rounded-xl px-3 py-2 text-xs text-zinc-900 outline-none cursor-pointer"
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

                {/* Filter Clear Action */}
                {(expectedSearchQuery || expectedFilterEmployee !== 'all' || expectedFilterStatus !== 'all' || expectedFilterDate !== 'all' || expectedFilterLocation !== 'all') && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        setExpectedSearchQuery('');
                        setExpectedFilterEmployee('all');
                        setExpectedFilterStatus('all');
                        setExpectedFilterDate('all');
                        setExpectedFilterLocation('all');
                      }}
                      className="text-xs text-pink-700 hover:text-purple-900 font-bold underline cursor-pointer"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-2xl border border-pink-300 bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-pink-100 text-purple-950 font-mono uppercase text-[10px] font-bold border-b border-pink-300">
                    <tr>
                      <th className="px-3.5 py-3">Business Name</th>
                      <th className="px-3.5 py-3">Location</th>
                      <th className="px-3.5 py-3">Contact Number</th>
                      <th className="px-3.5 py-3">Date</th>
                      <th className="px-3.5 py-3">Assigned Employee</th>
                      <th className="px-3.5 py-3">Status</th>
                      <th className="px-3.5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100">
                    {loadingExpectedData ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-pink-800">
                          <div className="w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <span>Loading Expected Data Entries...</span>
                        </td>
                      </tr>
                    ) : filteredExpectedList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-pink-800">
                          <Target className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                          <p className="font-bold">No Expected Data records found.</p>
                          <p className="text-[11px] mt-0.5">Use the form above to assign prospective client data to employees.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredExpectedList.map((item) => {
                        const isActionActive = expectedActionId === item.id;
                        return (
                          <tr key={item.id} className="hover:bg-pink-50/80 transition-colors">
                            
                            {/* Business Name */}
                            <td className="px-3.5 py-3 font-bold text-zinc-900 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                                <span>{item.businessName}</span>
                              </div>
                            </td>

                            {/* Location */}
                            <td className="px-3.5 py-3 text-zinc-700">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                                <span>{item.location}</span>
                              </div>
                            </td>

                            {/* Number */}
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
                              {item.date}
                            </td>

                            {/* Assigned Employee */}
                            <td className="px-3.5 py-3">
                              <div className="font-bold text-zinc-900">{item.assignedEmployeeName}</div>
                              <div className="font-mono text-[10px] text-pink-700">{item.assignedEmployeeCode}</div>
                            </td>

                            {/* Status */}
                            <td className="px-3.5 py-3 whitespace-nowrap">
                              <select
                                value={item.status}
                                disabled={isActionActive}
                                onChange={(e) => handleAdminUpdateExpectedStatus(item.id, e.target.value as any)}
                                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold outline-none border cursor-pointer ${
                                  item.status === 'Interested'
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                    : item.status === 'Not Interested'
                                    ? 'bg-red-50 border-red-400 text-red-900'
                                    : 'bg-amber-50 border-amber-400 text-amber-900'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Interested">Interested</option>
                                <option value="Not Interested">Not Interested</option>
                              </select>
                            </td>

                            {/* Delete */}
                            <td className="px-3.5 py-3 text-right">
                              <button
                                onClick={() => handleDeleteExpectedData(item.id)}
                                disabled={isActionActive}
                                className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-xs transition-colors cursor-pointer"
                                title="Delete Expected Data"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
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
        {/* TAB 7: DAILY DATA REPORTS (CREATE & DIRECTORY) */}
        {/* ======================================================================= */}
        {activeTab === 'daily-report' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Create Daily Report Form Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FDF2F8] border-2 border-pink-300 shadow-md space-y-4">
              <div>
                <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-pink-600" />
                  <span>Create & Assign Daily Data Report</span>
                </h3>
                <p className="text-xs text-pink-900 mt-0.5">
                  Directly dispatch prospective client requirement details to designated sales staff
                </p>
              </div>

              {reportFormError && (
                <div className="p-3 rounded-xl bg-red-100 border border-red-400 text-red-900 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                  <span>{reportFormError}</span>
                </div>
              )}

              <form onSubmit={handleCreateDailyReportSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950">S.No (Optional)</label>
                    <input
                      type="text"
                      value={reportSNo}
                      onChange={(e) => setReportSNo(e.target.value)}
                      placeholder={`e.g. ${dailyReportList.length + 1}`}
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950">Client / Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950">Client Email *</label>
                    <input
                      type="email"
                      required
                      value={reportEmail}
                      onChange={(e) => setReportEmail(e.target.value)}
                      placeholder="rajesh@enterprisecorp.in"
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={reportNumber}
                      onChange={(e) => setReportNumber(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950">Location / City *</label>
                    <input
                      type="text"
                      required
                      value={reportLocation}
                      onChange={(e) => setReportLocation(e.target.value)}
                      placeholder="e.g. Bangalore, Karnataka"
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-950">Report Status</label>
                    <select
                      value={reportStatus}
                      onChange={(e) => setReportStatus(e.target.value)}
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none font-bold"
                    >
                      <option value="Assigned">Assigned</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Discussion in Progress">In Progress</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Converted">Converted</option>
                      <option value="Closed / Not Interested">Closed</option>
                    </select>
                  </div>

                  {/* Assign to Corporate Employee */}
                  <div className="space-y-1 sm:col-span-2 lg:col-span-2">
                    <label className="text-xs font-bold text-purple-950">Assign to Corporate Employee *</label>
                    <select
                      required
                      value={selectedEmployeeUid}
                      onChange={(e) => setSelectedEmployeeUid(e.target.value)}
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none font-medium cursor-pointer"
                    >
                      <option value="">-- Select Corporate Staff Member --</option>
                      {corporateList.map((corp) => (
                        <option key={corp.uid} value={corp.uid}>
                          {corp.name} ({corp.corporateUserId || 'WDS-ACTIVE'}) — {corp.corporateRole || 'Sales Rep'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-2 lg:col-span-4">
                    <label className="text-xs font-bold text-purple-950">Client Requirement / Project Description *</label>
                    <textarea
                      required
                      rows={2}
                      value={reportRequirement}
                      onChange={(e) => setReportRequirement(e.target.value)}
                      placeholder="e.g. Startup looking for high-performance zero-lag web architecture and brand identity package"
                      className="w-full bg-white border border-pink-300 focus:border-pink-600 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none resize-none"
                    />
                  </div>

                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isCreatingReport}
                    className="px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isCreatingReport ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating Daily Report...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Report to Employee</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Daily Reports Table & Filter Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FDF2F8] border-2 border-pink-300 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-pink-200">
                <div>
                  <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
                    <Building className="w-4 h-4 text-pink-600" />
                    <span>Dispatched Daily Data Reports Directory</span>
                  </h3>
                  <p className="text-xs text-pink-900 mt-0.5">
                    All client requirement leads assigned across corporate team
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Filter by Employee */}
                  <select
                    value={reportFilterEmployee}
                    onChange={(e) => setReportFilterEmployee(e.target.value)}
                    className="bg-white border border-pink-300 rounded-xl px-3 py-1.5 text-xs text-purple-950 font-bold outline-none cursor-pointer"
                  >
                    <option value="all">All Employees ({corporateList.length})</option>
                    {corporateList.map((c) => (
                      <option key={c.uid} value={c.uid}>
                        {c.name} ({c.corporateUserId || 'WDS'})
                      </option>
                    ))}
                  </select>

                  {/* Search Query */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={reportSearchQuery}
                      onChange={(e) => setReportSearchQuery(e.target.value)}
                      placeholder="Search leads, name, email..."
                      className="w-48 bg-white border border-pink-300 focus:border-pink-600 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <button
                    onClick={loadDailyReports}
                    className="p-2 rounded-xl bg-pink-200 hover:bg-pink-300 text-purple-950 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingDailyReports ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-pink-300 bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-pink-100 text-purple-950 font-mono uppercase text-[10px] font-bold border-b border-pink-300">
                    <tr>
                      <th className="px-3.5 py-3">S.No</th>
                      <th className="px-3.5 py-3">Assigned Staff</th>
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
                        <td colSpan={9} className="px-4 py-8 text-center text-pink-800">
                          <div className="w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <span>Loading daily reports...</span>
                        </td>
                      </tr>
                    ) : dailyReportList.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-pink-800">
                          <FileSpreadsheet className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                          <p className="font-bold">No Daily Data Reports created yet.</p>
                          <p className="text-[11px] mt-0.5">Use the form above to dispatch client requirement reports.</p>
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
                                className="bg-pink-50 border border-pink-300 rounded-lg px-2 py-1 text-[11px] font-bold text-purple-950 outline-none cursor-pointer"
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
