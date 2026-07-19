# PetIP OS Product Requirements

## 1. Product definition

PetIP OS is an internal decision-support system for a pet-IP operations company. It turns the company's positioning, content, e-commerce, and live-stream methods into repeatable employee workflows.

The system does not make final decisions for employees. AI assists diagnosis and drafting; accountable employees review, edit, and approve every client-facing result.

## 2. Primary users

| Role | Primary responsibility |
| --- | --- |
| Administrator | Employees, roles, system settings, audit |
| Project lead | Project ownership and formal approval |
| IP consultant | Intake, diagnosis, positioning reports |
| Content planner | Topics, scripts, content calendar, revisions |
| Live operator | Live positioning, scripts, sessions, review |
| E-commerce operator | Products, margin, conversion, fulfillment risk |
| Staff | Work on assigned projects within granted permissions |
| Read-only member | View assigned project material and approved reports |

There is no public registration or client self-service portal in this release.

## 3. Core workflow

1. An administrator creates or invites an employee.
2. A project lead creates a client project and assigns members.
3. Authorized staff collect creator, pet, relationship, audience, platform, commercial, and execution evidence.
4. The positioning engine produces stable, differentiated, and commerce-oriented options.
5. An employee selects or combines an option into a draft report.
6. A project lead reviews and approves the report.
7. Content planning uses the approved positioning and voice profile.
8. AI drafts are checked for style, edited by employees, and stored alongside final versions.
9. Commerce and live operators assess products, prepare sessions, and record performance.
10. Review findings update the next content and live plan; approved employee edits become knowledge evidence.

## 4. Functional scope

### Employee and project access

- Administrator-only account creation and invitation.
- Role-based permissions plus project membership.
- Sensitive client fields are encrypted at rest and masked by default.
- Export, delete, approval, membership, and knowledge changes are audited.

### Client and pet evidence

- Creator identity, experience, expertise, personality, speaking ability, trust, camera presence, controversy tolerance, and execution capacity.
- Pet appearance, personality, behavior, story, camera fit, content fit, live fit, and long-term narrative potential.
- Human-pet relationship model, emotional value, recurring conflict, recurring story, identification, and change.

### Positioning

- Eight diagnosis modules defined in `POSITIONING_FRAMEWORK.md`.
- Three comparable options in every positioning session.
- Evidence-backed scores, risks, content ratios, platform strategy, monetization, live fit, and execution cost.
- Employee selection, mixed edits, report versions, review, and approval.

### Natural content system

- A `CreatorVoiceProfile` with real spoken, published, liked, and disliked samples.
- Four modes: native spoken, IP opinion, daily record, and commerce conversion.
- Separate AI-style review covering generic language, persona fit, spoken naturalness, detail, repetition, and sales pressure.
- Revision history from AI initial draft through employee-approved final.

### E-commerce and live streaming

- Product roles: traffic, hero, profit, image, and cross-sell.
- Product fit, margin, commission, demonstration difficulty, after-sales risk, and refund risk.
- Live capability and live-room positioning.
- Structured script blocks from opening through next-session preview.
- Metrics and issue classification across traffic, retention, trust, product, script, conversion, and fulfillment/refund.

## 5. Non-functional requirements

- Authorization is deny-by-default and enforced server-side.
- Approved records are versioned and cannot be silently overwritten.
- Important actions create actor, project, entity, timestamp, and change snapshots in `AuditLog`.
- High-frequency views respond from indexed relational data; large exports run asynchronously in the future API phase.
- Third-party AI requests receive only approved, minimized context.
- The interface is optimized for frequent internal work on desktop and remains usable on mobile.

## 6. Success measures

- 100% of client-facing reports have creator, editor, reviewer, and approver attribution where applicable.
- 100% of AI-generated content begins in draft state.
- At least 80% of active creators have three approved voice samples before production content is approved.
- Positioning reports compare all three required options.
- Employee editing time, AI-to-final revision distance, approval cycle time, and live-review action completion are measurable.

## 7. Out of scope for this release

- Real live-platform API integrations.
- Automated publishing or product inventory synchronization.
- Full AI orchestration and model fine-tuning.
- Public registration, client billing, or multi-tenant self-service.
- A promise that content is undetectable as AI.

