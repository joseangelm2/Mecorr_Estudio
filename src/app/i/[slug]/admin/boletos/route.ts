import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import QRCode from 'qrcode'
import { createServiceClient } from '@/lib/supabase/service'
import { extractBearerToken, verifyToken } from '@/lib/lista/auth'
import { BoletoPDF } from '@/components/lista/BoletoPDF'
import type { Invitado } from '@/types/invitation'
import React from 'react'

interface Params { params: Promise<{ slug: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const payload = verifyToken(extractBearerToken(req.headers.get('authorization')) ?? '')
  if (!payload || payload.slug !== slug) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data: project } = await supabase
    .from('projects')
    .select('id, quinceanera_name, event_date, ceremony')
    .eq('slug', slug)
    .single()

  if (!project) return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })

  const { data: invitados } = await supabase
    .from('invitados')
    .select('*, grupo:grupos_evento(id, nombre, color, orden)')
    .eq('project_id', project.id)
    .eq('confirmacion', 'SI')

  if (!invitados || invitados.length === 0) {
    return NextResponse.json({ error: 'Sin invitados confirmados' }, { status: 404 })
  }

  const mapsUrl = (project.ceremony as { mapsUrl?: string } | null)?.mapsUrl ?? ''
  const venue   = (project.ceremony as { venue?: string } | null)?.venue ?? ''

  const qrDataUrls: Record<string, string> = {}
  if (mapsUrl) {
    const qrDataUrl = await QRCode.toDataURL(mapsUrl, { width: 180, margin: 1 })
    for (const inv of invitados) {
      qrDataUrls[inv.id] = qrDataUrl
    }
  }

  const element = React.createElement(BoletoPDF, {
    invitados: invitados as Invitado[],
    festejada: project.quinceanera_name,
    eventDate: project.event_date,
    venue,
    qrDataUrls,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfBuffer = await renderToBuffer(element as any)
  const uint8 = new Uint8Array(pdfBuffer)

  return new NextResponse(uint8, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="boletos-${slug}.pdf"`,
    },
  })
}
