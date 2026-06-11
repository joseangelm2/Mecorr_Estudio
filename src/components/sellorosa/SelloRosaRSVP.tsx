"use client";

import { useState, useRef } from "react";

interface Props {
  phone: string
}

export default function SelloRosaRSVP({ phone }: Props) {
  const nombreRef = useRef<HTMLInputElement>(null);
  const mensajeRef = useRef<HTMLTextAreaElement>(null);
  const [asistira, setAsistira] = useState(true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nombre = nombreRef.current?.value ?? "";
    const mensaje = mensajeRef.current?.value ?? "";
    if (!confirm(asistira ? "¿Estás seguro de confirmar tu asistencia?" : "¿Estás seguro de que no podrás asistir?")) return;
    const text = asistira
      ? `Hola, soy ${nombre} y confirmo mi asistencia. Mensaje: ${mensaje}`
      : `Hola, soy ${nombre} y lamentablemente no podré asistir.`;
    window.open(`https://api.whatsapp.com/send?phone=52${phone}&text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
      <input ref={nombreRef} type="text" className="sr-rsvp-input" placeholder="Tu nombre completo" required autoComplete="off" />
      <div className="sr-radio-wrap">
        <input type="radio" id="sr-si" name="asistencia" checked={asistira} onChange={() => setAsistira(true)} />
        <label htmlFor="sr-si" className="sr-radio-label">Asistiré</label>
      </div>
      <div className="sr-radio-wrap">
        <input type="radio" id="sr-no" name="asistencia" checked={!asistira} onChange={() => setAsistira(false)} />
        <label htmlFor="sr-no" className="sr-radio-label">No Asistiré</label>
      </div>
      <textarea ref={mensajeRef} className="sr-rsvp-input" rows={4} placeholder="Deja un mensaje especial..." style={{ borderRadius: "12px", marginTop: "8px" }} />
      <div style={{ marginTop: "16px" }}>
        <button type="submit" className="sr-btn">Confirmar Asistencia</button>
      </div>
    </form>
  );
}
