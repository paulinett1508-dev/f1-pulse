import { motion } from 'framer-motion'
import { Flag, Radio, TrendingUp, Users } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { DriverCard } from '@/components/race/DriverCard'
import { useF1Store } from '@/stores/f1Store'

function StatCard({ icon: Icon, label, value, accent }: {
  icon: React.ElementType
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <Icon className="h-4 w-4 text-neutral-600" />
      </CardHeader>
      <p className={`text-2xl font-bold ${accent ? 'text-f1red' : ''}`}>{value}</p>
    </Card>
  )
}

export function Dashboard() {
  const { standings, races, isLive } = useF1Store()

  const leader = standings[0]
  const nextRace = races.find((_, i) => i >= 6) // GP de Mônaco (round 7)
  const fastestDriver = standings.find((s) => s.isFastestLap)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-neutral-400">
          Acompanhe a temporada de F1 em tempo real
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Flag}
          label="Próxima Corrida"
          value={nextRace?.name ?? '—'}
        />
        <StatCard
          icon={TrendingUp}
          label="Líder do Mundial"
          value={leader?.driver.name ?? '—'}
        />
        <StatCard
          icon={Users}
          label="Pilotos Classificados"
          value={String(standings.length)}
        />
        <StatCard
          icon={Radio}
          label="Status da Sessão"
          value={isLive ? 'AO VIVO' : 'Offline'}
          accent={isLive}
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Driver standings */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-0">
            <div className="border-b border-neutral-800 px-4 py-3">
              <div className="flex items-center justify-between">
                <CardTitle>Classificação de Pilotos</CardTitle>
                {fastestDriver && (
                  <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-f1red">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-f1red" />
                    Volta rápida: {fastestDriver.driver.name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 p-2">
              {standings.map((standing, i) => (
                <DriverCard key={standing.driver.id} standing={standing} index={i} />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Upcoming races */}
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <div className="flex flex-col gap-3">
            {races.slice(0, 6).map((race) => (
              <div key={race.id} className="flex items-start gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-800 text-[10px] font-bold text-neutral-400">
                  R{race.round}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{race.name}</p>
                  <p className="truncate text-xs text-neutral-500">
                    {race.circuit} — {race.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
