import { useState } from 'react'
import './App.css'
import { WorldMap } from './components/WorldMap'
import { continents, type Continent } from './data/continents'
import { type Language, playContinentName } from './lib/audio'

const copy = {
  ro: { eyebrow: 'Hai sa invatam lumea', title: 'Atinge un continent', selected: 'Ai ales', switchLabel: 'Alege limba' },
  en: { eyebrow: "Let's learn about the world", title: 'Touch a continent', selected: 'You chose', switchLabel: 'Choose language' },
  es: { eyebrow: 'Aprendamos sobre el mundo', title: 'Toca un continente', selected: 'Has elegido', switchLabel: 'Elige el idioma' },
} satisfies Record<Language, Record<string, string>>

function App() {
  const [selectedContinent, setSelectedContinent] = useState<Continent>(continents[0])
  const [language, setLanguage] = useState<Language>('ro')

  const currentCopy = copy[language]

  const handleContinentSelect = (continent: Continent) => {
    setSelectedContinent(continent)
    void playContinentName(continent, language)
  }

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage)
    void playContinentName(selectedContinent, nextLanguage)
  }

  return (
    <main className="app-shell">
      <div className="language-switcher" role="group" aria-label={currentCopy.switchLabel}>
        <button
          className={language === 'ro' ? 'language-button active' : 'language-button'}
          type="button"
          aria-label="Romana"
          aria-pressed={language === 'ro'}
          onClick={() => handleLanguageChange('ro')}
        >
          <img className="flag" src="https://flagcdn.com/ro.svg" alt="" aria-hidden="true" />
        </button>
        <button
          className={language === 'en' ? 'language-button active' : 'language-button'}
          type="button"
          aria-label="English"
          aria-pressed={language === 'en'}
          onClick={() => handleLanguageChange('en')}
        >
          <img className="flag" src="https://flagcdn.com/gb.svg" alt="" aria-hidden="true" />
        </button>
        <button
          className={language === 'es' ? 'language-button active' : 'language-button'}
          type="button"
          aria-label="Español"
          aria-pressed={language === 'es'}
          onClick={() => handleLanguageChange('es')}
        >
          <img className="flag" src="https://flagcdn.com/es.svg" alt="" aria-hidden="true" />
        </button>
      </div>

      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">{currentCopy.eyebrow}</p>
        <h1 id="page-title">{currentCopy.title}</h1>
      </section>

      <WorldMap selectedId={selectedContinent.id} language={language} onSelect={handleContinentSelect} />

      <section className="selected-panel" aria-live="polite">
        <span className="selected-label">{currentCopy.selected}</span>
        <strong style={{ color: selectedContinent.color }}>{selectedContinent.names[language]}</strong>
      </section>
    </main>
  )
}

export default App
