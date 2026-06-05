"use client";

import { FormEvent, useState } from "react";

const PHONE = "5214438569931";

export default function EsmeraldaRSVP() {
  const [attending, setAttending] = useState(true);

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
      `https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  }

  return (
    <>
      <section className="informacion-importante no-print" style={{ marginTop: "1%", marginBottom: "2%" }}>
        <h2>Información Importante</h2>
        <p className="texto">❖ No se permiten niños.</p>
        <p className="texto">
          ❖ El color oro rosa queda reservado exclusivamente para la Quinceañera.
        </p>
      </section>

      <section className="confirmacion-asistencia" style={{ marginTop: "1%", marginBottom: "3%" }}>
        <h2>
          Favor de confirmar asistencia <br />
          antes del 14 de Julio
        </h2>
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
