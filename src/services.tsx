import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ServicesPage } from './pages/ServicesPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ServicesPage />
  </StrictMode>,
);
