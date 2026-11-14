'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from './logout-action'

const NAV = [
  { href: '/admin', label: 'Proyectos', icon: '▦', exact: true },
  { href: '/admin/projects/new', label: 'Nueva invitación', icon: '+', exact: false },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // No renderizar en las páginas públicas de autenticación
  if (pathname === '/admin/login' || pathname === '/admin/forgot-password' || pathname === '/admin/reset-password') return null

  return (
    <>
      {/* Barra superior (solo móvil) */}
      <div className="md:hidden shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={open}
          className="w-10 h-10 -ml-2 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <img src="/promo/icon_mecorr.png" alt="" className="w-7 h-7 rounded-full shrink-0" />
        <p className="text-sm font-semibold text-gray-900">MeCorr Estudio</p>
      </div>

      {/* Fondo oscuro del menú móvil */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

    <aside className={`fixed inset-y-0 left-0 z-50 w-64 md:static md:z-auto md:w-60 md:translate-x-0 bg-white border-r border-gray-100 flex flex-col shrink-0 shadow-sm transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <img src="/promo/icon_mecorr.png" alt="" className="w-7 h-7 rounded-full shrink-0" />
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
              onClick={() => setOpen(false)}
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
    </>
  )
}
