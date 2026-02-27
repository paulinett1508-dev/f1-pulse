import { motion } from 'framer-motion'
import { Timer, Trophy, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Standing } from '@/types/f1'

interface DriverCardProps {
  standing: Standing
  index?: number
  className?: string
}

export function DriverCard({ standing, index = 0, className }: DriverCardProps) {
  const isLeader = standing.position === 1
  const isPodium = standing.position <= 3

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ scale: 1.01, x: 4 }}
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-neutral-950/80 backdrop-blur-sm',
        isPodium ? 'border-neutral-700' : 'border-neutral-800/60',
        className,
      )}
    >
      {/* Team color accent — left edge */}
      <div
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: standing.team.color }}
      />

      {/* Scanline HUD overlay for podium */}
      {isPodium && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent" />
      )}

      <div className="flex items-center gap-3 py-3 pl-4 pr-3">
        {/* Position */}
        <div className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded font-bold tabular-nums',
          isLeader
            ? 'bg-f1red text-white text-base'
            : isPodium
              ? 'bg-neutral-800 text-white text-base'
              : 'bg-neutral-900 text-neutral-500 text-sm',
        )}>
          P{standing.position}
        </div>

        {/* Driver number + name */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span
            className="text-lg font-extrabold tabular-nums opacity-30"
            style={{ color: standing.team.color }}
          >
            {standing.driver.number}
          </span>

          <div className="min-w-0">
            <p className="truncate font-semibold leading-tight tracking-tight">
              {standing.driver.name}
            </p>
            <p className="truncate text-xs text-neutral-500">
              {standing.team.name}
            </p>
          </div>
        </div>

        {/* Lap time — with fastest-lap pulse */}
        <div className="flex items-center gap-3">
          {standing.lastLapTime && (
            <div className="relative flex items-center gap-1.5">
              <Timer className="h-3 w-3 text-neutral-600" />

              {standing.isFastestLap && (
                <motion.div
                  className="absolute -inset-2 rounded-md bg-f1red/20"
                  animate={{ opacity: [0.15, 0.5, 0.15] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              <span className={cn(
                'relative z-10 font-mono text-xs font-medium tabular-nums',
                standing.isFastestLap ? 'text-f1red' : 'text-neutral-400',
              )}>
                {standing.lastLapTime}
              </span>

              {standing.isFastestLap && (
                <Zap className="relative z-10 h-3 w-3 fill-f1red text-f1red" />
              )}
            </div>
          )}

          {/* Gap */}
          {standing.gap && (
            <span className={cn(
              'w-16 text-right font-mono text-xs tabular-nums',
              standing.gap === 'LEADER' ? 'font-semibold text-f1red' : 'text-neutral-500',
            )}>
              {standing.gap}
            </span>
          )}
        </div>

        {/* Points */}
        <div className="flex items-center gap-2 border-l border-neutral-800 pl-3">
          <div className="text-right">
            <p className="text-sm font-bold tabular-nums">{standing.points}</p>
            <p className="text-[10px] uppercase tracking-wider text-neutral-600">PTS</p>
          </div>
          {standing.wins > 0 && (
            <div className="flex items-center gap-0.5 text-amber-500">
              <Trophy className="h-3 w-3" />
              <span className="text-[10px] font-bold">{standing.wins}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
