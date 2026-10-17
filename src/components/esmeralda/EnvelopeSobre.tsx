"use client";

import { useRef, useState } from "react";

interface EnvelopeSobreProps {
  onOpen: () => void;
  imageUrl?: string;
}

export default function EnvelopeSobre({ onOpen, imageUrl }: EnvelopeSobreProps) {
  // Una sola imagen "partida" entre las dos hojas: cada una mide 50% del alto del
  // sobre, así que con background-size 100%/200% cada mitad muestra la porción que
  // le toca (arriba/abajo) de la misma imagen, alineadas en el centro.
  // Importante: NO usar background-attachment:fixed aquí — queda anclado al
  // viewport y no se mueve junto con el transform: translateY() de la animación
  // de apertura (.up_1/.down_1), haciendo que la hoja se "despegue" sin que la
  // imagen la acompañe (se ve como si no se separara / se desvaneciera).
  const topStyle = imageUrl
    ? { backgroundImage: `url(${imageUrl})`, backgroundSize: "100% 200%" as const, backgroundPosition: "top" as const }
    : undefined;
  const bottomStyle = imageUrl
    ? { backgroundImage: `url(${imageUrl})`, backgroundSize: "100% 200%" as const, backgroundPosition: "bottom" as const }
    : undefined;
  const [opened, setOpened] = useState(false);
  const firstRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sobreRef = useRef<HTMLDivElement>(null);

  function handleOpen() {
    if (opened) return;
    setOpened(true);
    firstRef.current?.classList.add("up_1");
    secondRef.current?.classList.add("down_1");
    buttonRef.current?.classList.add("button_hiden");
    setTimeout(() => {
      sobreRef.current?.classList.add("sobre_hiden");
      onOpen();
    }, 3000);
  }

  return (
    <div className="sobre" id="sobre" ref={sobreRef}>
      <div className="first" id="sobre_hoja1" ref={firstRef} style={topStyle} />
      <button
        className="sello"
        id="sello"
        ref={buttonRef}
        onClick={handleOpen}
        aria-label="Abrir Invitación"
      >
        Abrir Invitación
      </button>
      <div className="second" id="sobre_hoja2" ref={secondRef} style={bottomStyle} />
    </div>
  );
}
