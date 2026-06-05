import { ScrollDownIcon } from "./icons";

export default function HeroSection() {
  return (
    <section style={{ backgroundColor: "rgba(255,255,255,.5)" }}>
      <img src="/images/IMG_8198.JPG" width="100%" alt="Aime Ferreira" />
      <div
        className="text-center"
        style={{ marginTop: "-60px", zIndex: 9999, position: "relative" }}
      >
        <ScrollDownIcon />
      </div>
    </section>
  );
}
