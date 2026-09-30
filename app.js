(() => {
  'use strict';

  const API = "https://mgt3745-hw4.princemuteteke.workers.dev";
  const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;

  const updateForm = document.querySelector('#update-form');
  const chairNameInput = document.querySelector('#chair-name-input');
  const chairNameError = document.querySelector('#chair-name-error');
  const chairPositionInput = document.querySelector('#chair-position-input');
  const chairPositionError = document.querySelector('#chair-position-error');
  const initiativeSelect = document.querySelector('#initiative-select');
  const initiativeError = document.querySelector('#initiative-error');
  const updateTitleInput = document.querySelector('#update-title-input');
  const updateTitleError = document.querySelector('#update-title-error');
  const eventDateInput = document.querySelector('#event-date-input');
  const eventDateError = document.querySelector('#event-date-error');
  const saveStatus = document.querySelector('#save-status');

  const currentList = document.querySelector('#current-update-list');
  const currentEmptyState = document.querySelector('#current-empty-state');
  const olderList = document.querySelector('#older-update-list');
  const olderEmptyState = document.querySelector('#older-empty-state');

  // Human-readable label for each initiative, kept separate from the stored value
  // so the stored data stays stable even if display wording changes later.
  function initiativeLabel(value) {
    const labels = {
      stepshow: 'Homecoming Stepshow',
      pageant: 'Scholarship Pageant',
      general: 'General Events',
      brotherhood: 'Brotherhood',
      national: 'National'
    };
    return labels[value] || value;
  }

  // Fetches all entries from the Worker. Network or server failure returns
  // an empty list and tells the user, rather than throwing in the console.
  async function loadUpdates() {
    try {
      const res = await fetch(API + "/entries");
      if (!res.ok) {
        saveStatus.textContent = 'Could not load updates from the server.';
        return [];
      }
      return await res.json();
    } catch {
      saveStatus.textContent = 'Could not reach the server.';
      return [];
    }
  }

  // Posts one new entry to the Worker. The server assigns id and created_at,
  // so the caller re-fetches the full list afterward rather than trusting a
  // locally built array, per ADR-002: the server is now the source of truth.
  async function postUpdate(newEntry) {
    try {
      const res = await fetch(API + "/entries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(newEntry)
      });
      if (!res.ok) {
        const reason = await res.text();
        updateTitleError.textContent = 'Could not save: ' + (reason || res.status);
        saveStatus.textContent = '';
        return false;
      }
      return true;
    } catch {
      updateTitleError.textContent = 'Could not reach the server. Your entry is still here.';
      saveStatus.textContent = '';
      return false;
    }
  }

  // F-07: Persists a status change via the real PATCH endpoint. Requires the
  // chair's name to satisfy the Worker's ownership check; this is a soft
  // check (name comparison, not authentication) and can be bypassed by
  // anyone who knows the original chair's name. Documented as a known
  // limitation in DDR-001.
  async function postStatusUpdate(entryId, newStatus, chairName) {
    try {
      const res = await fetch(`${API}/entries/${entryId}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: newStatus, chairName })
      });
      if (!res.ok) {
        const reason = await res.text();
        return { ok: false, reason: reason || String(res.status) };
      }
      return { ok: true };
    } catch {
      return { ok: false, reason: "could not reach the server" };
    }
  }

  // Splits updates by submission recency, using the server-assigned created_at
  // rather than the event or deadline date. Matches the FEATURES.md acceptance
  // criterion: this addresses updates getting buried under newer posts, not
  // whether the underlying event has already happened.
  function partitionByRecency(allUpdates) {
    const now = Date.now();
    const current = [];
    const older = [];
    allUpdates.forEach(update => {
      const createdAtMs = new Date(update.created_at.replace(' ', 'T') + 'Z').getTime();
      const age = now - createdAtMs;
      if (age <= twoWeeksInMs) {
        current.push(update);
      } else {
        older.push(update);
      }
    });
    return { current, older };
  }

  // F-07: Builds the status badge element. Shows "Completed" for completed
  // items and "Pending" for items with no recorded status, matching the
  // FEATURES.md acceptance wording exactly.
  function buildStatusBadge(update) {
    const badge = document.createElement('span');
    if (update.status === 'completed') {
      badge.className = 'update-status-badge completed';
      badge.textContent = 'Completed';
    } else {
      badge.className = 'update-status-badge pending';
      badge.textContent = 'Pending';
    }
    return badge;
  }

  // F-07: Builds the "Mark completed" button. Only rendered for updates not
  // already completed. The button is a 44px+ tap target per Fitts's Law
  // (STYLE.md refusal 2).
  function buildMarkCompleteButton(update) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mark-complete-btn';
    btn.textContent = 'Mark completed';
    btn.addEventListener('click', () => handleMarkComplete(update, btn));
    return btn;
  }

  // F-07: Handles the mark-complete interaction. Confirms the chair's name
  // client-side before sending, since the Worker rejects a mismatched name
  // with 403. Shows an inline message on failure and disables the button
  // while the request is in flight so a chair can't double-submit.
  async function handleMarkComplete(update, btn) {
    const chairName = window.prompt(
      `Confirm your name to mark this update completed (must match "${update.chair_name}"):`
    );
    if (!chairName) return;

    btn.disabled = true;
    btn.textContent = 'Saving…';
    const result = await postStatusUpdate(update.id, 'completed', chairName.trim());
    if (!result.ok) {
      btn.disabled = false;
      btn.textContent = 'Mark completed';
      saveStatus.textContent = 'Could not save status change: ' + result.reason;
      return;
    }
    saveStatus.textContent = 'Update marked as completed.';
    await refresh();
  }

  function buildUpdateListItem(update) {
    const listItem = document.createElement('li');

    const textWrap = document.createElement('span');
    textWrap.className = 'update-text';

    const titleText = document.createElement('span');
    titleText.textContent = update.update_title;

    const metaText = document.createElement('span');
    metaText.className = 'update-meta';
    const postedDate = new Date(update.created_at.replace(' ', 'T') + 'Z').toLocaleDateString();
    const eventDateDisplay = update.event_date ? `Event/deadline: ${update.event_date}` : 'No date given';
    metaText.textContent = `${initiativeLabel(update.initiative)} · Posted by ${update.chair_name}, ${update.chair_position}, on ${postedDate} · ${eventDateDisplay}`;

    textWrap.append(titleText, metaText);

    const actions = document.createElement('div');
    actions.className = 'update-actions';
    actions.append(buildStatusBadge(update));
    if (update.status !== 'completed') {
      actions.append(buildMarkCompleteButton(update));
    }

    listItem.append(textWrap, actions);
    return listItem;
  }

  function renderUpdates(updates) {
    const { current, older } = partitionByRecency(updates);

    currentList.replaceChildren();
    currentEmptyState.hidden = current.length > 0;
    current.forEach(update => currentList.append(buildUpdateListItem(update)));

    olderList.replaceChildren();
    olderEmptyState.hidden = older.length > 0;
    older.forEach(update => olderList.append(buildUpdateListItem(update)));
  }

  async function refresh() {
    const updates = await loadUpdates();
    renderUpdates(updates);
  }

  function clearFieldErrors() {
    chairNameError.textContent = '';
    chairPositionError.textContent = '';
    initiativeError.textContent = '';
    updateTitleError.textContent = '';
    eventDateError.textContent = '';
    chairNameInput.removeAttribute('aria-invalid');
    chairPositionInput.removeAttribute('aria-invalid');
    initiativeSelect.removeAttribute('aria-invalid');
    updateTitleInput.removeAttribute('aria-invalid');
    eventDateInput.removeAttribute('aria-invalid');
  }

  // Validates each field independently so a chair only has to fix what's actually
  // wrong, rather than re-entering the whole form after one mistake.
  function validateForm() {
    let isValid = true;

    const chairName = chairNameInput.value.trim();
    if (chairName.length < 1 || chairName.length > 100) {
      chairNameError.textContent = 'Enter your name, 1–100 characters.';
      chairNameInput.setAttribute('aria-invalid', 'true');
      isValid = false;
    }

    const chairPosition = chairPositionInput.value.trim();
    if (chairPosition.length < 1 || chairPosition.length > 100) {
      chairPositionError.textContent = 'Enter your chapter position, 1–100 characters.';
      chairPositionInput.setAttribute('aria-invalid', 'true');
      isValid = false;
    }

    if (!initiativeSelect.value) {
      initiativeError.textContent = 'Select an initiative.';
      initiativeSelect.setAttribute('aria-invalid', 'true');
      isValid = false;
    }

    const updateTitleCharCount = Array.from(updateTitleInput.value.trim()).length;
    if (updateTitleCharCount < 1 || updateTitleCharCount > 200) {
      updateTitleError.textContent = 'Enter an update containing 1–200 characters.';
      updateTitleInput.setAttribute('aria-invalid', 'true');
      isValid = false;
    }

    if (!eventDateInput.value) {
      eventDateError.textContent = 'Enter an event or deadline date.';
      eventDateInput.setAttribute('aria-invalid', 'true');
      isValid = false;
    }

    return isValid;
  }

  updateForm.addEventListener('submit', async event => {
    event.preventDefault();
    clearFieldErrors();
    saveStatus.textContent = '';

    if (!validateForm()) {
      saveStatus.textContent = '';
      return;
    }

    const newEntry = {
      chairName: chairNameInput.value.trim(),
      chairPosition: chairPositionInput.value.trim(),
      initiative: initiativeSelect.value,
      updateTitle: updateTitleInput.value.trim(),
      eventDate: eventDateInput.value
    };

    const ok = await postUpdate(newEntry);
    if (!ok) return;

    updateForm.reset();
    chairNameInput.focus();
    saveStatus.textContent = 'Update posted.';
    await refresh();
  });

  refresh();
})();