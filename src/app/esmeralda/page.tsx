"use client";

import { useState, useRef, useEffect } from "react";
import EnvelopeSobre from "@/components/esmeralda/EnvelopeSobre";
import EsmeraldaHero from "@/components/esmeralda/EsmeraldaHero";
import EsmeraldaCountdown from "@/components/esmeralda/EsmeraldaCountdown";
import EsmeraldaParents from "@/components/esmeralda/EsmeraldaParents";
import EsmeraldaLocations from "@/components/esmeralda/EsmeraldaLocations";
import EsmeraldaPhotoGrid from "@/components/esmeralda/EsmeraldaPhotoGrid";
import EsmeraldaItinerario from "@/components/esmeralda/EsmeraldaItinerario";
import EsmeraldaGifts from "@/components/esmeralda/EsmeraldaGifts";
import EsmeraldaRSVP from "@/components/esmeralda/EsmeraldaRSVP";
import EsmeraldaDecorations from "@/components/esmeralda/EsmeraldaDecorations";
import EsmeraldaScrollInit from "@/components/esmeralda/EsmeraldaScrollInit";
import { DEMO_PROJECT } from "@/lib/demo-project";

export default function EsmeraldaPage() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  function handleOpen() {
    setEnvelopeOpen(true);
    audioRef.current?.play().catch(() => {});
  }

  return (
    <div style={{ position: "relative" }}>
      <EsmeraldaScrollInit />
      <audio ref={audioRef} id="music" loop>
        <source src={DEMO_PROJECT.music_url ?? "/images/esmeralda/musica.mp3"} type="audio/mpeg" />
      </audio>
      <EsmeraldaDecorations />
      {!envelopeOpen && <EnvelopeSobre onOpen={handleOpen} />}
      <div className="background">
        <EsmeraldaHero project={DEMO_PROJECT} />
        <EsmeraldaCountdown eventDate={DEMO_PROJECT.event_date} />
        <EsmeraldaParents project={DEMO_PROJECT} />
        <EsmeraldaLocations project={DEMO_PROJECT} />
        <EsmeraldaPhotoGrid photos={DEMO_PROJECT.photos} />
        <EsmeraldaItinerario project={DEMO_PROJECT} />
        <EsmeraldaGifts project={DEMO_PROJECT} />
        <EsmeraldaRSVP project={DEMO_PROJECT} />
      </div>
    </div>
  );
}
