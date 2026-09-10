import { useState } from 'react'
import './App.css'
import { WorldMap } from './components/WorldMap'
import { continents, type Continent } from './data/continents'
import { playContinentName } from './lib/audio'

function App() {
  const [selectedContinent, setSelectedContinent] = useState<Continent>(continents[0])

  const handleContinentSelect = (continent: Continent) => {
    setSelectedContinent(continent)
    void playContinentName(continent)
  }

  return (
    <main className="app-shell">
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">Hai sa invatam lumea</p>
        <h1 id="page-title">Atinge un continent</h1>
      </section>

      <WorldMap selectedId={selectedContinent.id} onSelect={handleContinentSelect} />

      <section className="selected-panel" aria-live="polite">
        <span className="selected-label">Ai ales</span>
        <strong style={{ color: selectedContinent.color }}>{selectedContinent.nameRo}</strong>
      </section>
    </main>
  )
}

export default App
