import React, { useEffect, useState } from 'react';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
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

  // Determine current page based on pathname
  if (currentPath.includes('services')) {
    return <ServicesPage />;
  }
  if (currentPath.includes('about')) {
    return <AboutPage />;
  }
  if (currentPath.includes('contact')) {
    return <ContactPage />;
  }

  return <HomePage />;
}
