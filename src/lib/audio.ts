import type { Continent } from '../data/continents'

export type Language = 'ro' | 'en'

let currentAudio: HTMLAudioElement | undefined

const speakWithBrowserVoice = (text: string, language: Language) => {
  if (!('speechSynthesis' in window)) {
    return
  }

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = language === 'ro' ? 'ro-RO' : 'en-US'
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
