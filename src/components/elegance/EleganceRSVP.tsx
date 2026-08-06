'use client'

import { useRef, useState } from 'react'
import type { Project } from '@/types/invitation'
import { useGuestContext } from '@/lib/lista/GuestContext'
import { TokenRSVPForm } from '@/components/lista/TokenRSVPForm'

function sendWhatsApp(phone: string, message: string) {
  window.open(
    `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`,
    '_self'
  )
}

interface Props {
  project: Project
}

export default function EleganceRSVP({ project }: Props) {
  const guest = useGuestContext()
  const nameRef = useRef<HTMLInputElement>(null)
  const [attending, setAttending] = useState(true)

  if (guest.token) return <TokenRSVPForm festejada={project.quinceanera_name} />

  const phone = project.rsvp_phone
  if (!phone) return null

  const sectionTitle = project.confirmation_phrase || 'Favor de confirmar asistencia'

  const highlightDate = project.confirmation_highlight_date
    ? new Date(project.confirmation_highlight_date).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  function handleRSVP(e: React.FormEvent) {
    e.preventDefault()
    const name = nameRef.current?.value ?? ''
    const msg = attending
      ? `Hola, soy ${name} y confirmo mi asistencia.`
      : `Hola, soy ${name} y lamentablemente, no podré asistir.`
    sendWhatsApp(phone!, msg)
  }

  return (
    <section className="confirmacion-asistencia show-p-y" style={{ zIndex: 4 }}>
      <h3>{sectionTitle}</h3>
      {highlightDate && (
        <p className="texto" style={{ color: '#F7BB52', fontWeight: 600, marginBottom: '2%' }}>
          Antes del {highlightDate}
        </p>
      )}
      <form onSubmit={handleRSVP}>
        <label htmlFor="familia" className="texto">Nombre y Apellido:</label>
        <input
          type="text"
          id="familia"
          name="familia"
          maxLength={20}
          className="familia-input"
          placeholder="Escribe Nombre y Apellido"
          ref={nameRef}
          required
        />
        <label className="texto" style={{ marginTop: '2%' }}>Confirmo que:</label>
        <div>
          <input type="radio" id="asistire" name="confirmacion" value="asistire" className="texto" checked={attending} onChange={() => setAttending(true)} />
          <label htmlFor="asistire" className="texto"> Asistiré</label>
        </div>
        <div>
          <input type="radio" id="noAsistire" name="confirmacion" value="noAsistire" className="texto" checked={!attending} onChange={() => setAttending(false)} />
          <label htmlFor="noAsistire" className="texto"> No Asistiré</label>
        </div>
        <input type="submit" className="boton" value="Enviar" style={{ marginTop: '2%', cursor: 'pointer' }} />
      </form>
    </section>
  )
}
