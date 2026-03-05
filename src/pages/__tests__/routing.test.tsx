import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

// Import pages directly (not lazy) for testing
import Dashboard from '../Dashboard'
import Races from '../Races'
import Drivers from '../Drivers'
import NotFound from '../NotFound'

function renderWithRouter(initialEntry: string, routes: React.ReactNode) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>{routes}</Routes>
    </MemoryRouter>,
  )
}

describe('Routing', () => {
  it('renders Dashboard at /', () => {
    renderWithRouter('/', <Route path="/" element={<Dashboard />} />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders Races page at /races', () => {
    renderWithRouter('/races', <Route path="/races" element={<Races />} />)
    expect(screen.getByText('Corridas')).toBeInTheDocument()
  })

  it('renders Drivers page at /drivers', () => {
    renderWithRouter('/drivers', <Route path="/drivers" element={<Drivers />} />)
    expect(screen.getByText('Pilotos')).toBeInTheDocument()
  })

  it('renders 404 for unknown routes', () => {
    renderWithRouter('/unknown', <Route path="*" element={<NotFound />} />)
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByText('Página não encontrada')).toBeInTheDocument()
  })

  it('404 page has link back to dashboard', () => {
    renderWithRouter('/unknown', <Route path="*" element={<NotFound />} />)
    const link = screen.getByText('Voltar ao Dashboard')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/')
  })
})
