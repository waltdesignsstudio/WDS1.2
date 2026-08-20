import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AGENCY_INFO } from '../data/agencyData';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  inline?: boolean;
}

type ModalView = 'choose' | 'corporate-login' | 'admin-login' | 'admin-register';

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
    authModalInitialView,
    setUserType,
  } = useAuth();

  const [currentView, setCurrentView] = useState<ModalView>('choose');

  // Form Fields
  const [identifier, setIdentifier] = useState(''); // Email or WDS-XXXX ID for login
  const [password, setPassword] = useState('');

  // Admin Registration Fields
  const [adminName, setAdminName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      setCurrentView(authModalInitialView || 'choose');
      setErrorMessage(null);
      setSuccessMessage(null);
      setPassword('');
    }
  }, [isAuthModalOpen, authModalInitialView]);

  const activeIsOpen = inline ? true : (isOpen && isAuthModalOpen);

  if (!activeIsOpen) return null;

  const handleClose = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (onClose) onClose();
    if (!inline) closeAuthModal();
  };

  // 1. Corporate Login Submit
  const handleCorporateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (!identifier.trim() || !password) {
        setErrorMessage('Please enter your Corporate User ID (WDS-XXXX) / Email and password.');
        setIsSubmitting(false);
        return;
      }

      const result = await login(identifier, password, 'corporate');
      if (result.success) {
        handleClose();
        // Refresh/reload into authorized Corporate portal
        window.location.href = '/dashboard';
      } else {
        setErrorMessage(result.error || 'Invalid Corporate User ID, Email, or Password.');
      }
    } catch {
      setErrorMessage('An unexpected authentication error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Admin Login Submit
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (!identifier.trim() || !password) {
        setErrorMessage('Please enter your Admin credentials.');
        setIsSubmitting(false);
        return;
      }

      const result = await login(identifier, password, 'admin');
      if (result.success) {
        handleClose();
        // Refresh/reload into authorized Admin Dashboard
        window.location.href = '/dashboard';
      } else {
        setErrorMessage(result.error || 'Invalid Admin Email or Password.');
      }
    } catch {
      setErrorMessage('An unexpected authentication error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Admin Registration Submit
  const handleAdminRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (!adminName.trim() || !adminPhone.trim() || !adminEmail.trim() || !adminPassword) {
        setErrorMessage('Please fill in all required registration fields.');
        setIsSubmitting(false);
        return;
      }

      if (adminPassword.length < 6) {
        setErrorMessage('Password must be at least 6 characters in length.');
        setIsSubmitting(false);
        return;
      }

      if (adminPassword !== adminConfirmPassword) {
        setErrorMessage('Passwords do not match. Please verify your password.');
        setIsSubmitting(false);
        return;
      }

      const result = await signupAdmin({
        name: adminName.trim(),
        phone: adminPhone.trim(),
        email: adminEmail.trim(),
        password: adminPassword,
      });

      if (result.success) {
        // STRICT REQUIREMENT: Stay on / return to Admin Login screen!
        // Admin manually enters credentials to log in.
        setIdentifier(adminEmail.trim());
        setPassword('');
        setAdminPassword('');
        setAdminConfirmPassword('');
        setCurrentView('admin-login');
        setSuccessMessage('Admin registration successful! Please enter your password to log in.');
      } else {
        setErrorMessage(result.error || 'Failed to register admin account.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during admin registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className={`w-full max-w-lg bg-[#250529] border border-fuchsia-800/50 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 text-white relative ${inline ? 'mx-auto' : 'max-h-[90vh] overflow-y-auto'}`}>
      {/* Ambient background lighting */}
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
            Walt Designs & Studio
          </h3>
          <p className="text-xs text-zinc-300">
            Enterprise Identity & Operations Portal
          </p>
        </div>
      </div>

      {/* Feedback Messages */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 flex items-start gap-2.5 text-red-200 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-start gap-2.5 text-emerald-200 text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. "WHO ARE YOU?" SELECTION SCREEN */}
      {/* ========================================================================= */}
      {currentView === 'choose' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Who are you?
            </h2>
            <p className="text-xs text-zinc-300 mt-0.5">
              Select your authorized access tier to continue
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {/* OPTION 1: Corporate */}
            <button
              type="button"
              onClick={() => {
                setUserType('corporate');
                setCurrentView('corporate-login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="w-full p-4 rounded-xl bg-black/40 hover:bg-amber-500/10 border border-white/15 hover:border-amber-500 text-left transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                      I am Corporate
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Access to Data & Sales
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </button>

            {/* OPTION 2: Admin */}
            <button
              type="button"
              onClick={() => {
                setUserType('admin');
                setCurrentView('admin-login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="w-full p-4 rounded-xl bg-black/40 hover:bg-amber-500/10 border border-white/15 hover:border-amber-500 text-left transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                      I am Admin
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Access for IT & Maintain Data
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CORPORATE LOGIN (STRICTLY LOGIN ONLY — NO SELF-REGISTRATION) */}
      {/* ========================================================================= */}
      {currentView === 'corporate-login' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Corporate Login</span>
              </h3>
              <p className="text-xs text-zinc-300 mt-0.5">
                Access to Data & Sales
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCurrentView('choose');
                setErrorMessage(null);
              }}
              className="text-xs text-zinc-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          <form onSubmit={handleCorporateLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Corporate User ID (WDS-XXXX) or Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. WDS-4827 or yourname@waltdesignsstudio.in"
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
                  <span>Login to Corporate Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Admin Managed Note */}
          <div className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-start gap-2.5 text-[11px] text-zinc-400">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Corporate sales accounts and WDS User IDs are provisioned exclusively by IT Administrators from the Admin Dashboard.
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ADMIN LOGIN (CONTAINS LOGIN & REGISTER LINK) */}
      {/* ========================================================================= */}
      {currentView === 'admin-login' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin Login</span>
              </h3>
              <p className="text-xs text-zinc-300 mt-0.5">
                Access for IT & Maintain Data
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCurrentView('choose');
                setErrorMessage(null);
              }}
              className="text-xs text-zinc-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Admin Email / Credentials
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
                Master Password
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
                  <span>Login to Admin Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Admin Registration Link */}
          <div className="pt-2 border-t border-white/10 text-center">
            <p className="text-xs text-zinc-400">
              Need to initialize an administrator account?{' '}
              <button
                type="button"
                onClick={() => {
                  setCurrentView('admin-register');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  if (identifier && identifier.includes('@')) {
                    setAdminEmail(identifier);
                  }
                }}
                className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-2 cursor-pointer transition-colors ml-1"
              >
                Register Admin
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ADMIN REGISTRATION */}
      {/* ========================================================================= */}
      {currentView === 'admin-register' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin Registration</span>
              </h3>
              <p className="text-xs text-zinc-300 mt-0.5">
                Register a verified Administrator account
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCurrentView('admin-login');
                setErrorMessage(null);
              }}
              className="text-xs text-zinc-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          </div>

          <form onSubmit={handleAdminRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Admin Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Master Administrator"
                  required
                  className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@waltdesignsstudio.in"
                    required
                    className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

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
                    className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    required
                    className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={adminConfirmPassword}
                    onChange={(e) => setAdminConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Complete Admin Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => {
                setCurrentView('admin-login');
                setErrorMessage(null);
              }}
              className="text-xs text-zinc-400 hover:text-white cursor-pointer"
            >
              Already registered? <span className="text-amber-400 font-bold">Back to Admin Login</span>
            </button>
          </div>
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
