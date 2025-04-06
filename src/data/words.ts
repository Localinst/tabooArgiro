
export interface TabooCard {
  id: number;
  word: string;
  tabooWords: string[];
}

export const tabooCards: TabooCard[] = [
  {
    id: 1,
    word: "PIZZA",
    tabooWords: ["Formaggio", "Pomodoro", "Italia", "Forno", "Rotonda"]
  },
  {
    id: 2,
    word: "TELEFONO",
    tabooWords: ["Chiamare", "Cellulare", "Parlare", "Numero", "Comunicare"]
  },
  {
    id: 3,
    word: "CALCIO",
    tabooWords: ["Pallone", "Squadra", "Gol", "Sport", "Stadio"]
  },
  {
    id: 4,
    word: "SPIAGGIA",
    tabooWords: ["Mare", "Sabbia", "Estate", "Sole", "Ombrellone"]
  },
  {
    id: 5,
    word: "LIBRO",
    tabooWords: ["Leggere", "Pagine", "Autore", "Storia", "Biblioteca"]
  },
  {
    id: 6,
    word: "GELATO",
    tabooWords: ["Freddo", "Cono", "Dolce", "Estate", "Gusto"]
  },
  {
    id: 7,
    word: "COMPUTER",
    tabooWords: ["Tastiera", "Schermo", "Internet", "Digitare", "Programma"]
  },
  {
    id: 8,
    word: "CINEMA",
    tabooWords: ["Film", "Schermo", "Attore", "Biglietto", "Popcorn"]
  },
  {
    id: 9,
    word: "BICICLETTA",
    tabooWords: ["Pedalare", "Ruote", "Strada", "Casco", "Catena"]
  },
  {
    id: 10,
    word: "MUSEO",
    tabooWords: ["Arte", "Quadri", "Storia", "Mostra", "Visitare"]
  },
  {
    id: 11,
    word: "CAFFÈ",
    tabooWords: ["Tazza", "Bere", "Mattina", "Espresso", "Sveglia"]
  },
  {
    id: 12,
    word: "TRENO",
    tabooWords: ["Binari", "Stazione", "Viaggio", "Vagone", "Biglietto"]
  },
  {
    id: 13,
    word: "OROLOGIO",
    tabooWords: ["Tempo", "Ore", "Minuti", "Polso", "Lancette"]
  },
  {
    id: 14,
    word: "CHITARRA",
    tabooWords: ["Musica", "Corde", "Suonare", "Strumento", "Canzone"]
  },
  {
    id: 15,
    word: "MONTAGNA",
    tabooWords: ["Alta", "Neve", "Scalare", "Vetta", "Escursione"]
  }
];
