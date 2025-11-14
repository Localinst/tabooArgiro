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
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'en') return 'en/[name].[hash].js';
          return '[name].[hash].js';
        },
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  },
  plugins: [
    react(),
  
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
            title: 'Taboo Rules - Play Taboo Online | Taboo Words',
            description: 'Learn the official rules of the Taboo party game. Discover how to play Taboo online, score points and win!'
          },
          {
            path: 'tr/rules',
            title: 'Taboo Oyunu Kuralları - Taboo Oyununu Çevrimiçi Oyna',
            description: 'Taboo parti oyununun resmi kurallarını öğrenin. Taboo oyununu çevrimiçi nasıl oynanacağını, nasıl puan kazanacağınızı ve nasıl kazanacağınızı keşfedin!'
          },
          // Aggiungi altre pagine qui se necessario
        ];
        
        // Try to locate the generated index.html in the dist folder (support root and /en)
        const candidates = [
          path.resolve(process.cwd(), 'dist', 'index.html'),
          path.resolve(process.cwd(), 'dist', 'en', 'index.html'),
          path.resolve(process.cwd(), 'dist', 'tr', 'index.html')
        ];

        const indexPath = candidates.find(p => fs.existsSync(p));

        if (!indexPath) {
          console.warn('[generate-static-pages] index.html not found in dist. Skipping static page generation.');
          return;
        }

        // Leggi il contenuto di index.html
        const indexHtml = fs.readFileSync(indexPath, 'utf-8');
        
        // Funzione per ottenere il file source corretto in base alla lingua
        const getSourceHtmlForPage = (pagePath: string) => {
          if (pagePath.startsWith('en')) {
            const enPath = path.resolve(process.cwd(), 'dist', 'en', 'index.html');
            if (fs.existsSync(enPath)) return fs.readFileSync(enPath, 'utf-8');
          } else if (pagePath.startsWith('tr')) {
            const trPath = path.resolve(process.cwd(), 'dist', 'tr', 'index.html');
            if (fs.existsSync(trPath)) return fs.readFileSync(trPath, 'utf-8');
          }
          return indexHtml;
        };
        
        // Pagine da generare
        const pagesWithSeo = [
          ...pages,
          { path: 'en', title: 'Taboo Online: Free Party Game', description: 'Play Taboo Online free! The fun board game with cards to guess words without saying the Taboo ones. Perfect for parties, friends and evenings. Lots of Taboo words!' },
          { path: 'tr', title: 'Taboo Oyunu Çevrimiçi: Ücretsiz Parti Oyunu', description: 'Taboo oyununu çevrimiçi oyna! Yasak kelimeleri söylemeden kelimeleri tahmin etmek için kartları olan eğlenceli masa oyunu. Partiler, arkadaşlar ve akşamlar için mükemmel.' }
        ];

        // Per ogni pagina definita
        const seoContentMap: Record<string, string> = {
          'en': `
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
          `,
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
          `,
          'tr': `
    <div class="seo-content">
      <h1>Taboo Oyunu Çevrimiçi: Ücretsiz Parti Oyunu</h1>
      <p>🎮 Klasik Taboo oyununun çevrimiçi versiyonunun keyfini keşfedin! Taboo oyunumuzun dijital versiyonu tamamen ücretsizdir ve kayıt gerektirmez. Taboo kartlarıyla çevrimiçi oyna—partiler, arkadaşlarla akşamlar ve bir parti oyunu olarak mükemmel. Bu harika çevrimiçi masa oyunu ile toplantılarınızı daha eğlenceli hale getirin!</p>
      
      <h2>Taboo Oyunu Nasıl Oynanır</h2>
      <p>Taboo oyunu klasik, basit ve sezgisel bir parti oyunudur: takımınızın bir anahtar kelimeyi tahmin etmesini sağlamalısın, kartta gösterilen 'Taboo kelimeleri' (yasak kelimeler) kullanmaktan kaçınmalısın. Ne kadar çok Taboo kelimesini tahmin edersen, o kadar çok puan kazanırsın! Mükemmel bir parti oyunudur.</p>
      
      <h2>Taboo Oyunu Çevrimiçi Ana Özellikleri</h2>
      <ul>
        <li>Sezgisel ve duyarlı Taboo arayüzü her yerde oynamak için</li>
        <li>Sürekli güncellenen çok sayıda Taboo kartı</li>
        <li>Gruplar halinde oynamak için Taboo çoklu oyuncu modu</li>
        <li>Her maç için özelleştirilebilir Taboo zamanlayıcısı</li>
        <li>Taboo çevrimiçi tamamen ücretsiz ve kayıt gerektirmez</li>
        <li>Taboo parti oyunu ve sosyal toplanmalar için mükemmel</li>
        <li>Taboo masa oyununu çevrimiçi oynamak için harika</li>
        <li>Yeni Taboo kelimeleri ile güncellenen Taboo oyunu</li>
      </ul>

      <h2>Neden Ücretsiz Taboo Oyunumuzu Seçmelisin</h2>
      <p>Taboo çevrimiçi oyunumuz, klasik masa oyununun en iyi deneyimini sana sunmak için tasarlanmıştır. Kullanıcı dostu Taboo arayüzü ve birçok Taboo kelimesi ile, bu ideal parti oyunudur. Bir parti düzenliyor musun yoksa arkadaşlarla bir akşam mı? Ücretsiz Taboo çevrimiçi oyunumuz saatlerce eğlence için mükemmel seçimdir!</p>

      <h2>SSS - Taboo Oyunu Çevrimiçi Hakkında Sıkça Sorulan Sorular</h2>
      <ul>
        <li><strong>Taboo oyunu oynamak için kayıt gerekli mi?</strong> Hayır, Taboo çevrimiçi oyunu tamamen ücretsizdir ve kayıt gerektirmez.</li>
        <li><strong>Bu masa oyununa kaç kişi oynayabilir?</strong> Taboo oyunu gruplar için mükemmeldir, ideal olarak 4 kişi ve üstü.</li>
        <li><strong>Taboo mobil cihazda kullanılabilir mi?</strong> Evet, Taboo çevrimiçi tamamen duyarlıdır ve tüm cihazlarda çalışır.</li>
        <li><strong>Taboo oyununu nasıl kazanırsın?</strong> En fazla puan kazanıp, yasak terimleri kullanmadan Taboo kelimelerini tahmin eden takım kazanır.</li>
      </ul>
    </div>
          `,
          'tr/rules': `
    <div class="seo-content">
      <h1>Taboo Oyunu Kuralları - Taboo Oyununu Çevrimiçi Oyna</h1>
      <p>🎮 Taboo parti oyununun resmi kurallarını öğrenin. Taboo oyununu çevrimiçi nasıl oynanacağını, nasıl puan kazanacağınızı ve nasıl kazanacağınızı keşfedin! Taboo oyunu basit ama eğlenceli - takımınızın sözcükleri tahmin etmesine yardımcı olun, ancak yasak kelimeleri kullanmaktan kaçının.</p>
      
      <h2>Temel Taboo Oyunu Kuralları</h2>
      <p>Taboo oyununda amaç, takım arkadaşlarınızın sözcükleri tahmin etmesine yardımcı olmaktır. Ancak her sözcüğün yanında "yasak kelimeler" vardır - bunlar kesinlikle söyleyemezsiniz! Sözcüğü tanımlamak, onu mimik ile göstermek, başka sözcükler söylemek ve daha pek çok stratejik taktik kullanabilirsiniz - sadece yasak kelimeler dışında.</p>
      
      <h2>Taboo Oyununu Oynama Adımları</h2>
      <ul>
        <li><strong>Takımlar Oluşturun:</strong> Oyuncuları iki veya daha fazla takıma bölün (ideal olarak her takımda 2-4 oyuncu)</li>
        <li><strong>Sıra Belirleyin:</strong> Hangi takımın ilk başlayacağına karar verin</li>
        <li><strong>Kart Seçin:</strong> Sıradaki oyuncu Taboo kartını çeker ve süre başlar</li>
        <li><strong>Tanımlayın:</strong> Oyuncu, yasak kelimeleri söylemeden sözcüğü takım arkadaşlarına tanımlamaya çalışır</li>
        <li><strong>Tahmin Edin:</strong> Takım arkadaşları sözcüğü tahmin eder</li>
        <li><strong>Puan Kazanın:</strong> Doğru tahmin = 1 puan. Yasak kelime söylenmişse = 0 puan ve kart atlanır</li>
        <li><strong>Sıra Değişir:</strong> Süre bittiğinde sıra diğer takıma geçer</li>
      </ul>

      <h2>Taboo Oyunu Puanlama Sistemi</h2>
      <ul>
        <li><strong>Doğru Tahmin:</strong> +1 puan</li>
        <li><strong>Yasak Kelime Söyleme:</strong> Kart atlanır, puan yok</li>
        <li><strong>Süresi Biten Sözcük:</strong> Kart atlanır, puanlanmaz</li>
      </ul>

      <h2>Taboo Oyun Modları</h2>
      <ul>
        <li><strong>Tur Modu:</strong> Belirli sayıda tur oyunun sonunda en fazla puana sahip takım kazanır</li>
        <li><strong>Puan Modu:</strong> Belirlenen hedef puana (örn. 50 puan) ilk ulaşan takım kazanır</li>
      </ul>

      <h2>Taboo Oyunu İpuçları ve Stratejisi</h2>
      <ul>
        <li>Sözcüğü tanımlarken çok kısa ve öz olun</li>
        <li>Mimikler ve hareketler çok etkili olabilir</li>
        <li>Sözcüğün yazılı harfleri gösterebilirsiniz (ancak söyleyemezsiniz)</li>
        <li>Benzer sözcüklerden bahsederek ipucu verebilirsiniz</li>
        <li>Oyuncu ve takım işbirliği kazanmanın anahtarıdır</li>
      </ul>

      <h2>Taboo Oyununda Yasak Kurallar</h2>
      <ul>
        <li>Yasak kelimeleri söylemeyin</li>
        <li>Sözcüğü telaffuz ettirmeyin (örn. "Söyle: KA-PI" diye söyletmek)</li>
        <li>Sadece Türkçe değil, başka dillerde de tanımlama yapmak cezalıdır bazı kurallarda</li>
      </ul>

      <h2>SSS - Taboo Oyunu Kuralları Hakkında</h2>
      <ul>
        <li><strong>Taboo oyunu kaç kişi ile oynanabilir?</strong> En az 4 oyuncu ideal (2 takıma 2 kişi), ancak 2 kişi ile de oynanabilir</li>
        <li><strong>Bir tur ne kadar sürer?</strong> Tipik olarak 60 saniye, ancak kuralınız göre değiştirilebilir</li>
        <li><strong>Süresi biterse ne olur?</strong> Kart atlanır ve sıra değişir</li>
        <li><strong>İç içe takımlar oynanabilir mi?</strong> Evet, eğer oyun kurallarınıza göre belirlediyseniz</li>
      </ul>
    </div>
          `
        };

        for (const page of pagesWithSeo) {
          // Crea la directory se non esiste
          const dirPath = `./dist/${page.path}`;
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
          
          // Sostituisci i meta tag con quelli specifici della pagina
          let pageHtml = getSourceHtmlForPage(page.path);
          
          // Determina la lingua della pagina in base al path
          let pageLang = 'it';
          if (page.path.startsWith('en')) {
            pageLang = 'en';
          } else if (page.path.startsWith('tr')) {
            pageLang = 'tr';
          }
          
          // Aggiorna il lang attribute
          pageHtml = pageHtml.replace(
            /<html[^>]*lang="[^"]*"/,
            `<html lang="${pageLang}"`
          );
          
          // Sostituisci il tag canonical - aggiungi slash finale per home pages
          const canonicalUrl = page.path === 'en' || page.path === 'tr' 
            ? `https://paroletaboo.it/${page.path}/`
            : `https://paroletaboo.it/${page.path}`;
          pageHtml = pageHtml.replace(
            /<link rel="canonical"[^>]*>/,
            `<link rel="canonical" href="${canonicalUrl}" />`
          );
          
          // Se è una home page (en o tr), aggiorna l'hreflang self-reference
          if (page.path === 'en' || page.path === 'tr') {
            const correctHreflang = `<link rel="alternate" hreflang="${pageLang}" href="https://paroletaboo.it/${page.path}/" />`;
            pageHtml = pageHtml.replace(
              new RegExp(`<link rel="alternate" hreflang="${pageLang}"[^>]*>`, 'g'),
              correctHreflang
            );
          }
          
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
