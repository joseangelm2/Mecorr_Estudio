import Link from 'next/link'
import { createClientDraft } from '../../client-link-actions'

// Mismas plantillas que el selector de ProjectForm.tsx.
const TEMPLATES = [
  { value: 'sobre', label: 'Sobre Animado' },
  { value: 'esmeralda', label: 'Esmeralda' },
  { value: 'pink', label: 'Pink' },
  { value: 'love', label: 'Love' },
  { value: 'zafiro', label: 'Zafiro' },
  { value: 'elegance', label: 'Elegance' },
  { value: 'sellorosa', label: 'Sello Rosa' },
  { value: 'rosagold', label: 'Rosa Gold' },
  { value: 'magical', label: 'Magical' },
  { value: 'especial', label: 'Especial' },
  { value: 'esmeralda-especial', label: 'Esmeralda Especial' },
  { value: 'bodasilueta', label: 'Boda Silueta' },
  { value: 'bodasobre', label: 'Boda Sobre' },
]

export default function NuevoClientePage() {
  return (
    <div className="max-w-xl p-4 md:p-8">
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/admin" className="text-gray-400 hover:text-gray-600">Proyectos</Link>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-gray-700">Nueva para cliente</span>
      </div>
      <form action={createClientDraft} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Nueva invitación para cliente</h1>
          <p className="mt-1 text-sm text-gray-500">
            Crea el borrador y un enlace para que el cliente llene sus datos.
          </p>
        </div>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-gray-800">Plantilla</span>
          <select name="template" required defaultValue="" className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm">
            <option value="" disabled>Elige una plantilla…</option>
            {TEMPLATES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-gray-800">Nombre para identificar el proyecto</span>
          <input name="name" required maxLength={120} placeholder="Ej. Valeria Medina o Laura & Andrés" className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm" />
          <span className="block text-xs text-gray-500">Define el enlace de la invitación (no cambia). El cliente escribe en su formulario cómo quiere que se vea su nombre.</span>
        </label>
        <button type="submit" className="w-full rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-600">
          Crear y generar enlace
        </button>
      </form>
    </div>
  )
}
