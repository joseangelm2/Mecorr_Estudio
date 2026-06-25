import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createServiceClient } from '@/lib/supabase/service'
import { signToken } from '@/lib/lista/auth'

interface Params {
  params: Promise<{ slug: string }>
}

export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const body = await req.json().catch(() => null)
  const pin: string | undefined = body?.pin

  if (!pin || !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: 'PIN inválido' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: project, error } = await supabase
    .from('projects')
    .select('id, pin_admin, tiene_lista_invitados')
    .eq('slug', slug)
    .single()

  if (error || !project || !project.tiene_lista_invitados || !project.pin_admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const valid = await bcrypt.compare(pin, project.pin_admin)
  if (!valid) {
    return NextResponse.json({ error: 'PIN incorrecto' }, { status: 401 })
  }

  const token = signToken(slug)
  return NextResponse.json({ token })
}
