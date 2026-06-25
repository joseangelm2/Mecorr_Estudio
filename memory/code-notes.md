# code-notes — Decisiones de código, trampas y patrones

> Escrito por el coder. Solo agregar, nunca borrar. Marcar obsoleto con ~~tachado~~.

---

### [2026-06-24] [coder] — CSS variables dinámicas del sistema de temas
**Decisión de código:** `EspecialTemplate.tsx` setea 8 CSS vars (`--inv-primary`, `--inv-primary-dark`, `--inv-primary-light`, `--inv-border`, `--inv-filter`, `--inv-filter-light`, `--inv-seal-filter`, `--inv-bg-url`) en el elemento `<html>` via `useEffect`. Los componentes hijos las consumen directamente desde CSS sin recibir props de tema.
**Trampa evitada:** El `useEffect` requiere cleanup que remueve todas las vars con `root.style.removeProperty`. Sin cleanup, las vars persisten al navegar entre páginas y "contaminan" otros templates que no esperan esos valores.
**Patrón reusable:** Todas las vars llevan prefijo `--inv-` para evitar colisiones con otras hojas de estilo. Las dependencias del `useEffect` son `[theme, bgUrl, sealFilter]`. Referencia: `src/components/templates/EspecialTemplate.tsx:39-56`.

---

### [2026-06-24] [coder] — Filtro del sello vs filtro del fondo: dos CSS vars separadas
**Decisión de código:** `--inv-seal-filter` controla solo el sello; `--inv-filter` controla decoraciones y fondo. Lógica de fallback: si `extra_config.seal_filter` no está vacío usa ese valor, si está vacío usa `theme.filterValue`. Esto permite override sin romper el tema.
**Trampa evitada:** `hue-rotate()` no afecta imágenes completamente negras o grises (píxeles sin croma). Si el sello base es negro/gris, cualquier `hue-rotate` produce resultado idéntico. **Pendiente** encontrar solución alternativa (feColorMatrix SVG, imagen base coloreada, o `sepia(1)` como paso previo).
**Patrón reusable:** `sealFilter !== '' ? sealFilter : theme.filterValue` en `EspecialTemplate.tsx:47`. En DB: `extra_config.seal_filter: string` — `''` = hereda tema, `'none'` = sin filtro, cualquier string CSS válido = filtro personalizado.

---

### [2026-06-24] [coder] — Timing del sobre: audio antes del desmontaje React
**Decisión de código:** `EspecialEnvelope` recibe dos callbacks separados: `onSealClick` (ejecutado inmediatamente al clic) y `onOpen` (ejecutado tras `setTimeout 3000ms`). No existe un único `handleOpen`.
**Trampa evitada:** Si `onOpen` se llama inmediatamente, React desmonta el componente del sobre antes de que la transición CSS de 3s termine. El usuario ve un salto visual en lugar de la animación fluida del sobre abriéndose.
**Patrón reusable:** `onSealClick` = efectos inmediatos (audio). `onOpen` = cambios de estado React (desmontaje). El timeout de 3000ms coincide exactamente con `transition: all 3s` de las clases `.desaparecer`, `.efecto-derecha`, `.efecto-izquierda` en `src/app/especial/especial.css:200-202`. Referencia: `src/components/especial/EspecialEnvelope.tsx:18-26`.

---

### [2026-06-24] [coder] — Sistema .wow / IntersectionObserver: trampa de elementos dinámicos
**Decisión de código:** `EspecialScrollInit.tsx` registra un `IntersectionObserver` sobre todos los `.wow` presentes en el DOM al montar el componente. Al entrar en viewport dispara `animated` y `visibility: visible`. Con `rootMargin: '0px 0px -100px 0px'` la animación inicia 100px antes de que el elemento sea visible.
**Trampa evitada:** El observer solo observa los elementos que existen en el DOM al momento de montar. Cualquier elemento `.wow` que aparezca después (por `setState`, renderizado condicional) nunca se observa y queda `visibility: hidden` de forma permanente — invisible para siempre. La solución es NO poner `.wow` en elementos que dependan de estado dinámico. Ejemplo de error: las opciones de envío en RSVP tenían `wow fadeInUp` y nunca se mostraban tras el submit.
**Patrón reusable:** Regla: `wow fadeInUp` solo en elementos que siempre están presentes en el primer render. Para elementos condicionales usar clases de CSS con transición normal o `opacity` + `transition`. Referencia: `src/components/especial/EspecialScrollInit.tsx:12-27`.

---

### [2026-06-24] [coder] — Scroll bloqueado hasta apertura del sobre
**Decisión de código:** `html { overflow: hidden }` en `especial.css` es el estado inicial. El scroll se habilita con `document.documentElement.classList.add('con-scroll')` dentro de `openEnvelope()`, inmediatamente antes del `setTimeout`.
**Trampa evitada:** Si `.con-scroll` se agrega después del `setTimeout`, el usuario tiene scroll bloqueado durante los 3s de la animación y no puede hacer nada. Si `.con-scroll` se agrega en `onOpen` (dentro de EspecialTemplate), el estado cambia de React en paralelo con el DOM y puede causar race condition.
**Patrón reusable:** Secuencia obligatoria en `openEnvelope()`: (1) `onSealClick()` (audio), (2) agregar clases CSS de animación, (3) `classList.add('con-scroll')`, (4) `window.scrollTo(0,0)`, (5) `setTimeout(() => onOpen(), 3000)`. Referencia: `src/components/especial/EspecialEnvelope.tsx:22-24`, `src/app/especial/especial.css:24`.

---

### [2026-06-24] [coder] — Scroll restaurado al cargar: history.scrollRestoration manual
**Decisión de código:** `EspecialScrollInit.tsx` setea `history.scrollRestoration = 'manual'` como primera línea del `useEffect`, antes de registrar el observer.
**Trampa evitada:** Sin esto, Next.js y el navegador restauran la posición de scroll guardada en el historial al navegar de vuelta a la invitación. El usuario aparece scrolleado en el contenido pero el sobre ya está desmontado, rompiendo la experiencia.
**Patrón reusable:** Solo aplicar en templates con lógica de "pantalla de inicio" que requieren iniciar siempre en la cima. No aplicar globalmente. Referencia: `src/components/especial/EspecialScrollInit.tsx:5-8`.

---

### [2026-06-24] [coder] — extra_config JSONB: patrón de lectura y escritura sin columnas extra
**Decisión de código:** `extra_config` es un campo JSONB en la tabla `projects`. Todos los campos específicos del template Especial viven aquí en lugar de columnas dedicadas. Esto permite extender el template sin migraciones de schema.
**Trampa evitada:** TypeScript no infiere el tipo del JSONB. Acceder sin cast causa errores o `any` implícito. Patrón correcto: `(project.extra_config?.field as string) ?? ''`. Nunca usar `as any`. En escritura, usar spread condicional para no persistir strings vacíos: `...(data.field ? { db_key: data.field } : {})`.
**Patrón reusable:** En `toFormData()` (acciones → formulario): siempre `?? ''` como fallback. En `formDataToProject()` (formulario → DB): siempre condicional antes de incluir en `extra_config`. Campos actuales del Especial en `extra_config`: `background_url`, `decoration_url`, `seal_url`, `seal_filter`, `envelope_right_url`, `envelope_left_url`, `dress_palette`, `dress_code_image_url`, `show_dress_palette`, `rsvp_phones`, `rsvp_email`. Referencia: `src/app/admin/actions.ts:132-155`, `src/components/templates/EspecialTemplate.tsx:31-37`.

---

### [2026-06-24] [coder] — Proxy Supabase SSR: patrón setAll obligatorio en Next.js 16
**Decisión de código:** `src/proxy.ts` usa `createServerClient` con el callback `setAll` que: (1) setea cookies en el objeto `request`, (2) crea nuevo `NextResponse.next({ request })`, (3) setea cookies en la response con sus opciones originales.
**Trampa evitada:** Sin este patrón, el token de sesión no se refresca. El síntoma es que el admin carga lentamente y luego redirige a `/admin/login` aunque el usuario esté autenticado. Segundo: Next.js 16 usa el archivo `src/proxy.ts`, NO `src/middleware.ts`. Si se crea `middleware.ts`, Next.js lanza deprecation warning y puede ignorarlo.
**Patrón reusable:** El orden del `setAll` es invariable. No llamar `getUser()` antes de completar el setup de cookies — la sesión podría leer un token expirado y no refrescarlo. Referencia: `src/proxy.ts:13-40`.

---

### [2026-06-24] [coder] — RSVP sin persistencia en servidor: diseño por privacidad
**Decisión de código:** `EspecialRSVP.tsx` no persiste datos en base de datos. Al confirmar asistencia construye un mensaje de texto y abre WhatsApp (`whatsapp.com/send?phone=...&text=...`) o un `mailto:` con el mensaje pre-formateado. Los datos del invitado solo existen en ese mensaje.
**Trampa evitada:** No existe una vista en el admin para ver confirmaciones porque no se guardan. Si alguien pide "ver los RSVPs en el admin", no es posible — es diseño intencional para no almacenar datos personales de terceros.
**Patrón reusable:** Teléfonos extra: `extra_config.rsvp_phones` como array de `{ phone: string, label: string }`. Email: `extra_config.rsvp_email`. Teléfono principal: `project.rsvp_phone` (columna directa, no extra_config). El mensaje incluye nombre del invitado, asistencia sí/no, y número de personas. Referencia: `src/components/especial/EspecialRSVP.tsx:36-63`.

---

### [2026-06-24] [coder] — MediaUploader: dos buckets, sin deduplicación de archivos
**Decisión de código:** `MediaUploader` sube a Supabase Storage. Bucket `invitation-media` para imágenes y video; bucket `invitation-audio` para audio. La ruta de almacenamiento es `${projectId}/${Date.now()}.${ext}`.
**Trampa evitada:** Cada upload genera un archivo nuevo aunque sea el mismo contenido (el timestamp garantiza nombre único). Los URLs anteriores siguen siendo válidos y ocupando espacio. No hay limpieza automática de archivos huérfanos al cambiar la URL en el formulario.
**Patrón reusable:** Props del componente: `bucket` (`'invitation-media'` | `'invitation-audio'`), `projectId`, `onUploadComplete: (url: string) => void`, `accept` (default: `'image/*'`). El callback retorna la URL pública completa lista para guardar en DB. Referencia: `src/components/admin/MediaUploader.tsx:35,39-52`.
