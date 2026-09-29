# ARCHITECTURE.md

Decisions, in order. An ADR is never edited after it is accepted; it is superseded.

## The Gate: HW4 rerun

Where should entries live now that they must survive a cleared cache?

| Criterion | Weight | Build (Worker + D1) | Buy (hosted BaaS) | Delegate (AI builder hosts it) |
|---|---|---|---|---|
| Cost to start | *?* | | | |
| Cost to maintain | *?* | | | |
| Time to working | *?* | | | |
| Inspectability | *?* | | | |
| Switching cost | *?* | *scored from Session B experience* | | |
| Fit to spec | *?* | | | |
| **Weighted total** | | | | |

*Keep your HW3 weights unless you can say in one sentence why one changed.*

## ADR-002: Entries move from localStorage to Cloudflare D1

**Status:** *Proposed / Accepted*
**Supersedes:** ADR-001

### Context

*What data leaves the browser, to which vendor, under what terms, and who is accountable. All four, or the decision is not recorded.*

### Decision

*...*

### Alternatives considered

*Buy and Delegate from the Gate above, with the score and one sentence each.*

### Consequences

*At least one thing that got harder: offline use, testing, cost ceiling, a stranger's data in your table.*

### Revisit trigger

*When would this decision be wrong? "When a second user needs their own entries" is ADR-003 waiting to happen.*

---

## ADR-001: Store entries in localStorage

**Status:** Superseded by ADR-002

*Paste your HW3 ADR-001 here, unedited. The reasoning was true on September 10; the record should show that it was.*
