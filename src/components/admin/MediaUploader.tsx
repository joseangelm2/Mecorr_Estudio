'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  projectId: string
  bucket: 'invitation-media' | 'invitation-audio'
  onUploadComplete: (url: string) => void
  accept?: string
  label?: string
}

export default function MediaUploader({
  projectId,
  bucket,
  onUploadComplete,
  accept = 'image/*',
  label = 'Subir archivo',
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function upload(file: File) {
    setUploading(true)
    setError(null)
    setProgress(10)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `${projectId}/${Date.now()}.${ext}`

      setProgress(40)

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file)

      if (uploadError) throw uploadError

      setProgress(90)

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)

      setProgress(100)
      onUploadComplete(publicUrl)

      setTimeout(() => {
        setUploading(false)
        setProgress(0)
      }, 600)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al subir archivo')
      setUploading(false)
      setProgress(0)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) upload(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) upload(file)
  }

  const isImage = accept === 'image/*'
  const isAudio = accept === 'audio/*'
  const isVideo = accept === 'video/*'

  const icon = isAudio ? '♪' : isVideo ? '▶' : '↑'
  const hint = isAudio ? 'MP3, WAV' : isVideo ? 'MP4, MOV' : 'JPG, PNG, WebP'

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`w-full border-2 border-dashed rounded-xl px-4 py-4 text-center transition-all cursor-pointer ${
          dragOver
            ? 'border-rose-400 bg-rose-50'
            : uploading
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-200 hover:border-rose-300 hover:bg-rose-50/40'
        }`}
      >
        {uploading ? (
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Subiendo...</p>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-1.5 bg-rose-400 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2.5 text-gray-400">
            <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold">{icon}</span>
            <span className="text-sm">{label} <span className="text-gray-300">— {hint}</span></span>
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={uploading}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}
