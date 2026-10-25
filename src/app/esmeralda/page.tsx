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
import DemoFloatingControls from "@/components/DemoFloatingControls";
import { NAV_ESMERALDA } from "@/lib/demo-nav";

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
      <DemoFloatingControls candidates={NAV_ESMERALDA} colorVar="var(--color-principal, #098074)" />
      <EsmeraldaDecorations />
      {!envelopeOpen && <EnvelopeSobre onOpen={handleOpen} />}
      <div className="background">
        <div id="portada"><EsmeraldaHero project={DEMO_PROJECT} /></div>
        <EsmeraldaCountdown eventDate={DEMO_PROJECT.event_date} />
        <div id="familia"><EsmeraldaParents project={DEMO_PROJECT} /></div>
        <div id="ubicaciones"><EsmeraldaLocations project={DEMO_PROJECT} /></div>
        <EsmeraldaPhotoGrid photos={DEMO_PROJECT.photos} />
        <div id="itinerario"><EsmeraldaItinerario project={DEMO_PROJECT} /></div>
        <div id="regalos"><EsmeraldaGifts project={DEMO_PROJECT} /></div>
        <div id="confirmar"><EsmeraldaRSVP project={DEMO_PROJECT} /></div>
      </div>
    </div>
  );
}
