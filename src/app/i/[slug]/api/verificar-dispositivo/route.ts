import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

interface Params { params: Promise<{ slug: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const { searchParams } = new URL(req.url)
  const token     = searchParams.get('token')
  const deviceId  = searchParams.get('device_id')

  if (!token) {
    return NextResponse.json({ error: 'Token requerido' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: inv } = await supabase
    .from('invitados')
    .select('id, device_id, titular, estado')
    .eq('token', token)
    .single()

  if (!inv) {
    return NextResponse.json({ allowed: false, reason: 'token_invalid' })
  }

  if (inv.estado === 'baja') {
    return NextResponse.json({ allowed: false, reason: 'given_up' })
  }

  // Primera vez: sin device_id en DB → vinculamos el dispositivo aquí mismo
  if (!inv.device_id) {
    if (deviceId) {
      const update: Record<string, unknown> = { device_id: deviceId }
      if (inv.estado === 'alta') {
        update.estado = 'enviado'
        update.fecha_envio = new Date().toISOString()
      }
      await supabase.from('invitados').update(update).eq('id', inv.id)
    }
    return NextResponse.json({ allowed: true, firstTime: true, invitadoId: inv.id, titular: inv.titular })
  }

  // Mismo dispositivo
  if (deviceId && inv.device_id === deviceId) {
    return NextResponse.json({ allowed: true, firstTime: false, invitadoId: inv.id, titular: inv.titular })
  }

  // Dispositivo diferente → bloquear
  return NextResponse.json({ allowed: false, reason: 'device_mismatch' })
}
