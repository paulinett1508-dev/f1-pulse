import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardHeader, CardTitle } from '../Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Test content</Card>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Card className="custom-class">Content</Card>)
    expect(screen.getByText('Content').closest('div')).toHaveClass('custom-class')
  })
})

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader>Header text</CardHeader>)
    expect(screen.getByText('Header text')).toBeInTheDocument()
  })
})

describe('CardTitle', () => {
  it('renders as h3', () => {
    render(<CardTitle>Title</CardTitle>)
    const title = screen.getByText('Title')
    expect(title.tagName).toBe('H3')
  })
})
