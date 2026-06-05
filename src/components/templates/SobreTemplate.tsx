import "@/app/sobre/sobre.css";
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
import ColorSwitcher from "@/components/ColorSwitcher";
import LluviaSobresSection from "@/components/LluviaDesobresSection";
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
  } = project;

  return (
    <>
      <WowInit />
      <IntroEnvelope musicUrl={music_url ?? undefined} />
      <StickyBanner guestName={guest_name ?? undefined} />
      <HeroSection
        heroPhotoUrl={hero_photo_url ?? undefined}
        quinceaneraName={quinceanera_name}
      />
      <CelebracionSection
        quinceaneraName={quinceanera_name}
        parentNames={parent_names.length > 0 ? parent_names : undefined}
        padrinos={padrinos.length > 0 ? padrinos : undefined}
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
      {gift_registry?.liverpoolLink && (
        <MesaRegalosSection liverpoolLink={gift_registry.liverpoolLink} />
      )}
      {gift_registry?.bankAccount && (
        <LluviaSobresSection
          bankAccount={gift_registry.bankAccount}
          bankBeneficiary={gift_registry.bankBeneficiary}
        />
      )}
      <RSVPSection rsvpPhone={rsvp_phone ?? undefined} />
      <FinalSection
        quinceaneraName={quinceanera_name}
        finalPhotoUrl={hero_photo_url ?? undefined}
      />
      <ColorSwitcher defaultTheme="rosagold" />
      <VideoSection />
    </>
  );
}
