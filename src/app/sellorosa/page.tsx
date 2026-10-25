"use client";

import "@/app/sellorosa/sellorosa.css";
import { useState, useRef } from "react";
import EsmeraldaScrollInit from "@/components/esmeralda/EsmeraldaScrollInit";
import SelloRosaEnvelope from "@/components/sellorosa/SelloRosaEnvelope";
import SelloRosaContent from "@/components/sellorosa/SelloRosaContent";
import { demoProjectFor } from "@/lib/demo-project";
import DemoFloatingControls from "@/components/DemoFloatingControls";
import { NAV_SELLOROSA } from "@/lib/demo-nav";

const DEMO_PROJECT = demoProjectFor("sellorosa");

export default function SelloRosaPage() {
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleOpen() {
    setOpen(true);
    audioRef.current?.play().catch(() => {});
  }

  return (
    <div>
      <EsmeraldaScrollInit />
      <audio ref={audioRef} loop preload="auto">
        <source src="/images/sellorosa/base/musica.mp3" type="audio/mpeg" />
      </audio>
      <DemoFloatingControls candidates={NAV_SELLOROSA} colorVar="#cb997e" />
      {!open && <SelloRosaEnvelope onOpen={handleOpen} />}
      <SelloRosaContent project={DEMO_PROJECT} />
    </div>
  );
}
