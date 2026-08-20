import React, { useState, useEffect } from 'react';
import {
  Shield,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  TrendingUp,
  Award,
  DollarSign,
  Layers,
  LogOut,
  Sparkles,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Search,
  Filter,
  Users,
  Edit3,
  Save,
  BadgeCheck,
  Building2,
  AlertTriangle,
  FileSpreadsheet,
  UserPlus,
  X,
  Copy,
  Lock,
  Eye,
  KeyRound,
} from 'lucide-react';
import { useAuth, UserProfile } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AuthModal } from '../components/AuthModal';
import { AGENCY_INFO, DIVISIONS } from '../data/agencyData';

export const DashboardPage: React.FC = () => {
  const {
    user,
    profile,
    loading,
    logout,
    fetchAllCorporateUsers,
    adminCreateCorporateUser,
    updateUserProgressByAdmin,
    refreshProfile,
  } = useAuth();

  const [corporateList, setCorporateList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Admin Editing State
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editIncome, setEditIncome] = useState<number>(0);
  const [editProgress, setEditProgress] = useState<number>(0);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  // Admin Create Corporate User Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createLocation, setCreateLocation] = useState('');
  const [createRole, setCreateRole] = useState('Asst. Sales Manager');
  const [createPassword, setCreatePassword] = useState('');
  const [createIncome, setCreateIncome] = useState<number>(0);
  const [createProgress, setCreateProgress] = useState<number>(0);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Newly Created Corporate User Success State
  const [createdSuccessUser, setCreatedSuccessUser] = useState<{
    name: string;
    email: string;
    corporateUserId: string;
    password: string;
  } | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // When logged in as Admin, fetch corporate users list
  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadCorporateUsers();
    }
  }, [user, profile]);

  const loadCorporateUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await fetchAllCorporateUsers();
      setCorporateList(data);
    } catch (err) {
      console.error('Failed to load corporate users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleStartEdit = (userItem: UserProfile) => {
    setEditingUid(userItem.uid);
    setEditIncome(userItem.income || 0);
    setEditProgress(userItem.progress || 0);
  };

  const handleSaveCorporateProgress = async (targetUid: string) => {
    try {
      await updateUserProgressByAdmin(targetUid, {
        income: Number(editIncome),
        progress: Number(editProgress),
      });
      setUpdateSuccess(`Updated milestones for User UID ${targetUid.slice(0, 8)}...`);
      setEditingUid(null);
      await loadCorporateUsers();
      setTimeout(() => setUpdateSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to update corporate progress:', err);
    }
  };

  const handleAdminCreateCorporate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!createName || !createPhone || !createEmail || !createPassword) {
      setCreateError('Please complete all required fields (Name, Phone, Email, Password).');
      return;
    }

    if (createPassword.length < 6) {
      setCreateError('Password must be at least 6 characters.');
      return;
    }

    setIsCreating(true);
    try {
      const res = await adminCreateCorporateUser({
        name: createName,
        phone: createPhone,
        email: createEmail,
        location: createLocation || 'Pan-India Corporate',
        corporateRole: createRole,
        password: createPassword,
        income: Number(createIncome) || 0,
        progress: Number(createProgress) || 0,
      });

      if (res.success && res.corporateUserId) {
        setCreatedSuccessUser({
          name: createName,
          email: createEmail,
          corporateUserId: res.corporateUserId,
          password: createPassword,
        });

        // Reset create form fields
        setCreateName('');
        setCreatePhone('');
        setCreateEmail('');
        setCreateLocation('');
        setCreatePassword('');
        setCreateIncome(0);
        setCreateProgress(0);
        setIsCreateModalOpen(false);

        // Reload table
        await loadCorporateUsers();
      } else {
        setCreateError(res.error || 'Failed to create corporate user account.');
      }
    } catch (err: any) {
      setCreateError(err?.message || 'An error occurred while provisioning corporate account.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdSuccessUser) return;
    const text = `Walt Designs & Studio Corporate Credentials\nCorporate User ID: ${createdSuccessUser.corporateUserId}\nEmail: ${createdSuccessUser.email}\nTemporary Password: ${createdSuccessUser.password}\nLogin Portal: ${window.location.origin}/dashboard`;
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
    const locMatch = item.location?.toLowerCase().includes(q);
    return wdsMatch || nameMatch || emailMatch || phoneMatch || locMatch;
  });

  const totalSalesIncome = corporateList.reduce((acc, curr) => acc + (curr.income || 0), 0);
  const avgSalesProgress = corporateList.length
    ? Math.round(corporateList.reduce((acc, curr) => acc + (curr.progress || 0), 0) / corporateList.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#29072e] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-zinc-300">Validating authorization session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#29072e] text-white selection:bg-amber-500 selection:text-black">
      <Navbar currentPage="dashboard" />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {!user ? (
          /* ============================================================ */
          /* UNAUTHENTICATED STATE */
          /* ============================================================ */
          <div className="max-w-xl mx-auto my-6 space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <Shield className="w-3.5 h-3.5" />
                Zero-Trust Secure Access
              </span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Corporate & Admin Portal
              </h1>
              <p className="text-sm text-zinc-300">
                Sign in with your assigned Corporate User ID (WDS-XXXX) or Email.
              </p>
            </div>

            <AuthModal inline={true} />
          </div>
        ) : profile?.role === 'admin' ? (
          /* ============================================================ */
          /* 1. ADMIN DASHBOARD */
          /* ============================================================ */
          <div className="space-y-8">
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#250529] border border-amber-500/30 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 font-black text-xl shadow-inner">
                  ADM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      Administrator Control Hub
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-black uppercase tracking-wider">
                      Master Role
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-300 mt-1 font-mono">
                    <span className="text-amber-300 font-bold">Admin ID: {profile?.adminUserId || 'ADM-PRIMARY'}</span>
                    <span className="text-zinc-400">UID: {user.uid}</span>
                    <span className="text-zinc-400">Email: {user.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* CREATE CORPORATE USER BUTTON */}
                <button
                  onClick={() => {
                    setIsCreateModalOpen(true);
                    setCreateError(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Corporate User</span>
                </button>

                <button
                  onClick={loadCorporateUsers}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer border border-white/10"
                >
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>Refresh Records</span>
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-200 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Success Notification after Creating User */}
            {createdSuccessUser && (
              <div className="p-5 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-100 shadow-xl animate-in fade-in space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-bold text-sm text-emerald-200">
                      Corporate Account Successfully Created!
                    </h4>
                  </div>
                  <button
                    onClick={() => setCreatedSuccessUser(null)}
                    className="text-emerald-400 hover:text-emerald-200 text-xs font-bold"
                  >
                    Dismiss
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-black/40 p-3.5 rounded-xl border border-emerald-500/30 text-xs font-mono">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Corporate User ID</span>
                    <span className="font-bold text-amber-300 text-sm">{createdSuccessUser.corporateUserId}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Representative Name</span>
                    <span className="font-semibold text-white">{createdSuccessUser.name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Assigned Email</span>
                    <span className="text-zinc-200 truncate block">{createdSuccessUser.email}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Temporary Password</span>
                    <span className="text-amber-300 font-bold">{createdSuccessUser.password}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-emerald-300">
                    The corporate user can now sign in immediately using their assigned <span className="font-bold text-amber-300">{createdSuccessUser.corporateUserId}</span> or email.
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

            {/* Success Toast */}
            {updateSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{updateSuccess}</span>
              </div>
            )}

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#250529] border border-white/10">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
                  <span>Registered Corporate Reps</span>
                  <Users className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {corporateList.length}
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Active sales team members</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#250529] border border-white/10">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
                  <span>Total Cumulative Income</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  ₹{totalSalesIncome.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Attributed enterprise revenue</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#250529] border border-white/10">
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

            {/* Corporate Sales Force Table */}
            <div className="bg-[#250529] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg text-white">Corporate Sales Personnel</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Authorized Firestore records for active corporate sales executives & managers
                  </p>
                </div>

                <div className="w-full sm:w-80 relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by WDS ID (e.g. WDS-4827), name..."
                    className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                  />
                </div>
              </div>

              {loadingUsers ? (
                <div className="p-12 text-center text-zinc-400 text-xs">
                  Loading sales representatives from Firestore...
                </div>
              ) : filteredCorporate.length === 0 ? (
                <div className="p-12 text-center text-zinc-400 text-xs space-y-3">
                  <p>{searchQuery ? 'No corporate representatives match your search query.' : 'No corporate sales accounts registered yet.'}</p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create First Corporate User</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-black/30 text-zinc-400 uppercase tracking-wider font-mono text-[10px] border-b border-white/10">
                      <tr>
                        <th className="py-3.5 px-4">Sales Representative</th>
                        <th className="py-3.5 px-4">Corporate User ID</th>
                        <th className="py-3.5 px-4">Designation & Location</th>
                        <th className="py-3.5 px-4">Contact Info</th>
                        <th className="py-3.5 px-4">Target Progress</th>
                        <th className="py-3.5 px-4">Income (INR)</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-sans">
                      {filteredCorporate.map((item) => {
                        const isEditing = editingUid === item.uid;
                        return (
                          <tr key={item.uid} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-bold text-white text-sm">{item.name || 'Unnamed Representative'}</div>
                              <div className="text-[11px] font-mono text-zinc-400 truncate max-w-[180px]">
                                UID: {item.uid}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs">
                                {item.corporateUserId || 'WDS-PENDING'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-semibold text-zinc-200">{item.corporateRole || 'Asst. Sales Manager'}</div>
                              <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-amber-400" />
                                {item.location || 'Pan India'}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-mono text-zinc-200">{item.email}</div>
                              <div className="font-mono text-zinc-400 text-[11px] mt-0.5">{item.phone || '—'}</div>
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
                                    onClick={() => handleSaveCorporateProgress(item.uid)}
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

            {/* ============================================================ */}
            {/* CREATE CORPORATE USER MODAL */}
            {/* ============================================================ */}
            {isCreateModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="w-full max-w-lg bg-[#250529] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden p-6 text-white relative max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">Create Corporate Account</h3>
                      <p className="text-xs text-zinc-300">
                        System will automatically generate a unique <span className="font-mono text-amber-400 font-bold">WDS-XXXX</span> User ID.
                      </p>
                    </div>
                  </div>

                  {createError && (
                    <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{createError}</span>
                    </div>
                  )}

                  <form onSubmit={handleAdminCreateCorporate} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Corporate Full Name *
                      </label>
                      <input
                        type="text"
                        value={createName}
                        onChange={(e) => setCreateName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        required
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={createPhone}
                          onChange={(e) => setCreatePhone(e.target.value)}
                          placeholder="+91 9876543210"
                          required
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Location / Branch
                        </label>
                        <input
                          type="text"
                          value={createLocation}
                          onChange={(e) => setCreateLocation(e.target.value)}
                          placeholder="e.g. Mumbai HQ"
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Official Email Address *
                      </label>
                      <input
                        type="email"
                        value={createEmail}
                        onChange={(e) => setCreateEmail(e.target.value)}
                        placeholder="rep.sales@waltdesignsstudio.in"
                        required
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Corporate Designation / Role *
                      </label>
                      <select
                        value={createRole}
                        onChange={(e) => setCreateRole(e.target.value)}
                        className="w-full bg-[#1b031e] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Asst. Sales Manager">Asst. Sales Manager</option>
                        <option value="Senior Sales Manager">Senior Sales Manager</option>
                        <option value="Corporate Sales Executive">Corporate Sales Executive</option>
                        <option value="Enterprise Territory Lead">Enterprise Territory Lead</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Temporary Password (Min 6 characters) *
                      </label>
                      <input
                        type="password"
                        value={createPassword}
                        onChange={(e) => setCreatePassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Initial Income (INR)
                        </label>
                        <input
                          type="number"
                          value={createIncome}
                          onChange={(e) => setCreateIncome(Number(e.target.value))}
                          placeholder="0"
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Initial Progress (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={createProgress}
                          onChange={(e) => setCreateProgress(Number(e.target.value))}
                          placeholder="0"
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isCreating}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isCreating ? (
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            <span>Generate WDS-ID & Provision User</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ============================================================ */
          /* 2. CORPORATE DASHBOARD */
          /* ============================================================ */
          <div className="space-y-8">
            {/* Top Identity Card */}
            <div className="p-6 rounded-2xl bg-[#250529] border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-2xl shadow-inner shrink-0">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      {profile?.name || user.displayName || 'Corporate Sales Partner'}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 uppercase tracking-wider">
                      {profile?.corporateRole || 'Asst. Sales Manager'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-zinc-300 mt-1.5 font-mono">
                    <span className="flex items-center gap-1 text-amber-300 font-bold">
                      <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
                      Corporate ID: {profile?.corporateUserId || 'WDS-ACTIVE'}
                    </span>
                    <span className="text-zinc-400">UID: {user.uid}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={refreshProfile}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer border border-white/10"
                >
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>Sync Profile</span>
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-200 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Corporate Performance Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Income */}
              <div className="p-5 rounded-2xl bg-[#250529] border border-white/10">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
                  <span>Accrued Sales Income</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  ₹{(profile?.income || 0).toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Direct portfolio commission</span>
              </div>

              {/* Progress */}
              <div className="p-5 rounded-2xl bg-[#250529] border border-white/10">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
                  <span>Target Progress</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-amber-400 font-mono">
                  {profile?.progress || 0}%
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(profile?.progress || 0, 100)}%` }}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="p-5 rounded-2xl bg-[#250529] border border-white/10">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
                  <span>Assigned Territory</span>
                  <MapPin className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-lg font-bold text-white truncate">
                  {profile?.location || 'Pan-India Corporate'}
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Active sales jurisdiction</span>
              </div>

              {/* Security Tier */}
              <div className="p-5 rounded-2xl bg-[#250529] border border-white/10">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
                  <span>Security & Isolation</span>
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  Isolated Profile
                </div>
                <span className="text-[11px] text-emerald-400 mt-1 block">ABAC rules verified</span>
              </div>
            </div>

            {/* Profile Information Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#250529] border border-white/10 space-y-4">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>My Corporate Details</span>
                </h3>

                <div className="space-y-3 text-xs divide-y divide-white/5">
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Full Name</span>
                    <span className="font-semibold text-white">{profile?.name || '—'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Official Email</span>
                    <span className="font-mono text-zinc-200">{profile?.email || user.email}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Phone Number</span>
                    <span className="font-mono text-zinc-200">{profile?.phone || '—'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Corporate Designation</span>
                    <span className="font-semibold text-amber-300">{profile?.corporateRole || 'Asst. Sales Manager'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Corporate User ID</span>
                    <span className="font-mono font-bold text-amber-400">{profile?.corporateUserId || '—'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-zinc-400">Firebase Auth UID</span>
                    <span className="font-mono text-zinc-400 text-[11px] truncate max-w-[140px]">{user.uid}</span>
                  </div>
                </div>
              </div>

              {/* Division Sales Blueprints */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-[#250529] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>Walt Studio Portfolio Execution</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Operational divisions available for client pitch and enterprise contracts
                    </p>
                  </div>
                  <a
                    href="/services"
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                  >
                    <span>All Services</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {DIVISIONS.slice(0, 4).map((div) => (
                    <div
                      key={div.id}
                      className="p-3.5 rounded-xl bg-black/30 border border-white/10 hover:border-amber-500/40 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          DIV {div.divisionNumber}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                          {div.executionMatrix}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                        {div.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {div.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
