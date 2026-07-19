# PetIP OS Engineering Rules

## Product boundary

PetIP OS is an internal company system for pet-IP positioning, content planning, e-commerce, and live-stream operations. It is used by employees, not by public customers.

## Internal company use

1. Do not create public registration.
2. All employee accounts must be created or invited by an administrator.
3. Implement role-based access control and project-level membership checks.
4. All important actions must create audit logs.
5. Customer data must only be visible to authorized project members.
6. Sensitive customer information must not be sent to third-party services unless required for an approved function.
7. Do not expose prompts, knowledge documents, scoring rules, or client data in public endpoints.
8. Reports support `DRAFT`, `REVIEWED`, `APPROVED`, and `ARCHIVED` states.
9. AI-generated output is always a draft and requires employee review before approval.
10. Preserve who generated, edited, reviewed, and approved every report.

## Natural writing requirements

Do not rely on a single “write naturally” prompt. Every content workflow must use the approved `CreatorVoiceProfile`, create a separate `AIStyleReview`, and preserve AI drafts alongside employee revisions.

Generated content must:

1. Match the creator's real identity and speaking ability.
2. Use approved vocabulary and avoid banned words.
3. Include real pet, work, product, and life details.
4. Avoid excessive parallelism, symmetry, generic conclusions, and abstract claims.
5. Never invent personal experiences.
6. Distinguish spoken scripts from written captions.
7. Allow pauses, fragments, and limited repetition in spoken content.
8. Preserve the commercial objective without sounding like generic advertising.
9. Flag missing scenes, actions, examples, or personal judgment.
10. Never claim that output is undetectable as AI.

## Data and review rules

- Normalize core business entities; JSON is limited to immutable historical snapshots and variable analytical breakdowns.
- Add indexes for project membership, workflow status, dates, and frequently filtered business dimensions.
- Do not delete or rename persisted fields directly. Deprecate first, backfill, migrate reads, then remove in a later release.
- Important writes must be transactional with their audit log.
- Approved records are immutable; edits create a new draft/version.
- Employee final versions are first-class training evidence. Preserve the diff from AI initial draft to approved final copy.

## Delivery checks

Before considering a change complete, run schema validation, migrations, seed, typecheck, lint, unit tests, and production build when relevant.

