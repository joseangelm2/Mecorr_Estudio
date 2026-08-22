'use client'

import { useRef, useState } from 'react'
import type { Project } from '@/types/invitation'
import { useGuestContext } from '@/lib/lista/GuestContext'
import { TokenRSVPForm } from '@/components/lista/TokenRSVPForm'

interface RsvpPhone {
  phone: string
  label: string
}

interface Props {
  project: Project
  decorationSrc?: string
}

export default function EspecialRSVP({ project, decorationSrc = '/images/flores-01.png' }: Props) {
  const guest = useGuestContext()
  const nameRef    = useRef<HTMLInputElement>(null)

  if (guest.token) return <TokenRSVPForm festejada={project.quinceanera_name} />
  const [attending, setAttending] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [guestName, setGuestName] = useState('')

  const extraPhones = (project.extra_config?.rsvp_phones as RsvpPhone[] | undefined) ?? []
  const rsvpEmail   = (project.extra_config?.rsvp_email as string) || null
  const singlePhone = project.rsvp_phone

  const hasPhones = extraPhones.length > 0 || Boolean(singlePhone)
  if (!hasPhones && !rsvpEmail) return null

  const sectionTitle  = project.confirmation_phrase || 'Favor de confirmar tu asistencia'
  const highlightDate = project.confirmation_highlight_date
    ? new Date(project.confirmation_highlight_date).toLocaleDateString('es-MX', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null

  function buildMessage(name: string) {
    return attending
      ? `Hola, soy ${name} y confirmo mi asistencia.`
      : `Hola, soy ${name} y lamentablemente, no podré asistir.`
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const name = nameRef.current?.value.trim() ?? ''
    if (!name) return
    setGuestName(name)
    setSubmitted(true)
  }

  function sendWhatsApp(phone: string) {
    const msg = buildMessage(guestName)
    window.open(
      `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`,
      '_blank'
    )
  }

  function sendEmail() {
    if (!rsvpEmail) return
    const subject = encodeURIComponent(`Confirmación XV ${project.quinceanera_name}`)
    const body    = encodeURIComponent(buildMessage(guestName))
    window.open(`mailto:${rsvpEmail}?subject=${subject}&body=${body}`, '_self')
  }

  return (
    <section id="confirmar" className="padding-section text-center" style={{ paddingBottom: '20px' }}>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="mb-10 wow fadeInUp">
            <img src={decorationSrc} width="100" alt="" />
          </div>
          <h2 className="titulo color-titulos mb-20 wow fadeInUp">Confirmar Asistencia</h2>
          <p className="color-textos mb-20 wow fadeInUp">{sectionTitle}</p>
          {highlightDate && (
            <p className="color-textos mb-30 wow fadeInUp" style={{ fontWeight: 600 }}>
              Antes del {highlightDate}
            </p>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit} className="wow fadeInUp">
              <div style={{ maxWidth: '360px', margin: '0 auto' }}>
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
              </div>
              <button type="submit" className="btn-form">Confirmar</button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <p className="color-textos mb-10">Elige cómo enviar tu confirmación:</p>

              {extraPhones.length > 0 && extraPhones.map((entry, i) => (
                <button
                  key={i}
                  type="button"
                  className="btn-form"
                  onClick={() => sendWhatsApp(entry.phone)}
                >
                  WhatsApp — {entry.label || `Contacto ${i + 1}`}
                </button>
              ))}

              {extraPhones.length === 0 && singlePhone && (
                <button type="button" className="btn-form" onClick={() => sendWhatsApp(singlePhone)}>
                  Enviar por WhatsApp
                </button>
              )}

              {rsvpEmail && (
                <button type="button" className="btn-form" onClick={sendEmail}>
                  Enviar por correo
                </button>
              )}

              <button
                type="button"
                className="color-textos"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', marginTop: '4px' }}
                onClick={() => setSubmitted(false)}
              >
                ← Volver
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
