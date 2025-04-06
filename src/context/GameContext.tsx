import React, { createContext, useContext, useState, useEffect } from 'react';
import { tabooCards as originalCards, TabooCard } from '../data/words';
import { tabooCards as extendedCards } from '../data/taboo_words.js';
import { toast } from "@/hooks/use-toast";

// Chiave per salvare le carte utilizzate nel localStorage
const USED_CARDS_KEY = 'taboo-used-cards';

// Tipo per un giocatore
interface Player {
  id: number;
  name: string;
}

// Modalità di gioco
enum GameMode {
  SCORE = 'score',  // Gioca fino a raggiungere un punteggio target
  ROUNDS = 'rounds' // Gioca un numero fisso di round
}

interface Team {
  id: number;
  name: string;
  score: number;
  players: Player[];
}

interface GameSettings {
  mode: GameMode;              // Modalità di gioco
  targetScore?: number;        // Punteggio target in modalità SCORE
  totalRounds?: number;        // Numero totale di round in modalità ROUNDS
  currentRound: number;        // Round corrente
  maxPasses: number;           // Numero massimo di pass per turno
  roundTime: number;           // Tempo in secondi per ogni turno
}

type GameContextType = {
  players: Player[];
  teams: Team[];
  currentTeam: number;
  currentPlayerIndex: number;
  showPlayerTurn: boolean;
  setShowPlayerTurn: (show: boolean) => void;
  startRoundAfterPlayerScreen: () => void;
  cards: TabooCard[];
  currentCard: TabooCard | null;
  roundTime: number;
  timeLeft: number;
  isPlaying: boolean;
  passesUsed: number;
  gameSettings: GameSettings;
  gameSetupComplete: boolean;
  usedCardsCount: number;
  availableCardsCount: number;
  addTeam: (name: string) => void;
  removeTeam: (id: number) => void;
  addPlayer: (name: string) => number;
  removePlayer: (id: number) => void;
  assignPlayersToTeams: (teamAssignments: Record<number, number[]>) => void;
  updateGameSettings: (settings: Partial<GameSettings>) => void;
  completeGameSetup: () => boolean;
  startGame: () => void;
  endRound: () => void;
  endGame: () => void;
  correctAnswer: () => void;
  skipCard: () => void;
  tabooUsed: () => void;
  resetGame: () => void;
  resetGameCompletely: () => void;
  resetUsedCards: () => void;
  setRoundTime: (time: number) => void;
};

const defaultContext: GameContextType = {
  teams: [],
  currentTeam: 0,
  currentPlayerIndex: 0,
  showPlayerTurn: false,
  setShowPlayerTurn: () => {},
  startRoundAfterPlayerScreen: () => {},
  cards: [],
  currentCard: null,
  roundTime: 60,
  isPlaying: false,
  timeLeft: 0,
  passesUsed: 0,
  gameSettings: {
    mode: GameMode.SCORE,
    targetScore: 10,
    currentRound: 0,
    maxPasses: 3,
    roundTime: 60
  },
  players: [],
  gameSetupComplete: false,
  usedCardsCount: 0,
  availableCardsCount: 0,
  addTeam: () => {},
  removeTeam: () => {},
  addPlayer: () => 0,
  removePlayer: () => {},
  assignPlayersToTeams: () => {},
  updateGameSettings: () => {},
  completeGameSetup: () => false,
  startGame: () => {},
  endRound: () => {},
  endGame: () => {},
  correctAnswer: () => {},
  skipCard: () => {},
  tabooUsed: () => {},
  resetGame: () => {},
  resetGameCompletely: () => {},
  resetUsedCards: () => {},
  setRoundTime: () => {}
};

const GameContext = createContext<GameContextType>(defaultContext);

export const useGameContext = () => useContext(GameContext);
export { GameMode };

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: "Squadra 1", score: 0, players: [] },
    { id: 2, name: "Squadra 2", score: 0, players: [] }
  ]);
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameSetupComplete, setGameSetupComplete] = useState(false);
  
  const [currentTeam, setCurrentTeam] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showPlayerTurn, setShowPlayerTurn] = useState(false);
  const [cards, setCards] = useState<TabooCard[]>([]);
  const [currentCard, setCurrentCard] = useState<TabooCard | null>(null);
  const [roundTime, setRoundTime] = useState(60); // seconds
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [passesUsed, setPassesUsed] = useState(0);
  
  // Impostazioni di gioco
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    mode: GameMode.SCORE,
    targetScore: 10,
    currentRound: 0,
    maxPasses: 3,
    roundTime: 60
  });
  
  // Stato per le carte utilizzate (ID delle carte)
  const [usedCardIds, setUsedCardIds] = useState<number[]>(() => {
    try {
      const savedIds = localStorage.getItem(USED_CARDS_KEY);
      return savedIds ? JSON.parse(savedIds) : [];
    } catch (error) {
      console.error("Errore nel caricamento delle carte utilizzate:", error);
      return [];
    }
  });

  // Combiniamo i due set di parole
  const allTabooCards = [...originalCards, ...extendedCards];
  
  // Carte disponibili (non ancora utilizzate)
  const availableCards = allTabooCards.filter(card => !usedCardIds.includes(card.id));

  // Salva le carte utilizzate nel localStorage quando cambia lo stato
  useEffect(() => {
    localStorage.setItem(USED_CARDS_KEY, JSON.stringify(usedCardIds));
  }, [usedCardIds]);

  // Shuffle cards and prepare game
  useEffect(() => {
    resetGame();
  }, []);

  // Timer logic
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      setTimerId(timer);

      return () => {
        if (timer) clearTimeout(timer);
      };
    } else if (isPlaying && timeLeft === 0) {
      endRound();
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isPlaying, timeLeft]);

  // Controlla la vittoria in base alle impostazioni di gioco
  useEffect(() => {
    // Controlla vincitore se nella modalità punteggio
    if (gameSettings.mode === GameMode.SCORE && gameSettings.targetScore) {
      const winningTeam = teams.find(team => team.score >= gameSettings.targetScore);
      if (winningTeam && isPlaying) {
        declareWinner(winningTeam);
      }
    }
    
    // Controlla fine gioco se modalità round
    if (gameSettings.mode === GameMode.ROUNDS && 
        gameSettings.totalRounds && 
        gameSettings.currentRound > gameSettings.totalRounds) {
      endGame();
    }
  }, [teams, gameSettings, isPlaying]);

  const declareWinner = (winningTeam: Team) => {
    setIsPlaying(false);
    if (timerId) clearTimeout(timerId);
    
    toast({
      title: "Vittoria!",
      description: `${winningTeam.name} ha vinto con ${winningTeam.score} punti!`
    });
  };

  const shuffleCards = () => {
    // Utilizziamo solo le carte non ancora usate
    if (availableCards.length === 0) {
      toast({
        title: "Attenzione",
        description: "Tutte le carte sono state utilizzate! Puoi resettare la lista delle carte utilizzate dalle impostazioni.",
        variant: "destructive"
      });
      // Ritorna un deck vuoto se non ci sono carte disponibili
      setCards([]);
      return [];
    }
    
    // Create a copy and shuffle
    const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    return shuffled;
  };

  const drawCard = () => {
    if (cards.length === 0) {
      // Se non ci sono più carte disponibili
      if (availableCards.length === 0) {
        toast({
          title: "Attenzione",
          description: "Tutte le carte sono state utilizzate! Puoi resettare la lista delle carte utilizzate dalle impostazioni.",
          variant: "destructive"
        });
        setCurrentCard(null);
        return;
      }
      
      // If we've gone through all cards, reshuffle
      const newDeck = shuffleCards();
      if (newDeck.length > 0) {
        const nextCard = newDeck[0];
        setCurrentCard(nextCard);
        // Aggiungi l'ID alla lista delle carte utilizzate
        setUsedCardIds(prev => [...prev, nextCard.id]);
      }
    } else {
      const nextCard = cards[0];
      setCurrentCard(nextCard);
      setCards(prevCards => prevCards.slice(1));
      // Aggiungi l'ID alla lista delle carte utilizzate
      setUsedCardIds(prev => [...prev, nextCard.id]);
    }
  };

  const resetUsedCards = () => {
    setUsedCardIds([]);
    toast({
      title: "Reset completato",
      description: "La lista delle carte utilizzate è stata azzerata. Tutte le carte sono ora disponibili."
    });
    resetGame();
  };

  const addTeam = (name: string) => {
    const newId = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1;
    setTeams([...teams, { id: newId, name, score: 0, players: [] }]);
  };

  const removeTeam = (id: number) => {
    if (teams.length <= 2) {
      toast({
        title: "Errore",
        description: "È necessario avere almeno due squadre per giocare.",
        variant: "destructive"
      });
      return;
    }
    setTeams(teams.filter(team => team.id !== id));
  };

  const addPlayer = (name: string) => {
    // Usiamo un functional update per assicurare che stiamo lavorando con lo stato più recente
    let newId = 0;
    setPlayers(prevPlayers => {
      newId = prevPlayers.length > 0 ? Math.max(...prevPlayers.map(p => p.id)) + 1 : 1;
      const newPlayer = { id: newId, name };
      return [...prevPlayers, newPlayer];
    });
    return newId;
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter(player => player.id !== id));
    // Rimuovi anche il giocatore dalle squadre
    setTeams(teams.map(team => ({
      ...team,
      players: team.players.filter(p => p.id !== id)
    })));
  };

  const assignPlayersToTeams = (teamAssignments: Record<number, number[]>) => {
    setTeams(teams.map(team => {
      // Trova gli ID dei giocatori assegnati a questa squadra
      const assignedPlayerIds = teamAssignments[team.id] || [];
      // Trova i giocatori corrispondenti
      const assignedPlayers = players.filter(p => assignedPlayerIds.includes(p.id));
      
      return {
        ...team,
        players: assignedPlayers
      };
    }));
  };

  const updateGameSettings = (settings: Partial<GameSettings>) => {
    // Se roundTime è stato aggiornato, sincronizza anche lo stato roundTime
    if (settings.roundTime) {
      setRoundTime(settings.roundTime);
    }
    
    setGameSettings(prev => ({ ...prev, ...settings }));
  };

  const completeGameSetup = () => {
    // Verifica che ci siano almeno 2 squadre con almeno 1 giocatore ciascuna
    const validTeams = teams.filter(team => team.players.length > 0);
    if (validTeams.length < 2) {
      
      return false;
    }
    
    // Verifica impostazioni di gioco valide
    if (gameSettings.mode === GameMode.SCORE && (!gameSettings.targetScore || gameSettings.targetScore <= 0)) {
      toast({
        title: "Configurazione incompleta",
        description: "Imposta un punteggio obiettivo valido",
        variant: "destructive"
      });
      return false;
    }
    
    if (gameSettings.mode === GameMode.ROUNDS && (!gameSettings.totalRounds || gameSettings.totalRounds <= 0)) {
      toast({
        title: "Configurazione incompleta",
        description: "Imposta un numero di round valido",
        variant: "destructive"
      });
      return false;
    }
    
    setGameSetupComplete(true);
    return true;
  };

  const startGame = () => {
    if (!gameSetupComplete) {
      toast({
        title: "Configurazione incompleta",
        description: "Completa la configurazione del gioco prima di iniziare",
        variant: "destructive"
      });
      return;
    }

    // Verifica se ci sono carte disponibili
    if (availableCards.length === 0) {
      toast({
        title: "Attenzione",
        description: "Tutte le carte sono state utilizzate! Puoi resettare la lista delle carte utilizzate dalle impostazioni.",
        variant: "destructive"
      });
      return;
    }

    // Avviso se rimangono poche carte
    if (availableCards.length < 10) {
      toast({
        title: "Attenzione",
        description: `Rimangono solo ${availableCards.length} carte disponibili. Potrebbe essere necessario resettare presto la lista.`,
        variant: "default"
      });
    }

    // In modalità round, incrementa il contatore dei round
    if (gameSettings.mode === GameMode.ROUNDS) {
      setGameSettings(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1
      }));
    }

    // Mostra la schermata del turno del giocatore
    setShowPlayerTurn(true);
  };
  
  const startRoundAfterPlayerScreen = () => {
    setShowPlayerTurn(false);
    
    // Resetta i pass usati all'inizio di ogni turno
    setPassesUsed(0);
    
    // Avvio effettivo del round
    shuffleCards();
    drawCard();
    setTimeLeft(roundTime);
    setIsPlaying(true);
  };

  const endRound = () => {
    setIsPlaying(false);
    if (timerId) clearTimeout(timerId);
    nextTeam();
  };

  const endGame = () => {
    setIsPlaying(false);
    if (timerId) clearTimeout(timerId);
    
    // Find winner
    const maxScore = Math.max(...teams.map(t => t.score));
    const winners = teams.filter(t => t.score === maxScore);
    
    if (winners.length === 1) {
      toast({
        title: "Fine del gioco!",
        description: `${winners[0].name} vince con ${maxScore} punti!`
      });
    } else {
      toast({
        title: "Fine del gioco!",
        description: `Pareggio tra ${winners.map(w => w.name).join(', ')} con ${maxScore} punti!`
      });
    }
  }

 const nextTeam = () => {
  const totalPlayers = teams[0].players.length; // Assumiamo squadre bilanciate
  setCurrentPlayerIndex(prevPlayerIndex => {
    const nextPlayerIndex = (prevPlayerIndex ) % totalPlayers;
    setCurrentTeam(prevTeam => (prevTeam + 1) % teams.length); // Alterna team ogni turno
    return nextPlayerIndex;
  });
 
    // Mostra la schermata del turno del giocatore
    setShowPlayerTurn(true);
    
    // Resetta i pass usati all'inizio di ogni turno
    setPassesUsed(0);
    
    drawCard();
    setTimeLeft(roundTime);
  };

  const correctAnswer = () => {
    if (!isPlaying) return;
    
    // Update score
    setTeams(teams.map((team, index) => 
      index === currentTeam ? { ...team, score: team.score + 1 } : team
    ));
    
    // Draw new card
    drawCard();
    
    
  };

  const skipCard = () => {
    if (!isPlaying) return;
    
    // Se abbiamo superato il limite di pass, togliamo un punto
    if (passesUsed >= gameSettings.maxPasses) {
      // Penalty: -1 point
      setTeams(teams.map((team, index) => 
        index === currentTeam ? { ...team, score: Math.max(0, team.score - 1) } : team
      ));
      
      
    } else {
      // Incrementa i pass usati
      setPassesUsed(prevPasses => prevPasses + 1);
      
      
    }
    
    drawCard();
  };

  const tabooUsed = () => {
    if (!isPlaying) return;
    
    // Penalty: -1 point
    setTeams(teams.map((team, index) => 
      index === currentTeam ? { ...team, score: Math.max(0, team.score - 1) } : team
    ));
    
    drawCard();
    
   
  };

  const resetGame = () => {
    // Mantieni giocatori e squadre
    // Resetta solo i punteggi
    setTeams(teams.map(team => ({
      ...team,
      score: 0
    })));
    
    // Non resettiamo currentTeam per mantenere il turno tra le partite
    setCurrentPlayerIndex(0); // Reset dell'indice del giocatore
    setShowPlayerTurn(false); // Nascondi la schermata del turno
    shuffleCards();
    setCurrentCard(null);
    setIsPlaying(false);
    setTimeLeft(roundTime);
    setPassesUsed(0);
    setGameSettings(prev => ({
      ...prev,
      currentRound: 0
    }));
    
    if (timerId) clearTimeout(timerId);
  };

  const resetGameCompletely = () => {
    setTeams([
      { id: 1, name: "Squadra 1", score: 0, players: [] },
      { id: 2, name: "Squadra 2", score: 0, players: [] }
    ]);
    setPlayers([]);
    // Resettiamo anche il turno per iniziare sempre dalla prima squadra
    setCurrentTeam(0);
    setCurrentPlayerIndex(0);
    setShowPlayerTurn(false);
    shuffleCards();
    setCurrentCard(null);
    setIsPlaying(false);
    setTimeLeft(roundTime);
    setPassesUsed(0);
    setGameSettings({
      mode: GameMode.SCORE,
      targetScore: 10,
      currentRound: 0,
      maxPasses: 3,
      roundTime: 60
    });
    setGameSetupComplete(false);
    
    if (timerId) clearTimeout(timerId);
    
    toast({
      title: "Gioco resettato",
      description: "Il gioco è stato resettato completamente."
    });
  };

  const setRoundTimeHandler = (time: number) => {
    setRoundTime(time);
    setGameSettings(prev => ({
      ...prev,
      roundTime: time
    }));
  };

  return (
    <GameContext.Provider
      value={{
        players,
        teams,
        currentTeam,
        currentPlayerIndex,
        showPlayerTurn,
        setShowPlayerTurn,
        startRoundAfterPlayerScreen,
        cards,
        currentCard,
        roundTime,
        timeLeft,
        isPlaying,
        passesUsed,
        gameSettings,
        gameSetupComplete,
        usedCardsCount: usedCardIds.length,
        availableCardsCount: availableCards.length,
        addTeam,
        removeTeam,
        addPlayer,
        removePlayer,
        assignPlayersToTeams,
        updateGameSettings,
        completeGameSetup,
        startGame,
        endRound,
        endGame,
        correctAnswer,
        skipCard,
        tabooUsed,
        resetGame,
        resetGameCompletely,
        resetUsedCards,
        setRoundTime: setRoundTimeHandler
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
