import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  KeyRound,
  User,
  Phone,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AGENCY_INFO } from '../data/agencyData';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  inline?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen = true,
  onClose,
  inline = false,
}) => {
  const {
    login,
    signupAdmin,
    isAuthModalOpen,
    closeAuthModal,
    userType,
    setUserType,
  } = useAuth();

  const [selectedRole, setSelectedRole] = useState<'corporate' | 'admin'>(userType || 'corporate');
  const [adminMode, setAdminMode] = useState<'login' | 'setup'>('login');

  // Form Fields
  const [identifier, setIdentifier] = useState(''); // Email or WDS-XXXX ID for login
  const [password, setPassword] = useState('');
  
  // Admin initial setup fields
  const [adminName, setAdminName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (userType) {
      setSelectedRole(userType);
    }
  }, [userType]);

  const activeIsOpen = inline ? true : (isOpen && isAuthModalOpen);

  if (!activeIsOpen) return null;

  const handleClose = () => {
    setErrorMessage(null);
    if (onClose) onClose();
    if (!inline) closeAuthModal();
  };

  const handleRoleSelect = (role: 'corporate' | 'admin') => {
    setSelectedRole(role);
    setUserType(role);
    setErrorMessage(null);
  };

  const handleCorporateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (!identifier.trim() || !password) {
        setErrorMessage('Please enter your Corporate User ID / Email and password.');
        setIsSubmitting(false);
        return;
      }

      const result = await login(identifier, password);
      if (result.success) {
        handleClose();
        window.location.href = '/dashboard';
      } else {
        setErrorMessage(result.error || 'Invalid Corporate User ID, Email, or Password.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (adminMode === 'login') {
        if (!identifier.trim() || !password) {
          setErrorMessage('Please enter your Admin credentials.');
          setIsSubmitting(false);
          return;
        }

        const result = await login(identifier, password);
        if (result.success) {
          handleClose();
          window.location.href = '/dashboard';
        } else {
          setErrorMessage(result.error || 'Invalid Admin Email or Password.');
        }
      } else {
        // Admin Initial Setup
        if (!adminName || !adminPhone || !adminEmail || !adminPassword) {
          setErrorMessage('Please complete all admin registration fields.');
          setIsSubmitting(false);
          return;
        }

        const result = await signupAdmin({
          name: adminName,
          phone: adminPhone,
          email: adminEmail,
          password: adminPassword,
        });

        if (result.success) {
          handleClose();
          window.location.href = '/dashboard';
        } else {
          setErrorMessage(result.error || 'Failed to setup admin account.');
        }
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className={`w-full max-w-lg bg-[#250529] border border-fuchsia-800/40 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 text-white relative ${inline ? 'mx-auto' : 'max-h-[90vh] overflow-y-auto'}`}>
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Close button for modal */}
      {!inline && (
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 z-10 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-5">
        <img
          src={AGENCY_INFO.logoUrl}
          alt="Walt Designs & Studio"
          className="w-10 h-10 rounded-lg object-cover ring-1 ring-amber-500/30 shrink-0"
        />
        <div>
          <h3 className="font-bold text-lg text-white leading-tight">
            Walt Portal Authentication
          </h3>
          <p className="text-xs text-zinc-300">
            Select your account profile to sign in
          </p>
        </div>
      </div>

      {/* 2 OPTIONS POP-UP AS SPECIFIED:
          Option 1: I am in Corporate (Access User data & progress)
          Option 2: I am Admin (Access to IT & Technical UI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
        <button
          type="button"
          onClick={() => handleRoleSelect('corporate')}
          className={`p-3.5 rounded-xl border flex flex-col items-start transition-all cursor-pointer text-left ${
            selectedRole === 'corporate'
              ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm ring-1 ring-amber-500/50'
              : 'bg-black/30 border-white/10 text-zinc-300 hover:border-white/20 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className={`w-4 h-4 ${selectedRole === 'corporate' ? 'text-amber-400' : 'text-zinc-400'}`} />
            <span className="text-xs font-bold">I am in Corporate</span>
          </div>
          <span className="text-[11px] text-zinc-400 leading-tight">
            (Access User data & progress)
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect('admin')}
          className={`p-3.5 rounded-xl border flex flex-col items-start transition-all cursor-pointer text-left ${
            selectedRole === 'admin'
              ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm ring-1 ring-amber-500/50'
              : 'bg-black/30 border-white/10 text-zinc-300 hover:border-white/20 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className={`w-4 h-4 ${selectedRole === 'admin' ? 'text-amber-400' : 'text-zinc-400'}`} />
            <span className="text-xs font-bold">I am Admin</span>
          </div>
          <span className="text-[11px] text-zinc-400 leading-tight">
            (Access to IT & Technical UI)
          </span>
        </button>
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 flex items-start gap-2.5 text-red-200 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CORPORATE LOGIN ONLY (Strictly NO registration options) */}
      {/* ========================================================================= */}
      {selectedRole === 'corporate' ? (
        <div className="space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Corporate Login</span>
            </h4>
            <p className="text-xs text-zinc-300 mt-0.5">
              Sign in with your assigned WDS Corporate User ID or official email.
            </p>
          </div>

          <form onSubmit={handleCorporateLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Corporate User ID / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. WDS-4827 or user@waltdesignsstudio.in"
                  required
                  className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Admin Managed Note */}
          <div className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-start gap-2.5 text-[11px] text-zinc-400">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Corporate sales accounts and WDS User IDs are provisioned exclusively by IT Administrators.
            </span>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. ADMIN AUTHENTICATION (Sign In / Initial Setup) */
        /* ========================================================================= */
        <div className="space-y-4">
          <div className="flex p-1 bg-black/40 border border-white/10 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setAdminMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                adminMode === 'login'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              Admin Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAdminMode('setup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                adminMode === 'setup'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              Initial Admin Setup
            </button>
          </div>

          <form onSubmit={handleAdminAuth} className="space-y-3.5">
            {adminMode === 'login' ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="admin@waltdesignsstudio.in"
                      required
                      className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Master Admin Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Admin Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="e.g. Master Administrator"
                      required
                      className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        placeholder="+91 8276825128"
                        required
                        className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Admin Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="priyanshukumarjha604@gmail.com"
                        required
                        className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Master Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {adminMode === 'login' ? 'Access Admin Control Hub' : 'Register Admin Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {content}
    </div>
  );
};
