import type { Metadata } from 'next'
import { findOpenLink, findSubmittedLink } from '@/lib/registro/link'
import { initialData } from '@/lib/registro/apply'
import { RegistroDone, RegistroForm } from '@/components/registro/RegistroForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Datos de tu invitación — MeCorr Estudio',
  robots: { index: false, follow: false },
}

interface Props {
  params: Promise<{ token: string }>
}

export default async function RegistroPage({ params }: Props) {
  const { token } = await params
  const found = await findOpenLink(token)

  if (!found) {
    // Enlace cerrado porque el cliente ya envió: pantalla final con la descarga del PDF.
    const sent = await findSubmittedLink(token)
    if (sent) return <RegistroDone token={token} pdfReady={!!sent.pdf_path} />
    return (
      <main className="rg-root flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-bold text-gray-900">Este enlace ya no está disponible</h1>
          <p className="mt-2 text-sm text-gray-600">
            Escríbenos por WhatsApp y con gusto te enviamos uno nuevo.
          </p>
        </div>
      </main>
    )
  }

  const { project } = found
  return (
    <RegistroForm
      token={token}
      template={project.template}
      initial={initialData(project)}
    />
  )
}
