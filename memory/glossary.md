# glossary — Terminología del proyecto Goldrose

> Referencia rápida para agentes y desarrolladores nuevos. Ordenado por categoría. Ver [[context]] para arquitectura y [[code-notes]] para patrones técnicos.

---

## Dominio del producto

**Goldrose**
Nombre del repositorio y producto interno. No es el nombre público — de cara al cliente la marca es **MeCorr Estudio**.

**Quinceañera**
Celebración de los 15 años de una joven mexicana. Es el tipo de evento para el que se crean todas las invitaciones del sistema.

**Invitación**
El producto final entregado al cliente: una página web responsiva y animada que se comparte por link (WhatsApp, SMS, redes sociales).

**Template / Plantilla**
Uno de los 11 diseños visuales disponibles. Cada template tiene su propio CSS, componentes y, opcionalmente, soporte de temas de color. Identificado por `TemplateId` en TypeScript.

**Proyecto** (`project`)
Registro en Supabase que representa una invitación específica para un cliente. Contiene todos los datos del evento: nombres, fechas, lugares, fotos, configuración visual. Tabla: `projects`.

**Slug**
Identificador de URL único de cada proyecto. Ejemplo: `valeria-lopez`. Se genera automáticamente del nombre de la quinceañera usando normalización Unicode. La BD impone `UNIQUE` sobre este campo.

**Draft**
Estado de un proyecto en edición. No es accesible públicamente (`status = 'draft'`). Solo visible en el panel de administración.

**Published**
Estado de un proyecto listo para compartir con los invitados (`status = 'published'`). Activa la ruta pública `/i/:slug`.

**Cliente**
La familia contratante de la invitación. No tiene cuenta en el sistema; recibe el link de la invitación y el de vista previa del admin.

**Invitado**
Asistente al evento que abre el link de la invitación, la visualiza y confirma asistencia por WhatsApp.

**RSVP**
Confirmación de asistencia. En Goldrose se realiza abriendo WhatsApp o Email con un mensaje pre-formateado. Los datos del invitado **no se guardan en BD** (diseño por privacidad).

---

## IDs de templates (exactos en el sistema)

| ID | Estilo |
|---|---|
| `sobre` | Sobre animado que se abre; el más popular |
| `esmeralda` | Diseño floral, tono verde esmeralda |
| `pink` | Estilo vintage rosa |
| `love` | Romántico, fotos protagonistas |
| `zafiro` | Contemporáneo, efecto brillo |
| `elegance` | Blanco/marfil + dorado, 6 temas |
| `hogwarts` | Temática Harry Potter |
| `sellorosa` | Sello de cera rosa, mobile-first |
| `rosagold` | Rosa + dorado |
| `magical` | Cosmos de fantasía, estrellas animadas |
| `especial` | Flexible, mayor personalización: sello, sobres, 6+ temas |

---

## Secciones de la invitación

**Hero**
Portada principal con foto y nombre de la quinceañera. Siempre presente en todos los templates.

**Ceremonia**
Lugar, hora y dirección de la ceremonia religiosa. Campo: `project.ceremony`.

**Recepción**
Lugar, hora y dirección del salón/fiesta. Campo: `project.reception`.

**Itinerario**
Timeline del evento con iconos, horas y descripciones. Campo: `project.itinerary` (JSONB array).

**Dress Code / Código de Vestimenta**
Colores y notas de vestimenta para los invitados. Campo: `project.dress_code`.

**Lluvia de Sobres**
Sección típica de eventos mexicanos que solicita regalo en efectivo dentro de un sobre. Controlada por `show_lluvia_sobres` (booleano).

**Datos Bancarios**
CLABE interbancaria para transferencias electrónicas. Alternativa o complemento a la Lluvia de Sobres. Controlada por `show_datos_bancarios`.

**Mesa de Regalos**
Link a registro de regalos en Liverpool u otra tienda. Campo: `project.gift_registry`.

**Hashtag**
Etiqueta de redes sociales para el evento (ej. `#ValeriaXV`). Campo: `project.hashtag`.

**Sticky Banner**
Banner fijo en la parte superior de la pantalla que muestra el nombre del invitado (del `guest_name`). Aparece al hacer scroll.

**Sobre / Envelope**
Animación de introducción exclusiva de algunos templates (especialmente `especial`). El usuario da clic en el sello y el sobre se abre con una transición CSS de 3s, revelando el contenido de la invitación.

**Sello**
Imagen circular en el sobre de apertura. Default: `/images/sello.png`. En el template Especial es personalizable via `extra_config.seal_url` y `extra_config.seal_filter`.

---

## Términos técnicos propios

**`extra_config`**
Campo JSONB en la tabla `projects`. Almacena campos específicos de cada template sin columnas dedicadas en el schema. Acceso siempre con cast TypeScript: `(project.extra_config?.campo as string) ?? ''`. Nunca usar `as any`. Ver [[decisions]] ADR 7.

**`TemplateId`**
Tipo TypeScript union con los 11 IDs de template válidos. Definido en `src/types/invitation.ts`. Usado como discriminante en `TemplateRenderer` y `ProjectFormData`.

**`TemplateRenderer`**
Componente que selecciona y carga dinámicamente el template correcto según `project.template`. Implementado con `next/dynamic` para code splitting — solo descarga el JS/CSS del template activo. Ubicación: `src/components/templates/TemplateRenderer.tsx`.

**`ProjectForm`**
Formulario del panel de administración con 9 pestañas para editar todos los campos de un proyecto. La pestaña 8 (`Tab 8`) es exclusiva del template Especial. Ubicación: `src/components/admin/ProjectForm.tsx`.

**`ProjectFormData`**
Interface TypeScript que representa el estado del `ProjectForm`. Los campos específicos del template Especial llevan prefijo `especial_*` (ej. `especial_seal_url`, `especial_seal_filter`). Definida en `src/app/admin/actions.ts`.

**`proxy.ts`**
Middleware de autenticación en Next.js 16. Equivalente al `middleware.ts` deprecado. Intercepta todas las rutas `/admin/*` y valida la sesión Supabase antes de servir la página. Ubicación: `src/proxy.ts`.

**`setAll`**
Callback obligatorio del cliente Supabase SSR en `proxy.ts`. Sincroniza cookies de sesión entre el objeto `request` y la `response` para que el token se refresque automáticamente. El orden de las 3 operaciones dentro de `setAll` es invariable. Ver [[decisions]] ADR 4.

**`--inv-*`**
Prefijo de las CSS custom properties del sistema de temas. Ejemplos: `--inv-primary`, `--inv-primary-dark`, `--inv-filter`, `--inv-seal-filter`, `--inv-bg-url`. Son seteadas en `document.documentElement` por el template activo y deben ser removidas en el cleanup del `useEffect`.

**`.wow` / `.fadeInUp`**
Clases de animación de entrada gestionadas por `EspecialScrollInit.tsx` via `IntersectionObserver`. El observer solo registra elementos presentes en el DOM al montar — **no usar en elementos con renderizado condicional** (quedarán invisibles permanentemente).

**`.con-scroll`**
Clase CSS que se agrega al elemento `<html>` cuando el sobre ha sido abierto. Habilita el scroll del body, que comienza bloqueado (`overflow: hidden`) para que el invitado no se salte la animación del sobre.

**`invitation-media`**
Bucket de Supabase Storage para imágenes y video de las invitaciones. Ruta de cada objeto: `{projectId}/{Date.now()}.{ext}`.

**`invitation-audio`**
Bucket de Supabase Storage para música de fondo. Misma convención de ruta que `invitation-media`.

**`MediaUploader`**
Componente de administración para subir archivos a Supabase Storage. Props clave: `bucket` (`'invitation-media'` | `'invitation-audio'`), `projectId`, `onUploadComplete: (url: string) => void`, `accept` (MIME type, default `'image/*'`). Ubicación: `src/components/admin/MediaUploader.tsx`.

**`filterValue` / `filterLight`**
Campos en cada objeto `EspecialTheme` que contienen cadenas CSS filter (ej. `'hue-rotate(340deg) saturate(1.2)'`). `filterValue` se aplica a imágenes decorativas y fondos; `filterLight` a elementos que deben verse más claros (sellos, sobres). Definidos en `src/lib/especial-themes.ts`.

**`seal_filter`**
Campo en `extra_config` que controla el filtro CSS aplicado **exclusivamente al sello** mediante la CSS var `--inv-seal-filter`. Vacío (`''`) = hereda el `filterValue` del tema activo; `'none'` = sin filtro (imagen original); cualquier string CSS válido = filtro personalizado.

**`MeCorr Estudio`**
Nombre de la empresa/marca pública. Aparece en la landing page, logo (`public/promo/logo_mecorr2.png`), WhatsApp de contacto (+52 55 7941 0833) y pie de página.

---

## Abreviaciones frecuentes en el código

| Sigla | Significado | Contexto en Goldrose |
|---|---|---|
| **ADR** | Architecture Decision Record | Formato de entradas en `memory/decisions.md` |
| **SSR** | Server-Side Rendering | Modo de renderizado de Next.js; relevante en `proxy.ts` y Server Components |
| **RSC** | React Server Component | Componente sin `'use client'`; usado en rutas de admin para seguridad |
| **JSONB** | JSON Binary (PostgreSQL) | Tipo de la columna `extra_config` y de arrays como `itinerary`, `photos` |
| **LGPD** | Ley General de Protección de Datos (México) | Razón por la que el RSVP no persiste datos de invitados |
| **LCP** | Largest Contentful Paint | Métrica de performance relevante al cargar templates pesados |
| **WSL2** | Windows Subsystem for Linux v2 | Entorno de desarrollo local; sufre de DNS intermitente (fix: `wsl --shutdown`) |
