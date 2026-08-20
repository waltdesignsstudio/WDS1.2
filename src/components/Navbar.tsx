import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ArrowUpRight,
  Phone,
  Sparkles,
  LogIn,
  LogOut,
  LayoutDashboard,
  Shield,
  ShieldCheck,
  Building2,
  Terminal,
} from 'lucide-react';
import { AGENCY_INFO } from '../data/agencyData';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

interface NavbarProps {
  currentPage?: 'home' | 'services' | 'about' | 'contact' | 'dashboard';
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage = 'home' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, openAuthModal, logout } = useAuth();

  const isAdmin = user && profile?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/', key: 'home' },
    { label: 'Services', href: '/services', key: 'services' },
    { label: 'About us', href: '/about', key: 'about' },
    { label: 'Contact us', href: '/contact', key: 'contact' },
  ];

  // =========================================================================
  // AUTHENTICATED ADMIN NAVBAR: Dedicated, isolated admin navigation
  // Completely hides public website links (Home, Services, About, Contact, etc.)
  // =========================================================================
  if (isAdmin) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-[#1e0322] border-b border-amber-500/30 shadow-xl py-3 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              
              {/* Admin Brand & Operations Identity */}
              <div className="flex items-center gap-3">
                <img
                  src={AGENCY_INFO.logoUrl}
                  alt="Walt Designs & Studio"
                  className="w-9 h-9 rounded-md object-cover ring-1 ring-amber-500/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                      Walt Designs & Studio
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black uppercase tracking-wider">
                      Admin IT Hub
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono hidden sm:block">
                    Administrator: {profile?.adminUserId || 'ADM-PRIMARY'} • {user.email}
                  </p>
                </div>
              </div>

              {/* Admin Actions: Dashboard Indicator & Sign Out */}
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs font-mono text-zinc-300">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>IT Operations Mode</span>
                </div>

                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-sm transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Control Hub</span>
                </a>

                <button
                  onClick={() => logout()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-200 shadow-sm transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

            </div>
          </div>
        </header>

        <AuthModal />
      </>
    );
  }

  // =========================================================================
  // STANDARD PUBLIC & CORPORATE NAVBAR
  // =========================================================================
  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-[#29072e] border-b border-fuchsia-900/40 shadow-md ${
        isScrolled ? 'py-2.5 bg-[#250529]/95 backdrop-blur-md' : 'py-3 bg-[#2b0830]'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* ZONE 1: Brand Title & Wordmark */}
            <a 
              href="/" 
              className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg pr-1"
            >
              <img 
                src={AGENCY_INFO.logoUrl} 
                alt="Walt Designs & Studio Logo" 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-md object-cover ring-1 ring-amber-500/30 group-hover:ring-amber-400 transition-all shrink-0"
              />
              <span className="font-bold text-sm sm:text-base md:text-lg tracking-tight text-white group-hover:text-amber-300 transition-colors truncate max-w-[170px] xs:max-w-[220px] sm:max-w-none">
                Walt Designs & Studio
              </span>
            </a>

            {/* ZONE 2: Nav Links */}
            <nav className="hidden md:flex items-center gap-1 bg-black/25 border border-white/10 rounded-full px-3 py-1">
              {navLinks.map((link) => {
                const isActive = currentPage === link.key;
                return (
                  <a
                    key={link.key}
                    href={link.href}
                    className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'text-zinc-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* ZONE 3: Primary Actions (Login / Dashboard / Contact CTA) */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              {user ? (
                <div className="flex items-center gap-1.5">
                  <a
                    href="/dashboard"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
                      currentPage === 'dashboard'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-black/30 border-white/15 text-zinc-200 hover:text-white hover:border-amber-500/50'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                    <span>{profile?.role === 'corporate' ? 'Corporate Portal' : 'Dashboard'}</span>
                  </a>
                  <button
                    onClick={() => logout()}
                    className="p-1.5 rounded-full text-zinc-400 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-all cursor-pointer"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('corporate')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/15 text-white shadow-sm transition-all whitespace-nowrap cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Login</span>
                </button>
              )}

              <a
                href="/contact"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-sm transition-all whitespace-nowrap"
              >
                <Sparkles className="w-3 h-3" />
                <span>Get In Touch</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-1.5 shrink-0">
              {user ? (
                <a
                  href="/dashboard"
                  className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-500/50 text-amber-300 whitespace-nowrap flex items-center gap-1"
                >
                  <LayoutDashboard className="w-3 h-3" />
                  <span>Portal</span>
                </a>
              ) : (
                <button
                  onClick={() => openAuthModal('corporate')}
                  className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/15 text-white whitespace-nowrap flex items-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-3 h-3 text-amber-400" />
                  <span>Login</span>
                </button>
              )}
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg bg-black/40 border border-white/15 text-zinc-200 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#240528]/98 border-b border-fuchsia-900/50 px-4 pt-3 pb-5 mt-2 space-y-2.5 backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = currentPage === link.key;
                return (
                  <a
                    key={link.key}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
                      isActive
                        ? 'bg-amber-500 text-black font-bold'
                        : 'text-zinc-200 hover:bg-white/10'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                  </a>
                );
              })}
            </div>

            <div className="pt-2.5 border-t border-white/10 flex flex-col gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <a
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold bg-amber-500 text-black shadow-sm"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Go to Dashboard</span>
                  </a>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-2 rounded-lg text-xs font-bold bg-red-950/60 border border-red-500/40 text-red-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    openAuthModal('corporate');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold bg-white/10 border border-white/20 text-white"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Login</span>
                </button>
              )}

              <a
                href="tel:+918276825128"
                className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-mono text-zinc-200 bg-black/30 border border-white/10"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call +91 8276825128</span>
              </a>
              <a
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold bg-amber-500 text-black shadow-sm"
              >
                <span>Start Your Project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Global Auth Modal */}
      <AuthModal />
    </>
  );
};
