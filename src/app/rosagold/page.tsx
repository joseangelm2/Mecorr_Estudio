"use client";

import "@/app/rosagold/rosagold.css";
import { useRef } from "react";
import WelcomeModal from "@/components/rosagold/WelcomeModal";
import RosaGoldContent from "@/components/rosagold/RosaGoldContent";
import { demoProjectFor } from "@/lib/demo-project";
import DemoFloatingControls from "@/components/DemoFloatingControls";
import { NAV_ROSAGOLD } from "@/lib/demo-nav";

const DEMO_PROJECT = demoProjectFor("rosagold");

export default function RosaGoldPage() {
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleEnter() {
    audioRef.current?.play().catch(() => {});
  }

  return (
    <div>
      <audio ref={audioRef} id="background-music" loop preload="auto">
        <source src="/images/rosagold/base/musica.mp3" type="audio/mpeg" />
      </audio>
      <DemoFloatingControls candidates={NAV_ROSAGOLD} colorVar="#ce9e5f" />
      <WelcomeModal onEnter={handleEnter} />
      <RosaGoldContent project={DEMO_PROJECT} />
    </div>
  );
}
