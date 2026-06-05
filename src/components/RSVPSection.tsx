"use client";

import { FormEvent, useState } from "react";

interface Props {
  rsvpPhone?: string;
}

export default function RSVPSection({ rsvpPhone = "5214438569931" }: Props) {
  const [attending, setAttending] = useState(true);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const nombre = (form.elements.namedItem("nombre") as HTMLInputElement)
      .value;
    const conel = (form.elements.namedItem("conel") as HTMLSelectElement).value;
    const mensaje = (form.elements.namedItem("mensaje") as HTMLTextAreaElement)
      .value;

    const confirmMsg = attending
      ? "¿Estás seguro de mandar esta confirmación de asistencia?"
      : "¿Estás seguro de no asistir al evento?";

    if (!confirm(confirmMsg)) return;

    let mensajeCA: string;
    if (attending) {
      mensajeCA = `Hola, soy ${nombre} y confirmo mi asistencia, asistiremos ${conel}, Mi Mensaje: ${mensaje}`;
    } else {
      mensajeCA = `Hola, soy ${nombre} y lamentablemente, no podré asistir.`;
    }

    const url = `https://api.whatsapp.com/send?phone=${rsvpPhone}&text=${encodeURIComponent(mensajeCA)}`;
    window.open(url, "_blank");
  }

  return (
    <section
      id="deseos"
      className="padding-section"
      style={{
        backgroundColor: "rgba(255,255,255,.5)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div
        className="container"
        style={{ maxWidth: "100%", padding: "0 15px" }}
      >
        <div className="mb-10 text-center wow fadeInUp">
          <img src="/images/flores-01.png" width="160" alt="" />
        </div>
        <h1 className="titulo color-titulos text-center wow fadeInUp">
          Confirma tu Asistencia
        </h1>
        <p className="mb-30 color-textos text-center wow fadeInUp">
          Llena el siguiente formulario y no olvides dar clic en el botón,
          nosotros revisaremos tu confirmación.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-30">
            <input
              name="nombre"
              id="nombre"
              type="text"
              className="form-campo"
              placeholder="Nombre"
              required
              autoComplete="off"
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <input
              type="radio"
              id="asistire"
              name="confirmacion"
              value="asistire"
              className="form-campo"
              checked={attending}
              onChange={() => setAttending(true)}
              style={{ width: "auto" }}
            />
          </div>
          <label
            htmlFor="asistire"
            className="form-campo"
            style={{ color: "black", width: "auto", border: "none", background: "none" }}
          >
            Asistiré
          </label>
          <br />
          <div style={{ textAlign: "center" }}>
            <input
              type="radio"
              id="noAsistire"
              name="confirmacion"
              value="noAsistire"
              className="form-campo"
              checked={!attending}
              onChange={() => setAttending(false)}
              style={{ width: "auto" }}
            />
          </div>
          <label
            htmlFor="noAsistire"
            className="form-campo"
            style={{ color: "black", width: "auto", border: "none", background: "none" }}
          >
            No Asistiré
          </label>
          <br />
          <br />
          <div className="mb-30">
            <select
              name="conel"
              id="conel"
              className="form-campo"
              required
              autoComplete="off"
            >
              <option value="">¿Cuantas Personas Asistirán?</option>
              <option value="0 Personas">No Asistiré</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={`${n} ${n === 1 ? "Persona" : "Personas"}`}>
                  {n} {n === 1 ? "Persona" : "Personas"}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-40">
            <textarea
              name="mensaje"
              id="mensaje"
              className="form-campo"
              rows={5}
              placeholder="Escribe un lindo mensaje..."
              required
            />
          </div>
          <div className="mb-30 text-center">
            <button type="submit" className="btn-form">
              Enviar Confirmación
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
