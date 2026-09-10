[CmdletBinding()]
param(
    [ValidateSet('ro', 'en')]
    [string]$Language = 'ro'
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($env:SPEECH_KEY)) {
    throw 'Set the SPEECH_KEY environment variable to an Azure Speech resource key.'
}

if ([string]::IsNullOrWhiteSpace($env:SPEECH_REGION)) {
    throw 'Set the SPEECH_REGION environment variable to the Azure region name, for example westeurope.'
}

$region = $env:SPEECH_REGION.Trim().ToLowerInvariant()
if ($region -notmatch '^[a-z0-9]+$') {
    throw 'SPEECH_REGION must be an Azure region name such as westeurope or eastus.'
}

$continentNames = [ordered]@{
    ro = [ordered]@{
        'africa.mp3'          = 'Africa'
        'europa.mp3'          = 'Europa'
        'asia.mp3'            = 'Asia'
        'america-de-nord.mp3' = 'America de Nord'
        'america-de-sud.mp3'  = 'America de Sud'
        'australia.mp3'       = 'Australia'
        'antarctica.mp3'      = 'Antarctica'
    }
    en = [ordered]@{
        'africa.mp3'          = 'Africa'
        'europe.mp3'          = 'Europe'
        'asia.mp3'            = 'Asia'
        'north-america.mp3'   = 'North America'
        'south-america.mp3'   = 'South America'
        'australia.mp3'       = 'Australia'
        'antarctica.mp3'      = 'Antarctica'
    }
}

$continents = $continentNames[$Language]
$voiceName = if ($Language -eq 'ro') { 'ro-RO-AlinaNeural' } else { 'en-US-AvaNeural' }
$locale = if ($Language -eq 'ro') { 'ro-RO' } else { 'en-US' }
$audioDirectory = if ($Language -eq 'ro') { '' } else { '\en' }
$outputDirectory = Join-Path $PSScriptRoot "..\public\audio\continents$audioDirectory"
$outputDirectory = [System.IO.Path]::GetFullPath($outputDirectory)
[System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null


$endpoint = "https://$region.tts.speech.microsoft.com/cognitiveservices/v1"
$headers = @{
    'Ocp-Apim-Subscription-Key' = $env:SPEECH_KEY
    'X-Microsoft-OutputFormat'  = 'audio-24khz-96kbitrate-mono-mp3'
    'User-Agent'                = 'DigitalKid-Audio-Generator'
}

foreach ($continent in $continents.GetEnumerator()) {
    $ssml = @"
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="$locale">
    <voice name="$voiceName">
    <prosody rate="-12%" pitch="+3%">$($continent.Value)</prosody>
  </voice>
</speak>
"@

    $outputFile = Join-Path $outputDirectory $continent.Key
    $temporaryFile = "$outputFile.download"

    try {
        Invoke-WebRequest `
            -Method Post `
            -Uri $endpoint `
            -Headers $headers `
            -ContentType 'application/ssml+xml; charset=utf-8' `
            -Body ([System.Text.Encoding]::UTF8.GetBytes($ssml)) `
            -OutFile $temporaryFile

        if ((Get-Item $temporaryFile).Length -eq 0) {
            throw "Azure returned an empty audio file for $($continent.Value)."
        }

        Move-Item -Force $temporaryFile $outputFile
        Write-Host "Generated $($continent.Key)"
    }
    finally {
        Remove-Item -Force -ErrorAction SilentlyContinue $temporaryFile
    }
}

Write-Host "Audio files are ready in $outputDirectory"