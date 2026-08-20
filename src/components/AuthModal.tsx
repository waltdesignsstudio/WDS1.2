import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  ChevronLeft,
  Terminal,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AGENCY_INFO } from '../data/agencyData';
import { CaptchaWidget } from './CaptchaWidget';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  inline?: boolean;
}

type ModalView = 'choose' | 'corporate-login' | 'admin-login';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen = true,
  onClose,
  inline = false,
}) => {
  const {
    login,
    isAuthModalOpen,
    closeAuthModal,
    authModalInitialView,
  } = useAuth();

  const [currentView, setCurrentView] = useState<ModalView>('choose');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaResetCount, setCaptchaResetCount] = useState(0);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      setCurrentView(authModalInitialView || 'choose');
      setErrorMessage(null);
      setEmail('');
      setPassword('');
      setCaptchaToken(null);
      setCaptchaResetCount((c) => c + 1);
    }
  }, [isAuthModalOpen, authModalInitialView]);

  const activeIsOpen = inline ? true : (isOpen && isAuthModalOpen);

  if (!activeIsOpen) return null;

  const handleClose = () => {
    setErrorMessage(null);
    setEmail('');
    setPassword('');
    setCaptchaToken(null);
    if (onClose) onClose();
    if (!inline) closeAuthModal();
  };

  const handleSwitchView = (view: ModalView) => {
    setCurrentView(view);
    setErrorMessage(null);
    setCaptchaToken(null);
    setCaptchaResetCount((c) => c + 1);
  };

  // 1. Corporate Login Submit (Email Only + CAPTCHA)
  const handleCorporateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage('Please enter your corporate email address and password.');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      setErrorMessage('Please enter a valid Corporate Email address (e.g., name@company.com). Corporate login requires email; WDS ID is for display only.');
      return;
    }

    if (!captchaToken) {
      setErrorMessage('Please complete the CAPTCHA.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(trimmedEmail, password, 'corporate');
      if (result.success) {
        handleClose();
        window.location.href = '/dashboard';
      } else {
        setErrorMessage(result.error || 'Invalid Corporate Email or Password.');
        setCaptchaToken(null);
        setCaptchaResetCount((c) => c + 1);
      }
    } catch {
      setErrorMessage('An unexpected authentication error occurred. Please try again.');
      setCaptchaToken(null);
      setCaptchaResetCount((c) => c + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Admin Login Submit (Email + Password + CAPTCHA)
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage('Please enter your administrator email and password.');
      return;
    }

    if (!captchaToken) {
      setErrorMessage('Please complete the CAPTCHA.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(trimmedEmail, password, 'admin');
      if (result.success) {
        handleClose();
        window.location.href = '/dashboard';
      } else {
        setErrorMessage(result.error || 'Invalid Administrator Email or Password.');
        setCaptchaToken(null);
        setCaptchaResetCount((c) => c + 1);
      }
    } catch {
      setErrorMessage('An unexpected authentication error occurred. Please try again.');
      setCaptchaToken(null);
      setCaptchaResetCount((c) => c + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={
        inline
          ? 'w-full max-w-md mx-auto my-6'
          : 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200'
      }
    >
      <div className="relative w-full max-w-md bg-[#250529] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden font-sans text-white">
        
        {/* Close Button (Hidden when inline) */}
        {!inline && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header Branding */}
        <div className="px-6 pt-6 pb-4 border-b border-white/10 text-center bg-black/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img
              src={AGENCY_INFO.logoUrl}
              alt="Walt Designs & Studio"
              className="w-10 h-10 rounded-lg object-cover ring-1 ring-amber-500/40"
            />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Walt Designs & Studio
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Enterprise Management & Sales Portal
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">

          {/* ================================================================= */}
          {/* VIEW 1: "WHO ARE YOU?" (ROLE SELECTION) */}
          {/* ================================================================= */}
          {currentView === 'choose' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center space-y-1 mb-5">
                <h3 className="text-lg font-bold text-white">Who are you?</h3>
                <p className="text-xs text-zinc-300">
                  Select your authorization level to access your workspace.
                </p>
              </div>

              {/* Option 1: Corporate Portal */}
              <button
                type="button"
                onClick={() => handleSwitchView('corporate-login')}
                className="w-full p-4 rounded-xl bg-black/30 hover:bg-black/50 border border-white/10 hover:border-amber-500/60 transition-all text-left group flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                      I am Corporate
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Access to Data & Sales
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Option 2: Admin Portal */}
              <button
                type="button"
                onClick={() => handleSwitchView('admin-login')}
                className="w-full p-4 rounded-xl bg-black/30 hover:bg-black/50 border border-white/10 hover:border-amber-500/60 transition-all text-left group flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                      I am Admin
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Access for IT & Maintain Data
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-zinc-400 font-mono">
                  Protected by 256-bit Enterprise Cloud Security
                </span>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW 2: CORPORATE LOGIN (EMAIL ONLY + CAPTCHA, NO REGISTRATION) */}
          {/* ================================================================= */}
          {currentView === 'corporate-login' && (
            <form onSubmit={handleCorporateLogin} className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-1">
                <button
                  type="button"
                  onClick={() => handleSwitchView('choose')}
                  className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Corporate Login
                </span>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Corporate Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none transition-all"
                  />
                </div>
                <span className="text-[10px] text-zinc-400 block pl-1">
                  Authenticate using your registered corporate email.
                </span>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* CAPTCHA Widget */}
              <div className="pt-1">
                <CaptchaWidget
                  onVerify={(token) => setCaptchaToken(token)}
                  resetTrigger={captchaResetCount}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4" />
                    <span>Login to Corporate Portal</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-zinc-400">
                  New sales representative? Account creation is provisioned exclusively by IT Administrators.
                </p>
              </div>
            </form>
          )}

          {/* ================================================================= */}
          {/* VIEW 3: ADMIN LOGIN (EMAIL + PASSWORD + CAPTCHA, NO REGISTRATION) */}
          {/* ================================================================= */}
          {currentView === 'admin-login' && (
            <form onSubmit={handleAdminLogin} className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-1">
                <button
                  type="button"
                  onClick={() => handleSwitchView('choose')}
                  className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Terminal className="w-3 h-3" />
                  <span>Admin Hub</span>
                </span>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Admin Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@waltdesignsstudio.com"
                    className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* CAPTCHA Widget */}
              <div className="pt-1">
                <CaptchaWidget
                  onVerify={(token) => setCaptchaToken(token)}
                  resetTrigger={captchaResetCount}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating Admin...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Login to Admin Dashboard</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-zinc-400 font-mono">
                  Restricted Access • Authorized Administrators Only
                </span>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
