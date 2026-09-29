# Standards

Status: ACTIVE in Module 3. Adapt these rules to your feature and follow them.

1. Use descriptive camelCase identifiers, for example currentItems or logUpdate. Short conventional event/index names are acceptable when their role is obvious; arbitrary minimum name lengths are unnecessary. Use kebab-case for file names.
2. Separate HTML, CSS, and JavaScript into index.html, styles.css, and app.js. No inline styles in HTML, and no script content in the HTML beyond the single tag that loads app.js. Use lexical scope; do not create accidental global variables.
3. Explain important reasons in comments, not a narration of every statement. Remove temporary debug output before submission.
4. Write commit messages in the imperative mood that name the changed behavior and purpose in one line, for example "Add timestamp to submitted updates" rather than "updated stuff" or "final."
5. Use textContent for user text. Never insert user strings through innerHTML.
6. Associate form controls with labels and make success/error feedback perceivable. Preserve unsaved input when a write fails.
7. Present submitted items only as what a chair actually entered. Do not imply an item has been seen or acknowledged by anyone unless that state is explicitly recorded, and do not fabricate urgency or a deadline that was not part of the submitted data.
8. Give each JavaScript function a distinct purpose, so that reminder logic, acknowledgment tracking, or chair status updates can be added later without unnecessarily affecting the submit-and-display behavior.
9. User values reach SQL through bind(), never string concatenation.
10. No credential in the repository. Database ids are addresses and may appear in wrangler.toml.
11. A failed request is shown to the user on the page and is never thrown in the console.



This file is normative if an adapter or context/CLAUDE.md conflicts. Repair inconsistent copies; do not silently choose different policies for humans and agents.

## Split Test

**Rule 8 (distinct function purpose):**

Does this rule apply to every task in the project, or to some? Every task touching JavaScript, since it's a structural decision about how the code is organized, not tied to any one feature. Does it stay the same from task to task, or change? It stays constant through the entire project, since it's already tied to the plan to add F-03, F-04, and F-07 later without reworking this week's code. If it lands in the wrong place, which failure mode does that risk? Confusion, if this only lived in a task prompt instead of persistent context, an agent could write one function well-separated and the next tangled, since nothing would remind it consistently across sessions.

Verdict: this rule belongs in CLAUDE.md.

**Rule 4 (commit messages):**

Does this rule apply to every task, or to some? Only some, it's irrelevant to a task like building the submission form or the display logic, and only matters at the moment of writing a commit message. Does it stay the same from task to task, or change? Stays the same whenever it applies. If it lands in the wrong place, which failure mode does that risk? Distraction, since CLAUDE.md is persistent context loaded on every task, this rule spends attention on tasks that have nothing to do with committing, which is most of them.

Verdict: this rule belongs in the prompt for the task that needs it, not CLAUDE.md. Removed from CLAUDE.md. Prompt snippet: "Write a commit message for this change in the imperative mood, naming the changed behavior and purpose in one line, for example 'Add timestamp to submitted updates' rather than vague phrasing like 'updated stuff.'"

**Rule 7 (no fabricated acknowledgment or urgency):**

Does this apply to every task, or just some? Only tasks that touch how submitted items get rendered or displayed, not something universal like naming or file structure. Does it stay the same or change? The idea stays the same, but the specifics, acknowledgment state, deadlines, are tied to this one feature. If it ends up in the wrong place, what breaks? Confusion, it would look out of place attached to a task that's only touching CSS, but since CLAUDE.md is already scoped to this one feature, it makes sense to keep it here.

Verdict: this rule belongs in CLAUDE.md.