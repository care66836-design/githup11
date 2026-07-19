import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const schema = readFileSync(resolve(process.cwd(), 'prisma/schema.prisma'), 'utf8')

const requiredModels = [
  'Employee',
  'Role',
  'Permission',
  'Project',
  'ProjectMember',
  'CreatorVoiceProfile',
  'PetPersona',
  'AudienceSegment',
  'PositioningOption',
  'PositioningScore',
  'ContentPillar',
  'ContentPlan',
  'ContentDraft',
  'ContentRevision',
  'AIStyleReview',
  'Product',
  'ProductCategory',
  'ProductFitAssessment',
  'LiveRoomProfile',
  'LiveSession',
  'LiveScript',
  'LiveScriptBlock',
  'LiveProduct',
  'LiveMetric',
  'LiveReview',
  'PromptVersion',
  'KnowledgeReview',
  'AuditLog',
]

describe('Prisma domain contract', () => {
  it.each(requiredModels)('contains the %s model', (model) => {
    expect(schema).toMatch(new RegExp(`model\\s+${model}\\s+\\{`))
  })

  it('indexes project membership and audit queries', () => {
    expect(schema).toContain('@@id([projectId, employeeId])')
    expect(schema).toContain('@@index([projectId, createdAt])')
    expect(schema).toContain('@@index([entityType, entityId, createdAt])')
  })

  it('stores report lifecycle attribution', () => {
    for (const field of ['createdById', 'lastEditedById', 'reviewedById', 'approvedById']) {
      expect(schema).toContain(field)
    }
  })
})

