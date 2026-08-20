import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AboutPage } from './pages/AboutPage';
import { AuthProvider } from './context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AboutPage />
    </AuthProvider>
  </StrictMode>,
);
