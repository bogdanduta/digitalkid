import type { Continent } from '../data/continents'

let currentAudio: HTMLAudioElement | undefined

const speakWithBrowserVoice = (text: string) => {
  if (!('speechSynthesis' in window)) {
    return
  }

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ro-RO'
  utterance.rate = 0.85
  utterance.pitch = 1.1

  window.speechSynthesis.speak(utterance)
}

export const playContinentName = async (continent: Continent) => {
  currentAudio?.pause()

  const audio = new Audio(continent.audioPath)
  currentAudio = audio

  try {
    await audio.play()
  } catch {
    speakWithBrowserVoice(continent.nameRo)
  }
}
