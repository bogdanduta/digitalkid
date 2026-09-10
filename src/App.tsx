import { useState } from 'react'
import './App.css'
import { WorldMap, type MapMode } from './components/WorldMap'
import { continents, type Continent } from './data/continents'
import { type Language, playContinentName, playCountryName } from './lib/audio'

const copy = {
  ro: { switchLabel: 'Alege limba', mapMode: 'Alege ce invatam', continents: 'Continente', countries: 'Tari' },
  en: { switchLabel: 'Choose language', mapMode: 'Choose what to learn', continents: 'Continents', countries: 'Countries' },
  es: { switchLabel: 'Elige el idioma', mapMode: 'Elige qué aprender', continents: 'Continentes', countries: 'Países' },
} satisfies Record<Language, Record<string, string>>

function App() {
  const [selectedContinent, setSelectedContinent] = useState<Continent>(continents[0])
  const [selectedCountryKey, setSelectedCountryKey] = useState<string>()
  const [mode, setMode] = useState<MapMode>('continents')
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

  const handleCountrySelect = (countryKey: string, name: string) => {
    setSelectedCountryKey(countryKey)
    playCountryName(name, language)
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

      <div className="mode-switcher" role="group" aria-label={currentCopy.mapMode}>
        <button className={mode === 'continents' ? 'mode-button active' : 'mode-button'} type="button" aria-pressed={mode === 'continents'} onClick={() => setMode('continents')}>
          {currentCopy.continents}
        </button>
        <button className={mode === 'countries' ? 'mode-button active' : 'mode-button'} type="button" aria-pressed={mode === 'countries'} onClick={() => setMode('countries')}>
          {currentCopy.countries}
        </button>
      </div>

      <WorldMap
        selectedId={selectedContinent.id}
        selectedCountryKey={selectedCountryKey}
        mode={mode}
        language={language}
        onSelect={handleContinentSelect}
        onSelectCountry={handleCountrySelect}
      />
    </main>
  )
}

export default App
