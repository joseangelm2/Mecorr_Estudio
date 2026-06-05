"use client";

import { useState } from "react";

const IMAGES = [
  "/images/IMG_8201.JPG",
  "/images/IMG_8202.JPG",
  "/images/IMG_8203.JPG",
  "/images/IMG_8204.JPG",
];

export default function RosaGoldCarousel() {
  const [current, setCurrent] = useState(0);

  function prev() { setCurrent((c) => (c === 0 ? IMAGES.length - 1 : c - 1)); }
  function next() { setCurrent((c) => (c === IMAGES.length - 1 ? 0 : c + 1)); }

  return (
    <section className="rg-galeria">
      <div className="rg-slider-container">
        <div className="rg-slider">
          {IMAGES.map((src, i) => (
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
