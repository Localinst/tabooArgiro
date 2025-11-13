import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useGameContext, GameMode } from '../../context/GameContext';
import { Alert } from '../ui/alert';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../ui/dialog';
import { Collapsible, CollapsibleContent } from '../ui/collapsible';

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
        <CardTitle className="text-center text-taboo-primary">Puanlar</CardTitle>
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
                    Oyuncular: {team.players.map(p => p.name).join(', ')}
                  </div>
                </CollapsibleContent>
              )}
            </Collapsible>
          ))}
        </div>

        {!isPlaying && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-medium mb-2">Oyun Modu:</div>
            <div className="text-sm mb-3">
              {gameSettings.mode === GameMode.SCORE 
                ? `${gameSettings.targetScore} puana kadar oyna` 
                : `${gameSettings.totalRounds} tur oyna`}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          {!isPlaying ? (
            <>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Kullanılan Kartlar:</span>
                <span>{usedCardsCount}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Mevcut Kartlar:</span>
                <span>{availableCardsCount}</span>
              </div>

              {availableCardsCount < 10 && availableCardsCount > 0 && (
                <Alert className="mt-3 bg-amber-100 text-amber-800 border-amber-300">
                  Uyarı: Kartlar bitme noktasına geldi!
                </Alert>
              )}

              {availableCardsCount === 0 && (
                <Alert className="mt-3 bg-red-100 text-red-800 border-red-300">
                  Hata: Oynanacak kart yok!
                </Alert>
              )}
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              Mevcut Kartlar: {availableCardsCount}
            </div>
          )}
        </div>
      </CardContent>

      {!isPlaying && (
        <CardFooter className="flex justify-between pt-4">
          <Button 
            variant="outline"
            onClick={() => setIsAddTeamOpen(true)}
          >
            Takım Ekle
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsResetDialogOpen(true)}
          >
            Kartları Sıfırla
          </Button>
        </CardFooter>
      )}

      <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Takım Ekle</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Takım Adı"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTeam();
              }
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTeamOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleAddTeam}>
              Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kartları Sıfırlayabilir misiniz?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-600">
            Tüm kullanılan kartları sıfırlar ve oyunun başından başlamanıza izin verir.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleResetUsedCards} className="bg-taboo-primary hover:bg-taboo-primary/90">
              Evet, Sıfırla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ScoreBoard;
