import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DriverCard } from '../DriverCard'
import { mockStanding, mockStanding2 } from '@/test/fixtures'

describe('DriverCard', () => {
  it('renders driver name', () => {
    render(<DriverCard standing={mockStanding} />)
    expect(screen.getByText('Max Verstappen')).toBeInTheDocument()
  })

  it('renders team name', () => {
    render(<DriverCard standing={mockStanding} />)
    expect(screen.getByText('Red Bull Racing')).toBeInTheDocument()
  })

  it('renders position badge', () => {
    render(<DriverCard standing={mockStanding} />)
    expect(screen.getByText('P1')).toBeInTheDocument()
  })

  it('renders driver number', () => {
    render(<DriverCard standing={mockStanding} />)
    // Driver number appears in multiple places (number display + wins count)
    const numberElements = screen.getAllByText('1')
    expect(numberElements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders points', () => {
    render(<DriverCard standing={mockStanding} />)
    expect(screen.getAllByText('25').length).toBeGreaterThan(0)
  })

  it('renders non-leader position', () => {
    render(<DriverCard standing={mockStanding2} />)
    expect(screen.getByText('P2')).toBeInTheDocument()
  })

  it('renders gap for non-leader', () => {
    render(<DriverCard standing={mockStanding2} />)
    expect(screen.getAllByText('+0.333').length).toBeGreaterThan(0)
  })
})
