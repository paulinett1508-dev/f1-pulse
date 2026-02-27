import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Trophy, Zap, Gauge, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Standing } from '@/types/f1'

interface DriverCardProps {
  standing: Standing
  index?: number
  className?: string
}

const tyreColors: Record<string, string> = {
  soft: '#E10600',
  medium: '#F5C623',
  hard: '#EBEBEB',
  inter: '#43B02A',
  wet: '#0072CE',
}

function TelemetryBar({ label, value, max, color, glow }: {
  label: string
  value: number
  max: number
  color: string
  glow?: boolean
}) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-8 text-[9px] uppercase tracking-wider text-neutral-600">{label}</span>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-800">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18, mass: 0.6 }}
        />
        {glow && pct > 60 && (
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full blur-sm"
            style={{ backgroundColor: color, opacity: 0.5 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 18, mass: 0.6 }}
          />
        )}
      </div>
      <motion.span
        className="w-10 text-right font-mono text-[9px] tabular-nums text-neutral-500"
        key={value}
        initial={{ opacity: 0.5, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {value}
      </motion.span>
    </div>
  )
}

export function DriverCard({ standing, index = 0, className }: DriverCardProps) {
  const isLeader = standing.position === 1
  const isPodium = standing.position <= 3
  const hasTelemetry = !!standing.telemetry

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={standing.driver.id}
        layout
        layoutId={standing.driver.id}
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 24, scale: 0.96 }}
        transition={{
          layout: { type: 'spring', stiffness: 500, damping: 35 },
          opacity: { duration: 0.25 },
          x: { duration: 0.35, delay: index * 0.04 },
        }}
        whileHover={{ x: 4 }}
        className={cn(
          'group relative overflow-hidden rounded-lg border backdrop-blur-sm',
          'bg-gradient-to-r from-neutral-950/90 to-neutral-950/70',
          isPodium ? 'border-neutral-700/80' : 'border-neutral-800/50',
          className,
        )}
      >
        {/* Team color left accent */}
        <div
          className="absolute inset-y-0 left-0 w-[3px]"
          style={{ backgroundColor: standing.team.color }}
        />

        {/* HUD corner brackets for podium */}
        {isPodium && (
          <>
            <div className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-f1red/30" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-f1red/30" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-f1red/[0.03] via-transparent to-transparent" />
          </>
        )}

        {/* Main row — responsive: stack on mobile */}
        <div className="flex flex-col gap-2 py-2.5 pl-4 pr-3 sm:flex-row sm:items-center sm:gap-3">
          {/* Top section: position + driver info */}
          <div className="flex flex-1 items-center gap-3">
            {/* Position badge */}
            <motion.div
              layout
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded font-bold tabular-nums sm:h-9 sm:w-9',
                isLeader
                  ? 'bg-f1red text-white shadow-lg shadow-f1red/20'
                  : isPodium
                    ? 'bg-neutral-800 text-white'
                    : 'bg-neutral-900/80 text-neutral-500 text-sm',
              )}
            >
              P{standing.position}
            </motion.div>

            {/* Driver number + name */}
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <span
                className="text-base font-extrabold tabular-nums opacity-25 sm:text-lg"
                style={{ color: standing.team.color }}
              >
                {standing.driver.number}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold leading-tight tracking-tight sm:text-base">
                    {standing.driver.name}
                  </p>
                  {standing.tyre && (
                    <span
                      className="inline-block h-3 w-3 shrink-0 rounded-full border border-neutral-700"
                      style={{ backgroundColor: tyreColors[standing.tyre] }}
                      title={standing.tyre.toUpperCase()}
                    />
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                  <span className="truncate">{standing.team.name}</span>
                  {standing.pitstops !== undefined && (
                    <span className="text-neutral-600">PIT {standing.pitstops}x</span>
                  )}
                </div>
              </div>
            </div>

            {/* Gap — always visible, compact on mobile */}
            {standing.gap && (
              <span className={cn(
                'shrink-0 font-mono text-xs tabular-nums sm:hidden',
                standing.gap === 'LEADER' ? 'font-semibold text-f1red' : 'text-neutral-500',
              )}>
                {standing.gap}
              </span>
            )}
          </div>

          {/* Telemetry bars — visible on mobile as compact row, full on lg */}
          {hasTelemetry && (
            <>
              {/* Mobile: compact inline telemetry */}
              <div className="flex items-center gap-3 pl-11 text-[10px] sm:hidden">
                <div className="flex items-center gap-1">
                  <Gauge className="h-2.5 w-2.5 text-neutral-600" />
                  <span className="font-mono font-semibold tabular-nums text-neutral-300">
                    {standing.telemetry!.speed}
                  </span>
                  <span className="text-[8px] text-neutral-600">km/h</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-neutral-600">RPM</span>
                  <span className="font-mono tabular-nums text-neutral-400">{standing.telemetry!.rpm}</span>
                </div>
                <span className="rounded bg-neutral-800 px-1 py-0.5 font-mono text-[9px] font-bold text-neutral-400">
                  G{standing.telemetry!.gear}
                </span>
                {standing.telemetry!.drs && (
                  <span className="rounded bg-green-900/40 px-1 py-0.5 text-[9px] font-bold text-green-400">DRS</span>
                )}
              </div>

              {/* Desktop: full telemetry bars */}
              <div className="hidden w-40 flex-col gap-0.5 border-l border-neutral-800/60 pl-3 sm:flex">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-center gap-1">
                    <Gauge className="h-2.5 w-2.5 text-neutral-600" />
                    <motion.span
                      className="font-mono text-xs font-semibold tabular-nums text-neutral-300"
                      key={standing.telemetry!.speed}
                      initial={{ opacity: 0.6, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      {standing.telemetry!.speed}
                    </motion.span>
                    <span className="text-[8px] text-neutral-600">KM/H</span>
                  </div>
                  <motion.span
                    className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-[10px] font-bold text-neutral-400"
                    key={standing.telemetry!.gear}
                    initial={{ scale: 1.2, color: '#f5f5f5' }}
                    animate={{ scale: 1, color: '#a3a3a3' }}
                    transition={{ duration: 0.25 }}
                  >
                    G{standing.telemetry!.gear}
                  </motion.span>
                </div>

                <TelemetryBar
                  label="SPD"
                  value={standing.telemetry!.speed}
                  max={370}
                  color={isLeader ? '#E10600' : '#525252'}
                  glow={isLeader}
                />

                <TelemetryBar
                  label="RPM"
                  value={standing.telemetry!.rpm}
                  max={15000}
                  color={standing.telemetry!.rpm > 11000 ? '#E10600' : '#525252'}
                  glow={isLeader}
                />

                <div className="flex gap-1">
                  <div className="flex-1">
                    <TelemetryBar label="THR" value={standing.telemetry!.throttle} max={100} color="#22C55E" />
                  </div>
                  <div className="flex-1">
                    <TelemetryBar label="BRK" value={standing.telemetry!.brake} max={100} color="#E10600" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Lap time + delta + gap + points — right section */}
          <div className="hidden items-center gap-3 sm:flex">
            {standing.lastLapTime && (
              <div className="relative flex items-center gap-1.5">
                <Timer className="h-3 w-3 text-neutral-600" />

                {standing.isFastestLap && (
                  <motion.div
                    className="absolute -inset-2 rounded-md bg-f1red/20"
                    animate={{ opacity: [0.1, 0.5, 0.1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
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

            {standing.telemetry && (
              <div className="flex items-center gap-1">
                <Activity className="h-2.5 w-2.5 text-neutral-600" />
                <motion.span
                  key={standing.telemetry.delta}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'font-mono text-[11px] font-semibold tabular-nums',
                    standing.telemetry.delta < 0 ? 'text-green-400' : 'text-f1red',
                  )}
                >
                  {standing.telemetry.delta > 0 ? '+' : ''}{standing.telemetry.delta.toFixed(3)}
                </motion.span>
              </div>
            )}

            {standing.gap && (
              <span className={cn(
                'w-16 text-right font-mono text-xs tabular-nums',
                standing.gap === 'LEADER' ? 'font-semibold text-f1red' : 'text-neutral-500',
              )}>
                {standing.gap}
              </span>
            )}

            <div className="flex items-center gap-2 border-l border-neutral-800/60 pl-3">
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

          {/* Mobile: bottom row with lap time, gap, points */}
          <div className="flex items-center justify-between pl-11 sm:hidden">
            <div className="flex items-center gap-3">
              {standing.lastLapTime && (
                <div className="relative flex items-center gap-1">
                  <Timer className="h-2.5 w-2.5 text-neutral-600" />
                  <span className={cn(
                    'relative z-10 font-mono text-[10px] font-medium tabular-nums',
                    standing.isFastestLap ? 'text-f1red' : 'text-neutral-400',
                  )}>
                    {standing.lastLapTime}
                  </span>
                  {standing.isFastestLap && (
                    <Zap className="h-2.5 w-2.5 fill-f1red text-f1red" />
                  )}
                </div>
              )}

              {standing.telemetry && (
                <span className={cn(
                  'font-mono text-[10px] font-semibold tabular-nums',
                  standing.telemetry.delta < 0 ? 'text-green-400' : 'text-f1red',
                )}>
                  {standing.telemetry.delta > 0 ? '+' : ''}{standing.telemetry.delta.toFixed(3)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <span className="font-mono text-xs font-bold tabular-nums">{standing.points}</span>
              <span className="text-[9px] text-neutral-600">PTS</span>
              {standing.wins > 0 && (
                <Trophy className="h-2.5 w-2.5 text-amber-500" />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
