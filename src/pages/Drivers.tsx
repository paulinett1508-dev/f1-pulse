import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useF1Store } from '@/stores/f1Store'

export default function Drivers() {
  const { standings } = useF1Store()

  return (
    <div className="space-y-3 sm:space-y-6">
      <div>
        <h1 className="text-lg font-bold sm:text-2xl">Pilotos</h1>
        <p className="text-[10px] text-neutral-400 sm:text-sm">
          Grid da temporada 2026
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {standings.map((s, i) => (
          <motion.div
            key={s.driver.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              'relative overflow-hidden rounded-xl border bg-gradient-to-br from-neutral-950/90 to-neutral-900/70 p-4 transition-colors hover:border-neutral-700',
              s.position <= 3 ? 'border-neutral-700/80' : 'border-neutral-800/50',
            )}
          >
            {/* Team color accent */}
            <div
              className="absolute inset-y-0 left-0 w-[3px]"
              style={{ backgroundColor: s.team.color }}
            />

            <div className="flex items-start gap-3 pl-1">
              {/* Driver number */}
              <span
                className="text-3xl font-extrabold tabular-nums opacity-20 sm:text-4xl"
                style={{ color: s.team.color }}
              >
                {s.driver.number}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold sm:text-lg">{s.driver.name}</p>
                <p className="text-[10px] text-neutral-500 sm:text-xs">{s.team.name}</p>
                <p className="mt-0.5 text-[9px] uppercase tracking-wider text-neutral-600 sm:text-[10px]">
                  {s.driver.country}
                </p>
              </div>

              {/* Position badge */}
              <div className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold tabular-nums sm:h-10 sm:w-10 sm:text-sm',
                s.position === 1 ? 'bg-f1red text-white shadow-lg shadow-f1red/20'
                  : s.position <= 3 ? 'bg-neutral-800 text-white'
                  : 'bg-neutral-900/80 text-neutral-500',
              )}>
                P{s.position}
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-3 flex items-center gap-3 border-t border-neutral-800/60 pt-3">
              <div>
                <p className="text-sm font-bold tabular-nums">{s.points}</p>
                <p className="text-[9px] uppercase tracking-wider text-neutral-600">Pontos</p>
              </div>
              {s.wins > 0 && (
                <div className="flex items-center gap-1 text-amber-500">
                  <Trophy className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold">{s.wins}</span>
                  <span className="text-[9px] text-neutral-600">vitórias</span>
                </div>
              )}
              {s.lastLapTime && (
                <div className="ml-auto text-right">
                  <p className="font-mono text-[10px] tabular-nums text-neutral-400 sm:text-xs">
                    {s.lastLapTime}
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-neutral-600">Última volta</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
