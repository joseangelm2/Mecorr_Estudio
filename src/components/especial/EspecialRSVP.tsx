'use client'

import { useRef, useState } from 'react'
import type { Project } from '@/types/invitation'

function sendWhatsApp(phone: string, message: string) {
  window.open(
    `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`,
    '_self'
  )
}

interface Props {
  project: Project
}

export default function EspecialRSVP({ project }: Props) {
  const nameRef = useRef<HTMLInputElement>(null)
  const [attending, setAttending] = useState(true)

  const phone = project.rsvp_phone
  if (!phone) return null

  const sectionTitle = project.confirmation_phrase || 'Favor de confirmar tu asistencia'

  const highlightDate = project.confirmation_highlight_date
    ? new Date(project.confirmation_highlight_date).toLocaleDateString('es-MX', {
        day: 'numeric', month: 'long', year: 'numeric',
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
    <section className="padding-section text-center">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="mb-10 wow fadeInUp">
            <img src="/images/flores-01.png" width="100" alt="" />
          </div>
          <h2 className="titulo color-titulos mb-20 wow fadeInUp">Confirmar Asistencia</h2>
          <p className="color-textos mb-20 wow fadeInUp">{sectionTitle}</p>
          {highlightDate && (
            <p className="color-textos mb-30 wow fadeInUp" style={{ fontWeight: 600 }}>
              Antes del {highlightDate}
            </p>
          )}
          <form onSubmit={handleRSVP} className="wow fadeInUp">
            <div className="mb-20">
              <label className="color-textos" style={{ display: 'block', marginBottom: '8px' }}>
                Nombre y Apellido:
              </label>
              <input
                type="text"
                maxLength={30}
                className="form-campo"
                placeholder="Escribe tu nombre"
                ref={nameRef}
                required
              />
            </div>
            <div className="mb-30" style={{ textAlign: 'left' }}>
              <div className="mb-10">
                <input
                  type="radio"
                  id="asistire"
                  name="confirmacion"
                  checked={attending}
                  onChange={() => setAttending(true)}
                />
                <label htmlFor="asistire" className="color-textos" style={{ marginLeft: '8px' }}>
                  Asistiré
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="noAsistire"
                  name="confirmacion"
                  checked={!attending}
                  onChange={() => setAttending(false)}
                />
                <label htmlFor="noAsistire" className="color-textos" style={{ marginLeft: '8px' }}>
                  No Asistiré
                </label>
              </div>
            </div>
            <button type="submit" className="btn-form">Enviar</button>
          </form>
        </div>
      </div>
    </section>
  )
}
