import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameContext } from '../context/GameContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface PlayerTurnScreenProps {
  onContinue: () => void;
}

const PlayerTurnScreen: React.FC<PlayerTurnScreenProps> = ({ onContinue }) => {
  const { teams, currentTeam, currentPlayerIndex } = useGameContext();
  const isMobile = useIsMobile();
  
  const team = teams[currentTeam];
  const player = team.players[currentPlayerIndex];
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-taboo-primary/10">
          <CardTitle className="text-center text-taboo-primary">
            {isMobile ? 'Tocca a...' : 'È il tuo turno di giocare'}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 flex flex-col items-center">
          <div className="mb-4 text-sm text-taboo-accent">
            {team.name}
          </div>
          <div className="text-3xl font-bold mb-6">
            {player ? player.name : 'Giocatore successivo'}
          </div>
          <div className="text-sm text-muted-foreground text-center">
            Sei tu che devi far indovinare la parola alla tua squadra
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={onContinue} 
            className="w-full bg-taboo-primary text-white"
          >
            Inizia a Giocare
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlayerTurnScreen; 