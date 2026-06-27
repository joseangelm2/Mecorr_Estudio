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

### [2026-06-27] [coder] — Fotos del álbum: columna vertical + uploader por posición
**Decisión de código:** `EspecialPhotos.tsx` reescrito como columna vertical simple (`flex-direction: column`). Se eliminaron `useState(current)`, `useRef(intervalRef)`, `useEffect` de auto-play, `startAuto()`, `goTo()`, los dots de navegación y el contenedor de `translateX`. `ProjectForm.tsx` (sección Galería de fotos, Tab Media): eliminado el `MediaUploader` genérico que agregaba al final del array; en su lugar, cada entrada del `map` de `form.photos` tiene su propio `MediaUploader` con `label=\`Subir foto ${i+1}\`` y `onUploadComplete={url => setArrayItem('photos', i, url)}`. El `SectionCard` pasó de `description="Mínimo 4 fotos para un buen carrusel"` a `"Las fotos aparecen en la sección Momentos, una debajo de la otra"`. El botón pasó de "Agregar URL manualmente" a "Agregar posición".
**Trampa evitada:** Las clases `.wow fadeInUp` se mantienen SOLO en el encabezado y la decoración (flor), NO en las fotos individuales del `map`. El `IntersectionObserver` de `EspecialScrollInit` solo observa elementos presentes al montar — los hijos del `map` están en el DOM inmediatamente pero si alguna lógica los condicionara quedarían `visibility: hidden` permanentemente. Esto ya estaba documentado en la entrada del 2026-06-24 sobre `.wow`; se refuerza: NUNCA poner `wow fadeInUp` en elementos renderizados dentro de iteraciones que dependan de datos async o estado.
**Patrón reusable:** Para uploader por posición en un array: `onUploadComplete={url => setArrayItem('photos', i, url)}` — usa el `i` del cierre del `map`, sin necesidad de un estado intermedio. El `project?.id` guard se repite dentro de cada tarjeta de posición para no renderizar el uploader si el proyecto aún no fue guardado. Referencia: `src/components/especial/EspecialPhotos.tsx`, `src/components/admin/ProjectForm.tsx` (sección Gallery ~línea 603).

---

### [2026-06-27] [coder] — Templates Sobre y Elegance: video reordenado, foto final independiente, sin fallbacks en Elegance
**Decisión de código:** (1) `SobreTemplate.tsx`: `VideoSection` movido de la posición final a inmediatamente después de `FotosCarousel`, antes de `MesaRegalosSection`. (2) `SobreTemplate.tsx`: `FinalSection` ya no usa siempre `hero_photo_url` — ahora lee `project.extra_config?.final_photo_url` con fallback a `hero_photo_url`, usando el cast `(project.extra_config?.final_photo_url as string) || hero_photo_url || undefined`. (3) `EleganceTemplate.tsx`: eliminados `FALLBACKS`, `getPhotos()` y la variable local `photos`. Todos los `<GalleryPhoto>` ahora son condicionales sobre `project.photos[N]`. `ElegancePhotoGrid` recibe `project.photos` directamente. (4) `ElegancePhotoGrid.tsx`: extrae `p7`, `p8`, `p9` del array; retorna `null` si ninguna existe; renderiza `dos-fotos` solo si alguna de las dos primeras existe; renderiza `full-width` solo si `p9` existe.
**Trampa evitada:** En ElegancePhotoGrid, TypeScript declara `photos: string[]` pero en runtime `photos[7]` puede ser `undefined` si el array tiene menos de 8 elementos. Sin las variables intermedias `p7/p8/p9` y sus guards, el `<img src={undefined}>` renderizaría imágenes rotas (icono de imagen rota en el browser). Los fallbacks anteriores ocultaban este problema usando siempre imágenes de placeholder — ahora el componente es honesto con los datos reales.
**Patrón reusable:** Para leer `extra_config` en cualquier template: `(project.extra_config?.campo as string) || valorFallback || undefined`. El doble `||` en lugar de `??` es intencional: `??` solo descarta `null`/`undefined` pero no strings vacíos `''`; `||` descarta también el string vacío que puede venir de un campo JSONB no completado. Referencia: `src/components/templates/SobreTemplate.tsx:122`, `src/components/templates/EleganceTemplate.tsx`, `src/components/elegance/ElegancePhotoGrid.tsx`.

---

### [2026-06-27] [coder] — Admin: sobre_final_photo_url + labels por posición en galería
**Decisión de código:** (1) `ProjectFormData` tiene nuevo campo `sobre_final_photo_url: string` en `actions.ts`. En `formDataToProject()` se persiste como `extra_config.final_photo_url` usando spread condicional idéntico al patrón de los campos `especial_*`. (2) `toFormData()` en `ProjectForm.tsx` inicializa el campo a `''` en la rama vacía y lo lee como `(project.extra_config?.final_photo_url as string) ?? ''` en la rama con proyecto. (3) Tab 6 "Estilo" tiene un nuevo `SectionCard "Foto de cierre"` renderizado solo cuando `form.template === 'sobre'`, siguiendo el patrón visual exacto de "Foto de portada" (MediaUploader + preview con botón ✕ + input URL). (4) Tab 7 "Media" reemplaza la `description` fija y las etiquetas hardcodeadas del `map` de fotos con lógica condicional: si `form.template === 'elegance'` se mapean 10 posiciones con descripción exacta de dónde aparece cada foto en el template; para otros templates se mantiene el genérico "Posición N en la sección Momentos".
**Trampa evitada:** El campo en `ProjectFormData` se llama `sobre_final_photo_url` (prefijo de template), no `final_photo_url`. Sin el prefijo, un coder futuro podría creer que es un campo compartido entre templates y asignarlo desde otro formulario. La clave DB (`final_photo_url` en `extra_config`) es lo que leen los templates — el nombre del form y el nombre DB son intencionalmente distintos.
**Patrón reusable:** Checklist para agregar cualquier campo `extra_config` nuevo: (a) agregar `prefixTemplate_campo: string` a `ProjectFormData` en `actions.ts`, (b) `''` en la rama vacía de `toFormData`, (c) `(project.extra_config?.db_key as string) ?? ''` en la rama con proyecto, (d) `...(data.prefixTemplate_campo ? { db_key: data.prefixTemplate_campo } : {})` en el objeto `extra_config` de `formDataToProject`. Todos los 4 pasos son obligatorios o TypeScript lanzará error de tipo. Ver `src/app/admin/actions.ts:67` (interfaz) y `src/app/admin/actions.ts:155` (escritura DB).

---

### [2026-06-24] [coder] — MediaUploader: dos buckets, sin deduplicación de archivos
**Decisión de código:** `MediaUploader` sube a Supabase Storage. Bucket `invitation-media` para imágenes y video; bucket `invitation-audio` para audio. La ruta de almacenamiento es `${projectId}/${Date.now()}.${ext}`.
**Trampa evitada:** Cada upload genera un archivo nuevo aunque sea el mismo contenido (el timestamp garantiza nombre único). Los URLs anteriores siguen siendo válidos y ocupando espacio. No hay limpieza automática de archivos huérfanos al cambiar la URL en el formulario.
**Patrón reusable:** Props del componente: `bucket` (`'invitation-media'` | `'invitation-audio'`), `projectId`, `onUploadComplete: (url: string) => void`, `accept` (default: `'image/*'`). El callback retorna la URL pública completa lista para guardar en DB. Referencia: `src/components/admin/MediaUploader.tsx:35,39-52`.
