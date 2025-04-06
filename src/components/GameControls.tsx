
import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

const GameControls: React.FC = () => {
  const { 
    isPlaying, 
    startGame, 
    endGame, 
    correctAnswer, 
    skipCard, 
    tabooUsed,
    roundTime,
    setRoundTime
  } = useGameContext();
  
  const isMobile = useIsMobile();

  return (
    <div className="w-full space-y-4">
      {!isPlaying ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Tempo per turno:</label>
            <Select 
              value={roundTime.toString()} 
              onValueChange={(value) => setRoundTime(parseInt(value))}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="60s" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30s</SelectItem>
                <SelectItem value="45">45s</SelectItem>
                <SelectItem value="60">60s</SelectItem>
                <SelectItem value="90">90s</SelectItem>
                <SelectItem value="120">120s</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="w-full bg-taboo-primary hover:bg-taboo-primary/90 text-white py-5"
            onClick={startGame}
          >
            Inizia Gioco
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              className="w-full bg-taboo-correct hover:bg-taboo-correct/90 text-white"
              size={isMobile ? "sm" : "default"}
              onClick={correctAnswer}
            >
              Corretto ✓
            </Button>
            <Button 
              className="w-full bg-taboo-wrong hover:bg-taboo-wrong/90 text-white"
              size={isMobile ? "sm" : "default"}
              onClick={tabooUsed}
            >
              Taboo ✕
            </Button>
          </div>
          <Button 
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="w-full border-taboo-secondary text-taboo-secondary"
            onClick={skipCard}
          >
            Salta Carta ↷
          </Button>
          <Button 
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="w-full border-taboo-primary/30 text-taboo-primary/70"
            onClick={endGame}
          >
            Termina Gioco
          </Button>
        </>
      )}
    </div>
  );
};

export default GameControls;
