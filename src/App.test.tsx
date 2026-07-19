import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('PetIP OS routes', () => {
  it('renders the internal dashboard', () => {
    render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: '上午好，周楠' })).toBeInTheDocument()
    expect(screen.getByText('我的待办')).toBeInTheDocument()
  })

  it('renders the three positioning options', () => {
    render(<MemoryRouter initialEntries={['/projects/momo']}><App /></MemoryRouter>)
    expect(screen.getByText('方案 A · 稳妥定位')).toBeInTheDocument()
    expect(screen.getByText('方案 B · 差异化定位')).toBeInTheDocument()
    expect(screen.getByText('方案 C · 商业化定位')).toBeInTheDocument()
  })
})

