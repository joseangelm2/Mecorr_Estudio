'use client'

import { useEffect, useState } from 'react'
import { getAlbumMedia, deleteAlbumMedia, type AlbumMedia } from '@/app/admin/album-actions'
import AlbumQRCode from '@/components/AlbumQRCode'

interface Props {
  projectId: string
  slug: string
}

export default function AlbumMediaAdminPanel({ projectId, slug }: Props) {
  const [items, setItems] = useState<AlbumMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  useEffect(() => {
    getAlbumMedia(projectId).then(data => {
      setItems(data)
      setLoading(false)
    })
  }, [projectId])

  async function handleDelete(item: AlbumMedia) {
    setDeletingId(item.id)
    await deleteAlbumMedia(item.id, item.storage_path)
    setItems(prev => prev.filter(i => i.id !== item.id))
    setDeletingId(null)
  }

  async function handleDownloadZip() {
    setDownloading(true)
    setDownloadError(null)
    try {
      const res = await fetch(`/admin/album/${projectId}/zip`)
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'album-digital.zip'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setDownloadError('No se pudo generar el ZIP. Intenta de nuevo.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col items-center">
        <p className="text-sm font-semibold text-gray-600 mb-4">QR del álbum digital</p>
        <AlbumQRCode slug={slug} />
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Cargando...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400">Aún no hay fotos ni videos subidos.</p>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{items.length} archivo{items.length === 1 ? '' : 's'}</p>
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={downloading}
              className="px-4 py-2 rounded-xl text-sm font-medium border-2 border-rose-400 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? 'Generando ZIP...' : '⬇ Descargar todo (ZIP)'}
            </button>
          </div>
          {downloadError && <p className="text-xs text-red-500">{downloadError}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="relative rounded-xl overflow-hidden border border-gray-100 bg-white group">
              {item.media_type === 'video' ? (
                <video src={item.url} controls className="w-full h-32 object-cover bg-black" />
              ) : (
                <img src={item.url} alt="" className="w-full h-32 object-cover" />
              )}
              <button
                type="button"
                onClick={() => handleDelete(item)}
                disabled={deletingId === item.id}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white text-sm flex items-center justify-center hover:bg-black/70 disabled:opacity-50"
              >
                ✕
              </button>
            </div>
          ))}
          </div>
        </>
      )}
    </div>
  )
}
