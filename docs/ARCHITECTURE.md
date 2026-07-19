# Architecture

## 1. Current baseline

The repository contains a React/TypeScript internal workspace, a Prisma domain schema, executable SQLite migrations, seed data, and product documentation. The UI uses typed demo data during the foundation phase; the schema is the contract for the API phase.

SQLite is selected for local repeatability. Production should use PostgreSQL before real client data is imported. The domain model avoids SQLite-specific features, so provider migration is primarily operational.

## 2. Target layers

```text
React internal workspace
        |
Authenticated application API
        |
Authorization + workflow services
        |
Prisma repositories + audit transaction
        |
PostgreSQL / encrypted object storage
        |
Approved AI gateway and platform adapters
```

### Presentation

- Route-level workspaces for dashboard, projects, content, live commerce, knowledge, and employees.
- Permission-aware navigation is convenience only; the API remains authoritative.
- Operational views favor tables, status, filters, and clear next actions.

### Application services

- `AccessService`: role permission plus project membership.
- `PositioningService`: evidence completeness, three-option generation, selection, and report versioning.
- `ContentService`: voice context, draft generation, style review, revision, and approval.
- `LiveCommerceService`: product fit, live-room strategy, scripts, metrics, and review.
- `KnowledgeService`: reviewed methods and approved AI-to-final differences.
- `AuditService`: writes audit entries in the same transaction as important mutations.

### Infrastructure

- Prisma for transactional domain persistence.
- Object storage for original media and transcripts; database rows hold access-controlled metadata.
- An AI gateway that strips disallowed fields, pins `PromptVersion`, logs purpose, and stores output as draft.
- Background jobs for transcription, long analysis, exports, and platform synchronization.

## 3. Authorization path

Every protected request checks:

1. active employee identity;
2. required role permission;
3. project membership unless the role has `project.view_all`;
4. data sensitivity and explicit `client.sensitive_view` permission;
5. workflow transition permission for review, approval, export, archive, or delete.

Project IDs supplied by the client are never sufficient authorization.

## 4. Workflow invariants

- AI output can create only `DRAFT` records.
- Review and approval are explicit commands, not arbitrary status updates.
- An approver cannot approve an archived report.
- Editing an approved report creates a new draft version.
- Content approval requires an approved voice profile or a documented lead override.
- Positioning approval requires all three option types and score evidence.
- A live review requires session metrics or a manual-data explanation.

## 5. Data-model decisions

Core entities use foreign keys and join tables because they are queried, permissioned, and reported independently. This includes members, samples, options, scores, pillars, revisions, products, script blocks, and review issues.

JSON is intentionally limited to:

- `PositioningReportVersion.snapshot`: immutable historical shape; queried by report/version, not nested fields.
- `AIStyleReview.detectedProblems` and `rewriteSuggestions`: ordered analytical findings whose shape may evolve with reviewer versions.
- `LiveMetric` product/time/script snapshots: variable platform breakdowns retained as source evidence.
- `AuditLog` before/after snapshots: immutable forensic records.

If any JSON subfield becomes a filter, permission boundary, KPI, or editable business object, migrate it into a relation table.

## 6. Index strategy

- Membership: employee + project role.
- Project work queues: status + milestone date.
- Reports and drafts: project + status + updated date.
- Positioning: session + option type, status + recommendation score.
- Live sessions: project + status + schedule.
- Audit: project/actor/entity + timestamp.

## 7. Migration strategy

This repository has no prior business schema, so migration `0001_init` is the compatibility baseline.

Future changes follow expand-and-contract:

1. Add nullable field/table/index without removing old data.
2. Deploy dual-write or backfill.
3. Switch reads after verification.
4. Mark old fields deprecated in schema comments and documentation.
5. Remove only in a later reviewed migration with backup and rollback plan.

Before production, change the datasource provider to PostgreSQL, generate a new baseline against an empty PostgreSQL database, run seed in a non-production environment, and test authorization queries with realistic volume.

## 8. API phase boundaries

- Browser code never imports Prisma or secrets.
- API responses expose masked DTOs, not database records.
- AI provider calls happen only in the server-side gateway.
- Prompt text, score rules, and knowledge content are internal resources and never serialized into public routes.

