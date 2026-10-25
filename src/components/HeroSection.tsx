import { ScrollDownIcon } from "./icons";

interface Props {
  /** Carpeta base de las imágenes (cada demo usa la suya). Por defecto, la raíz /images. */
  assetBase?: string;
  heroPhotoUrl?: string;
  quinceaneraName?: string;
}

export default function HeroSection({
  assetBase = "/images",
  heroPhotoUrl = `${assetBase}/IMG_8198.JPG`,
  quinceaneraName = "Aime Ferreira",
}: Props) {
  return (
    <section id="portada" style={{ backgroundColor: "rgba(255,255,255,.5)" }}>
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
