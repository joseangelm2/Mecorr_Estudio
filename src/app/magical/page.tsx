"use client";

import "@/app/magical/magical.css";
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
import { DEMO_PROJECT } from "@/lib/demo-project";

const MAGICAL_PHOTOS = [
  "/images/magical/11.jpg",
  "/images/magical/12.jpg",
  "/images/magical/21.jpg",
  "/images/magical/22.jpg",
  "/images/magical/31.jpg",
  "/images/magical/32.jpg",
  "/images/magical/41.jpg",
  "/images/magical/42.jpg",
  "/images/magical/43.jpg",
];

export default function MagicalPage() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const photos = MAGICAL_PHOTOS;
  const project = { ...DEMO_PROJECT, hero_photo_url: "/images/magical/foto.jpg" };

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
        <MagicalHero project={project} />
        <MagicalCountdown eventDate={DEMO_PROJECT.event_date} />
        <MagicalParents project={DEMO_PROJECT} />
        <MagicalLocations project={DEMO_PROJECT} />
        <MagicalPhotoGrid photos={photos} />
        {DEMO_PROJECT.show_itinerary && <MagicalItinerario project={DEMO_PROJECT} />}
        <MagicalGifts project={DEMO_PROJECT} />
        <MagicalRSVP project={DEMO_PROJECT} />
        <MagicalFooter />
      </div>
    </div>
  );
}
