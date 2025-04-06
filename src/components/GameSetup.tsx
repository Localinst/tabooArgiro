import React, { useState, useEffect, useRef } from 'react';
import { useGameContext, GameMode } from '../context/GameContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { toast } from '@/hooks/use-toast';

// Nomi predefiniti che devono essere sempre disponibili
const DEFAULT_PLAYERS = ["Giuseppe", "Mattia", "Sofia", "Leonardo", "Davide", "Alessandro"];

const GameSetup: React.FC = () => {
  const { 
    players, 
    teams, 
    addPlayer, 
    removePlayer, 
    assignPlayersToTeams,
    gameSettings,
    updateGameSettings,
    completeGameSetup
  } = useGameContext();

  const [newPlayerName, setNewPlayerName] = useState('');
  const [activeTab, setActiveTab] = useState('players');
  const initRef = useRef(false);
  const playersAddedRef = useRef<string[]>([]);
  
  // Stato temporaneo per gli assegnamenti dei giocatori alle squadre
  const [teamAssignments, setTeamAssignments] = useState<Record<number, number[]>>({});
  const [isDragging, setIsDragging] = useState(false);

  // Inizializza le assegnazioni delle squadre
  useEffect(() => {
    const assignments: Record<number, number[]> = {};
    teams.forEach(team => {
      assignments[team.id] = team.players.map(p => p.id);
    });
    setTeamAssignments(assignments);
  }, [teams]);

  // Aggiunge i giocatori predefiniti all'avvio, una sola volta
  useEffect(() => {
    if (initRef.current) return;
    
    console.log("Inizializzazione giocatori predefiniti...");
    initRef.current = true;
    
    // Rimuovi tutti i giocatori esistenti
    const playersToRemove = [...players];
    playersToRemove.forEach(player => {
      removePlayer(player.id);
    });
    
    console.log("Aggiungo i giocatori predefiniti:", DEFAULT_PLAYERS);
    
    // Aggiungiamo i giocatori uno dopo l'altro in sequenza
    const addPlayersSequentially = async () => {
      // Reset dell'array di riferimento
      playersAddedRef.current = [];
      
      // Attendiamo un attimo per assicurarci che i giocatori siano stati rimossi
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Aggiungiamo i giocatori uno alla volta con attesa
      for (const name of DEFAULT_PLAYERS) {
        if (!playersAddedRef.current.includes(name)) {
          const playerId = addPlayer(name);
          playersAddedRef.current.push(name);
          console.log(`Aggiunto giocatore ${name} con ID ${playerId}`);
          // Attendiamo che il giocatore sia stato aggiunto
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // Diamo tempo al context di aggiornare lo stato
      setTimeout(() => {
        // Prepara le assegnazioni per le squadre
        const newAssignments: Record<number, number[]> = {};
        teams.forEach(team => {
          newAssignments[team.id] = [];
        });
        
        // Distribuisci i giocatori tra le squadre in modo equilibrato
        players.forEach((player, index) => {
          const teamId = teams[index % teams.length].id;
          newAssignments[teamId].push(player.id);
        });
        
        // Aggiorna lo stato delle assegnazioni
        setTeamAssignments(newAssignments);
        
        // Applica le assegnazioni
        assignPlayersToTeams(newAssignments);
        
        console.log("Inizializzazione completata");
        
        // Auto-completa la configurazione
        setTimeout(() => {
          console.log("Auto-completo la configurazione");
          
          
          setTimeout(() => {
            completeGameSetup();
          }, 200);
        }, 300);
      }, 500);
    };
    
    // Avvia l'inizializzazione
    addPlayersSequentially();
  }, []);

  // Previene il comportamento di pull-to-refresh durante il trascinamento
  useEffect(() => {
    const preventPullToRefresh = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventPullToRefresh, { passive: false });
    return () => {
      document.removeEventListener('touchmove', preventPullToRefresh);
    };
  }, [isDragging]);

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result: any) => {
    setIsDragging(false);
    if (!result.destination) return;

    const { source, destination } = result;
    const playerId = parseInt(result.draggableId);

    // Rimuovi il giocatore dalla sua squadra originale
    Object.keys(teamAssignments).forEach(teamId => {
      const numTeamId = parseInt(teamId);
      teamAssignments[numTeamId] = teamAssignments[numTeamId].filter(id => id !== playerId);
    });

    // Aggiungi il giocatore alla nuova squadra
    const destTeamId = parseInt(destination.droppableId);
    teamAssignments[destTeamId] = [...(teamAssignments[destTeamId] || []), playerId];

    setTeamAssignments({...teamAssignments});
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

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-taboo-primary/10">
        <CardTitle className="text-center text-taboo-primary">
          Configura il Gioco
        </CardTitle>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="players">Giocatori</TabsTrigger>
          <TabsTrigger value="teams">Squadre</TabsTrigger>
          <TabsTrigger value="gamemode">Modalità</TabsTrigger>
        </TabsList>
        
        {/* Tab Giocatori */}
        <TabsContent value="players" className="p-4">
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Nome giocatore"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="w-full"
              />
              <Button onClick={handleAddPlayer}>Aggiungi</Button>
            </div>
            
            <div className="border rounded-md p-2 max-h-60 overflow-y-auto">
              {players.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nessun giocatore aggiunto
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
                Continua a Squadre
              </Button>
            )}
          </div>
        </TabsContent>
        
        {/* Tab Squadre */}
        <TabsContent value="teams" className="p-4">
          <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Giocatori non assegnati</h3>
                <Droppable droppableId="unassigned" direction="horizontal">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="border rounded-md p-2 min-h-16 flex flex-wrap gap-2"
                    >
                      {getUnassignedPlayers().map((player, index) => (
                        <Draggable 
                          key={player.id} 
                          draggableId={player.id.toString()} 
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-taboo-primary/10 text-sm py-1 px-3 rounded-full"
                            >
                              {player.name}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {getUnassignedPlayers().length === 0 && (
                        <p className="text-muted-foreground text-sm italic w-full text-center py-2">
                          Tutti i giocatori sono assegnati alle squadre
                        </p>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Squadre</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teams.map(team => (
                    <div key={team.id} className="space-y-2">
                      <h4 className="font-semibold text-taboo-primary">{team.name}</h4>
                      <Droppable droppableId={team.id.toString()}>
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="border rounded-md p-2 min-h-24"
                          >
                            <div className="flex flex-wrap gap-2">
                              {players
                                .filter(player => teamAssignments[team.id]?.includes(player.id))
                                .map((player, index) => (
                                  <Draggable 
                                    key={player.id} 
                                    draggableId={player.id.toString()} 
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="bg-taboo-primary/20 text-sm py-1 px-3 rounded-full"
                                      >
                                        {player.name}
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              {provided.placeholder}
                            </div>
                            {teamAssignments[team.id]?.length === 0 && (
                              <p className="text-muted-foreground text-sm italic text-center py-2">
                                Trascina qui i giocatori
                              </p>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Button 
                  className="w-full" 
                  disabled={getUnassignedPlayers().length > 0}
                  onClick={handleSaveTeams}
                >
                  Salva Squadre
                </Button>
                
                {/* Pulsante per completare rapidamente la configurazione */}
                {getUnassignedPlayers().length === 0 && (
                  <Button 
                    variant="outline"
                    className="w-full mt-2 border-taboo-primary/30 text-taboo-primary"
                    onClick={() => {
                      handleSaveTeams();
                      // Usiamo setTimeout per dar tempo al primo handler di completarsi
                      setTimeout(() => {
                        handleCompleteSetup();
                      }, 100);
                    }}
                  >
                    Completa Configurazione Rapidamente
                  </Button>
                )}
              </div>
            </div>
          </DragDropContext>
        </TabsContent>
        
        {/* Tab Modalità */}
        <TabsContent value="gamemode" className="p-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Modalità di gioco</h3>
              <RadioGroup 
                value={gameSettings.mode} 
                onValueChange={(value) => updateGameSettings({ mode: value as GameMode })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={GameMode.ROUNDS} id="mode-rounds" />
                  <Label htmlFor="mode-rounds">Gioca a round</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={GameMode.SCORE} id="mode-score" />
                  <Label htmlFor="mode-score">Gioca a punteggio</Label>
                </div>
                
              </RadioGroup>
            </div>
            
            {gameSettings.mode === GameMode.SCORE && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Punteggio per vincere</Label>
                  <span className="font-medium">{gameSettings.targetScore}</span>
                </div>
                <Slider 
                  min={3} 
                  max={30}
                  step={1}
                  value={[gameSettings.targetScore || 10]}
                  onValueChange={(value) => updateGameSettings({ targetScore: value[0] })}
                />
              </div>
            )}
            
            {gameSettings.mode === GameMode.ROUNDS && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Numero di round</Label>
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
                <Label>Tempo per turno (secondi)</Label>
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
                <Label>Numero massimo di pass per turno</Label>
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
              Completa Configurazione
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default GameSetup; 