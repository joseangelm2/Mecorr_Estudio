"use client";

import "@/app/zafiro/zafiro.css";
import { useState, useRef, useEffect } from "react";
import type { Project } from "@/types/invitation";
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

interface Props {
  project: Project;
}

export default function ZafiroTemplate({ project }: Props) {
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const photos = project.photos.length ? project.photos : DEFAULT_PHOTOS;
  const finalPhoto =
    (project.extra_config?.final_photo_url as string) ||
    photos[photos.length - 1] ||
    project.hero_photo_url ||
    undefined;

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
        <source src={project.music_url ?? "/images/zafiro/musica.mp3"} type="audio/mpeg" />
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
        <ZafiroParents project={project} />
        {photos[1] && (
          <div className="foto-con-degradado">
            <img className="foto-full show-p-y" src={photos[1]} alt="" />
          </div>
        )}
        <ZafiroDate project={project} />
        <ZafiroLocations project={project} />
        {photos[2] && (
          <div className="foto-con-degradado">
            <img className="foto-full show-p-y" src={photos[2]} alt="" />
          </div>
        )}
        <ZafiroGifts project={project} />
        {photos[3] && (
          <div className="foto-con-degradado">
            <img className="foto-full show-p-y" src={photos[3]} alt="" />
          </div>
        )}
        <ZafiroPhotoGrid photos={photos.slice(4)} />
        <ZafiroItinerary project={project} />
        <ZafiroRSVP project={project} />
        <div className="extra">
          <img src="/images/zafiro/v1.png" style={{ width: "40%", marginBottom: "-8%" }} alt="" />
        </div>
        {finalPhoto && (
          <div className="foto-final show-p-y" style={{ backgroundImage: `url(${finalPhoto})` }}>
            <div className="foto-final-texto">
              <p>¡Te Espero!</p>
              <h2>{project.quinceanera_name}</h2>
            </div>
          </div>
        )}
        <div className="despedida">¡Te Esperamos!</div>
      </div>
    </div>
  );
}
