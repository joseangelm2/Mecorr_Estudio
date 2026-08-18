"use client";

import { useRef, useState } from "react";
import type { Project } from "@/types/invitation";
import { useGuestContext } from '@/lib/lista/GuestContext'
import { TokenRSVPForm } from '@/components/lista/TokenRSVPForm'

interface Props { project: Project }

export default function PinkRSVP({ project }: Props) {
  const guest = useGuestContext()
  const nameRef = useRef<HTMLInputElement>(null);
  const [attending, setAttending] = useState(true);

  if (guest.token) return <TokenRSVPForm festejada={project.quinceanera_name} />
  const phone = project.rsvp_phone ?? "";

  function handleRSVP(e: React.FormEvent) {
    e.preventDefault();
    const name = nameRef.current?.value ?? "";
    const msg = attending
      ? `Hola, soy ${name} y confirmo mi asistencia.`
      : `Hola, soy ${name} y lamentablemente, no podré asistir.`;
    window.open(`https://api.whatsapp.com/send?phone=52${phone}&text=${encodeURIComponent(msg)}`, "_self");
  }

  return (
    <section className="confirmacion-asistencia show-p-y">
      <img src="/images/pink/buzon.png" style={{ width: "18%" }} alt="WhatsApp" />
      <h3>Confirma tu asistencia</h3>
      {project.confirmation_phrase && (
        <p className="texto" style={{ marginBottom: "4%" }}>{project.confirmation_phrase}</p>
      )}
      <form onSubmit={handleRSVP}>
        <label htmlFor="pk-familia" className="texto">Nombre y Apellido:</label>
        <input type="text" id="pk-familia" name="familia" maxLength={40}
          className="familia-input" placeholder="Escribe Tu Nombre" ref={nameRef} required />
        <label className="texto" style={{ marginTop: "2%" }}>Confirmo que:</label>
        <div>
          <input type="radio" id="pk-asistire" name="confirmacion" value="asistire"
            checked={attending} onChange={() => setAttending(true)} />
          <label htmlFor="pk-asistire" className="texto"> Asistiré</label>
        </div>
        <div>
          <input type="radio" id="pk-noAsistire" name="confirmacion" value="noAsistire"
            checked={!attending} onChange={() => setAttending(false)} />
          <label htmlFor="pk-noAsistire" className="texto"> No Asistiré</label>
        </div>
        <input type="submit" className="boton" value="Enviar" style={{ marginTop: "2%", cursor: "pointer" }} />
      </form>
    </section>
  );
}
