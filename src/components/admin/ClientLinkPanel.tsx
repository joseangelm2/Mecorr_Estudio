'use client'

import { useState, useTransition } from 'react'
import { ensureClientLink, regenerateClientLink, setClientLinkOpen } from '@/app/admin/client-link-actions'
import type { ClientLinkRow } from '@/lib/registro/link'

interface Props {
  projectId: string
  clientName: string
  initial: ClientLinkRow | null
  /** Música que sugirió el cliente (extra_config.musica_sugerida). */
  music?: { cancion: string; enlace: string } | null
}

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }) : null

export function ClientLinkPanel({ projectId, clientName, initial, music }: Props) {
  const [link, setLink] = useState<ClientLinkRow | null>(initial)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  // Base pública del sitio (ngrok en desarrollo, el dominio real en producción); si no está definida, el origen actual.
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/+$/, '') || (typeof window !== 'undefined' ? window.location.origin : '')
  const url = link && base ? `${base}/registro/${link.token}` : ''

  function run(fn: () => Promise<ClientLinkRow | void>) {
    setError(null)
    start(async () => {
      try {
        const res = await fn()
        if (res) setLink(res)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Algo salió mal')
      }
    })
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      setError('No se pudo copiar; selecciona el enlace y cópialo a mano.')
      return
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const whatsapp = url
    ? `https://wa.me/?text=${encodeURIComponent(`Hola, para tu invitación digital necesitamos tus datos. Llena este formulario cuando puedas: ${url}`)}`
    : ''

  return (
    <section className="mb-6 rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Formulario para el cliente</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Comparte este enlace con {clientName}: llena sus datos y se guardan aquí como borrador.
          </p>
        </div>
        {link?.submitted_at && (
          <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
            Datos enviados
          </span>
        )}
      </div>

      {!link ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => ensureClientLink(projectId))}
          className="mt-4 rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-60"
        >
          Generar enlace
        </button>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <input readOnly value={url} onFocus={e => e.currentTarget.select()} className="min-w-0 flex-1 basis-full sm:basis-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700" />
            <button type="button" onClick={copy} className="shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
            <a href={whatsapp} target="_blank" rel="noreferrer" className="shrink-0 rounded-xl bg-green-500 px-3 py-2 text-xs font-medium text-white hover:bg-green-600">
              WhatsApp
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className={link.open ? 'text-green-600' : 'text-gray-400'}>● {link.open ? 'Abierto' : 'Cerrado'}</span>
            {fmt(link.last_saved_at) && <span>Último guardado: {fmt(link.last_saved_at)}</span>}
            {fmt(link.submitted_at) && <span>Enviado: {fmt(link.submitted_at)}</span>}
          </div>

          {link.pdf_path && (
            <a
              href={`/admin/projects/${projectId}/respuestas-pdf`}
              download
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50"
            >
              ⬇ Descargar respuestas del cliente (PDF)
              {fmt(link.pdf_generated_at) && <span className="font-normal text-gray-400">· {fmt(link.pdf_generated_at)}</span>}
            </a>
          )}

          <div className="flex gap-4 text-xs">
            <button
              type="button"
              disabled={pending}
              onClick={() => run(async () => { await setClientLinkOpen(projectId, !link.open); setLink({ ...link, open: !link.open }) })}
              className="font-medium text-gray-600 hover:text-gray-900"
            >
              {link.open ? 'Cerrar enlace' : 'Reabrir enlace'}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                if (confirm('El enlace anterior dejará de funcionar. ¿Generar uno nuevo?')) run(() => regenerateClientLink(projectId))
              }}
              className="font-medium text-gray-600 hover:text-gray-900"
            >
              Regenerar enlace
            </button>
          </div>
        </div>
      )}
      {music && (music.cancion || music.enlace) && (
        <p className="mt-3 text-xs text-gray-700">
          <span className="font-medium">Música sugerida por el cliente:</span> {music.cancion}
          {music.enlace && (
            <>
              {' '}
              <a href={music.enlace} target="_blank" rel="noreferrer noopener" className="text-rose-600 underline">
                abrir enlace
              </a>
            </>
          )}
        </p>
      )}
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
    </section>
  )
}
