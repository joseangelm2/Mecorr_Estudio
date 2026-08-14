'use server'

import { createServiceClient } from '@/lib/supabase/service'

export interface AlbumMedia {
  id: string
  project_id: string
  media_type: 'image' | 'video'
  url: string
  storage_path: string
  created_at: string
}

export async function getAlbumMedia(projectId: string): Promise<AlbumMedia[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('album_media')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as AlbumMedia[]
}

export async function deleteAlbumMedia(id: string, storagePath: string): Promise<void> {
  const supabase = createServiceClient()
  await supabase.storage.from('album-media').remove([storagePath])
  const { error } = await supabase.from('album_media').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
