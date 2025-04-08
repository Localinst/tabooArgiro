import { TabooCard } from '../data/types';

// Classe mock per simulare il componente GameProvider
class GameProviderMock {
  // Generiamo un numero elevato di carte dal file taboo_words
  tabooCards: TabooCard[] = Array.from({ length: 730 }, (_, i) => ({
    id: i + 1,
    word: `TABOO${i + 1}`,
    tabooWords: [`a${i}_tab`, `b${i}_tab`, `c${i}_tab`, `d${i}_tab`, `e${i}_tab`]
  }));
  
  usedCardIds: string[] = [];
  cards: any[] = [];
  currentCard: any = null;
  
  // Estende le carte con uniqueId
  get tabooCardsWithUniqueIds() {
    return this.tabooCards.map(card => ({
      ...card,
      uniqueId: `taboo_${card.id}`
    }));
  }
  
  get allTabooCards() {
    return this.tabooCardsWithUniqueIds;
  }
  
  get availableCards() {
    return this.allTabooCards.filter(card => !this.usedCardIds.includes(card.uniqueId));
  }
  
  shuffleCards() {
    if (this.availableCards.length === 0) {
      console.warn("Nessuna carta disponibile!");
      this.cards = [];
      return [];
    }
    
    const shuffled = [...this.availableCards].sort(() => Math.random() - 0.5);
    this.cards = shuffled;
    return shuffled;
  }
  
  drawCard() {
    if (this.availableCards.length === 0) {
      console.warn("Nessuna carta disponibile!");
      this.currentCard = null;
      return;
    }
    
    if (this.cards.length === 0) {
      const newDeck = this.shuffleCards();
      if (newDeck.length > 0) {
        const nextCard = newDeck[0];
        if (!this.usedCardIds.includes(nextCard.uniqueId)) {
          this.currentCard = nextCard;
          this.cards = this.cards.slice(1);
          this.usedCardIds.push(nextCard.uniqueId);
        } else {
          console.warn("Carta già utilizzata trovata, ritento...");
          this.drawCard();
        }
      }
    } else {
      const nextCard = this.cards[0];
      if (!this.usedCardIds.includes(nextCard.uniqueId)) {
        this.currentCard = nextCard;
        this.cards = this.cards.slice(1);
        this.usedCardIds.push(nextCard.uniqueId);
      } else {
        console.warn("Carta già utilizzata trovata, ritento...");
        this.cards = this.cards.slice(1);
        this.drawCard();
      }
    }
    
    return this.currentCard;
  }
  
  resetUsedCards() {
    this.usedCardIds = [];
  }
}

// Test per verificare la logica di mescolamento e rimozione delle carte
describe('Test Mescolamento e Gestione Carte Taboo', () => {
  let gameProvider: GameProviderMock;
  
  beforeEach(() => {
    // Inizializza un nuovo provider per ogni test
    gameProvider = new GameProviderMock();
  });
  
  test('Le carte vengono correttamente estese con ID univoci', () => {
    const allCards = gameProvider.allTabooCards;
    
    // Verifica che tutte le carte estese siano presenti
    expect(allCards.length).toBe(gameProvider.tabooCards.length);
    
    // Verifica che gli ID siano univoci
    const uniqueIds = new Set(allCards.map(card => card.uniqueId));
    expect(uniqueIds.size).toBe(allCards.length);
    
    // Verifica che il formato degli ID sia corretto
    for (const card of allCards) {
      expect(card.uniqueId).toMatch(/^taboo_\d+$/);
    }
  });
  
  test('Le carte vengono mescolate correttamente', () => {
    const shuffled1 = gameProvider.shuffleCards();
    const shuffled2 = gameProvider.shuffleCards();
    
    // Verifica che ci siano tutte le carte
    expect(shuffled1.length).toBe(gameProvider.allTabooCards.length);
    
    // Nota: il test seguente potrebbe occasionalmente fallire a causa della casualità
    // del mescolamento, ma è improbabile che due mescolamenti successivi siano identici
    const areIdenticalOrder = JSON.stringify(shuffled1) === JSON.stringify(shuffled2);
    expect(areIdenticalOrder).toBe(false);
  });
  
  test('Le carte usate vengono rimosse dal mazzo disponibile', () => {
    // Usa alcune carte
    const card1 = gameProvider.drawCard();
    const card2 = gameProvider.drawCard();
    const card3 = gameProvider.drawCard();
    
    // Verifica che le carte siano state marcate come usate
    expect(gameProvider.usedCardIds).toContain(card1.uniqueId);
    expect(gameProvider.usedCardIds).toContain(card2.uniqueId);
    expect(gameProvider.usedCardIds).toContain(card3.uniqueId);
    
    // Verifica che le carte usate non siano più disponibili
    const availableCards = gameProvider.availableCards;
    availableCards.forEach(card => {
      expect(card.uniqueId).not.toBe(card1.uniqueId);
      expect(card.uniqueId).not.toBe(card2.uniqueId);
      expect(card.uniqueId).not.toBe(card3.uniqueId);
    });
    
    // Verifica che il numero di carte disponibili sia diminuito
    expect(availableCards.length).toBe(
      gameProvider.allTabooCards.length - gameProvider.usedCardIds.length
    );
  });
  
  test('Non vengono mostrate carte duplicate nella stessa partita', () => {
    const uniqueCards = new Set();
    const drawnCards = [];
    
    // Pesca tutte le carte disponibili
    for (let i = 0; i < gameProvider.allTabooCards.length; i++) {
      const card = gameProvider.drawCard();
      if (!card) break; // Se non ci sono più carte disponibili
      
      drawnCards.push(card);
      uniqueCards.add(card.uniqueId);
    }
    
    // Verifica che non ci siano duplicati
    expect(uniqueCards.size).toBe(drawnCards.length);
    
    // Verifica che tutte le carte siano state utilizzate
    expect(gameProvider.availableCards.length).toBe(0);
  });
  
  test('Il reset delle carte funziona correttamente', () => {
    // Usa alcune carte
    gameProvider.drawCard();
    gameProvider.drawCard();
    gameProvider.drawCard();
    
    // Verifica che alcune carte siano state usate
    expect(gameProvider.usedCardIds.length).toBe(3);
    
    // Resetta le carte usate
    gameProvider.resetUsedCards();
    
    // Verifica che la lista delle carte usate sia vuota
    expect(gameProvider.usedCardIds.length).toBe(0);
    
    // Verifica che tutte le carte siano di nuovo disponibili
    expect(gameProvider.availableCards.length).toBe(gameProvider.allTabooCards.length);
  });
  
  test('Simulazione di una partita con 730 carte estratte consecutivamente senza duplicati', () => {
    const totalCardsToTest = 730;
    const uniqueCards = new Set();
    const drawnCards = [];
    let resetCount = 0;
    
    // Estrae 730 carte, resettando quando necessario
    for (let i = 0; i < totalCardsToTest; i++) {
      // Se non ci sono più carte disponibili, resettiamo
      if (gameProvider.availableCards.length === 0) {
        gameProvider.resetUsedCards();
        resetCount++;
        console.log(`Reset #${resetCount} effettuato dopo ${i} carte estratte`);
      }
      
      const card = gameProvider.drawCard();
      if (!card) {
        fail("Non è stato possibile estrarre una carta anche dopo il reset");
      }
      
      drawnCards.push({
        uniqueId: card.uniqueId,
        word: card.word,
        extractionOrder: i + 1
      });
      
      // In questo test, consideriamo come "duplicato" solo se la stessa carta appare
      // due volte senza un reset nel mezzo
      if (resetCount === 0) {
        // Prima del primo reset, verifichiamo che non ci siano duplicati
        uniqueCards.add(card.uniqueId);
        expect(uniqueCards.size).toBe(drawnCards.length);
      }
    }
    
    console.log(`Completata estrazione di ${totalCardsToTest} carte con ${resetCount} reset`);
    
    // Analisi dei dati estratti
    const wordFrequency: Record<string, number> = {};
    for (const card of drawnCards) {
      if (!wordFrequency[card.word]) {
        wordFrequency[card.word] = 0;
      }
      wordFrequency[card.word]++;
    }
    
    // Verifico che dopo ogni reset non vengano mostrate subito le stesse carte
    // del ciclo precedente (verifico che il mescolamento sia effettivo)
    const cardsByReset: Record<number, string[]> = {};
    let currentReset = 0;
    let currentPosition = 0;
    
    // Organizzo le carte per ciclo di reset
    for (const card of drawnCards) {
      if (gameProvider.allTabooCards.length === currentPosition) {
        currentReset++;
        currentPosition = 0;
      }
      
      if (!cardsByReset[currentReset]) {
        cardsByReset[currentReset] = [];
      }
      
      cardsByReset[currentReset].push(card.uniqueId);
      currentPosition++;
    }
    
    // Confronto i primi 10 elementi di ogni ciclo per verificare che non siano uguali
    // tra cicli consecutivi
    if (Object.keys(cardsByReset).length > 1) {
      for (let i = 1; i < Object.keys(cardsByReset).length; i++) {
        const previousCycle = cardsByReset[i-1].slice(0, 10);
        const currentCycle = cardsByReset[i].slice(0, 10);
        
        // Verifico che almeno il 50% delle prime 10 carte siano diverse
        // (è improbabile che siano tutte diverse a causa della casualità)
        let differences = 0;
        for (let j = 0; j < 10; j++) {
          if (previousCycle[j] !== currentCycle[j]) {
            differences++;
          }
        }
        
        expect(differences).toBeGreaterThanOrEqual(5);
      }
    }
    
    // Verifica che nel primo ciclo (prima del reset) non ci siano duplicati
    const firstCycleCards = drawnCards.slice(0, gameProvider.allTabooCards.length);
    const firstCycleUniqueIds = new Set(firstCycleCards.map(card => card.uniqueId));
    expect(firstCycleUniqueIds.size).toBe(firstCycleCards.length);
  });
}); 