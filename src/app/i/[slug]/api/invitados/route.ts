import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { extractBearerToken, verifyToken } from '@/lib/lista/auth'

interface Params { params: Promise<{ slug: string }> }

function unauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}

export async function GET(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const payload = verifyToken(extractBearerToken(req.headers.get('authorization')) ?? '')
  if (!payload || payload.slug !== slug) return unauthorized()

  const { searchParams } = new URL(req.url)
  const grupo = searchParams.get('grupo_id')
  const estado = searchParams.get('estado')

  const supabase = createServiceClient()

  // Obtener project_id desde slug
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!project) return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })

  let query = supabase
    .from('invitados')
    .select('*, grupo:grupos_evento(id, nombre, color, orden)')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })

  if (grupo) query = query.eq('grupo_id', grupo)
  if (estado) query = query.eq('estado', estado)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const payload = verifyToken(extractBearerToken(req.headers.get('authorization')) ?? '')
  if (!payload || payload.slug !== slug) return unauthorized()

  const body = await req.json().catch(() => null)
  const { titular, grupo_id, num_invitados, whatsapp } = body ?? {}

  if (!titular || !grupo_id || !num_invitados) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!project) return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })

  const { data, error } = await supabase
    .from('invitados')
    .insert({
      project_id: project.id,
      grupo_id,
      titular: titular.trim(),
      num_invitados: Number(num_invitados),
      whatsapp: whatsapp?.trim() || null,
    })
    .select('*, grupo:grupos_evento(id, nombre, color, orden)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
