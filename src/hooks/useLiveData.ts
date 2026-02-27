import { useEffect, useRef, useCallback, useState } from 'react'
import { useF1Store } from '@/stores/f1Store'
import {
  getLatestSession,
  getRecentRaceSession,
  getDrivers,
  getCarData,
  getPositions,
  getIntervals,
  getWeather,
  getStints,
  getLaps,
  getRaceControl,
} from '@/lib/openf1'
import type {
  OpenF1Session,
  OpenF1Driver,
  OpenF1CarData,
  OpenF1Position,
  OpenF1Interval,
  OpenF1Weather,
  OpenF1RaceControl,
} from '@/lib/openf1'
import type { TelemetryData, FlagStatus, TrackCondition } from '@/types/f1'

// Driver numbers to track telemetry for (top drivers)
const TRACKED_DRIVERS = [1, 44, 16, 4, 81, 63, 55, 14, 18, 10]

// Polling intervals (ms) — respects free tier: 3 req/s, 30 req/min
const TELEMETRY_INTERVAL = 4000
const LEADER_TELEMETRY_INTERVAL = 2000  // Leader speed/RPM/gear updates
const POSITIONS_INTERVAL = 5000
const WEATHER_INTERVAL   = 30000
const RACE_CTRL_INTERVAL = 8000

// ── Helpers ────────────────────────────────────────────

function parseDrs(drs: number | null): boolean {
  return drs !== null && [10, 12, 14].includes(drs)
}

function mapCarDataToTelemetry(data: OpenF1CarData): TelemetryData {
  return {
    speed: data.speed,
    rpm: data.rpm,
    gear: data.n_gear,
    throttle: data.throttle,
    brake: data.brake,
    drs: parseDrs(data.drs),
    delta: 0, // delta comes from intervals endpoint
  }
}

function mapTyre(compound: string | undefined): 'soft' | 'medium' | 'hard' | 'inter' | 'wet' {
  switch (compound?.toUpperCase()) {
    case 'SOFT': return 'soft'
    case 'MEDIUM': return 'medium'
    case 'HARD': return 'hard'
    case 'INTERMEDIATE': return 'inter'
    case 'WET': return 'wet'
    default: return 'medium'
  }
}

function mapFlag(raceControl: OpenF1RaceControl[]): FlagStatus {
  // Find the latest flag message
  for (let i = raceControl.length - 1; i >= 0; i--) {
    const msg = raceControl[i]
    if (msg.flag === 'RED') return 'red'
    if (msg.message?.includes('SAFETY CAR')) return 'safety-car'
    if (msg.message?.includes('VIRTUAL SAFETY CAR')) return 'vsc'
    if (msg.flag === 'YELLOW' || msg.flag === 'DOUBLE YELLOW') return 'yellow'
    if (msg.flag === 'GREEN') return 'green'
  }
  return 'green'
}

function mapTrackCondition(weather: OpenF1Weather | undefined): TrackCondition {
  if (!weather) return 'dry'
  if (weather.rainfall > 0.5) return 'wet'
  if (weather.rainfall > 0 || weather.humidity > 85) return 'damp'
  return 'dry'
}

// ── Hook ───────────────────────────────────────────────

export interface LiveDataStatus {
  isConnected: boolean
  sessionInfo: OpenF1Session | null
  lastUpdate: Date | null
  error: string | null
  dataSource: 'live' | 'recent' | 'none'
}

export function useLiveData(enabled = true) {
  const store = useF1Store()
  const [status, setStatus] = useState<LiveDataStatus>({
    isConnected: false,
    sessionInfo: null,
    lastUpdate: null,
    error: null,
    dataSource: 'none',
  })

  // Refs to track the latest telemetry cursor per driver
  const telemetryCursors = useRef<Record<number, string>>({})
  const sessionKeyRef = useRef<number | null>(null)
  const driversMapRef = useRef<Map<number, OpenF1Driver>>(new Map())

  // ── Bootstrap: fetch session + drivers ───────────────
  const bootstrap = useCallback(async () => {
    try {
      // Prefer a recent Race session from 2024/2025 for richer telemetry data
      const recentRace = await getRecentRaceSession()
      const session = recentRace ?? (await getLatestSession())[0] ?? null
      if (!session) {
        setStatus((s) => ({ ...s, error: 'Nenhuma sessão encontrada', dataSource: 'none' }))
        return false
      }

      sessionKeyRef.current = session.session_key

      // Check if the session is live or recently ended (< 2 hours)
      const sessionEnd = new Date(session.date_end)
      const now = new Date()
      const hoursSinceEnd = (now.getTime() - sessionEnd.getTime()) / (1000 * 60 * 60)
      const dataSource = hoursSinceEnd < 0 ? 'live' : hoursSinceEnd < 2 ? 'recent' : 'recent'

      setStatus((s) => ({
        ...s,
        sessionInfo: session,
        isConnected: true,
        error: null,
        dataSource,
      }))

      store.setIsLive(dataSource === 'live')

      // Fetch drivers for this session
      const driversList = await getDrivers(session.session_key)
      const dMap = new Map<number, OpenF1Driver>()
      for (const d of driversList) {
        dMap.set(d.driver_number, d)
      }
      driversMapRef.current = dMap

      // Build initial drivers and standings from API driver list
      const apiDrivers = driversList.map((d) => ({
        id: d.name_acronym,
        name: d.full_name,
        number: d.driver_number,
        team: d.team_name.toLowerCase().replace(/\s+/g, '-'),
        country: d.country_code ?? '',
        photo: d.headshot_url ?? undefined,
      }))
      store.setDrivers(apiDrivers)

      // Fetch initial positions
      await fetchPositions(session.session_key, driversList)

      // Fetch initial weather
      await fetchWeather(session.session_key)

      return true
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao conectar'
      setStatus((s) => ({ ...s, error: msg, isConnected: false }))
      return false
    }
  }, [store])

  // ── Fetch positions + intervals + stints + laps ──────
  const fetchPositions = useCallback(async (sessionKey: number, driversList?: OpenF1Driver[]) => {
    try {
      const [positions, intervals, stintsData, lapsData] = await Promise.all([
        getPositions(sessionKey),
        getIntervals(sessionKey),
        getStints(sessionKey),
        getLaps(sessionKey),
      ])

      // Get the latest position per driver
      const latestPositions = new Map<number, OpenF1Position>()
      for (const p of positions) {
        latestPositions.set(p.driver_number, p)
      }

      // Latest interval per driver
      const latestIntervals = new Map<number, OpenF1Interval>()
      for (const iv of intervals) {
        latestIntervals.set(iv.driver_number, iv)
      }

      // Latest stint per driver (for tyre compound)
      const latestStints = new Map<number, string>()
      for (const st of stintsData) {
        latestStints.set(st.driver_number, st.compound)
      }

      // Pitstop count per driver (stint_number - 1)
      const pitstopCounts = new Map<number, number>()
      for (const st of stintsData) {
        const current = pitstopCounts.get(st.driver_number) ?? 0
        pitstopCounts.set(st.driver_number, Math.max(current, st.stint_number - 1))
      }

      // Latest lap per driver
      const latestLaps = new Map<number, { duration: number | null; s1: number | null; s2: number | null; s3: number | null }>()
      for (const lap of lapsData) {
        latestLaps.set(lap.driver_number, {
          duration: lap.lap_duration,
          s1: lap.duration_sector_1,
          s2: lap.duration_sector_2,
          s3: lap.duration_sector_3,
        })
      }

      // Find fastest lap
      let fastestLapDriver: number | null = null
      let fastestLapTime = Infinity
      for (const [driverNum, lap] of latestLaps.entries()) {
        if (lap.duration && lap.duration < fastestLapTime) {
          fastestLapTime = lap.duration
          fastestLapDriver = driverNum
        }
      }

      // Build standings from current state, merging new position data
      const drivers = driversList ?? Array.from(driversMapRef.current.values())
      const currentStandings = useF1Store.getState().standings

      const updatedStandings = drivers
        .map((d) => {
          const driverNum = typeof d === 'object' && 'driver_number' in d ? d.driver_number : 0
          if (!driverNum) return null

          const driverInfo = driversMapRef.current.get(driverNum)
          if (!driverInfo) return null

          const pos = latestPositions.get(driverNum)
          const iv = latestIntervals.get(driverNum)
          const lap = latestLaps.get(driverNum)
          const existing = currentStandings.find((s) => s.driver.number === driverNum)

          const position = pos?.position ?? existing?.position ?? 99

          const gapToLeader = iv?.gap_to_leader
          const gap = position === 1
            ? 'LEADER'
            : gapToLeader != null
              ? `+${gapToLeader.toFixed(3)}`
              : existing?.gap ?? ''

          const lapTimeStr = lap?.duration
            ? formatLapTime(lap.duration)
            : existing?.lastLapTime ?? ''

          return {
            position,
            driver: {
              id: driverInfo.name_acronym,
              name: driverInfo.full_name,
              number: driverNum,
              team: driverInfo.team_name.toLowerCase().replace(/\s+/g, '-'),
              country: driverInfo.country_code ?? '',
              photo: driverInfo.headshot_url ?? undefined,
            },
            team: {
              id: driverInfo.team_name.toLowerCase().replace(/\s+/g, '-'),
              name: driverInfo.team_name,
              color: `#${driverInfo.team_colour || '525252'}`,
            },
            points: existing?.points ?? 0,
            wins: existing?.wins ?? 0,
            lastLapTime: lapTimeStr,
            gap,
            isFastestLap: driverNum === fastestLapDriver,
            telemetry: existing?.telemetry,
            sector1: lap?.s1 ?? undefined,
            sector2: lap?.s2 ?? undefined,
            sector3: lap?.s3 ?? undefined,
            tyre: mapTyre(latestStints.get(driverNum)),
            pitstops: pitstopCounts.get(driverNum) ?? 0,
          }
        })
        .filter(Boolean)
        .sort((a, b) => a!.position - b!.position) as typeof currentStandings

      if (updatedStandings.length > 0) {
        store.setStandings(updatedStandings)
      }

      setStatus((s) => ({ ...s, lastUpdate: new Date() }))
    } catch {
      // Silently fail — we'll retry on next poll
    }
  }, [store])

  // ── Fetch telemetry for tracked drivers ──────────────
  const fetchTelemetry = useCallback(async (sessionKey: number) => {
    try {
      // Fetch telemetry for top 3 tracked drivers to avoid rate limits
      const currentStandings = useF1Store.getState().standings
      const top3 = currentStandings.slice(0, 3).map((s) => s.driver.number)
      const driverNums = top3.length > 0 ? top3 : TRACKED_DRIVERS.slice(0, 3)

      const results = await Promise.all(
        driverNums.map(async (num) => {
          const since = telemetryCursors.current[num]
          const data = await getCarData(sessionKey, num, since)
          if (data.length > 0) {
            // Update cursor to latest timestamp
            telemetryCursors.current[num] = data[data.length - 1].date
          }
          return { driverNumber: num, data }
        }),
      )

      // Get latest intervals for delta
      const intervals = await getIntervals(sessionKey)
      const latestIntervals = new Map<number, number>()
      for (const iv of intervals) {
        if (iv.gap_to_leader != null) {
          latestIntervals.set(iv.driver_number, iv.gap_to_leader)
        }
      }

      // Merge telemetry into standings
      const telemetryMap = new Map<number, TelemetryData>()
      for (const { driverNumber, data } of results) {
        if (data.length > 0) {
          const latest = data[data.length - 1]
          const telem = mapCarDataToTelemetry(latest)
          telem.delta = latestIntervals.get(driverNumber) ?? 0
          telemetryMap.set(driverNumber, telem)
        }
      }

      if (telemetryMap.size > 0) {
        const standings = useF1Store.getState().standings.map((s) => {
          const telem = telemetryMap.get(s.driver.number)
          if (!telem) return s
          return { ...s, telemetry: telem }
        })
        store.setStandings(standings)
      }

      setStatus((s) => ({ ...s, lastUpdate: new Date() }))
    } catch {
      // Silently fail
    }
  }, [store])

  // ── Fetch leader telemetry (speed, RPM, gear) every 2s ──
  const leaderCursorRef = useRef<string | undefined>(undefined)

  const fetchLeaderTelemetry = useCallback(async (sessionKey: number) => {
    try {
      const currentStandings = useF1Store.getState().standings
      if (currentStandings.length === 0) return

      const leader = currentStandings[0]
      const leaderNum = leader.driver.number

      const data = await getCarData(sessionKey, leaderNum, leaderCursorRef.current)
      if (data.length === 0) return

      // Advance cursor
      leaderCursorRef.current = data[data.length - 1].date

      const latest = data[data.length - 1]
      const telem = mapCarDataToTelemetry(latest)
      // Preserve existing delta
      telem.delta = leader.telemetry?.delta ?? 0

      const standings = currentStandings.map((s) =>
        s.driver.number === leaderNum ? { ...s, telemetry: telem } : s,
      )
      store.setStandings(standings)
      setStatus((s) => ({ ...s, lastUpdate: new Date() }))
    } catch {
      // Silently fail — next poll will retry
    }
  }, [store])

  // ── Fetch weather ────────────────────────────────────
  const fetchWeather = useCallback(async (sessionKey: number) => {
    try {
      const weather = await getWeather(sessionKey)
      if (weather.length > 0) {
        const latest = weather[weather.length - 1]
        useF1Store.setState({
          airTemp: Math.round(latest.air_temperature),
          trackTemp: Math.round(latest.track_temperature),
          trackCondition: mapTrackCondition(latest),
        })
      }
    } catch {
      // Silently fail
    }
  }, [])

  // ── Fetch race control (flags) ───────────────────────
  const fetchRaceControl = useCallback(async (sessionKey: number) => {
    try {
      const messages = await getRaceControl(sessionKey)
      if (messages.length > 0) {
        useF1Store.setState({ flagStatus: mapFlag(messages) })
      }
    } catch {
      // Silently fail
    }
  }, [])

  // ── Main effect: bootstrap + start polling ───────────
  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    let telemetryTimer: ReturnType<typeof setInterval>
    let leaderTelemetryTimer: ReturnType<typeof setInterval>
    let positionsTimer: ReturnType<typeof setInterval>
    let weatherTimer: ReturnType<typeof setInterval>
    let raceCtrlTimer: ReturnType<typeof setInterval>

    async function start() {
      const ok = await bootstrap()
      if (cancelled || !ok) return

      const sk = sessionKeyRef.current
      if (!sk) return

      // Start polling loops with staggered starts to spread requests
      telemetryTimer = setInterval(() => fetchTelemetry(sk), TELEMETRY_INTERVAL)

      // Leader telemetry at 2s for smooth speed/RPM/gear animation
      leaderTelemetryTimer = setInterval(() => fetchLeaderTelemetry(sk), LEADER_TELEMETRY_INTERVAL)

      setTimeout(() => {
        if (cancelled) return
        positionsTimer = setInterval(() => fetchPositions(sk), POSITIONS_INTERVAL)
      }, 1500)

      setTimeout(() => {
        if (cancelled) return
        weatherTimer = setInterval(() => fetchWeather(sk), WEATHER_INTERVAL)
      }, 2500)

      setTimeout(() => {
        if (cancelled) return
        raceCtrlTimer = setInterval(() => fetchRaceControl(sk), RACE_CTRL_INTERVAL)
      }, 3500)
    }

    start()

    return () => {
      cancelled = true
      clearInterval(telemetryTimer)
      clearInterval(leaderTelemetryTimer)
      clearInterval(positionsTimer)
      clearInterval(weatherTimer)
      clearInterval(raceCtrlTimer)
    }
  }, [enabled, bootstrap, fetchTelemetry, fetchLeaderTelemetry, fetchPositions, fetchWeather, fetchRaceControl])

  return status
}

// ── Utils ──────────────────────────────────────────────

function formatLapTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = (seconds % 60).toFixed(3)
  return `${mins}:${secs.padStart(6, '0')}`
}
