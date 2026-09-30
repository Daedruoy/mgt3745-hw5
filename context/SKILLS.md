# SKILLS.md

Reusable patterns and delegation guidance, written so an agent (or a
stranger) could apply them next time. Each entry under fifteen lines.
Load-on-demand: an agent reads the heading first and the body only when relevant.

## Pattern: fetch with the failure shown on the page
**When:** any call from app.js to the Worker.
**Do:** check `res.ok`; on failure, read `res.text()` and put it in the
status element with `textContent`; wrap the call in try/catch for network
errors; never throw to the console.
**Because:** localStorage never failed; the network does (ADR-002).

## Delegation guidance: what to paste, what to check first
**Paste, in order:** PROJECT, FEATURES (rows marked), STYLE, STANDARDS, TOOLS, then the current page files. One instruction line naming the files it may touch.
**Check first:** the diff's file list, then innerHTML / concatenated SQL, then whether it used the tokens.
**Reliably wrong (this week):** bolt invented a fake-entry workaround instead of asking when the file restriction conflicted with an EARS row requiring a new endpoint; both bolt and AI Studio treated the live deployed Worker as freely testable, making real writes to production during generation.

## Pattern: soft ownership check without real authority
**When:** a write endpoint needs to restrict who can modify a record, but the project has no authentication system.
**Do:** SELECT the record's owner field first; compare it to a client-submitted identifier with `.trim()` on both sides; return 403 with a plain-text reason on mismatch; document in the DDR that this is a name comparison, not real auth, and can be bypassed by anyone who knows the stored value.
**Because:** F-07 needed to restrict status changes to the submitting chair with no login system to rely on. See worker.js's `PATCH /entries/:id/status` handler.

## Delegation guidance: scope the server file in, don't just restrict to the client
**When:** a delegated feature's EARS rows require new server-side behavior.
**Do:** before writing the prompt, read every EARS row for the feature; if any requires new server behavior, either name the server file explicitly as in-scope ("you may add one endpoint to worker.js, using bind() for all user values") or descope the feature so it doesn't need one. State plainly whether any URL given to the tool is live production data.
**Because:** "modify only these three files" plus an EARS row requiring a new endpoint is an unsolvable constraint; bolt resolved it by fabricating client-side storage instead of flagging the conflict.