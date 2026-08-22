"use client";

import "@/app/zafiro/zafiro.css";
import { useState, useRef, useEffect } from "react";
import type { Project } from "@/types/invitation";
import { ZAFIRO_THEMES, DEFAULT_ZAFIRO_THEME, ZAFIRO_ICON_BASE } from "@/lib/zafiro-themes";
import { shadeHex, hexToFilterFrom, hexToRgbTriplet } from "@/lib/color";
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
import FloatingMusicToggle from "@/components/FloatingMusicToggle";
import FloatingSectionNav from "@/components/FloatingSectionNav";

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

  const customColor = (project.extra_config?.custom_color as string) || "";
  const customPrimaryLight = shadeHex(customColor, 45);
  const customEnvSeal1 = shadeHex(customColor, 14);
  const theme = project.color_theme === "custom" && customColor
    ? {
        id: "custom",
        label: "Personalizado",
        swatch: customColor,
        primary: customColor,
        primaryLight: customPrimaryLight,
        bgColor: shadeHex(customColor, 62),
        iconFilterDark: hexToFilterFrom(shadeHex(customColor, -20), ZAFIRO_ICON_BASE),
        envBg1: shadeHex(customColor, -35),
        envBg2: shadeHex(customColor, -40),
        envFlap: shadeHex(customColor, -22),
        envBody1: shadeHex(customColor, -27),
        envBody2: shadeHex(customColor, -16),
        envSeal1: customEnvSeal1,
        envSeal2: shadeHex(customColor, -10),
        envAccentRgb: hexToRgbTriplet(customPrimaryLight),
        envGlowRgb: hexToRgbTriplet(customEnvSeal1),
      }
    : ZAFIRO_THEMES.find(t => t.id === project.color_theme) ?? DEFAULT_ZAFIRO_THEME;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-principal", theme.primary);
    root.style.setProperty("--color-principal-light", theme.primaryLight);
    root.style.setProperty("--bg-color", theme.bgColor);
    root.style.setProperty("--zafiro-dark-filter", theme.iconFilterDark);
    root.style.setProperty("--zafiro-env-bg-1", theme.envBg1);
    root.style.setProperty("--zafiro-env-bg-2", theme.envBg2);
    root.style.setProperty("--zafiro-env-flap", theme.envFlap);
    root.style.setProperty("--zafiro-env-body-1", theme.envBody1);
    root.style.setProperty("--zafiro-env-body-2", theme.envBody2);
    root.style.setProperty("--zafiro-env-seal-1", theme.envSeal1);
    root.style.setProperty("--zafiro-env-seal-2", theme.envSeal2);
    root.style.setProperty("--zafiro-env-accent-rgb", theme.envAccentRgb);
    root.style.setProperty("--zafiro-env-glow-rgb", theme.envGlowRgb);
    return () => {
      const vars = [
        "--color-principal", "--color-principal-light", "--bg-color", "--zafiro-dark-filter",
        "--zafiro-env-bg-1", "--zafiro-env-bg-2", "--zafiro-env-flap",
        "--zafiro-env-body-1", "--zafiro-env-body-2",
        "--zafiro-env-seal-1", "--zafiro-env-seal-2",
        "--zafiro-env-accent-rgb", "--zafiro-env-glow-rgb",
      ];
      vars.forEach(v => root.style.removeProperty(v));
    };
  }, [theme]);

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
      {project.show_floating_controls !== false && (
        <>
          <FloatingMusicToggle audioRef={audioRef} colorVar="var(--color-principal, #b08968)" />
          <FloatingSectionNav candidates={NAV_CANDIDATES} colorVar="var(--color-principal, #b08968)" />
        </>
      )}
      {!open && <ZafiroEnvelope onOpen={handleOpen} />}
      <div className="top">
        <img className="top-img" src="/images/zafiro/452.png" alt="" />
      </div>
      <div className="bottom">
        <img className="bottom-img" src="/images/zafiro/453.png" alt="" />
      </div>
      <div className="contenido">
        <div id="portada"><ZafiroHero project={project} /></div>
        {photos[0] && (
          <div className="foto-con-degradado">
            <img className="foto-full show-p-y" src={photos[0]} alt="" />
          </div>
        )}
        <div id="familia"><ZafiroParents project={project} /></div>
        {photos[1] && (
          <div className="foto-con-degradado">
            <img className="foto-full show-p-y" src={photos[1]} alt="" />
          </div>
        )}
        <div id="fecha"><ZafiroDate project={project} /></div>
        <div id="ubicaciones"><ZafiroLocations project={project} /></div>
        {photos[2] && (
          <div className="foto-con-degradado">
            <img className="foto-full show-p-y" src={photos[2]} alt="" />
          </div>
        )}
        <div id="regalos"><ZafiroGifts project={project} /></div>
        {photos[3] && (
          <div className="foto-con-degradado">
            <img className="foto-full show-p-y" src={photos[3]} alt="" />
          </div>
        )}
        <div id="fotos"><ZafiroPhotoGrid photos={photos.slice(4)} /></div>
        <div id="itinerario"><ZafiroItinerary project={project} /></div>
        <ZafiroRSVP project={project} />
        {finalPhoto && (
          <div className="foto-final show-p-y" style={{ backgroundImage: `url(${finalPhoto})` }}>
            <div className="foto-final-texto">
              <h2>{project.quinceanera_name}</h2>
            </div>
          </div>
        )}
        <div className="despedida">¡Te Esperamos!</div>
      </div>
    </div>
  );
}
