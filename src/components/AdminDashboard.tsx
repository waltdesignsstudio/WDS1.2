import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  Layers,
  UserPlus,
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
  Calendar,
  KeyRound,
  Sparkles,
  ArrowRight,
  Terminal,
  Clock,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useAuth, UserProfile } from '../context/AuthContext';
import { AGENCY_INFO } from '../data/agencyData';

type AdminTab = 'dashboard' | 'profile' | 'portfolio' | 'corporate-registration';

export const AdminDashboard: React.FC = () => {
  const {
    user,
    profile,
    logout,
    fetchAllCorporateUsers,
    adminCreateCorporateUser,
    updateUserProgressByAdmin,
    refreshProfile,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [corporateList, setCorporateList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
  }, []);

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

      if (res.success && res.corporateUserId) {
        setCreatedUser({
          name: regName.trim(),
          email: regEmail.trim().toLowerCase(),
          corporateUserId: res.corporateUserId,
          password: regPassword,
          role: regRole,
        });

        // Reset form
        setRegName('');
        setRegPhone('');
        setRegEmail('');
        setRegLocation('');
        setRegPassword('');
        setRegIncome(0);
        setRegProgress(0);

        // Reload data
        await loadCorporateData();
      } else {
        setRegError(res.error || 'Failed to create corporate account.');
      }
    } catch (err: any) {
      setRegError(err?.message || 'Error occurred while registering corporate account.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdUser) return;
    const text = `Walt Designs & Studio Corporate Credentials\nCorporate User ID: ${createdUser.corporateUserId}\nEmail: ${createdUser.email}\nTemporary Password: ${createdUser.password}\nPortal Link: ${window.location.origin}/dashboard`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const filteredCorporate = corporateList.filter((item) => {
    const q = searchQuery.toLowerCase();
    const wdsMatch = item.corporateUserId?.toLowerCase().includes(q);
    const nameMatch = item.name?.toLowerCase().includes(q);
    const emailMatch = item.email?.toLowerCase().includes(q);
    const phoneMatch = item.phone?.toLowerCase().includes(q);
    const roleMatch = item.corporateRole?.toLowerCase().includes(q);
    const locMatch = item.location?.toLowerCase().includes(q);
    return wdsMatch || nameMatch || emailMatch || phoneMatch || roleMatch || locMatch;
  });

  const totalSalesIncome = corporateList.reduce((acc, curr) => acc + (curr.income || 0), 0);
  const avgSalesProgress = corporateList.length
    ? Math.round(corporateList.reduce((acc, curr) => acc + (curr.progress || 0), 0) / corporateList.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#1a021e] text-white flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* ========================================================================= */}
      {/* DEDICATED ADMIN TOP BAR (NO PUBLIC WEBSITE LINKS, NO PUBLIC FOOTER) */}
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

        {/* ADMIN DASHBOARD NAVIGATION TABS (Dashboard, My Profile, Portfolio, Corporate Registration, Logout) */}
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
                  Control center for corporate user provisioning, milestone tracking, and platform data maintenance.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('corporate-registration')}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register Corporate User</span>
                </button>
                <button
                  onClick={loadCorporateData}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loadingUsers ? 'animate-spin' : ''}`} />
                  <span>Sync Firestore</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#250529] border border-white/10 shadow-md">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
                  <span>Registered Corporate Reps</span>
                  <Users className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {corporateList.length}
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Active sales fleet members</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#250529] border border-white/10 shadow-md">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
                  <span>Total Cumulative Income</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  ₹{totalSalesIncome.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Attributed enterprise revenue</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#250529] border border-white/10 shadow-md">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
                  <span>Avg. Target Achievement</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-amber-400 font-mono">
                  {avgSalesProgress}%
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Fleet execution index</span>
              </div>
            </div>

            {/* Shortcuts & Quick Portfolio Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-2xl bg-[#250529] border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white">Active Corporate Personnel</h3>
                    <p className="text-xs text-zinc-400">Recent corporate sales representatives and progress</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Portfolio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {corporateList.length === 0 ? (
                  <div className="p-8 text-center text-xs text-zinc-400 space-y-3">
                    <p>No corporate representatives registered yet.</p>
                    <button
                      onClick={() => setActiveTab('corporate-registration')}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold cursor-pointer"
                    >
                      Create First Corporate Account
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {corporateList.slice(0, 4).map((item) => (
                      <div
                        key={item.uid}
                        className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs">
                            {item.corporateUserId || 'WDS-ACTIVE'}
                          </span>
                          <div>
                            <h4 className="font-bold text-sm text-white">{item.name}</h4>
                            <p className="text-[11px] text-zinc-400">{item.corporateRole || 'Sales Rep'} • {item.email}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-amber-400">
                            {item.progress || 0}%
                          </div>
                          <div className="w-24 bg-white/10 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full"
                              style={{ width: `${Math.min(item.progress || 0, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Admin Profile Card */}
              <div className="p-6 rounded-2xl bg-[#250529] border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Admin Credentials</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold"
                  >
                    Edit
                  </button>
                </div>

                <div className="space-y-3 text-xs divide-y divide-white/5 font-sans">
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Admin User ID</span>
                    <span className="font-mono font-bold text-amber-300">{profile?.adminUserId || 'ADM-PRIMARY'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Admin Name</span>
                    <span className="font-semibold text-white">{profile?.name || 'Administrator'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Official Email</span>
                    <span className="font-mono text-zinc-300 truncate max-w-[140px]">{user?.email}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Phone</span>
                    <span className="font-mono text-zinc-300">{profile?.phone || '—'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Role</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-black uppercase">
                      admin
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 2: MY PROFILE (ADMIN'S OWN INFORMATION) */}
        {/* ======================================================================= */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
            <div className="p-6 rounded-2xl bg-[#250529] border border-amber-500/30 shadow-xl">
              <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 font-black text-2xl shadow-inner shrink-0">
                  ADM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">
                      My Profile
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-black uppercase tracking-wider">
                      Admin Access
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-1 font-mono">
                    Admin User ID: <span className="text-amber-300 font-bold">{profile?.adminUserId || 'ADM-PRIMARY'}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-zinc-400 text-[10px] uppercase font-mono">Admin User ID</span>
                  <div className="font-mono text-sm font-bold text-amber-300">
                    {profile?.adminUserId || 'ADM-PRIMARY'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-zinc-400 text-[10px] uppercase font-mono">Full Name</span>
                  <div className="text-sm font-bold text-white">
                    {profile?.name || 'Administrator'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-zinc-400 text-[10px] uppercase font-mono">Official Email</span>
                  <div className="font-mono text-xs text-zinc-200 truncate">
                    {profile?.email || user?.email}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-zinc-400 text-[10px] uppercase font-mono">Phone Number</span>
                  <div className="font-mono text-xs text-zinc-200">
                    {profile?.phone || '—'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-zinc-400 text-[10px] uppercase font-mono">Role Tier</span>
                  <div className="font-semibold text-amber-400 capitalize">
                    {profile?.role || 'admin'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-zinc-400 text-[10px] uppercase font-mono">Account Created</span>
                  <div className="font-mono text-xs text-zinc-300">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'Verified Account'}
                  </div>
                </div>

                <div className="sm:col-span-2 p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-zinc-400 text-[10px] uppercase font-mono">Firebase Auth UID (Security Identity)</span>
                  <div className="font-mono text-xs text-zinc-400 break-all">
                    {user?.uid}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={refreshProfile}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Refresh Profile Data</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 3: PORTFOLIO (CORPORATE EMPLOYEES / USERS) */}
        {/* ======================================================================= */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-[#250529] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <span>Portfolio</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Authorized Firestore records of all Corporate sales representatives and target milestones
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-72">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by WDS ID (e.g. WDS-4827), name..."
                      className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                    />
                  </div>

                  <button
                    onClick={loadCorporateData}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white transition-all cursor-pointer"
                    title="Reload data"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {loadingUsers ? (
                <div className="p-12 text-center text-zinc-400 text-xs font-mono">
                  Loading Portfolio records from Firestore...
                </div>
              ) : filteredCorporate.length === 0 ? (
                <div className="p-12 text-center text-zinc-400 text-xs space-y-3">
                  <p>{searchQuery ? 'No corporate accounts matched your search criteria.' : 'No Corporate accounts registered in Portfolio.'}</p>
                  <button
                    onClick={() => setActiveTab('corporate-registration')}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register Corporate Account</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-black/30 text-zinc-400 uppercase tracking-wider font-mono text-[10px] border-b border-white/10">
                      <tr>
                        <th className="py-3.5 px-4">Corporate User ID</th>
                        <th className="py-3.5 px-4">Representative</th>
                        <th className="py-3.5 px-4">Role & Location</th>
                        <th className="py-3.5 px-4">Contact</th>
                        <th className="py-3.5 px-4">Progress</th>
                        <th className="py-3.5 px-4">Income (INR)</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-sans">
                      {filteredCorporate.map((item) => {
                        const isEditing = editingUid === item.uid;
                        return (
                          <tr key={item.uid} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-4 font-mono">
                              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs">
                                {item.corporateUserId || 'WDS-PENDING'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-bold text-white text-sm">{item.name || 'Unnamed'}</div>
                              <div className="text-[10px] font-mono text-zinc-400 truncate max-w-[160px]">
                                UID: {item.uid}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-semibold text-zinc-200">{item.corporateRole || 'Asst. Sales Manager'}</div>
                              <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-amber-400" />
                                {item.location || 'Pan-India Corporate'}
                              </div>
                            </td>
                            <td className="py-4 px-4 font-mono">
                              <div className="text-zinc-200">{item.email}</div>
                              <div className="text-zinc-400 text-[11px]">{item.phone || '—'}</div>
                            </td>
                            <td className="py-4 px-4 min-w-[140px]">
                              {isEditing ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={editProgress}
                                    onChange={(e) => setEditProgress(Number(e.target.value))}
                                    className="w-16 bg-black/60 border border-amber-500/60 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
                                  />
                                  <span className="text-zinc-400">%</span>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center justify-between text-[11px] mb-1">
                                    <span className="font-mono font-bold text-amber-300">{item.progress || 0}%</span>
                                  </div>
                                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className="bg-amber-500 h-full rounded-full transition-all"
                                      style={{ width: `${Math.min(item.progress || 0, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4 font-mono font-bold text-emerald-400">
                              {isEditing ? (
                                <div className="flex items-center gap-1">
                                  <span>₹</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={editIncome}
                                    onChange={(e) => setEditIncome(Number(e.target.value))}
                                    className="w-24 bg-black/60 border border-emerald-500/60 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
                                  />
                                </div>
                              ) : (
                                `₹${(item.income || 0).toLocaleString('en-IN')}`
                              )}
                            </td>
                            <td className="py-4 px-4 text-right">
                              {isEditing ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleSaveProgress(item.uid)}
                                    className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                                  >
                                    <Save className="w-3 h-3" />
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingUid(null)}
                                    className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-zinc-300 text-[11px] cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleStartEdit(item)}
                                  className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-amber-300 hover:text-amber-200 font-semibold text-[11px] flex items-center gap-1.5 ml-auto cursor-pointer"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  Edit Stats
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 4: CORPORATE REGISTRATION (ADMIN ONLY PROVISIONING) */}
        {/* ======================================================================= */}
        {activeTab === 'corporate-registration' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
            
            {/* Newly Created Credentials Success Banner */}
            {createdUser && (
              <div className="p-5 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-100 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-bold text-sm text-emerald-200">
                      Corporate Account Successfully Created!
                    </h4>
                  </div>
                  <button
                    onClick={() => setCreatedUser(null)}
                    className="text-emerald-400 hover:text-emerald-200 text-xs font-bold cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-black/40 p-3.5 rounded-xl border border-emerald-500/30 text-xs font-mono">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Corporate User ID</span>
                    <span className="font-bold text-amber-300 text-sm">{createdUser.corporateUserId}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Representative</span>
                    <span className="font-semibold text-white">{createdUser.name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Assigned Email</span>
                    <span className="text-zinc-200 truncate block">{createdUser.email}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Temporary Password</span>
                    <span className="text-amber-300 font-bold">{createdUser.password}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-emerald-300">
                    The corporate user can now sign in at the Corporate Login portal using their assigned <span className="font-bold text-amber-300">{createdUser.corporateUserId}</span> or email.
                  </p>
                  <button
                    onClick={handleCopyCredentials}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedNotification ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Registration Form Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#250529] border border-amber-500/30 shadow-xl space-y-5">
              <div className="border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Corporate Registration
                  </h2>
                </div>
                <p className="text-xs text-zinc-300 mt-1">
                  Provision a new corporate sales account. A unique <span className="font-mono text-amber-400 font-bold">WDS-XXXX</span> Corporate User ID will be automatically generated and linked to Firestore.
                </p>
              </div>

              {regError && (
                <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleCorporateRegistration} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Corporate Representative Name *
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Rajesh Verma"
                      required
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      required
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Official Email Address *
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="rep@waltdesignsstudio.in"
                      required
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Location / Territory
                    </label>
                    <input
                      type="text"
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      placeholder="e.g. Delhi NCR HQ"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Designation / Role *
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full bg-[#1b031e] border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Asst. Sales Manager">Asst. Sales Manager</option>
                      <option value="Senior Sales Manager">Senior Sales Manager</option>
                      <option value="Corporate Sales Executive">Corporate Sales Executive</option>
                      <option value="Enterprise Territory Lead">Enterprise Territory Lead</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Temporary Password (Min 6 chars) *
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Initial Income (INR)
                    </label>
                    <input
                      type="number"
                      value={regIncome}
                      onChange={(e) => setRegIncome(Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Initial Target Progress (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={regProgress}
                      onChange={(e) => setRegProgress(Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isRegistering ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Generate WDS-XXXX & Register Account</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
