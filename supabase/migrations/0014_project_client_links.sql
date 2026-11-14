-- Link único por proyecto para que el cliente llene los datos de su invitación
-- (/registro/<token>). El token vive en una tabla aparte y NO en `projects`
-- porque `projects` tiene GRANT SELECT a anon: una columna ahí quedaría legible
-- en los proyectos publicados. Esta tabla no tiene ningún grant a anon.

CREATE TABLE IF NOT EXISTS project_client_links (
  project_id     UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  token          TEXT UNIQUE NOT NULL,
  open           BOOLEAN NOT NULL DEFAULT true,
  submitted_at   TIMESTAMPTZ,
  last_saved_at  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE project_client_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_all_client_links" ON project_client_links;
CREATE POLICY "admin_all_client_links"
  ON project_client_links FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

REVOKE ALL ON project_client_links FROM anon;
GRANT ALL ON project_client_links TO authenticated;
GRANT ALL ON project_client_links TO service_role;
