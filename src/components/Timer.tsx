
import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Progress } from '@/components/ui/progress';

const Timer: React.FC = () => {
  const { timeLeft, roundTime, isPlaying } = useGameContext();
  
  // Calculate percentage
  const percentage = Math.round((timeLeft / roundTime) * 100);
  
  // Determine color based on time left
  const getColorClass = () => {
    if (percentage > 60) return 'bg-taboo-correct';
    if (percentage > 30) return 'bg-taboo-secondary';
    return 'bg-taboo-wrong';
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Tempo rimanente</span>
        <span className={`text-lg font-bold ${percentage <= 30 ? 'text-taboo-wrong animate-pulse-light' : 'text-taboo-primary'}`}>
          {timeLeft} sec
        </span>
      </div>
      <Progress 
        value={percentage} 
        className="h-3 bg-gray-200" 
        indicatorClassName={`${getColorClass()} transition-all duration-300`}
      />
    </div>
  );
};

export default Timer;
