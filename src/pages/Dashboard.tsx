import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flag, Radio, TrendingUp, Users, Wifi, WifiOff, Database } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { DriverCard } from '@/components/race/DriverCard'
import { useF1Store } from '@/stores/f1Store'
import { useLiveData } from '@/hooks/useLiveData'

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
      <p className={`text-lg font-bold sm:text-2xl truncate ${accent ? 'text-f1red' : ''}`}>{value}</p>
    </Card>
  )
}

export function Dashboard() {
  const {
    standings,
    races,
    isLive,
    simulatePositionSwap,
    simulateTelemetryTick,
  } = useF1Store()

  // Connect to OpenF1 live data
  const liveStatus = useLiveData(true)

  // Fallback: simulate locally only when not connected to API
  useEffect(() => {
    if (liveStatus.isConnected) return

    const telemetryInterval = setInterval(simulateTelemetryTick, 800)
    const swapInterval = setInterval(simulatePositionSwap, 6000)

    return () => {
      clearInterval(telemetryInterval)
      clearInterval(swapInterval)
    }
  }, [liveStatus.isConnected, simulateTelemetryTick, simulatePositionSwap])

  const leader = standings[0]
  const fastestDriver = standings.find((s) => s.isFastestLap)

  const sessionName = liveStatus.sessionInfo
    ? `${liveStatus.sessionInfo.location} — ${liveStatus.sessionInfo.session_name}`
    : races[0]?.name ?? '—'

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Dashboard</h1>
          <p className="text-xs text-neutral-400 sm:text-sm">
            Acompanhe a temporada de F1 em tempo real
          </p>
        </div>

        {/* Connection status badge */}
        <div className="flex items-center gap-2 self-start rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-2">
          {liveStatus.isConnected ? (
            <>
              {liveStatus.dataSource === 'live' ? (
                <Wifi className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <Database className="h-3.5 w-3.5 text-blue-400" />
              )}
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-green-400">
                  {liveStatus.dataSource === 'live' ? 'LIVE' : 'API CONECTADA'}
                </p>
                <p className="text-[9px] text-neutral-500">
                  OpenF1
                  {liveStatus.lastUpdate && (
                    <> — {liveStatus.lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</>
                  )}
                </p>
              </div>
            </>
          ) : liveStatus.error ? (
            <>
              <WifiOff className="h-3.5 w-3.5 text-amber-400" />
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">MOCK DATA</p>
                <p className="max-w-[140px] truncate text-[9px] text-neutral-500">{liveStatus.error}</p>
              </div>
            </>
          ) : (
            <>
              <motion.div
                className="h-3.5 w-3.5 rounded-full border-2 border-neutral-600 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="text-[10px] uppercase tracking-wider text-neutral-500">Conectando...</p>
            </>
          )}
        </div>
      </div>

      {/* Stat cards — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={Flag}
          label="Sessão Atual"
          value={sessionName}
        />
        <StatCard
          icon={TrendingUp}
          label="Líder"
          value={leader?.driver.name ?? '—'}
        />
        <StatCard
          icon={Users}
          label="Pilotos"
          value={String(standings.length)}
        />
        <StatCard
          icon={Radio}
          label="Status"
          value={isLive ? 'AO VIVO' : liveStatus.isConnected ? 'Sessão Recente' : 'Simulação'}
          accent={isLive}
        />
      </div>

      {/* Main grid — single column on mobile, 3 cols on desktop */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Driver standings with live telemetry */}
        <div className="lg:col-span-2">
          <Card className="p-0">
            <div className="border-b border-neutral-800 px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="flex items-center justify-between">
                <CardTitle>
                  {liveStatus.isConnected ? 'Classificação — OpenF1' : 'Classificação ao Vivo'}
                </CardTitle>
                {fastestDriver && (
                  <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-wider text-f1red sm:text-[10px]">
                    <motion.span
                      className="inline-block h-1.5 w-1.5 rounded-full bg-f1red"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                    <span className="hidden xs:inline">Volta rápida:</span> {fastestDriver.driver.name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 p-1.5 sm:p-2">
              <AnimatePresence mode="popLayout">
                {standings.map((standing, i) => (
                  <DriverCard
                    key={standing.driver.id}
                    standing={standing}
                    index={i}
                  />
                ))}
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* Sidebar: Calendar */}
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
