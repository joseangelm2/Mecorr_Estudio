import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

interface Params { params: Promise<{ slug: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  await params
  const body = await req.json().catch(() => null)
  const { token, mensaje } = body ?? {}

  if (!token || !mensaje?.trim()) {
    return NextResponse.json({ error: 'Token y mensaje requeridos' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('invitados')
    .update({ mensaje_felicitacion: mensaje.trim() })
    .eq('token', token)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
