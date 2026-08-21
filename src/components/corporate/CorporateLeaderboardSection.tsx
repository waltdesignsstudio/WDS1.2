import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Search,
  Filter,
  RefreshCw,
  MapPin,
  Briefcase,
  DollarSign,
  TrendingUp,
  Sparkles,
  Zap,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { useAuth, LeaderboardItem } from '../../context/AuthContext';

export const CorporateLeaderboardSection: React.FC = () => {
  const { fetchLeaderboard, profile } = useAuth();

  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await fetchLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      console.error('Failed to fetch corporate leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

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

  const uniqueLocations = Array.from(new Set(leaderboard.map((i) => i.location).filter(Boolean)));

  // Top 3 Podium items (sorted by rank)
  const top1 = leaderboard.find((i) => i.rank === 1);
  const top2 = leaderboard.find((i) => i.rank === 2);
  const top3 = leaderboard.find((i) => i.rank === 3);

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

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-amber-700/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-300 text-xs font-semibold mb-2">
              <Trophy className="w-3.5 h-3.5" />
              Pan-India Performance Standings
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Corporate Champions Leaderboard</h2>
            <p className="text-amber-200 text-sm mt-1 max-w-xl">
              Celebrating our top performers and milestone achievers. Track real-time accrued earnings, closed deals, and executive rankings.
            </p>
          </div>
          <button
            onClick={loadLeaderboard}
            disabled={loading}
            className="self-start sm:self-center flex items-center gap-2 px-4 py-2 bg-amber-700/60 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold border border-amber-500/40 transition-all shadow"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Standings
          </button>
        </div>

        {/* Season info */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-amber-900/40 text-xs">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-amber-900/30">
            <p className="text-slate-400 font-medium">Ranked Executives</p>
            <p className="text-xl font-bold text-white mt-1">{leaderboard.length}</p>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-amber-900/30">
            <p className="text-slate-400 font-medium">Active Season / Cycle</p>
            <p className="text-sm font-bold text-amber-400 mt-1 truncate">
              {leaderboard[0]?.period || 'August 2026 Season'}
            </p>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-amber-900/30">
            <p className="text-slate-400 font-medium">Access Status</p>
            <p className="text-sm font-bold text-emerald-400 mt-1">Verified Corporate Access</p>
          </div>
        </div>
      </div>

      {/* Podium Display (Top 3 Performers) */}
      {!loading && leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4">
          {/* Rank #2 - Silver */}
          {top2 && (
            <div className="bg-gradient-to-b from-slate-100 to-white rounded-2xl p-5 border-2 border-slate-300 shadow-md flex flex-col items-center text-center relative order-2 md:order-1">
              <div className="w-12 h-12 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center -mt-9 shadow border-2 border-slate-300 mb-2">
                <Medal className="w-6 h-6 fill-slate-400" />
              </div>
              <span className="px-2.5 py-0.5 bg-slate-200 text-slate-800 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
                2nd Place • Silver
              </span>
              <h3 className="text-base font-bold text-slate-900">{top2.name}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{top2.employeeCode || top2.role}</p>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {top2.location}
              </p>

              <div className="mt-4 w-full pt-3 border-t border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Accrued Earnings</p>
                <p className="text-lg font-black text-slate-800 font-mono">
                  ₹{top2.earnings.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center justify-center gap-2 mt-1 text-[11px] text-slate-500">
                  <span>{top2.dealsClosed || 0} Deals</span>
                  <span>•</span>
                  <span className="text-indigo-600 font-semibold">{top2.targetAchievement || 0}% Target</span>
                </div>
              </div>
            </div>
          )}

          {/* Rank #1 - Gold Champion (Tallest Center) */}
          {top1 && (
            <div className="bg-gradient-to-b from-amber-100 via-amber-50 to-white rounded-2xl p-6 border-2 border-amber-400 shadow-xl flex flex-col items-center text-center relative order-1 md:order-2 md:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 rounded-full flex items-center justify-center -mt-10 shadow-lg border-2 border-amber-300 mb-2 animate-bounce">
                <Crown className="w-7 h-7 fill-amber-200 text-amber-950" />
              </div>
              <span className="px-3 py-1 bg-amber-400 text-amber-950 rounded-full text-xs font-black uppercase tracking-wider mb-2 shadow-sm">
                👑 1st Place • Champion
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">{top1.name}</h3>
              <p className="text-xs text-purple-800 font-bold font-mono mt-0.5">{top1.employeeCode || top1.role}</p>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                {top1.location}
              </p>

              <div className="mt-4 w-full pt-3 border-t border-amber-200 bg-amber-50/50 p-3 rounded-xl border">
                <p className="text-[10px] text-amber-800 uppercase font-bold tracking-wider">Top Accrued Earnings</p>
                <p className="text-2xl font-black text-amber-950 font-mono">
                  ₹{top1.earnings.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center justify-center gap-2 mt-1 text-xs text-amber-900 font-semibold">
                  <span>{top1.dealsClosed || 0} Deals Closed</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">{top1.targetAchievement || 0}% Target</span>
                </div>
              </div>
            </div>
          )}

          {/* Rank #3 - Bronze */}
          {top3 && (
            <div className="bg-gradient-to-b from-orange-50 to-white rounded-2xl p-5 border-2 border-orange-300 shadow-md flex flex-col items-center text-center relative order-3">
              <div className="w-12 h-12 bg-orange-200 text-orange-800 rounded-full flex items-center justify-center -mt-9 shadow border-2 border-orange-300 mb-2">
                <Medal className="w-6 h-6 fill-orange-400" />
              </div>
              <span className="px-2.5 py-0.5 bg-orange-200 text-orange-900 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
                3rd Place • Bronze
              </span>
              <h3 className="text-base font-bold text-slate-900">{top3.name}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{top3.employeeCode || top3.role}</p>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {top3.location}
              </p>

              <div className="mt-4 w-full pt-3 border-t border-orange-200">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Accrued Earnings</p>
                <p className="text-lg font-black text-orange-900 font-mono">
                  ₹{top3.earnings.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center justify-center gap-2 mt-1 text-[11px] text-slate-500">
                  <span>{top3.dealsClosed || 0} Deals</span>
                  <span>•</span>
                  <span className="text-indigo-600 font-semibold">{top3.targetAchievement || 0}% Target</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search standings by name, role, code, or location..."
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

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-slate-800">
              Complete Corporate Standings ({filteredLeaderboard.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">View-Only Authorized</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-7 h-7 mx-auto mb-2 animate-spin text-amber-600" />
            <p className="text-xs">Loading official standings...</p>
          </div>
        ) : filteredLeaderboard.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Trophy className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No leaderboard entries found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Standings will appear once finalized and published by the administration.
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
                  <th className="py-3 px-4">My Current Earnings (₹)</th>
                  <th className="py-3 px-4">Deals / Target %</th>
                  <th className="py-3 px-4">Tier Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeaderboard.map((item) => {
                  const isCurrentLoggedInUser =
                    profile &&
                    (item.employeeUid === profile.uid ||
                      (item.employeeCode && item.employeeCode === profile.corporateUserId));

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isCurrentLoggedInUser
                          ? 'bg-amber-50/70 font-semibold border-l-4 border-l-amber-500'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-3 px-4">
                        {item.rank === 1 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-black">
                            <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                            #1
                          </span>
                        ) : item.rank === 2 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-black">
                            <Medal className="w-3 h-3 text-slate-500 fill-slate-400" />
                            #2
                          </span>
                        ) : item.rank === 3 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-900 border border-orange-300 rounded-lg text-xs font-black">
                            <Medal className="w-3 h-3 text-orange-600 fill-orange-400" />
                            #3
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 bg-slate-50 text-slate-700 font-bold rounded text-xs border border-slate-200">
                            #{item.rank}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{item.name}</span>
                          {isCurrentLoggedInUser && (
                            <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full text-[10px] font-black">
                              YOU
                            </span>
                          )}
                        </div>
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
