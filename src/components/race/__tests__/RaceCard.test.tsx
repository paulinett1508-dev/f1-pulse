import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RaceCard } from '../RaceCard'
import { mockRace } from '@/test/fixtures'

describe('RaceCard', () => {
  it('renders race name and circuit', () => {
    render(<RaceCard race={mockRace} status="upcoming" />)
    expect(screen.getByText('GP da Austrália')).toBeInTheDocument()
    expect(screen.getByText(/Albert Park Circuit/)).toBeInTheDocument()
  })

  it('renders round number', () => {
    render(<RaceCard race={mockRace} status="upcoming" />)
    expect(screen.getByText(/Round 1/)).toBeInTheDocument()
  })

  it('shows EM BREVE badge for upcoming races', () => {
    render(<RaceCard race={mockRace} status="upcoming" />)
    expect(screen.getByText('EM BREVE')).toBeInTheDocument()
  })

  it('shows AO VIVO badge for live races', () => {
    render(<RaceCard race={mockRace} status="live" />)
    expect(screen.getByText('AO VIVO')).toBeInTheDocument()
  })

  it('shows ENCERRADA badge for finished races', () => {
    render(<RaceCard race={mockRace} status="finished" />)
    expect(screen.getByText('ENCERRADA')).toBeInTheDocument()
  })

  it('renders date', () => {
    render(<RaceCard race={mockRace} status="upcoming" />)
    expect(screen.getByText('08 Mar 2026')).toBeInTheDocument()
  })
})
