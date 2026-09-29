# Canonical agent instructions

Status: ACTIVE in Module 3. Read context/STANDARDS.md and the selected scope in FEATURES.md before editing. STANDARDS.md is normative; report and repair conflicting instruction wording.

This page is a prototype of a chapter management tool for Nu Mu, the Georgia Tech chapter of Alpha Phi Alpha Fraternity, Inc. It exists so a chair can submit a time-sensitive update and have it logged with a timestamp and surfaced in a current-items view, so it is not buried once newer messages arrive. Within each list, display updates in reverse-chronological order, most recently submitted first, so a chair posting something new sees it appear at the top rather than needing to scroll past older entries. Use descriptive camelCase names for variables and functions, and kebab-case for file names. Keep HTML, CSS, and JavaScript separate across index.html, styles.css, and app.js; do not use inline styles, and do not add script content to the HTML beyond the single tag that loads app.js. Use lexical scope and avoid creating accidental global variables. Give each JavaScript function a distinct purpose and keep them broadly connected, so that reminder logic, acknowledgment tracking, or chair status updates can be added later without unnecessarily affecting the submit-and-display behavior. Explain significant reasons in comments rather than narrating what the code does, including why sections of HTML, CSS, and JavaScript exist, so another brother or developer inheriting this project can understand and maintain it. Remove temporary debug output before submitting. Insert user text with textContent; do not use innerHTML for it. Label controls and preserve unsaved input after a failed write. Present submitted items only as what a chair actually entered; do not imply an item has been seen or acknowledged by anyone unless that state is explicitly recorded, and do not fabricate urgency or a deadline that was not part of the submitted data. Verify expected behavior before claiming completion. Never invent interview evidence or test results. Leave preview files as previews. Never build SQL by concatenating strings; use prepare(...).bind(...) instead. Never write a credential, token, or key into any file in this repository. Never add a dependency without adding a row to TOOLS.md. Handle failed responses on the page; never throw to the console.



Root CLAUDE.md imports this file for Claude Code. VS Code Copilot uses the separate .github/copilot-instructions.md adapter. A location under /context alone is not a guarantee of automatic discovery.

## Colleague Test

**Reviewer:** Aaron

**What they understood correctly:** They correctly identified this as a system handling time-sensitive updates for the Nu Mu chapter, and described most of the rules as clear and effective for Claude to follow without further explanation.

**What they misunderstood or asked about:** They asked how newer updates are ordered in the current-items view, specifically whether new entries appear above or below existing ones, and whether the list is sorted by timestamp at all. 

**Revision made:** Added a line to CLAUDE.md specifying that updates display in reverse-chronological order, most recent first, within their current or older grouping, so an agent extending this feature later doesn't have to guess or introduce an inconsistent order.