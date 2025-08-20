import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
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
          // Aggiungi altre pagine qui se necessario
        ];
        
        // Leggi il contenuto di index.html
        const indexHtml = fs.readFileSync('./dist/index.html', 'utf-8');
        
        // Per ogni pagina definita
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
              `<title>${page.title}</title>`
            );
          }
          
          // Sostituisci la descrizione
          if (page.description) {
            pageHtml = pageHtml.replace(
              /<meta name="description"[^>]*>/,
              `<meta name="description" content="${page.description}" />`
            );
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
