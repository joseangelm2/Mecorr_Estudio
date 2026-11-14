'use server'

import { randomBytes, randomInt } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/slug'
import { VESTIMENTA_IMAGEN_DEFAULT, VESTIMENTA_PALETA_DEFAULT } from '@/lib/bodasobre-vestimenta'
import { isBoda } from '@/lib/registro/schema'
import type { ClientLinkRow } from '@/lib/registro/link'
import type { TemplateId } from '@/types/invitation'

/** Solo el admin autenticado puede gestionar links (a diferencia de actions.ts, aquí sí se verifica sesión). */
async function requireAdmin() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) throw new Error('No autorizado')
  return supabase
}

const TEMPLATE_IDS: TemplateId[] = [
  'sobre', 'esmeralda', 'pink', 'love', 'zafiro', 'elegance', 'sellorosa', 'rosagold',
  'magical', 'especial', 'esmeralda-especial', 'bodasilueta', 'bodasobre',
]

const newToken = () => randomBytes(32).toString('base64url')

export async function ensureClientLink(projectId: string): Promise<ClientLinkRow> {
  const supabase = await requireAdmin()
  const { data: existing } = await supabase.from('project_client_links').select('*').eq('project_id', projectId).maybeSingle()
  if (existing) return existing as ClientLinkRow
  const { data, error } = await supabase
    .from('project_client_links')
    .insert({ project_id: projectId, token: newToken() })
    .select('*')
    .single()
  if (error || !data) throw new Error(error?.message ?? 'No se pudo crear el link')
  revalidatePath(`/admin/projects/${projectId}`)
  return data as ClientLinkRow
}

export async function setClientLinkOpen(projectId: string, open: boolean): Promise<void> {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('project_client_links').update({ open }).eq('project_id', projectId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath('/admin')
}

/** Invalida el link anterior y emite uno nuevo (queda abierto). */
export async function regenerateClientLink(projectId: string): Promise<ClientLinkRow> {
  const supabase = await requireAdmin()
  const { data, error } = await supabase
    .from('project_client_links')
    .update({ token: newToken(), open: true })
    .eq('project_id', projectId)
    .select('*')
    .single()
  if (error || !data) throw new Error(error?.message ?? 'No se pudo regenerar el link')
  revalidatePath(`/admin/projects/${projectId}`)
  return data as ClientLinkRow
}

/** Crea un borrador mínimo (plantilla + nombre) y su link, y lleva al admin a la ficha para copiarlo. */
export async function createClientDraft(formData: FormData): Promise<void> {
  const supabase = await requireAdmin()
  const template = String(formData.get('template') ?? '') as TemplateId
  const name = String(formData.get('name') ?? '').trim()
  if (!TEMPLATE_IDS.includes(template) || !name || name.length > 120) {
    throw new Error('Elige una plantilla y escribe un nombre (máx. 120 caracteres)')
  }

  const boda = isBoda(template)
  const [novia = '', novio = ''] = boda ? name.split(/\s*&\s*/) : []
  const base = generateSlug(name) || 'invitacion'
  const inSixtyDays = new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().slice(0, 16)

  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = `${base}-${randomInt(1000, 10000)}`
    const { data, error } = await supabase
      .from('projects')
      .insert({
        slug,
        template,
        status: 'draft',
        quinceanera_name: name,
        event_date: inSixtyDays,
        color_theme: boda ? 'blanco' : 'rosagold',
        extra_config: {
          ...(boda && novia ? { nombre_novia: novia } : {}),
          ...(boda && novio ? { nombre_novio: novio } : {}),
          ...(template === 'bodasobre'
            ? { show_dress_palette: true, dress_palette: VESTIMENTA_PALETA_DEFAULT, dress_code_image_url: VESTIMENTA_IMAGEN_DEFAULT }
            : {}),
        },
      })
      .select('id')
      .single()
    if (error?.code === '23505') continue // slug repetido: reintenta con otro sufijo
    if (error || !data) throw new Error(error?.message ?? 'No se pudo crear el proyecto')
    const { error: linkError } = await supabase.from('project_client_links').insert({ project_id: data.id, token: newToken() })
    if (linkError) throw new Error('Se creó el proyecto pero no el enlace; genéralo desde su ficha.')
    revalidatePath('/admin')
    redirect(`/admin/projects/${data.id}`)
  }
  throw new Error('No se pudo generar un slug único')
}
