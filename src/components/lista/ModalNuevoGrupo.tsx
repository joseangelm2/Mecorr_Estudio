'use client'

import { useState } from 'react'

const COLORES = ['#8B6FB3', '#B55B5B', '#5B9AB5', '#7BA673', '#B5A05B', '#A8627A']

interface Props {
  onClose: () => void
  onSave: (nombre: string, color: string) => Promise<void>
}

export function ModalNuevoGrupo({ onClose, onSave }: Props) {
  const [nombre, setNombre] = useState('')
  const [color, setColor] = useState(COLORES[0])
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    if (!nombre.trim()) return
    setLoading(true)
    try {
      await onSave(nombre.trim(), color)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(28,25,23,.45)', display: 'flex', alignItems: 'flex-end' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#fff', borderRadius: '28px 28px 44px 44px', width: '100%', maxWidth: 480, margin: '0 auto', padding: '0 20px 32px', animation: 'slideUp 260ms cubic-bezier(.32,1,.28,1)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 14, paddingBottom: 8 }}>
          <div style={{ width: 36, height: 4, background: '#E7E5E3', borderRadius: 2 }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#1C1917', margin: 0 }}>Nuevo grupo</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: '#F7F5F2', border: 'none', cursor: 'pointer', fontSize: 16, color: '#78716C' }}>×</button>
        </div>

        {/* Nombre */}
        <label style={{ display: 'block', marginBottom: 20 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600, color: '#A8A29E', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Nombre</span>
          <input
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Ej. Compañeros de trabajo"
            style={{ width: '100%', boxSizing: 'border-box', background: '#F7F5F2', border: 'none', borderRadius: 14, padding: '14px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#1C1917', outline: 'none' }}
          />
        </label>

        {/* Color swatches */}
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600, color: '#A8A29E', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Color</span>
          <div style={{ display: 'flex', gap: 10 }}>
            {COLORES.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: 40, height: 40, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer',
                  transform: color === c ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: color === c ? `0 0 0 3px #fff, 0 0 0 5px ${c}` : 'none',
                  transition: 'all 150ms',
                }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        {nombre && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '10px 14px', background: '#F7F5F2', borderRadius: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#1C1917' }}>{nombre}</span>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={!nombre.trim() || loading}
          style={{ width: '100%', padding: 17, borderRadius: 16, border: 'none', background: nombre.trim() && !loading ? '#7C5C4A' : '#C8C3BC', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, cursor: nombre.trim() && !loading ? 'pointer' : 'not-allowed' }}
        >
          {loading ? 'Creando…' : 'Crear grupo'}
        </button>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(110%); } to { transform: translateY(0); } }`}</style>
    </div>
  )
}
