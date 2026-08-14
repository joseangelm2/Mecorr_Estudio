"use client";

import "@/app/zafiro/zafiro.css";
import { useState, useRef, useEffect } from "react";
import { DEMO_PROJECT } from "@/lib/demo-project";
import {
  ZafiroScrollInit,
  ZafiroEnvelope,
  ZafiroHero,
  ZafiroParents,
  ZafiroDate,
  ZafiroLocations,
  ZafiroPhotoGrid,
  ZafiroItinerary,
  ZafiroGifts,
  ZafiroRSVP,
} from "@/components/zafiro";

const DEFAULT_PHOTOS = [
  "/images/zafiro/foto1.jpg",
  "/images/zafiro/foto2.jpg",
  "/images/zafiro/foto3.jpg",
  "/images/zafiro/foto4.jpg",
  "/images/zafiro/foto5.jpg",
  "/images/zafiro/foto6.jpg",
];

export default function ZafiroPage() {
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const photos = DEFAULT_PHOTOS;
  const project = { ...DEMO_PROJECT, hero_photo_url: "/images/zafiro/foto.jpg" };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  function handleOpen() {
    setOpen(true);
    audioRef.current?.play().catch(() => {});
  }

  return (
    <div style={{ position: "relative" }}>
      <ZafiroScrollInit />
      <audio ref={audioRef} loop>
        <source src="/images/zafiro/musica.mp3" type="audio/mpeg" />
      </audio>
      {!open && <ZafiroEnvelope onOpen={handleOpen} />}
      <div className="top">
        <img className="top-img" src="/images/zafiro/452.png" alt="" />
      </div>
      <div className="bottom">
        <img className="bottom-img" src="/images/zafiro/453.png" alt="" />
      </div>
      <div className="contenido">
        <ZafiroHero project={project} />
        {photos[0] && (
          <div className="foto-con-degradado">
            <img className="foto-full show-p-y" src={photos[0]} alt="" />
          </div>
        )}
        <ZafiroParents project={DEMO_PROJECT} />
        {photos[1] && (
          <div className="foto-con-degradado">
            <img className="foto-full show-p-y" src={photos[1]} alt="" />
          </div>
        )}
        <ZafiroDate project={DEMO_PROJECT} />
        <ZafiroLocations project={DEMO_PROJECT} />
        {photos[2] && (
          <div className="foto-con-degradado">
            <img className="foto-full show-p-y" src={photos[2]} alt="" />
          </div>
        )}
        <ZafiroGifts project={DEMO_PROJECT} />
        {photos[3] && (
          <div className="foto-con-degradado">
            <img className="foto-full show-p-y" src={photos[3]} alt="" />
          </div>
        )}
        <ZafiroPhotoGrid photos={photos.slice(4)} />
        <ZafiroItinerary project={DEMO_PROJECT} />
        <ZafiroRSVP project={DEMO_PROJECT} />
        <div className="extra">
          <img src="/images/zafiro/corona_bottom.png" style={{ width: "30%", marginBottom: "-5%" }} alt="" />
        </div>
        <div className="despedida">¡Te Esperamos!</div>
      </div>
    </div>
  );
}
