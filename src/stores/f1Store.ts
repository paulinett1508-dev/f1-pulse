import { create } from 'zustand'
import type { Driver, Race, Standing } from '@/types/f1'
import { drivers as mockDrivers, races as mockRaces, standings as mockStandings } from './mockData'

interface F1State {
  drivers: Driver[]
  races: Race[]
  standings: Standing[]
  isLive: boolean
  setDrivers: (drivers: Driver[]) => void
  setRaces: (races: Race[]) => void
  setStandings: (standings: Standing[]) => void
  setIsLive: (isLive: boolean) => void
}

export const useF1Store = create<F1State>((set) => ({
  drivers: mockDrivers,
  races: mockRaces,
  standings: mockStandings,
  isLive: true,
  setDrivers: (drivers) => set({ drivers }),
  setRaces: (races) => set({ races }),
  setStandings: (standings) => set({ standings }),
  setIsLive: (isLive) => set({ isLive }),
}))
