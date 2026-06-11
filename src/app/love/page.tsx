"use client";

import "@/app/love/love.css";
import { useState, useRef } from "react";
import EsmeraldaScrollInit from "@/components/esmeralda/EsmeraldaScrollInit";
import LoveEnvelope from "@/components/love/LoveEnvelope";
import LoveContent from "@/components/love/LoveContent";
import { DEMO_PROJECT } from "@/lib/demo-project";

export default function LovePage() {
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleOpen() {
    setOpen(true);
    audioRef.current?.play().catch(() => {});
  }

  return (
    <div style={{ position: "relative" }}>
      <EsmeraldaScrollInit />
      <audio ref={audioRef} id="music" loop>
        <source src="/images/esmeralda/musica.mp3" type="audio/mpeg" />
      </audio>
      {!open && <LoveEnvelope onOpen={handleOpen} />}
      <LoveContent project={DEMO_PROJECT} />
    </div>
  );
}
