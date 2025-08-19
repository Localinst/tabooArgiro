import React, { useState } from 'react';
import { useGameContext, GameMode } from '../context/GameContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

const ScoreBoard: React.FC = () => {
  const { teams, currentTeam, addTeam, removeTeam, isPlaying, resetUsedCards, usedCardsCount, availableCardsCount, gameSettings } = useGameContext();
  const { language } = useLanguage();
  const t = translations[language].scoreBoard;
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

  // Gestisce l'espansione/collasso dei dettagli della squadra
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
        <CardTitle className="text-center text-taboo-primary">{t.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {teams.map((team, index) => (
            <Collapsible 
              key={team.id} 
              open={expandedTeam === team.id}
              onOpenChange={() => {}}
            >
              <div 
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
                  
                  {/* Bottone per espandere i dettagli della squadra */}
                  {!isPlaying && team.players.length > 0 && (
                    <CollapsibleTrigger asChild onClick={() => toggleTeamExpand(team.id)}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-muted-foreground"
                      >
                        {expandedTeam === team.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </Button>
                    </CollapsibleTrigger>
                  )}
                  
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
              
              {/* Dettagli della squadra (giocatori) - mostrati solo quando non si sta giocando */}
              {!isPlaying && team.players.length > 0 && (
                <CollapsibleContent>
                  <div className="ml-5 mt-1 mb-2 text-sm">
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">{t.players}:</h4>
                    <ul className="space-y-1">
                      {team.players.map(player => (
                        <li key={player.id} className="flex items-center text-muted-foreground">
                          <span className="w-1.5 h-1.5 bg-taboo-primary/60 rounded-full mr-2"></span>
                          {player.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CollapsibleContent>
              )}
            </Collapsible>
          ))}
        </div>

        {/* Informazioni sulla modalità di gioco - nascoste durante il gioco */}
        {!isPlaying && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-medium mb-2">{t.gameMode}:</div>
            <div className="text-sm mb-3">
              {gameSettings.mode === GameMode.SCORE 
                ? t.playToScore.replace('${score}', String(gameSettings.targetScore))
                : t.playRounds.replace('${rounds}', String(gameSettings.totalRounds))}
            </div>
          </div>
        )}

        {/* Stato delle carte - semplificato durante il gioco */}
        <div className="mt-4 pt-4 border-t">
          {!isPlaying ? (
            <>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>{t.cardsUsed}:</span>
                <span className="font-medium">{usedCardsCount}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t.cardsAvailable}:</span>
                <span className="font-medium">{availableCardsCount}</span>
              </div>

              {/* Avviso quando le carte stanno per finire */}
              {availableCardsCount < 10 && availableCardsCount > 0 && (
                <Alert className="mt-3 bg-amber-100 text-amber-800 border-amber-300">
                  <AlertDescription>
                    {t.warningLowCards.replace('${count}', String(availableCardsCount))}
                  </AlertDescription>
                </Alert>
              )}

              {/* Avviso quando le carte sono finite */}
              {availableCardsCount === 0 && (
                <Alert className="mt-3 bg-red-100 text-red-800 border-red-300">
                  <AlertDescription>
                    {t.noCards}
                  </AlertDescription>
                </Alert>
              )}
            </>
          ) : (
            <div className="flex justify-between text-sm">
              <span>{t.cardsAvailable}:</span>
              <span className="font-medium">{availableCardsCount}</span>
            </div>
          )}

          {/* Pulsante per resettare le carte usate - mostrato solo quando non si sta giocando */}
          {!isPlaying && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3 border-taboo-primary/30 text-taboo-primary hover:bg-taboo-primary/10"
              onClick={() => setIsResetDialogOpen(true)}
            >
              {t.resetCards}
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
            + {t.addTeam}
          </Button>
        )}
      </CardFooter>

      {/* Dialog per aggiungere una squadra */}
      <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.addTeam}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder={t.teamName}
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTeamOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={handleAddTeam}>
              {t.add}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog per confermare il reset delle carte */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.resetCards}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{t.resetCardsConfirm}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              {t.cancel}
            </Button>
            <Button variant="destructive" onClick={handleResetUsedCards}>
              {t.resetCards}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ScoreBoard;
