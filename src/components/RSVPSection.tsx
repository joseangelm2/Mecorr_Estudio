"use client";

import { FormEvent, useState } from "react";
import { useGuestContext } from '@/lib/lista/GuestContext'
import { TokenRSVPForm } from '@/components/lista/TokenRSVPForm'

interface Props {
  rsvpPhone?: string;
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
  confirmationPhrase,
  highlightDate,
  festejada = '',
}: Props) {
  const guest = useGuestContext()
  const [attending, setAttending] = useState(true);

  if (guest.token) return <TokenRSVPForm festejada={festejada} />

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const nombre = (form.elements.namedItem("nombre") as HTMLInputElement)
      .value;
    const mensaje = (form.elements.namedItem("mensaje") as HTMLTextAreaElement)
      .value;

    const confirmMsg = attending
      ? "¿Estás seguro de mandar esta confirmación de asistencia?"
      : "¿Estás seguro de no asistir al evento?";

    if (!confirm(confirmMsg)) return;

    const mensajeCA = attending
      ? `Hola, soy ${nombre} y confirmo mi asistencia. Mi Mensaje: ${mensaje}`
      : `Hola, soy ${nombre} y lamentablemente, no podré asistir.`;

    const url = `https://api.whatsapp.com/send?phone=${rsvpPhone}&text=${encodeURIComponent(mensajeCA)}`;
    window.open(url, "_blank");
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
        <form onSubmit={handleSubmit}>
          <div className="mb-30">
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
      </div>
    </section>
  );
}
