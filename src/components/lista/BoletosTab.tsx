'use client'

import type { Invitado } from '@/types/invitation'

interface Props {
  invitados: Invitado[]
  slug: string
  festejada: string
  authHeader: () => Record<string, string>
}

export function BoletosTab({ invitados, slug, festejada, authHeader }: Props) {
  void festejada
  const confirmados = invitados.filter(i => i.confirmacion === 'SI')

  async function descargarTodos() {
    const res = await fetch(`/i/${slug}/admin/boletos`, { headers: authHeader() })
    if (!res.ok) return
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `boletos-${slug}.pdf`
    a.click()
  }

  async function descargarIndividual(inv: Invitado) {
    const res = await fetch(`/i/${slug}/admin/boletos/${inv.id}`, { headers: authHeader() })
    if (!res.ok) return
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `boleto-${inv.titular.replace(/\s+/g, '-')}.pdf`
    a.click()
  }

  return (
    <div style={{ padding: '56px 20px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#1C1917', margin: 0 }}>Boletos</h1>
        {confirmados.length > 0 && (
          <button
            onClick={descargarTodos}
            style={{ background: '#7C5C4A', color: '#fff', border: 'none', borderRadius: 20, padding: '7px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            ⬇ Todos
          </button>
        )}
      </div>

      {confirmados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#A8A29E', fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>
          <p style={{ fontSize: 40, margin: '0 0 12px' }}>🎫</p>
          <p style={{ margin: 0, fontWeight: 600 }}>Sin confirmaciones aún</p>
          <p style={{ margin: '6px 0 0', fontSize: 12 }}>Los boletos aparecen cuando los invitados confirman asistencia</p>
        </div>
      ) : (
        confirmados.map(inv => (
          <div
            key={inv.id}
            style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 14, flexShrink: 0 }}>
              {inv.titular.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: '#1C1917', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {inv.titular}
              </p>
              <p style={{ margin: 0, fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#78716C' }}>
                {inv.grupo?.nombre ?? '—'} · {inv.num_invitados} asientos
              </p>
            </div>
            <button
              onClick={() => descargarIndividual(inv)}
              style={{ width: 36, height: 36, borderRadius: 10, background: '#FEF3C7', border: 'none', cursor: 'pointer', color: '#D97706', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              title="Descargar boleto"
            >
              🎫
            </button>
          </div>
        ))
      )}
    </div>
  )
}
