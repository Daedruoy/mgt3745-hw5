# STANDARDS.md

Coding and documentation rules, for humans. Restated for agents in CLAUDE.md.
Copy in from HW3; the HW4 rows are added for you.

## Rules

1. *Your HW3 rules, five minimum.*
2. Separation of concerns: HTML for structure, CSS for presentation, JS for behavior and data.
3. User input reaches the page through `textContent`, never `innerHTML`.
4. **(HW4)** User values reach SQL through `bind()`, never string concatenation.
5. **(HW4)** No credential in the repository. Not in code, not in config, not in a context file. Database ids are addresses and may appear in `wrangler.toml`.
6. **(HW4)** A failed request is shown to the user on the page and is never thrown in the console.
7. No stray `console.log` in committed code.

## Naming

*camelCase for JS, kebab-case for files, ...*

## Documentation

*Inline comments explain why, never what. README stays current with each tag.*
