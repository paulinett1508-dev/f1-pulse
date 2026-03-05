import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from '../Badge'

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>AO VIVO</Badge>)
    expect(screen.getByText('AO VIVO')).toBeInTheDocument()
  })

  it('applies red variant class', () => {
    render(<Badge variant="red">LIVE</Badge>)
    const badge = screen.getByText('LIVE')
    expect(badge).toHaveClass('text-f1red')
  })

  it('applies green variant class', () => {
    render(<Badge variant="green">OK</Badge>)
    const badge = screen.getByText('OK')
    expect(badge).toHaveClass('text-green-400')
  })

  it('applies default variant when none specified', () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText('Default')
    expect(badge).toHaveClass('text-neutral-300')
  })
})
