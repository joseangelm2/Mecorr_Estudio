import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { TemplateRenderer } from '@/components/templates/TemplateRenderer'
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

  return <TemplateRenderer project={data as Project} />
}
