import { describe, expect, it } from 'vitest'
import { contentRatiosAreValid, nextReportStatus } from './workflows'

describe('report workflow invariants', () => {
  it('requires reviewed state before approval', () => {
    expect(nextReportStatus('DRAFT', 'approve')).toBeNull()
    expect(nextReportStatus('REVIEWED', 'approve')).toBe('APPROVED')
  })

  it('does not allow archived reports to re-enter work', () => {
    expect(nextReportStatus('ARCHIVED', 'request_changes')).toBeNull()
    expect(nextReportStatus('ARCHIVED', 'approve')).toBeNull()
  })

  it('requires the four content ratios to total 100', () => {
    expect(contentRatiosAreValid([35, 30, 20, 15])).toBe(true)
    expect(contentRatiosAreValid([40, 30, 20, 15])).toBe(false)
  })
})

