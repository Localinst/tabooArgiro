import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GameProvider } from '../context/GameContext';
import GameCard from '../components/GameCard';
import Timer from '../components/Timer';
import ScoreBoard from '../components/ScoreBoard';
import GameControls from '../components/GameControls';
import GameSetup from '../components/GameSetup';
import PlayerTurnScreen from '../components/PlayerTurnScreen';
import { useGameContext } from '../context/GameContext';
import { useIsMobile } from '@/hooks/use-mobile';

const GameContent: React.FC = () => {
  const { 
    currentCard, 
    isPlaying, 
    gameSetupComplete, 
    showPlayerTurn,
    startRoundAfterPlayerScreen
  } = useGameContext();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-b from-taboo-primary/5 to-taboo-accent/5">
      <div className="container max-w-5xl px-4 py-4 md:py-8 mx-auto">
        <header className="flex justify-between items-center mb-4 md:mb-8">
          <h1 className={`${isMobile ? "text-xl" : "text-3xl"} font-bold text-taboo-primary`}>
            TABOO
          </h1>
          <Link to="/">
            <Button variant="outline" size={isMobile ? "sm" : "default"} className="border-taboo-primary/30 text-taboo-primary">
              ← Home
            </Button>
          </Link>
        </header>

        {!gameSetupComplete ? (
          // Mostra la configurazione del gioco
          <GameSetup />
        ) : (
          // Mostra il gioco
          <div className={`${isMobile ? "space-y-4" : "grid md:grid-cols-3 gap-6"}`}>
            <div className={`${isMobile ? "" : "md:col-span-2"} space-y-4 md:space-y-6`}>
              <GameCard card={currentCard} />
              {isPlaying && <Timer />}
              <GameControls />
            </div>
            
            <div className={`${isMobile ? "mt-6" : ""}`}>
              <ScoreBoard />
            </div>
          </div>
        )}
        
        {/* Mostra la schermata del turno del giocatore quando necessario */}
        {showPlayerTurn && gameSetupComplete && (
          <PlayerTurnScreen onContinue={startRoundAfterPlayerScreen} />
        )}
      </div>
    </div>
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
