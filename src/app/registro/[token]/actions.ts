'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { findOpenLink } from '@/lib/registro/link'
import { buildUpdate } from '@/lib/registro/apply'
import { isBoda, SECTION_SCHEMAS, type SectionId } from '@/lib/registro/schema'

export type ActionResult = { ok: true } | { ok: false; error: string }

const NO_DISPONIBLE = 'Este enlace ya no está disponible. Pide uno nuevo a MeCorr Estudio.'
export async function saveSection(token: string, section: SectionId, raw: unknown): Promise<ActionResult> {
  const found = await findOpenLink(token)
  if (!found) return { ok: false, error: NO_DISPONIBLE }
  const schema = Object.hasOwn(SECTION_SCHEMAS, section) ? SECTION_SCHEMAS[section] : undefined
  if (!schema) return { ok: false, error: 'Sección no válida.' }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Revisa los datos e inténtalo de nuevo.' }
  }
  const data = parsed.data as never

  // Obligatorios que dependen de la plantilla.
  if (section === 'datos') {
    const d = parsed.data as { nombre: string; novia: string; novio: string }
    if (isBoda(found.project.template) ? !(d.novia.trim() && d.novio.trim()) : !d.nombre.trim()) {
      return { ok: false, error: isBoda(found.project.template) ? 'Escribe el nombre de la novia y del novio.' : 'Escribe el nombre de la festejada.' }
    }
  }

  const supabase = createServiceClient()
  const { error } = await supabase.from('projects').update(buildUpdate(found.project, section, data)).eq('id', found.project.id)
  if (error) return { ok: false, error: 'No se pudo guardar. Inténtalo de nuevo.' }
  await supabase.from('project_client_links').update({ last_saved_at: new Date().toISOString() }).eq('project_id', found.project.id)
  return { ok: true }
}

export async function submitForReview(token: string): Promise<ActionResult> {
  const found = await findOpenLink(token)
  if (!found) return { ok: false, error: NO_DISPONIBLE }
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('project_client_links')
    .update({ submitted_at: new Date().toISOString() })
    .eq('project_id', found.project.id)
  return error ? { ok: false, error: 'No se pudo enviar. Inténtalo de nuevo.' } : { ok: true }
}
