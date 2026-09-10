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
