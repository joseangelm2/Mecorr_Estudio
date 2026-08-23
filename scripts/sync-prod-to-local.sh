#!/usr/bin/env bash
#
# sync-prod-to-local.sh — Copy production data + Storage objects into the
# local Supabase dev stack (the Docker containers started by `supabase start`).
#
# Prereqs:
#   - Logged in to the Supabase CLI: `npx supabase login`
#     (or export SUPABASE_ACCESS_TOKEN)
#   - Docker running
#
# Usage:
#   bash scripts/sync-prod-to-local.sh <prod-project-ref>
#   SUPABASE_PROD_REF=xxxxxxxx bash scripts/sync-prod-to-local.sh
#
# The project ref is the id in your Supabase dashboard URL, or under
# Settings -> General -> Reference ID.
#
# What it does:
#   1. Resets the local DB to a clean state (reapplies migrations + seed.sql)
#   2. Links the CLI to the production project
#   3. Dumps production data (public schema only) and restores it locally
#   4. Copies every Storage bucket's objects from prod -> local
#
# This only READS from production; it never writes to it. It DOES wipe
# whatever is currently in your local Supabase DB and Storage buckets, so
# it asks for confirmation before touching anything.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

SUPABASE="npx supabase"
PROD_REF="${1:-${SUPABASE_PROD_REF:-}}"
BUCKETS=(album-media invitation-media invitation-audio)
TMP_DIR="$REPO_ROOT/supabase/.temp/prod-sync"
DUMP_FILE="$REPO_ROOT/supabase/.temp/prod_data.sql"
PROJECT_ID="$(grep '^project_id' supabase/config.toml | cut -d'"' -f2)"
DB_CONTAINER="supabase_db_${PROJECT_ID}"

if [[ -z "$PROD_REF" ]]; then
  echo "Error: falta el project ref de producción." >&2
  echo "Uso: bash scripts/sync-prod-to-local.sh <prod-project-ref>" >&2
  echo "  (Supabase Dashboard -> Settings -> General -> Reference ID)" >&2
  exit 1
fi

echo "==> Verificando sesión del CLI..."
if ! $SUPABASE projects list >/dev/null 2>&1; then
  echo "Error: no hay sesión iniciada en el CLI de Supabase." >&2
  echo "Ejecuta 'npx supabase login' (o exporta SUPABASE_ACCESS_TOKEN) y vuelve a intentar." >&2
  exit 1
fi

echo "==> Verificando stack local..."
if ! $SUPABASE status >/dev/null 2>&1; then
  echo "El stack local no está corriendo. Levantándolo con 'supabase start'..."
  $SUPABASE start
fi

read -r -p "Esto BORRARÁ los datos actuales de tu base y buckets locales y los reemplazará con los de producción ($PROD_REF). ¿Continuar? [y/N] " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  echo "Cancelado."
  exit 0
fi

echo "==> 1/4 Reiniciando la base local (migraciones + seed)..."
$SUPABASE db reset

echo "==> 2/4 Vinculando el CLI al proyecto de producción..."
$SUPABASE link --project-ref "$PROD_REF"

echo "==> 3/4 Copiando datos (schema public) de producción a local..."
mkdir -p "$(dirname "$DUMP_FILE")"
$SUPABASE db dump --linked --data-only --schema public -f "$DUMP_FILE"
docker exec -i "$DB_CONTAINER" psql -U postgres -d postgres -v ON_ERROR_STOP=1 < "$DUMP_FILE"

echo "==> 4/4 Copiando objetos de Storage de producción a local..."
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"
for bucket in "${BUCKETS[@]}"; do
  echo "  -> bucket: $bucket"

  # Crea el bucket localmente si no existe (asume público, como en
  # supabase/migrations/0008_add_album_digital.sql). Verifica su
  # configuración real en el dashboard de producción si difiere.
  docker exec -i "$DB_CONTAINER" psql -U postgres -d postgres -v ON_ERROR_STOP=1 <<SQL
INSERT INTO storage.buckets (id, name, public)
VALUES ('$bucket', '$bucket', true)
ON CONFLICT (id) DO NOTHING;
SQL

  $SUPABASE storage cp -r --experimental --linked "ss:///$bucket" "$TMP_DIR/$bucket" || true
  if [[ -d "$TMP_DIR/$bucket" ]]; then
    # Sube cada subcarpeta (una por proyecto) por separado: copiar el
    # directorio del bucket completo de una sola vez anida su propio
    # nombre dentro del destino (ss:///bucket/bucket/...) en vez de
    # subir su contenido directamente al bucket.
    found=0
    for dir in "$TMP_DIR/$bucket"/*/; do
      [[ -d "$dir" ]] || continue
      found=1
      name="$(basename "$dir")"
      $SUPABASE storage cp -r --experimental --local "$dir" "ss:///$bucket/$name"
    done
    if [[ "$found" -eq 0 ]]; then
      echo "     (bucket vacío en producción, se omite)"
    fi
  else
    echo "     (bucket vacío o inexistente en producción, se omite)"
  fi
done
rm -rf "$TMP_DIR"

echo "==> Listo. Studio local: http://127.0.0.1:54323"
