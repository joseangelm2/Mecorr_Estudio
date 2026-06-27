# research — Hallazgos de investigación

## [2026-06-27] [investigador] — Mapa exhaustivo de distribución de fotos en Goldrose

**Pregunta:** ¿Dónde aparecen las fotos en el sistema? ¿Cómo se gestionan en la BD y el admin?

### HALLAZGO 1: Campos de fotos en la BD (Project)

| Campo | Tipo | Descripción | Ubicación en templates |
|-------|------|-------------|----------------------|
| `hero_photo_url` | string\|null | Foto principal/portada | Aparece en Hero Section en `SobreTemplate`, `EspecialTemplate`, `EleganceTemplate`, `LoveTemplate`, `PinkTemplate`, etc. |
| `photos` | string[] | Galería de fotos | Carrusel/grid en todos los templates que lo necesiten (Sobre, Especial, Rosa Gold, Love, Pink, Zafiro, Esmeralda, Elegance, Magical) |
| `ceremony.photoUrl` | string\|null | Foto de la iglesia/lugar ceremonia | `EspecialLocations`, `CeremoniaSection` (Sobre template) |
| `reception.photoUrl` | string\|null | Foto del salón recepción | `EspecialLocations`, `RecepcionSection` (Sobre template) |
| **extra_config URLs** (JSONB) | | **Específicas del template Especial** | |
| `background_url` | string\|null | Fondo personalizado | `EspecialTemplate` línea 31, aplica a todo el template |
| `decoration_url` | string\|null | Flores/decoraciones personalizadas | Pasado como `decorationSrc` a todos los sub-componentes de Especial |
| `seal_url` | string\|null | Sello personalizado | `EspecialEnvelope` (sobre animado) |
| `envelope_right_url` | string\|null | Sobre derecho | `EspecialEnvelope` |
| `envelope_left_url` | string\|null | Sobre izquierdo | `EspecialEnvelope` |
| `dress_code_image_url` | string\|null | Referencia de vestimenta | `EspecialDressCode` línea 60 |

**Implicación:** El sistema tiene **4 niveles de fotos:**
1. Nivel principal: `hero_photo_url` (portada) + `photos` (galería)
2. Ubicaciones: `ceremony.photoUrl` + `reception.photoUrl`
3. Template específico (Especial): 5 URLs extra en `extra_config`
4. Paleta de colores (Especial): `extra_config.dress_palette` (no es una foto, es config de colores)

---

### HALLAZGO 2: Cómo usa CADA TEMPLATE las fotos

#### `SobreTemplate` (7 temas)
- **hero_photo_url** → `HeroSection` (línea 76-79)
- **photos[]** → `FotosCarousel` (línea 95) — carrusel automático cada 3 seg, 4 fotos mínimo
- **ceremony.photoUrl** → `CeremoniaSection` (implícito vía `ceremony` object)
- **reception.photoUrl** → `RecepcionSection` (implícito vía `reception` object)
- **Componente clave:** `src/components/FotosCarousel.tsx` — carrusel con dots de navegación

#### `EspecialTemplate` (6 temas + vars CSS)
- **hero_photo_url** → `EspecialHero` (implícito vía `project`)
- **photos[]** → `EspecialPhotos` (línea 81) — carrusel, mismo patrón que `FotosCarousel`
- **ceremony.photoUrl** → `EspecialLocations` (línea 19, 43)
- **reception.photoUrl** → `EspecialLocations` (línea 43)
- **extra_config.background_url** → CSS var `--inv-bg-url` (línea 48-50)
- **extra_config.decoration_url** → Pasado a todos los sub-componentes como `decorationSrc`
- **extra_config.seal_url** → `EspecialEnvelope` (línea 68)
- **extra_config.envelope_right_url** → `EspecialEnvelope` (línea 69)
- **extra_config.envelope_left_url** → `EspecialEnvelope` (línea 70)
- **extra_config.dress_code_image_url** → `EspecialDressCode` (línea 60-66)
- **Componentes clave:** `EspecialPhotos.tsx`, `EspecialLocations.tsx`, `EspecialDressCode.tsx`

#### `EleganceTemplate` (6 temas)
- **photos[]** → Fallback automático: `getPhotos()` (línea 24-26) toma photos[0..9], rellena con placeholders
- **Usa 10 fotos:** [0,1,2,3] + 6 más en grid (línea 97)
- **Componentes clave:** `GalleryPhoto` wrapper, `ElegancePhotoGrid.tsx`

#### `LoveTemplate` (hardcoded)
- **photos[]** → Fallback: DEFAULT_PHOTOS (línea 18-25) si está vacío
- **LovePhotoGrid** (línea 60) — grid de fotos
- **Componentes clave:** `LovePhotoGrid.tsx`

#### `PinkTemplate` (hardcoded)
- **photos[]** → Fallback: DEFAULT_PHOTOS (línea 21-28)
- **Interleaved:** fotos[0], fotos[1], fotos[2], fotos[3] entre secciones (línea 61-70)
- **Grid:** `PinkPhotoGrid photos.slice(4)` (línea 69)

#### `ZafiroTemplate` (hardcoded)
- **photos[]** → Fallback: DEFAULT_PHOTOS (línea 19-26)
- **Interleaved:** similar a Pink (línea 62-75)
- **Grid:** `ZafiroPhotoGrid` con remaining fotos

#### `EsmeraldaTemplate` (hardcoded)
- **photos[]** → No recibe proyecto data explícito, usa fallback interno en sub-componentes
- **EsmeraldaPhotoGrid** (línea 45)

#### `MagicalTemplate` (hardcoded)
- **photos[]** → Fallback: FALLBACK_PHOTOS (línea 19-29, 9 fotos)
- **MagicalPhotoGrid** (línea 59)

#### `RosaGoldTemplate` → (delegado a `RosaGoldContent`)
- Estructura desconocida sin revisar `RosaGoldContent.tsx` (fuera de alcance)

#### `HogwartsTemplate` → (delegado a `HogwartsContent`)
- Estructura desconocida sin revisar `HogwartsContent.tsx` (fuera de alcance)

#### `SelloRosaTemplate` → (delegado a `SelloRosaContent`)
- Estructura desconocida sin revisar `SelloRosaContent.tsx` (fuera de alcance)

---

### HALLAZGO 3: Estructura actual de `photos` JSONB

**En TypeScript (invitation.ts:67):**
```typescript
photos: string[]
```

**En DB (projects table):**
```sql
photos: text[] (simple array de URLs)
```

**Patrón de lectura/escritura:**
- **Lectura:** `project.photos` — array de strings
- **Escritura (ProjectForm.tsx:113):** `photos.filter(Boolean)` — limpia URLs vacías
- **Edición (ProjectForm.tsx:226-242):**
  - `setArrayItem('photos', index, value)` — edita 1 foto
  - `addArrayItem('photos')` — agrega entrada vacía
  - `removeArrayItem('photos', index)` — elimina foto

**Patrón de upload (ProjectForm.tsx:604-611):**
```typescript
<MediaUploader
  projectId={project.id}
  bucket="invitation-media"
  accept="image/*"
  onUploadComplete={url => setForm(prev => ({ ...prev, photos: [...prev.photos.filter(Boolean), url] }))}
  label="Subir foto a la galería"
/>
```

**NO hay deduplicación:** Si subes la misma foto 2 veces, aparece 2 veces en el array.

**Límite:** No hay máximo definido en código; UI muestra campo "Agregar URL manualmente".

---

### HALLAZGO 4: Controles en Admin (`ProjectForm.tsx`)

#### Tab 6: "Estilo" — `hero_photo_url`
- **Control:** MediaUploader (si `project.id` existe) + input URL manual
- **Preview:** thumbnail 56px alto con botón ✕ para limpiar
- **Sección:** `SectionCard title="Foto de portada"` (línea 562)

#### Tab 3: "Ceremonia" — `ceremony_photo_url`
- **Control:** MediaUploader + input URL manual
- **Preview:** 48px thumbnail
- **Sección:** `Field title="Foto de la iglesia"` (línea 465)

#### Tab 4: "Recepción" — `reception_photo_url`
- **Control:** MediaUploader + input URL manual
- **Preview:** 48px thumbnail
- **Sección:** `Field title="Foto del salón"` (línea 499)

#### Tab 7: "Media" — `photos[]` (galería)
- **Control:** MediaUploader + array de inputs URL manual
- **Preview:** 12px thumbnails para cada foto
- **Sección:** `SectionCard title="Galería de fotos"` (línea 603)
- **UI pattern:**
  ```tsx
  {form.photos.map((url, i) => (
    <div key={i} className="flex gap-3 items-center">
      <img /> {/* 12x12 */}
      <input /> {/* URL editable */}
      <button type="button">✕</button> {/* Borrar */}
    </div>
  ))}
  ```

#### Tab 8: "Especial" (SOLO si template === 'especial')
- **background_url:** Input URL + MediaUploader (línea 750-768)
- **decoration_url:** Input URL + MediaUploader (línea 789-807) — solo si `decoration_style === 'personalizado'`
- **seal_url:** Input URL + MediaUploader (línea 810-828)
- **envelope_right_url:** Input URL + MediaUploader (línea 830-868)
- **envelope_left_url:** Input URL + MediaUploader (línea 850-868)
- **dress_code_image_url:** Input URL + MediaUploader (línea 1085-1099)

**Patrón repetido:** Cada campo tiene `<input type="url" /> + MediaUploader + (opcional) <textarea de descripción>`

---

### HALLAZGO 5: Cómo se guardan en actions.ts

**Función `formDataToProject()` (línea 70-157):**

```typescript
{
  // Nivel principal
  hero_photo_url: data.hero_photo_url || null,
  photos: data.photos.filter(Boolean),

  // Ubicaciones
  ceremony: {
    ...,
    photoUrl: data.ceremony_photo_url || undefined,
  },
  reception: {
    ...,
    photoUrl: data.reception_photo_url || undefined,
  },

  // Extra config (especial template)
  extra_config: {
    ...(data.especial_background_url  ? { background_url: data.especial_background_url  } : {}),
    ...(data.especial_decoration_url  ? { decoration_url: data.especial_decoration_url  } : {}),
    ...(data.especial_seal_url        ? { seal_url:       data.especial_seal_url        } : {}),
    ...(data.especial_dress_code_image_url ? { dress_code_image_url: ... } : {}),
    ...(data.especial_envelope_right_url   ? { envelope_right_url:   ... } : {}),
    ...(data.especial_envelope_left_url    ? { envelope_left_url:    ... } : {}),
    // + más campos no-foto
  },
}
```

**Lógica:** Omite campos vacíos (usa ternarios con `||`), excepto `photos` que filtra con `.filter(Boolean)`.

---

### HALLAZGO 6: MediaUploader — patrón de subida

**Archivo:** `src/components/admin/MediaUploader.tsx`

**Flujo:**
1. Usuario hace drag-drop o clic → `handleChange()` / `handleDrop()`
2. `upload(file)` → async
   - Crea path: `{projectId}/{Date.now()}.{ext}`
   - Sube a Supabase Storage (`bucket: 'invitation-media' | 'invitation-audio'`)
   - Obtiene publicUrl de Supabase
   - Llama `onUploadComplete(publicUrl)` callback
3. Callback actualiza form (ej: `set('hero_photo_url', url)`)

**Buckets (en BD schema no visible, pero usado en actions.ts:207-228):**
- `invitation-media` — imágenes, video (jpg, png, mp4, etc)
- `invitation-audio` — música (mp3, wav, etc)

**Sin deduplicación:** Cada upload crea archivo único con `Date.now()` en path.

---

### HALLAZGO 7: Gaps y observaciones

#### Gap 1: `LocationInfo.photoUrl` en lectura desde DB
- **context.md (línea 105):** `hero_photo_url`, `photos` documentados
- **Pero:** `ceremony.photoUrl` y `reception.photoUrl` no están en contexto
- **Encontrado en:** `src/types/invitation.ts:15` (LocationInfo interface)
- **Riesgo:** Admin puede no ser consciente de estas 2 fotos

#### Gap 2: Extra_config tiene muchas URLs pero no todas documentadas
- **Documentadas en contexto:** Ninguna
- **Encontradas en código:**
  - `background_url` — bien
  - `decoration_url` — bien
  - `seal_url` — bien
  - `envelope_right_url` — bien
  - `envelope_left_url` — bien
  - `dress_code_image_url` — bien
  - **Nota:** No hay `extra_config` URLs para otros templates (rosagold, hogwarts, sellorosa no tienen campos especiales de foto)

#### Gap 3: No hay validación de tipo de archivo en MediaUploader
- Acepta `accept="image/*"` pero Supabase podría recibir cualquier cosa
- No hay validación de tamaño de archivo

#### Gap 4: Fallback photos hardcodeadas en varios templates
- `LoveTemplate`, `PinkTemplate`, `ZafiroTemplate`, `EsmeraldaTemplate`, `MagicalTemplate`
- Si usuario no sube fotos, se muestran placeholders del repo
- **Riesgo:** Inconsistencia visual, client no espera esto

#### Gap 5: RosaGold, Hogwarts, SelloRosa no fueron revisados en detalle
- Usan componentes delegados (`RosaGoldContent`, `HogwartsContent`, `SelloRosaContent`)
- Su uso de fotos desconocido sin leer esos archivos

---

### IMPLICACIÓN PARA EL EQUIPO

1. **Fotos están distribuidas en 3 lugares:** tabla principal, `LocationInfo`, `extra_config` JSONB
2. **Admin maneja bien hero + galería**, pero ubicaciones y especial requieren tabs separados
3. **Templates usan fallbacks:** Cada uno decide qué hacer si no hay fotos (rellena con placeholders)
4. **No hay control centralizado:** Cada template implementa su propio carrusel/grid/interleaving
5. **Oportunidad de refactor:** `FotosCarousel` podría consolidarse para todos los templates

**Si necesitan agregar nueva sección de fotos:**
- Campo en `Project` type
- Control en `ProjectForm.tsx`
- Pasarlo a template como prop
- Usar en componente específico

