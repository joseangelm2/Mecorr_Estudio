import AdminSidebar from './AdminSidebar'

// Server Component — sin 'use client', permite streaming y RSC en las páginas hijas
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#f8f7f5] font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
