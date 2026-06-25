'use client'

import type { Invitado, GrupoEvento } from '@/types/invitation'

interface Props {
  invitados: Invitado[]
  grupos: GrupoEvento[]
  festejada: string
  eventDate: string
  onAddGrupo: () => void
  onSelectGrupo: (grupoId: string) => void
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div style={{ height: 5, background: '#E7E5E3', borderRadius: 3, overflow: 'hidden' }}>
      <div
        style={{
          height: '100%', borderRadius: 3,
          background: color,
          width: `${pct}%`,
          transition: 'width 400ms ease',
        }}
      />
    </div>
  )
}

export function DashboardTab({ invitados, grupos, festejada, eventDate, onAddGrupo, onSelectGrupo }: Props) {
  const totalPersonas = invitados
    .filter(i => i.estado !== 'baja')
    .reduce((s, i) => s + i.num_invitados, 0)

  const asistiran = invitados
    .filter(i => i.confirmacion === 'SI')
    .reduce((s, i) => s + i.num_invitados, 0)

  const confirmadosPct = totalPersonas > 0 ? Math.round((asistiran / totalPersonas) * 100) : 0

  const date = new Date(eventDate).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ padding: '56px 20px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#1C1917', margin: 0 }}>Dashboard</h1>
        <button
          onClick={onAddGrupo}
          style={{ border: '1.5px solid #7C5C4A', color: '#7C5C4A', background: 'none', borderRadius: 20, padding: '7px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          + Grupo
        </button>
      </div>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#A8A29E', marginTop: 4, marginBottom: 18 }}>
        Fiesta de {festejada} · {date}
      </p>

      {/* Hero card */}
      <div style={{ background: '#7C5C4A', borderRadius: 20, padding: '22px 24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,.55)', margin: '0 0 4px' }}>Total invitados</p>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 44, fontWeight: 700, color: '#fff', margin: 0 }}>{totalPersonas}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,.55)', margin: '0 0 4px' }}>Asistirán</p>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 44, fontWeight: 700, color: '#C4956A', margin: 0 }}>{asistiran}</p>
          </div>
        </div>
        <div style={{ height: 5, background: 'rgba(255,255,255,.15)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 3, background: '#C4956A', width: `${confirmadosPct}%`, transition: 'width 400ms ease' }} />
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 8, marginBottom: 0 }}>
          {confirmadosPct}% confirmados · {grupos.length} grupos
        </p>
      </div>

      {/* Cards por grupo */}
      {grupos.map(grupo => {
        const invs = invitados.filter(i => i.grupo_id === grupo.id && i.estado !== 'baja')
        const totalGrupo = invs.length
        const enviadosGrupo = invs.filter(i => i.estado === 'enviado' || i.estado === 'confirmo').length
        const confirmadosGrupo = invs.filter(i => i.confirmacion === 'SI').length
        const personasGrupo = invs.reduce((s, i) => s + i.num_invitados, 0)

        return (
          <button
            key={grupo.id}
            onClick={() => onSelectGrupo(grupo.id)}
            style={{ width: '100%', background: '#fff', borderRadius: 16, padding: '16px 18px', marginBottom: 10, border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: grupo.color }} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: '#1C1917' }}>{grupo.nombre}</span>
              </div>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#A8A29E' }}>{personasGrupo} personas</span>
            </div>

            <div style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#2563EB' }}>Enviados</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#2563EB' }}>{enviadosGrupo}/{totalGrupo}</span>
              </div>
              <ProgressBar value={enviadosGrupo} max={totalGrupo} color="#2563EB" />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#16A34A' }}>Confirmados</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#16A34A' }}>{confirmadosGrupo}/{enviadosGrupo}</span>
              </div>
              <ProgressBar value={confirmadosGrupo} max={enviadosGrupo} color="#16A34A" />
            </div>
          </button>
        )
      })}

      {grupos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#A8A29E', fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>
          Sin grupos. Usa &ldquo;+ Grupo&rdquo; para crear el primero.
        </div>
      )}
    </div>
  )
}
