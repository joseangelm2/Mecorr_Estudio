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
import ColorSwitcher from "@/components/ColorSwitcher";

export default function SobrePage() {
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
      <RSVPSection />
      <FinalSection />
      <ColorSwitcher defaultTheme="rosagold" />
    </>
  );
}
