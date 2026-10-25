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
import DemoFloatingControls from "@/components/DemoFloatingControls";
import { NAV_SOBRE } from "@/lib/demo-nav";

export default function EspecialPage() {
  return (
    <>
      <WowInit />
      <DemoFloatingControls candidates={NAV_SOBRE} />
      <IntroEnvelope assetBase="/images/especial/base" musicUrl="/images/especial/base/MiPrincesa.mp3" />
      <StickyBanner guestName="Aime Ferreira" />
      <HeroSection assetBase="/images/especial/base" />
      <CelebracionSection assetBase="/images/especial/base" />
      <ContadorSection assetBase="/images/especial/base" />
      <CeremoniaSection assetBase="/images/especial/base" />
      <RecepcionSection assetBase="/images/especial/base" />
      <ItinerarioSection assetBase="/images/especial/base" />
      <VestimentaSection assetBase="/images/especial/base" />
      <HashtagSection assetBase="/images/especial/base" />
      <FotosCarousel assetBase="/images/especial/base" />
      <VideoSection assetBase="/images/especial/base" />
      <MesaRegalosSection assetBase="/images/especial/base" />
      <LluviaSobresSection />
      <RSVPSection assetBase="/images/especial/base" />
      <FinalSection assetBase="/images/especial/base" />
    </>
  );
}
