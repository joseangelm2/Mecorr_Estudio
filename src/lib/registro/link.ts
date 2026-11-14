import { createServiceClient } from '@/lib/supabase/service'
import type { Project } from '@/types/invitation'

/** 32 bytes en base64url = 43 caracteres. */
export const TOKEN_RE = /^[A-Za-z0-9_-]{43}$/

export interface ClientLinkRow {
  project_id: string
  token: string
  open: boolean
  submitted_at: string | null
  last_saved_at: string | null
  pdf_path: string | null
  pdf_generated_at: string | null
  created_at: string
}

/** Link abierto + su proyecto, o null (token inválido, cerrado o inexistente: no se distingue). */
export async function findOpenLink(token: string): Promise<{ link: ClientLinkRow; project: Project } | null> {
  if (!TOKEN_RE.test(token)) return null
  const supabase = createServiceClient()
  const { data: link } = await supabase
    .from('project_client_links')
    .select('*')
    .eq('token', token)
    .eq('open', true)
    .maybeSingle()
  if (!link) return null
  const { data: project } = await supabase.from('projects').select('*').eq('id', link.project_id).single()
  if (!project) return null
  return { link: link as ClientLinkRow, project: project as Project }
}

/** Link ya enviado (abierto o cerrado) y si tiene PDF. Solo para la pantalla final y la descarga del PDF. */
export async function findSubmittedLink(token: string): Promise<ClientLinkRow | null> {
  if (!TOKEN_RE.test(token)) return null
  const supabase = createServiceClient()
  const { data } = await supabase.from('project_client_links').select('*').eq('token', token).not('submitted_at', 'is', null).maybeSingle()
  return (data as ClientLinkRow | null) ?? null
}
