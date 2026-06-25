'use client'

import { useEffect, useState } from 'react'
import type { LocationInfo } from '@/types/invitation'
import { buildAdminNotifUrl } from '@/lib/lista/whatsapp'

type Screen = 'loading' | 'blocked' | 'invitation' | 'rsvp' | 'success'

interface Props {
  slug: string
  token: string | null
  festejada: string
  eventDate: string
  ceremony: LocationInfo | null
  rsvpPhone: string
  tieneListaInvitados: boolean
}

export function InvitacionGuest({ slug, token, festejada, eventDate, ceremony, rsvpPhone, tieneListaInvitados }: Props) {
  const [screen, setScreen] = useState<Screen>(() =>
    !tieneListaInvitados || !token ? 'invitation' : 'loading'
  )
  const [titular, setTitular] = useState('')
  const [rsvpChoice, setRsvpChoice] = useState<'SI' | 'NO' | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [sending, setSending] = useState(false)

  const date = new Date(eventDate).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  useEffect(() => {
    if (!tieneListaInvitados || !token) return

    async function verificar() {
      const deviceId = localStorage.getItem(`device_id_${slug}`)
      const url = `/i/${slug}/api/verificar-dispositivo?token=${token}${deviceId ? `&device_id=${deviceId}` : ''}`
      const res = await fetch(url)
      const json = await res.json()

      if (!json.allowed) {
        setScreen('blocked')
        return
      }

      if (json.firstTime) {
        const newDeviceId = crypto.randomUUID()
        localStorage.setItem(`device_id_${slug}`, newDeviceId)

        await fetch(`/i/${slug}/api/invitados/${json.invitadoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ device_id: newDeviceId }),
        })
      }

      setTitular(json.titular ?? '')
      setScreen('invitation')
    }

    verificar()
  }, [slug, token, tieneListaInvitados])

  async function handleConfirmar() {
    if (!rsvpChoice || sending) return
    setSending(true)

    const res = await fetch(`/i/${slug}/api/confirmar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, confirmacion: rsvpChoice, mensaje }),
    })

    if (res.ok) {
      // Notificar al admin por WhatsApp
      const waUrl = buildAdminNotifUrl(rsvpPhone, titular || 'Un invitado', rsvpChoice, festejada, mensaje)
      window.open(waUrl, '_blank')
      setScreen('success')
    }
    setSending(false)
  }

  if (screen === 'loading') {
    return (
      <div style={{ minHeight: '100dvh', background: '#1C1917', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 28, height: 28, border: '3px solid rgba(196,149,106,.3)', borderTopColor: '#C4956A', borderRadius: '50%', animation: 'spin 800ms linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (screen === 'blocked') {
    return (
      <div style={{ minHeight: '100dvh', background: '#1C1917', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 48, margin: '0 0 20px' }}>🔒</p>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#F0EBE5', margin: '0 0 12px' }}>Acceso restringido</h2>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(240,235,229,.55)', maxWidth: 280, lineHeight: 1.6, margin: '0 0 24px' }}>
          Esta invitación ya fue abierta en otro dispositivo. Si necesitas acceso, contacta a {festejada}.
        </p>
      </div>
    )
  }

  if (screen === 'invitation') {
    return (
      <div style={{ minHeight: '100dvh', background: '#1C1917', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Ornamento */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 40, height: 1, background: 'rgba(196,149,106,.4)' }} />
          <span style={{ color: '#C4956A', fontSize: 14 }}>✦</span>
          <div style={{ width: 40, height: 1, background: 'rgba(196,149,106,.4)' }} />
        </div>

        {/* Label */}
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(196,149,106,.6)', marginBottom: 8 }}>Te invitamos a los</p>

        {/* XV */}
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 56, fontWeight: 700, color: '#F0EBE5', margin: '0 0 4px' }}>XV</h1>

        {/* "años de" */}
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(196,149,106,.6)', marginBottom: 8 }}>años de</p>

        {/* Nombre festejada */}
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, fontWeight: 700, color: '#C4956A', marginBottom: 16, textAlign: 'center' }}>
          {festejada}
        </h2>

        {/* Saludo personalizado */}
        {titular && (
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(240,235,229,.45)', marginBottom: 24, textAlign: 'center' }}>
            Hola, <span style={{ color: '#F0EBE5', fontWeight: 600 }}>{titular}</span>
          </p>
        )}

        {/* Card de detalles */}
        {ceremony && (
          <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(196,149,106,.12)', borderRadius: 18, padding: '18px 20px', width: '100%', maxWidth: 340, marginBottom: 32 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
              <span style={{ color: '#C4956A', fontSize: 16, marginTop: 2 }}>📅</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500, color: '#F0EBE5', textTransform: 'capitalize' }}>{date}</span>
            </div>
            {ceremony.time && (
              <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                <span style={{ color: '#C4956A', fontSize: 16, marginTop: 2 }}>🕖</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500, color: '#F0EBE5' }}>{ceremony.time}</span>
              </div>
            )}
            {ceremony.venue && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: '#C4956A', fontSize: 16, marginTop: 2 }}>📍</span>
                <div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500, color: '#F0EBE5', margin: 0 }}>{ceremony.venue}</p>
                  {ceremony.address && (
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(240,235,229,.5)', margin: '2px 0 0' }}>{ceremony.address}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CTA RSVP */}
        {(token || tieneListaInvitados) && (
          <button
            onClick={() => setScreen('rsvp')}
            style={{ background: '#C4956A', color: '#fff', border: 'none', borderRadius: 16, padding: '15px 32px', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', maxWidth: 320 }}
          >
            Confirmar asistencia
          </button>
        )}
      </div>
    )
  }

  if (screen === 'rsvp') {
    return (
      <div style={{ minHeight: '100dvh', background: '#F7F5F2', padding: '24px 20px' }}>
        {/* Back */}
        <button
          onClick={() => setScreen('invitation')}
          style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,.08)', cursor: 'pointer', fontSize: 18, color: '#1C1917', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ←
        </button>

        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#1C1917', marginBottom: 4 }}>Confirmación</h2>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#78716C', marginBottom: 24 }}>
          ¿Asistirás{titular ? `, ${titular}` : ''}?
        </p>

        {/* YES / NO */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {/* YES */}
          <button
            onClick={() => setRsvpChoice('SI')}
            style={{
              padding: '22px 14px', borderRadius: 20, cursor: 'pointer',
              background: rsvpChoice === 'SI' ? '#16A34A' : '#fff',
              border: `2px solid ${rsvpChoice === 'SI' ? '#16A34A' : '#E7E5E3'}`,
              boxShadow: rsvpChoice === 'SI' ? '0 6px 24px rgba(22,163,74,.28)' : 'none',
              transition: 'all 200ms',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: rsvpChoice === 'SI' ? 'rgba(255,255,255,.2)' : '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>✓</div>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700, color: rsvpChoice === 'SI' ? '#fff' : '#16A34A' }}>Sí asistiré</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: rsvpChoice === 'SI' ? 'rgba(255,255,255,.7)' : '#A8A29E' }}>Con gusto</span>
          </button>

          {/* NO */}
          <button
            onClick={() => setRsvpChoice('NO')}
            style={{
              padding: '22px 14px', borderRadius: 20, cursor: 'pointer',
              background: rsvpChoice === 'NO' ? '#1C1917' : '#fff',
              border: `2px solid ${rsvpChoice === 'NO' ? '#1C1917' : '#E7E5E3'}`,
              transition: 'all 200ms',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: rsvpChoice === 'NO' ? 'rgba(255,255,255,.1)' : '#F5F5F4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: rsvpChoice === 'NO' ? '#fff' : '#A8A29E' }}>✗</div>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700, color: rsvpChoice === 'NO' ? '#fff' : '#1C1917' }}>No podré</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: rsvpChoice === 'NO' ? 'rgba(255,255,255,.5)' : '#A8A29E' }}>Lo siento</span>
          </button>
        </div>

        {/* Mensaje opcional */}
        <label style={{ display: 'block', marginBottom: 24 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600, color: '#A8A29E', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
            Mensaje de felicitación (opcional)
          </span>
          <textarea
            value={mensaje}
            onChange={e => setMensaje(e.target.value.slice(0, 200))}
            placeholder={`Escribe un mensaje para ${festejada}…`}
            rows={3}
            style={{ width: '100%', boxSizing: 'border-box', background: '#fff', border: '1.5px solid #E7E5E3', borderRadius: 14, padding: '14px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#1C1917', outline: 'none', resize: 'none' }}
          />
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: '#A8A29E' }}>{mensaje.length}/200</span>
        </label>

        {/* CTA Enviar */}
        <button
          onClick={handleConfirmar}
          disabled={!rsvpChoice || sending}
          style={{
            width: '100%', padding: 18, borderRadius: 16, border: 'none',
            background: rsvpChoice && !sending ? '#7C5C4A' : '#D1CEC8',
            color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600,
            cursor: rsvpChoice && !sending ? 'pointer' : 'not-allowed',
          }}
        >
          {sending ? 'Enviando…' : 'Enviar confirmación'}
        </button>
      </div>
    )
  }

  // success
  return (
    <div style={{ minHeight: '100dvh', background: '#F7F5F2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', animation: 'fadeIn 300ms ease' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 20, animation: 'popIn 450ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}>✓</div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: '#1C1917', marginBottom: 8 }}>
        {rsvpChoice === 'SI' ? '¡Nos vemos!' : 'Gracias por avisarnos'}
      </h2>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#78716C', maxWidth: 280, lineHeight: 1.6 }}>
        {rsvpChoice === 'SI'
          ? `Tu confirmación fue enviada a ${festejada}. ¡Te esperamos!`
          : `Tu respuesta fue enviada a ${festejada}.`}
      </p>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { transform: scale(.6); } to { transform: scale(1); } }
      `}</style>
    </div>
  )
}
