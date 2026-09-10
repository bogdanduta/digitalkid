import { continents, type Continent, type ContinentId } from '../data/continents'
import type { Language } from '../lib/audio'
import { geoCentroid, geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import countries from 'i18n-iso-countries'
import countriesTopology from 'world-atlas/countries-110m.json'

const countriesTopologyData = countriesTopology as unknown as Topology<{ countries: GeometryCollection }>
const countriesFeature = feature(countriesTopologyData, countriesTopologyData.objects.countries)
const projection = geoNaturalEarth1().fitSize([830, 540], countriesFeature)
const projectedPath = geoPath(projection)

type WorldMapProps = {
  selectedId: ContinentId
  selectedCountryKey?: string
  mode: MapMode
  language: Language
  onSelect: (continent: Continent) => void
  onSelectCountry: (countryKey: string, name: string) => void
}

const classifyContinent = (country: typeof countriesFeature.features[number]): ContinentId => {
  const [longitude, latitude] = geoCentroid(country)

  if (latitude < -55) return 'antarctica'
  if (longitude > 130 && latitude < -8) return 'australia'
  if (longitude < -30 && latitude < 18 && latitude > -56) return 'south-america'
  if (longitude < -25 && latitude >= 18) return 'north-america'
  if (longitude >= -25 && longitude <= 55 && latitude > -35 && latitude < 38) return 'africa'
  if (longitude >= -25 && longitude <= 65 && latitude >= 35) return 'europe'
  return 'asia'
}

const projectedCountries = countriesFeature.features.map((country, index) => ({
  key: `${country.id ?? 'country'}-${index}`,
  numericId: String(country.id ?? ''),
  continentId: classifyContinent(country),
  path: projectedPath(country) ?? '',
}))

const languageLocales: Record<Language, string> = { ro: 'ro-RO', en: 'en-US', es: 'es-ES' }

const getCountryName = (numericId: string, language: Language) => {
  const alpha2 = countries.numericToAlpha2(numericId)
  if (!alpha2) return 'Unknown country'

  return new Intl.DisplayNames([languageLocales[language]], { type: 'region' }).of(alpha2) ?? 'Unknown country'
}

export type MapMode = 'continents' | 'countries'

export function WorldMap({ selectedId, selectedCountryKey, mode, language, onSelect, onSelectCountry }: WorldMapProps) {
  const mapCopy = language === 'ro'
    ? { label: 'Harta lumii cu continente', title: 'Harta lumii', description: 'Atinge un continent pentru a auzi numele lui in romana.' }
    : language === 'en'
      ? { label: 'World map with continents', title: 'World map', description: 'Touch a continent to hear its name in English.' }
      : { label: 'Mapa del mundo con continentes', title: 'Mapa del mundo', description: 'Toca un continente para escuchar su nombre en español.' }

  return (
    <section className="map-stage" aria-label={mapCopy.label}>
      <svg className="world-map fidelity-high" viewBox="0 0 900 620" role="img" aria-labelledby="map-title map-desc">
        <title id="map-title">{mapCopy.title}</title>
        <desc id="map-desc">{mapCopy.description}</desc>

        <rect className="ocean" x="20" y="24" width="860" height="560" rx="42" />
        {projectedCountries.map((country) => {
          const continent = continents.find((item) => item.id === country.continentId)!
          const countryName = getCountryName(country.numericId, language)
          const isSelected = mode === 'countries'
            ? selectedCountryKey === country.key
            : selectedId === country.continentId

          return (
            <path
              key={country.key}
              className={isSelected ? 'continent-shape selected' : 'continent-shape'}
              d={country.path}
              fill={continent.color}
              role="button"
              tabIndex={0}
              aria-label={mode === 'countries' ? countryName : continent.names[language]}
              onClick={() => mode === 'countries' ? onSelectCountry(country.key, countryName) : onSelect(continent)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  if (mode === 'countries') onSelectCountry(country.key, countryName)
                  else onSelect(continent)
                }
              }}
            />
          )
        })}
      </svg>
    </section>
  )
}
