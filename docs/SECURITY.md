# Security

## 1. Threat model

Primary risks are cross-project data exposure, excessive employee access, sensitive-data leakage to AI providers, prompt/knowledge disclosure, unreviewed AI output becoming official, destructive changes without attribution, and leaked exports or media.

## 2. Controls

- Company-controlled identity and administrator invitation only.
- Server-side RBAC plus project membership on every protected request.
- Field-level masking for legal identity and contact data.
- Encryption at rest for sensitive values and object storage; TLS in transit.
- Short-lived sessions, revocation on suspension, and protected administrator actions.
- Transactional audit records for important mutations.
- Approved AI gateway with context minimization and provider allowlist.
- Immutable report and content versions after approval.
- Private object storage with short-lived signed download links.

## 3. AI data boundary

Allowed context is purpose-limited positioning evidence, approved voice samples, relevant product facts, and the current content objective. Disallowed context includes phone, email, WeChat, legal identity, unrelated project data, employee credentials, internal permission structures, and full knowledge documents when excerpts suffice.

The gateway logs project, purpose, prompt version, provider/model, approved context categories, actor, and output record. It never logs decrypted contact fields.

## 4. Client-side rules

- No secrets, Prisma access, prompt bodies, or scoring internals in browser bundles.
- Masked DTOs are the default response.
- Permission-aware UI does not replace API authorization.
- External image/media URLs are not used for real client material.

## 5. Audit and retention

Audit snapshots must avoid raw secrets and unnecessary sensitive text. Retention periods are defined by data category and client agreement. Access logs and report approvals outlive mutable working drafts when legally permitted.

## 6. Production launch checklist

- PostgreSQL encryption and tested backups.
- SSO/MFA, session revocation, and invitation expiry.
- Authorization and cross-project isolation tests.
- AI provider privacy review and data-processing agreement.
- Secret scanning, dependency review, CSP, CSRF protection, rate limits, and upload scanning.
- Restore drill, incident owner, and client-data deletion procedure.

