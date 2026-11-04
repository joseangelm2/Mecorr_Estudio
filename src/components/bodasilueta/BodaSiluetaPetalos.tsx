"use client";

import { useState, type CSSProperties } from "react";

interface Petalo {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  giro: number;
  opacity: number;
}

function crearPetalos(cantidad: number): Petalo[] {
  return Array.from({ length: cantidad }, () => ({
    left: Math.random() * 100,
    size: 16 + Math.random() * 16,
    duration: 9 + Math.random() * 9,
    // Delay negativo: al montar ya hay pétalos a mitad de caída, no todos arrancan arriba.
    delay: Math.random() * 16,
    drift: 30 + Math.random() * 70,
    giro: 360 + Math.random() * 360,
    opacity: 0.8 + Math.random() * 0.2,
  }));
}

// Pétalos (o la imagen que se suba: confeti, flores, corazones…) que caen sobre la invitación
// mientras se recorre. Se monta solo tras abrir la portada
// (cliente), así que el azar del estado inicial no genera diferencias de hidratación.
export default function BodaSiluetaPetalos({ cantidad = 14, imagenUrl }: { cantidad?: number; imagenUrl?: string }) {
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
              height: p.size * 1.25,
              opacity: p.opacity,
              ...(imagenUrl ? { backgroundImage: `url(${imagenUrl})` } : {}),
              animationDuration: `${p.duration}s`,
              animationDelay: `-${p.delay}s`,
              "--bs-drift": `${p.drift}px`,
              "--bs-giro": `${p.giro}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
