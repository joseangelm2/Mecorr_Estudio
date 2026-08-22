"use client";

import { useState } from "react";

const FALLBACK = [
  "/images/esmeralda/11.jpg",
  "/images/esmeralda/21.jpg",
  "/images/esmeralda/31.jpg",
  "/images/esmeralda/41.jpg",
];

interface Props { photos?: string[] }

export default function RosaGoldCarousel({ photos }: Props) {
  const images = photos?.length ? photos : FALLBACK;
  const [current, setCurrent] = useState(0);

  function prev() { setCurrent((c) => (c === 0 ? images.length - 1 : c - 1)); }
  function next() { setCurrent((c) => (c === images.length - 1 ? 0 : c + 1)); }

  return (
    <section id="fotos" className="rg-galeria">
      <div className="rg-slider-container">
        <div className="rg-slider">
          {images.map((src, i) => (
            <div key={src} className={`rg-slide${i === current ? " active" : ""}`}>
              <img src={src} alt={`Foto ${i + 1}`} />
            </div>
          ))}
        </div>
        <button className="rg-arrow rg-arrow-left" onClick={prev} aria-label="Anterior">◀</button>
        <button className="rg-arrow rg-arrow-right" onClick={next} aria-label="Siguiente">▶</button>
      </div>
    </section>
  );
}
