const BASE = 'https://api.openf1.org/v1'

// ── Raw API response types ─────────────────────────────

export interface OpenF1Session {
  session_key: number
  session_type: string
  session_name: string
  date_start: string
  date_end: string
  meeting_key: number
  circuit_key: number
  circuit_short_name: string
  country_name: string
  country_code: string
  location: string
  year: number
}

export interface OpenF1Driver {
  driver_number: number
  broadcast_name: string
  full_name: string
  name_acronym: string
  first_name: string
  last_name: string
  team_name: string
  team_colour: string
  headshot_url: string | null
  session_key: number
  meeting_key: number
  country_code: string | null
}

export interface OpenF1CarData {
  date: string
  session_key: number
  meeting_key: number
  driver_number: number
  speed: number
  rpm: number
  n_gear: number
  throttle: number
  brake: number
  drs: number | null
}

export interface OpenF1Position {
  date: string
  session_key: number
  meeting_key: number
  driver_number: number
  position: number
}

export interface OpenF1Interval {
  date: string
  session_key: number
  meeting_key: number
  driver_number: number
  gap_to_leader: number | null
  interval: number | null
}

export interface OpenF1Lap {
  date_start: string
  session_key: number
  meeting_key: number
  driver_number: number
  lap_number: number
  lap_duration: number | null
  duration_sector_1: number | null
  duration_sector_2: number | null
  duration_sector_3: number | null
  is_pit_out_lap: boolean
  st_speed: number | null
}

export interface OpenF1Weather {
  date: string
  session_key: number
  meeting_key: number
  air_temperature: number
  track_temperature: number
  humidity: number
  rainfall: number
  wind_speed: number
  wind_direction: number
}

export interface OpenF1Stint {
  session_key: number
  meeting_key: number
  driver_number: number
  stint_number: number
  compound: string
  tyre_age_at_start: number
  lap_start: number
  lap_end: number
}

export interface OpenF1RaceControl {
  date: string
  session_key: number
  meeting_key: number
  category: string
  flag: string | null
  message: string
  scope: string | null
  driver_number: number | null
}

// ── Fetcher with rate-limit awareness ──────────────────

async function fetchApi<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T[]> {
  const url = new URL(`${BASE}${endpoint}`)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v))
  }

  const res = await fetch(url.toString())

  if (!res.ok) {
    if (res.status === 429) {
      // Rate limited — return empty and let the caller retry on next interval
      console.warn(`[OpenF1] Rate limited on ${endpoint}`)
      return []
    }
    throw new Error(`[OpenF1] ${res.status} on ${endpoint}`)
  }

  return res.json()
}

// ── Public API ─────────────────────────────────────────

export function getLatestSession() {
  return fetchApi<OpenF1Session>('/sessions', { session_key: 'latest' })
}

/**
 * Fetch the most recent Race session from 2026, 2025, or 2024.
 * Falls back to any session type if no Race is found.
 */
export async function getRecentRaceSession(): Promise<OpenF1Session | null> {
  for (const year of [2026, 2025, 2024]) {
    const races = await fetchApi<OpenF1Session>('/sessions', {
      year,
      session_type: 'Race',
    })
    if (races.length > 0) {
      return races[races.length - 1]
    }
  }
  // Fallback: any session type
  for (const year of [2026, 2025, 2024]) {
    const sessions = await fetchApi<OpenF1Session>('/sessions', { year })
    if (sessions.length > 0) {
      return sessions[sessions.length - 1]
    }
  }
  return null
}

export function getDrivers(sessionKey: number | 'latest') {
  return fetchApi<OpenF1Driver>('/drivers', { session_key: sessionKey })
}

export function getCarData(sessionKey: number | 'latest', driverNumber: number, since?: string) {
  const params: Record<string, string | number> = {
    session_key: sessionKey,
    driver_number: driverNumber,
  }
  if (since) {
    params['date>'] = since
  }
  return fetchApi<OpenF1CarData>('/car_data', params)
}

export function getPositions(sessionKey: number | 'latest') {
  return fetchApi<OpenF1Position>('/position', { session_key: sessionKey })
}

export function getIntervals(sessionKey: number | 'latest') {
  return fetchApi<OpenF1Interval>('/intervals', { session_key: sessionKey })
}

export function getLaps(sessionKey: number | 'latest', driverNumber?: number) {
  const params: Record<string, string | number> = { session_key: sessionKey }
  if (driverNumber) params.driver_number = driverNumber
  return fetchApi<OpenF1Lap>('/laps', params)
}

export function getWeather(sessionKey: number | 'latest') {
  return fetchApi<OpenF1Weather>('/weather', { session_key: sessionKey })
}

export function getStints(sessionKey: number | 'latest', driverNumber?: number) {
  const params: Record<string, string | number> = { session_key: sessionKey }
  if (driverNumber) params.driver_number = driverNumber
  return fetchApi<OpenF1Stint>('/stints', params)
}

export function getRaceControl(sessionKey: number | 'latest') {
  return fetchApi<OpenF1RaceControl>('/race_control', { session_key: sessionKey })
}
