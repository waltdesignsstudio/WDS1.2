import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Crown,
  Medal,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  MapPin,
  Briefcase,
  User,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  useAuth,
  LeaderboardItem,
  CreateLeaderboardPayload,
  UserProfile,
} from '../../context/AuthContext';

export const AdminLeaderboardSection: React.FC = () => {
  const {
    fetchLeaderboard,
    createLeaderboardEntry,
    updateLeaderboardEntry,
    deleteLeaderboardEntry,
    syncLeaderboardFromCorporateEmployees,
    fetchAllCorporateUsers,
  } = useAuth();

  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [corporateList, setCorporateList] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Modal / Form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form fields
  const [selectedEmployeeUid, setSelectedEmployeeUid] = useState('');
  const [name, setName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [role, setRole] = useState('Asst. Sales Manager');
  const [location, setLocation] = useState('Pan-India Corporate');
  const [earnings, setEarnings] = useState<number>(0);
  const [rank, setRank] = useState<number>(1);
  const [targetAchievement, setTargetAchievement] = useState<number>(100);
  const [dealsClosed, setDealsClosed] = useState<number>(0);
  const [tierBadge, setTierBadge] = useState<LeaderboardItem['tierBadge']>('Gold');
  const [period, setPeriod] = useState('August 2026');

  // Edit State
  const [editingItem, setEditingItem] = useState<LeaderboardItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editEarnings, setEditEarnings] = useState<number>(0);
  const [editRank, setEditRank] = useState<number>(1);
  const [editTargetAchievement, setEditTargetAchievement] = useState<number>(100);
  const [editDealsClosed, setEditDealsClosed] = useState<number>(0);
  const [editTierBadge, setEditTierBadge] = useState<LeaderboardItem['tierBadge']>('Gold');
  const [editPeriod, setEditPeriod] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [boardData, users] = await Promise.all([
        fetchLeaderboard(),
        fetchAllCorporateUsers(),
      ]);
      setLeaderboard(boardData);
      setCorporateList(users);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectEmployee = (uid: string) => {
    setSelectedEmployeeUid(uid);
    if (!uid) return;
    const emp = corporateList.find((u) => u.uid === uid);
    if (emp) {
      setName(emp.name);
      setEmployeeCode(emp.corporateUserId || '');
      setRole(emp.corporateRole || 'Asst. Sales Manager');
      setLocation(emp.location || 'Pan-India Corporate');
      const totalEarn = (emp.basicSalary || 0) + (emp.income || 0);
      setEarnings(totalEarn);
      setTargetAchievement(emp.progress || 0);
    }
  };

  const handleAutoSync = async () => {
    if (!window.confirm('Sync leaderboard ranks directly with all registered corporate employee earnings?')) return;
    setSyncing(true);
    try {
      const res = await syncLeaderboardFromCorporateEmployees();
      if (res.success) {
        await loadData();
      } else {
        alert(res.error || 'Failed to auto-sync leaderboard.');
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to auto-sync leaderboard.');
    } finally {
      setSyncing(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    if (!name.trim() || !location.trim() || !role.trim()) {
      setFormFeedback({ type: 'error', message: 'Name, location, and role are required fields.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateLeaderboardPayload = {
        name: name.trim(),
        employeeUid: selectedEmployeeUid || undefined,
        employeeCode: employeeCode.trim() || undefined,
        role: role.trim(),
        location: location.trim(),
        earnings: Number(earnings) || 0,
        rank: Number(rank) || 1,
        targetAchievement: Number(targetAchievement) || 0,
        dealsClosed: Number(dealsClosed) || 0,
        tierBadge,
        period: period.trim() || 'August 2026',
      };

      const res = await createLeaderboardEntry(payload);
      if (res.success) {
        setShowCreateModal(false);
        // Reset form
        setName('');
        setSelectedEmployeeUid('');
        setEmployeeCode('');
        setEarnings(0);
        setRank(leaderboard.length + 1);
        await loadData();
      } else {
        setFormFeedback({ type: 'error', message: res.error || 'Failed to add leaderboard entry.' });
      }
    } catch (err: any) {
      setFormFeedback({ type: 'error', message: err?.message || 'Failed to add entry.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (item: LeaderboardItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditCode(item.employeeCode || '');
    setEditRole(item.role);
    setEditLocation(item.location);
    setEditEarnings(item.earnings);
    setEditRank(item.rank);
    setEditTargetAchievement(item.targetAchievement || 0);
    setEditDealsClosed(item.dealsClosed || 0);
    setEditTierBadge(item.tierBadge || 'Gold');
    setEditPeriod(item.period || 'August 2026');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsEditing(true);
    try {
      const res = await updateLeaderboardEntry(editingItem.id, {
        name: editName.trim(),
        employeeCode: editCode.trim() || undefined,
        role: editRole.trim(),
        location: editLocation.trim(),
        earnings: Number(editEarnings) || 0,
        rank: Number(editRank) || 1,
        targetAchievement: Number(editTargetAchievement) || 0,
        dealsClosed: Number(editDealsClosed) || 0,
        tierBadge: editTierBadge,
        period: editPeriod.trim(),
      });

      if (res.success) {
        setEditingItem(null);
        await loadData();
      } else {
        alert(res.error || 'Failed to update entry.');
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to update entry.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async (id: string, entryName: string) => {
    if (!window.confirm(`Delete leaderboard entry for ${entryName}?`)) return;
    try {
      const res = await deleteLeaderboardEntry(id);
      if (res.success) {
        setLeaderboard((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error('Delete leaderboard error:', err);
    }
  };

  const filteredLeaderboard = leaderboard.filter((item) => {
    if (selectedLocation !== 'all' && item.location !== selectedLocation) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.employeeCode || '').toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getRankMedal = (rankNum: number) => {
    if (rankNum === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-black shadow-sm">
          <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          Rank #1
        </span>
      );
    }
    if (rankNum === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-black shadow-sm">
          <Medal className="w-3.5 h-3.5 text-slate-500 fill-slate-400" />
          Rank #2
        </span>
      );
    }
    if (rankNum === 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-black shadow-sm">
          <Medal className="w-3.5 h-3.5 text-amber-700 fill-amber-600" />
          Rank #3
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 bg-slate-50 text-slate-700 font-bold rounded-lg text-xs border border-slate-200">
        #{rankNum}
      </span>
    );
  };

  const getTierBadgeStyle = (tier?: LeaderboardItem['tierBadge']) => {
    switch (tier) {
      case 'Diamond':
        return 'bg-cyan-50 text-cyan-800 border-cyan-300';
      case 'Gold':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Silver':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Bronze':
        return 'bg-orange-50 text-orange-800 border-orange-300';
      default:
        return 'bg-purple-50 text-purple-800 border-purple-300';
    }
  };

  const uniqueLocations = Array.from(new Set(leaderboard.map((i) => i.location).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-amber-700/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-300 text-xs font-semibold mb-2">
              <Trophy className="w-3.5 h-3.5" />
              Corporate Sales & Earnings Standings
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Corporate Leaderboard Manager</h2>
            <p className="text-amber-200 text-sm mt-1 max-w-xl">
              Manage executive rankings, milestone recognitions, and earnings standing across pan-India divisions. Visible to all corporate staff.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAutoSync}
              disabled={syncing || corporateList.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
              title="Automatically ranks all registered corporate users by total earnings"
            >
              <Zap className="w-4 h-4" />
              {syncing ? 'Syncing...' : 'Auto-Sync from Staff'}
            </button>
            <button
              onClick={() => {
                setFormFeedback(null);
                setRank(leaderboard.length + 1);
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Entry
            </button>
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-600 shadow"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-amber-900/40 text-xs">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-amber-900/30">
            <p className="text-slate-400 font-medium">Ranked Representatives</p>
            <p className="text-xl font-bold text-white mt-1">{leaderboard.length}</p>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-amber-900/30">
            <p className="text-slate-400 font-medium">Top Performer (#1)</p>
            <p className="text-sm font-bold text-amber-400 mt-1 truncate">
              {leaderboard[0]?.name || '—'}
            </p>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-amber-900/30">
            <p className="text-slate-400 font-medium">Top Cumulative Earnings</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              ₹{leaderboard[0]?.earnings.toLocaleString('en-IN') || 0}
            </p>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-amber-900/30">
            <p className="text-slate-400 font-medium">Active Season</p>
            <p className="text-sm font-bold text-purple-300 mt-1 truncate">
              {leaderboard[0]?.period || 'August 2026'}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, role, code, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Locations</option>
            {uniqueLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-slate-800">
              Current Rankings & Recognition ({filteredLeaderboard.length})
            </h3>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-7 h-7 mx-auto mb-2 animate-spin text-amber-600" />
            <p className="text-xs">Loading leaderboard standings...</p>
          </div>
        ) : filteredLeaderboard.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Trophy className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No leaderboard entries found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Click "Auto-Sync from Staff" or "Add Entry" to populate the executive sales leaderboard.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Employee / Representative</th>
                  <th className="py-3 px-4">Role & Location</th>
                  <th className="py-3 px-4">Total Earnings (₹)</th>
                  <th className="py-3 px-4">Deals / Target %</th>
                  <th className="py-3 px-4">Tier Badge</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeaderboard.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">{getRankMedal(item.rank)}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      {item.employeeCode && (
                        <div className="text-[11px] text-purple-700 font-semibold font-mono">
                          {item.employeeCode}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{item.role}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {item.location}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                        ₹{item.earnings.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-700">
                        {item.dealsClosed || 0} Deals
                      </div>
                      <div className="text-[11px] text-indigo-600 font-medium">
                        {item.targetAchievement || 0}% Target
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getTierBadgeStyle(
                          item.tierBadge
                        )}`}
                      >
                        {item.tierBadge || 'Standard'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit leaderboard entry"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                  <Trophy className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Add Leaderboard Entry</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formFeedback && (
              <div
                className={`p-3 rounded-xl text-xs mb-4 flex items-start gap-2 border ${
                  formFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
              >
                {formFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                )}
                <span>{formFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              {/* Optional Autofill from Registered Employee */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Autofill from Registered Employee (Optional)
                </label>
                <select
                  value={selectedEmployeeUid}
                  onChange={(e) => handleSelectEmployee(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 font-medium"
                >
                  <option value="">-- Custom Manual Entry --</option>
                  {corporateList.map((emp) => (
                    <option key={emp.uid} value={emp.uid}>
                      {emp.name} ({emp.corporateUserId}) - {emp.corporateRole}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Representative Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Rajesh Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corporate Code</label>
                  <input
                    type="text"
                    placeholder="WDS-1001"
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Rank #</label>
                  <input
                    type="number"
                    min={1}
                    value={rank}
                    onChange={(e) => setRank(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation / Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Earnings (₹)</label>
                  <input
                    type="number"
                    value={earnings}
                    onChange={(e) => setEarnings(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deals Closed</label>
                  <input
                    type="number"
                    value={dealsClosed}
                    onChange={(e) => setDealsClosed(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tier Badge</label>
                  <select
                    value={tierBadge}
                    onChange={(e) => setTierBadge(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 font-medium"
                  >
                    <option value="Diamond">💎 Diamond</option>
                    <option value="Gold">🥇 Gold</option>
                    <option value="Silver">🥈 Silver</option>
                    <option value="Bronze">🥉 Bronze</option>
                    <option value="Rising Star">⭐ Rising Star</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Season / Period</label>
                  <input
                    type="text"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg transition-all"
                >
                  {isSubmitting ? 'Saving...' : 'Add to Leaderboard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Edit Leaderboard Entry</h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Representative Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corporate Code</label>
                  <input
                    type="text"
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rank #</label>
                  <input
                    type="number"
                    min={1}
                    value={editRank}
                    onChange={(e) => setEditRank(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Earnings (₹)</label>
                  <input
                    type="number"
                    value={editEarnings}
                    onChange={(e) => setEditEarnings(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deals Closed</label>
                  <input
                    type="number"
                    value={editDealsClosed}
                    onChange={(e) => setEditDealsClosed(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tier Badge</label>
                  <select
                    value={editTierBadge}
                    onChange={(e) => setEditTierBadge(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
                  >
                    <option value="Diamond">💎 Diamond</option>
                    <option value="Gold">🥇 Gold</option>
                    <option value="Silver">🥈 Silver</option>
                    <option value="Bronze">🥉 Bronze</option>
                    <option value="Rising Star">⭐ Rising Star</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Season</label>
                  <input
                    type="text"
                    value={editPeriod}
                    onChange={(e) => setEditPeriod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg transition-all"
                >
                  {isEditing ? 'Saving...' : 'Update Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
