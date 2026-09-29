# FEATURES.md

The living feature table and the verification record. Copy in from HW3 and extend.

## Features

| Feature | Kano | Status |
|---|---|---|
| *Save and list entries* | *Basic* | *Built (HW3), server-backed (HW4)* |
| *...* | | |

## Acceptance criteria (EARS)

- THE SYSTEM SHALL return all entries in creation order.
- WHEN a valid entry is submitted, THE SYSTEM SHALL store it and confirm.
- IF the entry text is missing, THEN THE SYSTEM SHALL reject it and say why.
- IF the server cannot be reached, THEN THE SYSTEM SHALL tell the user on the page.
- *Add the unwanted-behavior statement your HW4 validation rule implements.*

## Verification

Walk every statement against the deployed page. PASS, FAIL, CANNOT TEST YET, or DEFERRED, with a reason.

| Statement | HW3 verdict | HW4 verdict | Reason |
|---|---|---|---|
| Return entries in order | PASS | *?* | |
| Store valid entry | PASS | *?* | |
| Reject missing text | *?* | *?* | |
| Survive cleared cache | CANNOT TEST YET | *?* | *now testable* |
| Server unreachable | | *?* | *how would you simulate an outage?* |
| Server returns 500 | | *?* | |
| Second client writes to the same table | | *?* | *DEFERRED if ADR-002 says so* |
