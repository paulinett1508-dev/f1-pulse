import type { Driver, Team, Standing, Race } from '@/types/f1'

export const mockTeam: Team = {
  id: 'red-bull',
  name: 'Red Bull Racing',
  color: '#3671C6',
}

export const mockDriver: Driver = {
  id: 'VER',
  name: 'Max Verstappen',
  number: 1,
  team: 'red-bull',
  country: 'NED',
}

export const mockDriver2: Driver = {
  id: 'NOR',
  name: 'Lando Norris',
  number: 4,
  team: 'mclaren',
  country: 'GBR',
}

export const mockTeam2: Team = {
  id: 'mclaren',
  name: 'McLaren',
  color: '#FF8000',
}

export const mockStanding: Standing = {
  position: 1,
  driver: mockDriver,
  team: mockTeam,
  points: 25,
  wins: 1,
  lastLapTime: '1:30.456',
  gap: 'LEADER',
  isFastestLap: true,
}

export const mockStanding2: Standing = {
  position: 2,
  driver: mockDriver2,
  team: mockTeam2,
  points: 18,
  wins: 0,
  lastLapTime: '1:30.789',
  gap: '+0.333',
  isFastestLap: false,
}

export const mockRace: Race = {
  id: 'australia',
  name: 'GP da Austrália',
  circuit: 'Albert Park Circuit',
  country: 'Austrália',
  date: '08 Mar 2026',
  round: 1,
}
