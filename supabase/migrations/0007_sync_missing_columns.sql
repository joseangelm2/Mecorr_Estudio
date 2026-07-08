-- Columnas que existían en producción sin migración formal.
-- Agregadas aquí para sincronizar el schema local con producción.
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS color_theme          TEXT,
  ADD COLUMN IF NOT EXISTS invitation_text      TEXT,
  ADD COLUMN IF NOT EXISTS show_video           BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS video_youtube_id     TEXT,
  ADD COLUMN IF NOT EXISTS video_url            TEXT,
  ADD COLUMN IF NOT EXISTS show_lluvia_sobres   BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS lluvia_sobres_text   TEXT,
  ADD COLUMN IF NOT EXISTS show_datos_bancarios BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS datos_bancarios_text TEXT;
