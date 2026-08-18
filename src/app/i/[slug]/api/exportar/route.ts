import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { extractBearerToken, verifyToken } from '@/lib/lista/auth'
import Papa from 'papaparse'

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
    .select('id')
    .eq('slug', slug)
    .single()

  if (!project) return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })

  const { data: invitados } = await supabase
    .from('invitados')
    .select('titular, grupo:grupos_evento(nombre), num_invitados, whatsapp, estado, confirmacion, fecha_envio, fecha_confirmacion')
    .eq('project_id', project.id)
    .order('created_at', { ascending: true })

  const rows = (invitados ?? []).map(inv => ({
    Titular: inv.titular,
    Grupo: (inv.grupo as unknown as { nombre: string } | null)?.nombre ?? '',
    'Num. Invitados': inv.num_invitados,
    WhatsApp: inv.whatsapp ?? '',
    Estado: inv.estado,
    Confirmación: inv.confirmacion ?? '',
    'Fecha Envío': inv.fecha_envio ?? '',
    'Fecha Confirmación': inv.fecha_confirmacion ?? '',
  }))

  const csv = Papa.unparse(rows, { header: true })

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="invitados-${slug}.csv"`,
    },
  })
}
