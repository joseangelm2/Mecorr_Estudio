"use client";

import { useRef, useState } from "react";
import type { Project } from "@/types/invitation";
import { useGuestContext } from '@/lib/lista/GuestContext'
import { TokenRSVPForm } from '@/components/lista/TokenRSVPForm'
import { getRsvpContacts, getRsvpEmail } from "@/lib/rsvp";

interface Props {
  project: Project;
}

export default function ZafiroRSVP({ project }: Props) {
  const guest = useGuestContext()
  const nameRef = useRef<HTMLInputElement>(null);
  const [attending, setAttending] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [guestName, setGuestName] = useState("");

  if (guest.token) return <TokenRSVPForm festejada={project.quinceanera_name} />

  const contacts = getRsvpContacts(project);
  const email = getRsvpEmail(project);

  function buildMessage(name: string) {
    return attending
      ? `Hola, soy ${name} y confirmo mi asistencia.`
      : `Hola, soy ${name} y lamentablemente, no podré asistir.`;
  }

  function handleRSVP(e: React.FormEvent) {
    e.preventDefault();
    const name = nameRef.current?.value ?? "";
    setGuestName(name);
    setSubmitted(true);
  }

  function sendWhatsApp(phone: string) {
    window.open(
      `https://api.whatsapp.com/send?phone=52${phone}&text=${encodeURIComponent(buildMessage(guestName))}`,
      "_self"
    );
  }

  function sendEmail() {
    if (!email) return;
    const subject = encodeURIComponent(`Confirmación XV ${project.quinceanera_name}`);
    const body = encodeURIComponent(buildMessage(guestName));
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_self");
  }

  return (
    <section className="confirmacion-asistencia show-p-y">
      <img src="/images/zafiro/buzon.png" style={{ width: "18%" }} alt="WhatsApp" />
      <h3>Confirma tu asistencia</h3>
      {project.confirmation_phrase && (
        <p className="texto" style={{ marginBottom: "4%" }}>{project.confirmation_phrase}</p>
      )}
      {!submitted ? (
        <form onSubmit={handleRSVP}>
          <label htmlFor="zf-familia" className="texto">Nombre y Apellido:</label>
          <input
            type="text"
            id="zf-familia"
            name="familia"
            maxLength={40}
            className="familia-input"
            placeholder="Escribe Tu Nombre"
            ref={nameRef}
            required
          />
          <label className="texto" style={{ marginTop: "2%" }}>Confirmo que:</label>
          <div>
            <input
              type="radio"
              id="zf-asistire"
              name="confirmacion"
              value="asistire"
              checked={attending}
              onChange={() => setAttending(true)}
            />
            <label htmlFor="zf-asistire" className="texto"> Asistiré</label>
          </div>
          <div>
            <input
              type="radio"
              id="zf-noAsistire"
              name="confirmacion"
              value="noAsistire"
              checked={!attending}
              onChange={() => setAttending(false)}
            />
            <label htmlFor="zf-noAsistire" className="texto"> No Asistiré</label>
          </div>
          <input
            type="submit"
            className="boton"
            value="Enviar"
            style={{ marginTop: "2%", cursor: "pointer" }}
          />
        </form>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <p className="texto">Elige cómo enviar tu confirmación:</p>
          {contacts.map((entry, i) => (
            <button
              key={i}
              type="button"
              className="boton"
              style={{ cursor: "pointer", border: "none" }}
              onClick={() => sendWhatsApp(entry.phone)}
            >
              WhatsApp — {entry.label || `Contacto ${i + 1}`}
            </button>
          ))}
          {email && (
            <button type="button" className="boton" style={{ cursor: "pointer", border: "none" }} onClick={sendEmail}>
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
  );
}
