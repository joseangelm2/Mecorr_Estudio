-- Módulo Lista de Invitados: campos nuevos en projects
ALTER TABLE projects
  ADD COLUMN tiene_lista_invitados BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN pin_admin TEXT;
