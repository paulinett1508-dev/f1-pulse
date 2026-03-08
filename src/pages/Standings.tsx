import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Trophy, RefreshCw, AlertCircle, Flag } from 'lucide-react'
import { Card, CardTitle } from '@/components/ui/Card'
import {
  getChampionshipStandings,
  constructorColor,
  driverPhoto,
  type JolpicaDriverStanding,
  type JolpicaConstructorStanding,
} from '@/lib/jolpica'

type Tab = 'drivers' | 'constructors'

// ── Loading skeleton ────────────────────────────────────────────────────────

function SkeletonRow({ wide }: { wide?: boolean }) {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-lg border border-neutral-800/40 bg-neutral-900/40 px-3 py-2.5">
      <div className="h-8 w-8 shrink-0 rounded bg-neutral-800" />
      <div className="h-8 w-8 shrink-0 rounded-full bg-neutral-800" />
      <div className="flex-1 space-y-1.5">
        <div className={`h-3 rounded bg-neutral-800 ${wide ? 'w-40' : 'w-32'}`} />
        <div className="h-2.5 w-20 rounded bg-neutral-800/60" />
      </div>
      <div className="h-5 w-10 rounded bg-neutral-800" />
    </div>
  )
}

// ── Driver standing row ─────────────────────────────────────────────────────

function DriverRow({ s, index }: { s: JolpicaDriverStanding; index: number }) {
  const pos = Number(s.position)
  const constructor = s.Constructors[0]
  const teamColor = constructor ? constructorColor(constructor.constructorId) : '#888'
  const photo = driverPhoto(s.Driver.code)
  const wins = Number(s.wins)

  return (
    <div className="relative flex items-center gap-2.5 overflow-hidden rounded-lg border border-neutral-800/50 bg-neutral-950/60 px-3 py-2.5 sm:gap-3 sm:px-4">
      {/* Team accent bar */}
      <div
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: teamColor }}
      />

      {/* Position */}
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-bold tabular-nums sm:h-8 sm:w-8 sm:text-sm ${
          pos === 1
            ? 'bg-f1red text-white'
            : pos <= 3
              ? 'bg-neutral-700 text-white'
              : 'bg-neutral-900 text-neutral-500'
        }`}
      >
        {pos}
      </span>

      {/* Driver photo */}
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-neutral-800 bg-neutral-900">
        {photo ? (
          <img
            src={photo}
            alt={s.Driver.code}
            className="h-full w-full object-cover object-top"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-[10px] font-bold"
            style={{ color: teamColor }}
          >
            {s.Driver.code}
          </div>
        )}
      </div>

      {/* Driver info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold sm:text-sm">
          <span className="text-neutral-400">{s.Driver.code}</span>{' '}
          <span className="text-white">{s.Driver.familyName}</span>
        </p>
        <p className="truncate text-[10px] text-neutral-500">
          {constructor?.name ?? '—'}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 sm:gap-4">
        {wins > 0 && (
          <div className="flex items-center gap-0.5 text-amber-400">
            <Trophy className="h-3 w-3" />
            <span className="text-[10px] font-bold">{wins}</span>
          </div>
        )}
        <div className="text-right">
          <p className="text-sm font-bold tabular-nums text-white">{s.points}</p>
          <p className="text-[9px] uppercase tracking-widest text-neutral-600">pts</p>
        </div>
      </div>
    </div>
  )
}

// ── Constructor standing row ────────────────────────────────────────────────

function ConstructorRow({ s, index }: { s: JolpicaConstructorStanding; index: number }) {
  const pos = Number(s.position)
  const color = constructorColor(s.Constructor.constructorId)
  const wins = Number(s.wins)

  return (
    <div className="relative flex items-center gap-3 overflow-hidden rounded-lg border border-neutral-800/50 bg-neutral-950/60 px-3 py-2.5 sm:px-4">
      <div
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: color }}
      />

      {/* Position */}
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-bold tabular-nums sm:h-8 sm:w-8 ${
          pos === 1
            ? 'bg-f1red text-white'
            : pos <= 3
              ? 'bg-neutral-700 text-white'
              : 'bg-neutral-900 text-neutral-500'
        }`}
      >
        {pos}
      </span>

      {/* Color swatch */}
      <div className="h-5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />

      {/* Constructor name */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold sm:text-sm">{s.Constructor.name}</p>
        <p className="text-[10px] text-neutral-600">{s.Constructor.nationality}</p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3">
        {wins > 0 && (
          <div className="flex items-center gap-0.5 text-amber-400">
            <Trophy className="h-3 w-3" />
            <span className="text-[10px] font-bold">{wins}</span>
          </div>
        )}
        <div className="text-right">
          <p className="text-sm font-bold tabular-nums text-white">{s.points}</p>
          <p className="text-[9px] uppercase tracking-widest text-neutral-600">pts</p>
        </div>
      </div>
    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────

export default function Standings() {
  const [tab, setTab] = useState<Tab>('drivers')

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['championship-standings'],
    queryFn: () => getChampionshipStandings('current'),
    staleTime: 5 * 60 * 1000,   // 5 min — standings only change after a race
    retry: 2,
  })

  const season = data?.season
  const round = data ? Number(data.round) : null
  const drivers = data?.driverStandings ?? []
  const constructors = data?.constructorStandings ?? []

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold sm:text-2xl">Classificação</h1>
          <p className="text-[10px] text-neutral-400 sm:text-sm">
            Campeonato de Pilotos e Construtores
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          {season && round !== null && round > 0 && (
            <div className="flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-900/60 px-2.5 py-1">
              <Flag className="h-2.5 w-2.5 text-f1red" />
              <span className="text-[10px] font-medium text-neutral-300">
                {season} · Rd {round}
              </span>
            </div>
          )}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1 text-[10px] text-neutral-600 hover:text-neutral-400 disabled:opacity-40"
          >
            <RefreshCw className={`h-3 w-3 ${isFetching ? 'animate-spin' : ''}`} />
            atualizar
          </button>
        </div>
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

      {/* Error state */}
      {isError && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-900/50 bg-yellow-950/30 px-3 py-2.5 text-xs text-yellow-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Não foi possível carregar a classificação. Verifique sua conexão.
        </div>
      )}

      {/* Content */}
      <Card className="p-0">
        <div className="border-b border-neutral-800 px-3 py-2 sm:px-4 sm:py-3">
          <CardTitle className="text-[10px] sm:text-sm">
            {tab === 'drivers' ? 'Campeonato de Pilotos' : 'Campeonato de Construtores'}
          </CardTitle>
        </div>

        <div className="flex flex-col gap-1 p-2">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} wide={i < 3} />)
            : tab === 'drivers'
              ? drivers.map((s, i) => (
                  <DriverRow key={s.Driver.driverId} s={s} index={i} />
                ))
              : constructors.map((s, i) => (
                  <ConstructorRow key={s.Constructor.constructorId} s={s} index={i} />
                ))}

          {!isLoading && tab === 'drivers' && drivers.length === 0 && (
            <p className="py-6 text-center text-xs text-neutral-500">
              Temporada em início — sem pontos registrados ainda.
            </p>
          )}
          {!isLoading && tab === 'constructors' && constructors.length === 0 && (
            <p className="py-6 text-center text-xs text-neutral-500">
              Temporada em início — sem pontos registrados ainda.
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
