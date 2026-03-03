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

const CURRENT_YEAR = new Date().getFullYear()

export function getLatestSession() {
  return fetchApi<OpenF1Session>('/sessions', { session_key: 'latest' })
}

/**
 * Fetch the most recent session with real data.
 * Dynamically uses the current year so it always prioritises the ongoing season.
 * Falls back to previous years only when the current year has no completed sessions.
 */
export async function getRecentRaceSession(): Promise<OpenF1Session | null> {
  const now = new Date()

  // 1. Try current year — grab the most recent session that already ended
  const allCurrent = await fetchApi<OpenF1Session>('/sessions', { year: CURRENT_YEAR })

  if (allCurrent.length > 0) {
    const pastCurrent = allCurrent.filter((s) => new Date(s.date_end) <= now)
    if (pastCurrent.length > 0) {
      console.info(`[OpenF1] Found ${pastCurrent.length} completed ${CURRENT_YEAR} session(s)`)
      return pastCurrent[pastCurrent.length - 1]
    }
    console.info(`[OpenF1] ${CURRENT_YEAR} has ${allCurrent.length} session(s) but none completed yet (season starts soon)`)
  } else {
    console.warn(`[OpenF1] No ${CURRENT_YEAR} sessions found — API may not have data for this season yet`)
  }

  // 2. Fallback: latest Race from previous years
  const fallbackYears = [CURRENT_YEAR - 1, CURRENT_YEAR - 2]
  for (const year of fallbackYears) {
    const races = await fetchApi<OpenF1Session>('/sessions', {
      year,
      session_type: 'Race',
    })
    if (races.length > 0) {
      console.info(`[OpenF1] Falling back to ${year} Race data (${races.length} races found)`)
      return races[races.length - 1]
    }
  }

  // 3. Last resort: any upcoming session from current year (e.g. pre-season)
  if (allCurrent.length > 0) {
    console.info(`[OpenF1] Using upcoming ${CURRENT_YEAR} session as last resort`)
    return allCurrent[0]
  }

  console.warn('[OpenF1] No sessions found in any year')
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
