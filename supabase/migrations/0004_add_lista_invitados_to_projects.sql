-- Módulo Lista de Invitados: campos nuevos en projects
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS tiene_lista_invitados BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pin_admin TEXT;
