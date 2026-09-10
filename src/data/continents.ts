export type ContinentId =
  | 'africa'
  | 'europe'
  | 'asia'
  | 'north-america'
  | 'south-america'
  | 'australia'
  | 'antarctica'

export type Continent = {
  id: ContinentId
  names: {
    ro: string
    en: string
  }
  audioPaths: {
    ro: string
    en: string
  }
  color: string
}

export const continents: Continent[] = [
  {
    id: 'africa',
    names: { ro: 'Africa', en: 'Africa' },
    audioPaths: {
      ro: '/audio/continents/africa.mp3',
      en: '/audio/continents/en/africa.mp3',
    },
    color: '#f06f4f',
  },
  {
    id: 'europe',
    names: { ro: 'Europa', en: 'Europe' },
    audioPaths: {
      ro: '/audio/continents/europa.mp3',
      en: '/audio/continents/en/europe.mp3',
    },
    color: '#4f8df0',
  },
  {
    id: 'asia',
    names: { ro: 'Asia', en: 'Asia' },
    audioPaths: {
      ro: '/audio/continents/asia.mp3',
      en: '/audio/continents/en/asia.mp3',
    },
    color: '#f5bf3d',
  },
  {
    id: 'north-america',
    names: { ro: 'America de Nord', en: 'North America' },
    audioPaths: {
      ro: '/audio/continents/america-de-nord.mp3',
      en: '/audio/continents/en/north-america.mp3',
    },
    color: '#40a66f',
  },
  {
    id: 'south-america',
    names: { ro: 'America de Sud', en: 'South America' },
    audioPaths: {
      ro: '/audio/continents/america-de-sud.mp3',
      en: '/audio/continents/en/south-america.mp3',
    },
    color: '#d85b9f',
  },
  {
    id: 'australia',
    names: { ro: 'Australia', en: 'Australia' },
    audioPaths: {
      ro: '/audio/continents/australia.mp3',
      en: '/audio/continents/en/australia.mp3',
    },
    color: '#26a7a1',
  },
  {
    id: 'antarctica',
    names: { ro: 'Antarctica', en: 'Antarctica' },
    audioPaths: {
      ro: '/audio/continents/antarctica.mp3',
      en: '/audio/continents/en/antarctica.mp3',
    },
    color: '#8fb9d8',
  },
]
