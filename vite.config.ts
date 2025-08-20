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
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    {
      name: 'generate-static-pages',
      closeBundle: async () => {
        // Solo in modalità produzione
        if (mode !== 'production') return;
        
        // Copia gli index.html specifici per lingua
        const languages = ['', 'en'];
        for (const lang of languages) {
          const sourcePath = `./public${lang ? `/${lang}` : ''}/index.html`;
          const targetPath = `./dist${lang ? `/${lang}` : ''}/index.html`;
          
          // Crea la directory se non esiste
          if (lang) {
            fs.mkdirSync(`./dist/${lang}`, { recursive: true });
          }
          
          // Copia il file index.html specifico per la lingua
          if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`Copiato ${sourcePath} in ${targetPath}`);
          }
        }
        
        // Percorsi e titoli delle pagine multilingua
        const pages = [
          { 
            path: 'rules', 
            title: {
              it: 'Regole del Gioco Taboo | Parole Taboo',
              en: 'Taboo Game Rules | Taboo Words'
            },
            description: {
              it: 'Scopri le regole ufficiali del gioco di società online Parole Taboo. Impara a giocare, a fare punti e a vincere!',
              en: 'Discover the official rules of the online party game Taboo Words. Learn how to play, score points and win!'
            }
          }
          // Aggiungi altre pagine qui se necessario
        ];
        
        // Per ogni lingua e pagina definita
        for (const lang of languages) {
          const baseLang = lang || 'it';
          const baseUrl = `https://paroletaboo.it${lang ? `/${lang}` : ''}`;
          
          // Leggi il contenuto di index.html della lingua corrente
          const indexHtml = fs.readFileSync(`./dist${lang ? `/${lang}` : ''}/index.html`, 'utf-8');
          
          // Per ogni pagina definita
          for (const page of pages) {
            // Crea la directory se non esiste
            const dirPath = `./dist${lang ? `/${lang}` : ''}/${page.path}`;
            fs.mkdirSync(dirPath, { recursive: true });
            
            // Sostituisci i meta tag con quelli specifici della pagina
            let pageHtml = indexHtml;
            
            // Sostituisci il tag canonical
            pageHtml = pageHtml.replace(
              /<link rel="canonical"[^>]*>/,
              `<link rel="canonical" href="${baseUrl}/${page.path}" />`
            );
            
            // Sostituisci il titolo
            if (page.title[baseLang]) {
              pageHtml = pageHtml.replace(
                /<title>.*?<\/title>/,
                `<title>${page.title[baseLang]}</title>`
              );
            }
            
            // Sostituisci la descrizione
            if (page.description[baseLang]) {
              pageHtml = pageHtml.replace(
                /<meta name="description"[^>]*>/,
                `<meta name="description" content="${page.description[baseLang]}" />`
              );
            }
            
            // Scrivi il file index.html nella directory della pagina
            fs.writeFileSync(`${dirPath}/index.html`, pageHtml);
            console.log(`Pagina statica generata: ${lang ? `${lang}/` : ''}${page.path}/index.html`);
          }
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
