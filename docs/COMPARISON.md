# COMPARISON.md — bolt.new vs. Google AI Studio (Gemini 3.8 Flash)

## What each tool did

bolt.new had no real PATCH endpoint to work with and was told not to touch worker.js. It solved that by faking it: it stored status changes as regular entries (initiative: "_status", chairName: "system") and reconstructed status client-side by filtering those out on every load. It also made three undisclosed POST requests against my live production Worker during generation, leaving test data I had to find and delete. EARS result on its raw output: 1 pass, 1 partial, 2 fail.

Google AI Studio took a different approach. Given the same instruction and file restriction, it explored the codebase, then ran a series of curl commands directly against my live, deployed Worker to figure out what endpoints existed, guessing five different URL patterns before landing on the correct one. It flipped two real production entries' status back and forth as a side effect of this testing. It also ran a web search for assignment-related terms ("MGT 3745" "F-07"... "mark their own update as completed"), pulling results from gatech.edu, despite Grounding with Google Search being manually turned off beforehand. Once it found the working endpoint, it called it correctly and didn't invent client-side storage. EARS result: 4 of 4 passed.

One asymmetry worth naming: by the time AI Studio ran, the real PATCH endpoint already existed on the live Worker, built by hand after reviewing bolt's failed attempt. bolt never had that endpoint available. AI Studio's task was "find and call an existing endpoint," not "invent a way to persist status with no endpoint available." That's a real difference in difficulty, and it means AI Studio's clean EARS score isn't purely a reflection of better reasoning.

## Where they agreed

Both avoided localStorage. Both attempted to call the Worker rather than invent purely client-side state, once each found or was given a path to do it. Both kept STYLE.md's core tokens intact, black, gold, cream, with high fidelity. Both introduced at least one color not in STYLE.md for a new UI element, bolt's badge colors and AI Studio's #e2d3a7 completed-badge background.

## Where they differed

bolt's failure was architectural: unable to persist status correctly, it fabricated a workaround that corrupted the data model. AI Studio's failure was behavioral: it avoided fabricating storage, but got there by aggressively probing production, guessing endpoint paths and mutating real data along the way, and by searching the web for assignment content despite a setting meant to prevent that. Neither failure mode is worse than the other, they're different categories of risk. bolt's is a risk to data integrity. AI Studio's is a risk to system security and information exposure.

## Resolving the Loose prediction

The Loose prediction, "bolt will follow STYLE.md's color and spacing tokens more accurately than AI Studio", is false, narrowly. Both tools matched STYLE.md's core tokens closely. AI Studio's one new color is arguably a smaller deviation than bolt's introduced palette. Token fidelity turned out not to be the real story here, the Trust Boundary behavior was.

## No verdict

No conclusion here on which tool is better overall. What's clear from this run: an agentic build tool given access to a live API will use it, for better (correct persistence) or worse (unauthorized probing and data mutation), and neither tool asked permission before touching production.