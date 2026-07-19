export type ReportStatus = 'DRAFT' | 'REVIEWED' | 'APPROVED' | 'ARCHIVED'
export type ReportCommand = 'submit_review' | 'request_changes' | 'approve' | 'archive'

const transitions: Record<ReportStatus, Partial<Record<ReportCommand, ReportStatus>>> = {
  DRAFT: { submit_review: 'REVIEWED', archive: 'ARCHIVED' },
  REVIEWED: { request_changes: 'DRAFT', approve: 'APPROVED', archive: 'ARCHIVED' },
  APPROVED: { archive: 'ARCHIVED' },
  ARCHIVED: {},
}

export function nextReportStatus(current: ReportStatus, command: ReportCommand) {
  return transitions[current][command] ?? null
}

export function contentRatiosAreValid(ratios: number[]) {
  return ratios.length === 4 && ratios.every((ratio) => Number.isInteger(ratio) && ratio >= 0) && ratios.reduce((sum, ratio) => sum + ratio, 0) === 100
}

