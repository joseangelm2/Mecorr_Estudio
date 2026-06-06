import Link from 'next/link'
import { logout } from './logout-action'

export const metadata = {
  title: 'MeCorr Estudio Admin',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-rose-600">MeCorr Estudio</h1>
          <p className="text-xs text-gray-400">Panel de administración</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span>📋</span>
            <span>Proyectos</span>
          </Link>
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span>➕</span>
            <span>Nuevo Proyecto</span>
          </Link>
        </nav>

        <div className="p-3 border-t border-gray-200">
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <span>🚪</span>
              <span>Cerrar sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
