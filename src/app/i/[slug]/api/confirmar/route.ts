import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

interface Params { params: Promise<{ slug: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  await params // slug disponible si se necesita validar el evento
  const body = await req.json().catch(() => null)
  const { token, confirmacion, mensaje } = body ?? {}

  if (!token || !['SI', 'NO'].includes(confirmacion)) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: inv } = await supabase
    .from('invitados')
    .select('id, estado')
    .eq('token', token)
    .single()

  if (!inv) return NextResponse.json({ error: 'Token inválido' }, { status: 404 })
  if (!['alta', 'enviado'].includes(inv.estado)) {
    return NextResponse.json({ error: 'El invitado no puede confirmar en este estado' }, { status: 422 })
  }

  const update: Record<string, unknown> = {
    estado: 'confirmo',
    confirmacion,
    fecha_confirmacion: new Date().toISOString(),
  }
  if (confirmacion === 'NO') update.num_invitados = 0
  if (mensaje?.trim())       update.mensaje_felicitacion = mensaje.trim()

  const { data, error } = await supabase
    .from('invitados')
    .update(update)
    .eq('id', inv.id)
    .select('id, titular, confirmacion, num_invitados')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
