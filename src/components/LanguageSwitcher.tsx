import React from 'react';
import { Button } from './ui/button';
import { useLanguage } from '@/context/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'it' ? 'en' : 'it')}
      className="text-taboo-primary"
    >
      {language === 'it' ? 'English' : 'Italiano'}
    </Button>
  );
};

export default LanguageSwitcher;
