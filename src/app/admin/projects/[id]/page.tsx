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
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">Proyectos</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 font-medium">{project.quinceanera_name}</span>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="mb-6 pb-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{project.quinceanera_name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              <span className={`inline-flex items-center gap-1 ${project.status === 'published' ? 'text-green-600' : 'text-gray-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${project.status === 'published' ? 'bg-green-500' : 'bg-gray-300'}`} />
                {project.status === 'published' ? 'Publicada' : 'Borrador'}
              </span>
              <span className="text-gray-300 mx-2">·</span>
              <span className="capitalize">{project.template}</span>
              <span className="text-gray-300 mx-2">·</span>
              /i/{project.slug}
            </p>
          </div>
          <a
            href={`/i/${project.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs px-3 py-1.5 border border-rose-200 rounded-lg hover:bg-rose-50 text-rose-600 font-medium transition-colors shrink-0"
          >
            Ver invitación ↗
          </a>
        </div>
        <ProjectForm project={project} />
      </div>
    </div>
  )
}
