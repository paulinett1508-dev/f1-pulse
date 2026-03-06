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

export type SessionType = 'practice' | 'qualifying' | 'sprint-shootout' | 'sprint' | 'race'

export interface RaceSession {
  type: SessionType
  date: string
  label: string
}

export interface Race {
  id: string
  name: string
  circuit: string
  country: string
  date: string
  round: number
  hasSprint?: boolean
  trackImg?: string
  sessions?: RaceSession[]
  results?: RaceResult[]
}

export interface TelemetryData {
  speed: number
  rpm: number
  gear: number
  throttle: number
  brake: number
  drs: boolean
  delta: number
}

export type FlagStatus = 'green' | 'yellow' | 'red' | 'safety-car' | 'vsc'

export type TrackCondition = 'dry' | 'damp' | 'wet'

export interface Standing {
  position: number
  driver: Driver
  team: Team
  points: number
  wins: number
  lastLapTime?: string
  gap?: string
  isFastestLap?: boolean
  telemetry?: TelemetryData
  tyre?: 'soft' | 'medium' | 'hard' | 'inter' | 'wet'
  pitstops?: number
  sector1?: number
  sector2?: number
  sector3?: number
}

export interface LapData {
  lap: number
  time: string
  position: number
  driverId: string
}

export type SessionStatus = 'upcoming' | 'live' | 'finished'
