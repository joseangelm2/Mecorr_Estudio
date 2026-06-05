"use client";

import { useState } from "react";

interface Props {
  onOpen: () => void;
  primaryColor: string;
}

export default function VintageEnvelope({ onOpen, primaryColor }: Props) {
  const [opening, setOpening] = useState(false);

  function open() {
    setOpening(true);
    setTimeout(() => onOpen(), 1500);
  }

  return (
    <div className="sobre" id="sobre">
      <div
        className={`petalo left${opening ? " open" : ""}`}
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className={`petalo right${opening ? " open" : ""}`}
        style={{ backgroundColor: primaryColor }}
      />
      <button
        className={`sello${opening ? " hidden" : ""}`}
        onClick={open}
        style={{ backgroundColor: primaryColor }}
      >
        Abrir
        <br />
        Invitación
      </button>
      <div className="banda-sobre" />
    </div>
  );
}
