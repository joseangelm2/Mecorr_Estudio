'use client'

import { useEffect, useState } from 'react'

export interface NavCandidate {
  id: string
  label: string
}

interface Props {
  candidates: NavCandidate[]
  colorVar?: string
}

export default function FloatingSectionNav({ candidates, colorVar = 'var(--inv-primary, #b08968)' }: Props) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<NavCandidate[]>([])

  useEffect(() => {
    setItems(candidates.filter(s => document.getElementById(s.id)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 9999 }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Cerrar menú' : 'Ver secciones'}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: 'none',
          background: colorVar,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          cursor: 'pointer',
        }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: -1 }}
          />
          <div
            style={{
              marginTop: '10px',
              background: '#fff',
              borderRadius: '14px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              overflow: 'hidden',
              minWidth: '220px',
              maxHeight: '70vh',
              overflowY: 'auto',
            }}
          >
            {items.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(item.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 18px',
                  border: 'none',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  background: 'transparent',
                  color: '#292929',
                  fontSize: '15px',
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
