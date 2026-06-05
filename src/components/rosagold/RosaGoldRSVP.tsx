"use client";

import { useState, useRef } from "react";

export default function RosaGoldRSVP() {
  const nombreRef = useRef<HTMLInputElement>(null);
  const mensajeRef = useRef<HTMLTextAreaElement>(null);
  const conelRef = useRef<HTMLSelectElement>(null);
  const [asistira, setAsistira] = useState(true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nombre = nombreRef.current?.value ?? "";
    const conel = conelRef.current?.value ?? "";
    const mensaje = mensajeRef.current?.value ?? "";
    if (!confirm(asistira ? "¿Estás seguro de mandar esta confirmación de asistencia?" : "¿Estás seguro de no asistir al evento?")) return;
    const text = asistira
      ? `Hola, soy ${nombre} y confirmo mi asistencia, asistiremos ${conel}, Mi Mensaje: ${mensaje}`
      : `Hola, soy ${nombre} y lamentablemente, no podré asistir.`;
    window.open(`https://api.whatsapp.com/send?phone=5215656408416&text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="rg-mb-30">
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto", textAlign: "left" }}>
        <div className="rg-mb-30">
          <input ref={nombreRef} name="nombre" type="text" className="rg-form-campo" placeholder="Nombre" required autoComplete="off" />
        </div>
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <input type="radio" id="rg-asistire" name="confirmacion" value="asistire" checked={asistira} onChange={() => setAsistira(true)} />
          <label htmlFor="rg-asistire" style={{ color: "#606060", marginLeft: "8px", fontFamily: "var(--font-raleway)" }}>Asistiré</label>
        </div>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <input type="radio" id="rg-noAsistire" name="confirmacion" value="noAsistire" checked={!asistira} onChange={() => setAsistira(false)} />
          <label htmlFor="rg-noAsistire" style={{ color: "#606060", marginLeft: "8px", fontFamily: "var(--font-raleway)" }}>No Asistiré</label>
        </div>
        <div className="rg-mb-30">
          <select ref={conelRef} name="conel" className="rg-form-campo" required>
            <option value="">¿Cuántas Personas Asistirán?</option>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n === 0 ? "0 Personas" : `${n} Persona${n > 1 ? "s" : ""}`}>
                {n === 0 ? "No Asistiré" : `${n} Persona${n > 1 ? "s" : ""}`}
              </option>
            ))}
          </select>
        </div>
        <div className="rg-mb-40">
          <textarea ref={mensajeRef} name="mensaje" className="rg-form-campo" rows={5} placeholder="Escribe un lindo mensaje..." required />
        </div>
        <div style={{ textAlign: "center" }}>
          <button type="submit" className="rg-btn-form">Enviar Confirmación</button>
        </div>
      </form>
    </div>
  );
}
