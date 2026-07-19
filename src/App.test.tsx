import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('PetIP OS routes', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

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

  it('completes a dashboard queue item', () => {
    render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>)

    fireEvent.click(screen.getByRole('button', { name: '完成 差异化定位报告待批准' }))

    expect(screen.queryByRole('button', { name: '完成 差异化定位报告待批准' })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('已完成：差异化定位报告待批准')
  })

  it('opens the new project workflow', () => {
    render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>)

    fireEvent.click(screen.getByRole('button', { name: '新建项目' }))

    expect(screen.getByRole('dialog', { name: '新建客户项目' })).toBeInTheDocument()
  })

  it('submits a content draft for review', () => {
    render(<MemoryRouter initialEntries={['/content']}><App /></MemoryRouter>)

    fireEvent.click(screen.getByRole('button', { name: '提交审核' }))

    expect(screen.getByRole('status')).toHaveTextContent('稿件已提交审核并记录当前版本')
  })
})
