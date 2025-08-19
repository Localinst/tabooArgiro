import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useGameContext } from '../../context/GameContext';
import { Alert } from '../ui/alert';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../ui/dialog';
import { Collapsible, CollapsibleContent } from '../ui/collapsible';
import { GameMode } from '@/data/types';

const ScoreBoard: React.FC = () => {
  const { teams, currentTeam, addTeam, removeTeam, isPlaying, resetUsedCards, usedCardsCount, availableCardsCount, gameSettings } = useGameContext();
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      addTeam(newTeamName.trim());
      setNewTeamName('');
      setIsAddTeamOpen(false);
    }
  };

  const handleResetUsedCards = () => {
    resetUsedCards();
    setIsResetDialogOpen(false);
  };

  const toggleTeamExpand = (teamId: number) => {
    if (expandedTeam === teamId) {
      setExpandedTeam(null);
    } else {
      setExpandedTeam(teamId);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-taboo-primary/10">
        <CardTitle className="text-center text-taboo-primary">Score</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {teams.map((team, index) => (
            <Collapsible 
              key={team.id} 
              open={expandedTeam === team.id}
              onOpenChange={() => toggleTeamExpand(team.id)}
            >
              <div 
                className={`flex justify-between items-center p-2 rounded-lg ${
                  index === currentTeam ? 'bg-taboo-primary/20 font-semibold' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{team.name}</span>
                  <span className="text-taboo-primary font-bold">{team.score}</span>
                </div>
              </div>
              
              {!isPlaying && team.players.length > 0 && (
                <CollapsibleContent className="px-2 py-1">
                  <div className="text-sm text-gray-600">
                    Players: {team.players.map(p => p.name).join(', ')}
                  </div>
                </CollapsibleContent>
              )}
            </Collapsible>
          ))}
        </div>

        {!isPlaying && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-medium mb-2">Game Mode:</div>
            <div className="text-sm mb-3">
              {gameSettings.mode === GameMode.SCORE 
                ? `Play to ${gameSettings.targetScore} points` 
                : `Play ${gameSettings.totalRounds} rounds`}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          {!isPlaying ? (
            <>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Cards Used:</span>
                <span>{usedCardsCount}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Cards Available:</span>
                <span>{availableCardsCount}</span>
              </div>

              {availableCardsCount < 10 && availableCardsCount > 0 && (
                <Alert className="mt-3 bg-amber-100 text-amber-800 border-amber-300">
                  Warning: Running low on cards!
                </Alert>
              )}

              {availableCardsCount === 0 && (
                <Alert className="mt-3 bg-red-100 text-red-800 border-red-300">
                  No more cards available. Please reset the deck to continue playing.
                </Alert>
              )}
            </>
          ) : (
            <div className="flex justify-between text-sm">
              <span>Available Cards:</span>
              <span className="font-medium">{availableCardsCount}</span>
            </div>
          )}

          {!isPlaying && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3 border-taboo-primary/30 text-taboo-primary hover:bg-taboo-primary/10"
              onClick={() => setIsResetDialogOpen(true)}
            >
              Reset Cards
            </Button>
          )}
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
            + Add Team
          </Button>
        )}
      </CardFooter>

      <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Team</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTeamOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTeam}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Reset Cards</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to reset all used cards? This action will make all cards available again.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetUsedCards}>
              Reset Cards
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ScoreBoard;
