import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { TemplateRenderer } from '@/components/templates/TemplateRenderer'
import { PINLoginScreen } from '@/components/lista/PINLoginScreen'
import type { Project } from '@/types/invitation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) notFound()

  const project = data as Project

  // Cuando el módulo está activo, esta ruta es el portal de admin (PIN login).
  // La invitación personalizada del invitado vive en /i/[slug]/invitacion?token=
  if (project.tiene_lista_invitados) {
    return <PINLoginScreen slug={slug} festejada={project.quinceanera_name} />
  }

  return <TemplateRenderer project={project} />
}
