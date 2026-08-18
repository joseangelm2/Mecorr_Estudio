import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import QRCode from 'qrcode'
import { createServiceClient } from '@/lib/supabase/service'
import { extractBearerToken, verifyToken } from '@/lib/lista/auth'
import { BoletoPDF } from '@/components/lista/BoletoPDF'
import type { Invitado } from '@/types/invitation'
import React from 'react'

interface Params { params: Promise<{ slug: string; id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const { slug, id } = await params
  const payload = verifyToken(extractBearerToken(req.headers.get('authorization')) ?? '')
  if (!payload || payload.slug !== slug) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = createServiceClient()

  const [{ data: project }, { data: invitado }] = await Promise.all([
    supabase.from('projects').select('quinceanera_name, event_date, ceremony').eq('slug', slug).single(),
    supabase.from('invitados').select('*, grupo:grupos_evento(id, nombre, color, orden)').eq('id', id).single(),
  ])

  if (!project || !invitado) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  if (invitado.confirmacion !== 'SI') {
    return NextResponse.json({ error: 'El invitado no ha confirmado asistencia' }, { status: 422 })
  }

  const mapsUrl = (project.ceremony as { mapsUrl?: string } | null)?.mapsUrl ?? ''
  const venue   = (project.ceremony as { venue?: string } | null)?.venue ?? ''

  const qrDataUrls: Record<string, string> = {}
  if (mapsUrl) {
    qrDataUrls[invitado.id] = await QRCode.toDataURL(mapsUrl, { width: 180, margin: 1 })
  }

  const element = React.createElement(BoletoPDF, {
    invitados: [invitado as Invitado],
    festejada: project.quinceanera_name,
    eventDate: project.event_date,
    venue,
    qrDataUrls,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfBuffer = await renderToBuffer(element as any)
  const uint8 = new Uint8Array(pdfBuffer)

  const filename = `boleto-${(invitado as Invitado).titular.replace(/\s+/g, '-')}.pdf`
  return new NextResponse(uint8, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
