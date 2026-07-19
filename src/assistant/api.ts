import type { AccountIntake, CopyRequest, CopyResult, PositioningReport, ServiceHealth } from './types'

async function request<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  const payload = await response.json().catch(() => ({})) as { error?: string }
  if (!response.ok) {
    throw new Error(payload.error || '服务暂时不可用，请稍后重试。')
  }

  return payload as T
}

export function getServiceHealth() {
  return request<ServiceHealth>('/api/health')
}

export function createPositioning(intake: AccountIntake) {
  return request<PositioningReport>('/api/position', intake)
}

export function createCopy(report: PositioningReport, requestData: CopyRequest) {
  return request<CopyResult>('/api/copy', { report, request: requestData })
}

