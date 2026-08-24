import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CareersPage } from './pages/CareersPage';
import { AuthProvider } from './context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CareersPage />
    </AuthProvider>
  </StrictMode>,
);
