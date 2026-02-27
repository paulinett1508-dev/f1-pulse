import type { Team, Driver, Standing, Race } from '@/types/f1'

// ── Teams ──────────────────────────────────────────────
export const teams: Team[] = [
  { id: 'red-bull',    name: 'Red Bull Racing',   color: '#3671C6' },
  { id: 'mclaren',     name: 'McLaren',           color: '#FF8000' },
  { id: 'ferrari',     name: 'Ferrari',           color: '#E8002D' },
  { id: 'mercedes',    name: 'Mercedes',          color: '#27F4D2' },
  { id: 'aston-martin',name: 'Aston Martin',      color: '#229971' },
  { id: 'alpine',      name: 'Alpine',            color: '#FF87BC' },
  { id: 'williams',    name: 'Williams',          color: '#64C4FF' },
  { id: 'rb',          name: 'RB',                color: '#6692FF' },
  { id: 'kick-sauber', name: 'Kick Sauber',       color: '#52E252' },
  { id: 'haas',        name: 'Haas F1 Team',      color: '#B6BABD' },
]

const t = (id: string) => teams.find((team) => team.id === id)!

// ── Drivers ────────────────────────────────────────────
export const drivers: Driver[] = [
  { id: 'VER', name: 'Max Verstappen',    number: 1,  team: 'red-bull',     country: 'NED' },
  { id: 'NOR', name: 'Lando Norris',      number: 4,  team: 'mclaren',      country: 'GBR' },
  { id: 'LEC', name: 'Charles Leclerc',   number: 16, team: 'ferrari',      country: 'MON' },
  { id: 'PIA', name: 'Oscar Piastri',     number: 81, team: 'mclaren',      country: 'AUS' },
  { id: 'HAM', name: 'Lewis Hamilton',    number: 44, team: 'ferrari',      country: 'GBR' },
  { id: 'RUS', name: 'George Russell',    number: 63, team: 'mercedes',     country: 'GBR' },
  { id: 'SAI', name: 'Carlos Sainz',      number: 55, team: 'williams',     country: 'ESP' },
  { id: 'ALO', name: 'Fernando Alonso',   number: 14, team: 'aston-martin', country: 'ESP' },
  { id: 'STR', name: 'Lance Stroll',      number: 18, team: 'aston-martin', country: 'CAN' },
  { id: 'GAS', name: 'Pierre Gasly',      number: 10, team: 'alpine',       country: 'FRA' },
]

// ── Standings (mock classificação atual) ───────────────
export const standings: Standing[] = [
  { position: 1,  driver: drivers[0], team: t('red-bull'),     points: 161, wins: 4, lastLapTime: '1:31.045', gap: 'LEADER',  isFastestLap: false },
  { position: 2,  driver: drivers[1], team: t('mclaren'),      points: 138, wins: 2, lastLapTime: '1:31.198', gap: '+0.153',  isFastestLap: false },
  { position: 3,  driver: drivers[2], team: t('ferrari'),      points: 128, wins: 2, lastLapTime: '1:30.917', gap: '+0.402',  isFastestLap: true },
  { position: 4,  driver: drivers[3], team: t('mclaren'),      points: 112, wins: 1, lastLapTime: '1:31.334', gap: '+0.712',  isFastestLap: false },
  { position: 5,  driver: drivers[4], team: t('ferrari'),      points: 105, wins: 1, lastLapTime: '1:31.501', gap: '+1.045',  isFastestLap: false },
  { position: 6,  driver: drivers[5], team: t('mercedes'),     points: 90,  wins: 1, lastLapTime: '1:31.622', gap: '+1.203',  isFastestLap: false },
  { position: 7,  driver: drivers[6], team: t('williams'),     points: 55,  wins: 0, lastLapTime: '1:31.789', gap: '+1.567',  isFastestLap: false },
  { position: 8,  driver: drivers[7], team: t('aston-martin'), points: 42,  wins: 0, lastLapTime: '1:31.901', gap: '+1.890',  isFastestLap: false },
  { position: 9,  driver: drivers[8], team: t('aston-martin'), points: 20,  wins: 0, lastLapTime: '1:32.045', gap: '+2.101',  isFastestLap: false },
  { position: 10, driver: drivers[9], team: t('alpine'),       points: 15,  wins: 0, lastLapTime: '1:32.200', gap: '+2.334',  isFastestLap: false },
]

// ── Races (calendário mock) ────────────────────────────
export const races: Race[] = [
  { id: 'bahrain',   name: 'GP do Bahrein',    circuit: 'Bahrain International Circuit', country: 'Bahrein',    date: '02 Mar 2025', round: 1 },
  { id: 'jeddah',    name: 'GP da Arábia Saudita', circuit: 'Jeddah Corniche Circuit', country: 'Arábia Saudita', date: '09 Mar 2025', round: 2 },
  { id: 'australia', name: 'GP da Austrália',   circuit: 'Albert Park Circuit',          country: 'Austrália',   date: '23 Mar 2025', round: 3 },
  { id: 'japan',     name: 'GP do Japão',       circuit: 'Suzuka International Racing Course', country: 'Japão', date: '06 Abr 2025', round: 4 },
  { id: 'china',     name: 'GP da China',       circuit: 'Shanghai International Circuit', country: 'China',     date: '20 Abr 2025', round: 5 },
  { id: 'miami',     name: 'GP de Miami',       circuit: 'Miami International Autodrome', country: 'EUA',       date: '04 Mai 2025', round: 6 },
  { id: 'monaco',    name: 'GP de Mônaco',      circuit: 'Circuit de Monaco',            country: 'Mônaco',     date: '25 Mai 2025', round: 7 },
  { id: 'spain',     name: 'GP da Espanha',     circuit: 'Circuit de Barcelona-Catalunya', country: 'Espanha',  date: '01 Jun 2025', round: 8 },
]
