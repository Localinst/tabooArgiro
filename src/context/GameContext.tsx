
import React, { createContext, useContext, useState, useEffect } from 'react';
import { tabooCards, TabooCard } from '../data/words';
import { toast } from "@/hooks/use-toast";

interface Team {
  id: number;
  name: string;
  score: number;
}

interface GameContextType {
  teams: Team[];
  currentTeam: number;
  currentCard: TabooCard | null;
  cards: TabooCard[];
  roundTime: number;
  isPlaying: boolean;
  timeLeft: number;
  addTeam: (name: string) => void;
  removeTeam: (id: number) => void;
  startGame: () => void;
  endGame: () => void;
  nextTeam: () => void;
  correctAnswer: () => void;
  skipCard: () => void;
  tabooUsed: () => void;
  setRoundTime: (time: number) => void;
  resetGame: () => void;
}

const defaultContext: GameContextType = {
  teams: [],
  currentTeam: 0,
  currentCard: null,
  cards: [],
  roundTime: 60,
  isPlaying: false,
  timeLeft: 0,
  addTeam: () => {},
  removeTeam: () => {},
  startGame: () => {},
  endGame: () => {},
  nextTeam: () => {},
  correctAnswer: () => {},
  skipCard: () => {},
  tabooUsed: () => {},
  setRoundTime: () => {},
  resetGame: () => {}
};

const GameContext = createContext<GameContextType>(defaultContext);

export const useGameContext = () => useContext(GameContext);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: "Squadra 1", score: 0 },
    { id: 2, name: "Squadra 2", score: 0 }
  ]);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [cards, setCards] = useState<TabooCard[]>([]);
  const [currentCard, setCurrentCard] = useState<TabooCard | null>(null);
  const [roundTime, setRoundTime] = useState(60); // seconds
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

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

  const shuffleCards = () => {
    // Create a copy and shuffle
    const shuffled = [...tabooCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    return shuffled;
  };

  const drawCard = () => {
    if (cards.length === 0) {
      // If we've gone through all cards, reshuffle
      const newDeck = shuffleCards();
      setCurrentCard(newDeck[0]);
    } else {
      setCurrentCard(cards[0]);
      setCards(prevCards => prevCards.slice(1));
    }
  };

  const addTeam = (name: string) => {
    const newId = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1;
    setTeams([...teams, { id: newId, name, score: 0 }]);
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

  const startGame = () => {
    if (teams.length < 2) {
      toast({
        title: "Errore",
        description: "È necessario avere almeno due squadre per giocare.",
        variant: "destructive"
      });
      return;
    }

    setCurrentTeam(0);
    drawCard();
    setTimeLeft(roundTime);
    setIsPlaying(true);
    toast({
      title: "Inizia il gioco!",
      description: `${teams[0].name} inizia!`
    });
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
  };

  const nextTeam = () => {
    const nextTeamIndex = (currentTeam + 1) % teams.length;
    setCurrentTeam(nextTeamIndex);
    
    toast({
      title: "Cambio turno",
      description: `Tocca a ${teams[nextTeamIndex].name}!`
    });
    
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
    
    toast({
      title: "Risposta corretta!",
      description: `+1 punto per ${teams[currentTeam].name}`
    });
  };

  const skipCard = () => {
    if (!isPlaying) return;
    drawCard();
    
    toast({
      description: "Carta saltata"
    });
  };

  const tabooUsed = () => {
    if (!isPlaying) return;
    
    // Penalty: -1 point
    setTeams(teams.map((team, index) => 
      index === currentTeam ? { ...team, score: Math.max(0, team.score - 1) } : team
    ));
    
    drawCard();
    
    toast({
      title: "Parola taboo usata!",
      description: `-1 punto per ${teams[currentTeam].name}`,
      variant: "destructive"
    });
  };

  const resetGame = () => {
    setTeams([
      { id: 1, name: "Squadra 1", score: 0 },
      { id: 2, name: "Squadra 2", score: 0 }
    ]);
    setCurrentTeam(0);
    shuffleCards();
    setCurrentCard(null);
    setIsPlaying(false);
    setTimeLeft(roundTime);
    if (timerId) clearTimeout(timerId);
  };

  return (
    <GameContext.Provider value={{
      teams,
      currentTeam,
      currentCard,
      cards,
      roundTime,
      isPlaying,
      timeLeft,
      addTeam,
      removeTeam,
      startGame,
      endGame,
      nextTeam,
      correctAnswer,
      skipCard,
      tabooUsed,
      setRoundTime: (time) => setRoundTime(time),
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
};
