import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Invitaciones Digitales — MeCorr Estudio',
  description: 'Catálogo de invitaciones digitales para XV años. Diseños exclusivos con animaciones, galería y confirmación de asistencia.',
}

export default function InvitacionesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
