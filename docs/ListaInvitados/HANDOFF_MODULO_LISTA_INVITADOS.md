# Handoff: Módulo Lista de Invitados
**invitaxv.lol** · Versión 1.0 · Junio 2025

---

## ⚠️ Sobre los archivos de diseño

Los archivos `.dc.html` en este paquete son **prototipos de referencia creados en HTML** — muestran el aspecto visual y el comportamiento esperado, pero **no son código de producción**. La tarea es **recrear estos diseños en el stack del proyecto** (Next.js 16 · TypeScript · Tailwind CSS v4 · shadcn/ui · Supabase) usando sus patrones y librerías establecidos.

**Archivos incluidos:**
- `Diseño Mobile.dc.html` — Canvas con las 10 pantallas del sistema de diseño completo (modo claro + oscuro)
- `Prototipo Admin.dc.html` — Prototipo interactivo del flujo de administración
- `Prototipo Invitado.dc.html` — Prototipo interactivo del flujo del invitado (invitación → RSVP → boleto)

---

## Fidelidad

**Alta fidelidad (hifi).** Los prototipos son mockups pixel-precisos con colores finales, tipografía, espaciado e interacciones. El desarrollador debe recrear el UI con la mayor fidelidad posible usando las librerías del proyecto (Tailwind v4, shadcn/ui).

---

## Stack objetivo

```
Next.js 16 (App Router)
TypeScript
Tailwind CSS v4
shadcn/ui
Supabase (Postgres + RLS + Realtime)
@react-pdf/renderer (boletos)
qrcode (QR en boleto)
bcryptjs (PIN)
jsonwebtoken (sesión efímera)
papaparse + xlsx (importación/exportación)
```

---

## Rutas (App Router)

```
src/app/i/[slug]/
├── page.tsx                      ← PIN Login
├── admin/
│   ├── page.tsx                  ← Dashboard + Lista + Boletos (tabs)
│   └── boletos/[id]/route.ts    ← PDF individual
├── invitacion/page.tsx           ← Invitación digital (guest)
└── api/ ...                      ← Ver plan técnico
```

---

## Decisión de interacción

**Opción B confirmada:** Las tarjetas de invitados usan un patrón **tap en `···` para revelar acciones** (panel expandible). Solo una tarjeta expandida a la vez. Ver implementación en la sección de Estado más adelante.

---

## Tokens de Diseño

### Colores — Modo Claro

| Token | Hex | Uso |
|---|---|---|
| `primary` | `#7C5C4A` | Botones principales, nav activo, accents |
| `accent` | `#C4956A` | Bronze/dorado, énfasis, hero cards |
| `surface` | `#F7F5F2` | Fondo de pantalla, inputs, backgrounds |
| `canvas` | `#E7E5DF` | Fondo general de página |
| `card` | `#FFFFFF` | Cards de invitados y grupos |
| `text-primary` | `#1C1917` | Títulos, nombres, contenido principal |
| `text-secondary` | `#78716C` | Labels, subtítulos |
| `text-tertiary` | `#A8A29E` | Placeholders, captions, hints |
| `border` | `#E7E5E3` | Bordes de cards e inputs |
| `border-subtle` | `#F0EEEB` | Divisores internos |
| `status-green` | `#16A34A` | Confirmó asistencia, acciones de envío WA |
| `status-blue` | `#2563EB` | Estado "Enviado" |
| `status-red` | `#DC2626` | Baja, acciones destructivas |
| `status-gray` | `#78716C` | Estado "Alta" (sin enviar) |

### Colores — Modo Oscuro

| Token | Hex | Uso |
|---|---|---|
| `dark-bg` | `#121110` | Fondo de pantalla |
| `dark-card` | `#1C1A18` | Cards, modales |
| `dark-surface` | `#171512` | Fondos de paneles de acciones |
| `dark-border` | `#2E2B27` | Bordes |
| `dark-primary` | `#C4956A` | Botones principales (bronze más claro) |
| `dark-text` | `#F0EBE5` | Texto principal |
| `dark-text-secondary` | `#A8A29E` | Texto secundario |
| `dark-text-tertiary` | `#57534E` | Texto deshabilitado/hints |

### Colores de grupos (defaults)

| Grupo | Color |
|---|---|
| Familia | `#C4956A` |
| Amigos | `#57A773` |
| Trabajo | `#5B87B5` |

### Tipografía

| Fuente | Pesos | Uso |
|---|---|---|
| `Playfair Display` (serif) | 400, 600, 700 | H1–H3, nombres de invitados, nombre del evento, números grandes |
| `DM Sans` (sans-serif) | 400, 500, 600, 700 | Todo lo funcional: labels, body, botones, captions |

**Escala tipográfica:**

| Rol | Fuente | Size | Weight | Color |
|---|---|---|---|---|
| H1 evento | Playfair Display | 44px | 700 | `#1C1917` |
| H2 sección | Playfair Display | 22px | 700 | `#1C1917` |
| H3 card | Playfair Display | 18px | 700 | `#1C1917` |
| Body | DM Sans | 14–15px | 400–500 | `#1C1917` |
| Label | DM Sans | 12–13px | 600 | `#78716C` |
| Caption | DM Sans | 11–12px | 400 | `#A8A29E` |
| Badge | DM Sans | 10–11px | 600 | varía |

### Espaciado

| Nombre | Valor |
|---|---|
| Screen padding H | 20–24px |
| Gap entre cards | 8–10px |
| Card padding | 14–16px |
| Section gap | 18–20px |

### Border Radius

| Elemento | Valor |
|---|---|
| Cards de invitados | 16px |
| Cards de grupos | 16px |
| Botones CTA | 14–16px |
| Pills de filtro | 20px (full) |
| Avatares | 12px |
| Bottom sheet modal (top) | 28px |
| Phone frame | 44px |
| Badges de estado | 20px (full) |
| Botones de acción (panel) | 11–12px |

### Sombras

| Elemento | Valor |
|---|---|
| Card expandida | `0 4px 20px rgba(124,92,74,.12)` |
| Hero stats card | ninguna (background sólido) |
| Modal/sheet | nativa del contexto |
| Botón YES seleccionado | `0 6px 24px rgba(22,163,74,.28)` |

---

## Pantallas

### 01 · PIN Login

**Ruta:** `/i/[slug]`  
**Propósito:** Acceso al portal de administración mediante PIN de 4 dígitos.

**Layout:** Pantalla centrada verticalmente. Sin header ni nav. Fondo `#F7F5F2`.

**Elementos (de arriba a abajo, centrados):**
1. Línea decorativa horizontal `40×1px` color `#C4956A`
2. Label "La fiesta de" — DM Sans 12px, 500, `letter-spacing: 2.5px`, uppercase, color `#A8A29E`
3. Nombre de la festejada — Playfair Display 44px, 700, color `#1C1917`
4. Línea decorativa `40×1px` color `#C4956A`
5. Texto "Ingresa tu PIN de acceso" — DM Sans 14px, color `#78716C`. Margen top: 52px
6. **4 cajas PIN:** `60×68px` cada una, `gap: 12px`, `border-radius: 16px`, fondo `#fff`
   - Vacía: `border: 1.5px solid #E7E5E3`
   - Activa/con cursor: `border: 2px solid #7C5C4A`
   - Rellena: `border: 2px solid #7C5C4A` + punto o dígito en Playfair Display 30px, 700
7. Botón "Acceder" — full width, padding 17px, bg `#7C5C4A`, border-radius 16px, DM Sans 15px 600 blanco
8. Texto ayuda "Solicita tu PIN a la festejada" — DM Sans 12px, `#A8A29E`. Margen top: 22px

**Comportamiento:**
- Al completar 4 dígitos, el botón se activa (siempre visible pero disabled sin los 4)
- `POST /api/auth` → si válido, redirige a `/admin`; si inválido, shake animation + limpiar inputs
- No hay sesión persistente. JWT efímero de 30 min guardado en memoria React

---

### 02 · Dashboard

**Ruta:** `/i/[slug]/admin` (tab activo: Dashboard)  
**Propósito:** Vista general de stats por grupo. Punto de entrada al admin.

**Layout:** Scroll vertical. Padding horizontal 20px. Padding top 56px (status bar). Padding bottom 72px (nav). Fondo `#F7F5F2`.

**Elementos:**

**Header:**
- "Dashboard" — Playfair Display 22px, 700, `#1C1917`
- "+ Grupo" — DM Sans 13px, 600, color `#7C5C4A`, border `1.5px solid #7C5C4A`, border-radius 20px, padding `7px 14px`
- Subtítulo "Fiesta de [festejada] · [fecha]" — DM Sans 13px, `#A8A29E`. Margen bottom: 18px

**Hero card stats:**
- Bg: `#7C5C4A`, border-radius 20px, padding `22px 24px`
- Izquierda: label "Total invitados" (11px, uppercase, `rgba(255,255,255,.55)`) + número (Playfair 44px, 700, `#fff`)
- Derecha: label "Asistirán" + número (Playfair 44px, 700, `#C4956A`)
- Barra de progreso: `height: 5px`, bg `rgba(255,255,255,.15)`, fill `#C4956A`, border-radius 3px
- Caption "XX% confirmados · N grupos" — 12px, `rgba(255,255,255,.45)`
- **Nota:** Los totales suman `num_invitados`, no conteo de filas. `asistiran` = sum(num_invitados) donde `conf = 'SI'`

**Cards de grupo (sc-for / .map):**
- Bg `#fff`, border-radius 16px, padding `16px 18px`, margen bottom 10px
- Tappable → navega a Lista filtrada por ese grupo
- Dot de color `8×8px` (color del grupo) + nombre + "N personas" + chevron derecho
- 2 barras de progreso: Enviados (azul `#2563EB`) y Confirmados (verde `#16A34A`)
- Labels: "X/Y" con color del estado correspondiente

**Bottom nav:** Siempre visible, `position: fixed bottom-0` (o sticky). Ver sección Nav.

---

### 03 · Lista de Invitados

**Ruta:** `/i/[slug]/admin` (tab activo: Lista)  
**Propósito:** CRUD completo de invitados con acciones contextuales.

**Layout:** Scroll vertical. Header fijo con filtros. Cards de invitados.

**Header (sticky):**
- "Invitados" — Playfair Display 22px, 700
- "+ Agregar" — bg `#7C5C4A`, border-radius 20px, DM Sans 13px 600 blanco
- Si hay filtro de grupo activo: banner con dot de color + nombre + botón "×" para limpiar
- Pills de filtro: Todos | Alta | Enviado | Confirmó | Baja
  - Activa: bg `#7C5C4A`, text `#fff`
  - Inactiva: bg `#fff`, border `1px solid #E7E5E3`, text `#78716C`
  - border-radius: 20px, padding: `6px 14px`, DM Sans 12px 600

**Tarjeta de invitado (Opción B — tap `···` para revelar acciones):**

Estado cerrado:
- Bg `#fff`, border-radius 16px, padding `14px 16px`
- Avatar: `40×40px`, border-radius 12px. Color de fondo y letra según estado (ver tabla de estados)
- Nombre: DM Sans 14px, 600, `#1C1917`
- Subtítulo: dot de color del grupo `5×5px` + "Grupo · N inv." DM Sans 12px `#78716C`
- Badge de estado: pill con bg y color del estado (ver tabla)
- Botón `···`: `30×30px`, border-radius 8px, bg `#F7F5F2`, 3 dots `#A8A29E`

Estado expandido (mismo guest, `···` activo):
- Card tiene `box-shadow: 0 4px 20px rgba(124,92,74,.12)`
- Botón `···`: bg `#7C5C4A`, dots `#fff`
- Panel de acciones: bg `#F7F5F2`, padding `10px 14px 12px`, border-top `1px solid #F0EEEB`
- Acciones en flex-wrap, gap 7px, cada botón `flex: 1; min-width: 44%`

**Tabla de estados:**

| Estado | Badge bg | Badge color | Avatar bg | Avatar color | Card |
|---|---|---|---|---|---|
| alta | `#F4F0EE` | `#78716C` | `#F4F0EE` | `#78716C` | normal |
| enviado | `#EFF6FF` | `#2563EB` | `#EFF6FF` | `#2563EB` | normal |
| confirmo | `#F0FDF4` | `#16A34A` | `#F0FDF4` | `#16A34A` | normal |
| baja | `#F5F5F4` | `#A8A29E` | `#F5F5F4` | `#A8A29E` | texto tachado, opacity 0.7 |

**Matriz de acciones por estado:**

| Estado | Acciones disponibles |
|---|---|
| `alta` | Editar · Enviar WA · Eliminar |
| `enviado` | Confirmar · Editar · Enviar WA · Dar de baja · Desvincular* |
| `confirmo` (SI) | Editar · Boleto · Enviar WA · Desvincular* |
| `confirmo` (NO) | Editar |
| `baja` | Reactivar · Editar |

*Solo si `device_id !== null`

**Estilos de botones de acción:**

| Acción | Bg | Color texto/icono |
|---|---|---|
| Confirmar | `#F0FDF4` | `#16A34A` |
| Editar | `#fff` + border `#E7E5E3` | `#78716C` |
| Enviar WA | `#DCFCE7` | `#16A34A` |
| Boleto | `#FEF3C7` | `#D97706` |
| Dar de baja | `#FEF2F2` | `#DC2626` |
| Desvincular | `#F7F5F2` + border `#E7E5E3` | `#A8A29E` |
| Reactivar | `#F7F5F2` + border `#E7E5E3` | `#78716C` |

---

### 04 · Modal Agregar / Editar Invitado

**Trigger:** Botón "+ Agregar" (nuevo) o acción "Editar" en panel (pre-llenado)  
**Tipo:** Bottom sheet modal (shadcn/ui `Sheet` con `side="bottom"` o componente propio)

**Overlay:** `rgba(28,25,23,.45)` tap fuera cierra  
**Sheet:** bg `#fff`, border-radius `28px 28px 44px 44px` (top corners), animación slide-up 260ms

**Contenido:**
1. Handle bar: `36×4px`, bg `#E7E5E3`, centrado, margen top 14px
2. Header: título ("Agregar invitado" / "Editar invitado") Playfair 20px 700 + botón × circular `32×32px` bg `#F7F5F2`
3. Campo Titular: label uppercase 11px `#A8A29E` + input bg `#F7F5F2` border-radius 14px padding `14px 16px`
   - En edición: pre-llenado con el nombre actual
4. Selector de Grupo: flex-wrap de pills por grupo, activo bg `#7C5C4A` texto `#fff`, inactivo bg `#F7F5F2` texto `#78716C`
   - **Dinámico:** muestra todos los grupos existentes del evento
5. Stepper de invitados: `−` (bg `#E7E5E3`) + número (Playfair 28px 700) + `+` (bg `#7C5C4A` texto `#fff`). Mínimo: 1
6. CTA "Guardar invitado" / "Guardar cambios": full width, padding 17px, bg `#7C5C4A` (gris `#C8C3BC` si titular vacío)

---

### 05 · Tab Boletos

**Ruta:** `/i/[slug]/admin` (tab activo: Boletos)  
**Propósito:** Ver y generar boletos para invitados confirmados (conf = 'SI')

**Layout:** Similar a Lista. Header con "Boletos" + botón "⬇ Todos".

**Lista:** Solo invitados con `conf = 'SI'`. Cada fila:
- Avatar verde `#F0FDF4` / `#16A34A`
- Nombre + grupo + N asientos
- Botón ticket `36×36px` bg `#FEF3C7` icono `#D97706` → abre vista de boleto individual

**Estado vacío:** Icono + "Sin confirmaciones aún" + explicación

**Acción "⬇ Todos":** `GET /api/boletos` → descarga PDF con todos los boletos

---

### 06 · Vista Boleto Individual

**Trigger:** Botón ticket en Lista o en Tab Boletos  
**Tipo:** Screen completa (slide-up desde lista)

**Ticket card:** bg `#fff`, border-radius 20px, overflow hidden, sombra `0 4px 24px rgba(0,0,0,.08)`

Porción superior (bg `#7C5C4A`):
- Label "Boleto de entrada" — DM Sans 10px uppercase `rgba(255,255,255,.5)`
- "XV Años" — Playfair 28px 700 `#fff`
- Nombre del evento — Playfair 20px 600 `#C4956A`

Divisor perforado: `border-top: 2px dashed #F0EEEB` con semicírculos en los extremos `24×24px` bg `#F7F5F2`

Porción inferior:
- "Invitado" label + nombre (Playfair 17px 700)
- "Asientos" label + número (Playfair 32px 700 `#7C5C4A`)
- Fecha y hora
- QR code (`maps_url`) + nombre y dirección del venue

Acciones:
- "Descargar PDF" — bg `#7C5C4A`, blanco
- "Enviar por WhatsApp" — bg `#DCFCE7`, texto/icono `#16A34A`

**PDF generation:** `GET /api/boletos/[id]` usando `@react-pdf/renderer` en API Route. QR generado con librería `qrcode` desde `maps_url`.

---

### 07 · Invitación Digital (vista del invitado)

**Ruta:** `/i/[slug]/invitacion?token=[token]`  
**Propósito:** La invitación que recibe el invitado por WhatsApp. Flujo: verificar dispositivo → mostrar invitación → RSVP → agradecimiento.

**Layout:** Pantalla oscura. Fondo `#1C1917`. Scroll vertical.

**Contenido:**
1. Ornamento decorativo (líneas + estrella `#C4956A`)
2. "Te invitamos a los" — DM Sans 11px uppercase letter-spacing 3px `rgba(196,149,106,.6)`
3. "XV" — Playfair 56px 700 `#F0EBE5`
4. "años de" — mismo estilo que el label superior
5. Nombre — Playfair 40px 700 `#C4956A`
6. Saludo "Hola, [titular]" — DM Sans 13px, `rgba(240,235,229,.45)`, nombre en `#F0EBE5` 600
7. Card de detalles: bg `rgba(255,255,255,.05)` border `rgba(196,149,106,.12)` border-radius 18px
   - Fecha, hora, venue — cada uno con icono `#C4956A` y texto `#F0EBE5` 14px 500
8. CTA "Confirmar asistencia" — bg `#C4956A`, border-radius 16px, DM Sans 15px 700 blanco

**Verificación de dispositivo (antes de mostrar invitación):**
1. Buscar `device_id` en `localStorage`
2. `GET /api/verificar-dispositivo?token=&device_id=`
3. Si primer acceso → generar UUID, guardar en localStorage, `PUT /api/invitados` con `device_id`
4. Si `device_id` coincide → mostrar invitación
5. Si no coincide → pantalla de bloqueo con mensaje de contacto

---

### 08 · RSVP / Confirmación

**Trigger:** CTA "Confirmar asistencia" en invitación  
**Layout:** Pantalla clara `#F7F5F2`. Back arrow + "Confirmación"

**Elementos:**
1. Back arrow — circular `36×36px` bg `#fff` sombra `0 1px 4px rgba(0,0,0,.08)`
2. Pregunta "¿Asistirás, [titular]?" — DM Sans 14px `#78716C`
3. **Botones YES/NO** en grid `1fr 1fr` gap 12px, padding `22px 14px`, border-radius 20px:
   - YES inactivo: bg `#fff` border `2px solid #E7E5E3`; activo: bg `#16A34A` border `#16A34A` shadow `0 6px 24px rgba(22,163,74,.28)`
   - NO inactivo: bg `#fff` border `2px solid #E7E5E3`; activo: bg `#1C1917` border `#1C1917`
   - Icono `48×48px` circular + texto 15px 700 + subtexto 11px
4. Textarea mensaje (opcional): label uppercase + textarea bg `#fff` border `1.5px solid #E7E5E3` border-radius 14px. Max 200 chars.
5. CTA "Enviar confirmación": full width, padding 18px, border-radius 16px
   - Sin selección: bg `#D1CEC8` (deshabilitado)
   - Con selección: bg `#7C5C4A`

**Flujo de confirmación:**
```
POST /api/confirmar {token, confirmacion: 'SI'|'NO', mensaje?}
→ estado = 'confirmo'
→ confirmacion = 'SI'|'NO'
→ Si NO: num_invitados = 0
→ Si mensaje: guarda en mensaje_felicitacion
→ Abre wa.me hacia whatsapp_admin con resumen
→ Pantalla de agradecimiento
```

---

### 09 · Modal "Nuevo Grupo"

**Trigger:** Botón "+ Grupo" en header del Dashboard  
**Tipo:** Bottom sheet (mismo patrón que Agregar Invitado)

**Campos:**
1. Nombre del grupo — input text
2. Color del grupo — 6 swatches circulares `40×40px`, seleccionado tiene ring `box-shadow: 0 0 0 3px #fff, 0 0 0 5px [color]` + escala `1.15`
3. Preview en tiempo real: dot de color + nombre escrito
4. CTA "Crear grupo"

**Colores disponibles para grupos nuevos:**
`#8B6FB3` · `#B55B5B` · `#5B9AB5` · `#7BA673` · `#B5A05B` · `#A8627A`

---

## Interacciones y Animaciones

### Transiciones de pantalla

| Transición | Animación | Duración |
|---|---|---|
| Dashboard → Lista (tab) | slide-up (opacity + translateY 20px→0) | 240ms ease |
| Abrir modal/sheet | slide-up desde abajo (translateY 110%→0) | 260ms cubic-bezier(.32,1,.28,1) |
| Abrir overlay/dialog | fade-in | 150ms ease |
| Abrir boleto | slide-up | 260ms ease |
| Screens de invitado | slide-up (20px) | 280ms ease |
| Loading → Success | fade-in | 300ms ease |

### Animaciones de estado

| Elemento | Animación |
|---|---|
| Checkmark en RSVP | popIn: scale 0.6→1 con bounce — 450ms `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Spinner de loading | rotate 0→360° linear infinite, 800ms |
| Boletos YES/NO seleccionado | `transition: all 200ms ease` en bg + border + shadow |
| Barra de progreso | `transition: width 400ms ease` |
| Panel de acciones | `animation: fadeIn 180ms ease` |
| Color swatch grupo | `transition: all 150ms` en shadow + scale |

### Feedback de acciones

- **Confirmar / Dar de baja:** Dialog de confirmación con shadcn/ui `AlertDialog`. Botón destructivo en `#DC2626`.
- **Enviar WA:** Dialog "¿Se envió correctamente?" con [Sí / No]. Solo si Sí → actualiza estado a `enviado`.
- **Agregar invitado:** El nuevo invitado aparece al tope de la lista con un breve highlight (opcional: Sonner toast de éxito).
- **Desvincular dispositivo:** Sin dialog, acción inmediata. Toast de confirmación.

---

## Estado (State Management)

### Admin — Estado React

```typescript
interface AdminState {
  tab: 'dashboard' | 'lista' | 'boletos';
  filter: 'todos' | 'alta' | 'enviado' | 'confirmo' | 'baja';
  grupoFiltro: string | null;   // nombre del grupo seleccionado desde dashboard
  expandedId: string | null;    // solo una card expandida a la vez
  showAddModal: boolean;
  editingId: string | null;     // si es edición, pre-llena el modal
  showBoleto: boolean;
  boletoGuest: Invitado | null;
  showAddGrupo: boolean;
  // form state
  newTitular: string;
  newGrupo: string;
  newNumInv: number;
  newGrupoNombre: string;
  newGrupoColor: string;
}
```

**Toggle de card expandida:**
```typescript
const toggleExpand = (id: string) =>
  setExpandedId(prev => prev === id ? null : id);
```

**Cerrar panel al hacer scroll:** Usar `onScroll` en el contenedor de la lista → `setExpandedId(null)`.

### Invitado — Estado React

```typescript
type InvitadoScreen = 'invitation' | 'rsvp' | 'loading' | 'success';

interface InvitadoState {
  screen: InvitadoScreen;
  rsvpChoice: 'SI' | 'NO' | null;
  message: string;
}
```

---

## Supabase — Tablas relevantes

Ver documento completo del proyecto para el schema. Resumen de campos clave:

```sql
invitados: id, evento_id, grupo_id, titular, num_invitados,
           whatsapp, token (uuid), estado, confirmacion,
           fecha_envio, fecha_confirmacion, mensaje_felicitacion,
           device_id, created_at, updated_at

grupos_evento: id, evento_id, nombre, orden, created_at

eventos: id, slug, festejada, tiene_lista_invitados,
         pin_admin (bcrypt), whatsapp_admin, maps_url
```

**Realtime:** Suscribirse a cambios en `invitados` filtrado por `evento_id` para actualizar el dashboard cuando un invitado confirma desde su celular.

---

## Componentes shadcn/ui sugeridos

| Componente | Uso |
|---|---|
| `Sheet` | Modales Agregar/Editar Invitado y Nuevo Grupo (side="bottom") |
| `AlertDialog` | Confirmaciones destructivas (Dar de baja, Eliminar) |
| `Dialog` | Confirmación de asistencia manual, "¿Se envió WA?" |
| `Badge` | Estados de invitados |
| `Select` | Selector de grupo (alternativa a los pills cuando hay muchos grupos) |
| `Sonner` / `Toaster` | Feedback de acciones (invitado agregado, estado actualizado) |
| `Input` | Campos de formulario |
| `Textarea` | Mensaje de felicitación |

---

## Modo Oscuro

El módulo soporta modo oscuro completo. Usar `class="dark"` en `<html>` con Tailwind v4. Ver pantallas 06 y 07 en el canvas de diseño para los colores exactos de cada elemento en modo oscuro.

Los colores de estado (verde, azul, rojo) se usan en versiones más suaves en oscuro:
- `#16A34A` → `#4CAF70`
- `#2563EB` → `#6B9FD4`
- `#DC2626` → sin cambio

---

## Fases de implementación

Ver el documento `PROYECTO_LISTA_INVITADOS_v3.md` para el plan completo. Orden sugerido de referencia a los prototipos:

1. **Fase 1** (Auth/DB) → `Prototipo Admin.dc.html` pantalla de PIN
2. **Fase 2** (CRUD lista) → `Prototipo Admin.dc.html` tab Lista completo
3. **Fase 3** (Dashboard) → `Prototipo Admin.dc.html` tab Dashboard
4. **Fase 4** (WhatsApp) → flujo de envío en `Prototipo Admin.dc.html`
5. **Fase 5** (Invitación digital) → `Prototipo Invitado.dc.html`
6. **Fase 6** (Boletos PDF) → `Prototipo Admin.dc.html` tab Boletos + vista boleto

---

## Assets e iconos

- **Iconos:** Heroicons (stroke, 2px strokeWidth, round linecap) — ya disponibles en shadcn/ui
- **Fuentes:** Google Fonts — `Playfair Display` (400, 600, 700) + `DM Sans` (400, 500, 600, 700). Cargar en `layout.tsx`.
- **QR:** Librería `qrcode` — genera QR desde `maps_url` en el servidor al generar el PDF

---

*Handoff generado el 23 de junio de 2025 · invitaxv.lol*
