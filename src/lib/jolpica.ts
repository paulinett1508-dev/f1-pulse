/**
 * Jolpica F1 API — successor to Ergast
 * Provides official championship standings, updated after each race.
 * Free, no auth required, CORS-enabled.
 * Docs: https://api.jolpi.ca
 */
const BASE = 'https://api.jolpi.ca/ergast/f1'

// ── Response types ──────────────────────────────────────────────────────────

export interface JolpicaDriverStanding {
  position: string
  points: string
  wins: string
  Driver: {
    driverId: string
    permanentNumber: string
    code: string
    givenName: string
    familyName: string
    nationality: string
    dateOfBirth: string
  }
  Constructors: Array<{
    constructorId: string
    name: string
    nationality: string
  }>
}

export interface JolpicaConstructorStanding {
  position: string
  points: string
  wins: string
  Constructor: {
    constructorId: string
    name: string
    nationality: string
  }
}

export interface JolpicaStandingsResponse {
  season: string
  round: string
  driverStandings: JolpicaDriverStanding[]
  constructorStandings: JolpicaConstructorStanding[]
}

// ── Internals ───────────────────────────────────────────────────────────────

async function get<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

type JolpicaRoot = {
  MRData: {
    StandingsTable: {
      season: string
      StandingsLists: Array<{
        season: string
        round: string
        DriverStandings?: JolpicaDriverStanding[]
        ConstructorStandings?: JolpicaConstructorStanding[]
      }>
    }
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Fetch both driver and constructor standings for the given season.
 * Falls back to the previous season if the current one has no data yet
 * (e.g. very start of a new season before Round 1 is scored).
 */
export async function getChampionshipStandings(season = 'current'): Promise<JolpicaStandingsResponse | null> {
  const [driversData, constructorsData] = await Promise.all([
    get<JolpicaRoot>(`${BASE}/${season}/driverStandings.json`),
    get<JolpicaRoot>(`${BASE}/${season}/constructorStandings.json`),
  ])

  const driverList = driversData?.MRData?.StandingsTable?.StandingsLists?.[0]
  const constructorList = constructorsData?.MRData?.StandingsTable?.StandingsLists?.[0]

  // If current season has no standings yet, fall back to previous year
  if (!driverList?.DriverStandings?.length && season === 'current') {
    const year = new Date().getFullYear() - 1
    return getChampionshipStandings(String(year))
  }

  if (!driverList && !constructorList) return null

  return {
    season: driverList?.season ?? constructorList?.season ?? String(new Date().getFullYear()),
    round: driverList?.round ?? constructorList?.round ?? '0',
    driverStandings: driverList?.DriverStandings ?? [],
    constructorStandings: constructorList?.ConstructorStandings ?? [],
  }
}

// ── Team color lookup ───────────────────────────────────────────────────────

/** Maps Jolpica constructor IDs → official team colors */
export const CONSTRUCTOR_COLOR: Record<string, string> = {
  red_bull:        '#3671C6',
  mclaren:         '#FF8000',
  ferrari:         '#E8002D',
  mercedes:        '#27F4D2',
  aston_martin:    '#229971',
  alpine:          '#FF87BC',
  williams:        '#64C4FF',
  rb:              '#6692FF',
  sauber:          '#52E252',
  haas:            '#B6BABD',
  cadillac:        '#C0A44D',
  // legacy IDs that may appear in older seasons
  alphatauri:      '#6692FF',
  alfa:            '#900000',
  renault:         '#FFF500',
  racing_point:    '#F596C8',
  force_india:     '#F596C8',
}

export function constructorColor(id: string): string {
  return CONSTRUCTOR_COLOR[id] ?? '#888888'
}

// ── Driver photo lookup ─────────────────────────────────────────────────────

const F1_CDN = 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_300/content/dam/fom-website/drivers/2025Drivers'

/**
 * Maps the 3-letter driver code returned by Jolpica → F1 CDN headshot URL.
 * Covers full 2025 grid + expected 2026 additions.
 */
const DRIVER_PHOTOS: Record<string, string> = {
  VER: `${F1_CDN}/vermax01.png`,
  NOR: `${F1_CDN}/norlan01.png`,
  LEC: `${F1_CDN}/leccha01.png`,
  PIA: `${F1_CDN}/piaosc01.png`,
  HAM: `${F1_CDN}/hamlew01.png`,
  RUS: `${F1_CDN}/rusgeo01.png`,
  SAI: `${F1_CDN}/saicar01.png`,
  ALO: `${F1_CDN}/alofer01.png`,
  STR: `${F1_CDN}/strlan01.png`,
  GAS: `${F1_CDN}/gaspie01.png`,
  TSU: `${F1_CDN}/tsuyuk01.png`,
  LAW: `${F1_CDN}/lawlia01.png`,
  ANT: `${F1_CDN}/antand01.png`,
  BEA: `${F1_CDN}/beaoli01.png`,
  DOO: `${F1_CDN}/doojac01.png`,
  HUL: `${F1_CDN}/hulnico01.png`,
  BOT: `${F1_CDN}/botval01.png`,
  ZHO: `${F1_CDN}/zhogua01.png`,
  ALB: `${F1_CDN}/albale01.png`,
  OCO: `${F1_CDN}/ocober01.png`,
  COL: `${F1_CDN}/colfra01.png`,
  MAG: `${F1_CDN}/magkev01.png`,
  PER: `${F1_CDN}/perser01.png`,
  DEV: `${F1_CDN}/devnya01.png`,
}

export function driverPhoto(code: string): string | undefined {
  return DRIVER_PHOTOS[code?.toUpperCase()]
}
