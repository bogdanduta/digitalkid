import { continents, type Continent, type ContinentId } from '../data/continents'
import type { Language } from '../lib/audio'

type WorldMapProps = {
  selectedId: ContinentId
  language: Language
  onSelect: (continent: Continent) => void
}

type Shape = {
  id: ContinentId
  d: string
}

const shapes: Shape[] = [
  {
    id: 'north-america',
    d: 'M104 162 C78 134 88 91 136 72 C183 51 243 61 272 96 C296 125 281 158 251 170 C222 181 212 205 187 218 C153 235 124 210 104 162 Z',
  },
  {
    id: 'south-america',
    d: 'M260 276 C292 266 329 288 333 326 C337 365 314 406 288 445 C264 482 243 501 228 485 C210 466 222 425 207 392 C192 359 211 298 260 276 Z',
  },
  {
    id: 'europe',
    d: 'M403 133 C433 108 486 109 511 139 C531 163 517 190 483 196 C449 202 405 197 386 174 C375 158 383 144 403 133 Z',
  },
  {
    id: 'africa',
    d: 'M430 222 C464 196 523 205 548 247 C574 291 558 361 523 406 C494 443 462 433 445 392 C430 357 393 325 399 285 C403 258 411 238 430 222 Z',
  },
  {
    id: 'asia',
    d: 'M530 120 C591 83 699 95 751 142 C803 190 782 257 719 270 C667 281 633 251 591 267 C556 280 523 260 513 228 C504 198 498 143 530 120 Z',
  },
  {
    id: 'australia',
    d: 'M690 355 C727 336 783 347 801 382 C816 411 782 439 737 438 C693 437 657 411 665 383 C668 371 677 362 690 355 Z',
  },
  {
    id: 'antarctica',
    d: 'M138 515 C236 489 362 499 448 510 C548 523 678 490 787 519 C818 527 813 559 773 568 C603 604 398 600 187 573 C132 566 95 541 138 515 Z',
  },
]

const getContinent = (id: ContinentId) => continents.find((continent) => continent.id === id)!

export function WorldMap({ selectedId, language, onSelect }: WorldMapProps) {
  const mapCopy = language === 'ro'
    ? { label: 'Harta lumii cu continente', title: 'Harta lumii', description: 'Atinge un continent pentru a auzi numele lui in romana.' }
    : { label: 'World map with continents', title: 'World map', description: 'Touch a continent to hear its name in English.' }

  return (
    <section className="map-stage" aria-label={mapCopy.label}>
      <svg className="world-map" viewBox="0 0 900 620" role="img" aria-labelledby="map-title map-desc">
        <title id="map-title">{mapCopy.title}</title>
        <desc id="map-desc">{mapCopy.description}</desc>

        <rect className="ocean" x="20" y="24" width="860" height="560" rx="42" />

        {shapes.map((shape) => {
          const continent = getContinent(shape.id)
          const isSelected = selectedId === shape.id

          return (
            <g key={shape.id} className={isSelected ? 'continent-group selected' : 'continent-group'}>
              {isSelected && <path className="continent-glow" d={shape.d} />}
              <path
                className="continent-shape"
                d={shape.d}
                fill={continent.color}
                role="button"
                tabIndex={0}
                aria-label={continent.names[language]}
                onClick={() => onSelect(continent)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onSelect(continent)
                  }
                }}
              />
            </g>
          )
        })}
      </svg>
    </section>
  )
}
