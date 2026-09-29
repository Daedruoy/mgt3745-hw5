# Tokens: what a machine reads. Replace every value with one pulled from the
# interface you admire. Guess the hex; precision is HW5's problem.
color-primary: "#0D0D0D"
color-accent: "#A8842C"
color-background: "#F7F1DE"
color-text: "#0D0D0D"
font-body: "Arial"
font-heading: "Arial"
font-size-min: 14px
space-unit: 8px
radius: 4px
---

# STYLE.md

Tokens above, rationale below. The frontmatter is what a machine reads; this
body is what a human reads. One sentence per token. "Looks clean" is fog;
"gold fails contrast on white at body size" is at altitude.

## Rationale

- **color-primary**: Black, because it's the fraternity's primary color, the interface should look like it belongs to the fraternity, not generic software.
- **color-accent**: Also a fraternity color. Old gold, used only for buttons, headings, and section dividers, never for body text, since gold fails contrast against a light background at small sizes.
- **color-background**: A cream tone rather than pure white, since white next to gold reads flat; cream keeps the warmth of the gold consistent across the page.
- **font-body / font-heading**: Arial for both, one family used everywhere, because it renders reliably on any device a brother checks the page on without waiting on a web font to load.
- **space-unit**: 8px, so every gap in the layout is a multiple of one number, which is what makes spacing look deliberate.
- **font-size-min**: 14px, since brothers are most likely checking this page quickly on a phone between classes, and anything smaller becomes hard to read at a glance.

## Refusals

Things this interface will never do, and why. Taken from the interface you
resent. Name the Law of UX it breaks (lawsofux.com).

1. No modal will ever appear for something the chair didn't explicitly ask for. Georgia Tech's registration portal does this constantly for routine actions, adding a confirmation click where none is needed. Breaks Jakob's Law: people expect this tool to behave like the well-built software they already use elsewhere, not interrupt them with friction they don't encounter on other sites.
2. No interactive element will be smaller than a comfortable thumb target on a phone screen. A dense, cramped layout like the registration portal's forces users to zoom or mis-tap. Breaks Fitts's Law: the time to acquire a target depends on its size and distance, so small buttons on a small screen slow every interaction down.

## Sources

- Admired: Notion's base interface it feels modern and properly spaced.
- Resented: Georgia Tech's registration and records portal, dense, inconsistent spacing, and routine actions buried behind several clicks.