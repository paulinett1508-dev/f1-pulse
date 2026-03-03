import type { Team, Driver, Standing, Race } from '@/types/f1'

// ── Teams (2026 season — includes Cadillac) ──────────
export const teams: Team[] = [
  { id: 'red-bull',    name: 'Red Bull Racing',   color: '#3671C6' },
  { id: 'mclaren',     name: 'McLaren',           color: '#FF8000' },
  { id: 'ferrari',     name: 'Ferrari',           color: '#E8002D' },
  { id: 'mercedes',    name: 'Mercedes',          color: '#27F4D2' },
  { id: 'aston-martin',name: 'Aston Martin',      color: '#229971' },
  { id: 'alpine',      name: 'Alpine',            color: '#FF87BC' },
  { id: 'williams',    name: 'Williams',          color: '#64C4FF' },
  { id: 'racing-bulls',name: 'Racing Bulls',      color: '#6692FF' },
  { id: 'sauber',      name: 'Sauber',            color: '#52E252' },
  { id: 'haas',        name: 'Haas F1 Team',      color: '#B6BABD' },
  { id: 'cadillac',    name: 'Cadillac F1',       color: '#C0A44D' },
]

const t = (id: string) => teams.find((team) => team.id === id)!

// ── Drivers (2026 season) ─────────────────────────────
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

// ── Standings (mock — início de temporada, sem pontos) ─
export const standings: Standing[] = [
  { position: 1,  driver: drivers[0], team: t('red-bull'),     points: 0, wins: 0, lastLapTime: '', gap: 'LEADER',  isFastestLap: false },
  { position: 2,  driver: drivers[1], team: t('mclaren'),      points: 0, wins: 0, lastLapTime: '', gap: '',        isFastestLap: false },
  { position: 3,  driver: drivers[2], team: t('ferrari'),      points: 0, wins: 0, lastLapTime: '', gap: '',        isFastestLap: false },
  { position: 4,  driver: drivers[3], team: t('mclaren'),      points: 0, wins: 0, lastLapTime: '', gap: '',        isFastestLap: false },
  { position: 5,  driver: drivers[4], team: t('ferrari'),      points: 0, wins: 0, lastLapTime: '', gap: '',        isFastestLap: false },
  { position: 6,  driver: drivers[5], team: t('mercedes'),     points: 0, wins: 0, lastLapTime: '', gap: '',        isFastestLap: false },
  { position: 7,  driver: drivers[6], team: t('williams'),     points: 0, wins: 0, lastLapTime: '', gap: '',        isFastestLap: false },
  { position: 8,  driver: drivers[7], team: t('aston-martin'), points: 0, wins: 0, lastLapTime: '', gap: '',        isFastestLap: false },
  { position: 9,  driver: drivers[8], team: t('aston-martin'), points: 0, wins: 0, lastLapTime: '', gap: '',        isFastestLap: false },
  { position: 10, driver: drivers[9], team: t('alpine'),       points: 0, wins: 0, lastLapTime: '', gap: '',        isFastestLap: false },
]

// ── Races (calendário 2026) ──────────────────────────
export const races: Race[] = [
  { id: 'australia', name: 'GP da Austrália',         circuit: 'Albert Park Circuit',               country: 'Austrália',      date: '08 Mar 2026', round: 1 },
  { id: 'china',     name: 'GP da China',             circuit: 'Shanghai International Circuit',    country: 'China',          date: '15 Mar 2026', round: 2 },
  { id: 'japan',     name: 'GP do Japão',             circuit: 'Suzuka International Racing Course',country: 'Japão',          date: '29 Mar 2026', round: 3 },
  { id: 'bahrain',   name: 'GP do Bahrein',           circuit: 'Bahrain International Circuit',     country: 'Bahrein',        date: '12 Abr 2026', round: 4 },
  { id: 'jeddah',    name: 'GP da Arábia Saudita',    circuit: 'Jeddah Corniche Circuit',           country: 'Arábia Saudita', date: '19 Abr 2026', round: 5 },
  { id: 'miami',     name: 'GP de Miami',             circuit: 'Miami International Autodrome',     country: 'EUA',            date: '03 Mai 2026', round: 6 },
  { id: 'monaco',    name: 'GP de Mônaco',            circuit: 'Circuit de Monaco',                 country: 'Mônaco',         date: '24 Mai 2026', round: 7 },
  { id: 'spain',     name: 'GP da Espanha',           circuit: 'Circuit de Madrid',                 country: 'Espanha',        date: '07 Jun 2026', round: 8 },
]
