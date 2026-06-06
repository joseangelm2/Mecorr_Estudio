ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS confirmation_phrase TEXT,
  ADD COLUMN IF NOT EXISTS confirmation_highlight_date TEXT;
