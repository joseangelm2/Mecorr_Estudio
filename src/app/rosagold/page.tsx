"use client";

import "@/app/rosagold/rosagold.css";
import { useRef } from "react";
import WelcomeModal from "@/components/rosagold/WelcomeModal";
import RosaGoldContent from "@/components/rosagold/RosaGoldContent";
import { DEMO_PROJECT } from "@/lib/demo-project";

export default function RosaGoldPage() {
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleEnter() {
    audioRef.current?.play().catch(() => {});
  }

  function toggleMusic() {
    if (!audioRef.current) return;
    audioRef.current.paused ? audioRef.current.play().catch(() => {}) : audioRef.current.pause();
  }

  return (
    <div>
      <audio ref={audioRef} id="background-music" loop preload="auto">
        <source src="/images/esmeralda/musica.mp3" type="audio/mpeg" />
      </audio>
      <WelcomeModal onEnter={handleEnter} />
      <RosaGoldContent project={DEMO_PROJECT} />
      <button className="rg-music-btn" onClick={toggleMusic} aria-label="Música">♪</button>
    </div>
  );
}
