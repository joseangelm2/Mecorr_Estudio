"use client";

import { useState, type CSSProperties } from "react";

interface Petalo {
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
  titileo: number;
  titileoDelay: number;
}

function crearPetalos(cantidad: number): Petalo[] {
  return Array.from({ length: cantidad }, () => ({
    left: Math.random() * 100,
    size: 22 + Math.random() * 26,
    duration: 10 + Math.random() * 9,
    // Cada destello arranca en un momento distinto de su ciclo para que no titilen a la vez.
    delay: Math.random() * 18,
    opacity: 0.75 + Math.random() * 0.25,
    drift: 30 + Math.random() * 70,
    titileo: 1.8 + Math.random() * 2.2,
    titileoDelay: Math.random() * 3,
  }));
}

// Destellos (o la imagen que se suba: confeti, flores, corazones…) que caen y titilan sobre la invitación
// mientras se recorre. Se monta solo tras abrir la portada
// (cliente), así que el azar del estado inicial no genera diferencias de hidratación.
export default function BodaSobrePetalos({ cantidad = 14, imagenUrl }: { cantidad?: number; imagenUrl?: string }) {
  const [petalos] = useState<Petalo[]>(() => crearPetalos(cantidad));

  return (
    <div className="bs-petalos" aria-hidden="true">
      {petalos.map((p, i) => (
        <span
          key={i}
          className={`bs-petalo${imagenUrl ? " bs-petalo--img" : ""}`}
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              ...(imagenUrl ? { backgroundImage: `url(${imagenUrl})` } : {}),
              animationDuration: `${p.duration}s`,
              animationDelay: `-${p.delay}s`,
              "--bs-brillo": p.opacity,
              "--bs-drift": `${p.drift}px`,
              "--bs-titileo": `${p.titileo}s`,
              "--bs-titileo-delay": `-${p.titileoDelay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
