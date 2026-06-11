# Guía: Cómo Llenar una Nueva Invitación

Referencia completa para crear un registro en la base de datos. Un archivo = una invitación.

---

## 1. Información Básica (Requerida)

| Campo | Tipo | Ejemplo | Notas |
|-------|------|---------|-------|
| `quinceanera_name` | texto | `"Valeria López"` | Nombre completo de la festejada |
| `slug` | texto | `"valeria-lopez"` | URL de la invitación — sin espacios, sin acentos |
| `template` | texto | `"sobre"` | Ver sección 5 para opciones |
| `status` | texto | `"draft"` | `"draft"` mientras se edita, `"published"` para activar |

---

## 2. Texto y Comunicación

| Campo | Tipo | Ejemplo | Notas |
|-------|------|---------|-------|
| `guest_name` | texto | `"Familia Martínez"` | Nombre que aparece en el banner de bienvenida |
| `invitation_text` | texto | `"Con la bendición de Dios..."` | Párrafo de invitación personalizado |
| `rsvp_phone` | texto | `"5512345678"` | WhatsApp para confirmaciones — sin `+52`, sin espacios |
| `hashtag` | texto | `"#XVValeria"` | Hashtag de redes sociales |
| `confirmation_phrase` | texto | `"Confirma tu asistencia antes del 10 de julio"` | Texto encima del formulario de RSVP |
| `confirmation_highlight_date` | texto | `"10 de julio"` | Fecha resaltada en la sección de confirmación |

---

## 3. Familia y Padrinos

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| `parent_names` | array de texto | `["Alejandro López", "María García de López"]` |
| `padrinos` | array de texto | `["Juan Pérez - Padrino de Corona", "Ana Ruiz - Madrina de Flores"]` |

---

## 4. Ubicaciones

### Ceremonia Religiosa
| Campo | Ejemplo |
|-------|---------|
| `ceremony_venue` | `"Parroquia de San Juan Bautista"` |
| `ceremony_address` | `"Calle Hidalgo 123, Col. Centro, CDMX"` |
| `ceremony_time` | `"3:00 PM"` |
| `ceremony_map_link` | `"https://maps.google.com/?q=..."` |
| `ceremony_photo_url` | URL de imagen subida a Supabase |

### Recepción / Salón
| Campo | Ejemplo |
|-------|---------|
| `reception_venue` | `"Salón Imperial"` |
| `reception_address` | `"Av. Insurgentes Sur 456, CDMX"` |
| `reception_time` | `"5:00 PM"` |
| `reception_map_link` | `"https://maps.google.com/?q=..."` |
| `reception_photo_url` | URL de imagen subida a Supabase |

---

## 5. Templates Disponibles (10 opciones)

| Template | Descripción | Temas de color |
|----------|-------------|----------------|
| `sobre` | Sobre animado que se abre | 7 temas (ver abajo) |
| `cenicienta` | Cenicienta con degradados | 6 temas (ver abajo) |
| `esmeralda` | Galería pesada, diseño propio | No (hardcoded) |
| `pink` | Sobre vintage rosa | No |
| `love` | Tema romántico | No |
| `zafiro` | Tema zafiro | No |
| `hogwarts` | Tema Harry Potter | No |
| `sellorosa` | Sello de cera rosa | No |
| `rosagold` | Oro rosa | No |
| `magical` | Fantasía/mágico | No |

### Temas para `sobre`
`rosa-gold` · `azul` · `lila` · `rojo` · `negro` · `mariposas` · `blanco-oro`

### Temas para `cenicienta`
`azul-dorado` · `morado-dorado` · `marino-dorado` · `esmeralda-dorado` · `blanco-dorado` · `rosa-dorado`

---

## 6. Secciones Opcionales (Feature Flags)

Cada sección se activa con un campo booleano:

### `show_video` — Sección de video
| Campo | Ejemplo | Notas |
|-------|---------|-------|
| `video_youtube_id` | `"dQw4w9WgXcQ"` | Solo el ID, no la URL completa |
| `video_url` | URL Supabase `.mp4` | Solo si no hay YouTube |

> YouTube tiene prioridad sobre video directo.

---

### `show_lluvia_sobres` — Sección de lluvia de sobres
| Campo | Ejemplo |
|-------|---------|
| `lluvia_sobres_text` | `"Si deseas hacerme un regalo económico..."` |

> Si el campo de texto está vacío, usa texto predeterminado.

---

### `show_datos_bancarios` — Transferencia bancaria
| Campo | Ejemplo |
|-------|---------|
| `bank_beneficiary` | `"María García López"` |
| `bank_account` | `"012345678901234567"` (18 dígitos CLABE) |
| `datos_bancarios_text` | `"Puedes hacer tu depósito a..."` |

> Muestra botón de copiar CLABE automáticamente.

---

### `show_itinerary` — Programa del evento (timeline)
Activar con `show_itinerary: true`, luego llenar el array `itinerary`:

```json
[
  { "time": "3:00 PM", "description": "Ceremonia religiosa", "icon": "⛪" },
  { "time": "4:30 PM", "description": "Sesión de fotos", "icon": "📸" },
  { "time": "5:00 PM", "description": "Cóctel de bienvenida", "icon": "🥂" },
  { "time": "6:00 PM", "description": "Entrada de la quinceañera", "icon": "👑" },
  { "time": "7:00 PM", "description": "Cena", "icon": "🍽️" },
  { "time": "8:00 PM", "description": "Baile", "icon": "💃" }
]
```
El `icon` puede ser: emoji, URL de imagen, o ruta de archivo.

---

### Liverpool (Mesa de regalos)
| Campo | Ejemplo |
|-------|---------|
| `liverpool_link` | `"https://mesaderegalos.liverpool.com.mx/..."` |

---

### Código de vestimenta
| Campo | Ejemplo |
|-------|---------|
| `dress_code_colors` | `"Rosa pastel, blanco y dorado"` |
| `dress_code_notes` | `"Evitar color negro"` |

---

## 7. Imágenes Requeridas

| Imagen | Cantidad | ¿Obligatoria? | Recomendación |
|--------|----------|---------------|---------------|
| Foto principal / portada (`hero_photo_url`) | 1 | No | Alta resolución, vertical |
| Foto iglesia / ceremonia | 1 | No | Exterior del lugar |
| Foto salón / recepción | 1 | No | Exterior del lugar |
| Galería de fotos (`photos[]`) | 0 a ∞ | No | Mínimo 4 para buen carrusel |
| Música de fondo (`music_url`) | 1 | No | MP3, subir a Supabase |
| Video (si `show_video`) | 1 | No | YouTube ID o MP4 en Supabase |

> **Total típico por invitación:** 1 portada + 2 lugares + 6-12 galería = **9 a 15 imágenes**

### Dónde subir las imágenes
- Imágenes y video → bucket `invitation-media` en Supabase
- Audio/música → bucket `invitation-audio` en Supabase

---

## 8. Ejemplo Completo (JSON)

```json
{
  "quinceanera_name": "Valeria López",
  "slug": "valeria-lopez",
  "template": "sobre",
  "status": "draft",
  "guest_name": "Familia Martínez",
  "invitation_text": "Con la bendición de Dios y la alegría de nuestros corazones...",
  "rsvp_phone": "5512345678",
  "hashtag": "#XVValeria",
  "confirmation_phrase": "Confirma tu asistencia antes del 10 de julio",
  "parent_names": ["Alejandro López", "María García de López"],
  "padrinos": ["Juan Pérez - Padrino de Corona"],
  "ceremony_venue": "Parroquia de San Juan Bautista",
  "ceremony_address": "Calle Hidalgo 123, Col. Centro, CDMX",
  "ceremony_time": "3:00 PM",
  "ceremony_map_link": "https://maps.google.com/?q=...",
  "reception_venue": "Salón Imperial",
  "reception_address": "Av. Insurgentes Sur 456, CDMX",
  "reception_time": "5:00 PM",
  "dress_code_colors": "Rosa pastel, blanco y dorado",
  "liverpool_link": "https://mesaderegalos.liverpool.com.mx/...",
  "show_video": false,
  "show_lluvia_sobres": true,
  "show_datos_bancarios": true,
  "bank_beneficiary": "María García López",
  "bank_account": "012345678901234567",
  "show_itinerary": true,
  "itinerary": [
    { "time": "3:00 PM", "description": "Ceremonia religiosa", "icon": "⛪" },
    { "time": "5:00 PM", "description": "Recepción", "icon": "🥂" }
  ],
  "hero_photo_url": "https://...supabase.co/storage/v1/object/public/invitation-media/valeria/portada.jpg",
  "photos": [
    "https://...supabase.co/storage/v1/object/public/invitation-media/valeria/foto1.jpg",
    "https://...supabase.co/storage/v1/object/public/invitation-media/valeria/foto2.jpg"
  ]
}
```

---

## 9. Checklist Antes de Publicar

- [ ] `status` cambiado a `"published"`
- [ ] `slug` único (no repetido con otra invitación)
- [ ] `rsvp_phone` sin `+52`, sin espacios, 10 dígitos
- [ ] Links de Google Maps verificados
- [ ] Galería con mínimo 4 fotos
- [ ] Secciones opcionales activadas/desactivadas según el cliente
- [ ] Template y tema de color confirmado con el cliente
