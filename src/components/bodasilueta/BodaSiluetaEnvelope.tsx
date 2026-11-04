"use client";

import { useState } from "react";
import type { Project } from "@/types/invitation";
import BodaSiluetaMarco from "./BodaSiluetaMarco";

const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

interface Props {
  onOpen: () => void;
  project: Project;
}

// Portada de la boda: foto de los novios de fondo, frase (o imagen) arriba y botón para abrir
// la invitación casi al final de la pantalla.
export default function BodaSiluetaEnvelope({ onOpen, project }: Props) {
  const [state, setState] = useState<"idle" | "opening" | "hidden">("idle");

  function handleOpen() {
    setState("opening");
    document.documentElement.classList.add("con-scroll");
    setTimeout(() => { setState("hidden"); onOpen(); }, 900);
  }

  if (state === "hidden") return null;

  const d = new Date(project.event_date);
  const fecha = `${String(d.getDate()).padStart(2, "0")}.${MESES[d.getMonth()]}.${d.getFullYear()}`;
  const foto = project.hero_photo_url || "";
  const titulo = (project.extra_config?.mis_xv_text as string) || "¡Nos Casamos!";
  const tituloImagen = project.extra_config?.mis_xv_mode === "imagen"
    ? (project.extra_config?.mis_xv_image_url as string) || ""
    : "";

  return (
    <div
      className={`bs-envelope${foto ? " bs-envelope--foto" : ""}${state === "opening" ? " opening" : ""}`}
      style={foto ? { backgroundImage: `url(${foto}), linear-gradient(135deg, var(--bs-bg, #fff0f3), var(--bs-soft, #f5babc), var(--bs-primary, #cb997e))` } : undefined}
    >
      <BodaSiluetaMarco project={project} portada />
      <h1 className="bs-envelope-titulo">
        {tituloImagen ? <img className="bs-envelope-titulo-img" src={tituloImagen} alt={titulo} /> : titulo}
      </h1>
      <div className="bs-envelope-pie">
        <div className="bs-envelope-name">{project.quinceanera_name}</div>
        <div className="bs-envelope-tagline">{fecha}</div>
        <button className="bs-sello-btn" onClick={handleOpen}>Abrir Invitación</button>
      </div>
    </div>
  );
}
