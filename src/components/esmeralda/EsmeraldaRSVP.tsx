"use client";

import { FormEvent, useState } from "react";
import type { Project } from "@/types/invitation";
import { useGuestContext } from '@/lib/lista/GuestContext'
import { TokenRSVPForm } from '@/components/lista/TokenRSVPForm'

interface Props {
  project: Project;
}

export default function EsmeraldaRSVP({ project }: Props) {
  const guest = useGuestContext()
  const [attending, setAttending] = useState(true);

  if (guest.token) return <TokenRSVPForm festejada={project.quinceanera_name} />

  const phone = project.rsvp_phone ?? "";
  const sectionTitle = project.confirmation_phrase || "Favor de confirmar asistencia";
  const highlightDate = project.confirmation_highlight_date
    ? new Date(project.confirmation_highlight_date).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const familia = (
      e.currentTarget.elements.namedItem("familia") as HTMLInputElement
    ).value;

    const confirmMsg = attending
      ? "¿Estás seguro de mandar esta confirmación de asistencia?"
      : "¿Estás seguro de no asistir al evento?";

    if (!confirm(confirmMsg)) return;

    const msg = attending
      ? `Hola, soy ${familia} y confirmo mi asistencia.`
      : `Hola, soy ${familia} y lamentablemente, no podré asistir.`;

    window.open(
      `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`,
      "_blank"
    );
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
      </section>
    </>
  );
}
