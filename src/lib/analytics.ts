// Funzione di supporto per verificare se gtag è definito
const isGtagDefined = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag !== 'undefined';
};

// Tipi di eventi relativi alle carte
export enum CardEventType {
  CORRECT = 'correct_answer',
  TABOO_USED = 'taboo_used',
  SKIP = 'card_skipped',
  DRAW = 'card_drawn',
  ROUND_START = 'round_started',
  ROUND_END = 'round_ended',
  GAME_COMPLETED = 'game_completed'
}

// Traccia quando l'utente risponde correttamente a una carta
export const trackCorrectAnswer = (cardWord: string, teamName: string) => {
  if (!isGtagDefined()) return;
  
  try {
    window.gtag('event', CardEventType.CORRECT, {
      card_word: cardWord,
      team_name: teamName
    });
  } catch (error) {
    console.error('Errore nel tracciamento dell\'evento corretto:', error);
  }
};

// Traccia quando viene usato un termine taboo
export const trackTabooUsed = (cardWord: string, teamName: string) => {
  if (!isGtagDefined()) return;
  
  try {
    window.gtag('event', CardEventType.TABOO_USED, {
      card_word: cardWord,
      team_name: teamName
    });
  } catch (error) {
    console.error('Errore nel tracciamento dell\'evento taboo:', error);
  }
};

// Traccia quando viene saltata una carta
export const trackSkipCard = (cardWord: string, teamName: string) => {
  if (!isGtagDefined()) return;
  
  try {
    window.gtag('event', CardEventType.SKIP, {
      card_word: cardWord,
      team_name: teamName
    });
  } catch (error) {
    console.error('Errore nel tracciamento dell\'evento skip:', error);
  }
};

// Traccia quando viene pescata una nuova carta
export const trackCardDrawn = (cardWord: string) => {
  if (!isGtagDefined()) return;
  
  try {
    window.gtag('event', CardEventType.DRAW, {
      card_word: cardWord
    });
  } catch (error) {
    console.error('Errore nel tracciamento dell\'evento carta pescata:', error);
  }
};

// Traccia l'inizio di un round
export const trackRoundStart = (roundNumber: number, teamName: string) => {
  if (!isGtagDefined()) return;
  
  try {
    window.gtag('event', CardEventType.ROUND_START, {
      round_number: roundNumber,
      team_name: teamName
    });
  } catch (error) {
    console.error('Errore nel tracciamento dell\'inizio round:', error);
  }
};

// Traccia la fine di un round
export const trackRoundEnd = (roundNumber: number, teamName: string, score: number) => {
  if (!isGtagDefined()) return;
  
  try {
    window.gtag('event', CardEventType.ROUND_END, {
      round_number: roundNumber,
      team_name: teamName,
      score: score
    });
  } catch (error) {
    console.error('Errore nel tracciamento della fine round:', error);
  }
};

// Traccia il completamento del gioco
export const trackGameCompleted = (gameMode: string, winnerTeam: string, totalRounds: number) => {
  if (!isGtagDefined()) return;
  
  try {
    window.gtag('event', CardEventType.GAME_COMPLETED, {
      game_mode: gameMode,
      winner_team: winnerTeam,
      total_rounds: totalRounds
    });
  } catch (error) {
    console.error('Errore nel tracciamento del completamento del gioco:', error);
  }
};

// Dichiarazione per TypeScript
declare global {
  interface Window {
    gtag: (command: string, action: string, params?: any) => void;
    dataLayer: any[];
  }
} 