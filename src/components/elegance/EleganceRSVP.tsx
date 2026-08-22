'use client'

import { useRef, useState } from 'react'
import type { Project } from '@/types/invitation'
import { useGuestContext } from '@/lib/lista/GuestContext'
import { TokenRSVPForm } from '@/components/lista/TokenRSVPForm'
import { getRsvpContacts, getRsvpEmail } from '@/lib/rsvp'

interface Props {
  project: Project
}

export default function EleganceRSVP({ project }: Props) {
  const guest = useGuestContext()
  const nameRef = useRef<HTMLInputElement>(null)
  const [attending, setAttending] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [guestName, setGuestName] = useState('')

  if (guest.token) return <TokenRSVPForm festejada={project.quinceanera_name} />

  const contacts = getRsvpContacts(project)
  const email = getRsvpEmail(project)
  if (contacts.length === 0 && !email) return null

  const sectionTitle = project.confirmation_phrase || 'Favor de confirmar asistencia'

  const highlightDate = project.confirmation_highlight_date
    ? new Date(project.confirmation_highlight_date).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  function buildMessage(name: string) {
    return attending
      ? `Hola, soy ${name} y confirmo mi asistencia.`
      : `Hola, soy ${name} y lamentablemente, no podré asistir.`
  }

  function handleRSVP(e: React.FormEvent) {
    e.preventDefault()
    const name = nameRef.current?.value ?? ''
    setGuestName(name)
    setSubmitted(true)
  }

  function sendWhatsApp(phone: string) {
    window.open(
      `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(buildMessage(guestName))}`,
      '_self'
    )
  }

  function sendEmail() {
    if (!email) return
    const subject = encodeURIComponent(`Confirmación XV ${project.quinceanera_name}`)
    const body = encodeURIComponent(buildMessage(guestName))
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self')
  }

  return (
    <section id="confirmar" className="confirmacion-asistencia show-p-y" style={{ zIndex: 4 }}>
      <h3>{sectionTitle}</h3>
      {highlightDate && (
        <p className="texto" style={{ color: '#F7BB52', fontWeight: 600, marginBottom: '2%' }}>
          Antes del {highlightDate}
        </p>
      )}
      {!submitted ? (
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
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <p className="texto">Elige cómo enviar tu confirmación:</p>
          {contacts.map((entry, i) => (
            <button
              key={i}
              type="button"
              className="boton"
              style={{ cursor: 'pointer', border: 'none' }}
              onClick={() => sendWhatsApp(entry.phone)}
            >
              WhatsApp — {entry.label || `Contacto ${i + 1}`}
            </button>
          ))}
          {email && (
            <button type="button" className="boton" style={{ cursor: 'pointer', border: 'none' }} onClick={sendEmail}>
              Enviar por correo
            </button>
          )}
          <button
            type="button"
            className="texto"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', marginTop: '4px' }}
            onClick={() => setSubmitted(false)}
          >
            ← Volver
          </button>
        </div>
      )}
    </section>
  )
}
