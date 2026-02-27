import { MapPin, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Race, SessionStatus } from '@/types/f1'

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

export function RaceCard({ race, status, className }: RaceCardProps) {
  const config = statusConfig[status]

  return (
    <div className={cn('rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 transition-colors hover:border-neutral-700', className)}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-neutral-500">Round {race.round}</p>
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
    </div>
  )
}
