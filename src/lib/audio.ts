import type { Continent } from '../data/continents'

export type Language = 'ro' | 'en' | 'es'

let currentAudio: HTMLAudioElement | undefined

const speakWithBrowserVoice = (text: string, language: Language) => {
  if (!('speechSynthesis' in window)) {
    return
  }

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = language === 'ro' ? 'ro-RO' : language === 'en' ? 'en-US' : 'es-ES'
  utterance.rate = 0.85
  utterance.pitch = 1.1

  window.speechSynthesis.speak(utterance)
}

export const playContinentName = async (continent: Continent, language: Language) => {
  currentAudio?.pause()

  const audio = new Audio(continent.audioPaths[language])
  currentAudio = audio

  try {
    await audio.play()
  } catch {
    speakWithBrowserVoice(continent.names[language], language)
  }
}

export const playCountryName = (name: string, language: Language) => {
  speakWithBrowserVoice(name, language)
}

export const playModeName = (name: string, language: Language) => {
  speakWithBrowserVoice(name, language)
}
