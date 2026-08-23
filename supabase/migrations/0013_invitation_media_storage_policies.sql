-- Buckets + políticas de Storage para los uploads del admin (galería de fotos,
-- audio de fondo, fotos entre secciones de elegance, etc. — todos suben vía
-- MediaUploader.tsx con `${projectId}/${filename}`).
--
-- Estos buckets y sus políticas existían solo en el dashboard de producción,
-- nunca se habían versionado como migración. Por eso `supabase db reset`
-- (usado por scripts/sync-prod-to-local.sh) nunca los recreaba localmente:
-- storage.objects tiene RLS habilitado por defecto y sin política de INSERT
-- para estos buckets, cualquier upload fallaba con
-- "new row violates row-level security policy".

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('invitation-media', 'invitation-media', true),
  ('invitation-audio', 'invitation-audio', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "admin_manage_invitation_media" ON storage.objects;
CREATE POLICY "admin_manage_invitation_media"
  ON storage.objects FOR ALL
  USING (
    bucket_id IN ('invitation-media', 'invitation-audio')
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "service_role_all_invitation_media" ON storage.objects;
CREATE POLICY "service_role_all_invitation_media"
  ON storage.objects FOR ALL
  USING (
    bucket_id IN ('invitation-media', 'invitation-audio')
    AND auth.role() = 'service_role'
  );
