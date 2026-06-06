import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { togglePublish, deleteProject } from './actions'
import { DeleteButton } from './DeleteButton'
import type { Project } from '@/types/invitation'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, slug, template, status, quinceanera_name, event_date, updated_at')
    .order('updated_at', { ascending: false })

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          Error al cargar proyectos: {error.message}
        </div>
      </div>
    )
  }

  const list = (projects ?? []) as Pick<Project, 'id' | 'slug' | 'template' | 'status' | 'quinceanera_name' | 'event_date' | 'updated_at'>[]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
          <p className="text-sm text-gray-500 mt-1">{list.length} invitaciones registradas</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md text-sm font-medium transition-colors"
        >
          + Nuevo Proyecto
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-400 text-lg">No hay proyectos aún</p>
          <Link href="/admin/projects/new" className="text-rose-500 hover:text-rose-600 text-sm mt-2 inline-block">
            Crear el primero →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Template</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha evento</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actualizado</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.map(project => (
                <ProjectRow key={project.id} project={project} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ProjectRow({ project }: { project: Pick<Project, 'id' | 'slug' | 'template' | 'status' | 'quinceanera_name' | 'event_date' | 'updated_at'> }) {
  const eventDate = new Date(project.event_date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
  const updatedDate = new Date(project.updated_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })

  const toggleAction = togglePublish.bind(null, project.id, project.status === 'published' ? 'draft' : 'published')
  const deleteAction = deleteProject.bind(null, project.id)

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3 font-medium text-gray-900">{project.quinceanera_name}</td>
      <td className="px-4 py-3 text-gray-500 capitalize">{project.template}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
          project.status === 'published'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {project.status === 'published' ? 'Publicado' : 'Borrador'}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-500">{eventDate}</td>
      <td className="px-4 py-3 text-gray-400">{updatedDate}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/projects/${project.id}`}
            className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600"
          >
            Editar
          </Link>
          <a
            href={`/i/${project.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs px-2 py-1 border border-rose-300 rounded hover:bg-rose-50 text-rose-600"
          >
            Ver ↗
          </a>
          <form action={toggleAction}>
            <button
              type="submit"
              className={`text-xs px-2 py-1 rounded border ${
                project.status === 'published'
                  ? 'border-orange-300 text-orange-600 hover:bg-orange-50'
                  : 'border-green-300 text-green-600 hover:bg-green-50'
              }`}
            >
              {project.status === 'published' ? 'Despublicar' : 'Publicar'}
            </button>
          </form>
          <form action={deleteAction}>
            <DeleteButton />
          </form>
        </div>
      </td>
    </tr>
  )
}

