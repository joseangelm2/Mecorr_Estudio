import { ScrollDownIcon } from "./icons";

interface Props {
  heroPhotoUrl?: string;
  quinceaneraName?: string;
}

export default function HeroSection({
  heroPhotoUrl = "/images/IMG_8198.JPG",
  quinceaneraName = "Aime Ferreira",
}: Props) {
  return (
    <section style={{ backgroundColor: "rgba(255,255,255,.5)" }}>
      <img src={heroPhotoUrl} width="100%" alt={quinceaneraName} />
      <div
        className="text-center"
        style={{ marginTop: "-60px", zIndex: 9999, position: "relative" }}
      >
        <ScrollDownIcon />
      </div>
    </section>
  );
}
