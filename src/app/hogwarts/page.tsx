"use client";

import { useState, useRef } from "react";
import VintageEnvelope from "@/components/vintage/VintageEnvelope";
import EsmeraldaScrollInit from "@/components/esmeralda/EsmeraldaScrollInit";
import HogwartsContent from "@/components/hogwarts/HogwartsContent";

const PRIMARY = "#c49245";

export default function HogwartsPage() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleOpen() {
    setEnvelopeOpen(true);
    audioRef.current?.play().catch(() => {});
  }

  return (
    <div style={{ position: "relative" }}>
      <EsmeraldaScrollInit />
      <audio ref={audioRef} loop>
        <source src="/images/esmeralda/musica.mp3" type="audio/mpeg" />
      </audio>

      {!envelopeOpen && (
        <VintageEnvelope onOpen={handleOpen} primaryColor={PRIMARY} />
      )}

      <div className="top">
        <img className="top-img" src="/images/hogwarts/452.png" alt="" />
      </div>
      <div className="bottom">
        <img className="bottom-img" src="/images/hogwarts/453.png" alt="" />
      </div>

      <HogwartsContent />
    </div>
  );
}
