#!/usr/bin/env node
/**
 * Migra photos[0..6] → extra_config.photo_after_* para proyectos elegance.
 * Idempotente: no sobreescribe campos que ya tienen valor.
 * El array photos[] original NO se modifica.
 *
 * Uso: node scripts/migrate-elegance-photos.mjs
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const env = Object.fromEntries(
  readFileSync(join(ROOT, '.env.local'), 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()] })
)

const BASE = env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1'
const HEADERS = {
  'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
}

/** photos[i] → nombre de campo en extra_config */
const MAP = [
  [0, 'photo_after_hero'],
  [1, 'photo_after_parents'],
  [2, 'photo_after_locations'],
  [3, 'photo_after_gifts'],
  [4, 'photo_before_itinerary'],
  [5, 'photo_after_itinerary'],
  [6, 'photo_after_rsvp'],
]

// Leer todos los proyectos elegance
const res = await fetch(
  `${BASE}/projects?template=eq.elegance&select=id,slug,photos,extra_config`,
  { headers: HEADERS }
)
if (!res.ok) {
  console.error('Error al leer proyectos:', await res.text())
  process.exit(1)
}

const projects = await res.json()
console.log(`\nProyectos elegance encontrados: ${projects.length}\n`)
let migrated = 0

for (const p of projects) {
  const photos = p.photos ?? []
  const hasPhotos = photos.some(Boolean)

  if (!hasPhotos) {
    console.log(`  [skip] ${p.slug} — sin fotos en array`)
    continue
  }

  const extra = { ...(p.extra_config ?? {}) }
  let changed = false

  for (const [i, field] of MAP) {
    const url = photos[i]
    if (url && !extra[field]) {
      extra[field] = url
      changed = true
      console.log(`  [set]  ${p.slug} → ${field}`)
    } else if (url && extra[field]) {
      console.log(`  [skip] ${p.slug} → ${field} ya tiene valor`)
    }
  }

  if (!changed) {
    console.log(`  [noop] ${p.slug} — nada que migrar`)
    continue
  }

  const upRes = await fetch(
    `${BASE}/projects?id=eq.${p.id}`,
    { method: 'PATCH', headers: HEADERS, body: JSON.stringify({ extra_config: extra }) }
  )

  if (!upRes.ok) {
    console.error(`  [ERR]  ${p.slug}: ${await upRes.text()}`)
  } else {
    migrated++
    console.log(`  [ok]   ${p.slug} — guardado`)
  }
}

console.log(`\n✓ Migración completa: ${migrated}/${projects.length} proyectos actualizados.\n`)
