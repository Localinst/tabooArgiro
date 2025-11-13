import React from 'react';
import { Button } from './ui/button';
import { useLanguage } from '@/context/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const getLanguageName = (lang: string) => {
    switch (lang) {
      case 'it':
        return 'Italiano';
      case 'en':
        return 'English';
      case 'tr':
        return 'Türkçe';
      default:
        return 'Language';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-taboo-primary"
        >
          {getLanguageName(language)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('it')} className={language === 'it' ? 'bg-taboo-primary/20' : ''}>
          Italiano
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-taboo-primary/20' : ''}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('tr')} className={language === 'tr' ? 'bg-taboo-primary/20' : ''}>
          Türkçe
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;

