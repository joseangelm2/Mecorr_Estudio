"use client";

import { useRef, useState } from "react";
import type { Project } from "@/types/invitation";
import { useGuestContext } from '@/lib/lista/GuestContext'
import { TokenRSVPForm } from '@/components/lista/TokenRSVPForm'
import { getRsvpContacts, getRsvpEmail } from "@/lib/rsvp";

interface Props {
  project: Project;
}

export default function LoveRSVP({ project }: Props) {
  const guest = useGuestContext()
  const nombreRef = useRef<HTMLInputElement>(null);
  const [asistira, setAsistira] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [guestName, setGuestName] = useState("");

  if (guest.token) return <TokenRSVPForm festejada={project.quinceanera_name} />

  const contacts = getRsvpContacts(project);
  const email = getRsvpEmail(project);

  function buildMessage(nombre: string) {
    return asistira
      ? `Hola, soy ${nombre} y confirmo mi asistencia.`
      : `Hola, soy ${nombre} y lamentablemente, no podré asistir.`;
  }

  function confirmarAsistencia(e: React.FormEvent) {
    e.preventDefault();
    const nombre = nombreRef.current?.value ?? "";
    setGuestName(nombre);
    setSubmitted(true);
  }

  function sendWhatsApp(phone: string) {
    window.open(
      `https://api.whatsapp.com/send?phone=52${phone}&text=${encodeURIComponent(buildMessage(guestName))}`,
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
    <div className="contain">
      <div className="extra">
        <section className="confirmacion-asistencia show-p-y" style={{ marginTop: "8%" }}>
          <h2 className="subtitulo">
            {project.confirmation_phrase || "Favor de confirmar asistencia"}
          </h2>
          {!submitted ? (
            <form onSubmit={confirmarAsistencia}>
              <label htmlFor="lv-familia" className="texto">
                Nombre y Apellido:
              </label>
              <input
                ref={nombreRef}
                type="text"
                id="lv-familia"
                name="familia"
                maxLength={40}
                className="familia-input"
                required
              />
              <label className="texto" style={{ marginTop: "2%" }}>
                Confirmo que:
              </label>
              <div className="radio-group">
                <input
                  type="radio"
                  id="lv-asistire"
                  name="confirmacion"
                  value="asistire"
                  checked={asistira}
                  onChange={() => setAsistira(true)}
                />
                <label htmlFor="lv-asistire" className="texto">
                  Asistiré
                </label>
              </div>
              <div className="radio-group">
                <input
                  type="radio"
                  id="lv-noAsistire"
                  name="confirmacion"
                  value="noAsistire"
                  checked={!asistira}
                  onChange={() => setAsistira(false)}
                />
                <label htmlFor="lv-noAsistire" className="texto">
                  No Asistiré
                </label>
              </div>
              <input
                type="submit"
                className="button"
                value="Confirmar Asistencia"
                style={{ marginTop: "4%", cursor: "pointer" }}
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
      </div>
    </div>
  );
}
