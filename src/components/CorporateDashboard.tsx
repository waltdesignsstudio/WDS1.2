import React, { useState } from 'react';
import {
  Briefcase,
  User,
  TrendingUp,
  DollarSign,
  MapPin,
  Mail,
  Phone,
  LogOut,
  Calendar,
  Shield,
  Layers,
  Sparkles,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AGENCY_INFO, DIVISIONS } from '../data/agencyData';

export const CorporateDashboard: React.FC = () => {
  const { user, profile, logout, refreshProfile } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProfile();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const corporateId = profile?.corporateUserId || 'WDS-ACTIVE';
  const income = profile?.income || 0;
  const progress = profile?.progress || 0;

  return (
    <div className="min-h-screen bg-[#1a021e] text-white flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* ========================================================================= */}
      {/* CORPORATE TOP BAR */}
      {/* ========================================================================= */}
      <header className="bg-[#240528] border-b border-amber-500/30 sticky top-0 z-40 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Brand and Corporate Badge */}
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
                title="Sync metrics"
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
      </header>

      {/* ========================================================================= */}
      {/* MAIN CORPORATE CONTENT */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
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
              Access your assigned enterprise sales metrics, target achievement indices, and agency portfolio.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">Territory</span>
              <span className="text-xs font-semibold text-white flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                {profile?.location || 'Pan-India Corporate'}
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Cards */}
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
              <span>Assigned Corporate User ID</span>
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {corporateId}
            </div>
            <span className="text-[11px] text-zinc-400 mt-1 block">Permanent Enterprise Identifier</span>
          </div>
        </div>

        {/* Corporate Profile Details & Agency Execution Services */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Details */}
          <div className="p-6 rounded-2xl bg-[#250529] border border-white/10 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span>My Corporate Information</span>
            </h3>

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
          </div>

          {/* Agency Portfolio & Active Solutions */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#250529] border border-white/10 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Walt Designs & Studio — Core Services Portfolio</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Enterprise service lines available for client engagement and sales distribution
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {DIVISIONS.map((div) => (
                <div
                  key={div.id}
                  className="p-3.5 rounded-xl bg-black/30 border border-white/10 flex items-start gap-3"
                >
                  <img
                    src={div.image}
                    alt={div.title}
                    className="w-12 h-12 rounded-lg object-cover ring-1 ring-amber-500/20 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-white">{div.title}</h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">{div.description}</p>
                    <span className="text-[10px] text-amber-400 font-semibold block mt-1">
                      {div.deliverables.slice(0, 2).join(' • ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
