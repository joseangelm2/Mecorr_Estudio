# PROYECTO: MÓDULO LISTA DE INVITADOS
**Versión:** 3.0 — Documento definitivo para implementación  
**Stack:** Next.js 16 · TypeScript · Supabase (Postgres + RLS) · Tailwind CSS v4 · shadcn/ui · Vercel  
**Plataforma:** invitaxv.lol  
**Repositorio:** github.com/joseangelm2/Mecorr_Estudio

---

## 1. CONTEXTO Y ALCANCE

Este módulo es una **extensión opcional** que se activa por evento dentro del admin de invitaciones existente (`Mecorr_Estudio`). Un slug = un evento.

Cuando el admin activa "Manejar lista de invitados" al crear o editar una invitación, el sistema habilita:

- Portal de administración protegido por PIN en `/i/[slug]`
- CRUD de invitados agrupados por tipo de relación
- Envío de invitaciones personalizadas por WhatsApp (`wa.me`)
- Registro de confirmaciones de asistencia (dual: desde la invitación digital y desde el dashboard)
- Resguardo de mensajes de felicitación (se guardan en DB y se reenvían vía WhatsApp a la festejada)
- Generación de boletos PDF con QR para invitados confirmados

**Diseño mobile-first** en todas las vistas.

---

## 2. MODELO DE DATOS

### 2.1 Tabla: `eventos`

Extiende la relación con los proyectos de invitación existentes. Si la tabla ya existe en el proyecto, se agregan los campos nuevos marcados con `*`.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `slug` | text | UNIQUE · Identificador del evento en la URL |
| `festejada` | text | Nombre de la festejada |
| `tiene_lista_invitados` * | boolean | DEFAULT false · Activa el módulo |
| `pin_admin` * | text | Hash bcrypt del PIN de 4 dígitos |
| `whatsapp_admin` | text | Número WhatsApp de la festejada/admin para notificaciones (+52...) |
| `maps_url` | text | URL de Google Maps de la recepción (se usa en QR del boleto) |
| `created_at` | timestamptz | DEFAULT now() |

---

### 2.2 Tabla: `grupos_evento` (nueva)

Permite grupos personalizados por evento. Se pre-cargan 3 por defecto al activar el módulo.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `evento_id` | uuid | FK → `eventos` · ON DELETE CASCADE |
| `nombre` | text | Nombre del grupo (ej. "Familia", "Amigos", "Trabajo") |
| `orden` | integer | Para ordenar en el dashboard y los filtros |
| `created_at` | timestamptz | DEFAULT now() |

**Constraint:** UNIQUE(`evento_id`, `nombre`)

**Valores por defecto** al activar el módulo: `Familia` (orden 1), `Amigos` (orden 2), `Trabajo` (orden 3).

---

### 2.3 Tabla: `invitados` (nueva)

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `evento_id` | uuid | FK → `eventos` · ON DELETE CASCADE |
| `grupo_id` | uuid | FK → `grupos_evento` · ON DELETE RESTRICT |
| `titular` | text | NOT NULL · Persona o familia ("Juan Pérez" o "Familia García") |
| `num_invitados` | integer | DEFAULT 1 · Lo define la festejada/admin · Incluye al titular |
| `whatsapp` | text | Número con código de país (+52...) |
| `token` | uuid | UNIQUE · DEFAULT gen_random_uuid() · Para URL personalizada |
| `estado` | text | DEFAULT 'alta' · Valores: `alta`, `enviado`, `confirmo`, `baja` |
| `confirmacion` | text | NULL · Valores: `SI`, `NO`, null (pendiente) |
| `fecha_envio` | timestamptz | NULL hasta que el admin confirme el envío |
| `fecha_confirmacion` | timestamptz | NULL hasta que confirme |
| `mensaje_felicitacion` | text | NULL · Texto libre del invitado |
| `device_id` | uuid | NULL · Se registra al abrir la invitación por primera vez. Vincula el token a un dispositivo |
| `created_at` | timestamptz | DEFAULT now() |
| `updated_at` | timestamptz | DEFAULT now() · Se actualiza con trigger |

**Índices:** `evento_id`, `token` (unique), `estado`, `grupo_id`

---

### 2.4 Diagrama de relaciones

```
eventos (1) ──── (N) grupos_evento
eventos (1) ──── (N) invitados
grupos_evento (1) ──── (N) invitados
```

---

## 3. MÁQUINA DE ESTADOS DEL INVITADO

```
                    ┌──────────┐
                    │   ALTA   │ ← Estado inicial al crear
                    └────┬─────┘
                         │
                    [Admin envía WhatsApp
                     y confirma en dashboard]
                         │
                    ┌────▼─────┐
              ┌─────│ ENVIADO  │─────┐
              │     └────┬─────┘     │
              │          │           │
         [Admin da    [Invitado     [Admin da
          de baja]    confirma]      de baja]
              │          │           │
              │     ┌────▼─────┐    │
              │     │ CONFIRMO │    │
              │     └──────────┘    │
              │                     │
              ▼                     ▼
         ┌─────────┐          ┌─────────┐
         │  BAJA   │          │  BAJA   │
         └─────────┘          └─────────┘
```

**Reglas de transición:**

| Desde | Hacia | Quién | Acción |
|---|---|---|---|
| `alta` | `enviado` | Admin | Envía WhatsApp → confirma envío en dashboard |
| `alta` | `baja` | Admin | Botón "Dar de baja" |
| `enviado` | `confirmo` | Invitado o Admin | Invitado desde la invitación digital, o admin manual |
| `enviado` | `baja` | Admin | Botón "Dar de baja" |
| `baja` | `alta` | Admin | Botón "Reactivar" |

**Reglas de eliminación:** Solo se puede eliminar un invitado si `estado = 'alta'` (nunca se ha enviado ni confirmado).

**Regla de confirmación:** `num_invitados` lo define la festejada/admin al crear el invitado y no se modifica durante la confirmación. Al confirmar con `NO`, `num_invitados` se pone en 0 (no asiste nadie de ese grupo).

---

## 4. ESTRUCTURA DE RUTAS (Next.js App Router)

```
src/app/i/[slug]/
├── page.tsx                    ← Login con PIN (pantalla de acceso)
├── admin/
│   ├── page.tsx                ← Dashboard + Lista de invitados
│   └── boletos/
│       ├── route.ts            ← API route: genera PDF de todos los boletos
│       └── [id]/
│           └── route.ts        ← API route: genera PDF de boleto individual
├── invitacion/
│   └── page.tsx                ← Invitación digital (ya existe, se extiende)
└── api/
    ├── invitados/
    │   ├── route.ts            ← GET (listar) · POST (crear)
    │   └── [id]/
    │       └── route.ts        ← PUT (editar/cambiar estado) · DELETE (eliminar)
    ├── confirmar/
    │   └── route.ts            ← POST: el invitado confirma desde su celular
    ├── verificar-dispositivo/
    │   └── route.ts            ← GET: valida device_id del invitado contra la DB
    ├── felicitacion/
    │   └── route.ts            ← POST: el invitado envía mensaje
    ├── auth/
    │   └── route.ts            ← POST: valida PIN
    ├── grupos/
        ├── route.ts            ← GET (listar) · POST (crear)
        └── [id]/
            └── route.ts        ← PUT · DELETE
    ├── exportar/
    │   └── route.ts            ← GET: descarga CSV/Excel de invitados
    └── importar/
        └── route.ts            ← POST: carga masiva desde CSV/Excel
```

---

## 5. FLUJO DE CREACIÓN DEL MÓDULO

1. Admin abre el panel de invitaciones existente.
2. Al crear o editar una invitación, activa el toggle **"Manejar lista de invitados"**.
3. El sistema:
   - Marca `tiene_lista_invitados = true` en la tabla `eventos`
   - Solicita al admin: PIN de 4 dígitos
   - Toma `whatsapp_admin` y `maps_url` del evento existente (ya capturados previamente)
   - Crea los 3 grupos por defecto en `grupos_evento`
   - Habilita en la invitación digital la personalización con el nombre del titular

---

## 6. FLUJOS DE OPERACIÓN

### 6.1 Acceso al portal admin

```
invitaxv.lol/i/[slug]
→ Pantalla con input de PIN (4 dígitos)
→ POST /api/auth → valida bcrypt(pin) vs pin_admin
→ Si válido → redirige a /admin
→ Si inválido → muestra error
```

Se solicita el PIN **cada vez** que se accede. No hay sesión persistente (ni cookie, ni localStorage).

**Nota de implementación:** Sin sesión, cada request a las API routes del admin necesita incluir el PIN o un token temporal de corta duración para evitar que se pida en cada acción. Opciones: (a) token JWT efímero de 30 min que se guarda en memoria de React, o (b) revalidar PIN en cada operación sensible.

---

### 6.2 Agregar invitado

```
Admin presiona [+ Agregar]
→ Modal con formulario:
    - Titular (texto libre)
    - Grupo (select con grupos del evento)
    - Número de invitados (numérico, min 1)
    - WhatsApp (con formato +52...)
→ POST /api/invitados
→ Se crea con estado='alta', se genera token automático
→ Se actualiza la lista en pantalla
```

---

### 6.3 Envío de invitación por WhatsApp

```
Admin presiona [Enviar] en la fila del invitado
→ Se construye URL de WhatsApp:
    wa.me/[whatsapp]?text=[mensaje_codificado]
→ El mensaje incluye:
    "¡Hola [titular]! Estás invitado/a a la fiesta de [festejada]. 
     Confirma tu asistencia aquí: 
     https://invitaxv.lol/i/[slug]?token=[token]"
→ Se abre en nueva pestaña (móvil abre WhatsApp directo)
→ Al regresar, se muestra diálogo: "¿Se envió correctamente?"
    [Sí] → PUT /api/invitados/[id] → estado='enviado', fecha_envio=now()
    [No] → No cambia nada
```

---

### 6.4 Apertura de la invitación digital (vinculación de dispositivo)

```
Invitado abre: invitaxv.lol/i/[slug]?token=[token]

PASO 1 — Verificar dispositivo:
→ El navegador busca device_id en localStorage
→ GET /api/verificar-dispositivo?token=[token]&device_id=[device_id|null]

  Caso A: device_id del invitado es NULL en DB (primera vez)
    → Se genera un UUID como device_id
    → Se guarda en localStorage del navegador
    → PUT /api/invitados → device_id = [uuid generado]
    → ✅ Acceso permitido

  Caso B: device_id del navegador coincide con el de la DB
    → ✅ Acceso permitido (mismo dispositivo)

  Caso C: device_id del navegador NO coincide o no existe en localStorage
    → ❌ Acceso bloqueado
    → Se muestra mensaje:
       "Esta invitación ya fue abierta en otro dispositivo.
        Si necesitas acceso, contacta a [festejada]."
    → No se muestra la invitación ni el formulario de confirmación

PASO 2 — Si acceso permitido:
→ Se muestra la invitación digital con nombre del titular
```

---

### 6.5 Confirmación de asistencia (desde la invitación digital)

```
(Requiere acceso permitido en paso 6.4)
→ Sección de confirmación:
    - "¿Asistirás?" → [Sí] / [No]
    - Campo opcional: "Deja un mensaje de felicitación"
→ POST /api/confirmar
    → Actualiza: estado='confirmo', confirmacion='SI'|'NO',
      fecha_confirmacion=now()
    → Si confirmacion='NO' → num_invitados=0
    → Si hay mensaje → guarda en mensaje_felicitacion
→ Se abre wa.me hacia el whatsapp_admin con mensaje:
    "[titular] confirmó [SI/NO] para [festejada]."
    (y si hay mensaje de felicitación, se incluye)
→ Pantalla de agradecimiento
```

---

### 6.6 Desvinculación de dispositivo (desde el dashboard)

```
Si el invitado cambia de celular o borra su caché,
el admin puede desvincular el dispositivo para que
el invitado pueda abrir la invitación en otro equipo.

Admin presiona [🔓 Desvincular] en la fila del invitado
→ PUT /api/invitados/[id] → device_id = NULL
→ La próxima vez que el invitado abra el link,
   se vinculará al nuevo dispositivo automáticamente
```

---

### 6.7 Confirmación manual (desde el dashboard)

```
Admin presiona [Confirmar] en la fila del invitado
→ Modal:
    - "¿Asistirá?" → [Sí] / [No]
→ PUT /api/invitados/[id]
    → estado='confirmo', confirmacion, fecha_confirmacion
    → Si confirmacion='NO' → num_invitados=0
→ Se actualiza dashboard en tiempo real
```

---

### 6.8 Generación y envío de boletos PDF

#### Generación masiva
```
Admin presiona [Generar boletos]
→ GET /api/boletos (o route handler)
→ Filtra invitados con confirmacion='SI'
→ Genera PDF con un boleto por invitado:
    ┌─────────────────────────────┐
    │      🎉 BOLETO DE ENTRADA  │
    │                             │
    │  Evento: [festejada]        │
    │  Invitado: [titular]        │
    │  Asientos: [num_invitados]  │
    │                             │
    │     ┌─────────┐             │
    │     │  QR     │             │
    │     │ (maps)  │             │
    │     └─────────┘             │
    │                             │
    │  Ubicación de la recepción  │
    └─────────────────────────────┘
→ Se descarga en el navegador del admin (PDF con todos los boletos)
```

#### Envío individual por fila
```
En la lista de invitados, cada fila con confirmacion='SI'
muestra botón [🎫 Enviar boleto]

Admin presiona [🎫 Enviar boleto]
→ GET /api/boletos/[id] → genera PDF individual para ese invitado
→ Se descarga el PDF en el navegador
→ Se abre wa.me/[whatsapp]?text=[mensaje_codificado]
    "¡Hola [titular]! Aquí tienes tu boleto de entrada
     para la fiesta de [festejada]. ¡Te esperamos! 🎉"
→ Admin adjunta manualmente el PDF descargado en el chat de WhatsApp
```

---

### 6.9 Importación y exportación de invitados

#### Exportación (CSV / Excel)
```
Admin presiona [⬇ Exportar]
→ GET /api/exportar?formato=csv (o xlsx)
→ Se genera archivo con columnas:
    Titular | Grupo | Num. Invitados | WhatsApp | Estado | Confirmación | Fecha Envío | Fecha Confirmación
→ Se descarga en el navegador del admin
```

#### Importación (CSV / Excel)
```
Admin presiona [⬆ Importar]
→ Se abre selector de archivo (.csv o .xlsx)
→ El archivo debe tener al menos las columnas:
    Titular | Grupo | Num. Invitados | WhatsApp
→ POST /api/importar con el archivo
→ El sistema:
    1. Valida formato y columnas requeridas
    2. Si el grupo no existe en el evento, lo crea automáticamente
    3. Muestra vista previa con resumen:
       "[N] invitados a importar, [M] grupos nuevos"
    4. Admin confirma → se insertan con estado='alta'
    5. Si hay errores (filas sin titular, WhatsApp inválido),
       se muestran las filas con error y se importan solo las válidas
→ Se actualiza la lista en pantalla
```

**Formato de plantilla:** El botón [⬇ Exportar] con la lista vacía genera una plantilla CSV vacía con los headers correctos para facilitar la importación.

---

## 7. INTERFAZ — DISEÑO MOBILE-FIRST

### 7.1 Pantalla de Login (PIN)

```
┌──────────────────────┐
│                      │
│    🎉 [festejada]    │
│                      │
│   Ingresa tu PIN     │
│   ┌──┐┌──┐┌──┐┌──┐  │
│   │  ││  ││  ││  │  │
│   └──┘└──┘└──┘└──┘  │
│                      │
│   [ Acceder ]        │
│                      │
└──────────────────────┘
```

---

### 7.2 Dashboard (Admin)

```
┌──────────────────────┐
│ Dashboard  [+ Grupo] │
│──────────────────────│
│ ┌──────────────────┐ │
│ │ FAMILIA          │ │
│ │ Enviados: 8/12   │ │
│ │ ████████░░░  67% │ │
│ │ Confirmados: 6/8 │ │
│ │ ██████░░░░░  75% │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ AMIGOS           │ │
│ │ Enviados: 5/10   │ │
│ │ █████░░░░░░  50% │ │
│ │ Confirmados: 3/5 │ │
│ │ ███░░░░░░░░  60% │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ TOTALES          │ │
│ │ Invitados: 45    │ │
│ │ Asistentes: 32   │ │
│ └──────────────────┘ │
│──────────────────────│
│ Lista | Boletos      │
│──────────────────────│
│ [+ Agregar invitado] │
│ [⬆ Importar][⬇ Exportar] │
│ Filtro: [Todos ▾]    │
│──────────────────────│
│ ┌──────────────────┐ │
│ │ Juan Pérez       │ │
│ │ Familia · 4 inv  │ │
│ │ ● Enviado        │ │
│ │ [✓][✎][↗][🔓][🗑] │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ Fam. García      │ │
│ │ Amigos · 6 inv   │ │
│ │ ○ Alta           │ │
│ │ [✎][↗][⬇][🗑]   │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ María López      │ │
│ │ Familia · 3 inv  │ │
│ │ ✔ Confirmó: SI   │ │
│ │ [✎][🎫][🔓]      │ │
│ └──────────────────┘ │
└──────────────────────┘

Iconos de acción:
✓ = Confirmar  ✎ = Editar  ↗ = Enviar WA
⬇ = Dar de baja  🗑 = Eliminar
🎫 = Enviar boleto (solo si confirmacion='SI')
🔓 = Desvincular dispositivo (solo si device_id existe)
```

**Nota:** Las tarjetas de totales deben sumar `num_invitados` de cada fila, no contar filas. "Invitados" = total de personas, "Asistentes" = sum(num_invitados) donde confirmacion = 'SI'.

La definicion con Prototipos y definicion de diseño esta en @HANDOFF_MODULO_LISTA_INVITADOS.md

---

## 8. VALIDACIONES Y REGLAS DE NEGOCIO

| Regla | Descripción |
|---|---|
| PIN | Exactamente 4 dígitos numéricos |
| WhatsApp | Formato E.164: `+` seguido de 10-15 dígitos |
| `num_invitados` | Mínimo 1. Lo define la festejada/admin al crear. Se pone en 0 solo si confirma NO |
| Eliminar invitado | Solo si `estado = 'alta'` |
| Dar de baja | Desde `alta` o `enviado`. Nunca desde `confirmo` |
| Reactivar | Solo desde `baja` → regresa a `alta` |
| Enviar | Solo si `estado = 'alta'` y tiene número WhatsApp |
| Confirmar | Solo si `estado = 'enviado'` |
| Generar boletos | Solo invitados con `confirmacion = 'SI'` |
| Enviar boleto individual | Solo si `confirmacion = 'SI'` y tiene número WhatsApp |
| Token | Inmutable. Se genera al crear el invitado, no se cambia |
| Dispositivo | La invitación se vincula al primer dispositivo que la abre. Si `device_id` ya existe y no coincide, se bloquea el acceso |
| Desvincular | Solo el admin desde el dashboard. Pone `device_id = NULL` para permitir acceso desde otro dispositivo |
| Grupo | No se puede eliminar un grupo si tiene invitados asociados |
| Importar | Requiere al menos columnas: Titular, Grupo, Num. Invitados, WhatsApp. Filas con error se reportan pero no bloquean la importación |
| Exportar | Exporta todos los invitados del evento con sus datos actuales |

---

## 9. DECISIONES TÉCNICAS

| Área | Decisión | Justificación |
|---|---|---|
| Rutas | Next.js App Router: `/i/[slug]/...` | Consistente con estructura existente |
| Auth admin | PIN 4 dígitos, bcrypt en Supabase, sin sesión persistente | Simplicidad para usuario no técnico |
| Auth temporal | Token JWT efímero en memoria React (30 min) | Evita pedir PIN en cada acción dentro del portal |
| Base de datos | Supabase Postgres con RLS por `evento_id` | Aislamiento de datos entre eventos |
| PDF | `@react-pdf/renderer` en API route de Next.js | Genera en servidor, no requiere puppeteer |
| QR en boleto | Librería `qrcode` para generar QR de `maps_url` | Ligera, sin dependencias externas |
| WhatsApp | Links `wa.me` manuales | Sin costo, sin API key, funciona en móvil directo |
| Tiempo real | Supabase Realtime en tabla `invitados` | Dashboard se actualiza cuando invitado confirma desde su celular |
| Mobile-first | Tailwind CSS v4 con diseño base en 380px | Stack cards, tablas responsivas con cards en móvil |
| Componentes UI | shadcn/ui (Dialog, Table, Badge, Button, Input) | Ya integrados en el proyecto |
| Ambientes | 2 proyectos Supabase (test + prod), Vercel inyecta vars por rama | PRs usan test, merge a main usa prod |
| Seguridad invitación | Vinculación por `device_id` en localStorage + DB | Evita que links reenviados se abran en otro dispositivo |

---

## 10. ESTRATEGIA DE AMBIENTES (TEST / PRODUCCIÓN)

Se manejan **2 proyectos de Supabase** independientes con el mismo schema, y Vercel inyecta las variables según la rama.

### 10.1 Proyectos Supabase

| Ambiente | Proyecto Supabase | Uso |
|---|---|---|
| **Test / Staging** | `mecorr-test` | Desarrollo local, PRs, preview deploys en Vercel |
| **Producción** | `mecorr-prod` | Rama `main` en Vercel, dominio `invitaxv.lol` |

Ambos proyectos tienen las mismas tablas, migraciones y RLS policies. Se sincronizan usando `supabase db push` o el CLI de migraciones.

### 10.2 Variables de entorno

```env
# Test (para .env.local y Vercel Preview)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx-test.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...test
SUPABASE_SERVICE_ROLE_KEY=eyJ...test

# Producción (solo en Vercel Environment: Production)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx-prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...prod
SUPABASE_SERVICE_ROLE_KEY=eyJ...prod
```

### 10.3 Configuración en Vercel

En **Settings → Environment Variables** del proyecto Vercel, cada variable se configura así:

| Variable | Production | Preview | Development |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://...prod.supabase.co` | `https://...test.supabase.co` | `https://...test.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | key de prod | key de test | key de test |
| `SUPABASE_SERVICE_ROLE_KEY` | key de prod | key de test | key de test |

Vercel asigna automáticamente el ambiente según la rama:

- **PR / rama feature** → Preview → usa Supabase **test**
- **Merge a `main`** → Production → usa Supabase **producción**

### 10.4 Flujo de trabajo con branches

```
feature/lista-invitados  ──PR──▶  main
        │                           │
        ▼                           ▼
   Vercel Preview              Vercel Production
   Supabase TEST               Supabase PROD
   URL: xxx.vercel.app         URL: invitaxv.lol
```

1. Desarrollador trabaja en rama `feature/lista-invitados`
2. Push → Vercel genera **Preview deploy** apuntando a Supabase test
3. Se prueba el flujo completo con datos de prueba
4. Se crea **PR hacia `main`**
5. Revisión de código + pruebas en el preview deploy
6. Merge → Vercel despliega a **producción** apuntando a Supabase prod

### 10.5 Migraciones de base de datos

Las migraciones viven en `supabase/migrations/` dentro del repo. El flujo para mantener ambos ambientes sincronizados:

```bash
# 1. Crear migración en local (apuntando a test)
supabase migration new crear_tabla_invitados

# 2. Editar el archivo SQL generado en supabase/migrations/

# 3. Aplicar en test
supabase db push --linked    # o supabase db reset en local

# 4. Probar en preview deploy de Vercel

# 5. Al hacer merge a main, aplicar en producción
supabase db push --linked --project-ref [prod-ref]
```

**Regla:** Nunca modificar datos de producción directamente. Las migraciones son la única vía para cambios de schema en prod.

### 10.6 Datos de prueba

El proyecto test incluirá un seed con datos de ejemplo:

```sql
-- supabase/seed.sql (solo se ejecuta en test)
INSERT INTO eventos (slug, festejada, tiene_lista_invitados, pin_admin, ...)
VALUES ('demo-xv', 'Sofía', true, '$2a$10$...hash_de_1234', ...);

INSERT INTO grupos_evento (evento_id, nombre, orden) VALUES
  (..., 'Familia', 1),
  (..., 'Amigos', 2),
  (..., 'Trabajo', 3);

INSERT INTO invitados (evento_id, grupo_id, titular, num_invitados, ...) VALUES
  (..., ..., 'Juan Pérez', 4, ...),
  (..., ..., 'Familia García', 6, ...);
```

---

## 11. FASES DE IMPLEMENTACIÓN

### Fase 1 — Base de datos, ambientes y auth (2-3 días)
- Crear proyecto Supabase de test y configurar variables en Vercel (Preview vs Production)
- Crear migraciones Supabase: tablas `grupos_evento`, `invitados`, campos nuevos en `eventos`
- Crear seed de datos de prueba para el proyecto test
- Configurar RLS policies por `evento_id`
- Implementar API route de auth (validación de PIN con bcrypt)
- Pantalla de login con PIN

### Fase 2 — CRUD de invitados (3-4 días)
- API routes: listar, crear, editar, eliminar, cambiar estado
- CRUD de grupos (crear, editar, eliminar con validación)
- Exportación a CSV/Excel (generación de archivo + plantilla vacía)
- Importación desde CSV/Excel (parseo, validación, vista previa, creación de grupos faltantes)
- UI del listado mobile-first con cards
- Modales de agregar/editar invitado
- Filtros por grupo y estado

### Fase 3 — Dashboard (2-3 días)
- Queries de agregación por grupo (enviados, confirmados, totales)
- Tarjetas con barras de progreso por grupo
- Tarjeta de totales generales (sum de `num_invitados`)
- Suscripción a Supabase Realtime para actualización automática

### Fase 4 — Envío por WhatsApp (1-2 días)
- Construcción del link `wa.me` con mensaje pre-armado y token del invitado
- Flujo de confirmación de envío (diálogo post-envío)
- Actualización de estado a `enviado`

### Fase 5 — Confirmación desde invitación digital (2-3 días)
- Detección de `?token=` en la URL de la invitación existente
- Vinculación de dispositivo: generar `device_id`, guardar en localStorage y en DB
- Verificación de dispositivo en cada apertura (bloqueo si no coincide)
- Pantalla de acceso bloqueado con mensaje de contacto
- Botón `[🔓 Desvincular]` en el dashboard para el admin
- Mostrar nombre del titular en la invitación
- Formulario de confirmación (SI/NO + mensaje opcional)
- API route de confirmación
- Generación de link `wa.me` hacia `whatsapp_admin` con notificación

### Fase 6 — Boletos PDF (2-3 días)
- Diseño del boleto con `@react-pdf/renderer`
- Generación de QR con `maps_url`
- API route masiva: filtra confirmados y genera PDF con todos los boletos
- API route individual: genera PDF de un solo invitado por `id`
- Botón `[🎫 Enviar boleto]` en cada fila con `confirmacion='SI'` → descarga PDF + abre `wa.me`
- Descarga masiva en navegador del admin

### Fase 7 — Integración y QA (2-3 días)
- Toggle en el admin de invitaciones existente
- Pruebas de flujo completo en Preview deploy (Supabase test): crear evento → agregar invitados → enviar → confirmar → boletos
- Validar que el PR apunta a Supabase test y producción a Supabase prod
- Aplicar migraciones en Supabase producción antes del merge
- Pruebas mobile en dispositivos reales
- Ajustes de UX

**Estimación total: 14-21 días de desarrollo**

---

## 12. DEPENDENCIAS NPM NUEVAS

| Paquete | Uso | Tamaño aprox. |
|---|---|---|
| `bcryptjs` | Hash y validación del PIN | ~25 KB |
| `@react-pdf/renderer` | Generación de boletos PDF | ~500 KB |
| `qrcode` | Generación de QR para Google Maps | ~100 KB |
| `jsonwebtoken` | Token efímero para sesión admin | ~30 KB |
| `papaparse` | Parseo de archivos CSV (importación/exportación) | ~25 KB |
| `xlsx` | Lectura/escritura de archivos Excel (importación/exportación) | ~300 KB |

Las demás dependencias (`shadcn/ui`, `tailwind`, `supabase-js`) ya están en el proyecto.

---

## 13. MANUAL DE USUARIO PARA LA FESTEJADA

Se entrega un manual visual independiente en formato HTML (`MANUAL_USUARIO_LISTA_INVITADOS.html`) diseñado para verse en celular. Incluye:

- 10 pasos con mockups de pantalla simulando la app real
- Lenguaje simple, sin términos técnicos
- Tips y advertencias destacados visualmente
- Cubre: acceso con PIN, agregar invitados, importar desde Excel, enviar por WhatsApp, revisar confirmaciones, generar boletos, exportar lista, desvincular dispositivos y dar de baja

**Formato:** HTML responsive mobile-first, se puede enviar por WhatsApp como link o alojar en cualquier servidor estático.

---

## 14. CONSIDERACIONES FUTURAS (fuera de alcance v1)

- Migrar a WhatsApp Cloud API para envío automático y tracking de entrega
- Envío masivo de invitaciones (batch)
- Múltiples festejadas por evento
- Galería de mensajes de felicitación visible en la invitación digital
- Notificaciones push al admin cuando alguien confirma
