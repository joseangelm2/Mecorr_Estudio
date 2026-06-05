"use client";

import { useState } from "react";

export default function LoveEnvelope({ onOpen }: { onOpen: () => void }) {
  const [hidden, setHidden] = useState(false);

  function handleOpen() {
    setHidden(true);
    document.getElementById("html")?.classList.add("con-scroll");
    onOpen();
  }

  if (hidden) return null;

  return (
    <div className="sobre-love">
      <div className="sobre-love-inner">
        <p className="sobre-love-label">Tienes una invitación</p>
        <div className="sobre-love-box">
          <div className="sobre-love-name">Lidia</div>
          <button className="sobre-love-btn" onClick={handleOpen}>
            Abrir Invitación
          </button>
        </div>
      </div>
    </div>
  );
}
