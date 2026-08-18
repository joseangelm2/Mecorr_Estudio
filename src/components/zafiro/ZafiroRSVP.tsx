"use client";

import { useRef, useState } from "react";
import type { Project } from "@/types/invitation";
import { useGuestContext } from '@/lib/lista/GuestContext'
import { TokenRSVPForm } from '@/components/lista/TokenRSVPForm'

interface Props {
  project: Project;
}

export default function ZafiroRSVP({ project }: Props) {
  const guest = useGuestContext()
  const nameRef = useRef<HTMLInputElement>(null);
  const [attending, setAttending] = useState(true);

  if (guest.token) return <TokenRSVPForm festejada={project.quinceanera_name} />
  const phone = project.rsvp_phone ?? "";

  function sendWA(msg: string) {
    window.open(
      `https://api.whatsapp.com/send?phone=52${phone}&text=${encodeURIComponent(msg)}`,
      "_self"
    );
  }

  function handleRSVP(e: React.FormEvent) {
    e.preventDefault();
    const name = nameRef.current?.value ?? "";
    const msg = attending
      ? `Hola, soy ${name} y confirmo mi asistencia.`
      : `Hola, soy ${name} y lamentablemente, no podré asistir.`;
    sendWA(msg);
  }

  return (
    <section className="confirmacion-asistencia show-p-y">
      <img src="/images/zafiro/buzon.png" style={{ width: "18%" }} alt="WhatsApp" />
      <h3>Confirma tu asistencia</h3>
      {project.confirmation_phrase && (
        <p className="texto" style={{ marginBottom: "4%" }}>{project.confirmation_phrase}</p>
      )}
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
    </section>
  );
}
