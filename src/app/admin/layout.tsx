import AdminSidebar from './AdminSidebar'

// Server Component: sin "use client", permite streaming y RSC en las páginas hijas. En móvil el menú es hamburguesa (AdminSidebar).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rg-root flex h-dvh flex-col bg-[#f8f7f5] font-sans md:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

