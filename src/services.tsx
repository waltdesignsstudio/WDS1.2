import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ServicesPage } from './pages/ServicesPage';
import { AuthProvider } from './context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ServicesPage />
    </AuthProvider>
  </StrictMode>,
);
