import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Invitación',
  description: 'Te Invito a Mi Día Más Especial',
}

export default function InvitationLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
