'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AdminShell } from '@/components/lista/AdminShell'
import { DEMO_BODA } from '@/lib/demo-boda-project'
import { DEMO_LISTA_SLUG, instalarMockLista } from '@/lib/lista/demo-mock'

export default function ListaInvitadosDemoPage() {
  const [listo, setListo] = useState(false)

  useEffect(() => {
    // El panel real pide los datos a /i/<slug>/api/*: aquí esas rutas responden con datos de ejemplo.
    sessionStorage.setItem(`lista_token_${DEMO_LISTA_SLUG}`, 'demo')
    const restaurar = instalarMockLista()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setListo(true)
    return restaurar
  }, [])

  return (
    <div id="body" style={{ background: '#F7F5F2' }}>
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60, display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '8px 14px',
          background: '#7C5C4A', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 12,
        }}
      >
        <span>DEMO · Lista de invitados con datos de ejemplo (se reinicia al recargar)</span>
        <Link href="/bodasilueta" style={{ color: '#fff', textDecoration: 'underline', whiteSpace: 'nowrap' }}>
          Ver invitación
        </Link>
      </div>
      {listo && (
        <AdminShell
          slug={DEMO_LISTA_SLUG}
          festejada={DEMO_BODA.quinceanera_name}
          eventDate={DEMO_BODA.event_date}
          rsvpPhone=""
          mapsUrl=""
        />
      )}
    </div>
  )
}
