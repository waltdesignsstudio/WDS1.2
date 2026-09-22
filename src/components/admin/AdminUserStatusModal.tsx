import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  ShieldAlert,
  AlertTriangle,
  UserX,
  CheckCircle2,
  RefreshCw,
  Info,
  User,
  Mail,
  Building,
} from 'lucide-react';
import { UserProfile, CorporateAccountStatus } from '../../context/AuthContext';

interface AdminUserStatusModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (
    targetUid: string,
    status: CorporateAccountStatus,
    reason?: string
  ) => Promise<{ success: boolean; error?: string }>;
  onSuccess: () => void;
}

const PRESET_REASONS: Record<CorporateAccountStatus, string[]> = {
  active: [
    'Account verified and restored to active corporate standing',
    'Review completed successfully; full access reinstated',
    'Temporary hold resolved; permissions cleared',
  ],
  suspended: [
    'Temporary hold pending review of daily attendance submissions',
    'Under administrative evaluation for client communication guidelines',
    'Sales activity validation required by HR operations',
  ],
  banned: [
    'Violation of company corporate privacy policy and data security standards',
    'Unauthorized sharing of enterprise client records or data leaks',
    'Direct breach of code of conduct and compliance directives',
  ],
  terminated: [
    'Official corporate freelance service contract concluded',
    'Voluntary resignation processed by administration',
    'Permanent separation from corporate representation roster',
  ],
};

export const AdminUserStatusModal: React.FC<AdminUserStatusModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateStatus,
  onSuccess,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<CorporateAccountStatus>('active');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const current = user.accountStatus || 'active';
      setSelectedStatus(current);
      setReason(user.statusReason || '');
      setErrorMessage(null);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const defaultReason = PRESET_REASONS[selectedStatus][0];
    const finalReason = reason.trim() || defaultReason;

    try {
      const res = await onUpdateStatus(user.uid, selectedStatus, finalReason);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMessage(res.error || 'Failed to update user status.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions: {
    status: CorporateAccountStatus;
    title: string;
    description: string;
    icon: React.ElementType;
    badgeStyle: string;
    cardBorder: string;
    cardBg: string;
  }[] = [
    {
      status: 'active',
      title: 'Active (Unban / Unlock Dashboard)',
      description: 'Full corporate privileges. Employee can log in and access all workspace tabs.',
      icon: CheckCircle2,
      badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      cardBorder: 'hover:border-emerald-500',
      cardBg: selectedStatus === 'active' ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-200' : 'bg-white border-pink-200',
    },
    {
      status: 'suspended',
      title: 'Suspended (Temporary Hold)',
      description: 'Dashboard is locked. Employee sees an amber suspension notice with appeal info.',
      icon: AlertTriangle,
      badgeStyle: 'bg-amber-100 text-amber-800 border-amber-300',
      cardBorder: 'hover:border-amber-500',
      cardBg: selectedStatus === 'suspended' ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-200' : 'bg-white border-pink-200',
    },
    {
      status: 'banned',
      title: 'Banned (Policy Violation)',
      description: 'Access strictly revoked. Employee is blocked with an urgent red security banner.',
      icon: ShieldAlert,
      badgeStyle: 'bg-red-100 text-red-800 border-red-300',
      cardBorder: 'hover:border-red-500',
      cardBg: selectedStatus === 'banned' ? 'bg-red-50/80 border-red-500 ring-2 ring-red-200' : 'bg-white border-pink-200',
    },
    {
      status: 'terminated',
      title: 'Terminated (Separation)',
      description: 'Corporate relationship concluded. Dashboard locked permanently until restored.',
      icon: UserX,
      badgeStyle: 'bg-zinc-100 text-zinc-800 border-zinc-300',
      cardBorder: 'hover:border-zinc-500',
      cardBg: selectedStatus === 'terminated' ? 'bg-zinc-100/90 border-zinc-600 ring-2 ring-zinc-300' : 'bg-white border-pink-200',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border-2 border-pink-300 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-5 p-6 sm:p-7 relative font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-purple-950 transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="pr-8">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-100 text-pink-700">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-pink-700 uppercase">
                Enterprise Access Governance
              </span>
              <h2 className="text-xl font-extrabold text-purple-950 tracking-tight">
                Corporate User Status & Permissions
              </h2>
            </div>
          </div>
          <p className="text-xs text-zinc-600 mt-2">
            Control dashboard access for this corporate representative. Non-active statuses immediately lock their dashboard.
          </p>
        </div>

        {/* Selected Employee Summary Card */}
        <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="font-extrabold text-purple-950 text-sm flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-pink-600" />
              <span>{user.name}</span>
            </div>
            <div className="font-mono text-zinc-600 flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-zinc-400" />
              <span>{user.email}</span>
            </div>
            <div className="text-zinc-700 flex items-center gap-1.5">
              <Building className="w-3 h-3 text-zinc-400" />
              <span>{user.corporateRole || 'Corporate Staff'}</span>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 block">
              Corporate ID
            </span>
            <span className="font-mono font-extrabold text-sm text-pink-700 block">
              {user.corporateUserId || 'WDS-ACTIVE'}
            </span>
            <div className="pt-1">
              <span className="text-[10px] text-zinc-500">Current: </span>
              <span
                className={`inline-block px-2 py-0.5 rounded-full font-mono text-[10px] font-extrabold uppercase border ${
                  user.accountStatus === 'banned'
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : user.accountStatus === 'suspended'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : user.accountStatus === 'terminated'
                    ? 'bg-zinc-100 text-zinc-800 border-zinc-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                {user.accountStatus || 'active'}
              </span>
            </div>
          </div>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-900 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-700 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form: Status Selection & Reason */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-purple-950 block mb-2">
              Select New Account Standing:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {statusOptions.map((opt) => {
                const isSelected = selectedStatus === opt.status;
                const OptIcon = opt.icon;
                return (
                  <div
                    key={opt.status}
                    onClick={() => {
                      setSelectedStatus(opt.status);
                      if (!reason || PRESET_REASONS[selectedStatus].includes(reason)) {
                        setReason(PRESET_REASONS[opt.status][0]);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${opt.cardBg} ${opt.cardBorder}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        <OptIcon
                          className={`w-4 h-4 ${
                            opt.status === 'active'
                              ? 'text-emerald-600'
                              : opt.status === 'suspended'
                              ? 'text-amber-600'
                              : opt.status === 'banned'
                              ? 'text-red-600'
                              : 'text-zinc-600'
                          }`}
                        />
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <div className="text-xs font-extrabold text-purple-950">
                          {opt.title}
                        </div>
                        <p className="text-[11px] text-zinc-600 leading-tight">
                          {opt.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Preset Reasons */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-purple-950">Quick Reason Presets:</span>
              <span className="text-[11px] text-zinc-500">Click to apply</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_REASONS[selectedStatus].map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setReason(p)}
                  className={`text-[11px] px-2.5 py-1 rounded-xl border transition-colors cursor-pointer text-left ${
                    reason === p
                      ? 'bg-pink-600 text-white border-pink-600 font-semibold'
                      : 'bg-white hover:bg-pink-50 border-pink-200 text-zinc-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Reason Notes Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-purple-950 flex items-center justify-between">
              <span>Reason & Administrative Case Notes:</span>
              <span className="text-[10px] font-normal text-zinc-500">
                (Visible to employee on their restriction screen)
              </span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a clear, objective reason for this administrative status..."
              className="w-full bg-pink-50/50 border border-pink-300 focus:border-pink-600 rounded-xl p-3 text-xs text-zinc-900 outline-none resize-none transition-colors"
              required
            />
          </div>

          {/* Warning summary for non-active statuses */}
          {selectedStatus !== 'active' ? (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Dashboard Lock Immediate Effect:</strong> Changing status to{' '}
                <strong>{selectedStatus.toUpperCase()}</strong> will block the employee from submitting attendance,
                viewing expected data leads, or filing daily reports until an administrator unbans or restores them.
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>Full Access Restored:</strong> Employee will immediately regain full access to their
                corporate dashboard, attendance reporting, and lead records.
              </span>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 rounded-xl text-white text-xs font-bold shadow-md transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                selectedStatus === 'banned'
                  ? 'bg-red-600 hover:bg-red-700'
                  : selectedStatus === 'suspended'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : selectedStatus === 'terminated'
                  ? 'bg-zinc-800 hover:bg-zinc-900'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating Permissions...</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5" />
                  <span>
                    Confirm {selectedStatus === 'active' ? 'Reactivation (Unban)' : selectedStatus.toUpperCase()}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
