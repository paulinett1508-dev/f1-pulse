import { useQuery } from '@tanstack/react-query'
import {
  getRecentRaceSession,
  getDrivers,
  getPositions,
  getIntervals,
  getWeather,
  getStints,
  getLaps,
} from '@/lib/openf1'

export function useSessionQuery() {
  return useQuery({
    queryKey: ['session', 'recent'],
    queryFn: getRecentRaceSession,
    staleTime: 60_000,
  })
}

export function useDriversQuery(sessionKey: number | undefined) {
  return useQuery({
    queryKey: ['drivers', sessionKey],
    queryFn: () => getDrivers(sessionKey!),
    enabled: !!sessionKey,
  })
}

export function usePositionsQuery(sessionKey: number | undefined) {
  return useQuery({
    queryKey: ['positions', sessionKey],
    queryFn: () => getPositions(sessionKey!),
    enabled: !!sessionKey,
    refetchInterval: 10_000,
  })
}

export function useIntervalsQuery(sessionKey: number | undefined) {
  return useQuery({
    queryKey: ['intervals', sessionKey],
    queryFn: () => getIntervals(sessionKey!),
    enabled: !!sessionKey,
    refetchInterval: 10_000,
  })
}

export function useWeatherQuery(sessionKey: number | undefined) {
  return useQuery({
    queryKey: ['weather', sessionKey],
    queryFn: () => getWeather(sessionKey!),
    enabled: !!sessionKey,
    staleTime: 30_000,
  })
}

export function useStintsQuery(sessionKey: number | undefined) {
  return useQuery({
    queryKey: ['stints', sessionKey],
    queryFn: () => getStints(sessionKey!),
    enabled: !!sessionKey,
  })
}

export function useLapsQuery(sessionKey: number | undefined, driverNumber?: number) {
  return useQuery({
    queryKey: ['laps', sessionKey, driverNumber],
    queryFn: () => getLaps(sessionKey!, driverNumber),
    enabled: !!sessionKey,
  })
}
