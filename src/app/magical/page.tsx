"use client";

import { useState, useRef } from "react";
import MagicalEnvelope from "@/components/magical/MagicalEnvelope";
import MagicalHero from "@/components/magical/MagicalHero";
import MagicalCountdown from "@/components/magical/MagicalCountdown";
import MagicalParents from "@/components/magical/MagicalParents";
import MagicalLocations from "@/components/magical/MagicalLocations";
import MagicalPhotoGrid from "@/components/magical/MagicalPhotoGrid";
import MagicalItinerario from "@/components/magical/MagicalItinerario";
import MagicalGifts from "@/components/magical/MagicalGifts";
import MagicalRSVP from "@/components/magical/MagicalRSVP";
import MagicalFooter from "@/components/magical/MagicalFooter";
import MagicalDecorations from "@/components/magical/MagicalDecorations";
import MagicalScrollInit from "@/components/magical/MagicalScrollInit";

export default function MagicalPage() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleOpen() {
    setEnvelopeOpen(true);
    audioRef.current?.play().catch(() => {});
  }

  return (
    <div style={{ position: "relative" }}>
      <MagicalScrollInit />
      <audio ref={audioRef} id="music" loop>
        <source src="/images/magical/musica.mp3" type="audio/mpeg" />
      </audio>
      <MagicalDecorations />
      {!envelopeOpen && <MagicalEnvelope onOpen={handleOpen} />}
      <div className="background">
        <MagicalHero />
        <MagicalCountdown />
        <MagicalParents />
        <MagicalLocations />
        <MagicalPhotoGrid />
        <MagicalItinerario />
        <MagicalGifts />
        <MagicalRSVP />
        <MagicalFooter />
      </div>
    </div>
  );
}
