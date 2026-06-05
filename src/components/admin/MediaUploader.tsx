'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  projectId: string
  bucket: 'invitation-media' | 'invitation-audio'
  onUploadComplete: (url: string) => void
  accept?: string
  label?: string
}

export default function MediaUploader({ projectId, bucket, onUploadComplete, accept = 'image/*', label = 'Subir archivo' }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `${projectId}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)

      onUploadComplete(publicUrl)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al subir archivo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100 disabled:opacity-50"
      />
      {uploading && <p className="text-xs text-gray-500 mt-1">Subiendo...</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
