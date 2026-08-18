-- Tabla de invitados por evento (project)
CREATE TABLE invitados (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id           UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  grupo_id             UUID        NOT NULL REFERENCES grupos_evento(id) ON DELETE RESTRICT,
  titular              TEXT        NOT NULL,
  num_invitados        INTEGER     NOT NULL DEFAULT 1 CHECK (num_invitados >= 0),
  whatsapp             TEXT,
  token                UUID        UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  estado               TEXT        NOT NULL DEFAULT 'alta'
                                   CHECK (estado IN ('alta', 'enviado', 'confirmo', 'baja')),
  confirmacion         TEXT        CHECK (confirmacion IN ('SI', 'NO')),
  fecha_envio          TIMESTAMPTZ,
  fecha_confirmacion   TIMESTAMPTZ,
  mensaje_felicitacion TEXT,
  device_id            UUID,
  created_at           TIMESTAMPTZ DEFAULT now(),
  updated_at           TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_invitados_project ON invitados(project_id);
CREATE UNIQUE INDEX idx_invitados_token ON invitados(token);
CREATE INDEX idx_invitados_estado  ON invitados(estado);
CREATE INDEX idx_invitados_grupo   ON invitados(grupo_id);

ALTER TABLE invitados ENABLE ROW LEVEL SECURITY;

-- Solo el service role puede operar esta tabla
CREATE POLICY "service_role_all_invitados"
  ON invitados FOR ALL
  USING (auth.role() = 'service_role');

-- Trigger updated_at reutiliza la función ya existente en la migración 0001
CREATE TRIGGER set_invitados_updated_at
  BEFORE UPDATE ON invitados
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

GRANT ALL ON invitados TO authenticated;
GRANT ALL ON invitados TO service_role;
