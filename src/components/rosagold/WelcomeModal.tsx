"use client";

import { useState } from "react";

export default function WelcomeModal({ onEnter }: { onEnter: () => void }) {
  const [hidden, setHidden] = useState(false);

  function handleEnter() {
    setHidden(true);
    onEnter();
  }

  return (
    <div className={`rg-welcome-modal${hidden ? " hidden" : ""}`}>
      <div className="rg-modal-content">
        <div className="rg-modal-text">
          <div className="rg-name-container">
            <div className="rg-names-modal">Aime Ferreira</div>
            <div className="rg-modal-sub">15 AÑOS</div>
          </div>
          <div className="esp-med" />
          <p style={{ fontFamily: "var(--font-raleway, Raleway)", color: "#fff", fontSize: "14px", textTransform: "uppercase", letterSpacing: "2px" }}>
            Prepárate para una<br />celebración inolvidable...
          </p>
          <button className="rg-enter-btn" onClick={handleEnter}>
            <strong>¡MIRA AQUÍ!</strong>
          </button>
        </div>
      </div>
    </div>
  );
}
