import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { 
  LogOut, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Briefcase, 
  FolderKanban, 
  FileText, 
  Clock, 
  PhoneCall, 
  ExternalLink 
} from 'lucide-react';
import { DIVISIONS, AGENCY_INFO } from '../data/agencyData';

export const DashboardPage: React.FC = () => {
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-[#29072e] text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-zinc-300 text-sm">Verifying session...</p>
          </div>
        ) : !user ? (
          /* Authentication Screen when unauthenticated */
          <div className="max-w-md mx-auto py-8">
            <div className="text-center mb-6">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                Client Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-3">
                Client Sign In
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                Access your project dashboard, active blueprints, and agency requests.
              </p>
            </div>
            <AuthModal inline={true} initialMode="login" />
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header with User Info & Logout Button */}
            <div className="bg-[#240528] border border-fuchsia-800/40 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-xl shrink-0">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black text-white truncate">
                      Client Dashboard
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Authenticated</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-1 truncate">
                    Logged in as: <strong className="text-amber-300 font-mono">{user.email}</strong>
                  </p>
                </div>
              </div>

              {/* Action Buttons: Logout */}
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="/contact"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start New Request</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-200 hover:text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Account Overview Card */}
              <div className="bg-[#240528]/80 border border-fuchsia-800/30 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                      Account Status
                    </span>
                    <User className="w-4 h-4 text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Verified Client</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                    Your Firebase Authentication session is active. You have full access to submit direct project briefs, AI planner diagnostics, and customized agency service quotes.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>Auth Provider</span>
                  <span className="text-white font-bold">Firebase Auth</span>
                </div>
              </div>

              {/* Direct Inquiry Shortcut */}
              <div className="bg-[#240528]/80 border border-fuchsia-800/30 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                      Quick Action
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">AI Business Blueprint</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                    Need instant architecture and strategy suggestions? Run our Gemini-powered interactive business diagnostic planner.
                  </p>
                </div>
                <a
                  href="/contact#ai-planner"
                  className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Launch AI Planner</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </a>
              </div>

              {/* Direct Support */}
              <div className="bg-[#240528]/80 border border-fuchsia-800/30 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                      Priority Support
                    </span>
                    <PhoneCall className="w-4 h-4 text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Agency Hotline</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                    Direct executive line with Walt Designs & Studio production team for urgent milestone reviews and delivery updates.
                  </p>
                </div>
                <a
                  href="tel:+918276825128"
                  className="w-full py-2 px-3 rounded-lg bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors font-mono"
                >
                  <span>+91 8276825128</span>
                </a>
              </div>
            </div>

            {/* Specialized Agency Divisions Shortcuts */}
            <div className="bg-[#240528]/60 border border-fuchsia-800/30 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Available Agency Divisions
                  </h2>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    Select a division to explore services or request a milestone quote.
                  </p>
                </div>
                <a
                  href="/services"
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <span>View All Services</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DIVISIONS.map((division) => (
                  <a
                    key={division.id}
                    href={`/services#${division.id}`}
                    className="p-4 rounded-xl bg-black/30 border border-white/10 hover:border-amber-500/50 hover:bg-white/5 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          0{division.divisionNumber}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                          {division.executionMatrix}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                        {division.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {division.subtitle}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300">
                      <span className="font-bold text-amber-400">{division.startingPrice}</span>
                      <span className="group-hover:translate-x-0.5 transition-transform text-zinc-400 group-hover:text-white flex items-center gap-0.5">
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
