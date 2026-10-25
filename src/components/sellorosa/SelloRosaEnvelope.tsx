"use client";

import { useState } from "react";
import type { Project } from "@/types/invitation";

const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

interface Props {
  onOpen: () => void;
  project: Project;
}

// La portada de Sello Rosa: foto de la quinceañera de fondo, la frase "Mis XV Años" arriba y el
// botón para abrir la invitación casi al final de la pantalla.
export default function SelloRosaEnvelope({ onOpen, project }: Props) {
  const [state, setState] = useState<"idle" | "opening" | "hidden">("idle");

  function handleOpen() {
    setState("opening");
    document.documentElement.classList.add("con-scroll");
    setTimeout(() => { setState("hidden"); onOpen(); }, 900);
  }

  if (state === "hidden") return null;

  const d = new Date(project.event_date);
  const fecha = `${String(d.getDate()).padStart(2, "0")}.${MESES[d.getMonth()]}.${d.getFullYear()}`;
  const firstName = (project.quinceanera_name ?? "").split(" ")[0];
  const foto = project.hero_photo_url || "";

  return (
    <div
      className={`sr-envelope${foto ? " sr-envelope--foto" : ""}${state === "opening" ? " opening" : ""}`}
      style={foto ? { backgroundImage: `url(${foto}), linear-gradient(135deg, #fff0f3, #f5babc, #cb997e)` } : undefined}
    >
      <h1 className="sr-envelope-titulo">Mis XV Años</h1>
      <div className="sr-envelope-pie">
        <div className="sr-envelope-name">{firstName}</div>
        <div className="sr-envelope-tagline">{fecha}</div>
        <button className="sr-sello-btn" onClick={handleOpen}>Abrir Invitación</button>
      </div>
    </div>
  );
}
