# Report Review Workflow

## 1. States

```text
DRAFT -> REVIEWED -> APPROVED -> ARCHIVED
  ^          |
  +----------+  changes requested
```

AI creates `DRAFT` only. `REVIEWED` means a qualified employee checked evidence, wording, risks, and client suitability. `APPROVED` is the formal client-ready version. `ARCHIVED` remains readable and auditable.

## 2. Required attribution

A report records:

- `createdBy`: employee or service-account owner of the initial draft;
- `lastEditedBy`: last employee to alter the current draft;
- `reviewedBy` and `reviewedAt`;
- `approvedBy` and `approvedAt`;
- immutable version snapshots and change notes.

AI model and prompt metadata belong to the generation event; the employee remains accountable for approval.

## 3. Transition rules

### Create draft

Requires assigned project access. Positioning drafts require all three option types. Content drafts preserve the AI initial revision.

### Submit/review

The reviewer checks source evidence, three-option comparison, excluded audiences, execution limits, commercial conflicts, unsupported claims, and data exposure. Changes return the item to `DRAFT` with a note.

### Approve

Requires `report.approve`. The system freezes a version snapshot and audit event. Approval is never inferred from download, share, or status text.

### Edit approved work

The approved version remains immutable. Editing creates a new draft version linked to the prior approval.

### Archive

Requires a reason. Archived records cannot be edited or approved and remain available for audit and case learning.

## 4. Separation of duties

The default policy requires reviewer/approver to differ from the AI draft creator for formal positioning. Small-team administrator overrides require a reason and a highlighted audit event.

## 5. Content-specific review

Before content approval:

- confirm approved voice profile and real evidence;
- inspect `AIStyleReview` findings;
- compare AI initial and employee final revisions;
- check banned words, invented experience, unsupported product claims, disclosures, and spoken readability;
- record any warning override.

## 6. Audit events

Create, edit, submit, review, request changes, approve, archive, reveal sensitive data, and export are important actions. Their audit records include actor, project, entity, action, summary, timestamp, and safe snapshots.

