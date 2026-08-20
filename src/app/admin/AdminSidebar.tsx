'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from './logout-action'

const NAV = [
  { href: '/admin', label: 'Proyectos', icon: '▦', exact: true },
  { href: '/admin/projects/new', label: 'Nueva invitación', icon: '+', exact: false },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  // No renderizar en las páginas públicas de autenticación
  if (pathname === '/admin/login' || pathname === '/admin/forgot-password' || pathname === '/admin/reset-password') return null

  return (
    <aside className="w-60 bg-white border-r border-gray-100 flex flex-col shrink-0 shadow-sm">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-rose-500 flex items-center justify-center text-white text-xs font-bold shrink-0">G</span>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-none">MeCorr Estudio</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Menú</p>
        {NAV.map(item => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && !item.exact
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                active
                  ? 'bg-rose-50 text-rose-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${
                active ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-500'
              }`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-100">
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <span className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 text-gray-500 text-xs">→</span>
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  )
}
