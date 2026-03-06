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
// Photos from the official F1 media CDN (public headshots)
const f1Img = (slug: string) => `https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_300/content/dam/fom-website/drivers/2025Drivers/${slug}`

export const drivers: Driver[] = [
  { id: 'VER', name: 'Max Verstappen',    number: 1,  team: 'red-bull',     country: 'NED', photo: f1Img('vermax01.png') },
  { id: 'NOR', name: 'Lando Norris',      number: 4,  team: 'mclaren',      country: 'GBR', photo: f1Img('norlan01.png') },
  { id: 'LEC', name: 'Charles Leclerc',   number: 16, team: 'ferrari',      country: 'MON', photo: f1Img('leccha01.png') },
  { id: 'PIA', name: 'Oscar Piastri',     number: 81, team: 'mclaren',      country: 'AUS', photo: f1Img('piaosc01.png') },
  { id: 'HAM', name: 'Lewis Hamilton',    number: 44, team: 'ferrari',      country: 'GBR', photo: f1Img('hamlew01.png') },
  { id: 'RUS', name: 'George Russell',    number: 63, team: 'mercedes',     country: 'GBR', photo: f1Img('rusgeo01.png') },
  { id: 'SAI', name: 'Carlos Sainz',      number: 55, team: 'williams',     country: 'ESP', photo: f1Img('saicar01.png') },
  { id: 'ALO', name: 'Fernando Alonso',   number: 14, team: 'aston-martin', country: 'ESP', photo: f1Img('alofer01.png') },
  { id: 'STR', name: 'Lance Stroll',      number: 18, team: 'aston-martin', country: 'CAN', photo: f1Img('strlan01.png') },
  { id: 'GAS', name: 'Pierre Gasly',      number: 10, team: 'alpine',       country: 'FRA', photo: f1Img('gaspie01.png') },
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

// ── Session helpers ─────────────────────────────────
// Standard weekend: FP1 (Sex), FP2 (Sex), FP3 (Sáb), Quali (Sáb), Race (Dom)
function stdSessions(fri: string, sat: string, sun: string): Race['sessions'] {
  return [
    { type: 'practice',   date: fri, label: 'Treino Livre 1' },
    { type: 'practice',   date: fri, label: 'Treino Livre 2' },
    { type: 'practice',   date: sat, label: 'Treino Livre 3' },
    { type: 'qualifying', date: sat, label: 'Classificação' },
    { type: 'race',       date: sun, label: 'Corrida' },
  ]
}

// Sprint weekend: FP1 (Sex), Quali (Sex), Sprint Shootout (Sáb), Sprint (Sáb), Race (Dom)
function sprintSessions(fri: string, sat: string, sun: string): Race['sessions'] {
  return [
    { type: 'practice',         date: fri, label: 'Treino Livre 1' },
    { type: 'qualifying',       date: fri, label: 'Classificação' },
    { type: 'sprint-shootout',  date: sat, label: 'Sprint Shootout' },
    { type: 'sprint',           date: sat, label: 'Sprint' },
    { type: 'race',             date: sun, label: 'Corrida' },
  ]
}

// ── Races (calendário 2026) ──────────────────────────
export const races: Race[] = [
  { id: 'australia', name: 'GP da Austrália',         circuit: 'Albert Park Circuit',               country: 'Austrália',      date: '08 Mar 2026', round: 1,  hasSprint: false, sessions: stdSessions('06 Mar 2026', '07 Mar 2026', '08 Mar 2026') },
  { id: 'china',     name: 'GP da China',             circuit: 'Shanghai International Circuit',    country: 'China',          date: '15 Mar 2026', round: 2,  hasSprint: true,  sessions: sprintSessions('13 Mar 2026', '14 Mar 2026', '15 Mar 2026') },
  { id: 'japan',     name: 'GP do Japão',             circuit: 'Suzuka International Racing Course',country: 'Japão',          date: '29 Mar 2026', round: 3,  hasSprint: false, sessions: stdSessions('27 Mar 2026', '28 Mar 2026', '29 Mar 2026') },
  { id: 'bahrain',   name: 'GP do Bahrein',           circuit: 'Bahrain International Circuit',     country: 'Bahrein',        date: '12 Abr 2026', round: 4,  hasSprint: false, sessions: stdSessions('10 Abr 2026', '11 Abr 2026', '12 Abr 2026') },
  { id: 'jeddah',    name: 'GP da Arábia Saudita',    circuit: 'Jeddah Corniche Circuit',           country: 'Arábia Saudita', date: '19 Abr 2026', round: 5,  hasSprint: false, sessions: stdSessions('17 Abr 2026', '18 Abr 2026', '19 Abr 2026') },
  { id: 'miami',     name: 'GP de Miami',             circuit: 'Miami International Autodrome',     country: 'EUA',            date: '03 Mai 2026', round: 6,  hasSprint: true,  sessions: sprintSessions('01 Mai 2026', '02 Mai 2026', '03 Mai 2026') },
  { id: 'monaco',    name: 'GP de Mônaco',            circuit: 'Circuit de Monaco',                 country: 'Mônaco',         date: '24 Mai 2026', round: 7,  hasSprint: false, sessions: stdSessions('22 Mai 2026', '23 Mai 2026', '24 Mai 2026') },
  { id: 'spain',     name: 'GP da Espanha',           circuit: 'Circuit de Madrid',                 country: 'Espanha',        date: '07 Jun 2026', round: 8,  hasSprint: false, sessions: stdSessions('05 Jun 2026', '06 Jun 2026', '07 Jun 2026') },
]
