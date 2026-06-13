"use client";

import { useRef, useState } from "react";

interface Props {
  onOpen: () => void;
}

export default function LoveEnvelope({ onOpen }: Props) {
  const [opened, setOpened] = useState(false);
  const firstRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const sobreRef = useRef<HTMLDivElement>(null);

  function handleOpen() {
    if (opened) return;
    setOpened(true);
    document.documentElement.classList.add("con-scroll");
    firstRef.current?.classList.add("up_1");
    secondRef.current?.classList.add("down_1");
    centerRef.current?.classList.add("button_hiden");
    setTimeout(() => {
      sobreRef.current?.classList.add("sobre_hiden");
      onOpen();
    }, 3000);
  }

  return (
    <div className="sobre" id="sobre" ref={sobreRef}>
      <div className="first" ref={firstRef} />
      <div className="sobre-center" ref={centerRef}>
        <button className="sello" onClick={handleOpen} aria-label="Abrir Invitación">
          Abrir<br />Invitación
        </button>
      </div>
      <div className="second" ref={secondRef} />
    </div>
  );
}
