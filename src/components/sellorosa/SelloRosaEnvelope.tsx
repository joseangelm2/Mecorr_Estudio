"use client";

import { useState } from "react";

export default function SelloRosaEnvelope({ onOpen }: { onOpen: () => void }) {
  const [state, setState] = useState<"idle" | "opening" | "hidden">("idle");

  function handleOpen() {
    setState("opening");
    document.getElementById("html")?.classList.add("con-scroll");
    setTimeout(() => { setState("hidden"); onOpen(); }, 900);
  }

  if (state === "hidden") return null;

  return (
    <div className={`sr-envelope${state === "opening" ? " opening" : ""}`}>
      <div className="sr-envelope-card">
        <div className={`sr-envelope-flap${state === "opening" ? " open" : ""}`} />
        <div className="sr-envelope-name">Ximena</div>
        <div className="sr-envelope-tagline">XV Años — 22.NOV.2026</div>
        <button className="sr-sello-btn" onClick={handleOpen}>Abrir Invitación</button>
      </div>
    </div>
  );
}
