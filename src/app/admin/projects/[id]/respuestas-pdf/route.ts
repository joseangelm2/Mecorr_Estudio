import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { readStoredClientPdf } from '@/lib/registro/pdf-store'

interface Params { params: Promise<{ id: string }> }

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Descarga la copia en PDF de las respuestas del cliente. Solo admin autenticado. */
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  if (!UUID_RE.test(id)) return NextResponse.json({ error: 'Proyecto no válido' }, { status: 400 })

  const pdf = await readStoredClientPdf(id)
  if (!pdf) return NextResponse.json({ error: 'Este proyecto aún no tiene PDF' }, { status: 404 })
  return new NextResponse(new Uint8Array(pdf.bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${pdf.filename}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
