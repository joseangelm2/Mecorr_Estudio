import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto — MeCorr Estudio',
  description: 'Contáctanos para crear tu invitación digital o proyecto web. Estamos en WhatsApp, Instagram y Facebook.',
}

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
