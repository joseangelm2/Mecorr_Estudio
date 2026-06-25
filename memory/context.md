# context — Misión, alcance y arquitectura de Goldrose

> Documento de orientación. Leer antes de cualquier tarea. Ver también [[code-notes]] para patrones técnicos y [[decisions]] para ADRs.

---

## Misión y producto

**Goldrose** es una plataforma SaaS de **invitaciones digitales para quinceañeras**, desarrollada por **MeCorr Estudio**. Permite crear, personalizar y publicar invitaciones interactivas que se comparten por link único (`/i/:slug`). El administrador (MeCorr Estudio) gestiona todo desde un panel interno; el invitado final solo accede al link y confirma asistencia por WhatsApp.

---

## Stakeholders

| Rol | Quién | Acceso |
|---|---|---|
| **Administrador** | MeCorr Estudio | `/admin` — crea y entrega invitaciones a clientes |
| **Cliente** | Familia de la quinceañera | Recibe el link para revisar; no tiene cuenta |
| **Invitado** | Asistentes al evento | Accede a `/i/:slug`, confirma asistencia por WhatsApp |

---

## Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | Next.js 16.2.1 (App Router, React 19, TypeScript strict) |
| UI | shadcn/ui, Tailwind CSS v4 |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) |
| Auth SSR | `@supabase/ssr` con patrón `setAll` en `src/proxy.ts` |
| Formularios | react-hook-form 7 + Zod 4 |
| Deploy | Vercel |

**Comandos de desarrollo:**
```bash
npm run dev        # dev server en localhost:3000
npm run check      # lint + typecheck + build (validación completa)
npm run build      # build de producción
```

---

## Rutas del sistema

### Públicas (sin auth)
| Ruta | Propósito |
|---|---|
| `/` | Landing page MeCorr Estudio |
| `/invitaciones` | Catálogo de 11 plantillas disponibles |
| `/i/:slug` | Invitación publicada (solo si `status = 'published'`) |
| `/:template` | Demo de cada plantilla (sobre, esmeralda, pink, love, zafiro, elegance, hogwarts, sellorosa, rosagold, magical, especial) |

### Admin (requieren Supabase Auth)
| Ruta | Propósito |
|---|---|
| `/admin/login` | Login con email/contraseña |
| `/admin` | Dashboard — lista de proyectos con CRUD |
| `/admin/projects/new` | Crear invitación |
| `/admin/projects/:id` | Editar invitación existente |

**Protección:** `src/proxy.ts` intercepta `/admin/*` y valida sesión antes de servir la página.

---

## Templates disponibles (11)

| ID | Componente | Temas | Características |
|---|---|---|---|
| `sobre` | `SobreTemplate.tsx` | 7 | Sobre animado que se abre; banner sticky |
| `esmeralda` | `EsmeraldaTemplate.tsx` | hardcoded | Floral, marco circular animado |
| `pink` | `PinkTemplate.tsx` | hardcoded | Vintage rosa |
| `love` | `LoveTemplate.tsx` | hardcoded | Romántico, fotos protagonistas |
| `zafiro` | `ZafiroTemplate.tsx` | hardcoded | Contemporáneo, efecto brillo |
| `elegance` | `EleganceTemplate.tsx` | 6 | Blanco/marfil + dorado |
| `hogwarts` | `HogwartsTemplate.tsx` | hardcoded | Harry Potter |
| `sellorosa` | `SelloRosaTemplate.tsx` | hardcoded | Sello de cera, mobile-first |
| `rosagold` | `RosaGoldTemplate.tsx` | hardcoded | Rosa + dorado, galería |
| `magical` | `MagicalTemplate.tsx` | hardcoded | Cosmos, estrellas animadas |
| `especial` | `EspecialTemplate.tsx` | 6+ | Flexible: sello, sobre y fondo customizables |

**Router dinámico:** `src/components/templates/TemplateRenderer.tsx` selecciona el componente según `project.template`.

---

## Modelo de datos — tabla `projects`

### Campos de identidad
- `id` UUID PK, `slug` VARCHAR UNIQUE, `created_at`, `updated_at`
- `template` ENUM (`sobre` | `esmeralda` | `pink` | `love` | `zafiro` | `elegance` | `hogwarts` | `sellorosa` | `rosagold` | `magical` | `especial`)
- `status` ENUM (`draft` | `published`)

### Contenido principal
- `quinceanera_name`, `guest_name`, `invitation_text`, `confirmation_phrase`
- `event_date` DATE, `color_theme`, `hashtag`
- `rsvp_phone` — teléfono principal para WhatsApp (formato: 10 dígitos sin +52)
- `parent_names` JSONB[], `padrinos` JSONB[]

### Lugares del evento
- `ceremony` JSON `{ time, venue, address, mapsUrl }`
- `reception` JSON `{ time, venue, address, mapsUrl }`

### Secciones de contenido
- `itinerary` JSONB[] — `[{ time, description, icon }]`
- `dress_code` JSON — `{ colors, notes }`
- `hero_photo_url`, `photos` JSONB[], `music_url`

### Feature flags (booleanos)
- `show_video`, `show_lluvia_sobres`, `show_datos_bancarios`, `show_itinerary`

### Media opcional
- `video_youtube_id`, `video_url`, `lluvia_sobres_text`, `datos_bancarios_text`

### Regalos
- `gift_registry` JSON — `{ liverpoolLink?, bankAccount?, bankBeneficiary?, giftStore? }`

### Extensión por template
- `extra_config` JSONB — campos específicos de cada template; para los campos del template Especial ver [[code-notes]].

**Tipos TypeScript:** `src/types/invitation.ts` — interfaces `Project`, `TemplateId`, `LocationInfo`, `TimelineItem`.

---

## Storage — Supabase

| Bucket | Contenido | Ruta |
|---|---|---|
| `invitation-media` | Imágenes y video | `{projectId}/{timestamp}.{ext}` |
| `invitation-audio` | Música de fondo | `{projectId}/{timestamp}.{ext}` |

Componente de upload: `src/components/admin/MediaUploader.tsx`

---

## Flujos de datos

### Flujo del invitado
```
Abre /i/:slug
  → Server Component fetch projects WHERE slug = :slug AND status = 'published'
  → TemplateRenderer elige componente según project.template
  → Template renderiza con project como prop
  → Invitado hace clic en RSVP
  → Abre WhatsApp/Email con mensaje pre-formateado (NO persiste en BD)
```

### Flujo del admin
```
Login /admin/login → Supabase Auth (email/password)
  → Proxy valida sesión en cada request /admin/*
  → Dashboard: Server Action listProjects()
  → Crear/Editar: ProjectForm (react-hook-form) + MediaUploader
  → Guardar: Server Action createProject() / updateProject() en actions.ts
  → Supabase DB actualizado
  → Publicar: status → 'published'; link /i/:slug activo
```

---

## Variables de entorno requeridas

```bash
NEXT_PUBLIC_SUPABASE_URL          # URL del proyecto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Anon key (pública, usada en browser)
SUPABASE_SERVICE_ROLE_KEY         # Service role key (solo server-side)
```

Archivo de referencia: `.env.local` (no comiteado).

---

## Branding y contacto

- **Empresa:** MeCorr Estudio
- **Logo:** `public/promo/logo_mecorr2.png`
- **WhatsApp:** +52 55 7941 0833
- **Rama principal:** `master`; rama activa de desarrollo: `Mecorr_Estudio`

---

## Archivos de referencia rápida

| Archivo | Para qué sirve |
|---|---|
| `src/types/invitation.ts` | Tipos principales del dominio |
| `src/app/admin/actions.ts` | Server Actions CRUD (createProject, updateProject, deleteProject) |
| `src/proxy.ts` | Middleware de autenticación Supabase SSR |
| `src/lib/supabase/server.ts` | Cliente Supabase server-side |
| `src/components/templates/TemplateRenderer.tsx` | Router dinámico de templates |
| `docs/GUIA_NUEVA_INVITACION.md` | Guía de estructura de DB |
| `memory/code-notes.md` | Trampas, patrones y decisiones de código ← leer esto también |
