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
import VideoSection from "@/components/VideoSection";
import RSVPSection from "@/components/RSVPSection";
import FinalSection from "@/components/FinalSection";
import MesaRegalosSection from "@/components/MesaRegalosSection";
import LluviaSobresSection from "@/components/LluviaDesobresSection";

export default function EspecialPage() {
  return (
    <>
      <WowInit />
      <IntroEnvelope />
      <StickyBanner guestName="Aime Ferreira" />
      <HeroSection />
      <CelebracionSection />
      <ContadorSection />
      <CeremoniaSection />
      <RecepcionSection />
      <ItinerarioSection />
      <VestimentaSection />
      <HashtagSection />
      <FotosCarousel />
      <VideoSection />
      <MesaRegalosSection />
      <LluviaSobresSection />
      <RSVPSection />
      <FinalSection />
    </>
  );
}
