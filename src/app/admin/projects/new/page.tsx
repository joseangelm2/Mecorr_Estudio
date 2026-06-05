import ProjectForm from '@/components/admin/ProjectForm'
import Link from 'next/link'

export const metadata = { title: 'Nuevo Proyecto — Goldrose Admin' }

export default function NewProjectPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-gray-400 hover:text-gray-600 text-sm">← Proyectos</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">Nuevo Proyecto</h1>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ProjectForm />
      </div>
    </div>
  )
}
