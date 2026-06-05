"use client";

import { useState, useRef } from "react";
import EnvelopeSobre from "@/components/esmeralda/EnvelopeSobre";
import EsmeraldaHero from "@/components/esmeralda/EsmeraldaHero";
import EsmeraldaCountdown from "@/components/esmeralda/EsmeraldaCountdown";
import EsmeraldaParents from "@/components/esmeralda/EsmeraldaParents";
import EsmeraldaLocations from "@/components/esmeralda/EsmeraldaLocations";
import EsmeraldaPhotoGrid from "@/components/esmeralda/EsmeraldaPhotoGrid";
import EsmeraldaItinerario from "@/components/esmeralda/EsmeraldaItinerario";
import EsmeraldaGifts from "@/components/esmeralda/EsmeraldaGifts";
import EsmeraldaRSVP from "@/components/esmeralda/EsmeraldaRSVP";
import EsmeraldaFooter from "@/components/esmeralda/EsmeraldaFooter";
import EsmeraldaDecorations from "@/components/esmeralda/EsmeraldaDecorations";
import EsmeraldaScrollInit from "@/components/esmeralda/EsmeraldaScrollInit";

export default function EsmeraldaPage() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleOpen() {
    setEnvelopeOpen(true);
    audioRef.current?.play().catch(() => {});
  }

  return (
    <div style={{ position: "relative" }}>
      <EsmeraldaScrollInit />
      <audio ref={audioRef} id="music" loop>
        <source src="/images/esmeralda/musica.mp3" type="audio/mpeg" />
      </audio>
      <EsmeraldaDecorations />
      {!envelopeOpen && <EnvelopeSobre onOpen={handleOpen} />}
      <div className="background">
        <EsmeraldaHero />
        <EsmeraldaCountdown />
        <EsmeraldaParents />
        <EsmeraldaLocations />
        <EsmeraldaPhotoGrid />
        <EsmeraldaItinerario />
        <EsmeraldaGifts />
        <EsmeraldaRSVP />
        <EsmeraldaFooter />
      </div>
    </div>
  );
}
