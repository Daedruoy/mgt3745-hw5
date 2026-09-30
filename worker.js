// worker.js
// The whole server. Read it before you deploy it.
//
// Four things to recognize here, because you will need to recognize them
// later in code you did not write:
//   env.DB      the D1 binding from wrangler.toml (no connection string, nothing to leak)
//   bind(?)     the user's value goes in as a parameter, never pasted into the SQL
//   status 400  the EARS "unwanted behavior" row, executable
//   CORS        headers that tell the browser your page is allowed to call this Worker

// Session B uses "*" so everyone's page works on the first try.
// HW4 Craft credit: replace "*" with your page's origin once it is deployed.
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PATCH, OPTIONS",
  "access-control-allow-headers": "content-type",
};

export default {
  async fetch(request, env) {
    // Anything that throws below becomes a readable 500 instead of a bare
    // "Error 1101: Worker threw exception". The message names the cause,
    // which is what your verification table needs.
    try {
      return await handle(request, env);
    } catch (err) {
      return new Response("server error: " + err.message, { status: 500, headers: CORS });
    }
  },
};

async function handle(request, env) {
  const url = new URL(request.url);

  // Browsers send an OPTIONS "preflight" before a JSON POST from another
  // origin. Answer it with the CORS headers and nothing else.
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  // The most common Session B failure: the D1 binding did not attach because
  // wrangler.toml still says PASTE_ID_HERE or the id was pasted badly.
  if (!env.DB) {
    return new Response(
      "server error: no D1 binding. Check database_id in wrangler.toml and redeploy.",
      { status: 500, headers: CORS });
  }

  if (request.method === "GET" && url.pathname === "/entries") {
    const { results } = await env.DB.prepare(
      "SELECT * FROM entries ORDER BY id").all();
    return Response.json(results, { headers: CORS });
  }

  if (request.method === "POST" && url.pathname === "/entries") {
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("body must be JSON", { status: 400, headers: CORS });
    }

    // Validation rule, traces to FEATURES.md: every field is required on
    // submission (matches the client-side validateForm checks already in
    // app.js). Names which field is missing, per the assignment's "return
    // 400 with a message naming the problem."
    const requiredFields = [
      ["chairName", "chair name"],
      ["chairPosition", "chair position"],
      ["initiative", "initiative"],
      ["updateTitle", "update title"],
      ["eventDate", "event date"],
    ];
    for (const [key, label] of requiredFields) {
      if (!body[key] || typeof body[key] !== "string" || body[key].trim() === "") {
        return new Response(`${label} required`, { status: 400, headers: CORS });
      }
    }

    const { results } = await env.DB.prepare(
      `INSERT INTO entries (chair_name, chair_position, initiative, update_title, event_date)
       VALUES (?, ?, ?, ?, ?)
       RETURNING id, chair_name, chair_position, initiative, update_title, event_date, created_at`
    ).bind(
      body.chairName.trim(),
      body.chairPosition.trim(),
      body.initiative.trim(),
      body.updateTitle.trim(),
      body.eventDate.trim()
    ).all();

    return Response.json(results[0], { status: 201, headers: CORS });
  }

  // PATCH /entries/:id/status — F-07: a chair marks their own update completed.
  // Ownership check is a soft check (name comparison, not real authentication),
  // since this project has no auth system; the DDR should say so plainly.
  const statusMatch = url.pathname.match(/^\/entries\/(\d+)\/status$/);
  if (request.method === "PATCH" && statusMatch) {
    const entryId = statusMatch[1];

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("body must be JSON", { status: 400, headers: CORS });
    }

    if (!body.status || (body.status !== "pending" && body.status !== "completed")) {
      return new Response("status must be 'pending' or 'completed'", { status: 400, headers: CORS });
    }

    if (!body.chairName || typeof body.chairName !== "string" || body.chairName.trim() === "") {
      return new Response("chair name required to verify ownership", { status: 400, headers: CORS });
    }

    const { results: existing } = await env.DB.prepare(
      "SELECT chair_name FROM entries WHERE id = ?"
    ).bind(entryId).all();

    if (existing.length === 0) {
      return new Response("entry not found", { status: 404, headers: CORS });
    }

    // Soft ownership check: compares submitted name to stored chair_name.
    // Not real authentication. A chair could type someone else's name to
    // bypass this. Documented as a known limitation in DDR-001.
    if (existing[0].chair_name.trim() !== body.chairName.trim()) {
      return new Response("only the chair who submitted this update may change its status", { status: 403, headers: CORS });
    }

    const { results } = await env.DB.prepare(
      `UPDATE entries SET status = ? WHERE id = ?
       RETURNING id, chair_name, chair_position, initiative, update_title, event_date, created_at, status`
    ).bind(body.status.trim(), entryId).all();

    return Response.json(results[0], { headers: CORS });
  }

  return new Response("not found", { status: 404, headers: CORS });
}