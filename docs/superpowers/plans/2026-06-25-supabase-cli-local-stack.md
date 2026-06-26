# Supabase CLI + Stack Local + Link a Producción — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Instalar Supabase CLI, inicializar el stack local completo con Docker y enlazarlo al proyecto de producción `avnihxwxurhchgdkqmyn`.

**Architecture:** Supabase CLI se instala como devDependency. `supabase init` crea `supabase/config.toml` en el directorio existente (que ya tiene 6 migraciones y seed.sql). `supabase start` levanta el stack local vía Docker. `supabase link` conecta el CLI a producción para gestión de migraciones.

**Tech Stack:** Supabase CLI (npm), Docker Desktop (WSL2 integration), Next.js 16, PostgreSQL 15

---

## Prerequisito manual (el usuario lo hace ANTES del Task 5)

> ⚠️ Docker Desktop ya está instalado en Windows, pero la integración WSL2 debe activarse manualmente.
>
> **Docker Desktop → Settings → Resources → WSL Integration → activar la distro activa (ej. Ubuntu) → Apply & Restart**
>
> Verifica que funcionó: `docker --version` debe responder en la terminal WSL2.

---

## Archivos afectados

| Archivo | Acción |
|---|---|
| `package.json` | Modificar — añadir devDependency supabase y scripts `supabase:*` |
| `supabase/config.toml` | Crear — generado por `supabase init` |
| `.env.local` | Modificar — añadir bloque comentado con URLs locales |

---

## Task 1: Instalar Supabase CLI

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Instalar supabase como devDependency**

```bash
cd /home/jamermx/goldrose
npm install --save-dev supabase
```

- [ ] **Step 2: Verificar instalación**

```bash
npx supabase --version
```

Salida esperada: algo como `2.x.x` (versión actual del CLI)

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add supabase CLI as devDependency"
```

---

## Task 2: Inicializar config.toml

**Files:**
- Create: `supabase/config.toml`

- [ ] **Step 1: Ejecutar supabase init**

El directorio `supabase/` ya existe con las migraciones. `init` solo añade `config.toml`.

```bash
npx supabase init
```

Cuando pregunte por el nombre del proyecto, usa `goldrose`.  
Si no pregunta, el archivo se crea automáticamente.

- [ ] **Step 2: Verificar que config.toml fue creado**

```bash
ls supabase/config.toml
```

Debe existir el archivo.

- [ ] **Step 3: Verificar valores clave en config.toml**

```bash
grep -E "project_id|port" supabase/config.toml
```

Salida esperada (puertos estándar de Supabase):
```
project_id = "goldrose"
port = 54321   # api
port = 54322   # db
port = 54323   # studio
```

Si `project_id` dice algo distinto a `goldrose`, edítalo:

```bash
# Editar manualmente supabase/config.toml línea 2:
# project_id = "goldrose"
```

- [ ] **Step 4: Commit**

```bash
git add supabase/config.toml
git commit -m "chore: initialize supabase config.toml for local dev"
```

---

## Task 3: Añadir scripts npm

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Editar scripts en package.json**

Añadir estos scripts dentro del bloque `"scripts"` de `package.json`:

```json
"supabase:start": "supabase start",
"supabase:stop": "supabase stop",
"supabase:reset": "supabase db reset",
"supabase:push": "supabase db push",
"supabase:types": "supabase gen types typescript --local > src/types/database.ts"
```

El bloque `scripts` completo debe quedar así:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "typecheck": "tsc --noEmit",
  "check": "npm run lint && npm run typecheck && npm run build",
  "supabase:start": "supabase start",
  "supabase:stop": "supabase stop",
  "supabase:reset": "supabase db reset",
  "supabase:push": "supabase db push",
  "supabase:types": "supabase gen types typescript --local > src/types/database.ts"
}
```

- [ ] **Step 2: Verificar que el JSON es válido**

```bash
node -e "require('./package.json'); console.log('JSON válido')"
```

Salida esperada: `JSON válido`

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: add supabase npm scripts for local dev workflow"
```

---

## Task 4: Actualizar .env.local con bloque para dev local

**Files:**
- Modify: `.env.local`

> Nota: `.env.local` está en `.gitignore` — este cambio es solo local, no se commitea.

- [ ] **Step 1: Añadir bloque comentado al inicio de .env.local**

El archivo actualmente empieza con:
```
# Supabase — obtén estos valores de https://supabase.com/dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://avnihxwxurhchgdkqmyn.supabase.co
...
```

Añadir al inicio del archivo (antes de la sección de producción):

```bash
# =============================================================================
# DESARROLLO LOCAL — descomentar al usar `npm run supabase:start`
# Las keys locales las imprime `supabase start` en la terminal
# =============================================================================
# NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<pegar anon key que imprime supabase start>
# SUPABASE_SERVICE_ROLE_KEY=<pegar service_role key que imprime supabase start>

# =============================================================================
# PRODUCCIÓN — activo por defecto
# =============================================================================
```

- [ ] **Step 2: Verificar que las vars de producción siguen intactas**

```bash
grep "NEXT_PUBLIC_SUPABASE_URL" .env.local
```

Debe mostrar:
```
# NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_URL=https://avnihxwxurhchgdkqmyn.supabase.co
```

---

## Task 5: Levantar el stack local (requiere Docker WSL2 activo)

> ⚠️ **PREREQUISITO**: Asegúrate de haber completado el paso manual de Docker Desktop antes de este task.

**Files:** ninguno (solo Docker)

- [ ] **Step 1: Verificar Docker disponible en WSL2**

```bash
docker --version
```

Salida esperada: `Docker version 2x.x.x, build ...`  
Si dice "command not found": vuelve al prerequisito manual.

- [ ] **Step 2: Arrancar el stack local**

```bash
npm run supabase:start
```

La primera vez descarga ~2 GB de imágenes Docker. Puede tardar 5-10 minutos.  
Salida esperada al finalizar:

```
Started supabase local development setup.

         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
  S3 Storage URL: http://localhost:54321/storage/v1/s3
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGci...
service_role key: eyJhbGci...
```

- [ ] **Step 3: Copiar las keys locales a .env.local**

Del output anterior, copiar los valores de `anon key` y `service_role key`.  
Pegar en los comentarios del bloque local en `.env.local`:

```
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (el que imprimió supabase start)
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...     (el que imprimió supabase start)
```

> Estos valores son siempre iguales en cada máquina local — son generados a partir del JWT secret fijo del config. No son secretos, pero están comentados para no confundirse con producción.

- [ ] **Step 4: Verificar Studio**

Abrir en el navegador: `http://localhost:54323`  
Debe cargar Supabase Studio local.

---

## Task 6: Enlazar CLI a producción

**Files:** ninguno (configuración del CLI)

- [ ] **Step 1: Ejecutar supabase link**

```bash
npx supabase link --project-ref avnihxwxurhchgdkqmyn
```

Pedirá el **database password** de producción.  
Para obtenerlo: **Supabase Dashboard → Project `avnihxwxurhchgdkqmyn` → Settings → Database → Database password**

- [ ] **Step 2: Verificar link exitoso**

```bash
npx supabase status
```

Salida esperada: muestra el proyecto enlazado y el estado de los servicios locales.

- [ ] **Step 3: Verificar que el CLI puede ver producción**

```bash
npx supabase db remote changes
```

Salida esperada: lista las diferencias entre migraciones locales y la BD de producción (probablemente vacío si ya están sincronizadas).

---

## Task 7: Aplicar migraciones y seed en local

**Files:** ninguno

- [ ] **Step 1: Correr db reset para aplicar las 6 migraciones + seed**

```bash
npm run supabase:reset
```

Esto aplica todas las migraciones de `supabase/migrations/` en orden y ejecuta `supabase/seed.sql`.

Salida esperada:
```
Resetting local database...
Initializing schema...
Applying migration 0001_create_projects.sql...
Applying migration 0002_add_confirmation_fields.sql...
Applying migration 0003_add_show_itinerary.sql...
Applying migration 0004_add_lista_invitados_to_projects.sql...
Applying migration 0005_create_grupos_evento.sql...
Applying migration 0006_create_invitados.sql...
Seeding data supabase/seed.sql...
Finished supabase db reset.
```

- [ ] **Step 2: Verificar datos de prueba en Studio**

Abrir `http://localhost:54323` → Table Editor → tabla `projects`.  
Debe aparecer el proyecto `demo-xv` insertado por `seed.sql`.

---

## Task 8: Verificar flujo completo

**Files:** ninguno

- [ ] **Step 1: Generar tipos TypeScript desde el schema local**

```bash
npm run supabase:types
```

Verifica que se creó o actualizó `src/types/database.ts`:

```bash
head -5 src/types/database.ts
```

Salida esperada: algo como `export type Json = ...`

- [ ] **Step 2: Verificar que npm run check pasa**

```bash
npm run check
```

Salida esperada: lint OK + typecheck OK + build OK.  
Si hay errores de tipos en `database.ts`, asegurarse de que el archivo generado no contradiga los tipos existentes en `src/types/invitation.ts`.

- [ ] **Step 3: Commit del archivo de tipos (si se creó)**

```bash
git add src/types/database.ts
git commit -m "chore: add generated supabase typescript types"
```

---

## Referencia rápida post-setup

```bash
# Iniciar sesión de desarrollo local
npm run supabase:start

# Nueva migración
npx supabase migration new nombre_de_la_migracion
# → editar supabase/migrations/YYYYMMDDHHMMSS_nombre_de_la_migracion.sql
npm run supabase:reset    # aplicar en local

# Subir migraciones a producción (cuando estés seguro)
npm run supabase:push

# Actualizar tipos TypeScript
npm run supabase:types

# Apagar al terminar
npm run supabase:stop
```
