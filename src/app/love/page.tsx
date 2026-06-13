"use client";

import "@/app/love/love.css";
import { useState, useRef, useEffect } from "react";
import { LOVE_DEMO_PROJECT as DEMO_PROJECT } from "@/lib/love-demo-project";
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

export default function LovePage() {
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const photos = DEMO_PROJECT.photos.length ? DEMO_PROJECT.photos : DEFAULT_PHOTOS;
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
        <source src={DEMO_PROJECT.music_url ?? "/images/love/musica.mp3"} type="audio/mpeg" />
      </audio>
      {!open && <LoveEnvelope onOpen={handleOpen} />}
      <main>
        <LoveHero project={DEMO_PROJECT} />
        <LoveLocations project={DEMO_PROJECT} />
        <section
          className="parallax-container parallax-2"
          style={photos[0] ? { backgroundImage: `url(${photos[0]})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
        />
        <LoveParents project={DEMO_PROJECT} />
        <section
          className="parallax-container parallax-3"
          style={photos[1] ? { backgroundImage: `url(${photos[1]})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
        />
        <LovePhotoGrid photos={photos} />
        <section
          className="parallax-container parallax-4"
          style={photos[2] ? { backgroundImage: `url(${photos[2]})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
        />
        <LoveItinerary project={DEMO_PROJECT} />
        <section
          className="parallax-container parallax-5"
          style={photos[3] ? { backgroundImage: `url(${photos[3]})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
        />
        <LoveGifts project={DEMO_PROJECT} />
        <LoveRSVP project={DEMO_PROJECT} />
      </main>
    </div>
  );
}
