"use client";

import { useState, useRef } from "react";
import VintageEnvelope from "@/components/vintage/VintageEnvelope";
import EsmeraldaScrollInit from "@/components/esmeralda/EsmeraldaScrollInit";
import ZafiroContent from "@/components/zafiro/ZafiroContent";
import { DEMO_PROJECT } from "@/lib/demo-project";

export default function ZafiroPage() {
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleOpen() {
    setOpen(true);
    audioRef.current?.play().catch(() => {});
  }

  return (
    <div style={{ position: "relative" }}>
      <EsmeraldaScrollInit />
      <audio ref={audioRef} loop>
        <source src="/images/esmeralda/musica.mp3" type="audio/mpeg" />
      </audio>
      {!open && <VintageEnvelope onOpen={handleOpen} primaryColor="#775197" />}
      <div className="top"><img className="top-img" src="/images/zafiro/452.png" alt="" /></div>
      <div className="bottom"><img className="bottom-img" src="/images/zafiro/453.png" alt="" /></div>
      <ZafiroContent project={DEMO_PROJECT} />
    </div>
  );
}
