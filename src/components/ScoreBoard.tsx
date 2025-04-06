
import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const ScoreBoard: React.FC = () => {
  const { teams, currentTeam, addTeam, removeTeam, isPlaying } = useGameContext();
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      addTeam(newTeamName.trim());
      setNewTeamName('');
      setIsAddTeamOpen(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-taboo-primary/10">
        <CardTitle className="text-center text-taboo-primary">Punteggio</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {teams.map((team, index) => (
            <div 
              key={team.id} 
              className={`flex justify-between items-center p-2 rounded-lg ${
                index === currentTeam ? 'bg-taboo-primary/20 font-semibold' : ''
              }`}
            >
              <div className="flex items-center">
                {index === currentTeam && (
                  <span className="mr-2 text-taboo-primary">►</span>
                )}
                <span>{team.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 flex items-center justify-center bg-taboo-primary text-white rounded-full">
                  {team.score}
                </span>
                {!isPlaying && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-taboo-wrong h-6 w-6 p-0"
                    onClick={() => removeTeam(team.id)}
                  >
                    ✕
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {!isPlaying && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-dashed border-taboo-primary/50 text-taboo-primary hover:bg-taboo-primary/10"
            onClick={() => setIsAddTeamOpen(true)}
          >
            + Aggiungi Squadra
          </Button>
        )}
      </CardFooter>

      <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi una nuova squadra</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nome della squadra"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTeamOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleAddTeam}>
              Aggiungi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ScoreBoard;
