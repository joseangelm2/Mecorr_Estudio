"use client";

import { useState, useRef } from "react";
import VintageEnvelope from "@/components/vintage/VintageEnvelope";
import EsmeraldaScrollInit from "@/components/esmeralda/EsmeraldaScrollInit";
import CenicientaContent from "@/components/cenicienta/CenicientaContent";
import type { Project } from "@/types/invitation";

const PRIMARY = "#c48602";

const DEMO_PROJECT: Project = {
  id: "demo",
  slug: "demo-cenicienta",
  template: "cenicienta",
  status: "published",
  created_at: "",
  updated_at: "",
  quinceanera_name: "Alison Galván Méndez",
  guest_name: null,
  event_date: "2026-11-22T17:00:00",
  rsvp_phone: "524438569931",
  hashtag: "XVAlison",
  music_url: "/images/esmeralda/musica.mp3",
  hero_photo_url: "/images/esmeralda/foto.jpg",
  parent_names: ["Elías Moises Galván Juárez", "Esperanza Méndez Hernández"],
  padrinos: ["José Feliciano Hernández", "María Carolina Escandón Cruz"],
  ceremony: {
    time: "5:00 PM",
    venue: "Parroquia San Peregrino",
    address: "Blvd. Solidaridad, Fuentes del Mezquital, 83250 Hermosillo, Son.",
    mapsUrl: "https://maps.app.goo.gl/EKZpeKCqNpt8PqBo6",
  },
  reception: {
    time: "7:00 PM",
    venue: "Salón de Evento Villa Toscana",
    address: "C. Quintero Arce 280, Puerta Grande, 83246 Hermosillo, Son.",
    mapsUrl: "https://maps.app.goo.gl/NEusLqQqZhirLnCAA",
  },
  itinerary: [],
  dress_code: { colors: "Vestimenta Formal", notes: "" },
  photos: [
    "/images/esmeralda/11.jpg",
    "/images/esmeralda/21.jpg",
    "/images/esmeralda/31.jpg",
    "/images/esmeralda/41.jpg",
  ],
  gift_registry: {
    liverpoolLink: "https://mesaderegalos.liverpool.com.mx/milistaderegalos/51309081",
    bankAccount: "4027 6657 1234 4321",
    bankBeneficiary: "Alejandra Hernández Ramírez",
  },
  color_theme: "#c48602",
  invitation_text: null,
  show_video: false,
  video_youtube_id: null,
  video_url: null,
  show_lluvia_sobres: false,
  lluvia_sobres_text: null,
  show_datos_bancarios: false,
  datos_bancarios_text: null,
  confirmation_phrase: null,
  confirmation_highlight_date: null,
  extra_config: {},
};

export default function CenicientaPage() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleOpen() {
    setEnvelopeOpen(true);
    audioRef.current?.play().catch(() => {});
  }

  return (
    <div style={{ position: "relative" }}>
      <EsmeraldaScrollInit />
      <audio ref={audioRef} loop>
        <source src="/images/esmeralda/musica.mp3" type="audio/mpeg" />
      </audio>

      {!envelopeOpen && (
        <VintageEnvelope onOpen={handleOpen} primaryColor={PRIMARY} />
      )}

      <div className="top">
        <img className="top-img" src="/images/cenicienta/452.png" alt="" />
      </div>
      <div className="bottom">
        <img className="bottom-img" src="/images/cenicienta/453.png" alt="" />
      </div>

      <CenicientaContent project={DEMO_PROJECT} />
    </div>
  );
}
