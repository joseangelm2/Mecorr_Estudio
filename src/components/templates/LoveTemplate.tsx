"use client";

import "@/app/love/love.css";
import { useState, useRef, useEffect } from "react";
import type { Project } from "@/types/invitation";
import {
  LoveScrollInit,
  LoveEnvelope,
  LoveHero,
  LoveLocations,
  LoveParents,
  LovePhotoGrid,
  LoveItinerary,
  LoveGifts,
  LoveRSVP,
} from "@/components/love";

const DEFAULT_PHOTOS = [
  "/images/love/foto1.jpg",
  "/images/love/foto2.jpg",
  "/images/love/foto3.jpg",
  "/images/love/foto4.jpg",
  "/images/love/foto5.jpg",
  "/images/love/foto6.jpg",
];

interface Props {
  project: Project;
}

export default function LoveTemplate({ project }: Props) {
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const photos = project.photos.length ? project.photos : DEFAULT_PHOTOS;
  const [firstName] = (project.quinceanera_name ?? "Quinceañera").split(" ");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  function handleOpen() {
    setOpen(true);
    audioRef.current?.play().catch(() => {});
  }

  return (
    <div style={{ position: "relative" }}>
      <LoveScrollInit />
      <audio ref={audioRef} id="music" loop>
        <source src={project.music_url ?? "/images/love/musica.mp3"} type="audio/mpeg" />
      </audio>
      {!open && <LoveEnvelope onOpen={handleOpen} />}
      <main>
        <LoveHero project={project} />
        <LoveLocations project={project} />
        <section className="parallax-container parallax-2" />
        <LoveParents project={project} />
        <section className="parallax-container parallax-3" />
        <LovePhotoGrid photos={photos} />
        <section className="parallax-container parallax-4" />
        <LoveItinerary project={project} />
        <section className="parallax-container parallax-5" />
        <LoveGifts project={project} />
        <LoveRSVP project={project} />
      </main>
    </div>
  );
}
