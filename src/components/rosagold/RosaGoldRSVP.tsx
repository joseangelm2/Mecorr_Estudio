"use client";

import { useState, useRef } from "react";
import { useGuestContext } from '@/lib/lista/GuestContext'
import { TokenRSVPForm } from '@/components/lista/TokenRSVPForm'
import type { RsvpContact } from "@/lib/rsvp";

interface Props { contacts: RsvpContact[]; email?: string | null; festejada?: string }

export default function RosaGoldRSVP({ contacts, email, festejada = '' }: Props) {
  const guest = useGuestContext()
  if (guest.token) return <TokenRSVPForm festejada={festejada} />
  const nombreRef = useRef<HTMLInputElement>(null);
  const mensajeRef = useRef<HTMLTextAreaElement>(null);
  const conelRef = useRef<HTMLSelectElement>(null);
  const [asistira, setAsistira] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestConel, setGuestConel] = useState("");
  const [guestMessage, setGuestMessage] = useState("");

  function buildMessage(nombre: string, conel: string, mensaje: string) {
    return asistira
      ? `Hola, soy ${nombre} y confirmo mi asistencia, asistiremos ${conel}, Mi Mensaje: ${mensaje}`
      : `Hola, soy ${nombre} y lamentablemente, no podré asistir.`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGuestName(nombreRef.current?.value ?? "");
    setGuestConel(conelRef.current?.value ?? "");
    setGuestMessage(mensajeRef.current?.value ?? "");
    setSubmitted(true);
  }

  function sendWhatsApp(phone: string) {
    window.open(`https://api.whatsapp.com/send?phone=52${phone}&text=${encodeURIComponent(buildMessage(guestName, guestConel, guestMessage))}`, "_blank");
  }

  function sendEmail() {
    if (!email) return;
    const subject = encodeURIComponent("Confirmación de asistencia");
    const body = encodeURIComponent(buildMessage(guestName, guestConel, guestMessage));
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_self");
  }

  if (!submitted) {
    return (
      <div className="rg-mb-30">
        <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto", textAlign: "left" }}>
          <div className="rg-mb-30">
            <input ref={nombreRef} name="nombre" type="text" className="rg-form-campo" placeholder="Nombre" required autoComplete="off" />
          </div>
          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            <input type="radio" id="rg-asistire" name="confirmacion" value="asistire" checked={asistira} onChange={() => setAsistira(true)} />
            <label htmlFor="rg-asistire" style={{ color: "#606060", marginLeft: "8px", fontFamily: "var(--font-raleway)" }}>Asistiré</label>
          </div>
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <input type="radio" id="rg-noAsistire" name="confirmacion" value="noAsistire" checked={!asistira} onChange={() => setAsistira(false)} />
            <label htmlFor="rg-noAsistire" style={{ color: "#606060", marginLeft: "8px", fontFamily: "var(--font-raleway)" }}>No Asistiré</label>
          </div>
          <div className="rg-mb-30">
            <select ref={conelRef} name="conel" className="rg-form-campo" required>
              <option value="">¿Cuántas Personas Asistirán?</option>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n === 0 ? "0 Personas" : `${n} Persona${n > 1 ? "s" : ""}`}>
                  {n === 0 ? "No Asistiré" : `${n} Persona${n > 1 ? "s" : ""}`}
                </option>
              ))}
            </select>
          </div>
          <div className="rg-mb-40">
            <textarea ref={mensajeRef} name="mensaje" className="rg-form-campo" rows={5} placeholder="Escribe un lindo mensaje..." required />
          </div>
          <div style={{ textAlign: "center" }}>
            <button type="submit" className="rg-btn-form">Enviar Confirmación</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="rg-mb-30" style={{ maxWidth: "400px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <p style={{ color: "#606060", fontFamily: "var(--font-raleway)" }}>Elige cómo enviar tu confirmación:</p>
      {contacts.map((entry, i) => (
        <button key={i} type="button" className="rg-btn-form" onClick={() => sendWhatsApp(entry.phone)}>
          WhatsApp — {entry.label || `Contacto ${i + 1}`}
        </button>
      ))}
      {email && (
        <button type="button" className="rg-btn-form" onClick={sendEmail}>
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
