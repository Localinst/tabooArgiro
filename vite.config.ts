import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        en: './en/index.html'
      },
      output: {
        manualChunks: undefined,
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    {
      name: 'generate-static-pages',
      closeBundle: async () => {
        // Solo in modalità produzione
        if (mode !== 'production') return;
        
        // Percorsi e titoli delle pagine
        const pages = [
          { 
            path: 'rules', 
            title: 'Regole del Gioco Taboo | Parole Taboo', 
            description: 'Scopri le regole ufficiali del gioco di società online Parole Taboo. Impara a giocare, a fare punti e a vincere!' 
          },
          {
            path: 'en/rules',
            title: 'Taboo Rules — Play Taboo Online | Taboo Words',
            description: 'Learn the official rules of the Taboo party game. Discover how to play Taboo online, score points and win!'
          },
          // Aggiungi altre pagine qui se necessario
        ];
        
        // Try to locate the generated index.html in the dist folder (support root and /en)
        const candidates = [
          path.resolve(process.cwd(), 'dist', 'index.html'),
          path.resolve(process.cwd(), 'dist', 'en', 'index.html')
        ];

        const indexPath = candidates.find(p => fs.existsSync(p));

        if (!indexPath) {
          console.warn('[generate-static-pages] index.html not found in dist. Skipping static page generation.');
          return;
        }

        // Leggi il contenuto di index.html
        const indexHtml = fs.readFileSync(indexPath, 'utf-8');
        
        // Per ogni pagina definita
        const seoContentMap: Record<string, string> = {
          'rules': `
    <div class="seo-content">
      <h1>Taboo Online: Gioco di Società Gratis</h1>
      <p>🎮 Scopri il divertimento del classico gioco Taboo online! La nostra versione digitale del Taboo è completamente gratuita (taboo gratis!) e non richiede registrazione. Gioca con le carte Taboo online, perfetto per feste, serate tra amici e come party game. Migliora le tue serate con questo fantastico gioco di società online!</p>
      
      <h2>Come si Gioca a Taboo Online</h2>
      <p>Il gioco Taboo è un classico gioco di società semplice e intuitivo: dovrai far indovinare una parola chiave al tuo team evitando di utilizzare le 'parole Taboo' (quelle proibite) indicate sulla carta. Più parole Taboo indovinerai, più punti accumulerai! È il party game perfetto.</p>
      
      <h2>Caratteristiche Principali del Gioco Taboo Online</h2>
      <ul>
        <li>Interfaccia Taboo intuitiva e responsive per giocare ovunque</li>
        <li>Moltissime carte Taboo sempre aggiornate</li>
        <li>Modalità Taboo multiplayer per giocare in gruppo</li>
        <li>Timer Taboo personalizzabile per ogni partita</li>
        <li>Taboo online completamente gratuito e senza registrazione (Taboo Gratis!)</li>
        <li>Perfetto come party game Taboo e gioco per feste</li>
        <li>Ideale per giocare a Taboo da tavolo online</li>
        <li>Gioco Taboo aggiornato con nuove parole Taboo</li>
      </ul>

      <h2>Perché Scegliere il Nostro Taboo Gratis</h2>
      <p>Il nostro gioco Taboo online è stato progettato per offrirti la migliore esperienza del classico gioco di società. Con un'interfaccia Taboo user-friendly e tante parole Taboo, è il party game ideale. Organizza una festa o una serata tra amici? Il nostro Taboo online gratis è la scelta perfetta per ore di divertimento!</p>

      <h2>FAQ - Domande Frequenti su Taboo Online</h2>
      <ul>
        <li><strong>È necessario registrarsi per giocare a Taboo?</strong> No, il gioco Taboo online è completamente gratuito e non richiede registrazione.</li>
        <li><strong>Quante persone possono giocare a questo gioco di società?</strong> Il gioco Taboo è perfetto per gruppi, ideale da 4 persone in su.</li>
        <li><strong>Taboo è disponibile su mobile?</strong> Sì, il Taboo online è completamente responsive e funziona su tutti i dispositivi.</li>
        <li><strong>Come si vince a Taboo?</strong> Vince il team che accumula più punti indovinando le parole Taboo senza usare i termini proibiti.</li>
      </ul>
    </div>
          `,
          'en/rules': `
    <div class="seo-content">
      <h1>Taboo Online: Free Party Game</h1>
      <p>🎮 Discover the fun of the classic Taboo game online! Our digital version of Taboo is completely free and requires no registration. Play with Taboo cards online—perfect for parties, evenings with friends and as a party game. Make your gatherings more fun with this fantastic online board game!</p>
      
      <h2>How to Play Taboo Online</h2>
      <p>The Taboo game is a classic, simple and intuitive party game: you must make your team guess a keyword while avoiding the 'Taboo words' (the forbidden words) shown on the card. The more Taboo words you guess, the more points you earn! It's the perfect party game.</p>
      
      <h2>Main Features of Taboo Online</h2>
      <ul>
        <li>Intuitive and responsive Taboo interface to play anywhere</li>
        <li>Plenty of Taboo cards constantly updated</li>
        <li>Multiplayer Taboo mode to play in groups</li>
        <li>Customizable Taboo timer for each match</li>
        <li>Taboo online completely free and without registration</li>
        <li>Perfect as a Taboo party game and for social gatherings</li>
        <li>Great for playing Taboo board game online</li>
        <li>Taboo game updated with new Taboo words</li>
      </ul>

      <h2>Why Choose Our Free Taboo</h2>
      <p>Our Taboo online game is designed to give you the best experience of the classic board game. With a user-friendly Taboo interface and many Taboo words, it's the ideal party game. Organizing a party or a night with friends? Our free Taboo online is the perfect choice for hours of fun!</p>

      <h2>FAQ - Frequently Asked Questions about Taboo Online</h2>
      <ul>
        <li><strong>Do I need to register to play Taboo?</strong> No, Taboo online is completely free and does not require registration.</li>
        <li><strong>How many people can play this board game?</strong> Taboo is perfect for groups, ideally 4 people and up.</li>
        <li><strong>Is Taboo available on mobile?</strong> Yes, Taboo online is fully responsive and works on all devices.</li>
        <li><strong>How do you win Taboo?</strong> The team that scores the most points by guessing the Taboo words without using the forbidden terms wins.</li>
      </ul>
    </div>
          `
        };

        for (const page of pages) {
          // Crea la directory se non esiste
          const dirPath = `./dist/${page.path}`;
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
          
          // Sostituisci i meta tag con quelli specifici della pagina
          let pageHtml = indexHtml;
          
          // Sostituisci il tag canonical
          pageHtml = pageHtml.replace(
            /<link rel="canonical"[^>]*>/,
            `<link rel="canonical" href="https://paroletaboo.it/${page.path}" />`
          );
          
          // Sostituisci il titolo
          if (page.title) {
            pageHtml = pageHtml.replace(
              /<title>.*?<\/title>/,
              `<title>${page.title}<\/title>`
            );
          }
          
          // Sostituisci la descrizione
          if (page.description) {
            pageHtml = pageHtml.replace(
              /<meta name="description"[^>]*>/,
              `<meta name="description" content="${page.description}" />`
            );
          }

          // Inserisci o sostituisci il blocco .seo-content se previsto per la pagina
          const seoHtml = seoContentMap[page.path];
          if (seoHtml) {
            if (/<div class="seo-content">[\s\S]*?<\/div>/.test(pageHtml)) {
              pageHtml = pageHtml.replace(/<div class=\"seo-content\">[\s\S]*?<\/div>/, seoHtml);
            } else {
              pageHtml = pageHtml.replace('</body>', `${seoHtml}\n</body>`);
            }
          }
          
          // Scrivi il file index.html nella directory della pagina
          fs.writeFileSync(`${dirPath}/index.html`, pageHtml);
          console.log(`Pagina statica generata: ${page.path}/index.html`);
        }
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
