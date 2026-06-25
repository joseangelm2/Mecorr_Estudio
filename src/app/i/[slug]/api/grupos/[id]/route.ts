import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { extractBearerToken, verifyToken } from '@/lib/lista/auth'

interface Params { params: Promise<{ slug: string; id: string }> }

function unauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { slug, id } = await params
  const payload = verifyToken(extractBearerToken(req.headers.get('authorization')) ?? '')
  if (!payload || payload.slug !== slug) return unauthorized()

  const body = await req.json().catch(() => ({}))
  const allowed: Record<string, unknown> = {}
  if (body.nombre) allowed.nombre = String(body.nombre).trim()
  if (body.color)  allowed.color  = body.color

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('grupos_evento')
    .update(allowed)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { slug, id } = await params
  const payload = verifyToken(extractBearerToken(req.headers.get('authorization')) ?? '')
  if (!payload || payload.slug !== slug) return unauthorized()

  const supabase = createServiceClient()

  // No eliminar si tiene invitados
  const { count } = await supabase
    .from('invitados')
    .select('*', { count: 'exact', head: true })
    .eq('grupo_id', id)

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: 'No se puede eliminar un grupo con invitados asociados' },
      { status: 422 }
    )
  }

  const { error } = await supabase.from('grupos_evento').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
