import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { extractBearerToken, verifyToken } from '@/lib/lista/auth'
import type { EstadoInvitado } from '@/types/invitation'

interface Params { params: Promise<{ slug: string; id: string }> }

function unauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}

const VALID_ESTADOS: EstadoInvitado[] = ['alta', 'enviado', 'confirmo', 'baja']

export async function PUT(req: NextRequest, { params }: Params) {
  const { slug, id } = await params
  const payload = verifyToken(extractBearerToken(req.headers.get('authorization')) ?? '')
  if (!payload || payload.slug !== slug) return unauthorized()

  const body = await req.json().catch(() => ({}))
  const supabase = createServiceClient()

  // Solo permite campos seguros
  const allowed: Record<string, unknown> = {}
  if (body.titular !== undefined)       allowed.titular       = String(body.titular).trim()
  if (body.grupo_id !== undefined)      allowed.grupo_id      = body.grupo_id
  if (body.num_invitados !== undefined) allowed.num_invitados = Number(body.num_invitados)
  if (body.whatsapp !== undefined)      allowed.whatsapp      = body.whatsapp || null
  if (body.device_id !== undefined)     allowed.device_id     = body.device_id ?? null
  if (body.fecha_envio !== undefined)   allowed.fecha_envio   = body.fecha_envio
  if (body.confirmacion !== undefined)  allowed.confirmacion  = body.confirmacion
  if (body.fecha_confirmacion !== undefined) allowed.fecha_confirmacion = body.fecha_confirmacion
  if (body.mensaje_felicitacion !== undefined) allowed.mensaje_felicitacion = body.mensaje_felicitacion

  if (body.estado !== undefined) {
    if (!VALID_ESTADOS.includes(body.estado)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }
    allowed.estado = body.estado
  }

  // num_invitados = 0 cuando confirma NO
  if (body.confirmacion === 'NO') allowed.num_invitados = 0

  const { data, error } = await supabase
    .from('invitados')
    .update(allowed)
    .eq('id', id)
    .select('*, grupo:grupos_evento(id, nombre, color, orden)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { slug, id } = await params
  const payload = verifyToken(extractBearerToken(req.headers.get('authorization')) ?? '')
  if (!payload || payload.slug !== slug) return unauthorized()

  const supabase = createServiceClient()

  // Solo se puede eliminar si estado = 'alta'
  const { data: inv } = await supabase
    .from('invitados')
    .select('estado')
    .eq('id', id)
    .single()

  if (!inv) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  if (inv.estado !== 'alta') {
    return NextResponse.json(
      { error: 'Solo se puede eliminar un invitado en estado "alta"' },
      { status: 422 }
    )
  }

  const { error } = await supabase.from('invitados').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
