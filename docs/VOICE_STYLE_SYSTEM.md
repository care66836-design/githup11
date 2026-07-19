# Voice Style System

## 1. Goal

The system improves authenticity, specificity, creator consistency, and employee review efficiency. It does not claim that content is impossible to detect as AI-generated.

## 2. Voice-profile evidence

`CreatorVoiceProfile` records tone, professional level, humor, emotion, colloquial level, sentence length, rhythm, common words, banned words, catchphrases, opening/ending habits, controversy tolerance, and sales intensity.

Employees should collect at least:

- 3-10 real spoken or chat samples;
- 3-10 previously published pieces;
- 1-3 spoken transcripts;
- preferred and disliked style examples;
- notes explaining context and whether each sample is representative.

Only approved samples may shape production output. Raw samples remain attributable and removable under the retention policy.

## 3. Four content modes

| Mode | Use | Required behavior |
| --- | --- | --- |
| Native spoken | Direct-to-camera scripts | Fragments, pauses, limited repetition, one point per beat |
| IP opinion | Professional positioning | Clear judgment, real case/scene, identity-consistent boundaries |
| Daily record | Pet life and relationship | Actions, details, emotion; no forced lesson or elevation |
| Commerce conversion | Short video and live commerce | Scene first, one objection per beat, persona-consistent sales pressure |

## 4. Generation pipeline

```text
approved positioning
  -> approved voice profile and samples
  -> content objective, platform, mode, and real evidence
  -> AI initial draft
  -> AI style review
  -> targeted rewrite
  -> persona consistency check
  -> employee edit
  -> human review / approval
  -> final version and edit-difference evidence
```

The AI gateway must receive only the minimum approved data needed for the requested function. Personal contact fields are never included.

## 5. Style-review signals

`AIStyleReview` records:

- `genericPhraseScore`: lower is better;
- `personaConsistencyScore`: higher is better;
- `spokenNaturalnessScore`: higher is better for spoken content;
- `detailDensityScore`: higher means more concrete scenes/actions/evidence;
- `repetitionScore`: lower is better;
- `salesPressureScore`: compared with the profile's approved intensity;
- ordered `detectedProblems` and `rewriteSuggestions`.

Checks include template openings, repeated rhetorical formulas, excessive parallelism or symmetry, empty elevation, abstract language, missing scenes/actions/judgment, banned vocabulary, invented experience, unnatural spoken grammar, excessive sales pressure, and persona conflict.

Scores are decision support, not approval. An employee may override a warning with a note.

## 6. Learning from employee edits

The system preserves:

1. AI initial revision;
2. each AI rewrite or employee revision;
3. employee-approved final revision;
4. change notes and style-review scores.

A background comparison can identify repeated changes such as removing phrases, adding concrete details, shortening sentences, or reducing pressure. These become `KnowledgeDocument` candidates and require knowledge review before affecting prompts or rules.

The system must never automatically train on all edits; errors, one-off preferences, sensitive details, and client-specific language can otherwise leak across projects.

## 7. Approval gate

Content cannot become `APPROVED` when:

- the creator has no approved voice profile and no lead override;
- banned words remain without an explicit exception;
- the script invents experience or product evidence;
- required commercial disclosures are missing;
- no employee has reviewed the final revision.

