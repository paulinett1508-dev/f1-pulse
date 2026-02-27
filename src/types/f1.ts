export interface Driver {
  id: string
  name: string
  number: number
  team: string
  country: string
  photo?: string
}

export interface Team {
  id: string
  name: string
  color: string
  logo?: string
}

export interface RaceResult {
  position: number
  driver: Driver
  team: Team
  time: string
  points: number
  fastestLap?: boolean
}

export interface Race {
  id: string
  name: string
  circuit: string
  country: string
  date: string
  round: number
  results?: RaceResult[]
}

export interface Standing {
  position: number
  driver: Driver
  team: Team
  points: number
  wins: number
  lastLapTime?: string
  gap?: string
  isFastestLap?: boolean
}

export interface LapData {
  lap: number
  time: string
  position: number
  driverId: string
}

export type SessionStatus = 'upcoming' | 'live' | 'finished'
