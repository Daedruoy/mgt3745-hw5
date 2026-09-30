# EVALS.md

The verification table from HW3, grown up. Five sections, in this order.
The first two are written and committed BEFORE any tool sees the spec.

## 1. RAT statement
The riskiest assumption in delegating F-07 to bolt.new is that it will implement status updates by calling my existing Worker rather than inventing its own client-side storage for completion state. If it invents parallel storage instead of using D1, the feature will not actually solve the problem, since status would not persist or sync the way ADR-002 requires, and the delegation would cost more review and rework time than building it by hand.

## 2. Prediction Stake (before build, 2026-09-29 15:47)
- **Tight:** At least 3 of 4 EARS rows for F-07 will pass on bolt's first output.
  - Resolved 2026-09-29: 1 of 4 passed outright (Row 2, with a wording mismatch), 1 partial (Row 1), 2 failed (Rows 3 and 4). The Tight prediction was wrong; the actual rate was well below 3 of 4.
- **Loose:** bolt will follow STYLE.md's color and spacing tokens more accurately than AI Studio does on the same prompt.
  - Resolved 2026-09-30: False, narrowly. Both tools matched STYLE.md's core tokens closely. AI Studio introduced one new color (#e2d3a7) not in STYLE.md; bolt introduced several. Full comparison in docs/COMPARISON.md.
- **Open:** bolt will introduce a dependency I did not ask for.
  - Resolved 2026-09-29: true. package.json listed Supabase, React, lucide-react, and Tailwind, none imported by the actual app.js logic that mattered, but present in the delivered zip. Supabase's presence is a notable finding on its own, since it directly contradicts ADR-002's decision to use Cloudflare D1.

## 3. Success criteria
| EARS row (feature) | Checked by | Where |
|---|---|---|
| WHEN a chair marks their own update as completed, THE SYSTEM SHALL update its status and persist the change. | test | evals/worker.test.js, "EARS: WHEN a chair marks their own update as completed..." |
| WHEN a brother views the central resource, THE SYSTEM SHALL display each update's status (pending or completed) alongside its other details. | judgment | docs/JUDGMENT.md #10 |
| IF a chair attempts to mark an update as completed that they did not submit, THEN THE SYSTEM SHALL reject the request. | test | evals/worker.test.js, "EARS: IF a chair attempts to mark an update as completed that they did not submit..." |
| WHEN the status update request reaches the Worker, THE SYSTEM SHALL persist it via a new endpoint using bind(), consistent with STANDARDS.md. | human | worker.js, PATCH /entries/:id/status handler, read and verified by hand; also docs/JUDGMENT.md #3 |

## 4. Error-analysis log
<!-- Every failure observed, a few words each, counted, sorted by count. -->
| Failure (a few words) | Count | Source | Category |
|---|---|---|---|
| Tool made unauthorized writes to live production Worker | 2 | bolt, AI Studio | architecture |
| Tool introduced a color not in STYLE.md | 2 | bolt, AI Studio | STYLE |
| Tool wrote unrequested scope beyond the three named files | 1 | bolt | scope |
| Tool invented a workaround instead of surfacing a spec conflict | 1 | bolt | architecture |
| Status badge label did not match FEATURES.md wording ("Active" not "Pending") | 1 | bolt | Specification |
| Unused dependency present in delivered artifact | 1 | bolt | dependency |
| Ownership check missing entirely on first output | 1 | bolt | STANDARDS |
| Pre-existing evals test written against wrong schema | 1 | template starter file, caught before running | Specification |
| npm test module-type warning, missing "type": "module" | 1 | package.json | craft |
| Tool performed a web search despite Grounding toggle disabled | 1 | AI Studio | architecture |
| Contrast failure in pre-existing .update-meta styling (4.42:1) | 1 | carried forward from HW4, caught this week | STYLE |

Most frequent categories: unauthorized production writes and STYLE.md token deviations, each appearing across both tools. These are the two failure modes worth prioritizing in future delegation: constrain what a tool can reach (a sandboxed or non-production Worker for testing), and give explicit, closed-set color instructions rather than trusting a tool to infer "stay within these tokens."

## 5. Evals
- **Code:** `npm test` with `API=https://mgt3745-hw4.princemuteteke.workers.dev`; 6 tests, 6 passing. Screenshot in README.
- **Judgment:** docs/JUDGMENT.md, 10 questions, two graders, agreement 100%.

## Verification table (carried from HW4)
| Criterion | Steps and input | Expected result | Observed result | Status | Evidence / commit |
|---|---|---|---|---|---|
| F-01/F-02 (submit + log) | Filled all five fields (name, position, initiative, update text, event/deadline date) and submitted via the Post update button. | Entry appears in the current-items view with a timestamp. | Entry appeared correctly under Current updates with name, position, initiative, timestamp, and deadline all displayed. | PASS | See app screenshot |
| F-01/F-02 (two-week display) | Used `npx wrangler d1 execute` to directly edit one entry's `created_at` in D1 to 2026-09-01, more than two weeks before the other entries' actual submission dates (2026-09-23), then reloaded the page. | The backdated entry moves to a separate Older updates section; the four entries submitted on 9/23 remain in Current updates. | The backdated entry ("First crossing test") correctly appeared under Older updates, while all four 9/23 entries stayed under Current updates. | PASS | See docs/two week test.png |
| F-03 (reminder flag) | N/A this week | N/A | N/A | DEFERRED | Deferred per Scope, see ADR-001 |
| F-04 (acknowledgment tracking) | N/A this week | N/A | N/A | DEFERRED | Deferred per Scope, see ADR-001 |
| F-06 (complete-details checklist) | N/A this week | N/A | N/A | DEFERRED | Deferred per Scope, see ADR-001 |
| F-07 (chair status update) | N/A this week | N/A | N/A | DEFERRED | Deferred per Scope, see ADR-001 |
| Survive cleared cache| Posted an entry, then opened the page in an incognito/private browsing window, which starts with no local browser storage. | Entry remains visible in a fresh private window, since data now lives in D1 rather than localStorage. | Entry appeared correctly in the private window. Previously CANNOT TEST YET in HW3, since no server existed yet to test against. | PASS | See docs/HW4Example.gif |
| POST /entries validation (400 path) | Sent a POST request via curl with an incomplete body: `{"chairName":"Prince"}`, missing the other four required fields. | Server rejects the request with a 400 status and a message naming the specific missing field. | Received `400` response reading "chair position required." Confirms the validation rule that was added, traced to the new EARS statement in Acceptance. | PASS | Terminal output, curl test |
| Server unreachable | Not run | Page shows an error message instead of breaking silently if the network or server is down. | Would need to simulate a real network failure, like pointing the app at a fake URL. The code already catches this case and shows an error, but I haven't actually triggered and watched it happen. | CANNOT TEST YET | N/A |
| Server returns 500 | Not run | Page shows a readable error instead of crashing if the Worker breaks unexpectedly. | Would need to force the Worker to fail, like breaking the database connection on purpose. The code already catches this and returns a readable error, but I haven't actually triggered and watched it happen. | CANNOT TEST YET | N/A |
| Second client writes to the same table | Not run | Two chairs submitting updates at the same time don't overwrite or corrupt each other's entries. | Not tested with two people submitting at once. The database handles simultaneous new entries safely on its own, but there's no way to edit or delete entries yet, so there's nothing in place to handle conflicts if two people tried to edit the same one. | DEFERRED | Deferred per ADR-002 consequences |