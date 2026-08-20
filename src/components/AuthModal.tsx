import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Briefcase,
  ShieldCheck,
  Phone,
  MapPin,
  RefreshCw,
  KeyRound,
  User,
  BadgeCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AGENCY_INFO } from '../data/agencyData';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialMode?: 'login' | 'signup';
  inline?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen = true,
  onClose,
  initialMode = 'login',
  inline = false,
}) => {
  const {
    login,
    signupCorporate,
    signupAdmin,
    isAuthModalOpen,
    closeAuthModal,
    authMode: contextAuthMode,
    userType: contextUserType,
    setUserType: setContextUserType,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(inline ? initialMode : contextAuthMode || initialMode);
  const [selectedRole, setSelectedRole] = useState<'corporate' | 'admin'>(contextUserType || 'corporate');

  // Form Fields
  const [identifier, setIdentifier] = useState(''); // Email or AVL ID for login
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [corporateRole, setCorporateRole] = useState('Asst. Sales Manager');
  const [avlId, setAvlId] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize mode if context changes
  React.useEffect(() => {
    if (!inline && contextAuthMode) {
      setMode(contextAuthMode);
    }
  }, [contextAuthMode, inline]);

  React.useEffect(() => {
    if (contextUserType) {
      setSelectedRole(contextUserType);
    }
  }, [contextUserType]);

  const activeIsOpen = inline ? true : (isOpen && isAuthModalOpen);

  if (!activeIsOpen) return null;

  const handleClose = () => {
    setErrorMessage(null);
    if (onClose) onClose();
    if (!inline) closeAuthModal();
  };

  // Unique AVL ID Generator
  const generateUniqueAvlId = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const generated = `AVL-${randomNum}`;
    setAvlId(generated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        if (!identifier || !password) {
          setErrorMessage('Please enter your User ID or Email and password.');
          setIsSubmitting(false);
          return;
        }

        const result = await login(identifier, password);
        if (result.success) {
          handleClose();
          window.location.href = '/dashboard';
        } else {
          setErrorMessage(result.error || 'Email or password is incorrect.');
        }
      } else {
        // Sign Up Mode
        if (selectedRole === 'corporate') {
          if (!name || !phone || !email || !password || !location) {
            setErrorMessage('Please complete all required fields.');
            setIsSubmitting(false);
            return;
          }
          if (!avlId) {
            setErrorMessage('Please click "Generate User ID" to create your unique AVL ID.');
            setIsSubmitting(false);
            return;
          }

          const result = await signupCorporate({
            name,
            phone,
            email,
            location,
            corporateRole,
            password,
            avlId,
          });

          if (result.success) {
            handleClose();
            window.location.href = '/dashboard';
          } else {
            setErrorMessage(result.error || 'Failed to create account.');
          }
        } else {
          // Admin Sign Up
          if (!name || !phone || !email || !password) {
            setErrorMessage('Please complete all required fields.');
            setIsSubmitting(false);
            return;
          }

          const result = await signupAdmin({
            name,
            phone,
            email,
            password,
          });

          if (result.success) {
            handleClose();
            window.location.href = '/dashboard';
          } else {
            setErrorMessage(result.error || 'Failed to create account.');
          }
        }
      }
    } catch (err: any) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className={`w-full max-w-lg bg-[#250529] border border-fuchsia-800/40 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 text-white relative ${inline ? 'mx-auto' : 'max-h-[90vh] overflow-y-auto'}`}>
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Close button for modal */}
      {!inline && (
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 z-10"
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
            Walt Portal Access
          </h3>
          <p className="text-xs text-zinc-300">
            Select your account department to proceed
          </p>
        </div>
      </div>

      {/* ROLE SELECTION BUTTONS: "I am in Corporate Sales" vs "I am Admin" */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        <button
          type="button"
          onClick={() => {
            setSelectedRole('corporate');
            setContextUserType('corporate');
            setErrorMessage(null);
          }}
          className={`p-3 rounded-xl border flex flex-col items-start transition-all cursor-pointer ${
            selectedRole === 'corporate'
              ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm ring-1 ring-amber-500/50'
              : 'bg-black/30 border-white/10 text-zinc-300 hover:border-white/20 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className={`w-4 h-4 ${selectedRole === 'corporate' ? 'text-amber-400' : 'text-zinc-400'}`} />
            <span className="text-xs font-bold">I am in Corporate Sales</span>
          </div>
          <span className="text-[11px] text-zinc-400 leading-tight">
            Sales managers & executives
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedRole('admin');
            setContextUserType('admin');
            setErrorMessage(null);
          }}
          className={`p-3 rounded-xl border flex flex-col items-start transition-all cursor-pointer ${
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
            Studio operations & review
          </span>
        </button>
      </div>

      {/* Mode Switcher Tabs: Sign In / Create Account */}
      <div className="flex p-1 bg-black/40 border border-white/10 rounded-xl mb-5">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mode === 'login'
              ? 'bg-amber-500 text-black shadow-sm'
              : 'text-zinc-300 hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signup');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mode === 'signup'
              ? 'bg-amber-500 text-black shadow-sm'
              : 'text-zinc-300 hover:text-white'
          }`}
        >
          Register Account
        </button>
      </div>

      {/* Error Message Box */}
      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-red-950/80 border border-red-500/50 flex items-start gap-2.5 text-red-200 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* FORM: LOGIN VS REGISTRATION */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {mode === 'login' ? (
          /* LOGIN MODE: Can login using User ID (AVL ID) or Email and Password */
          <>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                {selectedRole === 'corporate' ? 'User ID (AVL ID) or Email' : 'Admin Email / User ID'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={selectedRole === 'corporate' ? 'e.g. AVL-10294 or name@company.com' : 'admin@waltdesignsstudio.in'}
                  required
                  className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-sans"
                />
              </div>
              {selectedRole === 'corporate' && (
                <p className="text-[11px] text-zinc-400 mt-1">
                  You can sign in using either your generated AVL ID or your registered email.
                </p>
              )}
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
          </>
        ) : selectedRole === 'corporate' ? (
          /* CORPORATE REGISTRATION MODE: Name, Number, Email, Location, Role, Password, Generate User ID */
          <>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    required
                    className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Location / Territory *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, Maharashtra"
                    required
                    className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Corporate Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="corporate.rep@waltdesignsstudio.in"
                  required
                  className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Corporate Designation / Role *
              </label>
              <select
                value={corporateRole}
                onChange={(e) => setCorporateRole(e.target.value)}
                className="w-full bg-[#1b031e] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Asst. Sales Manager">Asst. Sales Manager</option>
                <option value="Senior Sales Manager">Senior Sales Manager</option>
                <option value="Corporate Sales Executive">Corporate Sales Executive</option>
                <option value="Enterprise Territory Lead">Enterprise Territory Lead</option>
              </select>
            </div>

            {/* GENERATE USER ID (AVL ID) BUTTON & DISPLAY */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-300 block">
                    Unique Corporate AVL ID *
                  </span>
                  <span className="text-[11px] text-zinc-300">
                    Required for corporate login and milestone attribution
                  </span>
                </div>
                <button
                  type="button"
                  onClick={generateUniqueAvlId}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generate User ID</span>
                </button>
              </div>

              {avlId ? (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-black/50 border border-amber-500/50 text-amber-300 font-mono font-bold text-sm">
                  <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Assigned ID: {avlId}</span>
                </div>
              ) : (
                <p className="text-[11px] text-amber-200/80 italic">
                  Click the "Generate User ID" button above to assign your unique AVL ID.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Create Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </>
        ) : (
          /* ADMIN REGISTRATION MODE: Name, Number, Email, Password */
          <>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Admin Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Studio Administrator"
                  required
                  className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Contact Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 8276825128"
                  required
                  className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Admin Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priyanshukumarjha604@gmail.com"
                  required
                  className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Admin Master Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {mode === 'login'
                  ? `Sign In as ${selectedRole === 'corporate' ? 'Corporate Sales' : 'Admin'}`
                  : 'Create Account & Save in Database'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch Mode Prompt */}
      <div className="mt-5 text-center text-xs text-zinc-400">
        {mode === 'login' ? (
          <p>
            Need a new {selectedRole === 'corporate' ? 'Corporate' : 'Admin'} account?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
            >
              Register here
            </button>
          </p>
        ) : (
          <p>
            Already registered?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
            >
              Sign in here
            </button>
          </p>
        )}
      </div>
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
