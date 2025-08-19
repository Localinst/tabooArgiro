import React, { useState, useEffect } from 'react';
import { useGameContext, GameMode } from '../../context/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

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
  const [isDragging, setIsDragging] = useState(false);
  
  // Temporary state for player team assignments
  const [teamAssignments, setTeamAssignments] = useState<Record<number, number[]>>({});

  // Initialize team assignments
  useEffect(() => {
    const assignments: Record<number, number[]> = {};
    teams.forEach(team => {
      assignments[team.id] = team.players.map(p => p.id);
    });
    setTeamAssignments(assignments);
  }, [teams]);

  // Prevent pull-to-refresh behavior while dragging
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

    // Remove player from original team
    Object.keys(teamAssignments).forEach(teamId => {
      const numTeamId = parseInt(teamId);
      teamAssignments[numTeamId] = teamAssignments[numTeamId].filter(id => id !== playerId);
    });

    // Add player to new team
    const destTeamId = parseInt(destination.droppableId);
    teamAssignments[destTeamId] = [...(teamAssignments[destTeamId] || []), playerId];

    setTeamAssignments({...teamAssignments});
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
  };

  const isTeamsBalanced = () => {
    const teamSizes = teams.map(team => team.players.length);
    const uniqueSizes = new Set(teamSizes);
    return uniqueSizes.size === 1;
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-taboo-primary/10">
        <CardTitle className="text-center text-taboo-primary">Game Setup</CardTitle>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="gamemode">Game Mode</TabsTrigger>
        </TabsList>
        
        {/* Players Tab */}
        <TabsContent value="players" className="p-4">
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Player name"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="w-full"
              />
              <Button onClick={handleAddPlayer}>Add</Button>
            </div>
            
            <div className="border rounded-md p-2 max-h-60 overflow-y-auto">
              {players.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No players added
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
                Continue to Teams
              </Button>
            )}
          </div>
        </TabsContent>
        
        {/* Teams Tab */}
        <TabsContent value="teams" className="p-4">
          <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Unassigned Players</h3>
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
                          All players are assigned to teams
                        </p>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Teams</h3>
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
                                Drag players here
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
                  Save Teams
                </Button>
                
                {getUnassignedPlayers().length === 0 && (
                  <Button 
                    variant="outline"
                    className="w-full mt-2 border-taboo-primary/30 text-taboo-primary"
                    onClick={() => {
                      handleSaveTeams();
                      setTimeout(() => {
                        handleCompleteSetup();
                      }, 100);
                    }}
                  >
                    Complete Setup Quickly
                  </Button>
                )}
              </div>
            </div>
          </DragDropContext>
        </TabsContent>
        
        {/* Game Mode Tab */}
        <TabsContent value="gamemode" className="p-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Game Mode</h3>
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
                    Play rounds
                    {!isTeamsBalanced() && (
                      <span className="text-xs text-muted-foreground ml-2">
                        (requires balanced teams)
                      </span>
                    )}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={GameMode.SCORE} id="mode-score" />
                  <Label htmlFor="mode-score">Play to score</Label>
                </div>
              </RadioGroup>
            </div>
            
            {gameSettings.mode === GameMode.SCORE && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Score to win</Label>
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
                  <Label>Number of rounds</Label>
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
                <Label>Time per turn (seconds)</Label>
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
                <Label>Maximum passes per turn</Label>
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
              Complete Setup
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default GameSetup;
