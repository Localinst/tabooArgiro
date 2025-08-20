import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

type LangConfig = {
  title: string;
  description: string;
};

type PageConfig = {
  path: string;
  langs: {
    [key: string]: LangConfig;
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        en: path.resolve(__dirname, 'public/en/index.html')
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

        // Leggi il contenuto di index.html principale buildato
        const mainIndexHtml = fs.readFileSync('./dist/index.html', 'utf-8');
        
        // Estrai i percorsi degli asset dal file principale
        const scriptMatch = mainIndexHtml.match(/<script[^>]+src="([^"]+)"/);
        const styleMatch = mainIndexHtml.match(/<link[^>]+href="([^"]+)"[^>]*rel="stylesheet"/);
        
        const mainScript = scriptMatch ? scriptMatch[1] : '';
        const mainStyle = styleMatch ? styleMatch[1] : '';

        // Definisci le pagine e le loro traduzioni
        const pages = [
          {
            path: 'rules',
            langs: {
              it: {
                title: 'Regole del Gioco Taboo | Parole Taboo',
                description: 'Scopri le regole ufficiali del gioco di società online Parole Taboo. Impara a giocare, a fare punti e a vincere!'
              },
              en: {
                title: 'Taboo Game Rules | Taboo Words',
                description: 'Discover the official rules of the online party game Taboo Words. Learn how to play, score points and win!'
              }
            }
          }
        ];

        // Genera le versioni linguistiche
        const langs = ['it', 'en'];
        for (const lang of langs) {
          // Crea directory per la lingua se necessario
          if (lang !== 'it') {
            fs.mkdirSync(`./dist/${lang}`, { recursive: true });
          }

          // Leggi il template HTML per questa lingua
          const templatePath = lang === 'it' ? './public/index.html' : `./public/${lang}/index.html`;
          let langIndexHtml = fs.readFileSync(templatePath, 'utf-8');

          // Aggiorna i percorsi degli asset
          langIndexHtml = langIndexHtml.replace(
            /src="\/src\/main.tsx"/,
            `src="${mainScript}"`
          );
          
          if (mainStyle) {
            langIndexHtml = langIndexHtml.replace(
              /<\/head>/,
              `  <link rel="stylesheet" href="${mainStyle}">\n</head>`
            );
          }

          // Scrivi il file index.html per questa lingua
          const targetPath = lang === 'it' ? './dist/index.html' : `./dist/${lang}/index.html`;
          fs.writeFileSync(targetPath, langIndexHtml);

          // Genera le pagine statiche per questa lingua
          for (const page of pages) {
            const dirPath = lang === 'it' ? `./dist/${page.path}` : `./dist/${lang}/${page.path}`;
            fs.mkdirSync(dirPath, { recursive: true });

            let pageHtml = langIndexHtml;
            const langData = page.langs[lang as 'it' | 'en'];

            // Aggiorna i meta tag
            pageHtml = pageHtml.replace(
              /<link rel="canonical"[^>]*>/,
              `<link rel="canonical" href="https://paroletaboo.it/${lang !== 'it' ? lang + '/' : ''}${page.path}" />`
            );

            pageHtml = pageHtml.replace(
              /<title>.*?<\/title>/,
              `<title>${langData.title}</title>`
            );

            pageHtml = pageHtml.replace(
              /<meta name="description"[^>]*>/,
              `<meta name="description" content="${langData.description}" />`
            );

            fs.writeFileSync(`${dirPath}/index.html`, pageHtml);
            console.log(`Pagina statica generata: ${lang !== 'it' ? lang + '/' : ''}${page.path}/index.html`);
          }          }
        }
      }
    
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
}));
