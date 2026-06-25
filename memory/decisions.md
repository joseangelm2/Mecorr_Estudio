# decisions — Decisiones de arquitectura (ADRs)

> Escrito por el orquestador. Solo agregar o marcar CONFLICTO, nunca sobrescribir. Ver también [[context]] y [[code-notes]].

---

### [2026-06-24] [orquestador] — Templates cargados con `next/dynamic` para code splitting
**Contexto:** El proyecto tiene 11 templates con CSS y lógica propios. Importar todos en un solo bundle encarece la carga de cada invitación que solo usa uno de ellos.
**Decisión:** `TemplateRenderer.tsx` usa `next/dynamic()` para cada template en un `Record<TemplateId, Component>`. Solo descarga el chunk del template que corresponde al proyecto del usuario.
**Por qué:** Code splitting automático — los otros 10 templates no se descargan ni ejecutan. Agregar un template nuevo es una sola línea en el map.
**Alternativas descartadas:** Switch/if estático (frágil, no hace code splitting). Importar todos estáticamente (bundle inicial enorme, impacta LCP). Webpack config manual (complejidad sin beneficio extra).
**Referencia:** `src/components/templates/TemplateRenderer.tsx`

---

### [2026-06-24] [orquestador] — Slugs generados con normalización Unicode
**Contexto:** Los nombres de quinceañeras mexicanas contienen tildes, ñ y otros caracteres Unicode. `encodeURIComponent` los transforma en `%XX`, generando URLs ilegibles para compartir.
**Decisión:** `slug.ts` normaliza con `.normalize('NFD')`, elimina diacríticos con regex, filtra solo `[a-z0-9-]` y reemplaza espacios con guiones. La BD valida `UNIQUE` en `slug` para prevenir colisiones.
**Por qué:** "Valeria López" → `valeria-lopez` (legible, shareable, SEO-friendly). Implementación en ~8 líneas sin dependencias externas.
**Alternativas descartadas:** `encodeURIComponent` (URLs tipo `valeria-l%C3%B3pez`, ilegibles). Librería externa de slugify (dependencia para 8 líneas de código). Simple `toLowerCase()` (no maneja acentos, genera slugs con ñ).
**Referencia:** `src/lib/slug.ts`

---

### [2026-06-24] [orquestador] — Invitación pública como Server Component con `status` validado en servidor
**Contexto:** Las invitaciones `draft` no deben ser accesibles públicamente. Los crawlers de SEO necesitan HTML pre-renderizado con los metadatos de la invitación.
**Decisión:** `/i/[slug]/page.tsx` es un Server Component async que hace fetch `WHERE slug = :slug AND status = 'published'` directamente a Supabase. Si no encuentra resultado, llama `notFound()` → 404.
**Por qué:** La validación de `status` ocurre en servidor — el cliente no puede manipularla. HTML pre-renderizado con nombre de la quinceañera y fecha beneficia el SEO y la vista previa al compartir en WhatsApp.
**Alternativas descartadas:** Client Component con `useEffect` (flash de contenido antes de validar, sin SEO, invitación visible como loading). Ruta API REST separada (redirección innecesaria). No validar `status` en el query (drafts visibles públicamente).
**Referencia:** `src/app/i/[slug]/page.tsx`

---

### [2026-06-24] [orquestador] — Auth middleware en `proxy.ts` con patrón `setAll` obligatorio
**Contexto:** Next.js 16 deprecó `src/middleware.ts` y lo renombró a `src/proxy.ts`. El refresco de tokens de Supabase SSR requiere propagar cookies entre request y response en un orden específico; el patrón antiguo causaba que el admin redirigiera falsamente a `/admin/login`.
**Decisión:** `src/proxy.ts` usa `createServerClient` con callback `setAll` que ejecuta en orden invariable: (1) setea cookies en el objeto `request`, (2) crea nuevo `NextResponse.next({ request })`, (3) setea cookies en la response con sus opciones originales.
**Por qué:** Sin este orden el token expira entre requests y el admin redirige al login aunque el usuario esté autenticado. Usar `middleware.ts` genera deprecation warning y puede ser ignorado por Next.js 16.
**Alternativas descartadas:** `middleware.ts` (deprecated en Next.js 16). Patrón sin `setAll` (no propaga refresh del token; problema real encontrado en producción). Sesiones de larga duración sin middleware (sin control server-side del estado de auth).
**Referencia:** `src/proxy.ts:13-40`

---

### [2026-06-24] [orquestador] — Temas de color via CSS variables en `<html>` con cleanup obligatorio
**Contexto:** El template Especial soporta 6+ temas de color configurables. Propagar el tema como props a cada sub-componente requeriría pasar 8 valores a través de todo el árbol.
**Decisión:** `EspecialTemplate.tsx` setea 8 CSS vars (`--inv-primary`, `--inv-primary-dark`, `--inv-filter`, `--inv-seal-filter`, etc.) en `document.documentElement` vía `useEffect`. Los componentes hijos las consumen directamente desde CSS. El cleanup del efecto las remueve todas.
**Por qué:** Los hijos leen el tema desde CSS sin props adicionales — no hay prop drilling. Cambiar el tema es setear 8 propiedades en JS y el CSS se actualiza solo. El cleanup es crítico: sin él las vars del template Especial "contaminan" otros templates al navegar.
**Alternativas descartadas:** Prop drilling del tema (8 props extra que atraviesan cada componente hijo). Clases Tailwind condicionales (requiere definir variantes completas por componente, N×8). Contexto React de tema (boilerplate sin ventaja sobre CSS vars).
**Referencia:** `src/components/templates/EspecialTemplate.tsx:39-56`

---

### [2026-06-24] [orquestador] — Scroll del body bloqueado hasta apertura del sobre
**Contexto:** El template Especial inicia con una pantalla de sobre animado. Si el usuario puede hacer scroll, puede llegar al contenido antes de que el over esté preparado para mostrarse, rompiendo la experiencia narrativa.
**Decisión:** `especial.css` define `html { overflow: hidden }` como estado inicial. `openEnvelope()` agrega la clase `con-scroll` al `<html>` ANTES del `setTimeout` de 3s, siempre acompañado de `window.scrollTo(0, 0)`.
**Por qué:** El usuario vive la experiencia del sobre sin distracciones. El scroll se habilita mientras la animación de cierre ocurre (no después), así el usuario no queda "atrapado" sin scroll durante los 3s.
**Alternativas descartadas:** `body { overflow: hidden }` (produce scrollbar flashing en algunos navegadores). Agregar `.con-scroll` dentro de `onOpen` en EspecialTemplate (race condition: se ejecuta después del desmontaje del sobre). State React para controlar visibilidad (más complejo, sin beneficio sobre el approach de clase CSS).
**Referencia:** `src/app/especial/especial.css:23-30`, `src/components/especial/EspecialEnvelope.tsx:22-24`

---

### [2026-06-24] [orquestador] — Campos de template en `extra_config` JSONB en lugar de columnas dedicadas
**Contexto:** Cada template puede necesitar campos únicos (sello personalizable, sobres, paleta de dress code, etc.). Crear columnas en la tabla `projects` por cada campo de cada template requeriría migraciones frecuentes y un schema inflado con columnas vacías para todos los otros templates.
**Decisión:** `extra_config` es un campo JSONB en `projects` donde cada template almacena sus campos específicos. Al guardar, los valores vacíos se excluyen con spread condicional (`...(val ? { key: val } : {})`). Al leer, se accede con cast TypeScript explícito: `(project.extra_config?.field as string) ?? ''`.
**Por qué:** Agregar un campo al template Especial = cero migraciones de BD. El JSON crece sin versioning de schema. Los strings vacíos no se persisten, evitando basura acumulada en el campo JSONB.
**Alternativas descartadas:** Columnas dedicadas por campo de template (migraciones frecuentes, schema con columnas nulas para otros templates). Serializar todo como un único string JSON (sin indexado de Postgres, búsquedas imposibles). Tabla separada `template_config` (joins en cada lectura de invitación).
**Referencia:** `src/app/admin/actions.ts:132-155`, `src/components/templates/EspecialTemplate.tsx:31-37`

---

### [2026-06-24] [orquestador] — RSVP sin persistencia en base de datos: privacidad por diseño
**Contexto:** Los invitados confirman asistencia con nombre y número de acompañantes. Guardar esos datos en BD requeriría cumplimiento LGPD/GDPR y un dashboard para que el admin visualice las confirmaciones.
**Decisión:** El componente RSVP construye un mensaje de texto (nombre, sí/no, cantidad de personas) y lo envía abriendo WhatsApp (`whatsapp.com/send?...`) o un `mailto:`. Cero datos del invitado se guardan en BD. No existe vista de "confirmaciones recibidas" en el admin.
**Por qué:** MeCorr Estudio prefiere no manejar datos personales de terceros (invitados). El cliente recibe las confirmaciones directamente en su WhatsApp — flujo más natural para el mercado mexicano que un dashboard web.
**Alternativas descartadas:** Tabla `rsvps` con datos del invitado (requiere consentimiento explícito, política de privacidad, LGPD). Dashboard de confirmaciones en admin (datos sin usar extra, carga de desarrollo significativa). Email automático desde servidor (requiere servicio de email transaccional, costo adicional).
**Referencia:** `src/components/especial/EspecialRSVP.tsx:36-63`

---

### [2026-06-24] [orquestador] — Storage en dos buckets separados con nombres por timestamp
**Contexto:** El proyecto sube imágenes, videos y audio a Supabase Storage. Un solo bucket mezclaría tipos de archivo con necesidades de retención y cuotas muy distintas (audio puede ser grande, imágenes son muchas).
**Decisión:** Bucket `invitation-media` para imágenes y video; bucket `invitation-audio` para música de fondo. Ruta de cada archivo: `${projectId}/${Date.now()}.${ext}`. Sin deduplicación de contenido — cada upload crea un objeto nuevo.
**Por qué:** Los buckets pueden tener políticas de retención, cuotas y permisos independientes. El timestamp como nombre garantiza unicidad sin necesitar un índice adicional ni lógica de colisión.
**Alternativas descartadas:** Un solo bucket (políticas de limpieza complejas, mezcla de tipos). Hash del contenido como nombre (deduplicación útil pero requiere calcular hash en cliente, complejidad extra). Nombres humanos/descriptivos (riesgo de colisión, requiere index UNIQUE en Storage).
**Nota:** Sin deduplicación, reemplazar una imagen en el formulario deja el archivo anterior como huérfano en Storage — acumula basura con el tiempo.
**Referencia:** `src/components/admin/MediaUploader.tsx:35,39-52`
