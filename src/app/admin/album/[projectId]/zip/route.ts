import { NextResponse } from 'next/server'
import JSZip from 'jszip'
import { createServiceClient } from '@/lib/supabase/service'

interface Params { params: Promise<{ projectId: string }> }

export async function GET(_req: Request, { params }: Params) {
  const { projectId } = await params
  const supabase = createServiceClient()

  const [{ data: project }, { data: items }] = await Promise.all([
    supabase.from('projects').select('quinceanera_name').eq('id', projectId).single(),
    supabase.from('album_media').select('*').eq('project_id', projectId).order('created_at', { ascending: true }),
  ])

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'No hay archivos en el álbum' }, { status: 404 })
  }

  const zip = new JSZip()

  await Promise.all(
    items.map(async (item, i) => {
      const { data: blob } = await supabase.storage.from('album-media').download(item.storage_path)
      if (!blob) return
      const ext = item.storage_path.split('.').pop()
      const name = `${String(i + 1).padStart(3, '0')}-${item.media_type}.${ext}`
      zip.file(name, await blob.arrayBuffer())
    })
  )

  const zipBuffer = await zip.generateAsync({ type: 'uint8array' })

  const slugName = (project?.quinceanera_name ?? 'album').replace(/\s+/g, '-')
  return new NextResponse(zipBuffer as BodyInit, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="album-${slugName}.zip"`,
    },
  })
}
