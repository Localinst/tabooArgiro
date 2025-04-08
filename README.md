# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9e001ec8-e33e-412a-a5b5-92e593dd6bfc

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9e001ec8-e33e-412a-a5b5-92e593dd6bfc) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9e001ec8-e33e-412a-a5b5-92e593dd6bfc) and click on Share -> Publish.

### Deploy su Netlify

Questo progetto è configurato per essere facilmente deployato su Netlify. Per procedere:

1. Crea un account su [Netlify](https://www.netlify.com/) se non ne hai già uno
2. Collega il tuo repository GitHub a Netlify
3. Configura le impostazioni di deploy:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Netlify riconoscerà automaticamente il file `netlify.toml` e applicherà le configurazioni necessarie
5. Le tue route React Router funzioneranno correttamente grazie ai file `_redirects` e alle regole di reindirizzamento configurate

Per deployare manualmente tramite CLI di Netlify:
```sh
# Installa la CLI di Netlify
npm install -g netlify-cli

# Effettua il login
netlify login

# Inizializza un nuovo sito
netlify init

# Esegui il deploy
netlify deploy --prod
```

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Testing della logica del gioco

Per verificare che la logica del mescolamento e della selezione delle carte funzioni correttamente, è disponibile una suite di test.

### Installazione delle dipendenze per i test

Prima di eseguire i test, è necessario installare Jest e ts-jest:

```bash
npm install --save-dev jest ts-jest @types/jest
```

### Esecuzione dei test

Per eseguire i test, utilizzare il comando:

```bash
npm test
```

Questo eseguirà i test che verificano:
- La corretta combinazione delle carte con ID univoci
- Il mescolamento casuale delle carte
- La rimozione delle carte usate dal mazzo disponibile
- L'assenza di duplicati nelle carte mostrate durante una partita
- Il corretto funzionamento del reset delle carte
