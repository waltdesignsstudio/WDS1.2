import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from '../components/AdminDashboard';
import { CorporateDashboard } from '../components/CorporateDashboard';
import { AuthModal } from '../components/AuthModal';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const DashboardPage: React.FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1b031e] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-zinc-300">Authenticating Walt Designs Studio...</span>
        </div>
      </div>
    );
  }

  // 1. Authenticated Admin -> Render Admin Dashboard exclusively
  if (user && profile?.role === 'admin') {
    return <AdminDashboard />;
  }

  // 2. Authenticated Corporate -> Render Corporate Dashboard
  if (user && profile?.role === 'corporate') {
    return <CorporateDashboard />;
  }

  // 3. Unauthenticated -> Show public layout with interactive login modal
  return (
    <div className="min-h-screen bg-[#1b031e] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 py-16 px-4 flex items-center justify-center">
        <AuthModal inline={true} />
      </main>
      <Footer />
    </div>
  );
};
