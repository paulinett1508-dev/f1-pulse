import { useF1Store } from '@/stores/f1Store'
import { RaceCard } from '@/components/race/RaceCard'
import type { SessionStatus } from '@/types/f1'

function getSessionStatus(dateStr: string): SessionStatus {
  const now = new Date()
  const raceDate = new Date(dateStr)
  const diffHours = (raceDate.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (diffHours < -3) return 'finished'
  if (diffHours < 3) return 'live'
  return 'upcoming'
}

export default function Races() {
  const { races } = useF1Store()

  const upcoming = races.filter((r) => getSessionStatus(r.date) === 'upcoming')
  const finished = races.filter((r) => getSessionStatus(r.date) === 'finished')
  const live = races.filter((r) => getSessionStatus(r.date) === 'live')

  return (
    <div className="space-y-3 sm:space-y-6">
      <div>
        <h1 className="text-lg font-bold sm:text-2xl">Corridas</h1>
        <p className="text-[10px] text-neutral-400 sm:text-sm">
          Calendário da temporada 2026
        </p>
      </div>

      {live.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-f1red sm:mb-3 sm:text-sm">
            Ao Vivo
          </h2>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {live.map((race) => (
              <RaceCard key={race.id} race={race} status="live" />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 sm:mb-3 sm:text-sm">
            Próximas Corridas
          </h2>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((race) => (
              <RaceCard key={race.id} race={race} status="upcoming" />
            ))}
          </div>
        </section>
      )}

      {finished.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 sm:mb-3 sm:text-sm">
            Encerradas
          </h2>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {finished.map((race) => (
              <RaceCard key={race.id} race={race} status="finished" />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
