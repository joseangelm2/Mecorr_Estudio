'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { compressImage } from '@/lib/compressImage'
import { compressVideo } from '@/lib/compressVideo'

interface Props {
  projectId: string
  projectName: string
}

interface UploadedItem {
  url: string
  mediaType: 'image' | 'video'
}

export default function AlbumUploadClient({ projectId, projectName }: Props) {
  const [ready, setReady] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [uploaded, setUploaded] = useState<UploadedItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        const { error: authError } = await supabase.auth.signInAnonymously()
        if (authError) {
          setError('No se pudo iniciar sesión. Intenta de nuevo.')
          return
        }
      }
      setReady(true)
    })
  }, [])

  async function handleFiles(files: FileList) {
    setUploading(true)
    setError(null)
    const supabase = createClient()

    for (const rawFile of Array.from(files)) {
      try {
        const mediaType: 'image' | 'video' = rawFile.type.startsWith('video') ? 'video' : 'image'

        let file = rawFile
        if (mediaType === 'image') {
          setStatusText('Optimizando foto...')
          file = await compressImage(rawFile).catch(() => rawFile)
        } else {
          setStatusText('Comprimiendo video... esto puede tardar unos segundos')
          file = await compressVideo(rawFile).catch(() => rawFile)
        }
        setStatusText('Subiendo...')

        const ext = file.name.split('.').pop()
        const path = `${projectId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('album-media')
          .upload(path, file)
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('album-media')
          .getPublicUrl(path)

        const { error: insertError } = await supabase
          .from('album_media')
          .insert({ project_id: projectId, media_type: mediaType, url: publicUrl, storage_path: path })
        if (insertError) throw insertError

        setUploaded(prev => [...prev, { url: publicUrl, mediaType }])
      } catch {
        setError('Hubo un problema al subir uno de los archivos. Intenta de nuevo.')
      }
    }

    setUploading(false)
    setStatusText('')
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) handleFiles(e.target.files)
    e.target.value = ''
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ fontSize: '22px', marginBottom: '8px' }}>Álbum digital</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>{projectName}</p>

      <button
        type="button"
        disabled={!ready || uploading}
        onClick={() => inputRef.current?.click()}
        style={{
          padding: '16px 32px',
          borderRadius: '999px',
          border: 'none',
          background: !ready || uploading ? '#ccc' : '#a8686a',
          color: '#fff',
          fontSize: '16px',
          cursor: !ready || uploading ? 'not-allowed' : 'pointer',
        }}
      >
        {uploading ? statusText || 'Subiendo...' : !ready ? 'Preparando...' : 'Subir fotos o video'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      {error && <p style={{ color: '#c0392b', marginTop: '16px' }}>{error}</p>}

      {uploaded.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '32px', width: '100%', maxWidth: '480px' }}>
          {uploaded.map((item, i) => (
            item.mediaType === 'video' ? (
              <video key={i} src={item.url} controls style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '8px' }} />
            ) : (
              <img key={i} src={item.url} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '8px' }} />
            )
          ))}
        </div>
      )}
    </div>
  )
}
