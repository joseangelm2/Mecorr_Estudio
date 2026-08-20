"use client";

import "@/app/zafiro/zafiro.css";
import { useState, useRef, useEffect } from "react";
import type { Project } from "@/types/invitation";
import { ZAFIRO_THEMES, DEFAULT_ZAFIRO_THEME, ZAFIRO_ICON_BASE } from "@/lib/zafiro-themes";
import { shadeHex, hexToFilterFrom } from "@/lib/color";
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

  const customColor = (project.extra_config?.custom_color as string) || "";
  const theme = project.color_theme === "custom" && customColor
    ? {
        id: "custom",
        label: "Personalizado",
        swatch: customColor,
        primary: customColor,
        primaryLight: shadeHex(customColor, 45),
        bgColor: shadeHex(customColor, 62),
        iconFilterDark: hexToFilterFrom(shadeHex(customColor, -20), ZAFIRO_ICON_BASE),
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
    return () => {
      const vars = ["--color-principal", "--color-principal-light", "--bg-color", "--zafiro-dark-filter"];
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
