import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { Card, CardTitle } from '@/components/ui/Card'
import { DriverCard } from '@/components/race/DriverCard'
import { useF1Store } from '@/stores/f1Store'
import { useLiveData } from '@/hooks/useLiveData'
import type { Team } from '@/types/f1'

type Tab = 'drivers' | 'constructors'

interface ConstructorStanding {
  team: Team
  points: number
  wins: number
}

function buildConstructorStandings(standings: ReturnType<typeof useF1Store>['standings']): ConstructorStanding[] {
  const map = new Map<string, ConstructorStanding>()

  for (const s of standings) {
    const existing = map.get(s.team.id)
    if (existing) {
      existing.points += s.points
      existing.wins += s.wins
    } else {
      map.set(s.team.id, { team: s.team, points: s.points, wins: s.wins })
    }
  }

  return Array.from(map.values()).sort((a, b) => b.points - a.points)
}

export default function Standings() {
  const { standings } = useF1Store()
  useLiveData(true)

  const [tab, setTab] = useState<Tab>('drivers')
  const constructors = buildConstructorStandings(standings)

  return (
    <div className="space-y-3 sm:space-y-6">
      <div>
        <h1 className="text-lg font-bold sm:text-2xl">Classificação</h1>
        <p className="text-[10px] text-neutral-400 sm:text-sm">
          Campeonato de Pilotos e Construtores
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-neutral-800 bg-neutral-900/50 p-1">
        {(['drivers', 'constructors'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
              tab === t
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {t === 'drivers' ? 'Pilotos' : 'Construtores'}
          </button>
        ))}
      </div>

      {tab === 'drivers' ? (
        <Card className="p-0">
          <div className="border-b border-neutral-800 px-2.5 py-2 sm:px-4 sm:py-3">
            <CardTitle className="text-[10px] sm:text-sm">Campeonato de Pilotos</CardTitle>
          </div>
          <div className="flex flex-col gap-0.5 p-1 sm:gap-1 sm:p-2">
            <AnimatePresence mode="popLayout">
              {standings.map((standing, i) => (
                <DriverCard key={standing.driver.id} standing={standing} index={i} />
              ))}
            </AnimatePresence>
          </div>
        </Card>
      ) : (
        <Card className="p-0">
          <div className="border-b border-neutral-800 px-2.5 py-2 sm:px-4 sm:py-3">
            <CardTitle className="text-[10px] sm:text-sm">Campeonato de Construtores</CardTitle>
          </div>
          <div className="flex flex-col gap-1 p-2 sm:gap-2 sm:p-3">
            {constructors.map((c, i) => (
              <div
                key={c.team.id}
                className="flex items-center gap-3 rounded-lg border border-neutral-800/50 bg-gradient-to-r from-neutral-950/90 to-neutral-950/70 px-3 py-2.5 sm:px-4 sm:py-3"
              >
                <div
                  className="absolute inset-y-0 left-0 w-[3px] rounded-l"
                  style={{ backgroundColor: c.team.color }}
                />
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-bold tabular-nums sm:h-9 sm:w-9 sm:text-base ${
                  i === 0 ? 'bg-f1red text-white' : i < 3 ? 'bg-neutral-800 text-white' : 'bg-neutral-900/80 text-neutral-500'
                }`}>
                  {i + 1}
                </span>
                <div
                  className="h-5 w-1 rounded-full sm:h-6"
                  style={{ backgroundColor: c.team.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold sm:text-base">{c.team.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-bold tabular-nums">{c.points}</p>
                    <p className="text-[10px] uppercase tracking-wider text-neutral-600">PTS</p>
                  </div>
                  {c.wins > 0 && (
                    <div className="flex items-center gap-0.5 text-amber-500">
                      <Trophy className="h-3 w-3" />
                      <span className="text-[10px] font-bold">{c.wins}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
