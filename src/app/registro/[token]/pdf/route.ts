import { NextResponse } from 'next/server'
import { findSubmittedLink } from '@/lib/registro/link'
import { readStoredClientPdf } from '@/lib/registro/pdf-store'

export const dynamic = 'force-dynamic'

interface Params { params: Promise<{ token: string }> }

/** Copia en PDF de las respuestas para el propio cliente. El token (secreto) es la credencial; no distingue enlace abierto/cerrado. */
export async function GET(_req: Request, { params }: Params) {
  const { token } = await params
  const link = await findSubmittedLink(token)
  const pdf = link ? await readStoredClientPdf(link.project_id) : null
  if (!pdf) return NextResponse.json({ error: 'No disponible' }, { status: 404 })
  return new NextResponse(new Uint8Array(pdf.bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${pdf.filename}"`,
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}
