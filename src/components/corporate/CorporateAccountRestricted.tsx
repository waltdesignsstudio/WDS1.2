import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  UserX,
  RefreshCw,
  LogOut,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Shield,
  CheckCircle2,
  HelpCircle,
  Building2,
} from 'lucide-react';
import { UserProfile, CorporateAccountStatus } from '../../context/AuthContext';

interface CorporateAccountRestrictedProps {
  profile: UserProfile;
  onRefresh: () => Promise<void>;
  onLogout: () => Promise<void>;
}

export const CorporateAccountRestricted: React.FC<CorporateAccountRestrictedProps> = ({
  profile,
  onRefresh,
  onLogout,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState<string | null>(null);

  const status: CorporateAccountStatus = profile.accountStatus || 'suspended';

  const handleCheckStatus = async () => {
    setIsChecking(true);
    setCheckMessage(null);
    try {
      await onRefresh();
      setCheckMessage('Status verified with enterprise directory. Status is currently unchanged.');
    } catch {
      setCheckMessage('Failed to connect to verification server. Please check your network.');
    } finally {
      setIsChecking(false);
      setTimeout(() => setCheckMessage(null), 5000);
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'banned':
        return {
          title: 'Account Banned by Administration',
          subtitle: 'Your access to the corporate intranet and sales portal has been revoked.',
          badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
          borderColor: 'border-red-500/30',
          cardGlow: 'shadow-[0_0_50px_rgba(239,68,68,0.15)]',
          iconBg: 'bg-red-500/20 text-red-400 border border-red-500/30',
          Icon: ShieldAlert,
          defaultReason: 'Violation of corporate policy, compliance guidelines, or unauthorized activities.',
        };
      case 'terminated':
        return {
          title: 'Corporate Access Terminated',
          subtitle: 'Official corporate representative privileges have been concluded.',
          badgeBg: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40',
          borderColor: 'border-zinc-500/30',
          cardGlow: 'shadow-[0_0_50px_rgba(161,161,170,0.15)]',
          iconBg: 'bg-zinc-700/40 text-zinc-300 border border-zinc-500/30',
          Icon: UserX,
          defaultReason: 'Employment or freelance service association concluded by administration.',
        };
      case 'suspended':
      default:
        return {
          title: 'Corporate Account Temporarily Suspended',
          subtitle: 'Your access is temporarily frozen pending administrative review.',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          borderColor: 'border-amber-500/30',
          cardGlow: 'shadow-[0_0_50px_rgba(245,158,11,0.15)]',
          iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
          Icon: AlertTriangle,
          defaultReason: 'Account placed on temporary administrative hold pending internal evaluation.',
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.Icon;

  return (
    <div className="min-h-screen bg-[#130217] text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-purple-900/20 via-pink-900/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Lock Card */}
      <div
        className={`w-full max-w-2xl bg-[#1d0623]/90 backdrop-blur-xl border ${config.borderColor} ${config.cardGlow} rounded-3xl p-6 sm:p-10 relative z-10 space-y-6 shadow-2xl`}
      >
        {/* Header with Company Logo & Status Icon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${config.iconBg} flex items-center justify-center shrink-0`}>
              <StatusIcon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-pink-400">
                  Walt Designs Studio
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-[10px] font-mono text-zinc-400">Corporate Security</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5">
                {config.title}
              </h1>
            </div>
          </div>

          <div className="self-start sm:self-auto">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase border ${config.badgeBg}`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-ping" />
              <span>{status}</span>
            </span>
          </div>
        </div>

        {/* Informative Description */}
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {config.subtitle} All corporate workspace functions—including daily attendance submissions,
          expected data lead management, client daily reports, and performance indices—have been restricted by
          an authorized Administrator until your account standing is modified.
        </p>

        {/* Reason Block */}
        <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Administrator Reason & Case Notes</span>
            </span>
            {profile.statusUpdatedAt && (
              <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>
                  {new Date(profile.statusUpdatedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </span>
            )}
          </div>
          <div className="text-xs sm:text-sm font-medium text-white italic bg-white/5 p-3 rounded-xl border border-white/5">
            "{profile.statusReason || config.defaultReason}"
          </div>
          {profile.statusUpdatedBy && (
            <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 pt-1">
              <span>Action Authorized By:</span>
              <span className="font-semibold text-zinc-200">{profile.statusUpdatedBy}</span>
            </div>
          )}
        </div>

        {/* Employee Identity Roster Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
              Employee Name
            </span>
            <span className="text-xs sm:text-sm font-bold text-white block truncate">
              {profile.name}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
              Corporate ID
            </span>
            <span className="font-mono text-xs sm:text-sm font-extrabold text-pink-400 block">
              {profile.corporateUserId || 'WDS-EMPLOYEE'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
              Registered Role
            </span>
            <span className="text-xs sm:text-sm font-bold text-zinc-200 block truncate">
              {profile.corporateRole || 'Sales Representative'}
            </span>
          </div>
        </div>

        {/* Feedback message when checking status */}
        {checkMessage && (
          <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-500/40 text-xs text-purple-200 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0" />
            <span>{checkMessage}</span>
          </div>
        )}

        {/* Actions Bar: Re-check Status & Sign Out */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Verifying with Directory...' : 'Re-check Account Status'}</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 hover:text-white text-xs font-bold border border-white/10 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Safely</span>
          </button>
        </div>

        {/* Support & HR Grievance Appeals Section */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-bold text-zinc-200">
              Need assistance or believe this is an error?
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            If you have questions regarding this restriction or would like to submit an official appeal to
            the Walt Designs Studio Human Resources & Governance Administration, contact us directly:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <a
              href="https://wa.me/918276825128?text=Hello%20Admin,%20my%20corporate%20account%20status%20is%20restricted.%20Please%20assist."
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium inline-flex items-center gap-2 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp HR</span>
            </a>

            <a
              href="tel:+918276825128"
              className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium inline-flex items-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>+91 8276825128</span>
            </a>

            <a
              href="mailto:waltdesignsstudio@gmail.com?subject=Corporate%20Account%20Appeal&body=Employee%20ID:%20"
              className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium inline-flex items-center gap-2 transition-colors truncate"
            >
              <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">Email Executive</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
