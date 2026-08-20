import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DashboardPage } from './pages/DashboardPage';
import { AuthProvider } from './context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <DashboardPage />
    </AuthProvider>
  </StrictMode>,
);
