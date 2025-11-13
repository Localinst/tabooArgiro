import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Timer, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SEO from '@/components/SEO';

const seoData = {
  it: {
    title: 'Regole del Gioco Taboo | Parole Taboo',
    description: 'Scopri le regole ufficiali del gioco di società online Parole Taboo. Impara a giocare, a fare punti e a vincere!',
    keywords: 'regole taboo, come giocare a taboo, istruzioni taboo, regolamento taboo, spiegazione taboo'
  },
  en: {
    title: 'Taboo Game Rules | Word Taboo',
    description: 'Learn the official rules of the online Taboo word game. Learn how to play, score points and win!',
    keywords: 'taboo rules, how to play taboo, taboo instructions, taboo regulations, taboo explanation'
  },
  tr: {
    title: 'Taboo Oyunu Kuralları | Taboo Oyunu',
    description: 'Çevrimiçi Taboo kelime oyununun resmi kurallarını öğrenin. Nasıl oynanacağını, puan kazanacağını ve kazanacağını öğrenin!',
    keywords: 'taboo kuralları, taboo nasıl oynanır, taboo talimatları, taboo düzenlemeleri, taboo açıklaması'
  }
};

const Rules: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <>
      <SEO
        title={seoData[language].title}
        description={seoData[language].description}
        keywords={seoData[language].keywords}
        path="/rules"
      />
      <main className="min-h-screen bg-gradient-to-b from-taboo-primary/5 to-taboo-accent/5 flex flex-col items-center justify-start pt-12 md:pt-20 px-4">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* Language Switcher */}
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>

        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-taboo-primary">
            {t.rulesTitle}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t.rulesSubtitle}
          </p>
        </header>

        {/* Back button */}
        <div className="flex justify-start">
          <Link to={language === 'en' ? '/en' : '/'}>
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t.backToHome}
            </Button>
          </Link>
        </div>

        {/* Main rules */}
        <section className="space-y-6">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-2xl font-semibold text-taboo-primary">{t.howToPlayTitle}</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-taboo-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">{t.teams.title}</h3>
                    <p>{t.teams.description}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Timer className="w-6 h-6 text-taboo-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">{t.turns.title}</h3>
                    <p>{t.turns.description}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-taboo-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">{t.tabooWords.title}</h3>
                    <p>{t.tabooWords.description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <section className="text-center py-4">
          <Link to={language === 'en' ? '/en/game' : '/game'}>
            <Button 
              className="bg-taboo-primary hover:bg-taboo-primary/90 text-white text-xl py-6 px-8 shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label={t.startPlaying}
            >
              {t.startPlaying}
            </Button>
          </Link>
        </section>
          {/* Scoring */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-2xl font-semibold text-taboo-primary">{t.scoring.title}</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">{t.scoring.positive.title}</h3>
                    <p>{t.scoring.positive.description}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">{t.scoring.negative.title}</h3>
                    <p>{t.scoring.negative.description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-2xl font-semibold text-taboo-primary">{t.tips.title}</h2>
              
              <ul className="list-disc pl-6 space-y-2">
                {t.tips.list.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Start playing CTA */}
        <section className="text-center py-4">
          <Link to={language === 'en' ? '/en/game' : '/game'}>
            <Button 
              className="bg-taboo-primary hover:bg-taboo-primary/90 text-white text-xl py-6 px-8 shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label={t.startPlaying}
            >
              {t.startPlaying}
            </Button>
          </Link>
        </section>
      </div>
    </main>
    </>
  );
};

export default Rules;