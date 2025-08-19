import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type Language = 'it' | 'en';

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
    const isEnglishPath = location.pathname.startsWith('/en');
    return isEnglishPath ? 'en' : 'it';
  });

  // Handle language changes and URL updates
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    const currentPath = location.pathname;
    
    if (newLang === 'en' && !currentPath.startsWith('/en')) {
      // Switch to English - add /en prefix
      const newPath = currentPath === '/' ? '/en' : `/en${currentPath}`;
      navigate(newPath);
    } else if (newLang === 'it' && currentPath.startsWith('/en')) {
      // Switch to Italian - remove /en prefix
      const newPath = currentPath.replace('/en', '') || '/';
      navigate(newPath);
    }
  };

  // Keep language in sync with URL changes
  useEffect(() => {
    const isEnglishPath = location.pathname.startsWith('/en');
    const newLang = isEnglishPath ? 'en' : 'it';
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
