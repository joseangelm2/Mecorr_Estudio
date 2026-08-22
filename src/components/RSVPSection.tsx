"use client";

import { FormEvent, useState } from "react";
import { useGuestContext } from '@/lib/lista/GuestContext'
import { TokenRSVPForm } from '@/components/lista/TokenRSVPForm'
import type { RsvpContact } from "@/lib/rsvp";

interface Props {
  rsvpPhone?: string;
  rsvpContacts?: RsvpContact[];
  rsvpEmail?: string;
  confirmationPhrase?: string;
  highlightDate?: string;
  festejada?: string;
}

function formatHighlightDate(dateStr: string): string {
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${day} de ${months[month - 1]} ${year}`;
}

export default function RSVPSection({
  rsvpPhone = "5214438569931",
  rsvpContacts,
  rsvpEmail,
  confirmationPhrase,
  highlightDate,
  festejada = '',
}: Props) {
  const guest = useGuestContext()
  const [attending, setAttending] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");

  if (guest.token) return <TokenRSVPForm festejada={festejada} />

  const contacts = rsvpContacts && rsvpContacts.length > 0 ? rsvpContacts : [{ phone: rsvpPhone, label: "" }];

  function buildMessage(nombre: string, mensaje: string) {
    return attending
      ? `Hola, soy ${nombre} y confirmo mi asistencia. Mi Mensaje: ${mensaje}`
      : `Hola, soy ${nombre} y lamentablemente, no podré asistir.`;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const nombre = (form.elements.namedItem("nombre") as HTMLInputElement)
      .value;
    const mensaje = (form.elements.namedItem("mensaje") as HTMLTextAreaElement)
      .value;
    setGuestName(nombre);
    setGuestMessage(mensaje);
    setSubmitted(true);
  }

  function sendWhatsApp(phone: string) {
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(buildMessage(guestName, guestMessage))}`;
    window.open(url, "_blank");
  }

  function sendEmail() {
    if (!rsvpEmail) return;
    const subject = encodeURIComponent("Confirmación de asistencia");
    const body = encodeURIComponent(buildMessage(guestName, guestMessage));
    window.open(`mailto:${rsvpEmail}?subject=${subject}&body=${body}`, "_self");
  }

  return (
    <section
      id="deseos"
      className="padding-section"
      style={{
        backgroundColor: "rgba(255,255,255,.5)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div
        className="container"
        style={{ maxWidth: "100%", padding: "0 15px" }}
      >
        <div className="mb-10 text-center wow fadeInUp">
          <img src="/images/flores-01.png" width="160" alt="" />
        </div>
        <h1 className="titulo color-titulos text-center wow fadeInUp">
          Confirma tu Asistencia
        </h1>
        <p className="mb-30 color-textos text-center wow fadeInUp">
          {confirmationPhrase ||
            "Llena el siguiente formulario y no olvides dar clic en el botón, nosotros revisaremos tu confirmación."}
        </p>
        {highlightDate && (
          <div className="mb-30 text-center wow fadeInUp">
            <span
              className="color-titulos"
              style={{
                display: "inline-block",
                border: "2px solid currentColor",
                borderRadius: "9999px",
                padding: "8px 28px",
                fontSize: "1.125rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              {formatHighlightDate(highlightDate)}
            </span>
          </div>
        )}
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-30" style={{ maxWidth: "360px" }}>
              <input
                name="nombre"
                id="nombre"
                type="text"
                className="form-campo"
                placeholder="Nombre"
                required
                autoComplete="off"
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <input
                type="radio"
                id="asistire"
                name="confirmacion"
                value="asistire"
                checked={attending}
                onChange={() => setAttending(true)}
                style={{ width: "auto", cursor: "pointer", flexShrink: 0 }}
              />
              <label htmlFor="asistire" style={{ color: "black", cursor: "pointer", margin: 0, fontSize: "18px" }}>
                Asistiré
              </label>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <input
                type="radio"
                id="noAsistire"
                name="confirmacion"
                value="noAsistire"
                checked={!attending}
                onChange={() => setAttending(false)}
                style={{ width: "auto", cursor: "pointer", flexShrink: 0 }}
              />
              <label htmlFor="noAsistire" style={{ color: "black", cursor: "pointer", margin: 0, fontSize: "18px" }}>
                No Asistiré
              </label>
            </div>
            <div className="mb-40">
              <textarea
                name="mensaje"
                id="mensaje"
                className="form-campo"
                rows={5}
                placeholder="Escribe un lindo mensaje..."
                required
              />
            </div>
            <div className="mb-30 text-center">
              <button type="submit" className="btn-form">
                Enviar Confirmación
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-30" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <p className="color-textos">Elige cómo enviar tu confirmación:</p>
            {contacts.map((entry, i) => (
              <button
                key={i}
                type="button"
                className="btn-form"
                onClick={() => sendWhatsApp(entry.phone)}
              >
                WhatsApp — {entry.label || `Contacto ${i + 1}`}
              </button>
            ))}
            {rsvpEmail && (
              <button type="button" className="btn-form" onClick={sendEmail}>
                Enviar por correo
              </button>
            )}
            <button
              type="button"
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", marginTop: "4px", color: "black" }}
              onClick={() => setSubmitted(false)}
            >
              ← Volver
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
