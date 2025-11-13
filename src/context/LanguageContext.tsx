import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type Language = 'it' | 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize language based on URL path
  const [language, setLanguage] = useState<Language>(() => {
    const isTurkishPath = location.pathname.startsWith('/tr');
    const isEnglishPath = location.pathname.startsWith('/en');
    if (isTurkishPath) return 'tr';
    if (isEnglishPath) return 'en';
    return 'it';
  });

  // Handle language changes and URL updates
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    const currentPath = location.pathname;
    
    if (newLang === 'tr' && !currentPath.startsWith('/tr')) {
      // Switch to Turkish - add /tr prefix
      const newPath = currentPath === '/' ? '/tr' : `/tr${currentPath.replace(/^\/(en)\/?/, '/')}`;
      navigate(newPath);
    } else if (newLang === 'en' && !currentPath.startsWith('/en')) {
      // Switch to English - add /en prefix
      const newPath = currentPath === '/' ? '/en' : `/en${currentPath.replace(/^\/(tr)\/?/, '/')}`;
      navigate(newPath);
    } else if (newLang === 'it' && (currentPath.startsWith('/en') || currentPath.startsWith('/tr'))) {
      // Switch to Italian - remove /en or /tr prefix
      const newPath = currentPath.replace(/^\/(en|tr)/, '') || '/';
      navigate(newPath);
    }
  };

  // Keep language in sync with URL changes
  useEffect(() => {
    const isTurkishPath = location.pathname.startsWith('/tr');
    const isEnglishPath = location.pathname.startsWith('/en');
    const newLang: Language = isTurkishPath ? 'tr' : isEnglishPath ? 'en' : 'it';
    if (newLang !== language) {
      setLanguage(newLang);
    }
  }, [location.pathname]);

  // Store language preference
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
