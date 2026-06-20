# Template "Especial" — Design Spec
**Fecha:** 2026-06-19

## Resumen

Nuevo template `especial` basado visualmente en el template `sobre animado` existente, refactorizado en componentes independientes por sección (patrón `elegance`), con sistema de temas de color, fondo personalizable, decoraciones seleccionables y paleta de colores para código de vestimenta.

---

## 1. Arquitectura y estructura de archivos

```
src/
  app/especial/
    page.tsx            ← ruta pública dinámica /especial (igual patrón que /sobre)
    layout.tsx
    especial.css        ← copia base de sobre.css, adaptada para especial

  components/especial/
    EspecialEnvelope.tsx     ← sobre animado de apertura
    EspecialScrollInit.tsx   ← inicializa animaciones scroll (WOW.js)
    EspecialHero.tsx         ← foto portada + nombre quinceañera
    EspecialParents.tsx      ← padres y padrinos
    EspecialEventDate.tsx    ← countdown + fecha
    EspecialLocations.tsx    ← ceremonia + recepción
    EspecialItinerary.tsx    ← itinerario
    EspecialDressCode.tsx    ← vestimenta + paleta de colores
    EspecialHashtag.tsx      ← hashtag instagram
    EspecialPhotos.tsx       ← carrusel de fotos
    EspecialGifts.tsx        ← mesa regalos + lluvia sobres + datos bancarios
    EspecialRSVP.tsx         ← confirmación de asistencia
    EspecialVideo.tsx        ← video YouTube o local
    EspecialFooter.tsx       ← sección final con foto y nombre

  components/templates/
    EspecialTemplate.tsx     ← orquesta todos los componentes, aplica tema y extra_config

  lib/
    especial-themes.ts       ← array ESPECIAL_THEMES (5 temas iniciales)

public/images/especial/      ← assets propios: decoraciones, imágenes fallback
```

---

## 2. Registro en el sistema

- **`src/types/invitation.ts`** — `TemplateId` += `'especial'`
- **`src/components/templates/TemplateRenderer.tsx`** — mapea `'especial'` → `<EspecialTemplate />`
- **`src/components/admin/ProjectForm.tsx`** — `'especial'` aparece en el selector de template; nueva pestaña "Especial" visible solo cuando `form.template === 'especial'`

---

## 3. Sistema de temas de color

**Archivo:** `src/lib/especial-themes.ts`

Igual patrón que `ELEGANCE_THEMES`. Variables CSS reutilizan las mismas que `sobre` (`--inv-primary`, `--inv-primary-dark`, `--inv-primary-light`, `--inv-border`, `--inv-filter`, `--inv-filter-light`) para no reescribir `especial.css`.

**5 temas iniciales:**
| ID | Label | Color principal |
|---|---|---|
| `rosa` | Rosa | `#d4819a` |
| `dorado` | Dorado | `#c8a84b` |
| `azul` | Azul | `#5b8fc9` |
| `verde` | Verde | `#6aab8a` |
| `lila` | Lila | `#9b7ec8` |

`EspecialTemplate.tsx` aplica el tema via `useEffect` → `document.documentElement.style.setProperty(...)` al montar, y limpia al desmontar.

---

## 4. Personalización via `extra_config`

Sin migración de BD. Todos los campos viven en el JSONB `extra_config` existente.

| Campo | Tipo | Default | Qué controla |
|---|---|---|---|
| `background_url` | `string` | imagen genérica del sobre | URL de imagen de fondo personalizada |
| `decoration_style` | `'flores' \| 'mariposas' \| 'estrellas'` | `'flores'` | Set de imágenes decorativas |
| `banner_text` | `string` | nombre de la quinceañera | Texto del banner sticky superior |
| `footer_text` | `string` | frase genérica | Texto de cierre en sección final |
| `show_dress_palette` | `boolean` | `false` | Muestra/oculta paleta de colores en vestimenta |
| `dress_palette` | `DressPaletteEntry[]` | `[]` | Colores de la paleta de vestimenta |

**Tipo `DressPaletteEntry`:**
```ts
interface DressPaletteEntry {
  name: string      // etiqueta visible bajo el círculo
  colors: string[]  // 1 hex = sólido; 2+ hex = gradiente horizontal
}
```

---

## 5. Sección de código de vestimenta con paleta

**Componente:** `EspecialDressCode.tsx`

Renderiza:
1. Texto descriptivo del dress code (`dress_code.colors` + `dress_code.notes`)
2. Si `extra_config.show_dress_palette === true` y `dress_palette.length > 0`:
   - Fila centrada de círculos distribuidos dinámicamente (`flex`, `justify-content: center`, `flex-wrap: wrap`)
   - Cada círculo (~60px): `background: linear-gradient(to right, ...colors)` para gradientes, color sólido para entradas de un solo color
   - Nombre del color centrado debajo del círculo

**Ejemplo visual:**
```
       ◉          ◉          ◉
    Rosa Palo   Amanecer   Blanco perla
```

---

## 6. Admin — Pestaña "Especial"

En `ProjectForm.tsx`, nueva pestaña (tab índice 7 o al final de los existentes), visible solo cuando `form.template === 'especial'`.

**Controles:**

### Fondo y decoraciones
- **Fondo personalizado** — Input URL + botón de carga de archivo
- **Decoraciones** — Selector visual con 3 opciones: Flores / Mariposas / Estrellas (botones con preview de imagen)

### Textos opcionales
- **Texto banner** — `<input>` con placeholder "Nombre de la quinceañera"
- **Texto de cierre** — `<textarea>` con placeholder genérico

### Código de vestimenta — Paleta
- Switch "Mostrar paleta de colores"
- Cuando activo: lista dinámica de entradas
  - Cada entrada: `<input>` nombre + uno o más `<input type="color">` + botón "+" agregar parada + botón "✕" quitar entrada
  - Botón "+ Agregar color" para nueva entrada

**Persistencia:** Los campos de la pestaña se guardan en `extra_config` via `actions.ts`, igual que `parents_title`/`padrinos_title` en elegance.

**Tipo en `ProjectFormData`:**
```ts
especial_background_url: string
especial_decoration_style: 'flores' | 'mariposas' | 'estrellas'
especial_banner_text: string
especial_footer_text: string
especial_show_dress_palette: boolean
especial_dress_palette: DressPaletteEntry[]
```

---

## 7. Flujo de datos

```
Supabase projects.extra_config (JSONB)
  └─ leído en page.tsx → pasado como Project a EspecialTemplate
       └─ EspecialTemplate extrae extra_config y lo pasa a cada componente que lo necesita
            ├─ EspecialHero        ← hero_photo_url, quinceanera_name
            ├─ EspecialParents     ← parent_names, padrinos
            ├─ EspecialEventDate   ← event_date
            ├─ EspecialLocations   ← ceremony, reception
            ├─ EspecialDressCode   ← dress_code, show_dress_palette, dress_palette
            ├─ EspecialGifts       ← gift_registry, show_lluvia_sobres, show_datos_bancarios
            ├─ EspecialRSVP        ← rsvp_phone, confirmation_phrase
            └─ EspecialVideo       ← show_video, video_youtube_id, video_url
```

---

## 8. Notas de implementación

- `especial.css` parte de una copia de `sobre.css` — no compartir el archivo CSS para mantener independencia total
- Las imágenes de decoraciones para `flores`, `mariposas`, `estrellas` van en `public/images/especial/` — reutilizar activos existentes de otros templates donde aplique
- `EspecialEnvelope.tsx` parte como copia de `IntroEnvelope.tsx` adaptada al nuevo CSS
- Todos los componentes usan `'use client'` solo donde necesitan interactividad (countdown, copy, envelope)
- El carrusel de fotos (`EspecialPhotos.tsx`) parte de `FotosCarousel.tsx`
