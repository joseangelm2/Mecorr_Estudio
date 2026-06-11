import ProjectForm from '@/components/admin/ProjectForm'
import Link from 'next/link'

export const metadata = { title: 'Nueva Invitación — Goldrose Admin' }

export default function NewProjectPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">Proyectos</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 font-medium">Nueva invitación</span>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="mb-6 pb-5 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">Nueva invitación</h1>
          <p className="text-sm text-gray-500 mt-0.5">Completa la información para crear la invitación digital</p>
        </div>
        <ProjectForm />
      </div>
    </div>
  )
}
