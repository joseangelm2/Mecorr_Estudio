import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AlbumUploadClient from '@/components/album/AlbumUploadClient'
import type { Project } from '@/types/invitation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function AlbumPage({ params }: Props) {
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

  if (project.instagram_mode !== 'album') notFound()

  return <AlbumUploadClient projectId={project.id} projectName={project.quinceanera_name} />
}
