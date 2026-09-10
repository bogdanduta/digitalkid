# DigitalKid Continente

DigitalKid Continente is a React/Vite learning page for 3-year-old kids. It shows a bright simplified world map where each continent is clickable. When a child selects a continent, the shape gently pops and the Romanian continent name is played.

## Run Locally

```bash
npm install
npm run dev
```

The development server usually starts at `http://localhost:5173/`.

## Build

```bash
npm run build
```

## Deploy To Azure Static Web Apps

The app is hosted in Azure Static Web Apps on the Free plan. The current deployment uses the `rg-digitalkid` resource group and the `digitalkid-web-bogdan` app.

### Prerequisites

- Azure CLI installed and authenticated with `az login`.
- Node.js and npm installed.
- An Azure subscription with permission to create resources.

### First-Time Setup

```powershell
az login
az account set --subscription "Visual Studio Professional Subscription"
az group create --name rg-digitalkid --location westeurope
az staticwebapp create --name digitalkid-web-bogdan --resource-group rg-digitalkid --location westeurope --sku Free
```

The resource group may already exist. In that case, skip `az group create`. Choose the existing Free plan when creating or configuring the Static Web App; do not create a paid App Service plan for this static Vite site.

### Publish A Build

```powershell
npm install
npm run build
$token = az staticwebapp secrets list --name digitalkid-web-bogdan --resource-group rg-digitalkid --query properties.apiKey --output tsv
npx --yes @azure/static-web-apps-cli deploy .\dist --deployment-token $token --env production
```

The deployment URL is shown by the final command. Verify it with a browser or:

```powershell
Invoke-WebRequest https://<your-static-app-hostname> -UseBasicParsing
```

The deployment CLI can leave a temporary `*-app.zip` file in the project root. Delete that generated file before restarting Vite if the local server reports `EBUSY` while watching files:

```powershell
Get-ChildItem -File -Filter '*-app.zip' | Remove-Item -Force
```

Never commit deployment tokens or Azure credentials. Keep the token in a local shell variable only.

## Audio Files

The app looks for pre-generated Romanian audio files in `public/audio/continents/`:

- `africa.mp3`
- `europa.mp3`
- `asia.mp3`
- `america-de-nord.mp3`
- `america-de-sud.mp3`
- `australia.mp3`
- `antarctica.mp3`

If an MP3 is missing or cannot play, the browser uses `SpeechSynthesisUtterance` with `ro-RO` as a fallback.

## Azure AI Speech Asset Generation

Use Azure AI Speech from Azure AI Foundry to generate the MP3 files before publishing. Keep keys in local environment variables or Azure secret storage; do not commit `.env` files or keys.

Suggested Romanian phrases:

- `Africa`
- `Europa`
- `Asia`
- `America de Nord`
- `America de Sud`
- `Australia`
- `Antarctica`

For a toddler audience, use a warm Romanian voice, a slower speaking rate, and short clips with no background music.

## Git And GitHub

Initialize and commit locally:

```bash
git init
git add .
git commit -m "Initial DigitalKid continent map"
```

Connect to GitHub after creating an empty repository:

```bash
git branch -M main
git remote add origin https://github.com/<your-user-or-org>/DigitalKid.git
git push -u origin main
```

## Project Structure

- `src/App.tsx` wires the selected continent state and audio playback.
- `src/components/WorldMap.tsx` renders the accessible clickable SVG map.
- `src/data/continents.ts` contains Romanian names, colors, and audio paths.
- `src/lib/audio.ts` handles MP3 playback and Romanian browser speech fallback.
- `src/App.css` and `src/index.css` contain the responsive visual design.
