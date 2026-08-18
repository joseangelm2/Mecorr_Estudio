import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { extractBearerToken, verifyToken } from '@/lib/lista/auth'
import Papa from 'papaparse'

interface Params { params: Promise<{ slug: string }> }

interface CsvRow {
  Titular?: string
  Grupo?: string
  'Num. Invitados'?: string
  WhatsApp?: string
  [key: string]: string | undefined
}

export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const payload = verifyToken(extractBearerToken(req.headers.get('authorization')) ?? '')
  if (!payload || payload.slug !== slug) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const formData = await req.formData().catch(() => null)
  if (!formData) return NextResponse.json({ error: 'FormData requerido' }, { status: 400 })

  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })

  const text = await file.text()
  const parsed = Papa.parse<CsvRow>(text, { header: true, skipEmptyLines: true })

  const supabase = createServiceClient()
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!project) return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })

  // Cargar grupos existentes
  const { data: gruposExistentes } = await supabase
    .from('grupos_evento')
    .select('id, nombre')
    .eq('project_id', project.id)

  const grupoMap = new Map<string, string>(
    (gruposExistentes ?? []).map(g => [g.nombre.toLowerCase(), g.id])
  )

  const errors: { row: number; reason: string }[] = []
  const toInsert: object[] = []
  const newGroups: string[] = []

  for (let i = 0; i < parsed.data.length; i++) {
    const row = parsed.data[i]
    const titular = row.Titular?.trim()
    const grupoNombre = row.Grupo?.trim()
    const numInv = parseInt(row['Num. Invitados'] ?? '1', 10)

    if (!titular) {
      errors.push({ row: i + 2, reason: 'Titular vacío' })
      continue
    }
    if (!grupoNombre) {
      errors.push({ row: i + 2, reason: 'Grupo vacío' })
      continue
    }
    if (isNaN(numInv) || numInv < 1) {
      errors.push({ row: i + 2, reason: 'Num. Invitados inválido' })
      continue
    }

    if (!grupoMap.has(grupoNombre.toLowerCase())) {
      newGroups.push(grupoNombre)
    }

    toInsert.push({ titular, grupoNombre, numInv, whatsapp: row.WhatsApp?.trim() || null })
  }

  // Crear grupos faltantes
  const uniqueNew = [...new Set(newGroups)]
  const { count: currentCount } = await supabase
    .from('grupos_evento')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', project.id)

  let orden = (currentCount ?? 0) + 1
  for (const nombre of uniqueNew) {
    const { data: newGrupo } = await supabase
      .from('grupos_evento')
      .insert({ project_id: project.id, nombre, orden: orden++ })
      .select('id, nombre')
      .single()

    if (newGrupo) grupoMap.set(nombre.toLowerCase(), newGrupo.id)
  }

  // Insertar invitados válidos
  const inserts = toInsert
    .filter(r => grupoMap.has((r as { grupoNombre: string }).grupoNombre.toLowerCase()))
    .map(r => {
      const row = r as { titular: string; grupoNombre: string; numInv: number; whatsapp: string | null }
      return {
        project_id: project.id,
        grupo_id: grupoMap.get(row.grupoNombre.toLowerCase())!,
        titular: row.titular,
        num_invitados: row.numInv,
        whatsapp: row.whatsapp,
      }
    })

  let inserted = 0
  if (inserts.length > 0) {
    const { data } = await supabase.from('invitados').insert(inserts).select('id')
    inserted = data?.length ?? 0
  }

  return NextResponse.json({
    inserted,
    newGroups: uniqueNew,
    errors,
    summary: `${inserted} invitados importados, ${uniqueNew.length} grupos nuevos, ${errors.length} filas con error`,
  })
}
