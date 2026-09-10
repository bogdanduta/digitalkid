# Romanian Continent Audio

Set the Azure Speech credentials in PowerShell and run the generator from the
project root:

```powershell
$env:SPEECH_KEY = 'your-key'
$env:SPEECH_REGION = 'westeurope'
npm run audio:generate
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

The generator uses the `ro-RO-AlinaNeural` voice with a slightly slower rate.
The Azure key is read only from the current process environment and is never
written to the project.

The app falls back to browser Romanian speech when a file is missing during development.
