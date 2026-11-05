"use client";

import { useState, useRef } from "react";
import { useGuestContext } from '@/lib/lista/GuestContext'
import { TokenRSVPForm } from '@/components/lista/TokenRSVPForm'
import type { RsvpContact } from "@/lib/rsvp";

interface Props {
  contacts: RsvpContact[]
  email?: string | null
  festejada?: string
  /** Nombres de la novia y el novio (en ese orden): uno por botón de confirmación. */
  nombres?: string[]
}

export default function BodaSobreRSVP({ contacts, email, festejada = '', nombres = [] }: Props) {
  const guest = useGuestContext()
  const nombreRef = useRef<HTMLInputElement>(null);
  const mensajeRef = useRef<HTMLTextAreaElement>(null);
  const [asistira, setAsistira] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");

  // Con enlace personalizado de la lista de invitados se usa el formulario por token.
  if (guest.token) return <TokenRSVPForm festejada={festejada} />

  function buildMessage(nombre: string, mensaje: string) {
    return asistira
      ? `Hola, soy ${nombre} y confirmo mi asistencia. Mensaje: ${mensaje}`
      : `Hola, soy ${nombre} y lamentablemente no podré asistir.`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGuestName(nombreRef.current?.value ?? "");
    setGuestMessage(mensajeRef.current?.value ?? "");
    setSubmitted(true);
  }

  function sendWhatsApp(phone: string) {
    window.open(`https://api.whatsapp.com/send?phone=52${phone}&text=${encodeURIComponent(buildMessage(guestName, guestMessage))}`, "_blank");
  }

  function sendEmail() {
    if (!email) return;
    const subject = encodeURIComponent("Confirmación de asistencia");
    const body = encodeURIComponent(buildMessage(guestName, guestMessage));
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_self");
  }

  // Un botón por cada integrante de la pareja (novia y novio). Si solo hay un teléfono, ambos lo usan;
  // si el contacto tiene nombre propio en el admin, ese nombre manda.
  const botones = nombres.length >= 2 && contacts.length > 0
    ? nombres.slice(0, 2).map((n, i) => ({ label: contacts[i]?.label || n, phone: (contacts[i] ?? contacts[0]).phone }))
    : contacts.map((c, i) => ({ label: c.label || `Contacto ${i + 1}`, phone: c.phone }));

  if (!submitted) {
    return (
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
        <input ref={nombreRef} type="text" className="bs-rsvp-input" placeholder="Tu nombre completo" required autoComplete="off" />
        <div className="bs-toggle" role="radiogroup" aria-label="Asistencia" data-valor={asistira ? "si" : "no"}>
          <span className="bs-toggle-fondo" aria-hidden="true" />
          <button type="button" role="radio" aria-checked={asistira} className="bs-toggle-op" onClick={() => setAsistira(true)}>Asistiré</button>
          <button type="button" role="radio" aria-checked={!asistira} className="bs-toggle-op" onClick={() => setAsistira(false)}>No asistiré</button>
        </div>
        <textarea ref={mensajeRef} className="bs-rsvp-input" rows={4} placeholder="Deja un mensaje especial..." style={{ borderRadius: "12px", marginTop: "8px" }} />
        <div style={{ marginTop: "16px" }}>
          <button type="submit" className="bs-btn">Confirmar Asistencia</button>
        </div>
      </form>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <p className="bs-text">Elige cómo enviar tu confirmación:</p>
      {botones.map((b, i) => (
        <button key={i} type="button" className="bs-btn" onClick={() => sendWhatsApp(b.phone)}>
          WhatsApp — {b.label}
        </button>
      ))}
      {email && (
        <button type="button" className="bs-btn" onClick={sendEmail}>
          Enviar por correo
        </button>
      )}
      <button
        type="button"
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", marginTop: "4px" }}
        onClick={() => setSubmitted(false)}
      >
        ← Volver
      </button>
    </div>
  );
}
