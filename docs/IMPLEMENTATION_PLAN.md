# Implementation Plan

## Phase 0: Repository baseline

Status: complete in this iteration.

- React/TypeScript workspace and quality tooling.
- Prisma schema, local SQLite migration, and representative seed data.
- Product, architecture, policy, and workflow documentation.
- Functional internal-workspace prototype.

## Phase 1: Authentication and API

- Add internal SSO or administrator invitation with one-time activation.
- Implement server-side session handling and deny-by-default route guards.
- Expose project, positioning, content, live, and audit endpoints through application services.
- Write authorization matrix tests, including cross-project data isolation.
- Move production storage to PostgreSQL and encrypted object storage.

Exit: authenticated employees see only authorized project data; all important writes are audited transactionally.

## Phase 2: Intake and positioning

- Build structured creator, pet, relationship, audience, platform, commercial, and execution intake.
- Add evidence completeness and confidence checks.
- Implement three-option generation behind a versioned AI gateway.
- Support mixed-option reports and full review workflow.

Exit: a consultant can create an evidence-backed report and a lead can approve it without database access.

## Phase 3: Voice and content

- Upload/transcribe voice samples with explicit consent and retention rules.
- Build voice-profile approval and content modes.
- Add rule-based plus model-assisted style review.
- Add side-by-side AI initial, employee revision, and approved final comparison.
- Promote reviewed edit patterns into knowledge candidates, never automatically into production prompts.

Exit: approved content is attributable, voice-consistent, and revision learning is measurable.

## Phase 4: Commerce and live

- Product matrix and fit-assessment workflow.
- Live-room positioning and structured scripts.
- Manual metric import followed by approved platform adapters.
- Review issues, action owners, and next-session checks.

Exit: live operators can plan, run, review, and improve a session with traceable evidence.

## Phase 5: Knowledge and optimization

- Knowledge review queue from successful/failed cases and employee edits.
- Prompt experiments tied to `PromptVersion` and approval metrics.
- Operational dashboards for cycle time, edit distance, approval quality, conversion, refund, and action completion.

## Migration rules

The initial schema is a new baseline because no prior application data exists. Future changes use expand, backfill, switch, and contract. Existing fields are never directly renamed or dropped; they are deprecated first.

Before real client launch:

1. Provision PostgreSQL and encrypted backups.
2. Generate and review the PostgreSQL baseline migration.
3. Re-run seed only in development/staging.
4. Load test project membership, draft queues, and audit queries.
5. Complete threat modeling and restore testing.

## Next recommended slice

Implement Phase 1 before connecting any real AI or live-platform API. Authentication, authorization, masking, and audit transactions are prerequisites for safely processing client material.

