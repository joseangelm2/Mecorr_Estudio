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
