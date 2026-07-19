import type { ReactNode } from 'react'

export function StatusChip({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'green' | 'coral' | 'gold' | 'blue' }) {
  return <span className={`status-chip status-${tone}`}>{children}</span>
}

export function ProgressBar({ value, tone = 'green', compact = false }: { value: number; tone?: 'green' | 'coral' | 'gold' | 'blue'; compact?: boolean }) {
  return (
    <div className={`progress-track ${compact ? 'compact' : ''}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <span className={`progress-fill fill-${tone}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

export function Avatar({ name, tone = 'green' }: { name: string; tone?: 'green' | 'coral' | 'gold' | 'blue' }) {
  return <span className={`avatar avatar-${tone}`}>{name.slice(0, 1)}</span>
}

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="empty-state">
      <span>{icon}</span>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  )
}

