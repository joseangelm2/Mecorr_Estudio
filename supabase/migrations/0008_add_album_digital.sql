-- Álbum digital: modo alternativo a Instagram, con QR de subida para invitados.
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS instagram_mode TEXT NOT NULL DEFAULT 'instagram'
    CHECK (instagram_mode IN ('instagram', 'album'));

CREATE TABLE album_media (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  media_type   TEXT        NOT NULL CHECK (media_type IN ('image', 'video')),
  url          TEXT        NOT NULL,
  storage_path TEXT        NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_album_media_project ON album_media(project_id);

ALTER TABLE album_media ENABLE ROW LEVEL SECURITY;

-- El invitado (sesión anónima de Supabase) puede subir directo desde el navegador.
CREATE POLICY "guest_insert_album_media"
  ON album_media FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Solo el server (service role, vía Server Actions del admin) puede leer/borrar.
CREATE POLICY "service_role_all_album_media"
  ON album_media FOR ALL
  USING (auth.role() = 'service_role');

GRANT INSERT ON album_media TO authenticated;
GRANT ALL ON album_media TO service_role;

-- Bucket público para las fotos/videos del álbum.
INSERT INTO storage.buckets (id, name, public)
VALUES ('album-media', 'album-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "guest_upload_album_media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'album-media' AND auth.role() = 'authenticated');

CREATE POLICY "service_role_all_album_media_objects"
  ON storage.objects FOR ALL
  USING (bucket_id = 'album-media' AND auth.role() = 'service_role');
