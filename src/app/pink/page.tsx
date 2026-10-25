"use client";

import "@/app/pink/pink.css";
import { useState, useRef, useEffect } from "react";
import VintageEnvelope from "@/components/vintage/VintageEnvelope";
import { demoProjectFor } from "@/lib/demo-project";
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
import DemoFloatingControls from "@/components/DemoFloatingControls";
import { NAV_PINK_ZAFIRO } from "@/lib/demo-nav";

const DEMO_PROJECT = demoProjectFor("pink");

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
        <source src="/images/pink/base/musica.mp3" type="audio/mpeg" />
      </audio>
      <DemoFloatingControls candidates={NAV_PINK_ZAFIRO} colorVar="#c48602" />
      {!open && <VintageEnvelope onOpen={handleOpen} primaryColor={PRIMARY} />}
      <div className="top">
        <img className="top-img" src="/images/pink/452.png" alt="" />
      </div>
      <div className="bottom">
        <img className="bottom-img" src="/images/pink/453.png" alt="" />
      </div>
      <div className="contenido">
        <div id="portada"><PinkHero project={project} /></div>
        {photos[0] && <div className="foto-con-degradado"><img className="foto-full show-p-y" src={photos[0]} alt="" /></div>}
        <div id="familia"><PinkParents project={DEMO_PROJECT} /></div>
        {photos[1] && <div className="foto-con-degradado"><img className="foto-full show-p-y" src={photos[1]} alt="" /></div>}
        <div id="fecha"><PinkDate project={DEMO_PROJECT} /></div>
        <div id="ubicaciones"><PinkLocations project={DEMO_PROJECT} /></div>
        {photos[2] && <div className="foto-con-degradado"><img className="foto-full show-p-y" src={photos[2]} alt="" /></div>}
        <div id="regalos"><PinkGifts project={DEMO_PROJECT} /></div>
        {photos[3] && <div className="foto-con-degradado"><img className="foto-full show-p-y" src={photos[3]} alt="" /></div>}
        <div id="fotos"><PinkPhotoGrid photos={photos.slice(4)} /></div>
        <div id="itinerario"><PinkItinerary project={DEMO_PROJECT} /></div>
        <PinkRSVP project={DEMO_PROJECT} />
        <div className="extra">
          <img src="/images/pink/base/v2.png" style={{ width: "40%", marginBottom: "-8%" }} alt="" />
        </div>
        <div className="despedida">¡Te Esperamos!</div>
      </div>
    </div>
  );
}
