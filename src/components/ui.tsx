import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

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

export function Modal({
  open,
  title,
  description,
  children,
  footer,
  onClose,
  size = 'medium',
}: {
  open: boolean
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  onClose: () => void
  size?: 'small' | 'medium' | 'large'
}) {
  useEffect(() => {
    if (!open) return undefined
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className={`modal-dialog modal-${size}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="modal-header">
          <div><h2 id="modal-title">{title}</h2>{description ? <p>{description}</p> : null}</div>
          <button className="icon-button ghost" type="button" aria-label="关闭弹窗" onClick={onClose}><X size={18} /></button>
        </header>
        <div className="modal-body">{children}</div>
        {footer ? <footer className="modal-footer">{footer}</footer> : null}
      </section>
    </div>
  )
}
