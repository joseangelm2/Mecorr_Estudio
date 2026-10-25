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
      <IntroEnvelope assetBase="/images/sobrelila" />
      <StickyBanner guestName="Aime Ferreira" />
      <HeroSection assetBase="/images/sobrelila" />
      <CelebracionSection assetBase="/images/sobrelila" />
      <ContadorSection assetBase="/images/sobrelila" />
      <CeremoniaSection assetBase="/images/sobrelila" />
      <RecepcionSection assetBase="/images/sobrelila" />
      <ItinerarioSection assetBase="/images/sobrelila" />
      <VestimentaSection assetBase="/images/sobrelila" />
      <HashtagSection assetBase="/images/sobrelila" />
      <FotosCarousel assetBase="/images/sobrelila" />
      <RSVPSection assetBase="/images/sobrelila" />
      <FinalSection assetBase="/images/sobrelila" />
    </>
  );
}
