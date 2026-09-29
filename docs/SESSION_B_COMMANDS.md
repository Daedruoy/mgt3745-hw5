# HW5: Repository Setup and Session B Steps

This repository is the HW5 template. Create your own copy with **Use this
template**, name it `mgt3745-hw5`, and open it in a Codespace. Your HW4
repository stays exactly as you submitted it; link it from your new README.

## Step 0: Bring Your HW4 Work In

Copy these files from your HW4 repository over the template's, by name:

- `index.html`, `styles.css`, `app.js`, `worker.js`, `wrangler.toml`, `schema.sql`
- your `docs` GIFs and screenshots (keep the template's `docs/*.md` files)
- `context/PROJECT.md`, `USERS.md`, `FEATURES.md`, `STANDARDS.md`, `ARCHITECTURE.md`, `CLAUDE.md`, `TOOLS.md`, `STYLE.md`
- `context/curiosity/`

Do **not** copy your HW4 `EVALS.md` or `SKILLS.md`. Those were previews; the
template holds the real formats. Then `npm install` (the devcontainer does
this on create) and confirm `API=<your worker url> npm test` runs the three
starter tests against your deployed Worker.

## Session B, in order

1. **Stake.** Fill sections 1 and 2 of `context/EVALS.md`. Commit:
   `git commit -am "EVALS.md: RAT and stake before build"`. Note the time.
2. **Delegate.** In bolt.new, paste PROJECT, FEATURES (rows marked), STYLE,
   STANDARDS, TOOLS, then index.html, styles.css, app.js. One instruction line:
   *Implement the feature marked in FEATURES.md, in these three files only.
   Follow STYLE.md and STANDARDS.md. Do not add dependencies. Ask before
   changing anything else.* Do not connect GitHub. Download the zip to
   `delegated/bolt-001.zip`. Commit it unmodified.
3. **Read.** `docs/CHECKLIST.md`, bolt column. Each No is a log row.
4. **AI Studio.** Same paste, same line, Build tab. Checklist, second column.
5. **Record.** Copy `docs/DDR_TEMPLATE.md` to `docs/DDR-001.md` and fill it.
   Resolve the stake in EVALS.md (add resolutions; never edit predictions).
   Start the error-analysis log. Commit.

## HW5, after class

- Integrate the feature into your three files; fix what the checklist caught; every fix is a Findings line.
- New endpoint if needed, in `worker.js`, with `bind()`; redeploy.
- Add your feature's test to `evals/worker.test.js`; screenshot `npm test` passing into `docs/npm-test.png`.
- `docs/JUDGMENT.md`: ten questions, two graders, disagreements marked.
- `docs/DDR-002.md`: one HW4 Copilot delegation, written up.
- `docs/COMPARISON.md`: half a page.
- STYLE.md contrast-checked (WebAIM), laws named, tokens present in styles.css.
- SKILLS.md: one pattern, one guidance entry.
- README: HW4 linked, Delegation section, test screenshot, hours.

## Common Failures

| Symptom | Cause | Fix |
|---|---|---|
| `npm test` says "Set API to your deployed Worker URL" | Environment variable missing | `API=https://... npm test` on one line. |
| Tests fail with "fetch failed" | Worker URL wrong or Worker not deployed | Open the URL in a tab first. |
| bolt output is a whole new app with its own storage | The instruction line was not pasted, or FEATURES rows were not marked | That is a finding. Log it, then re-run with the line, and keep both zips. |
| bolt added a dependency | Checklist question 4 | Log it. Remove it during integration unless you can name what it does and why you need it. |
| Grader 2 disagrees with you on most questions | The rubric question is ambiguous | Rewrite the question until two people can answer it the same way. Log the rewrite. |


