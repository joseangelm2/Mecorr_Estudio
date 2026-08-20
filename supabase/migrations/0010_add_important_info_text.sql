ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS important_info_text TEXT;
