import React, { useState, useEffect, useRef } from 'react';
import { useGameContext, GameMode } from '../context/GameContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

// Rimuovo i nomi predefiniti
const DEFAULT_PLAYERS: string[] = [];

const GameSetup: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const { 
    players, 
    teams, 
    addPlayer, 
    removePlayer, 
    addTeam,
    removeTeam,
    updateTeamName,
    assignPlayersToTeams,
    gameSettings,
    updateGameSettings,
    completeGameSetup
  } = useGameContext();

  const [newPlayerName, setNewPlayerName] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [activeTab, setActiveTab] = useState('players');
  
  // Stato temporaneo per gli assegnamenti dei giocatori alle squadre
  const [teamAssignments, setTeamAssignments] = useState<Record<number, number[]>>({});
  
  // Stato per il giocatore selezionato e il drag/drop
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [draggedPlayerId, setDraggedPlayerId] = useState<number | null>(null);
  
  // Stato per la modifica dei nomi delle squadre
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [editingTeamName, setEditingTeamName] = useState('');

  // Inizializza le assegnazioni delle squadre
  useEffect(() => {
    const assignments: Record<number, number[]> = {};
    teams.forEach(team => {
      assignments[team.id] = team.players.map(p => p.id);
    });
    setTeamAssignments(assignments);
  }, [teams]);



  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  const handleAddTeam = () => {
    const teamName = newTeamName.trim() || `${language === 'it' ? 'Squadra' : 'Team'} ${String.fromCharCode(67 + teams.length)}`;
    addTeam(teamName);
    setNewTeamName('');
    toast({
      title: language === 'it' ? 'Squadra aggiunta' : 'Team added',
      description: `${teamName} ${language === 'it' ? 'è stata aggiunta' : 'has been added'}`,
    });
  };

  // Assegna automaticamente i giocatori alle squadre in modo equo
  const handleAutoAssignPlayers = () => {
    if (players.length === 0) {
      toast({
        title: language === 'it' ? 'Errore' : 'Error',
        description: language === 'it' ? 'Aggiungi almeno 2 giocatori' : 'Add at least 2 players',
        variant: 'destructive'
      });
      return;
    }

    if (players.length < teams.length) {
      toast({
        title: language === 'it' ? 'Errore' : 'Error',
        description: language === 'it' ? `Aggiungi almeno ${teams.length} giocatori` : `Add at least ${teams.length} players`,
        variant: 'destructive'
      });
      return;
    }

    const assignments: Record<number, number[]> = {};
    teams.forEach(team => {
      assignments[team.id] = [];
    });

    // Distribuisci i giocatori in modo round-robin
    players.forEach((player, index) => {
      const teamId = teams[index % teams.length].id;
      assignments[teamId].push(player.id);
    });

    setTeamAssignments(assignments);
    toast({
      title: language === 'it' ? 'Successo' : 'Success',
      description: language === 'it' ? 'Giocatori assegnati automaticamente' : 'Players automatically assigned',
    });
  };

  // Aggiungi un giocatore a una squadra
  const handleAddPlayerToTeam = (playerId: number, teamId: number) => {
    setTeamAssignments(prev => {
      const updated = { ...prev };
      // Rimuovi il giocatore da tutte le squadre
      Object.keys(updated).forEach(id => {
        updated[parseInt(id)] = updated[parseInt(id)].filter(id => id !== playerId);
      });
      // Aggiungi il giocatore alla nuova squadra
      updated[teamId] = [...(updated[teamId] || []), playerId];
      return updated;
    });
  };

  // Rimuovi un giocatore da una squadra
  const handleRemovePlayerFromTeam = (playerId: number) => {
    setTeamAssignments(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(teamId => {
        updated[parseInt(teamId)] = updated[parseInt(teamId)].filter(id => id !== playerId);
      });
      return updated;
    });
  };

  // Seleziona un giocatore per assegnarlo con click su squadra
  const handleSelectPlayer = (playerId: number) => {
    setSelectedPlayerId(selectedPlayerId === playerId ? null : playerId);
  };

  // Assegna il giocatore selezionato a una squadra
  const handleAssignSelectedPlayerToTeam = (teamId: number) => {
    if (selectedPlayerId !== null) {
      handleAddPlayerToTeam(selectedPlayerId, teamId);
      setSelectedPlayerId(null);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, playerId: number) => {
    setDraggedPlayerId(playerId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnTeam = (e: React.DragEvent, teamId: number) => {
    e.preventDefault();
    if (draggedPlayerId !== null) {
      handleAddPlayerToTeam(draggedPlayerId, teamId);
      setDraggedPlayerId(null);
    }
  };

  // Gestione modifica nome squadra
  const handleStartEditTeam = (teamId: number, currentName: string) => {
    setEditingTeamId(teamId);
    setEditingTeamName(currentName);
  };

  const handleSaveTeamName = (teamId: number) => {
    if (editingTeamName.trim()) {
      updateTeamName(teamId, editingTeamName.trim());
    }
    setEditingTeamId(null);
    setEditingTeamName('');
  };

  const handleCancelEditTeam = () => {
    setEditingTeamId(null);
    setEditingTeamName('');
  };

  const isPlayerAssigned = (playerId: number) => {
    return Object.values(teamAssignments).some(playerIds => 
      playerIds.includes(playerId)
    );
  };

  const getUnassignedPlayers = () => {
    return players.filter(player => 
      !Object.values(teamAssignments).some(playerIds => 
        playerIds.includes(player.id)
      )
    );
  };

  const handleSaveTeams = () => {
    assignPlayersToTeams(teamAssignments);
    setActiveTab('gamemode');
   
  };

  const handleCompleteSetup = () => {
    const isComplete = completeGameSetup();
    if (isComplete) {
      
    }
  };

  const isTeamsBalanced = () => {
    const teamSizes = teams.map(team => team.players.length);
    const uniqueSizes = new Set(teamSizes);
    return uniqueSizes.size === 1;
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-taboo-primary/10">
        <CardTitle className="text-center text-taboo-primary">
          {t.gameSetup.title}
        </CardTitle>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="players">{language === 'it' ? 'Giocatori' : 'Players'}</TabsTrigger>
          <TabsTrigger value="teams">{language === 'it' ? 'Squadre' : 'Teams'}</TabsTrigger>
          <TabsTrigger value="gamemode">{language === 'it' ? 'Modalità' : 'Game Mode'}</TabsTrigger>
        </TabsList>
        
        {/* Tab Giocatori */}
        <TabsContent value="players" className="p-4">
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder={language === 'it' ? 'Nome giocatore' : 'Player name'}
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="w-full"
              />
              <Button onClick={handleAddPlayer}>{language === 'it' ? 'Aggiungi' : 'Add'}</Button>
            </div>
            
            <div className="border rounded-md p-2 max-h-60 overflow-y-auto">
              {players.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {language === 'it' ? 'Nessun giocatore aggiunto' : 'No players added'}
                </p>
              ) : (
                <ul className="space-y-2">
                  {players.map(player => (
                    <li 
                      key={player.id} 
                      className="flex justify-between items-center p-2 bg-background rounded-md"
                    >
                      <span>{player.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-taboo-wrong"
                        onClick={() => removePlayer(player.id)}
                      >
                        ✕
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {players.length > 0 && (
              <Button 
                className="w-full" 
                onClick={() => setActiveTab('teams')}
              >
                {language === 'it' ? 'Continua a Squadre' : 'Continue to Teams'}
              </Button>
            )}
          </div>
        </TabsContent>
        
        {/* Tab Squadre */}
        <TabsContent value="teams" className="p-4">
          <div className="space-y-6">
            {/* Giocatori Non Assegnati */}
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                {language === 'it' ? 'Giocatori disponibili' : 'Available Players'} ({getUnassignedPlayers().length})
                {selectedPlayerId && <span className="text-taboo-primary ml-2">{language === 'it' ? '- Clicca su una squadra' : '- Click on a team'}</span>}
              </h3>
              <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-md min-h-16">
                {getUnassignedPlayers().length === 0 ? (
                  <p className="text-muted-foreground text-sm italic w-full text-center py-4">
                    {language === 'it' ? 'Tutti i giocatori sono assegnati!' : 'All players are assigned!'}
                  </p>
                ) : (
                  getUnassignedPlayers().map(player => (
                    <div
                      key={player.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, player.id)}
                      onDragEnd={() => setDraggedPlayerId(null)}
                      onClick={() => handleSelectPlayer(player.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-move transition-all ${
                        selectedPlayerId === player.id
                          ? 'bg-taboo-primary text-white ring-2 ring-taboo-primary shadow-lg scale-105'
                          : draggedPlayerId === player.id
                          ? 'bg-taboo-primary/50 text-white opacity-70'
                          : 'bg-background border hover:shadow-sm hover:border-taboo-primary'
                      }`}
                      title={language === 'it' ? 'Clicca per selezionare o trascina su una squadra' : 'Click to select or drag to a team'}
                    >
                      <span className="text-sm font-medium flex-1">{player.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pulsante Assegnazione Automatica */}
            {getUnassignedPlayers().length > 0 && (
              <Button 
                onClick={handleAutoAssignPlayers}
                variant="outline"
                className="w-full border-taboo-primary/30 text-taboo-primary hover:bg-taboo-primary/5"
              >
                {language === 'it' ? '⚡ Assegna Automaticamente' : '⚡ Auto-Assign All'}
              </Button>
            )}

            {/* Gestione Squadre */}
            <div className="space-y-3 border-t pt-4">
              <h3 className="text-sm font-medium">{language === 'it' ? 'Gestisci Squadre' : 'Manage Teams'}</h3>
              <div className="flex gap-2">
                <Input
                  placeholder={language === 'it' ? 'Nome squadra (opzionale)' : 'Team name (optional)'}
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTeam()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddTeam}
                  variant="outline"
                  className="border-taboo-primary/30 text-taboo-primary hover:bg-taboo-primary/5"
                >
                  {language === 'it' ? '+ Squadra' : '+ Team'}
                </Button>
              </div>
              
              {/* Modifica nomi squadre */}
              <div className="space-y-2">
                {teams.map(team => (
                  <div key={team.id} className="flex items-center gap-2">
                    {editingTeamId === team.id ? (
                      <>
                        <Input
                          value={editingTeamName}
                          onChange={(e) => setEditingTeamName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') handleSaveTeamName(team.id);
                            if (e.key === 'Escape') handleCancelEditTeam();
                          }}
                          className="flex-1 h-8 text-sm"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-green-600 hover:bg-green-100"
                          onClick={() => handleSaveTeamName(team.id)}
                        >
                          ✓
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-red-600 hover:bg-red-100"
                          onClick={handleCancelEditTeam}
                        >
                          ✕
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 flex items-center gap-2 bg-taboo-primary/10 px-3 py-2 rounded-lg">
                          <span className="text-sm font-medium">{team.name}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-muted-foreground hover:text-taboo-primary"
                          onClick={() => handleStartEditTeam(team.id, team.name)}
                          title={language === 'it' ? 'Modifica nome' : 'Edit name'}
                        >
                          ✎
                        </Button>
                        {teams.length > 2 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-muted-foreground hover:text-taboo-wrong"
                            onClick={() => removeTeam(team.id)}
                            title={language === 'it' ? 'Rimuovi squadra' : 'Remove team'}
                          >
                            ✕
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Squadre */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{language === 'it' ? 'Squadre' : 'Teams'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.map(team => (
                  <div 
                    key={team.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnTeam(e, team.id)}
                    onClick={() => {
                      if (selectedPlayerId !== null) {
                        handleAssignSelectedPlayerToTeam(team.id);
                      }
                    }}
                    className={`border-2 rounded-lg p-4 bg-card transition-all ${
                      selectedPlayerId !== null
                        ? 'border-taboo-primary/50 cursor-pointer hover:border-taboo-primary hover:shadow-lg hover:bg-taboo-primary/5'
                        : draggedPlayerId !== null
                        ? 'border-taboo-primary/50 cursor-drop'
                        : 'border-border hover:shadow-sm'
                    }`}
                  >
                    <h4 className="font-semibold text-taboo-primary mb-3">
                      {team.name} 
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        ({teamAssignments[team.id]?.length || 0})
                      </span>
                    </h4>
                    <div className="space-y-2">
                      {teamAssignments[team.id]?.length === 0 ? (
                        <p className="text-muted-foreground text-sm italic text-center py-4">
                          {language === 'it' ? 'Nessun giocatore' : 'No players'}
                        </p>
                      ) : (
                        teamAssignments[team.id]?.map(playerId => {
                          const player = players.find(p => p.id === playerId);
                          return (
                            <div
                              key={playerId}
                              className="flex items-center justify-between bg-taboo-primary/5 rounded px-3 py-2 group hover:bg-taboo-primary/10 transition-colors"
                            >
                              <span className="text-sm font-medium">{player?.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-taboo-wrong opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemovePlayerFromTeam(playerId)}
                                title={language === 'it' ? 'Rimuovi' : 'Remove'}
                              >
                                ✕
                              </Button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pulsanti di Azione */}
            <div className="space-y-3">
              <Button 
                className="w-full" 
                disabled={getUnassignedPlayers().length > 0}
                onClick={handleSaveTeams}
              >
                {language === 'it' ? 'Continua a Modalità Gioco' : 'Continue to Game Mode'}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        {/* Tab Modalità */}
        <TabsContent value="gamemode" className="p-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">{language === 'it' ? 'Modalità di gioco' : 'Game Mode'}</h3>
              <RadioGroup 
                value={gameSettings.mode} 
                onValueChange={(value) => updateGameSettings({ mode: value as GameMode })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={GameMode.ROUNDS} 
                    id="mode-rounds"
                    disabled={!isTeamsBalanced()}
                  />
                  <Label 
                    htmlFor="mode-rounds"
                    className={!isTeamsBalanced() ? "text-muted-foreground" : ""}
                  >
                    {language === 'it' ? 'Gioca a round' : 'Play rounds'}
                    {!isTeamsBalanced() && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {language === 'it' ? '(richiede squadre bilanciate)' : '(requires balanced teams)'}
                      </span>
                    )}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={GameMode.SCORE} id="mode-score" />
                  <Label htmlFor="mode-score">{language === 'it' ? 'Gioca a punteggio' : 'Play to score'}</Label>
                </div>
              </RadioGroup>
            </div>
            
            {gameSettings.mode === GameMode.SCORE && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>{language === 'it' ? 'Punteggio per vincere' : 'Score to win'}</Label>
                  <span className="font-medium">{gameSettings.targetScore}</span>
                </div>
                <Slider 
                  min={3} 
                  max={50}
                  step={1}
                  value={[gameSettings.targetScore || 10]}
                  onValueChange={(value) => updateGameSettings({ targetScore: value[0] })}
                />
              </div>
            )}
            
            {gameSettings.mode === GameMode.ROUNDS && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>{language === 'it' ? 'Numero di round' : 'Number of rounds'}</Label>
                  <span className="font-medium">{gameSettings.totalRounds}</span>
                </div>
                <Slider 
                  min={1} 
                  max={10}
                  step={1}
                  value={[gameSettings.totalRounds || 5]}
                  onValueChange={(value) => updateGameSettings({ totalRounds: value[0] })}
                />
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>{language === 'it' ? 'Tempo per turno (secondi)' : 'Time per turn (seconds)'}</Label>
                <span className="font-medium">{gameSettings.roundTime}</span>
              </div>
              <Slider 
                min={30} 
                max={120}
                step={5}
                value={[gameSettings.roundTime || 60]}
                onValueChange={(value) => updateGameSettings({ roundTime: value[0] })}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>{language === 'it' ? 'Numero massimo di pass per turno' : 'Maximum passes per turn'}</Label>
                <span className="font-medium">{gameSettings.maxPasses}</span>
              </div>
              <Slider 
                min={1} 
                max={5}
                step={1}
                value={[gameSettings.maxPasses]}
                onValueChange={(value) => updateGameSettings({ maxPasses: value[0] })}
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleCompleteSetup}
            >
              {language === 'it' ? 'Completa Configurazione' : 'Complete Setup'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default GameSetup; 