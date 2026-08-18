-- Grupos de invitados por evento (project)
CREATE TABLE IF NOT EXISTS grupos_evento (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  nombre     TEXT        NOT NULL,
  color      TEXT        NOT NULL DEFAULT '#C4956A',
  orden      INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, nombre)
);

CREATE INDEX IF NOT EXISTS idx_grupos_evento_project ON grupos_evento(project_id);

ALTER TABLE grupos_evento ENABLE ROW LEVEL SECURITY;

-- Solo el service role puede operar esta tabla (todas las ops pasan por API routes)
DROP POLICY IF EXISTS "service_role_all_grupos" ON grupos_evento;
CREATE POLICY "service_role_all_grupos"
  ON grupos_evento FOR ALL
  USING (auth.role() = 'service_role');

GRANT ALL ON grupos_evento TO authenticated;
GRANT ALL ON grupos_evento TO service_role;
