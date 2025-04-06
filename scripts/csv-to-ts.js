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
const csvFilePath = path.resolve(__dirname, '../src/data/data.csv');
const outputPath = path.resolve(__dirname, '../src/data/taboo_words.ts');

try {
  // Leggi il file CSV
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });

  // Trasforma i dati nel formato appropriato
  const tabooCards = records.map((record, index) => ({
    id: parseInt(record.id, 10) || index + 1,
    word: record.parola_target,
    tabooWords: [
      record.parola_vietata1,
      record.parola_vietata2,
      record.parola_vietata3,
      record.parola_vietata4,
      record.parola_vietata5
    ].filter(Boolean) // Rimuove eventuali valori vuoti
  }));

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