import random
import nltk
from nltk.util import ngrams
from collections import defaultdict, Counter
import string

try:
    nltk.data.find('corpora/words')
except LookupError:
    nltk.download('words')

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

class ParolaInventata:
    def __init__(self):
        self._inizializza_modello_markov()
    
    def _inizializza_modello_markov(self):
        """Inizializza un modello Markov per generare descrizioni."""
        # Frasi di esempio in italiano per addestrare il modello
        frasi_esempio = [
            "Un oggetto antico utilizzato nelle cerimonie tradizionali.",
            "Un concetto filosofico che rappresenta la dualità della natura umana.",
            "Una tecnica artistica che combina diversi materiali naturali.",
            "Un fenomeno atmosferico tipico delle regioni montuose.",
            "Una pianta medicinale con proprietà curative straordinarie.",
            "Un rituale antico praticato nelle comunità rurali italiane.",
            "Un metodo tradizionale per la preparazione di cibi fermentati.",
            "Un tipo di strumento musicale a corde utilizzato nel folklore.",
            "Un termine che descrive un particolare stato emotivo profondo.",
            "Un artefatto archeologico risalente all'epoca pre-romana.",
            "Una forma di espressione artistica che unisce poesia e danza.",
            "Un tipo di pietra preziosa con proprietà energetiche uniche.",
            "Una bevanda tradizionale preparata con erbe aromatiche locali.",
            "Un abito cerimoniale indossato durante celebrazioni religiose.",
            "Un metodo di conservazione degli alimenti tipico del mediterraneo.",
            "Una danza popolare eseguita durante le feste di paese.",
            "Un attrezzo agricolo utilizzato per la raccolta delle olive.",
            "Una sostanza aromatica estratta da piante selvatiche.",
            "Un simbolo di buon auspicio nelle tradizioni familiari.",
            "Una tecnica antica di lavorazione del legno.",
            "Un minerale raro con proprietà riflettenti insolite.",
            "Un tipo di architettura tradizionale delle zone costiere.",
            "Una corrente filosofica che esplora il rapporto uomo-natura.",
            "Una ricetta segreta tramandata per generazioni.",
            "Un gioco di strategia praticato nei villaggi di montagna.",
            "Una teoria scientifica che spiega fenomeni naturali complessi.",
            "Un antico sistema di misurazione basato sui cicli lunari.",
            "Una pratica meditativa per raggiungere l'equilibrio interiore.",
            "Un mestiere artigianale legato alla lavorazione dei metalli.",
            "Un fenomeno ottico visibile solo in determinate condizioni atmosferiche."
        ]
        
        # Costruiamo un modello Markov per generare testo
        self.modello = defaultdict(Counter)
        
        for frase in frasi_esempio:
            # Tokenizzazione e preparazione n-grammi
            tokens = ['<START>'] + nltk.word_tokenize(frase.lower()) + ['<END>']
            for i in range(len(tokens) - 2):
                self.modello[tokens[i], tokens[i+1]][tokens[i+2]] += 1
    
    def _train_word_model(self):
        """Addestra un modello per generare sequenze di caratteri plausibili."""
        # Parole italiane comuni per addestrare il modello
        parole_italiane = [
            "tempo", "casa", "amore", "giorno", "vita", "mondo", "mano", "occhio",
            "cuore", "acqua", "terra", "cielo", "fuoco", "aria", "sole", "luna",
            "stella", "albero", "fiore", "foglia", "frutto", "seme", "radice",
            "ramo", "tronco", "erba", "pietra", "roccia", "montagna", "collina",
            "valle", "fiume", "lago", "mare", "oceano", "onda", "pioggia", "neve",
            "ghiaccio", "vento", "tempesta", "nuvola", "fulmine", "tuono", "arcobaleno"
        ]
        
        # Creiamo un modello Markov per generare parole
        self.char_model = defaultdict(Counter)
        
        for parola in parole_italiane:
            # Aggiungiamo marker di inizio e fine
            padded = '^' + parola.lower() + '$'
            for i in range(len(padded) - 2):
                self.char_model[padded[i], padded[i+1]][padded[i+2]] += 1
    
    def genera_parola(self):
        """Genera una parola inventata ma plausibile."""
        # Inizializziamo il modello dei caratteri se non esiste ancora
        if not hasattr(self, 'char_model'):
            self._train_word_model()
        
        current = ('^', random.choice(string.ascii_lowercase))
        parola = [current[1]]
        
        # Generiamo carattere per carattere
        for _ in range(random.randint(3, 8)):
            # Se non ci sono successori o raggiungiamo la fine
            if current not in self.char_model or '$' in self.char_model[current]:
                break
                
            # Scegliamo il prossimo carattere in base alle probabilità
            choices = self.char_model[current].items()
            total = sum(count for char, count in choices)
            r = random.randint(1, total)
            for char, count in choices:
                r -= count
                if r <= 0:
                    if char == '$':  # Fine della parola
                        break
                    parola.append(char)
                    current = (current[1], char)
                    break
        
        # Assicuriamoci che la parola finisca con una vocale (comune in italiano)
        if parola[-1] not in 'aeiou' and random.random() < 0.7:
            parola.append(random.choice(['a', 'e', 'i', 'o']))
        
        return ''.join(parola).capitalize()
    
    def genera_descrizioni(self, parola, num_descrizioni=5):
        """Genera descrizioni per la parola inventata usando il modello Markov."""
        descrizioni = []
        
        # Categorie semantiche per le descrizioni
        categorie = [
            "oggetto", "concetto", "azione", "luogo", "professione",
            "cibo", "pianta", "animale", "sentimento", "evento",
            "tradizione", "strumento", "processo", "sostanza", "fenomeno"
        ]
        
        # Aggettivi per arricchire le descrizioni
        aggettivi = [
            "antico", "raro", "comune", "prezioso", "moderno", "tradizionale",
            "unico", "particolare", "speciale", "insolito", "curioso", 
            "affascinante", "misterioso", "innovativo", "esotico", "tipico"
        ]
        
        # Contesti per le descrizioni
        contesti = [
            "nella cultura mediterranea", "in filosofia", "in letteratura",
            "in ambito scientifico", "nella tradizione popolare",
            "nel linguaggio comune", "in cucina", "nelle arti"
        ]
        
        # Generiamo alcune descrizioni usando il modello Markov
        for _ in range(2):
            if random.random() < 0.7 and hasattr(self, 'modello'):
                current = ('<START>', random.choice(list(word for (prev, word), counts in self.modello.items() if prev == '<START>')))
                descrizione = [current[1]]
                
                # Generiamo parola per parola
                for _ in range(random.randint(5, 12)):
                    if current not in self.modello or '<END>' in [word for word in self.modello[current].keys()]:
                        break
                        
                    choices = self.modello[current].items()
                    total = sum(count for word, count in choices)
                    r = random.randint(1, total)
                    for word, count in choices:
                        r -= count
                        if r <= 0:
                            if word == '<END>':  # Fine della frase
                                break
                            descrizione.append(word)
                            current = (current[1], word)
                            break
                
                desc = ' '.join(descrizione).capitalize()
                if desc[-1] not in '.!?':
                    desc += '.'
                
                descrizioni.append(desc)
        
        # Generiamo le rimanenti descrizioni con modelli di frasi
        modelli_frasi = [
            "Un tipo di {categoria} {aggettivo} utilizzato {contesto}.",
            "Si riferisce a {articolo} {categoria} {aggettivo} che si trova {contesto}.",
            "{articolo_cap} {categoria} {aggettivo} che rappresenta il concetto di unicità {contesto}.",
            "Termine che descrive {articolo} {categoria} {aggettivo} {contesto}.",
            "Un {aggettivo} esempio di {categoria} che simboleggia la tradizione {contesto}."
        ]
        
        while len(descrizioni) < num_descrizioni:
            categoria = random.choice(categorie)
            aggettivo = random.choice(aggettivi)
            contesto = random.choice(contesti)
            
            # Determiniamo l'articolo appropriato
            articolo = "un" if categoria[0] not in "aeiou" else "un'"
            articolo_cap = articolo.capitalize()
            
            # Creiamo la frase usando un modello
            frase = random.choice(modelli_frasi).format(
                categoria=categoria,
                aggettivo=aggettivo,
                contesto=contesto,
                articolo=articolo,
                articolo_cap=articolo_cap
            )
            
            descrizioni.append(frase)
        
        return descrizioni[:num_descrizioni]
    
    def genera_parola_e_descrizioni(self):
        """Genera una parola inventata e le sue descrizioni."""
        parola = self.genera_parola()
        descrizioni = self.genera_descrizioni(parola)
        return parola, descrizioni

def main():
    print("Inizializzazione del generatore di parole inventate...")
    generatore = ParolaInventata()
    
    print("\nGenerazione di una parola inventata e delle sue descrizioni...\n")
    parola, descrizioni = generatore.genera_parola_e_descrizioni()
    
    print(f"Parola inventata: {parola}")
    print("\nPossibili descrizioni:")
    
    for i, descrizione in enumerate(descrizioni, 1):
        print(f"{i}. {descrizione}")

if __name__ == "__main__":
    main() 