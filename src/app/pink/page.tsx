"use client";

import "@/app/pink/pink.css";
import { useState, useRef, useEffect } from "react";
import VintageEnvelope from "@/components/vintage/VintageEnvelope";
import { DEMO_PROJECT } from "@/lib/demo-project";
import {
  PinkScrollInit,
  PinkHero,
  PinkParents,
  PinkDate,
  PinkLocations,
  PinkPhotoGrid,
  PinkItinerary,
  PinkGifts,
  PinkRSVP,
} from "@/components/pink";

const PRIMARY = "#c48602";

const DEFAULT_PHOTOS = [
  "/images/pink/foto1.jpg",
  "/images/pink/foto2.jpg",
  "/images/pink/foto3.jpg",
  "/images/pink/foto4.jpg",
  "/images/pink/foto5.jpg",
  "/images/pink/foto6.jpg",
];

export default function PinkPage() {
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const photos = DEFAULT_PHOTOS;
  const project = { ...DEMO_PROJECT, hero_photo_url: "/images/pink/foto.jpg" };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  function handleOpen() {
    setOpen(true);
    audioRef.current?.play().catch(() => {});
  }

  return (
    <div style={{ position: "relative" }}>
      <PinkScrollInit />
      <audio ref={audioRef} loop>
        <source src="/images/pink/musica.mp3" type="audio/mpeg" />
      </audio>
      {!open && <VintageEnvelope onOpen={handleOpen} primaryColor={PRIMARY} />}
      <div className="top">
        <img className="top-img" src="/images/pink/452.png" alt="" />
      </div>
      <div className="bottom">
        <img className="bottom-img" src="/images/pink/453.png" alt="" />
      </div>
      <div className="contenido">
        <PinkHero project={project} />
        {photos[0] && <div className="foto-con-degradado"><img className="foto-full show-p-y" src={photos[0]} alt="" /></div>}
        <PinkParents project={DEMO_PROJECT} />
        {photos[1] && <div className="foto-con-degradado"><img className="foto-full show-p-y" src={photos[1]} alt="" /></div>}
        <PinkDate project={DEMO_PROJECT} />
        <PinkLocations project={DEMO_PROJECT} />
        {photos[2] && <div className="foto-con-degradado"><img className="foto-full show-p-y" src={photos[2]} alt="" /></div>}
        <PinkGifts project={DEMO_PROJECT} />
        {photos[3] && <div className="foto-con-degradado"><img className="foto-full show-p-y" src={photos[3]} alt="" /></div>}
        <PinkPhotoGrid photos={photos.slice(4)} />
        <PinkItinerary project={DEMO_PROJECT} />
        <PinkRSVP project={DEMO_PROJECT} />
        <div className="extra">
          <img src="/images/pink/v2.png" style={{ width: "40%", marginBottom: "-8%" }} alt="" />
        </div>
        <div className="despedida">¡Te Esperamos!</div>
      </div>
    </div>
  );
}
