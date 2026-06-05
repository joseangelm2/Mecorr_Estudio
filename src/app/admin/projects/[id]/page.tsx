import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProjectForm from '@/components/admin/ProjectForm'
import Link from 'next/link'
import type { Project } from '@/types/invitation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  const project = data as Project

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-gray-400 hover:text-gray-600 text-sm">← Proyectos</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">Editar: {project.quinceanera_name}</h1>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ProjectForm project={project} />
      </div>
    </div>
  )
}
