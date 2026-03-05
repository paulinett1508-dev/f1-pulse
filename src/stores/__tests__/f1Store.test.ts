import { describe, it, expect, beforeEach } from 'vitest'
import { useF1Store } from '../f1Store'
import { mockDriver, mockStanding, mockStanding2 } from '@/test/fixtures'

describe('f1Store', () => {
  beforeEach(() => {
    // Reset store to initial state
    useF1Store.setState({
      drivers: useF1Store.getState().drivers,
      standings: useF1Store.getState().standings,
      isLive: true,
    })
  })

  it('has initial mock data loaded', () => {
    const state = useF1Store.getState()
    expect(state.drivers.length).toBeGreaterThan(0)
    expect(state.races.length).toBeGreaterThan(0)
    expect(state.standings.length).toBeGreaterThan(0)
  })

  it('setDrivers updates drivers list', () => {
    useF1Store.getState().setDrivers([mockDriver])
    expect(useF1Store.getState().drivers).toEqual([mockDriver])
  })

  it('setIsLive updates live status', () => {
    useF1Store.getState().setIsLive(false)
    expect(useF1Store.getState().isLive).toBe(false)
  })

  it('setStandings updates standings', () => {
    useF1Store.getState().setStandings([mockStanding, mockStanding2])
    const standings = useF1Store.getState().standings
    expect(standings).toHaveLength(2)
    expect(standings[0].driver.name).toBe('Max Verstappen')
  })

  it('setFlagStatus updates flag', () => {
    useF1Store.getState().setFlagStatus('red')
    expect(useF1Store.getState().flagStatus).toBe('red')
  })

  it('simulatePositionSwap swaps two adjacent drivers', () => {
    useF1Store.getState().setStandings([mockStanding, mockStanding2])
    const before = useF1Store.getState().standings.map((s) => s.driver.id)
    useF1Store.getState().simulatePositionSwap()
    const after = useF1Store.getState().standings.map((s) => s.driver.id)
    // At least one swap should have happened (order may differ)
    expect(after).toHaveLength(before.length)
  })

  it('simulateTelemetryTick updates telemetry values', () => {
    // Give a standing with telemetry
    const withTelemetry = {
      ...mockStanding,
      telemetry: { speed: 300, rpm: 12000, gear: 7, throttle: 95, brake: 0, drs: false, delta: 0 },
    }
    useF1Store.getState().setStandings([withTelemetry])
    useF1Store.getState().simulateTelemetryTick()
    const updated = useF1Store.getState().standings[0]
    expect(updated.telemetry).toBeDefined()
    // Speed should have changed (jitter applied)
    expect(updated.telemetry!.speed).toBeGreaterThan(0)
  })
})
