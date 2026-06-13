"use client";

import { useState } from "react";

interface Props {
  onOpen: () => void;
}

export default function ZafiroEnvelope({ onOpen }: Props) {
  const [state, setState] = useState<"idle" | "opening" | "done">("idle");

  function handleOpen() {
    if (state !== "idle") return;
    setState("opening");
    setTimeout(() => {
      setState("done");
      onOpen();
    }, 2200);
  }

  if (state === "done") return null;

  return (
    <div className={`zafiro-envelope-screen${state === "opening" ? " fading" : ""}`}>
      <p className="zafiro-envelope-label">Tienes una invitación</p>

      <div className={`zafiro-envelope-wrap${state === "opening" ? " opening" : ""}`}>
        {/* Top flap */}
        <div className="zafiro-flap" />

        {/* Envelope body */}
        <div className="zafiro-envelope-body">
          <div className="zafiro-envelope-lines">
            <div className="zafiro-line" />
            <div className="zafiro-line short" />
          </div>
        </div>

        {/* Wax seal button */}
        <button
          className={`zafiro-seal${state === "opening" ? " breaking" : ""}`}
          onClick={handleOpen}
          aria-label="Abrir invitación"
        >
          <span className="zafiro-seal-letter">XV</span>
        </button>
      </div>

      {state === "idle" && (
        <p className="zafiro-envelope-hint">Toca el sello para abrir</p>
      )}
    </div>
  );
}
