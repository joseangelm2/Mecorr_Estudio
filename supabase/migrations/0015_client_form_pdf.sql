-- Copia en PDF de las respuestas del cliente (preguntas y respuestas) al enviar el formulario.
-- El archivo vive en un bucket PRIVADO (sin políticas: solo lo toca el service role desde el
-- servidor; el admin lo descarga por una ruta autenticada) y su ruta se guarda en el link.

INSERT INTO storage.buckets (id, name, public)
VALUES ('client-forms', 'client-forms', false)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE project_client_links ADD COLUMN IF NOT EXISTS pdf_path TEXT;
ALTER TABLE project_client_links ADD COLUMN IF NOT EXISTS pdf_generated_at TIMESTAMPTZ;
