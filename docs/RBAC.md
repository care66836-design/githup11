# Role-Based Access Control

## 1. Model

Access combines global role permissions with project membership:

```text
active employee
  AND required permission
  AND (assigned project member OR project.view_all)
  AND sensitivity/workflow rule
```

The UI may hide unavailable actions, but only server-side checks authorize data access.

## 2. Default role matrix

| Capability | Admin | Lead | IP consultant | Content | Live | E-commerce | Staff | Read-only |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Manage employees/system | Yes | No | No | No | No | No | No | No |
| Create/assign project | Yes | Yes | No | No | No | No | No | No |
| Diagnose/edit positioning | Yes | Yes | Yes | No | No | No | No | No |
| Review/approve report | Yes | Yes | No | No | No | No | No | No |
| Edit content | Yes | Yes | Yes | Yes | No | No | Assigned | No |
| Edit live/product work | Yes | Yes | No | No | Yes | Yes | Assigned | No |
| View assigned project | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| View audit | Yes | No | No | No | No | No | No | No |

`Staff` receives no broad global edit permission; a future fine-grained project assignment grants only named project actions. `Read-only` never mutates.

## 3. Project membership

- `OWNER`: accountable project lead.
- `LEAD`: coordinates a discipline and can assign work within the project when globally permitted.
- `CONTRIBUTOR`: edits only the modules allowed by their global role.
- `VIEWER`: read-only access to the assigned project.

Membership does not grant access to encrypted sensitive fields. That also requires `client.sensitive_view`.

## 4. Sensitive and destructive actions

- Contact and legal identity are masked by default.
- Reveal actions are purpose-limited and audited.
- Export requires `report.export` and records filters, report version, and actor.
- Delete requires `record.delete`, reason, dependency check, and recoverable soft-delete in the API phase.
- Formal approval requires `report.approve`; AI service identities cannot hold it.

## 5. Account lifecycle

- No public sign-up endpoint or UI.
- Administrator creates an invitation tied to an allowed company identity.
- Invitations expire and can be revoked.
- Suspended employees cannot log in; existing sessions are invalidated.
- Removing project membership blocks future access without deleting attribution history.

## 6. Required tests

- Every role against every protected command.
- Same-role users assigned to different projects.
- `project.view_all` exception.
- sensitive-field masking and reveal audit.
- suspended user and removed membership.
- review/approval self-action policy.
- export/delete/knowledge-review denial paths.

