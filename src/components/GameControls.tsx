import React from 'react';
import { useGameContext, GameMode } from '../context/GameContext';
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

  // Calcola la percentuale di progresso
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
      {/* Informazioni sul progresso del gioco */}
      <div className="p-3 bg-background rounded-md border shadow-sm space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Stato del gioco</h3>
          <Badge variant="outline">
            {gameSettings.mode === GameMode.SCORE 
              ? `Obiettivo: ${gameSettings.targetScore} punti` 
              : `Round: ${gameSettings.currentRound}/${gameSettings.totalRounds}`}
          </Badge>
        </div>
        <Progress value={getGameProgress()} className="h-2" />
      </div>
      
      {!isPlaying ? (
        <div className="space-y-4">
          
          
          <div className="text-center text-sm mb-2 p-2 bg-taboo-primary/10 rounded-md">
            Tocca a <span className="font-semibold">{teams[currentTeam].name}</span> iniziare
            {teams[currentTeam].players.length > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                Giocatori: {teams[currentTeam].players.map(p => p.name).join(', ')}
              </div>
            )}
          </div>
          
          <Button 
            className="w-full bg-taboo-primary hover:bg-taboo-primary/90 text-white py-5"
            onClick={startGame}
          >
            Inizia Turno
          </Button>
          
          <Button 
            variant="outline"
            className="w-full border-taboo-primary/30 text-taboo-primary/70"
            onClick={() => setIsResetDialogOpen(true)}
          >
            Reset Completo
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
              Corretto
            </Button>
            <Button 
              className="w-full bg-taboo-wrong hover:bg-taboo-wrong/90 text-white"
              size={isMobile ? "sm" : "default"}
              onClick={tabooUsed}
            >
              Taboo
            </Button>
          </div>
          
          {/* Badge per il conteggio dei pass */}
         
          
          <Button 
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className={`w-full ${
              passesUsed >= gameSettings.maxPasses 
                ? "border-taboo-wrong text-taboo-wrong" 
                : "border-taboo-secondary text-taboo-secondary"
            }`}
            onClick={skipCard}
          >
            {passesUsed >= gameSettings.maxPasses ? "Salta" : "Salta Carta"}
          </Button>
          <div className="flex justify-center">
            <Badge 
              variant={passesUsed >= gameSettings.maxPasses ? "destructive" : "secondary"} 
              className="text-xs"
            >
              {passesUsed >= gameSettings.maxPasses 
                ? `Limite pass raggiunto (${passesUsed}/${gameSettings.maxPasses})` 
                : `Pass usati: ${passesUsed}/${gameSettings.maxPasses}`}
            </Badge>
          </div>
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
      
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma Reset Completo</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Sei sicuro di voler effettuare un reset completo del gioco? Questa azione:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Resetta i punteggi di tutte le squadre</li>
              <li>Ripristina le squadre di default</li>
              <li>Imposta la prima squadra come giocatore iniziale</li>
              <li>Riporta alla configurazione iniziale</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              Annulla
            </Button>
            <Button variant="destructive" onClick={handleResetGame}>
              Reset Completo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameControls;
