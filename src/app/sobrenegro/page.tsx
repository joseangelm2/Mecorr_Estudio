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
import DemoFloatingControls from "@/components/DemoFloatingControls";
import { NAV_SOBRE } from "@/lib/demo-nav";

export default function RousePage() {
  return (
    <>
      <WowInit />
      <DemoFloatingControls candidates={NAV_SOBRE} />
      <IntroEnvelope assetBase="/images/sobrenegro" />
      <StickyBanner guestName="Aime Ferreira" />
      <HeroSection assetBase="/images/sobrenegro" />
      <CelebracionSection assetBase="/images/sobrenegro" />
      <ContadorSection assetBase="/images/sobrenegro" />
      <CeremoniaSection assetBase="/images/sobrenegro" />
      <RecepcionSection assetBase="/images/sobrenegro" />
      <ItinerarioSection assetBase="/images/sobrenegro" />
      <VestimentaSection assetBase="/images/sobrenegro" />
      <HashtagSection assetBase="/images/sobrenegro" />
      <FotosCarousel assetBase="/images/sobrenegro" />
      <RSVPSection assetBase="/images/sobrenegro" />
      <FinalSection assetBase="/images/sobrenegro" />
    </>
  );
}
