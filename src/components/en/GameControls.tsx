import React from 'react';
import { useGameContext, GameMode } from '../../context/GameContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const GameControls: React.FC = () => {
  const { 
    isPlaying, 
    startGame, 
    endGame, 
    correctAnswer, 
    skipCard, 
    tabooUsed,
    roundTime,
    setRoundTime,
    resetGameCompletely,
    currentTeam,
    teams,
    gameSettings,
    passesUsed
  } = useGameContext();
  
  const isMobile = useIsMobile();
  const [isResetDialogOpen, setIsResetDialogOpen] = React.useState(false);

  const handleResetGame = () => {
    resetGameCompletely();
    setIsResetDialogOpen(false);
  };

  // Calculate progress percentage
  const getGameProgress = () => {
    if (gameSettings.mode === GameMode.SCORE && gameSettings.targetScore) {
      const maxScore = Math.max(...teams.map(t => t.score), 0);
      return Math.min((maxScore / gameSettings.targetScore) * 100, 100);
    } else if (gameSettings.mode === GameMode.ROUNDS && gameSettings.totalRounds) {
      return Math.min((gameSettings.currentRound / gameSettings.totalRounds) * 100, 100);
    }
    return 0;
  };

  return (
    <div className="w-full space-y-4">
      {/* Game progress information */}
      <div className="p-3 bg-background rounded-md border shadow-sm space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Game Status</h3>
          <Badge variant="outline">
            {gameSettings.mode === GameMode.SCORE 
              ? `Target: ${gameSettings.targetScore} points` 
              : `Round: ${gameSettings.currentRound}/${gameSettings.totalRounds}`}
          </Badge>
        </div>
        <Progress value={getGameProgress()} className="h-2" />
      </div>
      
      {!isPlaying ? (
        <div className="space-y-4">
          <div className="text-center text-sm mb-2 p-2 bg-taboo-primary/10 rounded-md">
            It's <span className="font-semibold">{teams[currentTeam].name}'s</span> turn
            {teams[currentTeam].players.length > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                Players: {teams[currentTeam].players.map(p => p.name).join(', ')}
              </div>
            )}
          </div>
          
          <Button 
            className="w-full bg-taboo-primary hover:bg-taboo-primary/90 text-white py-5"
            onClick={startGame}
          >
            Start Turn
          </Button>
          
          <Button 
            variant="outline"
            className="w-full border-taboo-primary/30 text-taboo-primary/70"
            onClick={() => setIsResetDialogOpen(true)}
          >
            Complete Reset
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              className="w-full space-y-2 bg-taboo-correct hover:bg-taboo-correct/90 text-white"
              size={isMobile ? "sm" : "default"}
              onClick={correctAnswer}
            >
              Correct
            </Button>
            <Button 
              className="w-full space-y-2 bg-taboo-wrong hover:bg-taboo-wrong/90 text-white"
              size={isMobile ? "sm" : "default"}
              onClick={tabooUsed}
            >
              Taboo
            </Button>
          </div>
          
          <Button 
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className={`w-full space-y-2 ${
              passesUsed >= gameSettings.maxPasses 
                ? "border-taboo-wrong text-taboo-wrong" 
                : "bg-taboo-accent hover:bg-taboo-accent/90 text-white"
            }`}
            onClick={skipCard}
          >
            {passesUsed >= gameSettings.maxPasses ? "Skip" : "Skip Card"}
          </Button>
          <div className="flex justify-center">
            <Badge 
              variant={passesUsed >= gameSettings.maxPasses ? "destructive" : "secondary"} 
              className="text-xs"
            >
              {passesUsed >= gameSettings.maxPasses 
                ? `Pass limit reached (${passesUsed}/${gameSettings.maxPasses})` 
                : `Passes used: ${passesUsed}/${gameSettings.maxPasses}`}
            </Badge>
          </div>
        </>
      )}
      
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Complete Reset</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to completely reset the game? This will:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Reset all team scores</li>
              <li>Restore default teams</li>
              <li>Set the first team as starting player</li>
              <li>Return to initial configuration</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetGame}>
              Complete Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameControls;
