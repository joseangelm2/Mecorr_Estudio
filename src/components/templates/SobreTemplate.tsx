'use client'

import { useEffect } from "react";
import "@/app/sobre/sobre.css";
import { THEMES } from "@/lib/themes";
import type { Project } from "@/types/invitation";
import WowInit from "@/components/WowInit";
import IntroEnvelope from "@/components/IntroEnvelope";
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

export default function SobreTemplate({ project }: Props) {
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
      <IntroEnvelope musicUrl={music_url ?? undefined} showSwitcher={false} />
      <StickyBanner guestName={guest_name ?? quinceanera_name} />
      <HeroSection
        heroPhotoUrl={hero_photo_url ?? undefined}
        quinceaneraName={quinceanera_name}
      />
      <CelebracionSection
        quinceaneraName={quinceanera_name}
        parentNames={parent_names.length > 0 ? parent_names : undefined}
        padrinos={padrinos.length > 0 ? padrinos : undefined}
        invitationText={invitation_text ?? undefined}
      />
      <ContadorSection
        eventDate={event_date}
        quinceaneraName={quinceanera_name}
      />
      {ceremony && <CeremoniaSection ceremony={ceremony} />}
      {reception && <RecepcionSection reception={reception} />}
      {itinerary.length > 0 && <ItinerarioSection itinerary={itinerary} />}
      {dress_code && <VestimentaSection dressCode={dress_code} />}
      {hashtag && <HashtagSection hashtag={hashtag} />}
      {photos.length > 0 && <FotosCarousel photos={photos} />}
      {show_video && (
        <VideoSection
          youtubeId={video_youtube_id ?? undefined}
          localVideo={video_url ?? undefined}
        />
      )}
      {gift_registry?.liverpoolLink && (
        <MesaRegalosSection liverpoolLink={gift_registry.liverpoolLink} />
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
