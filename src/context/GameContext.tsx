import React, { createContext, useContext, useState, useEffect } from 'react';
import { TabooCard } from '../data/types';
import { tabooCards } from '../data/taboo_words';
import { tabooCardsEn } from '../data/taboo_words_en';
import { useLanguage } from './LanguageContext';
import { toast } from "@/hooks/use-toast";
import { 
  trackCorrectAnswer, 
  trackTabooUsed, 
  trackSkipCard, 
  trackCardDrawn,
  trackRoundStart,
  trackRoundEnd,
  trackGameCompleted
} from '../lib/analytics';

// Chiave per salvare le carte utilizzate nel localStorage
const USED_CARDS_KEY = 'taboo-used-cards';

// Estendo l'interfaccia TabooCard per includere uniqueId
interface ExtendedTabooCard extends TabooCard {
  uniqueId: string;
}

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
  cards: ExtendedTabooCard[];
  currentCard: ExtendedTabooCard | null;
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
  updateTeamName: (id: number, newName: string) => void;
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
    totalRounds: 5,
    maxPasses: 3,
    roundTime: 60
  },
  players: [],
  gameSetupComplete: false,
  usedCardsCount: 0,
  availableCardsCount: 0,
  addTeam: () => {},
  removeTeam: () => {},
  updateTeamName: () => {},
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
  const { language } = useLanguage();
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: "Squadra A", score: 0, players: [] },
    { id: 2, name: "Squadra B", score: 0, players: [] }
  ]);
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameSetupComplete, setGameSetupComplete] = useState(false);
  
  const [currentTeam, setCurrentTeam] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showPlayerTurn, setShowPlayerTurn] = useState(false);
  const [cards, setCards] = useState<ExtendedTabooCard[]>([]);
  const [currentCard, setCurrentCard] = useState<ExtendedTabooCard | null>(null);
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
    totalRounds: 5,
    maxPasses: 3,
    roundTime: 60
  });
  
  // Stato per le carte utilizzate (ID delle carte)
  const [usedCardIds, setUsedCardIds] = useState<string[]>(() => {
    try {
      const savedIds = localStorage.getItem(USED_CARDS_KEY);
      return savedIds ? JSON.parse(savedIds) : [];
    } catch (error) {
      console.error("Errore nel caricamento delle carte utilizzate:", error);
      return [];
    }
  });

  // Aggiungiamo un prefisso per generare ID univoci per le carte
  const getCards = () => {
    const cards = language === 'it' ? tabooCards : tabooCardsEn;
    return cards.map(card => ({
      ...card,
      uniqueId: `taboo_${card.id}_${language}`
    }));
  };

  const tabooCardsWithUniqueIds = getCards();
  
  const allTabooCards: ExtendedTabooCard[] = tabooCardsWithUniqueIds;
  
  // Carte disponibili (non ancora utilizzate)
  const availableCards = allTabooCards.filter(card => !usedCardIds.includes(card.uniqueId));

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
    
    // Tracciamento completamento del gioco
    trackGameCompleted(
      gameSettings.mode, 
      winningTeam.name,
      gameSettings.currentRound
    );
    
    toast({
      title: "Vittoria!",
      description: `${winningTeam.name} ha vinto con ${winningTeam.score} punti!`
    });
  };

  const shuffleCards = () => {
    // Verifichiamo se ci sono carte disponibili
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
    
    // Filtriamo le carte per assicurarci di escludere tutte quelle già utilizzate
    const unusedCards = allTabooCards.filter(card => !usedCardIds.includes(card.uniqueId));
    
    // Mescoliamo le carte non utilizzate
    const shuffled = [...unusedCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    
    console.log(`Mazzo mescolato: ${shuffled.length} carte disponibili, ${usedCardIds.length} già utilizzate`);
    return shuffled;
  };

  const drawCard = () => {
    // Verifichiamo se ci sono carte disponibili
    if (cards.length === 0) {
      // Non ci sono più carte nel mazzo
      console.error("Non ci sono più carte nel mazzo!");
      toast({
        title: "Attenzione",
        description: "Non ci sono più carte disponibili nel mazzo!",
        variant: "destructive"
      });
      return null;
    }
    
    // Prendiamo la prima carta e la impostiamo come corrente
    const drawnCard = cards[0];
    setCurrentCard(drawnCard);
    
    // Rimuoviamo la carta dal mazzo
    setCards(cards.slice(1));
    
    // Aggiungiamo l'ID della carta agli ID usati
    if (drawnCard && !usedCardIds.includes(drawnCard.uniqueId)) {
      setUsedCardIds(prev => [...prev, drawnCard.uniqueId]);
    }
    
    // Quando viene pescata una nuova carta, tracciamo l'evento
    if (drawnCard) {
      trackCardDrawn(drawnCard.word);
    }
    
    return drawnCard;
  };

  const resetUsedCards = () => {
    setUsedCardIds([]);
    // Svuota anche il localStorage per assicurare che i dati siano puliti
    localStorage.removeItem(USED_CARDS_KEY);
    toast({
      title: "Reset completato",
      description: "La lista delle carte utilizzate è stata azzerata. Tutte le carte sono ora disponibili."
    });
    // Assicuriamoci che le carte vengano ri-mescolate
    shuffleCards();
    // Resettiamo la partita per applicare le modifiche
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

  const updateTeamName = (id: number, newName: string) => {
    setTeams(teams.map(team => 
      team.id === id ? { ...team, name: newName } : team
    ));
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
      toast({
        title: "Configurazione incompleta",
        description: "È necessario avere almeno due squadre con almeno un giocatore ciascuna",
        variant: "destructive"
      });
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
    
    if (gameSettings.mode === GameMode.ROUNDS) {
      // Verifica il numero di round
      if (!gameSettings.totalRounds || gameSettings.totalRounds <= 0) {
        toast({
          title: "Configurazione incompleta",
          description: "Imposta un numero di round valido",
          variant: "destructive"
        });
        return false;
      }

      // Verifica che le squadre siano bilanciate in modalità round
      const teamSizes = validTeams.map(team => team.players.length);
      const maxSize = Math.max(...teamSizes);
      const minSize = Math.min(...teamSizes);
      
      if (maxSize - minSize > 1) {
        toast({
          title: "Configurazione non valida",
          description: "In modalità round, le squadre devono avere un numero di giocatori bilanciato (differenza massima di 1)",
          variant: "destructive"
        });
        return false;
      }
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

    // In modalità round, incrementa il contatore dei round solo se siamo all'inizio
    // cioè quando il round corrente è 0 (prima partita) o quando torna alla prima squadra e primo giocatore
    if (gameSettings.mode === GameMode.ROUNDS && (gameSettings.currentRound === 0 || (currentTeam === 0 && currentPlayerIndex === 0))) {
      setGameSettings(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1
      }));
    }

    // Mostra la schermata del turno del giocatore
    setShowPlayerTurn(true);
    
    // Tracciamento inizio round
    trackRoundStart(
      gameSettings.currentRound + 1,
      teams[currentTeam].name
    );
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
    
    // Tracciamento fine round
    trackRoundEnd(
      gameSettings.currentRound,
      teams[currentTeam].name,
      teams[currentTeam].score
    );
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
  // Otteniamo i contatori attuali per evitare problemi di sincronia negli aggiornamenti di stato
  const nextTeamIndex = (currentTeam + 1) % teams.length;
  
  // Incrementiamo il giocatore solo quando completiamo un ciclo di tutte le squadre
  let nextPlayerIndex = currentPlayerIndex;
  if (nextTeamIndex === 0) {
    // Se torniamo alla prima squadra, incrementiamo l'indice del giocatore
    nextPlayerIndex = (currentPlayerIndex + 1) % Math.max(1, teams[0].players.length);
    
    // Se torniamo al primo giocatore della prima squadra
    // e siamo in modalità ROUNDS, incrementiamo il round
    if (nextPlayerIndex === 0 && gameSettings.mode === GameMode.ROUNDS) {
      setGameSettings(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1
      }));
    }
  }
  
  // Aggiorniamo gli stati
  setCurrentTeam(nextTeamIndex);
  setCurrentPlayerIndex(nextPlayerIndex);
 
  // Mostra la schermata del turno del giocatore
  setShowPlayerTurn(true);
  
  // Resetta i pass usati all'inizio di ogni turno
  setPassesUsed(0);
  
  drawCard();
  setTimeLeft(roundTime);
};

  const correctAnswer = () => {
    if (!currentCard || !isPlaying) return;
    
    // Update score
    setTeams(teams.map((team, index) => 
      index === currentTeam ? { ...team, score: team.score + 1 } : team
    ));
    
    // Tracciamento risposta corretta
    trackCorrectAnswer(
      currentCard.word,
      teams[currentTeam].name
    );
    
    // Draw new card
    drawCard();
  };

  const skipCard = () => {
    if (!currentCard || !isPlaying) return;
    
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
    
    // Tracciamento carta saltata
    trackSkipCard(
      currentCard.word,
      teams[currentTeam].name
    );
    
    drawCard();
  };

  const tabooUsed = () => {
    if (!currentCard || !isPlaying) return;
    
    // Penalty: -1 point
    setTeams(teams.map((team, index) => 
      index === currentTeam ? { ...team, score: Math.max(0, team.score - 1) } : team
    ));
    
    // Tracciamento utilizzo taboo
    trackTabooUsed(
      currentCard.word,
      teams[currentTeam].name
    );
    
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
    
    // Verifica che non ci siano duplicati nella lista delle carte utilizzate
    const uniqueUsedIds = [...new Set(usedCardIds)];
    if (uniqueUsedIds.length !== usedCardIds.length) {
      console.warn(`Riparati ${usedCardIds.length - uniqueUsedIds.length} ID duplicati nella lista usedCardIds`);
      setUsedCardIds(uniqueUsedIds);
    }
    
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
      { id: 1, name: "Squadra A", score: 0, players: [] },
      { id: 2, name: "Squadra B", score: 0, players: [] }
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
      totalRounds: 5,
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
        updateTeamName,
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
