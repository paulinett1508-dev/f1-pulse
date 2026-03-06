import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, MapPin, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useF1Store } from '@/stores/f1Store'

// Country code → flag emoji via regional indicator symbols
const countryFlag: Record<string, string> = {
  NED: '🇳🇱', GBR: '🇬🇧', MON: '🇲🇨', AUS: '🇦🇺', ESP: '🇪🇸',
  CAN: '🇨🇦', FRA: '🇫🇷', MEX: '🇲🇽', JPN: '🇯🇵', GER: '🇩🇪',
  FIN: '🇫🇮', DEN: '🇩🇰', THA: '🇹🇭', CHN: '🇨🇳', USA: '🇺🇸',
  BRA: '🇧🇷', ITA: '🇮🇹', ARG: '🇦🇷', NZL: '🇳🇿', ISR: '🇮🇱',
}

const countryName: Record<string, string> = {
  NED: 'Países Baixos', GBR: 'Reino Unido', MON: 'Mônaco', AUS: 'Austrália',
  ESP: 'Espanha', CAN: 'Canadá', FRA: 'França', MEX: 'México', JPN: 'Japão',
  GER: 'Alemanha', FIN: 'Finlândia', DEN: 'Dinamarca', THA: 'Tailândia',
  CHN: 'China', USA: 'Estados Unidos', BRA: 'Brasil', ITA: 'Itália',
  ARG: 'Argentina', NZL: 'Nova Zelândia', ISR: 'Israel',
}

export default function Drivers() {
  const { standings } = useF1Store()
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set())

  const handleImgError = (driverId: string) => {
    setImgErrors((prev) => new Set(prev).add(driverId))
  }

  return (
    <div className="space-y-3 sm:space-y-6">
      <div>
        <h1 className="text-lg font-bold sm:text-2xl">Pilotos</h1>
        <p className="text-[10px] text-neutral-400 sm:text-sm">
          Grid da temporada 2026
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {standings.map((s, i) => {
          const flag = countryFlag[s.driver.country] ?? '🏁'
          const country = countryName[s.driver.country] ?? s.driver.country
          const showPhoto = s.driver.photo && !imgErrors.has(s.driver.id)

          return (
            <motion.div
              key={s.driver.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                'group relative overflow-hidden rounded-xl border bg-gradient-to-br from-neutral-950/90 to-neutral-900/70 transition-colors hover:border-neutral-700',
                s.position <= 3 ? 'border-neutral-700/80' : 'border-neutral-800/50',
              )}
            >
              {/* Team color top accent */}
              <div
                className="absolute inset-x-0 top-0 h-[3px]"
                style={{ backgroundColor: s.team.color }}
              />

              {/* Header: photo + identity */}
              <div className="flex items-center gap-3 px-4 pt-5 pb-3">
                {/* Driver photo */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-neutral-800 bg-neutral-900 sm:h-20 sm:w-20">
                  {showPhoto ? (
                    <img
                      src={s.driver.photo}
                      alt={s.driver.name}
                      className="h-full w-full object-cover object-top"
                      onError={() => handleImgError(s.driver.id)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-8 w-8 text-neutral-700" />
                    </div>
                  )}
                  {/* Position badge overlaid */}
                  <div className={cn(
                    'absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ring-2 ring-neutral-900 sm:h-7 sm:w-7 sm:text-xs',
                    s.position === 1 ? 'bg-f1red text-white'
                      : s.position <= 3 ? 'bg-neutral-700 text-white'
                      : 'bg-neutral-800 text-neutral-400',
                  )}>
                    {s.position}
                  </div>
                </div>

                {/* Name + team + country */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="truncate text-sm font-bold sm:text-lg">{s.driver.name}</p>
                    <span
                      className="text-2xl font-extrabold tabular-nums opacity-15 sm:text-3xl"
                      style={{ color: s.team.color }}
                    >
                      {s.driver.number}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-neutral-500 sm:text-xs">{s.team.name}</p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-neutral-500 sm:text-xs">
                    <MapPin className="h-3 w-3 text-neutral-600" />
                    <span>{flag}</span>
                    <span>{country}</span>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 border-t border-neutral-800/60 px-4 py-3">
                <div>
                  <p className="text-sm font-bold tabular-nums sm:text-base">{s.points}</p>
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
          )
        })}
      </div>
    </div>
  )
}
