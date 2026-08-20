import React, { useEffect, useState } from 'react';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboard } from './components/AdminDashboard';
import { CorporateDashboard } from './components/CorporateDashboard';
import { AuthModal } from './components/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.toLowerCase();
    }
    return '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname.toLowerCase());
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1b031e] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-zinc-300">Loading Walt Designs Studio...</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // REQUIREMENT 7 & 14: AUTHENTICATED ADMIN ACCESS
  // When an Admin is logged in:
  // DO NOT render public website, header, footer, Home, Services, About, etc.
  // The screen renders ONLY the separate Admin Dashboard interface.
  // =========================================================================
  if (user && profile?.role === 'admin') {
    return <AdminDashboard />;
  }

  // =========================================================================
  // REQUIREMENT 14: AUTHENTICATED CORPORATE ACCESS
  // When Corporate user is logged in:
  // Render ONLY the Corporate Dashboard.
  // =========================================================================
  if (user && profile?.role === 'corporate') {
    return <CorporateDashboard />;
  }

  // =========================================================================
  // PUBLIC WEBSITE (NO AUTHENTICATED USER)
  // Preserves existing public pages, navbar, footer, colors, and layout.
  // =========================================================================
  let PageComponent = <HomePage />;
  if (currentPath.includes('dashboard') || currentPath.includes('login') || currentPath.includes('auth')) {
    PageComponent = <DashboardPage />;
  } else if (currentPath.includes('services')) {
    PageComponent = <ServicesPage />;
  } else if (currentPath.includes('about')) {
    PageComponent = <AboutPage />;
  } else if (currentPath.includes('contact')) {
    PageComponent = <ContactPage />;
  }

  return (
    <>
      {PageComponent}
      <AuthModal />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
