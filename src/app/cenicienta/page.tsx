"use client";

import { useState, useRef } from "react";
import VintageEnvelope from "@/components/vintage/VintageEnvelope";
import EsmeraldaScrollInit from "@/components/esmeralda/EsmeraldaScrollInit";
import CenicientaContent from "@/components/cenicienta/CenicientaContent";

const PRIMARY = "#c48602";

export default function CenicientaPage() {
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
        <img className="top-img" src="/images/cenicienta/452.png" alt="" />
      </div>
      <div className="bottom">
        <img className="bottom-img" src="/images/cenicienta/453.png" alt="" />
      </div>

      <CenicientaContent />
    </div>
  );
}
