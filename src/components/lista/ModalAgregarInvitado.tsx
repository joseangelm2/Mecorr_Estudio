'use client'

import { useState, useEffect } from 'react'
import type { GrupoEvento, Invitado } from '@/types/invitation'

interface Props {
  grupos: GrupoEvento[]
  editing: Invitado | null
  onClose: () => void
  onSave: (data: {
    titular: string
    grupo_id: string
    num_invitados: number
    whatsapp: string
  }) => Promise<void>
}

export function ModalAgregarInvitado({ grupos, editing, onClose, onSave }: Props) {
  const [titular, setTitular] = useState(editing?.titular ?? '')
  const [grupoId, setGrupoId] = useState(editing?.grupo_id ?? grupos[0]?.id ?? '')
  const [numInv, setNumInv] = useState(editing?.num_invitados ?? 1)
  const [whatsapp, setWhatsapp] = useState(editing?.whatsapp ?? '')
  const [loading, setLoading] = useState(false)

  // Sincroniza el formulario cuando cambia el invitado a editar
  useEffect(() => {
    if (!editing) return
    const id = setTimeout(() => {
      setTitular(editing.titular)
      setGrupoId(editing.grupo_id)
      setNumInv(editing.num_invitados)
      setWhatsapp(editing.whatsapp ?? '')
    }, 0)
    return () => clearTimeout(id)
  }, [editing])

  async function handleSave() {
    if (!titular.trim() || !grupoId) return
    setLoading(true)
    try {
      await onSave({ titular: titular.trim(), grupo_id: grupoId, num_invitados: numInv, whatsapp: whatsapp.trim() })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const canSave = titular.trim().length > 0 && grupoId

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(28,25,23,.45)',
        display: 'flex', alignItems: 'flex-end',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '28px 28px 44px 44px',
          width: '100%',
          maxWidth: 480,
          margin: '0 auto',
          padding: '0 20px 32px',
          animation: 'slideUp 260ms cubic-bezier(.32,1,.28,1)',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 14, paddingBottom: 8 }}>
          <div style={{ width: 36, height: 4, background: '#E7E5E3', borderRadius: 2 }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#1C1917', margin: 0 }}>
            {editing ? 'Editar invitado' : 'Agregar invitado'}
          </h2>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: '50%', background: '#F7F5F2', border: 'none', cursor: 'pointer', fontSize: 16, color: '#78716C' }}
          >
            ×
          </button>
        </div>

        {/* Titular */}
        <label style={{ display: 'block', marginBottom: 16 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600, color: '#A8A29E', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
            Titular
          </span>
          <input
            value={titular}
            onChange={e => setTitular(e.target.value)}
            placeholder="Juan Pérez o Familia García"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#F7F5F2', border: 'none', borderRadius: 14,
              padding: '14px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#1C1917',
              outline: 'none',
            }}
          />
        </label>

        {/* Selector de grupo */}
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600, color: '#A8A29E', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
            Grupo
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {grupos.map(g => (
              <button
                key={g.id}
                onClick={() => setGrupoId(g.id)}
                style={{
                  padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  background: grupoId === g.id ? '#7C5C4A' : '#F7F5F2',
                  color: grupoId === g.id ? '#fff' : '#78716C',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600,
                  transition: 'all 150ms',
                }}
              >
                {g.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Stepper de invitados */}
        <div style={{ marginBottom: 24 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600, color: '#A8A29E', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
            Número de invitados
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button
              onClick={() => setNumInv(n => Math.max(1, n - 1))}
              style={{ width: 40, height: 40, borderRadius: '50%', background: '#E7E5E3', border: 'none', cursor: 'pointer', fontSize: 20, color: '#78716C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              −
            </button>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: '#1C1917', minWidth: 32, textAlign: 'center' }}>
              {numInv}
            </span>
            <button
              onClick={() => setNumInv(n => n + 1)}
              style={{ width: 40, height: 40, borderRadius: '50%', background: '#7C5C4A', border: 'none', cursor: 'pointer', fontSize: 20, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              +
            </button>
          </div>
        </div>

        {/* WhatsApp */}
        <label style={{ display: 'block', marginBottom: 24 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600, color: '#A8A29E', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
            WhatsApp (opcional)
          </span>
          <input
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)}
            placeholder="+52 55 1234 5678"
            type="tel"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#F7F5F2', border: 'none', borderRadius: 14,
              padding: '14px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#1C1917',
              outline: 'none',
            }}
          />
        </label>

        {/* CTA */}
        <button
          onClick={handleSave}
          disabled={!canSave || loading}
          style={{
            width: '100%', padding: 17, borderRadius: 16, border: 'none',
            background: canSave && !loading ? '#7C5C4A' : '#C8C3BC',
            color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600,
            cursor: canSave && !loading ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? 'Guardando…' : editing ? 'Guardar cambios' : 'Guardar invitado'}
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(110%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
