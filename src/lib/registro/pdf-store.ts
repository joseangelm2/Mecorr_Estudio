import { createServiceClient } from '@/lib/supabase/service'
import { initialData } from './apply'
import { buildQA } from './qa'
import { renderQAPdf } from './pdf'
import type { Project } from '@/types/invitation'

const BUCKET = 'client-forms'

export interface StoredPdf { bytes: Buffer; filename: string }

function fileName(project: Project): string {
  const base = project.quinceanera_name
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)
  return `Datos-invitacion-${base || 'cliente'}.pdf`
}

/** Genera el PDF de preguntas y respuestas con lo que hay guardado y lo guarda en el bucket privado. */
export async function generateAndStoreClientPdf(projectId: string): Promise<StoredPdf> {
  const supabase = createServiceClient()
  const { data: project, error } = await supabase.from('projects').select('*').eq('id', projectId).single()
  if (error || !project) throw new Error('Proyecto no encontrado')
  const p = project as Project

  // Fecha y hora de finalización = cuando el cliente envió el formulario (submitted_at).
  const { data: link } = await supabase.from('project_client_links').select('submitted_at').eq('project_id', projectId).maybeSingle()
  const now = new Date()
  const finalizado = link?.submitted_at ? new Date(link.submitted_at) : now
  const finalizadoEn =
    finalizado.toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Mexico_City' }) +
    ' (hora del centro de México)'
  const bytes = await renderQAPdf({ nombre: p.quinceanera_name, sections: buildQA(p.template, initialData(p)), finalizadoEn })

  const path = `${projectId}/respuestas.pdf`
  const up = await supabase.storage.from(BUCKET).upload(path, bytes, { contentType: 'application/pdf', upsert: true })
  if (up.error) throw new Error(up.error.message)
  await supabase.from('project_client_links').update({ pdf_path: path, pdf_generated_at: now.toISOString() }).eq('project_id', projectId)
  return { bytes, filename: fileName(p) }
}

/** Descarga la copia guardada (null si no existe). */
export async function readStoredClientPdf(projectId: string): Promise<StoredPdf | null> {
  const supabase = createServiceClient()
  const { data: link } = await supabase.from('project_client_links').select('pdf_path').eq('project_id', projectId).maybeSingle()
  if (!link?.pdf_path) return null
  const { data: file } = await supabase.storage.from(BUCKET).download(link.pdf_path)
  const { data: project } = await supabase.from('projects').select('quinceanera_name').eq('id', projectId).single()
  if (!file || !project) return null
  return { bytes: Buffer.from(await file.arrayBuffer()), filename: fileName(project as Project) }
}
