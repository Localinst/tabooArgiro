
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GameProvider } from '../context/GameContext';
import GameCard from '../components/GameCard';
import Timer from '../components/Timer';
import ScoreBoard from '../components/ScoreBoard';
import GameControls from '../components/GameControls';
import { useGameContext } from '../context/GameContext';

const GameContent: React.FC = () => {
  const { currentCard, isPlaying } = useGameContext();

  return (
    <div className="min-h-screen bg-gradient-to-b from-taboo-primary/5 to-taboo-accent/5">
      <div className="container max-w-5xl px-4 py-8 mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-taboo-primary">
            Taboo<span className="text-taboo-secondary">Word</span><span className="text-taboo-accent">Wizard</span>
          </h1>
          <Link to="/">
            <Button variant="outline" className="border-taboo-primary/30 text-taboo-primary">
              ← Home
            </Button>
          </Link>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <GameCard card={currentCard} />
            {isPlaying && <Timer />}
            <GameControls />
          </div>
          
          <div>
            <ScoreBoard />
          </div>
        </div>
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
