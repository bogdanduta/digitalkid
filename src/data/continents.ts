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
  nameRo: string
  color: string
  audioPath: string
}

export const continents: Continent[] = [
  {
    id: 'africa',
    nameRo: 'Africa',
    color: '#f06f4f',
    audioPath: '/audio/continents/africa.mp3',
  },
  {
    id: 'europe',
    nameRo: 'Europa',
    color: '#4f8df0',
    audioPath: '/audio/continents/europa.mp3',
  },
  {
    id: 'asia',
    nameRo: 'Asia',
    color: '#f5bf3d',
    audioPath: '/audio/continents/asia.mp3',
  },
  {
    id: 'north-america',
    nameRo: 'America de Nord',
    color: '#40a66f',
    audioPath: '/audio/continents/america-de-nord.mp3',
  },
  {
    id: 'south-america',
    nameRo: 'America de Sud',
    color: '#d85b9f',
    audioPath: '/audio/continents/america-de-sud.mp3',
  },
  {
    id: 'australia',
    nameRo: 'Australia',
    color: '#26a7a1',
    audioPath: '/audio/continents/australia.mp3',
  },
  {
    id: 'antarctica',
    nameRo: 'Antarctica',
    color: '#8fb9d8',
    audioPath: '/audio/continents/antarctica.mp3',
  },
]
