"use client";

import { useRef, type RefObject } from "react";
import ColorSwitcher from "@/components/ColorSwitcher";

interface Props {
  musicUrl?: string;
  showSwitcher?: boolean;
  audioRef?: RefObject<HTMLAudioElement | null>;
}

export default function IntroEnvelope({
  musicUrl = "https://invitadigitalmanitas.com/musica/nocrezcasmas.mp3",
  showSwitcher = true,
  audioRef: externalAudioRef,
}: Props) {
  const introRef = useRef<HTMLElement>(null);
  const sDerechoRef = useRef<HTMLImageElement>(null);
  const sIzquierdoRef = useRef<HTMLImageElement>(null);
  const internalAudioRef = useRef<HTMLAudioElement>(null);
  const audioRef = externalAudioRef ?? internalAudioRef;

  function openEnvelope() {
    if (introRef.current) {
      introRef.current.classList.add("desaparecer");
    }
    if (sDerechoRef.current) {
      sDerechoRef.current.classList.add("efecto-derecha");
    }
    if (sIzquierdoRef.current) {
      sIzquierdoRef.current.classList.add("efecto-izquierda");
    }
    document.documentElement.classList.add("con-scroll");
    audioRef.current?.play().catch(() => {});
  }

  return (
    <>
      <audio
        ref={audioRef}
        id="sonido2"
        loop
        preload="auto"
        src={musicUrl}
      />
      <section
        ref={introRef}
        id="intro"
        className="bg-overlay-intro bg-intro"
      >
        <img
          ref={sDerechoRef}
          id="s-derecho"
          className="sobre-derecho"
          src="/images/sobre-derecho.png"
          alt=""
        />
        <img
          ref={sIzquierdoRef}
          id="s-izquierdo"
          className="sobre-izquierdo"
          src="/images/sobre-izquierdo.png"
          alt=""
        />
        <button
          onClick={openEnvelope}
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
            position: "absolute",
            top: "45%",
            left: "40%",
            zIndex: 99999,
          }}
          aria-label="Abrir invitación"
        >
          <img
            className="sello-img"
            src="/images/sello.png"
            alt="Abrir"
            style={{
              width: "120px",
              animation: "pulse 4000ms infinite",
            }}
          />
        </button>
        {showSwitcher && <ColorSwitcher variant="inline" defaultTheme="rosagold" />}
      </section>
    </>
  );
}
