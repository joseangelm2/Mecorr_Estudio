"use client";

import { useRef, useState } from "react";
import type { Project } from "@/types/invitation";
import { useGuestContext } from '@/lib/lista/GuestContext'
import { TokenRSVPForm } from '@/components/lista/TokenRSVPForm'

interface Props {
  project: Project;
}

export default function LoveRSVP({ project }: Props) {
  const guest = useGuestContext()
  const nombreRef = useRef<HTMLInputElement>(null);
  const [asistira, setAsistira] = useState(true);

  if (guest.token) return <TokenRSVPForm festejada={project.quinceanera_name} />
  const phone = project.rsvp_phone ?? "";

  function confirmarAsistencia(e: React.FormEvent) {
    e.preventDefault();
    const nombre = nombreRef.current?.value ?? "";
    if (
      !confirm(
        asistira
          ? "¿Estás seguro de confirmar tu asistencia?"
          : "¿Estás seguro de no asistir?"
      )
    )
      return;
    const msg = asistira
      ? `Hola, soy ${nombre} y confirmo mi asistencia.`
      : `Hola, soy ${nombre} y lamentablemente, no podré asistir.`;
    window.open(
      `https://api.whatsapp.com/send?phone=52${phone}&text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  }

  return (
    <div className="contain">
      <div className="extra">
        <section className="confirmacion-asistencia show-p-y" style={{ marginTop: "8%" }}>
          <h2 className="subtitulo">
            {project.confirmation_phrase || "Favor de confirmar asistencia"}
          </h2>
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
        </section>
      </div>
    </div>
  );
}
