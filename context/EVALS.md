# EVALS.md

The verification table from HW3, grown up. Five sections, in this order.
The first two are written and committed BEFORE any tool sees the spec.

## 1. RAT statement
The riskiest assumption in delegating F-07 to bolt.new is that it will implement status updates by calling my existing Worker rather than inventing its own client-side storage for completion state. If it invents parallel storage instead of using D1, the feature will not actually solve the problem, since status would not persist or sync the way ADR-002 requires, and the delegation would cost more review and rework time than building it by hand.

## 2. Prediction Stake (before build, 2026-09-29 15:47)
- **Tight:** At least 3 of 4 EARS rows for F-07 will pass on bolt's first output.
  - Resolved [date]: _ of 4.
- **Loose:** bolt will follow STYLE.md's color and spacing tokens more accurately than AI Studio does on the same prompt.
  - Resolved [date]: ...
- **Open:** bolt will introduce a dependency I did not ask for.
  - Resolved when I read package.json.

## 3. Success criteria
| EARS row (feature) | Checked by | Where |
|---|---|---|
| WHEN ..., THE SYSTEM SHALL ... | test | evals/worker.test.js, "..." |
| IF ..., THEN THE SYSTEM SHALL ... | judgment | docs/JUDGMENT.md #8 |
| THE SYSTEM SHALL ... | human | README, See It Work |

## 4. Error-analysis log
<!-- Every failure observed, a few words each, counted, sorted by count. -->
| Failure (a few words) | Count | Source | Category |
|---|---|---|---|
| Buttons used its own blue, not color-primary | 2 | bolt, AI Studio | STYLE |
| | | | |

## 5. Evals
- **Code:** `npm test` with `API=<worker url>`; _ tests, _ passing. Screenshot in README.
- **Judgment:** docs/JUDGMENT.md, _ questions, two graders, agreement _%.

## Verification table (carried from HW4)
<!-- Paste your HW4 verification table here; it is the ancestor of section 3. -->
