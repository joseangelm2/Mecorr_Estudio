-- Álbum digital: modo alternativo a Instagram, con QR de subida para invitados.
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS instagram_mode TEXT NOT NULL DEFAULT 'instagram'
    CHECK (instagram_mode IN ('instagram', 'album'));

CREATE TABLE IF NOT EXISTS album_media (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  media_type   TEXT        NOT NULL CHECK (media_type IN ('image', 'video')),
  url          TEXT        NOT NULL,
  storage_path TEXT        NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_album_media_project ON album_media(project_id);

ALTER TABLE album_media ENABLE ROW LEVEL SECURITY;

-- El invitado (sesión anónima de Supabase) puede subir directo desde el navegador,
-- solo si el proyecto tiene el álbum activo y está publicado — evita que alguien
-- inserte filas para un project_id adivinado que no tiene el álbum habilitado.
DROP POLICY IF EXISTS "guest_insert_album_media" ON album_media;
CREATE POLICY "guest_insert_album_media"
  ON album_media FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = album_media.project_id
        AND projects.instagram_mode = 'album'
        AND projects.status = 'published'
    )
  );

-- Solo el server (service role, vía Server Actions del admin) puede leer/borrar.
DROP POLICY IF EXISTS "service_role_all_album_media" ON album_media;
CREATE POLICY "service_role_all_album_media"
  ON album_media FOR ALL
  USING (auth.role() = 'service_role');

GRANT INSERT ON album_media TO authenticated;
GRANT ALL ON album_media TO service_role;

-- Bucket público para las fotos/videos del álbum.
INSERT INTO storage.buckets (id, name, public)
VALUES ('album-media', 'album-media', true)
ON CONFLICT (id) DO NOTHING;

-- Igual que la policy de la tabla: el primer segmento del path de storage es el
-- project_id (ver AlbumUploadClient: `${projectId}/${filename}`), así que se valida
-- contra el mismo criterio (álbum activo + proyecto publicado).
DROP POLICY IF EXISTS "guest_upload_album_media" ON storage.objects;
CREATE POLICY "guest_upload_album_media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'album-media'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id::text = (storage.foldername(name))[1]
        AND projects.instagram_mode = 'album'
        AND projects.status = 'published'
    )
  );

DROP POLICY IF EXISTS "service_role_all_album_media_objects" ON storage.objects;
CREATE POLICY "service_role_all_album_media_objects"
  ON storage.objects FOR ALL
  USING (bucket_id = 'album-media' AND auth.role() = 'service_role');
