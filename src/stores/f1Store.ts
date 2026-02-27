import { create } from 'zustand'
import type { Driver, Race, Standing, FlagStatus, TrackCondition } from '@/types/f1'
import {
  drivers as mockDrivers,
  races as mockRaces,
  standings as mockStandings,
} from './mockData'

interface F1State {
  drivers: Driver[]
  races: Race[]
  standings: Standing[]
  isLive: boolean
  flagStatus: FlagStatus
  trackCondition: TrackCondition
  airTemp: number
  trackTemp: number
  setDrivers: (drivers: Driver[]) => void
  setRaces: (races: Race[]) => void
  setStandings: (standings: Standing[]) => void
  setIsLive: (isLive: boolean) => void
  setFlagStatus: (flag: FlagStatus) => void
  simulatePositionSwap: () => void
  simulateTelemetryTick: () => void
}

function jitter(base: number, range: number) {
  return +(base + (Math.random() - 0.5) * range).toFixed(3)
}

export const useF1Store = create<F1State>((set) => ({
  drivers: mockDrivers,
  races: mockRaces,
  standings: mockStandings,
  isLive: true,
  flagStatus: 'green',
  trackCondition: 'dry',
  airTemp: 28,
  trackTemp: 42,

  setDrivers: (drivers) => set({ drivers }),
  setRaces: (races) => set({ races }),
  setStandings: (standings) => set({ standings }),
  setIsLive: (isLive) => set({ isLive }),
  setFlagStatus: (flagStatus) => set({ flagStatus }),

  simulatePositionSwap: () =>
    set((state) => {
      const list = [...state.standings]
      const i = Math.floor(Math.random() * Math.min(5, list.length - 1))
      const a = { ...list[i] }
      const b = { ...list[i + 1] }

      const tmpPos = a.position
      a.position = b.position
      b.position = tmpPos

      a.gap = a.position === 1 ? 'LEADER' : `+${(Math.random() * 0.8 + 0.05).toFixed(3)}`
      b.gap = b.position === 1 ? 'LEADER' : `+${(Math.random() * 0.8 + 0.05).toFixed(3)}`

      list[i] = b
      list[i + 1] = a

      return { standings: list }
    }),

  simulateTelemetryTick: () =>
    set((state) => ({
      standings: state.standings.map((s) => {
        if (!s.telemetry) return s

        const speed = Math.round(jitter(s.telemetry.speed, 18))
        const braking = speed < 300
        return {
          ...s,
          telemetry: {
            ...s.telemetry,
            speed: Math.max(80, Math.min(350, speed)),
            rpm: Math.round(jitter(s.telemetry.rpm, 600)),
            throttle: braking ? Math.round(jitter(40, 40)) : Math.round(jitter(95, 10)),
            brake: braking ? Math.round(jitter(60, 40)) : 0,
            gear: Math.max(1, Math.min(8, s.telemetry.gear + (Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0))),
            delta: jitter(s.telemetry.delta, 0.15),
          },
          lastLapTime: `1:${(30 + Math.random() * 2).toFixed(3)}`,
        }
      }),
    })),
}))
