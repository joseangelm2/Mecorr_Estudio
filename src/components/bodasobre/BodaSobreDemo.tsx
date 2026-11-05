'use client'

import { useState } from 'react'
import { TemplateRenderer } from '@/components/templates/TemplateRenderer'
import { BODASOBRE_THEMES } from '@/lib/bodasobre-themes'
import { DEMO_BODASOBRE } from '@/lib/demo-boda-project'

// Demo pública de Boda Sobre con un selector flotante para probar cada paleta de colores.
export default function BodaSobreDemo() {
  const [tema, setTema] = useState(DEMO_BODASOBRE.color_theme)
  const project = { ...DEMO_BODASOBRE, color_theme: tema }

  return (
    <>
      <TemplateRenderer project={project} />
      <div
        role="radiogroup"
        aria-label="Paleta de colores"
        style={{
          position: 'fixed', left: '50%', bottom: 14, transform: 'translateX(-50%)', zIndex: 60,
          display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px',
          background: 'rgba(255,255,255,0.94)', borderRadius: 999,
          boxShadow: '0 4px 16px rgba(0,0,0,0.22)', backdropFilter: 'blur(6px)',
        }}
      >
        {BODASOBRE_THEMES.map(t => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={t.id === tema}
            aria-label={t.label}
            title={t.label}
            onClick={() => setTema(t.id)}
            style={{
              width: 26, height: 26, borderRadius: '50%', background: t.swatch, cursor: 'pointer',
              border: '2px solid #fff', padding: 0,
              boxShadow: t.id === tema ? `0 0 0 2px ${t.swatch}` : '0 0 0 1px rgba(0,0,0,0.15)',
              transform: t.id === tema ? 'scale(1.12)' : 'none',
            }}
          />
        ))}
      </div>
    </>
  )
}
