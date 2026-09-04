'use client'

import { useEffect, useRef } from "react";
import "@/app/sobre/sobre.css";
import { THEMES } from "@/lib/themes";
import type { Project } from "@/types/invitation";
import { getRsvpContacts, getRsvpEmail } from "@/lib/rsvp";
import WowInit from "@/components/WowInit";
import IntroEnvelope from "@/components/IntroEnvelope";
import FloatingMusicToggle from "@/components/FloatingMusicToggle";
import FloatingSectionNav from "@/components/FloatingSectionNav";
import StickyBanner from "@/components/StickyBanner";
import HeroSection from "@/components/HeroSection";
import CelebracionSection from "@/components/CelebracionSection";
import ContadorSection from "@/components/ContadorSection";
import CeremoniaSection from "@/components/CeremoniaSection";
import RecepcionSection from "@/components/RecepcionSection";
import ItinerarioSection from "@/components/ItinerarioSection";
import VestimentaSection from "@/components/VestimentaSection";
import HashtagSection from "@/components/HashtagSection";
import FotosCarousel from "@/components/FotosCarousel";
import RSVPSection from "@/components/RSVPSection";
import FinalSection from "@/components/FinalSection";
import LluviaSobresSection from "@/components/LluviaDesobresSection"
import DatosBancariosSection from "@/components/DatosBancariosSection";
import MesaRegalosSection from "@/components/MesaRegalosSection";
import VideoSection from "@/components/VideoSection";

interface Props {
  project: Project;
}

const NAV_CANDIDATES = [
  { id: "portada", label: "Portada" },
  { id: "celebracion", label: "Bienvenida" },
  { id: "contador", label: "Cuenta Regresiva" },
  { id: "ceremonia", label: "Ceremonia" },
  { id: "recepcion", label: "Recepción" },
  { id: "itinerario", label: "Itinerario" },
  { id: "vestimenta", label: "Vestimenta" },
  { id: "hashtag", label: "Comparte el Momento" },
  { id: "fotos", label: "Fotos" },
  { id: "video", label: "Video" },
  { id: "mesa-regalos", label: "Mesa de Regalos" },
  { id: "lluvia-sobres", label: "Lluvia de Sobres" },
  { id: "datos-bancarios", label: "Datos Bancarios" },
  { id: "deseos", label: "Confirmar Asistencia" },
  { id: "nombre", label: "Despedida" },
];

export default function SobreTemplate({ project }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    quinceanera_name,
    guest_name,
    event_date,
    rsvp_phone,
    hashtag,
    music_url,
    hero_photo_url,
    parent_names,
    padrinos,
    ceremony,
    reception,
    itinerary,
    dress_code,
    photos,
    gift_registry,
    color_theme,
    invitation_text,
    show_video,
    video_youtube_id,
    video_url,
    show_lluvia_sobres,
    lluvia_sobres_text,
    show_datos_bancarios,
    datos_bancarios_text,
    confirmation_phrase,
    confirmation_highlight_date,
  } = project;

  useEffect(() => {
    const theme = THEMES.find(t => t.id === color_theme) ?? THEMES[0];
    const root = document.documentElement;
    root.style.setProperty("--inv-primary", theme.primary);
    root.style.setProperty("--inv-primary-dark", theme.dark);
    root.style.setProperty("--inv-primary-light", theme.light ?? theme.primary);
    root.style.setProperty("--inv-border", theme.primary);
    root.style.setProperty("--inv-filter", theme.filterValue);
    root.style.setProperty("--inv-filter-light", theme.filterLight);
  }, [color_theme]);

  return (
    <>
      <WowInit />
      <IntroEnvelope musicUrl={music_url ?? undefined} showSwitcher={false} audioRef={audioRef} />
      {project.show_floating_controls !== false && (
        <>
          <FloatingMusicToggle audioRef={audioRef} />
          <FloatingSectionNav candidates={NAV_CANDIDATES} />
        </>
      )}
      <StickyBanner guestName={guest_name ?? quinceanera_name} />
      <HeroSection
        heroPhotoUrl={hero_photo_url ?? undefined}
        quinceaneraName={quinceanera_name}
      />
      <CelebracionSection
        quinceaneraName={quinceanera_name}
        parentNames={parent_names.length > 0 ? parent_names : undefined}
        padrinos={padrinos}
        invitationText={invitation_text ?? undefined}
        parentsTitle={(project.extra_config?.parents_title as string) || undefined}
        padrinosTitle={(project.extra_config?.padrinos_title as string) || undefined}
      />
      <ContadorSection
        eventDate={event_date}
        quinceaneraName={quinceanera_name}
      />
      {ceremony && <CeremoniaSection ceremony={ceremony} />}
      {reception && <RecepcionSection reception={reception} />}
      {itinerary.length > 0 && <ItinerarioSection itinerary={itinerary} />}
      {dress_code && <VestimentaSection dressCode={dress_code} project={project} />}
      {project.show_instagram_album && (project.instagram_mode === 'album' || hashtag) && (
        <HashtagSection hashtag={hashtag ?? undefined} mode={project.instagram_mode} slug={project.slug} />
      )}
      {photos.length > 0 && <FotosCarousel photos={photos} />}
      {show_video && (
        <VideoSection
          youtubeId={video_youtube_id ?? undefined}
          localVideo={video_url ?? undefined}
        />
      )}
      {gift_registry?.liverpoolLink && (
        <MesaRegalosSection liverpoolLink={gift_registry.liverpoolLink} giftStore={gift_registry.giftStore} />
      )}
      {show_lluvia_sobres && (
        <LluviaSobresSection text={lluvia_sobres_text ?? undefined} />
      )}
      {show_datos_bancarios && (
        <DatosBancariosSection
          bankAccount={gift_registry?.bankAccount}
          bankBeneficiary={gift_registry?.bankBeneficiary}
          text={datos_bancarios_text ?? undefined}
        />
      )}
      <RSVPSection
        rsvpPhone={rsvp_phone ?? undefined}
        rsvpContacts={getRsvpContacts(project)}
        rsvpEmail={getRsvpEmail(project) ?? undefined}
        confirmationPhrase={confirmation_phrase ?? undefined}
        highlightDate={confirmation_highlight_date ?? undefined}
      />
      <FinalSection
        quinceaneraName={quinceanera_name}
        finalPhotoUrl={(project.extra_config?.final_photo_url as string) || hero_photo_url || undefined}
      />
    </>
  );
}
