"use client";

import { useRef, useState } from "react";

interface Props {
  onOpen: () => void;
}

export default function MagicalEnvelope({ onOpen }: Props) {
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
      <div className="first" id="sobre_hoja1" ref={firstRef} />
      <button
        className="sello"
        id="sello"
        ref={buttonRef}
        onClick={handleOpen}
        aria-label="Abrir Invitación"
      >
        ✨ Abrir ✨
      </button>
      <div className="second" id="sobre_hoja2" ref={secondRef} />
    </div>
  );
}
