import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GameProvider, useGameContext } from '../context/GameContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

// Components
import AdSense from '@/components/AdSense';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SEO from '@/components/SEO';

// Italian components
import GameCardIt from '../components/GameCard';
import TimerIt from '../components/Timer';
import GameControlsIt from '../components/GameControls';
import GameSetupIt from '../components/GameSetup';
import PlayerTurnScreenIt from '../components/PlayerTurnScreen';

// English components
import GameCardEn from '../components/en/GameCard';
import TimerEn from '../components/en/Timer';
import GameControlsEn from '../components/en/GameControls';
import GameSetupEn from '../components/en/GameSetup';
import PlayerTurnScreenEn from '../components/en/PlayerTurnScreen';

// Turkish components
import GameCardTr from '../components/tr/GameCard';
import TimerTr from '../components/tr/Timer';
import GameControlsTr from '../components/tr/GameControls';
import GameSetupTr from '../components/tr/GameSetup';
import PlayerTurnScreenTr from '../components/tr/PlayerTurnScreen';

// Common components
import ScoreBoard from '../components/ScoreBoard';
import FeedbackForm from '../components/FeedbackForm';

const seoData = {
  it: {
    title: 'Gioca a Taboo Online | Parole Taboo',
    description: 'Gioca a Taboo online gratuitamente con amici e famiglia. Sfida le altre squadre in questo divertente gioco di parole!',
    keywords: 'gioca taboo online, gioco taboo gratis, taboo multiplayer, taboo squadre, sfida taboo'
  },
  en: {
    title: 'Play Taboo Online | Word Taboo',
    description: 'Play Taboo online for free with friends and family. Challenge other teams in this fun word game!',
    keywords: 'play taboo online, free taboo game, taboo multiplayer, taboo teams, taboo challenge'
  },
  tr: {
    title: 'Taboo Oyununu Çevrimiçi Oyna | Taboo Oyunu',
    description: 'Taboo oyununu arkadaşlar ve ailenizle ücretsiz olarak çevrimiçi oynayın. Diğer takımlarla bu eğlenceli kelime oyununda rekabet edin!',
    keywords: 'taboo oyununu çevrimiçi oyna, ücretsiz taboo oyunu, taboo çoklu oyuncu, taboo takımları, taboo yarışması'
  }
};

const GameContent: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const { 
    currentCard, 
    isPlaying, 
    gameSetupComplete, 
    showPlayerTurn,
    startRoundAfterPlayerScreen
  } = useGameContext();
  const isMobile = useIsMobile();

  return (
    <>
      <SEO
        title={seoData[language].title}
        description={seoData[language].description}
        keywords={seoData[language].keywords}
        path="/game"
      />
      <div className="min-h-screen bg-gradient-to-b from-taboo-primary/5 to-taboo-accent/5">
        <div className="container max-w-5xl px-4 py-4 md:py-8 mx-auto">
        <header className="flex justify-between items-center mb-4 md:mb-8">
          <h1 className={`${isMobile ? "text-xl" : "text-3xl"} font-bold text-taboo-primary`}>
            {t.title}
          </h1>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link to={language === 'en' ? '/en' : '/'}>
              <Button variant="outline" size={isMobile ? "sm" : "default"} className="border-taboo-primary/30 text-taboo-primary">
                {t.homeButton}
              </Button>
            </Link>
          </div>
        </header>

        {!gameSetupComplete ? (
          // Mostra la configurazione del gioco
          <>
            {language === 'en' ? <GameSetupEn /> : language === 'tr' ? <GameSetupTr /> : <GameSetupIt />}
            <FeedbackForm />
          </>
        ) : (
          // Mostra il gioco
          <div className={`${isMobile ? "space-y-4" : "grid md:grid-cols-3 gap-6"}`}>
            <div className={`${isMobile ? "" : "md:col-span-2"} space-y-4 md:space-y-6`}>
              {language === 'it' ? (
                // Componenti in italiano
                <>
                  <GameCardIt card={currentCard} />
                  {isPlaying && <TimerIt />}
                  <GameControlsIt />
                </>
              ) : language === 'en' ? (
                // Componenti in inglese
                <>
                  <GameCardEn card={currentCard} />
                  {isPlaying && <TimerEn />}
                  <GameControlsEn />
                </>
              ) : (
                // Componenti in turco
                <>
                  <GameCardTr card={currentCard} />
                  {isPlaying && <TimerTr />}
                  <GameControlsTr />
                </>
              )}
            </div>
            
            <div className={`${isMobile ? "mt-6" : ""}`}>
              <ScoreBoard />
              <FeedbackForm />
              {/* Annuncio AdSense */}
              {!isPlaying && (
                <div className="mt-6">
                  <AdSense
                    style={{ display: 'block', minHeight: '250px' }}
                    format="rectangle"
                    className="mx-auto"
                  />
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Mostra la schermata del turno del giocatore quando necessario */}
        {showPlayerTurn && gameSetupComplete && (
          language === 'it' ? (
            <PlayerTurnScreenIt onContinue={startRoundAfterPlayerScreen} />
          ) : language === 'en' ? (
            <PlayerTurnScreenEn onContinue={startRoundAfterPlayerScreen} />
          ) : (
            <PlayerTurnScreenTr onContinue={startRoundAfterPlayerScreen} />
          )
        )}
      </div>
    </div>
    </>
  );
};

const Game: React.FC = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default Game;
