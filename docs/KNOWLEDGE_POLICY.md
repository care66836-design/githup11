# Knowledge Policy

## 1. Purpose

The knowledge system preserves proven company judgment without automatically spreading one employee's edit or one client's private detail across all projects.

## 2. Sources

- Approved positioning reports and documented outcomes.
- Approved employee final content and AI-to-final differences.
- Live reviews with metrics and completed follow-up actions.
- Explicitly reviewed success and failure cases.
- Approved product/category standards and compliance rules.

Drafts, private contact details, unsupported opinions, and unreviewed AI output are not production knowledge.

## 3. Candidate workflow

1. A source event proposes a knowledge candidate.
2. The candidate strips client identifiers and sensitive detail.
3. A reviewer checks evidence, scope, expiry, and possible exceptions.
4. The reviewer approves, rejects, or requests changes.
5. Approved knowledge receives a version and allowed-use scope.
6. Prompt changes cite the knowledge version and remain separately reviewable.

## 4. Learning from edits

AI-to-final comparisons may extract patterns such as banned phrases, missing scene detail, preferred sentence rhythm, claim boundaries, or stronger objection handling. Store the evidence link and whether the pattern is creator-specific, project-specific, category-specific, or company-wide.

Creator-specific patterns stay in `CreatorVoiceProfile`; they do not become company-wide style rules without independent evidence.

## 5. Governance

- Only `knowledge.review` can approve or retire knowledge.
- Knowledge changes are audited.
- Conflicting evidence is retained and surfaced rather than silently overwritten.
- Time-sensitive product/platform guidance has an expiry or review date.
- Prompt text and knowledge documents are internal and never exposed through public endpoints.

## 6. Quality measures

Track source coverage, reviewer agreement, usage, override rate, age, and downstream approval/edit outcomes. High usage alone does not prove a rule is good.

