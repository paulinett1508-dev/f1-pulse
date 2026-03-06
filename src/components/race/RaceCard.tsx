import { MapPin, Calendar, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Race, SessionStatus, SessionType } from '@/types/f1'

interface RaceCardProps {
  race: Race
  status: SessionStatus
  className?: string
}

const statusConfig: Record<SessionStatus, { label: string; variant: 'red' | 'green' | 'yellow' }> = {
  live: { label: 'AO VIVO', variant: 'red' },
  upcoming: { label: 'EM BREVE', variant: 'yellow' },
  finished: { label: 'ENCERRADA', variant: 'green' },
}

const sessionIcon: Partial<Record<SessionType, string>> = {
  'sprint-shootout': 'SS',
  'sprint': 'SP',
  'qualifying': 'Q',
  'race': 'R',
  'practice': 'TL',
}

export function RaceCard({ race, status, className }: RaceCardProps) {
  const config = statusConfig[status]

  return (
    <div className={cn('rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 transition-colors hover:border-neutral-700', className)}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium uppercase text-neutral-500">Round {race.round}</p>
            {race.hasSprint && (
              <span className="inline-flex items-center gap-0.5 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-400">
                <Zap className="h-2.5 w-2.5 fill-amber-400" />
                Sprint
              </span>
            )}
          </div>
          <h3 className="mt-1 text-lg font-bold">{race.name}</h3>
        </div>
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>

      <div className="flex flex-col gap-2 text-sm text-neutral-400">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" />
          <span>{race.circuit}, {race.country}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5" />
          <span>{race.date}</span>
        </div>
      </div>

      {/* Session timeline */}
      {race.sessions && race.sessions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-neutral-800/60 pt-3">
          {race.sessions.map((session, i) => {
            const icon = sessionIcon[session.type] ?? '?'
            const isSprint = session.type === 'sprint' || session.type === 'sprint-shootout'
            return (
              <span
                key={i}
                title={`${session.label} — ${session.date}`}
                className={cn(
                  'inline-flex h-6 items-center justify-center rounded px-1.5 text-[10px] font-bold uppercase tracking-wide',
                  isSprint
                    ? 'bg-amber-500/15 text-amber-400'
                    : session.type === 'race'
                      ? 'bg-f1red/15 text-f1red'
                      : session.type === 'qualifying'
                        ? 'bg-blue-500/15 text-blue-400'
                        : 'bg-neutral-800 text-neutral-500',
                )}
              >
                {icon}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
