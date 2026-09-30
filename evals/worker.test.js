// evals/worker.test.js
// The code eval. Run with:   API=https://mgt3745-hw4.<you>.workers.dev npm test
// Each test names the EARS row it checks.
import { test } from "node:test";
import assert from "node:assert/strict";

const API = process.env.API;
if (!API) throw new Error("Set API to your deployed Worker URL: API=https://... npm test");

test("EARS: THE SYSTEM SHALL return all entries in creation order (GET /entries is 200 + array)", async () => {
  const res = await fetch(API + "/entries");
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body));
  for (let i = 1; i < body.length; i++) assert.ok(body[i].id > body[i - 1].id, "ids ascending");
});

test("EARS: IF a required field is missing, THEN THE SYSTEM SHALL reject it and name which (POST with only chairName is 400)", async () => {
  const res = await fetch(API + "/entries", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chairName: "eval-test" }),
  });
  assert.equal(res.status, 400);
  const reason = await res.text();
  assert.ok(reason.length > 0, "400 carries a reason");
  assert.ok(reason.includes("chair position"), "names the specific missing field");
});

test("EARS: WHEN a valid entry is submitted, THE SYSTEM SHALL store it with a timestamp (POST then GET shows it)", async () => {
  const marker = "eval-" + Date.now();
  const post = await fetch(API + "/entries", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chairName: "Eval Tester",
      chairPosition: "Eval",
      initiative: "general",
      updateTitle: marker,
      eventDate: "2026-12-31",
    }),
  });
  assert.equal(post.status, 201);
  const created = await post.json();
  assert.ok(created.id, "response includes a server-assigned id");
  assert.ok(created.created_at, "response includes a server-assigned timestamp");

  const list = await (await fetch(API + "/entries")).json();
  assert.ok(list.some(e => e.update_title === marker), "posted entry appears in GET");
});

// F-07: chair marks their own update as completed.
test("EARS: WHEN a chair marks their own update as completed, THE SYSTEM SHALL update its status and persist the change (PATCH then GET reflects it)", async () => {
  const marker = "eval-status-" + Date.now();
  const post = await fetch(API + "/entries", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chairName: "Eval Owner",
      chairPosition: "Eval",
      initiative: "general",
      updateTitle: marker,
      eventDate: "2026-12-31",
    }),
  });
  const created = await post.json();

  const patch = await fetch(`${API}/entries/${created.id}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: "completed", chairName: "Eval Owner" }),
  });
  assert.equal(patch.status, 200);
  const patched = await patch.json();
  assert.equal(patched.status, "completed");

  const list = await (await fetch(API + "/entries")).json();
  const found = list.find(e => e.id === created.id);
  assert.equal(found.status, "completed", "status change persisted and is visible on GET");
});

// F-07: reject a chair who did not submit the update.
test("EARS: IF a chair attempts to mark an update as completed that they did not submit, THEN THE SYSTEM SHALL reject the request (mismatched chairName is 403)", async () => {
  const marker = "eval-ownership-" + Date.now();
  const post = await fetch(API + "/entries", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chairName: "Real Owner",
      chairPosition: "Eval",
      initiative: "general",
      updateTitle: marker,
      eventDate: "2026-12-31",
    }),
  });
  const created = await post.json();

  const patch = await fetch(`${API}/entries/${created.id}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: "completed", chairName: "Someone Else" }),
  });
  assert.equal(patch.status, 403);
  const reason = await patch.text();
  assert.ok(reason.length > 0, "403 carries a reason");
});

// F-07: the new endpoint validates its status value.
test("EARS: IF the status value is not 'pending' or 'completed', THEN THE SYSTEM SHALL reject it (invalid status is 400)", async () => {
  const marker = "eval-badstatus-" + Date.now();
  const post = await fetch(API + "/entries", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chairName: "Eval Owner",
      chairPosition: "Eval",
      initiative: "general",
      updateTitle: marker,
      eventDate: "2026-12-31",
    }),
  });
  const created = await post.json();

  const patch = await fetch(`${API}/entries/${created.id}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: "done", chairName: "Eval Owner" }),
  });
  assert.equal(patch.status, 400);
});