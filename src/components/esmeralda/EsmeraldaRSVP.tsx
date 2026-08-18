"use client";

import { FormEvent, useState } from "react";
import type { Project } from "@/types/invitation";
import { useGuestContext } from '@/lib/lista/GuestContext'
import { TokenRSVPForm } from '@/components/lista/TokenRSVPForm'
import { getRsvpContacts, getRsvpEmail } from "@/lib/rsvp";

interface Props {
  project: Project;
}

export default function EsmeraldaRSVP({ project }: Props) {
  const guest = useGuestContext()
  const [attending, setAttending] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [guestName, setGuestName] = useState("");

  if (guest.token) return <TokenRSVPForm festejada={project.quinceanera_name} />

  const contacts = getRsvpContacts(project);
  const email = getRsvpEmail(project);
  const sectionTitle = project.confirmation_phrase || "Favor de confirmar asistencia";
  const highlightDate = project.confirmation_highlight_date
    ? new Date(project.confirmation_highlight_date).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  function buildMessage(familia: string) {
    return attending
      ? `Hola, soy ${familia} y confirmo mi asistencia.`
      : `Hola, soy ${familia} y lamentablemente, no podré asistir.`;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const familia = (
      e.currentTarget.elements.namedItem("familia") as HTMLInputElement
    ).value;
    setGuestName(familia);
    setSubmitted(true);
  }

  function sendWhatsApp(phone: string) {
    window.open(
      `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(buildMessage(guestName))}`,
      "_blank"
    );
  }

  function sendEmail() {
    if (!email) return;
    const subject = encodeURIComponent(`Confirmación XV ${project.quinceanera_name}`);
    const body = encodeURIComponent(buildMessage(guestName));
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_self");
  }

  return (
    <>
      {project.dress_code?.notes && (
        <section className="informacion-importante no-print" style={{ marginTop: "1%", marginBottom: "2%" }}>
          <h2>Información Importante</h2>
          <p className="texto">❖ {project.dress_code.notes}</p>
        </section>
      )}

      <section className="confirmacion-asistencia" style={{ marginTop: "1%", marginBottom: "3%" }}>
        <h2>{sectionTitle}</h2>
        {highlightDate && (
          <p className="texto" style={{ marginTop: "-1%" }}>Antes del {highlightDate}</p>
        )}
        {!submitted ? (
          <form method="POST" onSubmit={handleSubmit}>
            <label htmlFor="familia" className="texto">
              Nombre y Apellido:
            </label>
            <input
              type="text"
              id="familia"
              name="familia"
              maxLength={20}
              className="familia-input"
              required
            />
            <label className="texto" style={{ marginTop: "2%" }}>
              Confirmo que:
            </label>
            <div>
              <input
                type="radio"
                id="asistire"
                name="confirmacion"
                value="asistire"
                checked={attending}
                onChange={() => setAttending(true)}
              />
              <label htmlFor="asistire" className="texto">
                Asistiré
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="noAsistire"
                name="confirmacion"
                value="noAsistire"
                checked={!attending}
                onChange={() => setAttending(false)}
              />
              <label htmlFor="noAsistire" className="texto">
                No Asistiré
              </label>
            </div>
            <input
              type="submit"
              className="button"
              value="Enviar"
              style={{ marginTop: "2%" }}
            />
          </form>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <p className="texto">Elige cómo enviar tu confirmación:</p>
            {contacts.map((entry, i) => (
              <button
                key={i}
                type="button"
                className="button"
                style={{ cursor: "pointer", border: "none" }}
                onClick={() => sendWhatsApp(entry.phone)}
              >
                WhatsApp — {entry.label || `Contacto ${i + 1}`}
              </button>
            ))}
            {email && (
              <button type="button" className="button" style={{ cursor: "pointer", border: "none" }} onClick={sendEmail}>
                Enviar por correo
              </button>
            )}
            <button
              type="button"
              className="texto"
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", marginTop: "4px" }}
              onClick={() => setSubmitted(false)}
            >
              ← Volver
            </button>
          </div>
        )}
      </section>
    </>
  );
}
