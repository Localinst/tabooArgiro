// Script per convertire il file CSV in un file TypeScript
// Installare prima le dipendenze: npm install csv-parse fs path
// Eseguire con: node scripts/csv-to-ts.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

// Ottieni il percorso corrente in ambiente ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Percorsi dei file
const csvFilePath = path.resolve(__dirname, '../src/data/dataen.csv');
const outputPath = path.resolve(__dirname, '../src/data/taboo_words_en.ts');

try {
  // Leggi il file CSV
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
  
  // Validazione preliminare delle righe
  const lines = csvContent.split('\n').map(line => line.trim()).filter(Boolean);
  const expectedColumns = 7; // id + parola_target + 5 parole vietate
  
  // Verifica ogni riga prima del parsing
  lines.forEach((line, index) => {
    const columns = line.split(',').length;
    if (columns !== expectedColumns && index > 0) { // Skip header row
      console.warn(`Warning: Line ${index + 1} has ${columns} columns instead of ${expectedColumns}:`);
      console.warn(line);
    }
  });

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relaxColumnCount: true, // Permette un numero variabile di colonne
    on_record: (record, { lines }) => {
      // Assicurati che ci siano tutti i campi necessari
      return {
        id: record.id || '',
        parola_target: record.parola_target || '',
        parola_vietata1: record.parola_vietata1 || '',
        parola_vietata2: record.parola_vietata2 || '',
        parola_vietata3: record.parola_vietata3 || '',
        parola_vietata4: record.parola_vietata4 || '',
        parola_vietata5: record.parola_vietata5 || ''
      };
    }
  });

  // Trasforma i dati nel formato appropriato
  const tabooCards = records
    .filter(record => record.parola_target && record.id) // Ignora righe senza parola target o id
    .map((record, index) => {
      const card = {
        id: parseInt(record.id, 10) || index + 1,
        word: record.parola_target,
        tabooWords: [
          record.parola_vietata1,
          record.parola_vietata2,
          record.parola_vietata3,
          record.parola_vietata4,
          record.parola_vietata5
        ].filter(Boolean) // Rimuove eventuali valori vuoti
      };

      // Avvisa se ci sono meno di 3 parole taboo
      if (card.tabooWords.length < 3) {
        console.warn(`Warning: Card "${card.word}" (ID: ${card.id}) has only ${card.tabooWords.length} taboo words`);
      }

      return card;
    });

  // Genera il contenuto del file TypeScript
  const tsContent = `import { TabooCard } from './words';

// File generato automaticamente da data.csv
// Non modificare manualmente
export const tabooCards: TabooCard[] = ${JSON.stringify(tabooCards, null, 2)};
`;

  // Scrivi il file TypeScript
  fs.writeFileSync(outputPath, tsContent);
  console.log(`File generato con successo: ${outputPath}`);
  console.log(`Numero di carte generate: ${tabooCards.length}`);

} catch (error) {
  console.error('Errore durante la conversione:', error);
  process.exit(1);
} 