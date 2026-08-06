'use client'

import { useState } from 'react'
import { useGuestContext } from '@/lib/lista/GuestContext'

interface Props {
  festejada: string
  className?: string
}

export function TokenRSVPForm({ festejada, className }: Props) {
  const { titular, status, confirmacion, error, confirm } = useGuestContext()
  const [choice, setChoice] = useState<'SI' | 'NO' | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [sending, setSending] = useState(false)

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          border: '3px solid rgba(124,92,74,.2)',
          borderTopColor: '#7C5C4A',
          animation: 'spin 800ms linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (status === 'blocked') {
    return (
      <div className={className} style={{ textAlign: 'center', padding: '24px 16px' }}>
        <p style={{ fontSize: 36, marginBottom: 12 }}>🔒</p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#DC2626', fontWeight: 600, marginBottom: 8 }}>
          Acceso restringido
        </p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#78716C' }}>
          Esta invitación ya fue abierta en otro dispositivo. Contacta a {festejada} para que te la reenvíe.
        </p>
      </div>
    )
  }

  if (status === 'confirmed') {
    return (
      <div className={className} style={{ textAlign: 'center', padding: '24px 16px' }}>
        <p style={{ fontSize: 40, marginBottom: 12 }}>
          {confirmacion === 'SI' ? '🎉' : '💌'}
        </p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, fontWeight: 700, color: '#1C1917', marginBottom: 8 }}>
          {confirmacion === 'SI' ? '¡Nos vemos!' : 'Gracias por avisarnos'}
        </p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#78716C' }}>
          {confirmacion === 'SI'
            ? `Tu confirmación fue enviada. ¡Te esperamos, ${titular || festejada}!`
            : 'Tu respuesta ha sido registrada.'}
        </p>
      </div>
    )
  }

  async function handleConfirmar() {
    if (!choice || sending) return
    setSending(true)
    await confirm(choice, mensaje)
    setSending(false)
  }

  return (
    <div className={className} style={{ maxWidth: 360, margin: '0 auto', padding: '8px 0' }}>
      {titular && (
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#78716C', marginBottom: 16, textAlign: 'center' }}>
          Hola, <strong style={{ color: '#1C1917' }}>{titular}</strong>
        </p>
      )}

      {/* SI / NO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setChoice('SI')}
          style={{
            padding: '14px 8px', borderRadius: 14, cursor: 'pointer',
            background: choice === 'SI' ? '#16A34A' : '#fff',
            border: `2px solid ${choice === 'SI' ? '#16A34A' : '#E7E5E3'}`,
            color: choice === 'SI' ? '#fff' : '#16A34A',
            fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 700,
            transition: 'all 180ms',
          }}
        >
          ✓ Asistiré
        </button>
        <button
          type="button"
          onClick={() => setChoice('NO')}
          style={{
            padding: '14px 8px', borderRadius: 14, cursor: 'pointer',
            background: choice === 'NO' ? '#1C1917' : '#fff',
            border: `2px solid ${choice === 'NO' ? '#1C1917' : '#E7E5E3'}`,
            color: choice === 'NO' ? '#fff' : '#1C1917',
            fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 700,
            transition: 'all 180ms',
          }}
        >
          ✗ No podré
        </button>
      </div>

      {/* Mensaje opcional */}
      <textarea
        value={mensaje}
        onChange={e => setMensaje(e.target.value.slice(0, 200))}
        placeholder={`Mensaje para ${festejada} (opcional)…`}
        rows={3}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: '#fff', border: '1.5px solid #E7E5E3',
          borderRadius: 12, padding: '12px 14px',
          fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#1C1917',
          resize: 'none', outline: 'none', marginBottom: 4,
        }}
      />
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: '#A8A29E', marginBottom: 12 }}>
        {mensaje.length}/200
      </p>

      {error && (
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#DC2626', marginBottom: 10, textAlign: 'center' }}>
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleConfirmar}
        disabled={!choice || sending}
        style={{
          width: '100%', padding: '14px', borderRadius: 12, border: 'none',
          background: choice && !sending ? '#7C5C4A' : '#D1CEC8',
          color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600,
          cursor: choice && !sending ? 'pointer' : 'not-allowed',
          transition: 'background 180ms',
        }}
      >
        {sending ? 'Enviando…' : 'Enviar confirmación'}
      </button>
    </div>
  )
}
