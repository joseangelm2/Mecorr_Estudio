ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS show_floating_controls BOOLEAN NOT NULL DEFAULT true;
