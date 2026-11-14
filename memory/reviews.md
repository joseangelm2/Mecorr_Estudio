# reviews — Hallazgos de revisión y bugs resueltos

> Escrito por el revisor. Solo agregar, nunca borrar. Marcar obsoleto con ~~tachado~~. Ver [[code-notes]] para los patrones derivados de estos hallazgos y [[decisions]] para las ADRs relacionadas.

---

### [2026-06-24] [revisor] — Admin redirige a login en cada carga
**Archivo/línea:** `src/proxy.ts` — todo el archivo
**Problema:** `proxy.ts` exportaba una función nombrada (no `default`) y el patrón de cookies carecía del callback `setAll`, por lo que el token de sesión nunca se refrescaba y el middleware forzaba redirect a `/admin/login` aunque el usuario estuviera autenticado.
**Severidad:** crítico
**Fix aplicado:** Reescribir `proxy.ts` completo con `export default async function proxy` y el patrón Supabase SSR correcto: callback `setAll` con 3 pasos en orden invariable — (1) setear en request, (2) crear nuevo `NextResponse.next({ request })`, (3) setear en response. Ver [[decisions]] ADR 4.

---

### [2026-06-24] [revisor] — Archivo `middleware.ts` creado en lugar de `proxy.ts`
**Archivo/línea:** `src/middleware.ts` — archivo eliminado; ya no existe
**Problema:** Se creó `src/middleware.ts` creyendo que era la convención correcta de Next.js 16. Next.js lanzaba deprecation warning, el archivo era ignorado y `/admin/*` quedaba sin protección de autenticación.
**Severidad:** crítico
**Fix aplicado:** Eliminar `middleware.ts`. En Next.js 16 el middleware de auth vive exclusivamente en `src/proxy.ts`. Documentado en [[glossary]] y [[decisions]] ADR 4.

---

### [2026-06-24] [revisor] — Opciones de RSVP invisibles tras confirmar nombre
**Archivo/línea:** `src/components/especial/EspecialRSVP.tsx` — div de opciones de envío (aprox. línea 124)
**Problema:** El div con botones de WhatsApp/Email tenía `className="wow fadeInUp"`. El `IntersectionObserver` registrado en `EspecialScrollInit` solo observa elementos presentes al montar el componente. Como este div se renderiza condicionalmente al hacer `setSubmitted(true)`, jamás fue observado y quedó con `visibility: hidden` permanentemente.
**Severidad:** alto — la funcionalidad principal de RSVP era completamente invisible para el usuario final.
**Fix aplicado:** Remover `className="wow fadeInUp"` del div de opciones. Regla derivada documentada en [[code-notes]] entrada 4: nunca usar `.wow` en elementos de renderizado condicional o basados en estado dinámico.

---

### [2026-06-24] [revisor] — Transición del sobre no visible al dar clic en el sello
**Archivo/línea:** `src/components/especial/EspecialEnvelope.tsx:18-26` + `src/components/templates/EspecialTemplate.tsx`
**Problema:** El callback `onOpen` (que llama `setEnvelopeOpen(true)` en React, desmontando el sobre) se ejecutaba inmediatamente junto con el inicio de la animación CSS. React desmontaba el DOM del sobre antes de que terminara la transición de 3s, causando que el contenido de la invitación apareciera abruptamente sin la animación.
**Severidad:** alto — la animación de apertura del sobre, que es la experiencia central del template, no funcionaba.
**Fix aplicado:** Separar en dos callbacks: `onSealClick` (audio reproducido inmediatamente) y `onOpen` (desmontaje diferido con `setTimeout 3000ms`, igual a `transition: all 3s` en `especial.css:200-202`). Ver [[code-notes]] entrada 3.

---

### [2026-06-24] [revisor] — Scroll restaurado a posición anterior al navegar de vuelta
**Archivo/línea:** `src/components/especial/EspecialScrollInit.tsx` — inicio del `useEffect`
**Problema:** Al usar el botón "atrás" del navegador o navegar de vuelta a la invitación, Next.js y el navegador restauraban la posición de scroll guardada en el historial. El usuario aparecía scrolleado en el contenido de la invitación aunque el sobre ya estuviera desmontado, rompiendo la experiencia narrativa.
**Severidad:** alto — la experiencia del sobre (que depende de empezar en el top de la página) se rompía en cualquier navegación de vuelta.
**Fix aplicado:** Agregar `if ('scrollRestoration' in history) history.scrollRestoration = 'manual'` como primera instrucción del `useEffect`, antes de registrar el observer. Ver [[code-notes]] entrada 6.

---

### [2026-06-24] [revisor] — Texto de cierre del footer invisible en móvil
**Archivo/línea:** `src/components/especial/EspecialFooter.tsx` — elemento `<p>` de texto de cierre
**Problema:** El `<p>` tenía `className="wow fadeInUp"`. Con `rootMargin: '0px 0px -100px 0px'` configurado en el observer, el elemento ubicado al fondo de una página larga nunca cruzaba el umbral de disparo en pantallas de móvil, manteniéndose `visibility: hidden`.
**Severidad:** medio — el contenido de cierre de la invitación (mensaje final de la quinceañera) no se mostraba nunca.
**Fix aplicado:** Remover `wow fadeInUp` del elemento `<p>`. Mismo patrón que el Finding de RSVP — elementos al fondo de la página también son vulnerables al `rootMargin` negativo.

---

### [2026-06-24] [revisor] — Círculos del itinerario desalineados respecto a la línea de tiempo
**Archivo/línea:** `src/app/especial/especial.css` — selectores `.list-progress`, `.icon-holder`, `li::before`, `.icon-holder::before`
**Problema:** `.list-progress` (barra vertical coloreada) estaba en `left: 21px` pero `.icon-holder` (círculo con icono) estaba posicionado en `left: 0`. Los iconos no quedaban centrados sobre la línea. Adicionalmente, el pseudo-elemento `::before` (anillo exterior del círculo) no tenía centrado explícito y aparecía desplazado dentro del contenedor.
**Severidad:** medio — defecto visual notable que rompía la alineación de toda la sección de itinerario.
**Fix aplicado:** Dos ajustes CSS: (1) mover línea a `left: 51px`, `li::before left: 51px`, `icon-holder left: 30px` para separar del margen izquierdo; (2) agregar `left: 50%; top: 50%; transform: translate(-50%, -50%)` al `::before` para centrar el anillo. Los valores se ajustaron en dos iteraciones hasta alinear visualmente.

---

### [2026-06-24] [revisor] — Fecha del evento en countdown ocupa dos líneas
**Archivo/línea:** `src/components/especial/EspecialEventDate.tsx` — elemento de fecha principal
**Problema:** `fontSize: '38px'` combinado con el nombre completo del mes ("OCTUBRE", "DICIEMBRE") causaba que la fecha se partiera en dos líneas en pantallas de ≤375px, rompiendo el layout del countdown.
**Severidad:** bajo — defecto visual de tipografía, no afecta funcionalidad.
**Fix aplicado:** Reducir `fontSize` a `32px` y agregar `whiteSpace: 'nowrap'`. Rediseñar tipografía: label "✦ fecha del evento ✦" en Raleway 11px con `letterSpacing: 6px` y `opacity: 0.75`; fecha en `texto-frase` (Marchila) 32px con separadores `·` entre día, mes y año.

---

### [2026-06-24] [revisor] — Frase introductoria de mesa de regalos repetida por cada registro
**Archivo/línea:** `src/components/especial/EspecialGifts.tsx` — dentro del bloque `.map()` de `extraRegistries`
**Problema:** Una frase hardcodeada ("Tu presencia ilumina nuestro evento...") estaba ubicada dentro del bloque `.map()` que itera los registros de regalos. La frase aparecía N veces, una por cada registro configurado en `extra_config.gift_registries`.
**Severidad:** bajo — error de contenido; no afecta funcionalidad pero degrada la calidad del texto.
**Fix aplicado:** Eliminar la frase del bloque `.map()` y también del bloque fallback. La sección de regalos muestra solo los registros sin texto introductorio repetido.

---

### [2026-06-24] [revisor] — Filtro CSS del sello sin efecto en imágenes acromáticas ⚠ PENDIENTE
**Archivo/línea:** `src/app/especial/especial.css` (`.sello-img { filter: var(--inv-seal-filter) }`) + `src/components/templates/EspecialTemplate.tsx:47`
**Problema:** `hue-rotate()` opera sobre la croma del color. Los píxeles sin saturación (negro `#000`, blanco `#fff`, grises) no tienen matiz que rotar, por lo que cualquier `hue-rotate` no produce cambio visual. Si el archivo `/images/sello.png` es una imagen completamente negra o en escala de grises — que es el caso más común para logotipos/sellos — la funcionalidad de "color del sello" en el admin no produce ningún efecto visible.
**Severidad:** medio — funcionalidad de personalización del sello (campo `extra_config.seal_filter`) implementada pero sin efecto visual real en el caso de uso principal.
**Fix aplicado:** ⚠ Pendiente de resolución. Se intentó anteponer `sepia(1)` para dar croma antes del `hue-rotate`, pero fue revertido a petición del usuario. Alternativas pendientes de evaluar:
- Imagen base del sello en color neutro (sepia/marrón) en lugar de negro, para que `hue-rotate` tenga croma que transformar.
- `feColorMatrix` SVG aplicado inline para colorización más precisa.
- CSS `filter: drop-shadow(0 0 0 color)` como workaround visual (crea halo de color, no coloriza la imagen).

---

### [2026-11-13] [revisor] — Revisión del formulario de cliente /registro
**Alcance:** `0014_project_client_links.sql`, `src/lib/registro/{schema,apply,link,time}.ts`, `src/app/registro/[token]/{page,actions}.ts`, `src/components/registro/*`, `src/app/admin/client-link-actions.ts`, `src/components/admin/ClientLinkPanel.tsx`, cambios en `admin/page.tsx` y `admin/projects/[id]/page.tsx`. Sin código modificado.
**Resultado:** ningún hallazgo crítico (no hay violación de ADR ni escalada). Verificado OK: el cliente no puede tocar `status/template/slug/color_theme` ni claves arbitrarias de `extra_config` (Zod strip + `buildUpdate`); `findOpenLink` valida regex de token y `open=true`; service role solo en archivos `'use server'`/servidor; `client-link-actions` verifica `auth.getUser()` en las 4 acciones; `redirect` de `createClientDraft` no está dentro de try; no hay `dangerouslySetInnerHTML`; `javascript:` bloqueado en URLs y media; el admin sí re-carga las claves que escribe el cliente (no hay pérdida desde `admin/actions.ts`).

**Archivo/línea:** `src/app/registro/[token]/actions.ts:65-81` + `supabase/migrations/0013_invitation_media_storage_policies.sql:14-15`
**Problema:** `createSignedUploadUrl` no fija tipo ni tamaño; el `contentType` y el tamaño los pone el navegador al subir, y los buckets públicos no tienen `file_size_limit` ni `allowed_mime_types`. El tope de 8/15 MB y el MIME solo se validan sobre el valor declarado.
**Severidad:** alto
**Fix sugerido:** migración con `UPDATE storage.buckets SET file_size_limit=…, allowed_mime_types=ARRAY['image/jpeg','image/png','image/webp'] WHERE id='invitation-media'` (y `audio/mpeg` para `invitation-audio`). Verificar también en producción.

**Archivo/línea:** `src/app/registro/[token]/actions.ts:74-86`
**Problema:** `uploads_count` es lectura-modificación-escritura (`found.link.uploads_count + 1`) y el error del update se ignora; peticiones paralelas burlan el tope de 60.
**Severidad:** alto
**Fix sugerido:** RPC atómica: `UPDATE project_client_links SET uploads_count = uploads_count + 1 WHERE project_id=$1 AND uploads_count < 60 RETURNING uploads_count`; si no devuelve fila, rechazar; revisar `error`.

**Archivo/línea:** `src/components/registro/RegistroForm.tsx:410-411, 442, 604, 613` (y `ClientUploader.tsx:25-32`)
**Problema:** los `onUploaded` y `up()` usan snapshots `d`/`p` del render en el que se eligió el archivo. Si el usuario escribe o quita algo mientras sube una foto, al terminar la subida se sobrescribe ese cambio (texto de lugar/hotel borrado, foto quitada que reaparece, foto caída en otro hotel tras un borrado).
**Severidad:** medio
**Fix sugerido:** usar actualizadores funcionales: `setData(prev => …)` en `set`/`up` y en los callbacks de subida, leyendo el estado previo, no el del render.

**Archivo/línea:** `src/lib/registro/schema.ts:49`, `src/lib/registro/apply.ts:62`, `src/lib/registro/apply.ts:182`
**Problema:** `event_date` se guarda como texto sin zona horaria y `initialData` recorta el ISO con `slice(0,16)`. Postgres lo interpreta en la zona de la sesión (UTC por defecto en Supabase), y las plantillas lo leen con `new Date()`; el mismo patrón existe en `ProjectForm.tsx:149,498`. Si la DB está en UTC, una boda a las 17:00 (CDMX) se muestra a las 11:00.
**Severidad:** medio (verificar `SHOW timezone` antes de cerrar)
**Fix sugerido:** guardar con offset explícito (`${d.event_date}:00-06:00` para America/Mexico_City) y leer convirtiendo a esa zona; aplicar el mismo criterio en `ProjectForm`.

**Archivo/línea:** `src/lib/registro/apply.ts:114` (`previous[idx]?.icon`)
**Problema:** en plantillas que no son de boda, el ícono del ítem de itinerario se toma por índice; al borrar o reordenar, cada ítem hereda el ícono de otro.
**Severidad:** medio
**Fix sugerido:** conservar el `icon` de cada ítem en `ClientData` (campo oculto validado con la lista de íconos existentes), en lugar de asociarlo por posición.

**Archivo/línea:** `supabase/migrations/0014_project_client_links.sql:19-22`
**Problema:** la policy `admin_all_client_links` (y `admin_all` de `projects`) usa `auth.role()='authenticated'`: cualquier cuenta autenticada en Supabase puede leer todos los tokens y regenerar o cerrar links. Solo es seguro si el signup público está deshabilitado.
**Severidad:** medio (verificar configuración de Auth)
**Fix sugerido:** confirmar que el signup está deshabilitado; mejor, restringir la policy a una lista de `auth.uid()` o al email del admin.

**Archivo/línea:** `src/lib/registro/schema.ts:17` (`httpUrl`) y `:26` (`mediaUrl`)
**Problema:** `httpUrl` acepta `https://` vacío y cualquier host (se renderiza en `href` de `mapsUrl`, `sitioWeb`, `liverpoolLink`). `mediaUrl` acepta objetos de cualquier bucket público del proyecto, no solo del propio.
**Severidad:** bajo
**Fix sugerido:** `new URL()` con protocolo http(s) y host no vacío (opcionalmente lista de dominios de mapas y tiendas); en `buildUpdate` exigir prefijo `${MEDIA_PREFIX}invitation-media/${project.id}/` o `/images/`.

**Archivo/línea:** `src/app/registro/[token]/actions.ts:26`
**Problema:** `SECTION_SCHEMAS[section]` acepta claves heredadas (`constructor`, `toString`): `schema.safeParse` no existe y se lanza TypeError (500) en vez de error controlado.
**Severidad:** bajo
**Fix sugerido:** `if (!Object.hasOwn(SECTION_SCHEMAS, section)) return { ok:false, error:'Sección no válida.' }`.

**Archivo/línea:** `src/app/admin/client-link-actions.ts:62-68` y `:94`
**Problema:** `createClientDraft` no valida `template` contra `TemplateId` ni limita la longitud de `name`; el insert de `project_client_links` ignora su error (el proyecto queda sin link, aunque `ensureClientLink` lo repara).
**Severidad:** bajo
**Fix sugerido:** validar `template` contra la lista de plantillas y `name` con máximo; comprobar `error` del insert y lanzar si falla.

**Archivo/línea:** `src/components/admin/ClientLinkPanel.tsx:22` y `:13-14, :85-87`
**Problema:** la URL se calcula con `window` en el render (SSR y cliente difieren) y las fechas se formatean con `toLocaleString` durante SSR; provoca mismatch de hidratación (zona horaria del servidor distinta).
**Severidad:** bajo
**Fix sugerido:** calcular la URL y las fechas en `useEffect` o usar `suppressHydrationWarning` en esos nodos.

**Archivo/línea:** `src/components/admin/ClientLinkPanel.tsx:37`
**Problema:** `navigator.clipboard.writeText` sin try/catch; falla en contextos no seguros y deja una promesa rechazada.
**Severidad:** bajo
**Fix sugerido:** envolver en try/catch y, si falla, seleccionar el input para copiar manualmente.

**Archivo/línea:** `src/lib/registro/time.ts:12-14`
**Problema:** `to24h` devuelve `''` para horas no reconocidas (p. ej. "5:00 p.m.") y el input aparece vacío, aunque el valor original se conserva si no se toca.
**Severidad:** bajo
**Fix sugerido:** si no se parsea, mostrar un input de texto o conservar el valor original con un aviso.

**Archivo/línea:** `src/components/registro/RegistroForm.tsx:160-171`
**Problema:** `saveCurrent` envía un snapshot; lo escrito durante el `await` no se guarda y la pantalla avanza diciendo "Ya guardamos cada paso".
**Severidad:** bajo
**Fix sugerido:** deshabilitar los campos mientras `saving` es true o volver a guardar el paso si `data[current]` cambió.

**Archivo/línea:** `src/app/registro/[token]/actions.ts:49-58`
**Problema:** `submitForReview` no revalida los campos obligatorios; el admin recibe "Cliente envió datos" aunque falten nombres o fecha.
**Severidad:** bajo
**Fix sugerido:** validar `datos` (nombres y fecha) y al menos `lugares.ceremony` antes de fijar `submitted_at`.

**Archivo/línea:** `src/lib/supabase/service.ts:1` y `src/lib/registro/link.ts:1`
**Problema:** nada impide importar el cliente con service role desde un componente cliente; hoy no ocurre, pero no hay guardia.
**Severidad:** bajo
**Fix sugerido:** `import 'server-only'` en ambos archivos.

**Fuera de alcance (observado):** `supabase/migrations/0001_create_projects.sql` (GRANT SELECT a anon + `public_read_published`) y 0004 (`pin_admin`): cualquier anónimo puede leer `pin_admin` de proyectos publicados, porque no hay REVOKE a nivel columna. **Severidad:** alto (pre-existente). **Fix sugerido:** REVOKE SELECT (pin_admin) FROM anon, o mover el PIN a una tabla sin grants a anon.
