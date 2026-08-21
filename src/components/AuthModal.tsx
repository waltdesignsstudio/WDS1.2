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
  Eye,
  EyeOff,
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
  const [showPassword, setShowPassword] = useState(false);
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

  // 1. Corporate Login Submit (Email or Corporate User ID + CAPTCHA)
  const handleCorporateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedInput = email.trim();
    if (!trimmedInput || !password) {
      setErrorMessage('Please enter your Corporate Email or Employee ID (WDS-XXXX) and password.');
      return;
    }

    if (!captchaToken) {
      setErrorMessage('Please solve the math question to verify.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(trimmedInput, password, 'corporate');
      if (result.success) {
        handleClose();
        window.location.href = '/dashboard';
      } else {
        setErrorMessage(result.error || 'Invalid Corporate Credentials or Password.');
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

  // 2. Admin Login Submit (Email + Password + CAPTCHA strictly)
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage('Please enter your administrator email and password.');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      setErrorMessage('Please enter your registered Admin email address (e.g. admin@waltdesignsstudio.com).');
      return;
    }

    if (!captchaToken) {
      setErrorMessage('Please solve the math question to verify.');
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
      {/* MODAL CARD: RED TOP HEADER + WHITE BOTTOM BODY */}
      <div className="relative w-full max-w-md bg-white border-2 border-red-700 rounded-3xl shadow-2xl overflow-hidden font-sans text-zinc-900">
        
        {/* Close Button on Red Header */}
        {!inline && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* ========================================================================= */}
        {/* RED HEADER SECTION */}
        {/* ========================================================================= */}
        <div className="bg-[#DC2626] text-white px-6 pt-7 pb-6 text-center shadow-md relative">
          <div className="flex items-center justify-center mb-2.5">
            <img
              src={AGENCY_INFO.logoUrl}
              alt="Walt Designs & Studio"
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/60 shadow-lg"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
            Walt Designs & Studio
          </h2>
          <p className="text-xs font-semibold text-red-100 mt-1 tracking-wide">
            Enterprise Management & Sales Portal
          </p>
        </div>

        {/* ========================================================================= */}
        {/* WHITE BODY SECTION */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-7 space-y-4">

          {/* ================================================================= */}
          {/* VIEW 1: "WHO ARE YOU?" (ROLE SELECTION) */}
          {/* ================================================================= */}
          {currentView === 'choose' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center space-y-1 mb-5">
                <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">
                  Who are you?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600">
                  Select your authorization level to access your workspace.
                </p>
              </div>

              {/* Option 1: Corporate Portal */}
              <button
                type="button"
                onClick={() => handleSwitchView('corporate-login')}
                className="w-full p-4 rounded-2xl bg-white hover:bg-red-50/50 border-2 border-zinc-200 hover:border-red-600 transition-all text-left group flex items-center justify-between cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 group-hover:scale-105 transition-transform shadow-xs">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-zinc-900 group-hover:text-red-700 transition-colors">
                      I am Corporate
                    </h4>
                    <p className="text-xs text-zinc-600">
                      Access to Data & Sales
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Option 2: Admin Portal */}
              <button
                type="button"
                onClick={() => handleSwitchView('admin-login')}
                className="w-full p-4 rounded-2xl bg-white hover:bg-red-50/50 border-2 border-zinc-200 hover:border-red-600 transition-all text-left group flex items-center justify-between cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 group-hover:scale-105 transition-transform shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-zinc-900 group-hover:text-red-700 transition-colors">
                      I am Admin
                    </h4>
                    <p className="text-xs text-zinc-600">
                      Access for IT & Maintain Data
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
              </button>

              <div className="pt-3 text-center border-t border-zinc-100">
                <span className="text-[11px] text-zinc-500 font-mono flex items-center justify-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Protected by 256-bit Enterprise Cloud Security</span>
                </span>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW 2: CORPORATE LOGIN (EMAIL/ID + CAPTCHA) */}
          {/* ================================================================= */}
          {currentView === 'corporate-login' && (
            <form onSubmit={handleCorporateLogin} className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-1">
                <button
                  type="button"
                  onClick={() => handleSwitchView('choose')}
                  className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-red-600 font-bold transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">
                  Corporate Login
                </span>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Corporate User ID or Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800 block">
                  Corporate Email or Employee ID (WDS-XXXX)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="WDS-4827 or name@company.com"
                    className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition-all font-mono"
                  />
                </div>
                <span className="text-[10px] text-zinc-500 block pl-1">
                  Authenticate using your Employee ID (WDS-XXXX) or registered corporate email.
                </span>
              </div>

              {/* Password Input with Eye Toggle */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 focus:bg-white rounded-xl pl-10 pr-10 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 p-1 rounded-md transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* CAPTCHA Widget */}
              <div className="pt-1">
                <CaptchaWidget
                  theme="light"
                  onVerify={(token) => setCaptchaToken(token)}
                  resetTrigger={captchaResetCount}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                <p className="text-[11px] text-zinc-500">
                  New sales representative? Account creation is provisioned exclusively by IT Administrators.
                </p>
              </div>
            </form>
          )}

          {/* ================================================================= */}
          {/* VIEW 3: ADMIN LOGIN (EMAIL + PASSWORD + CAPTCHA) */}
          {/* ================================================================= */}
          {currentView === 'admin-login' && (
            <form onSubmit={handleAdminLogin} className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-1">
                <button
                  type="button"
                  onClick={() => handleSwitchView('choose')}
                  className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-red-600 font-bold transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Admin Hub</span>
                </span>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Admin Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800 block">
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
                    className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition-all font-sans"
                  />
                </div>
                <span className="text-[10px] text-zinc-500 block pl-1">
                  Enter your registered administrator email address.
                </span>
              </div>

              {/* Password Input with Eye Toggle */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800 block">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 focus:bg-white rounded-xl pl-10 pr-10 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 p-1 rounded-md transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* CAPTCHA Widget */}
              <div className="pt-1">
                <CaptchaWidget
                  theme="light"
                  onVerify={(token) => setCaptchaToken(token)}
                  resetTrigger={captchaResetCount}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                <span className="text-[11px] text-zinc-500 font-mono">
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
