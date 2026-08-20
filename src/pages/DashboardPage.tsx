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
    openAuthModal,
    fetchAllCorporateUsers,
    updateUserProgressByAdmin,
    refreshProfile,
  } = useAuth();

  const [corporateList, setCorporateList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editIncome, setEditIncome] = useState<number>(0);
  const [editProgress, setEditProgress] = useState<number>(0);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

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
      setUpdateSuccess(`Updated progress for UID ${targetUid.slice(0, 8)}...`);
      setEditingUid(null);
      await loadCorporateUsers();
      setTimeout(() => setUpdateSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to update corporate progress:', err);
    }
  };

  const filteredCorporate = corporateList.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.name?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.avlId?.toLowerCase().includes(q) ||
      item.phone?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q)
    );
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
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {!user ? (
          /* UNAUTHENTICATED STATE */
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
                Sign in with your AVL User ID or Email to access your specialized dashboard.
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
                  <p className="text-xs text-zinc-300 mt-1 font-mono">
                    Admin UID: {user.uid} • Email: {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
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
                    Authorized Firestore data view for active corporate sales executives & managers
                  </p>
                </div>

                <div className="w-full sm:w-72 relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, AVL ID, email..."
                    className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                  />
                </div>
              </div>

              {loadingUsers ? (
                <div className="p-12 text-center text-zinc-400 text-xs">
                  Loading sales representatives from Firestore...
                </div>
              ) : filteredCorporate.length === 0 ? (
                <div className="p-12 text-center text-zinc-400 text-xs">
                  {searchQuery ? 'No corporate representatives match your search filter.' : 'No corporate sales accounts registered yet. New registrations will automatically populate here.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-black/30 text-zinc-400 uppercase tracking-wider font-mono text-[10px] border-b border-white/10">
                      <tr>
                        <th className="py-3.5 px-4">Sales Representative</th>
                        <th className="py-3.5 px-4">AVL User ID</th>
                        <th className="py-3.5 px-4">Role & Location</th>
                        <th className="py-3.5 px-4">Phone / Email</th>
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
                            <td className="py-4 px-4">
                              <div className="font-bold text-white text-sm">{item.name || 'Unnamed Representative'}</div>
                              <div className="text-[11px] font-mono text-zinc-400 truncate max-w-[180px]">
                                UID: {item.uid}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs">
                                {item.avlId || 'N/A'}
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
                      AVL ID: {profile?.avlId || 'AVL-ACTIVE'}
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
                    <span className="text-zinc-400">Unique AVL ID</span>
                    <span className="font-mono font-bold text-amber-400">{profile?.avlId || '—'}</span>
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
