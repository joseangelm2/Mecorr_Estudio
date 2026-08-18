# Diseño: Supabase CLI + Stack Local + Link a Producción

**Fecha:** 2026-06-25  
**Proyecto:** Goldrose (MeCorr Estudio)  
**Producción:** `avnihxwxurhchgdkqmyn.supabase.co`

---

## Objetivo

Instalar Supabase CLI y levantar un stack local completo (PostgreSQL, Auth, Storage, Studio) usando Docker, enlazado al proyecto de producción para gestionar migraciones y generar tipos TypeScript.

---

## Prerequisito manual (usuario)

Docker Desktop ya está instalado en Windows. El usuario debe activar la integración WSL2:

> **Docker Desktop → Settings → Resources → WSL Integration → activar la distro activa → Apply & Restart**

Esto es un paso único que habilita `docker` dentro de WSL2.

---

## Componentes del diseño

### 1. Supabase CLI

- Instalado como devDependency del proyecto: `npm install --save-dev supabase`
- Acceso vía `npx supabase` o script npm
- Versión: latest (se fija en package.json para reproducibilidad)

### 2. config.toml

El directorio `supabase/` ya existe con 6 migraciones y `seed.sql`, pero sin `config.toml`. Se genera con `supabase init --with-intellij-settings false` usando el `project_id` del proyecto de producción para que el link sea inmediato.

Valores a configurar:
- `project_id = "avnihxwxurhchgdkqmyn"` — referencia al proyecto de producción
- `db.port = 54322` — puerto local PostgreSQL
- `api.port = 54321` — puerto local API
- `studio.port = 54323` — Supabase Studio local

### 3. Stack local (Docker)

`supabase start` levanta los siguientes contenedores:
- `supabase/postgres` — PostgreSQL local
- `supabase/gotrue` — Auth (misma configuración que producción)
- `supabase/storage-api` — Storage local
- `supabase/studio` — UI de administración en `http://localhost:54323`
- `supabase/kong` — API gateway en `http://localhost:54321`

Primera descarga: ~2 GB de imágenes Docker (solo primera vez).

### 4. Link a producción

```bash
npx supabase link --project-ref avnihxwxurhchgdkqmyn
```

Solicita el database password del proyecto de producción (disponible en Supabase Dashboard → Settings → Database). Esto permite:
- `supabase db push` — aplica migraciones locales a producción
- `supabase db pull` — trae el esquema de producción a migraciones locales

### 5. Variables de entorno

Se añade un bloque comentado en `.env.local` para alternar entre local y producción:

```bash
# --- DESARROLLO LOCAL (supabase start) ---
# NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key_local>  # impresa por supabase start
# SUPABASE_SERVICE_ROLE_KEY=<service_role_local>   # impresa por supabase start

# --- PRODUCCIÓN (activo por defecto) ---
NEXT_PUBLIC_SUPABASE_URL=https://avnihxwxurhchgdkqmyn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### 6. Scripts npm

Se añaden scripts de conveniencia a `package.json`:

```json
"supabase:start": "supabase start",
"supabase:stop": "supabase stop",
"supabase:reset": "supabase db reset",
"supabase:push": "supabase db push",
"supabase:types": "supabase gen types typescript --local > src/types/database.ts"
```

---

## Flujo de trabajo resultante

| Situación | Acción |
|---|---|
| Iniciar dev local | `npm run supabase:start` → activa los comentarios de `.env.local` |
| Crear migración | `supabase migration new <nombre>` → editar SQL → `npm run supabase:reset` |
| Subir a producción | `npm run supabase:push` |
| Actualizar tipos | `npm run supabase:types` |
| Ver Studio local | `http://localhost:54323` |
| Apagar al terminar | `npm run supabase:stop` |

---

## Fuera de scope

- Configurar Auth providers locales (Google, GitHub, etc.) — se hace después si se necesita
- CI/CD con migraciones automáticas — fuera de alcance por ahora
- Múltiples entornos (staging) — no aplica en este proyecto

---

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `supabase/config.toml` | Creado nuevo |
| `package.json` | Scripts `supabase:*` añadidos |
| `.env.local` | Bloque comentado para URLs locales |
| `.gitignore` | Verificar que `.env.local` esté ignorado (ya debería) |
