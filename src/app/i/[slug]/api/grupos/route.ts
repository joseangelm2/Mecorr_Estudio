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

  const supabase = createServiceClient()
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!project) return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })

  const { data, error } = await supabase
    .from('grupos_evento')
    .select('*')
    .eq('project_id', project.id)
    .order('orden', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const payload = verifyToken(extractBearerToken(req.headers.get('authorization')) ?? '')
  if (!payload || payload.slug !== slug) return unauthorized()

  const body = await req.json().catch(() => null)
  if (!body?.nombre?.trim()) {
    return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!project) return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })

  // Calcular orden del siguiente grupo
  const { count } = await supabase
    .from('grupos_evento')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', project.id)

  const { data, error } = await supabase
    .from('grupos_evento')
    .insert({
      project_id: project.id,
      nombre: body.nombre.trim(),
      color: body.color ?? '#C4956A',
      orden: (count ?? 0) + 1,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
