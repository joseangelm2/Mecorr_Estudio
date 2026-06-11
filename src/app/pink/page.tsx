"use client";

import "@/app/pink/pink.css";
import { useState, useRef } from "react";
import VintageEnvelope from "@/components/vintage/VintageEnvelope";
import EsmeraldaScrollInit from "@/components/esmeralda/EsmeraldaScrollInit";
import PinkContent from "@/components/pink/PinkContent";
import { DEMO_PROJECT } from "@/lib/demo-project";

const PRIMARY = "#c48602";

export default function PinkPage() {
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
      {!envelopeOpen && <VintageEnvelope onOpen={handleOpen} primaryColor={PRIMARY} />}
      <div className="top"><img className="top-img" src="/images/pink/452.png" alt="" /></div>
      <div className="bottom"><img className="bottom-img" src="/images/pink/453.png" alt="" /></div>
      <PinkContent project={DEMO_PROJECT} />
    </div>
  );
}
