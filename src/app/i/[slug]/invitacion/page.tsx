import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { TemplateRenderer } from '@/components/templates/TemplateRenderer'
import { GuestProvider } from '@/lib/lista/GuestContext'
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
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) notFound()

  const project = data as Project

  return (
    <GuestProvider
      token={project.tiene_lista_invitados ? (token ?? null) : null}
      slug={slug}
      rsvpPhone={project.rsvp_phone ?? ''}
      festejada={project.quinceanera_name}
    >
      <TemplateRenderer project={project} />
    </GuestProvider>
  )
}
