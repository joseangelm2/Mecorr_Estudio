import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { InvitacionGuest } from '@/components/lista/InvitacionGuest'
import type { Project } from '@/types/invitation'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ token?: string }>
}

export default async function InvitacionPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { token } = await searchParams

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('id, slug, quinceanera_name, rsvp_phone, ceremony, reception, event_date, tiene_lista_invitados')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) notFound()

  const project = data as Project

  return (
    <InvitacionGuest
      slug={slug}
      token={token ?? null}
      festejada={project.quinceanera_name}
      eventDate={project.event_date}
      ceremony={project.ceremony}
      rsvpPhone={project.rsvp_phone ?? ''}
      tieneListaInvitados={project.tiene_lista_invitados}
    />
  )
}
