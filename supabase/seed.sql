-- Seed de prueba para ambiente test — NO ejecutar en producción
-- PIN: 1234 → hash bcrypt generado con bcryptjs rounds=10
DO $$
DECLARE
  p_id UUID;
  g_familia UUID;
  g_amigos UUID;
  g_trabajo UUID;
BEGIN
  -- Proyecto de prueba con módulo activo
  INSERT INTO projects (
    slug, template, status,
    quinceanera_name, event_date, rsvp_phone,
    ceremony,
    tiene_lista_invitados, pin_admin
  ) VALUES (
    'demo-xv', 'especial', 'published',
    'Sofía', '2026-09-15 19:00:00+00', '5579410833',
    '{"time":"7:00 PM","venue":"Salón Versalles","address":"Av. Principal 123, CDMX","mapsUrl":"https://maps.google.com/?q=19.4326,-99.1332"}',
    true,
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
  )
  RETURNING id INTO p_id;

  -- 3 grupos por defecto
  INSERT INTO grupos_evento (project_id, nombre, color, orden)
    VALUES (p_id, 'Familia', '#C4956A', 1) RETURNING id INTO g_familia;
  INSERT INTO grupos_evento (project_id, nombre, color, orden)
    VALUES (p_id, 'Amigos', '#57A773', 2) RETURNING id INTO g_amigos;
  INSERT INTO grupos_evento (project_id, nombre, color, orden)
    VALUES (p_id, 'Trabajo', '#5B87B5', 3) RETURNING id INTO g_trabajo;

  -- Invitados de muestra
  INSERT INTO invitados (project_id, grupo_id, titular, num_invitados, whatsapp, estado)
    VALUES
      (p_id, g_familia, 'Juan Pérez', 4, '+525512345678', 'alta'),
      (p_id, g_familia, 'Familia García', 6, '+525587654321', 'enviado'),
      (p_id, g_amigos,  'María López', 2, '+525511112222', 'confirmo');

  -- Confirmar a María
  UPDATE invitados
    SET confirmacion='SI', fecha_confirmacion=now()
    WHERE titular='María López' AND project_id=p_id;
END $$;
