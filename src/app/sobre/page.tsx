import IntroEnvelope from "@/components/IntroEnvelope";
import StickyBanner from "@/components/StickyBanner";
import WowInit from "@/components/WowInit";
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
import VideoSection from "@/components/VideoSection";
import MesaRegalosSection from "@/components/MesaRegalosSection";
import LluviaSobresSection from "@/components/LluviaDesobresSection";
import DemoFloatingControls from "@/components/DemoFloatingControls";
import { NAV_SOBRE } from "@/lib/demo-nav";
export default function SobrePage() {
  return (
    <>
      <WowInit />
      <DemoFloatingControls candidates={NAV_SOBRE} />
      <IntroEnvelope assetBase="/images/sobre" />
      <StickyBanner guestName="Aime Ferreira" />
      <HeroSection assetBase="/images/sobre" />
      <CelebracionSection assetBase="/images/sobre" />
      <ContadorSection assetBase="/images/sobre" />
      <CeremoniaSection assetBase="/images/sobre" />
      <RecepcionSection assetBase="/images/sobre" />
      <ItinerarioSection assetBase="/images/sobre" />
      <VestimentaSection assetBase="/images/sobre" />
      <HashtagSection assetBase="/images/sobre" />
      <MesaRegalosSection assetBase="/images/sobre" />
      <LluviaSobresSection />
      <FotosCarousel assetBase="/images/sobre" />
      <VideoSection assetBase="/images/sobre" />
      <RSVPSection assetBase="/images/sobre" />
      <FinalSection assetBase="/images/sobre" />
    </>
  );
}
