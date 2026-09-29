# TOOLS.md

The ledger of Trust Boundary crossings. One row per external service this
repository depends on. Read by the agent on every task, so keep it short: a
service not in use does not belong here.

Never put a credential in this file. A key, token, or password anywhere in
the repository is graded as a security failure regardless of the rest.

Each crossing statement answers three questions in one first-person sentence:
what crosses, to whom, and who is accountable.

| Service | Trusted with | Credentials live | Crossing statement | Switching cost |
|---|---|---|---|---|
| Cloudflare Workers + D1 | Every chapter update a chair submits (name, position, initiative, title, event date); request metadata (IP, timestamp) Cloudflare logs by default | Cloudflare dashboard login; wrangler device-auth token inside this Codespace | Chapter updates a chair types leave the browser and are stored on D1 under Cloudflare's free-tier terms, in a region I did not choose. I am accountable for what happens to that data. | Medium: export with `wrangler d1 export`, rewrite the Worker for another host |
| GitHub + Codespaces | Source code, commit history, the devcontainer configuration | GitHub account login; SSO | All code and history are on GitHub. Template repos mean no product dependency beyond git itself. | Low: git clone anywhere |
| Copilot | Repo contents, including worker.js and every context file, as context for suggestions | GitHub account | Everything in this repository may be sent to Copilot as context on every task. No secrets belong in the repo, ever, because of this. | Low: turn it off |
| wrangler (npm) | Nothing of mine directly; it holds my Cloudflare auth token locally and executes deploy/database commands on my behalf | Device-auth token stored locally by wrangler after login | wrangler is a third-party npm package with its own maintainers; every deploy and database command in this project runs through code I did not write and have not audited. I am accountable for trusting it. | Low: it's a CLI tool, no data lock-in beyond the Cloudflare account itself |

## Revisit triggers

- A new service is added to the repository.
- A vendor changes pricing, terms, or region.
- A credential moves.
