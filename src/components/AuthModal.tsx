import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, Sparkles, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';
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
  const { login, signup, isAuthModalOpen, closeAuthModal, authMode: contextAuthMode } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'signup'>(inline ? initialMode : contextAuthMode || initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize mode if context changes
  React.useEffect(() => {
    if (!inline && contextAuthMode) {
      setMode(contextAuthMode);
    }
  }, [contextAuthMode, inline]);

  const activeIsOpen = inline ? true : (isOpen && isAuthModalOpen);

  if (!activeIsOpen) return null;

  const handleClose = () => {
    setErrorMessage(null);
    if (onClose) onClose();
    if (!inline) closeAuthModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const result = await login(email, password);
        if (result.success) {
          handleClose();
          // Redirect user to dashboard
          window.location.href = '/dashboard';
        } else {
          setErrorMessage(result.error || 'Email or password is incorrect.');
        }
      } else {
        const result = await signup(email, password);
        if (result.success) {
          handleClose();
          // Redirect user to dashboard
          window.location.href = '/dashboard';
        } else {
          setErrorMessage(result.error || 'Failed to create account.');
        }
      }
    } catch (err: any) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className={`w-full max-w-md bg-[#250529] border border-fuchsia-800/40 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 text-white relative ${inline ? 'mx-auto' : ''}`}>
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Close button for modal */}
      {!inline && (
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6">
        <img
          src={AGENCY_INFO.logoUrl}
          alt="Walt Designs & Studio"
          className="w-10 h-10 rounded-lg object-cover ring-1 ring-amber-500/30 shrink-0"
        />
        <div>
          <h3 className="font-bold text-lg text-white leading-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h3>
          <p className="text-xs text-zinc-300">
            {mode === 'login'
              ? 'Sign in to access your client dashboard'
              : 'Sign up to manage and track your agency projects'}
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex p-1 bg-black/40 border border-white/10 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
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
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === 'signup'
              ? 'bg-amber-500 text-black shadow-sm'
              : 'text-zinc-300 hover:text-white'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Error Message Box */}
      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-red-950/80 border border-red-500/50 flex items-start gap-2.5 text-red-200 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
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
          className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch Mode Prompt */}
      <div className="mt-6 text-center text-xs text-zinc-400">
        {mode === 'login' ? (
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 ml-1"
            >
              Sign up here
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 ml-1"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      {content}
    </div>
  );
};
