import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { togglePublish, deleteProject } from './actions'
import { DeleteButton } from './DeleteButton'
import type { Project } from '@/types/invitation'

const TEMPLATE_COLORS: Record<string, string> = {
  sobre: 'bg-rose-100 text-rose-700',
  esmeralda: 'bg-emerald-100 text-emerald-700',
  pink: 'bg-pink-100 text-pink-700',
  love: 'bg-red-100 text-red-700',
  zafiro: 'bg-blue-100 text-blue-700',
  elegance: 'bg-sky-100 text-sky-700',
  hogwarts: 'bg-yellow-100 text-yellow-700',
  sellorosa: 'bg-fuchsia-100 text-fuchsia-700',
  rosagold: 'bg-orange-100 text-orange-700',
  magical: 'bg-purple-100 text-purple-700',
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, slug, template, status, quinceanera_name, event_date, updated_at')
    .order('updated_at', { ascending: false })

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
          Error al cargar proyectos: {error.message}
        </div>
      </div>
    )
  }

  const list = (projects ?? []) as Pick<Project, 'id' | 'slug' | 'template' | 'status' | 'quinceanera_name' | 'event_date' | 'updated_at'>[]
  const published = list.filter(p => p.status === 'published').length
  const drafts = list.filter(p => p.status === 'draft').length

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invitaciones</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona todas las invitaciones digitales</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-medium transition-colors shadow-sm shadow-rose-200"
        >
          <span className="text-base leading-none">+</span>
          Nueva invitación
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total', value: list.length, color: 'text-gray-900', bg: 'bg-white' },
          { label: 'Publicadas', value: published, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Borradores', value: drafts, color: 'text-gray-500', bg: 'bg-gray-50' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl border border-gray-100 p-5`}>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">💌</div>
          <p className="text-gray-700 font-medium">Sin invitaciones aún</p>
          <p className="text-gray-400 text-sm mt-1">Crea tu primera invitación digital</p>
          <Link href="/admin/projects/new" className="mt-4 inline-block text-sm text-rose-500 hover:text-rose-600 font-medium">
            Crear primera invitación →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[1fr_120px_100px_110px_110px_160px] text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3 border-b border-gray-100 bg-gray-50">
            <span>Nombre</span>
            <span>Template</span>
            <span>Estado</span>
            <span>Evento</span>
            <span>Actualizado</span>
            <span className="text-right">Acciones</span>
          </div>
          <div className="divide-y divide-gray-50">
            {list.map(project => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </div>
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

  const initials = project.quinceanera_name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const templateColor = TEMPLATE_COLORS[project.template] ?? 'bg-gray-100 text-gray-600'

  return (
    <div className="grid grid-cols-[1fr_120px_100px_110px_110px_160px] items-center px-6 py-3.5 hover:bg-gray-50/70 transition-colors">
      {/* Name */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-xs font-bold shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{project.quinceanera_name}</p>
          <p className="text-xs text-gray-400 truncate">/i/{project.slug}</p>
        </div>
      </div>

      {/* Template */}
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium w-fit capitalize ${templateColor}`}>
        {project.template}
      </span>

      {/* Status */}
      <div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
          project.status === 'published'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'published' ? 'bg-green-500' : 'bg-gray-400'}`} />
          {project.status === 'published' ? 'Publicada' : 'Borrador'}
        </span>
      </div>

      {/* Event date */}
      <span className="text-sm text-gray-600">{eventDate}</span>

      {/* Updated */}
      <span className="text-sm text-gray-400">{updatedDate}</span>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1.5">
        <Link
          href={`/admin/projects/${project.id}`}
          className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium transition-colors"
        >
          Editar
        </Link>
        <a
          href={`/i/${project.slug}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs px-2.5 py-1.5 border border-rose-200 rounded-lg hover:bg-rose-50 text-rose-600 font-medium transition-colors"
        >
          Ver ↗
        </a>
        <form action={toggleAction}>
          <button
            type="submit"
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
              project.status === 'published'
                ? 'border-orange-200 text-orange-600 hover:bg-orange-50'
                : 'border-green-200 text-green-600 hover:bg-green-50'
            }`}
          >
            {project.status === 'published' ? 'Ocultar' : 'Publicar'}
          </button>
        </form>
        <form action={deleteAction}>
          <DeleteButton />
        </form>
      </div>
    </div>
  )
}
