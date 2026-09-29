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
| Cloudflare Workers + D1 | Every entry a user types; request metadata (IP, timestamp) that Cloudflare logs by default | Cloudflare dashboard login; wrangler token inside the Codespace | "User entries leave the browser and are stored on D1 under Cloudflare's free-tier terms, in a region I did not choose. I am accountable." | Medium: `wrangler d1 export`, rewrite one Worker for another host |
| GitHub + Codespaces | Source, commit history, devcontainer | GitHub account (SSO) | *write yours* | *Low / Medium / High, plus the one action required to leave* |
| GitHub Copilot | Everything in the repository, as context for suggestions | GitHub account | *write yours* | |
| wrangler (npm) | *what does an npm package receive?* | *none, but it holds the login token above* | *write yours; the event-stream debate applies here* | |

## Revisit triggers

- A new service is added to the repository.
- A vendor changes pricing, terms, or region.
- A credential moves.
