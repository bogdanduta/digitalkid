# Continent Audio

Set the Azure Speech credentials in PowerShell and run the generator from the
project root:

```powershell
$env:SPEECH_KEY = 'your-key'
$env:SPEECH_REGION = 'westeurope'
npm run audio:generate
```

Generate the English files with:

```powershell
$env:SPEECH_KEY = 'your-key'
$env:SPEECH_REGION = 'westeurope'
npm run audio:generate:en
```

Generate the Spanish files with:

```powershell
$env:SPEECH_KEY = 'your-key'
$env:SPEECH_REGION = 'westeurope'
npm run audio:generate:es
```

Replace `westeurope` with the region of the Azure Speech resource. The script
generates these Romanian MP3 files in this directory:

- `africa.mp3`
- `europa.mp3`
- `asia.mp3`
- `america-de-nord.mp3`
- `america-de-sud.mp3`
- `australia.mp3`
- `antarctica.mp3`

The Romanian files are written to this directory and use the `ro-RO-AlinaNeural`
voice. English files are written to `en/` and use the recommended female
`en-US-JennyNeural` voice.
Spanish files are written to `es/` and use the `es-ES-ElviraNeural` voice.
All languages use a slightly slower rate.
The Azure key is read only from the current process environment and is never
written to the project.

The app falls back to browser speech in the selected language when a file is missing during development.
