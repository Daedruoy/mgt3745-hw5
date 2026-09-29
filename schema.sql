-- schema.sql
-- One table, because your HW3 feature stores one kind of thing.
-- A second table is ADR-003 territory.
CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chair_name TEXT NOT NULL,
  chair_position TEXT NOT NULL,
  initiative TEXT NOT NULL,
  update_title TEXT NOT NULL,
  event_date TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
