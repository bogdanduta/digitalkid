import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { select } from 'd3-selection'
import { zoom, zoomIdentity } from 'd3-zoom'
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
  onClearCountry: () => void
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

export function WorldMap({ selectedId, selectedCountryKey, mode, language, onSelect, onSelectCountry, onClearCountry }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const contentRef = useRef<SVGGElement>(null)
  const zoomBehaviorRef = useRef<ReturnType<typeof zoom<SVGSVGElement, unknown>> | null>(null)
  const countryRefs = useRef(new Map<string, SVGPathElement>())
  const exitTimerRef = useRef<number | undefined>(undefined)
  const focusFrameRef = useRef<number | undefined>(undefined)
  const zoomTransformRef = useRef(zoomIdentity)
  const [focusCountryKey, setFocusCountryKey] = useState<string>()
  const [selectedCountryTransform, setSelectedCountryTransform] = useState({ scale: 0.85, x: 0, y: 0 })
  const [zoomRevision, setZoomRevision] = useState(0)

  const mapCopy = language === 'ro'
    ? { label: 'Harta lumii cu continente', title: 'Harta lumii', description: 'Atinge un continent pentru a auzi numele lui in romana.' }
    : language === 'en'
      ? { label: 'World map with continents', title: 'World map', description: 'Touch a continent to hear its name in English.' }
      : { label: 'Mapa del mundo con continentes', title: 'Mapa del mundo', description: 'Toca un continente para escuchar su nombre en español.' }

  useEffect(() => {
    if (!svgRef.current || !contentRef.current) return

    const svg = select(svgRef.current)
    const content = select(contentRef.current)
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 5])
      .translateExtent([[0, 0], [900, 620]])
      .on('zoom', (event) => {
        zoomTransformRef.current = event.transform
        content.attr('transform', event.transform.toString())
        setZoomRevision((revision) => revision + 1)
      })

    svg.call(zoomBehavior)
    zoomBehaviorRef.current = zoomBehavior

    return () => {
      svg.on('.zoom', null)
      zoomBehaviorRef.current = null
    }
  }, [])

  useEffect(() => {
    if (exitTimerRef.current !== undefined) window.clearTimeout(exitTimerRef.current)
    if (focusFrameRef.current !== undefined) window.cancelAnimationFrame(focusFrameRef.current)

    if (mode !== 'countries') {
      setFocusCountryKey(undefined)
      setSelectedCountryTransform({ scale: 0.85, x: 0, y: 0 })
      return
    }

    if (!selectedCountryKey) {
      if (focusCountryKey) {
        setSelectedCountryTransform({ scale: 1, x: 0, y: 0 })
        exitTimerRef.current = window.setTimeout(() => setFocusCountryKey(undefined), 700)
      }
      return
    }

    setFocusCountryKey(selectedCountryKey)
    const selectedPath = countryRefs.current.get(selectedCountryKey)
    if (!selectedPath) return

    const bounds = selectedPath.getBBox()
    const mapWidth = 860
    const mapHeight = 560
    const targetArea = mapWidth * mapHeight * 0.25
    const scale = Math.sqrt(targetArea / Math.max(bounds.width * bounds.height, 1))
    const maxBoxScale = Math.min(
      (mapWidth * 0.5) / Math.max(bounds.width, 1),
      (mapHeight * 0.5) / Math.max(bounds.height, 1),
    )
    const visibleCenter = zoomTransformRef.current.invert([450, 310])
    const centerX = bounds.x + bounds.width / 2
    const centerY = bounds.y + bounds.height / 2
    const finalTransform = {
      scale: Math.min(Math.max(scale, 1.1), maxBoxScale, 4),
      x: visibleCenter[0] - centerX,
      y: visibleCenter[1] - centerY,
    }
    setSelectedCountryTransform({ scale: 0.85, x: 0, y: 0 })
    focusFrameRef.current = window.requestAnimationFrame(() => {
      focusFrameRef.current = window.requestAnimationFrame(() => setSelectedCountryTransform(finalTransform))
    })
  }, [mode, selectedCountryKey, zoomRevision])

  const selectedCountry = mode === 'countries' && focusCountryKey
    ? projectedCountries.find((country) => country.key === focusCountryKey)
    : undefined

  const zoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) select(svgRef.current).call(zoomBehaviorRef.current.scaleBy, 1.4)
  }

  const zoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) select(svgRef.current).call(zoomBehaviorRef.current.scaleBy, 0.72)
  }

  const resetZoom = () => {
    if (svgRef.current && zoomBehaviorRef.current) select(svgRef.current).call(zoomBehaviorRef.current.transform, zoomIdentity)
  }

  return (
    <section className={selectedCountry ? 'map-stage country-focused' : 'map-stage'} aria-label={mapCopy.label}>
      <div className="zoom-controls" aria-label="Map zoom controls">
        <button type="button" aria-label="Zoom in" onClick={zoomIn}>+</button>
        <button type="button" aria-label="Zoom out" onClick={zoomOut}>−</button>
        <button type="button" aria-label="Reset map zoom" onClick={resetZoom}>↺</button>
      </div>
      <svg ref={svgRef} className="world-map fidelity-high" viewBox="0 0 900 620" role="img" aria-labelledby="map-title map-desc">
        <title id="map-title">{mapCopy.title}</title>
        <desc id="map-desc">{mapCopy.description}</desc>

        <g ref={contentRef}>
          <rect className="ocean" x="20" y="24" width="860" height="560" rx="42" onClick={onClearCountry} />
          {projectedCountries.map((country) => {
          const continent = continents.find((item) => item.id === country.continentId)!
          const countryName = getCountryName(country.numericId, language)
          const isSelected = selectedId === country.continentId

            return (
              <path
              key={country.key}
              className={isSelected ? 'continent-shape selected' : 'continent-shape'}
              ref={(element) => {
                if (element) countryRefs.current.set(country.key, element)
                else countryRefs.current.delete(country.key)
              }}
              d={country.path}
              fill={continent.color}
              role="button"
              tabIndex={0}
              aria-label={mode === 'countries' ? countryName : continent.names[language]}
              onClick={(event) => {
                event.stopPropagation()
                if (mode === 'countries') onSelectCountry(country.key, countryName)
                else onSelect(continent)
              }}
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
          {selectedCountry && (
            <path
              className="country-focus"
              d={selectedCountry.path}
              fill={continents.find((item) => item.id === selectedCountry.continentId)?.color}
              aria-hidden="true"
              style={{
                '--country-scale': selectedCountryTransform.scale,
                '--country-x': `${selectedCountryTransform.x}px`,
                '--country-y': `${selectedCountryTransform.y}px`,
              } as CSSProperties}
            />
          )}
        </g>
      </svg>
    </section>
  )
}
