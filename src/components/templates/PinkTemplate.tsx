"use client";

import "@/app/pink/pink.css";
import { useState, useRef, useEffect } from "react";
import type { Project } from "@/types/invitation";
import VintageEnvelope from "@/components/vintage/VintageEnvelope";
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
import FloatingMusicToggle from "@/components/FloatingMusicToggle";
import FloatingSectionNav from "@/components/FloatingSectionNav";

const PRIMARY = "#c48602";

const NAV_CANDIDATES = [
  { id: "portada", label: "Portada" },
  { id: "familia", label: "Familia" },
  { id: "fecha", label: "Cuenta Regresiva" },
  { id: "ubicaciones", label: "Ubicaciones" },
  { id: "regalos", label: "Regalos" },
  { id: "fotos", label: "Fotos" },
  { id: "itinerario", label: "Itinerario" },
  { id: "confirmar", label: "Confirmar Asistencia" },
];

const DEFAULT_PHOTOS = [
  "/images/pink/foto1.jpg",
  "/images/pink/foto2.jpg",
  "/images/pink/foto3.jpg",
  "/images/pink/foto4.jpg",
  "/images/pink/foto5.jpg",
  "/images/pink/foto6.jpg",
];

interface Props { project: Project }

export default function PinkTemplate({ project }: Props) {
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const photos = project.photos.length ? project.photos : DEFAULT_PHOTOS;

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
        <source src={project.music_url ?? "/images/pink/musica.mp3"} type="audio/mpeg" />
      </audio>
      {project.show_floating_controls !== false && (
        <>
          <FloatingMusicToggle audioRef={audioRef} colorVar={PRIMARY} />
          <FloatingSectionNav candidates={NAV_CANDIDATES} colorVar={PRIMARY} />
        </>
      )}
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
        <div id="familia"><PinkParents project={project} /></div>
        {photos[1] && <div className="foto-con-degradado"><img className="foto-full show-p-y" src={photos[1]} alt="" /></div>}
        <div id="fecha"><PinkDate project={project} /></div>
        <div id="ubicaciones"><PinkLocations project={project} /></div>
        {photos[2] && <div className="foto-con-degradado"><img className="foto-full show-p-y" src={photos[2]} alt="" /></div>}
        <div id="regalos"><PinkGifts project={project} /></div>
        {photos[3] && <div className="foto-con-degradado"><img className="foto-full show-p-y" src={photos[3]} alt="" /></div>}
        <div id="fotos"><PinkPhotoGrid photos={photos.slice(4)} /></div>
        {photos[4] && <div className="foto-con-degradado"><img className="foto-full show-p-y" src={photos[4]} alt="" /></div>}
        <div id="itinerario"><PinkItinerary project={project} /></div>
        <PinkRSVP project={project} />
        <div className="extra">
          <img src="/images/pink/v2.png" style={{ width: "40%", marginBottom: "-8%" }} alt="" />
        </div>
        <div className="despedida">¡Te Esperamos!</div>
      </div>
    </div>
  );
}
