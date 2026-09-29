# CLAUDE.md

Always-on instructions for any agent working in this repository. Read
STANDARDS.md for the human version; this file restates it as rules an
agent follows without being asked.

## Read first

PROJECT.md, FEATURES.md, ARCHITECTURE.md, STANDARDS.md, TOOLS.md, STYLE.md.
Do not read /curiosity unless asked.

## Rules

- Never use `innerHTML` with user input. Use `textContent`.
- Never build SQL by concatenating strings. Use `prepare(...).bind(...)`.
- Never write a credential, token, or key into any file in this repository.
- Never add a dependency without adding a row to TOOLS.md.
- Every new endpoint implements an EARS statement in FEATURES.md. Quote it in a comment.
- Handle failed responses on the page. Never throw to the console.
- Prefer the boring choice. Name any innovation token you spend in an ADR.
- Small diffs. One concern per commit. Explain why in the message.

## When unsure

Ask, in a comment or in the chat, rather than guessing. Say what you could
not verify.
