import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { AdminShell } from '@/components/lista/AdminShell'
import type { Project } from '@/types/invitation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function AdminPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('id, slug, quinceanera_name, rsvp_phone, ceremony, tiene_lista_invitados, event_date')
    .eq('slug', slug)
    .single()

  if (error || !data) notFound()

  const project = data as Project
  if (!project.tiene_lista_invitados) redirect(`/i/${slug}`)

  return (
    <AdminShell
      slug={slug}
      festejada={project.quinceanera_name}
      eventDate={project.event_date}
      rsvpPhone={project.rsvp_phone ?? ''}
      mapsUrl={(project.ceremony as { mapsUrl?: string } | null)?.mapsUrl ?? ''}
    />
  )
}
