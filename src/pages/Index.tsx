import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle, Users, Timer, Trophy, BookOpen, Info } from 'lucide-react';
import FeedbackForm from '@/components/FeedbackForm';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SEO from '@/components/SEO';

const Index: React.FC = () => {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <>
      <SEO
        title={t.title}
        description={language === 'it' 
          ? 'Gioca a Taboo online con amici e famiglia. Il divertente gioco di parole dove devi far indovinare parole senza usare quelle proibite!'
          : 'Play Taboo online with friends and family. The fun word game where you have to guess words without using the forbidden ones!'
        }
      />
      <main className="min-h-screen bg-gradient-to-b from-taboo-primary/5 to-taboo-accent/5 flex flex-col items-center justify-start pt-12 md:pt-20 pb-12">
      <div className="text-center px-4 w-full max-w-2xl mx-auto space-y-8">
        {/* Logo e Titolo */}
        {/* Language Switcher */}
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>

        <header className="space-y-4">
          <h1 className="text-7xl font-bold text-taboo-primary">
            {t.title}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t.subtitle}
          </p>
        </header>

        {/* Game Features */}
        <section aria-label={language === 'it' ? "Caratteristiche del gioco" : "Game features"} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-8">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className={`flex flex-col items-center space-y-0.5 ${isMobile ? 'p-1' : 'p-4'}`}>
              <Users className={`${isMobile ? 'w-4 h-4' : 'w-8 h-8'} text-taboo-primary`} aria-hidden="true" />
              <h2 className={`font-semibold ${isMobile ? 'text-xs' : ''}`}>{t.features.teamPlay.title}</h2>
              <p className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-muted-foreground`}>{t.features.teamPlay.description}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className={`flex flex-col items-center space-y-0.5 ${isMobile ? 'p-1' : 'p-4'}`}>
              <Timer className={`${isMobile ? 'w-4 h-4' : 'w-8 h-8'} text-taboo-primary`} aria-hidden="true" />
              <h2 className={`font-semibold ${isMobile ? 'text-xs' : ''}`}>{t.features.timeChallenge.title}</h2>
              <p className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-muted-foreground`}>{t.features.timeChallenge.description}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className={`flex flex-col items-center space-y-0.5 ${isMobile ? 'p-1' : 'p-4'}`}>
              <Trophy className={`${isMobile ? 'w-4 h-4' : 'w-8 h-8'} text-taboo-primary`} aria-hidden="true" />
              <h2 className={`font-semibold ${isMobile ? 'text-xs' : ''}`}>{t.features.competition.title}</h2>
              <p className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-muted-foreground`}>{t.features.competition.description}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className={`flex flex-col items-center space-y-0.5 ${isMobile ? 'p-1' : 'p-4'}`}>
              <PlayCircle className={`${isMobile ? 'w-4 h-4' : 'w-8 h-8'} text-taboo-primary`} aria-hidden="true" />
              <h2 className={`font-semibold ${isMobile ? 'text-xs' : ''}`}>{t.features.fun.title}</h2>
              <p className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-muted-foreground`}>{t.features.fun.description}</p>
            </CardContent>
          </Card>
        </section>

        {/* Start Button */}
        <section aria-label={language === 'it' ? "Inizia a giocare" : "Start playing"}>
          <Link to={language === 'en' ? '/en/game' : '/game'} className="w-full block">
            <Button 
              className="w-full bg-taboo-primary hover:bg-taboo-primary/90 text-white text-xl py-6 shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label={t.startPlaying}
            >
              {t.startPlaying}
            </Button>
          </Link>
        </section>

        {/* Quick Rules */}
        <section aria-label={language === 'it' ? "Regole del gioco" : "Game rules"} className="mt-8">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">{t.howToPlay}</h2>
              <div className="space-y-2 text-left">
                {t.quickRules.map((rule, index) => (
                  <p key={index}>{`${index + 1}. ${rule}`}</p>
                ))}
              </div>
              <Link to={language === 'en' ? '/en/rules' : '/rules'} className="inline-flex items-center mt-4 text-taboo-primary hover:text-taboo-primary/80">
                <BookOpen className="w-4 h-4 mr-2" />
                {t.readFullRules}
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Link utili */}
        <section aria-label={language === 'it' ? "Link utili" : "Useful links"} className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-8">
          <Link to={language === 'en' ? '/en/rules' : '/rules'} className="inline-flex items-center justify-center p-4 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-white/70 transition-colors">
            <BookOpen className="w-5 h-5 mr-2 text-taboo-primary" />
            {language === 'it' ? 'Regole complete' : 'Complete Rules'}
          </Link>
        </section>

        {/* Inserisco il componente FeedbackForm qui */}
        <FeedbackForm />
      </div>
    </main>
    </>
  );
};

export default Index;
