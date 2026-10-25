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
    size: 12 + Math.random() * 14,
    duration: 9 + Math.random() * 9,
    // Delay negativo: al montar ya hay pétalos a mitad de caída, no todos arrancan arriba.
    delay: Math.random() * 16,
    drift: 30 + Math.random() * 70,
    giro: 360 + Math.random() * 360,
    opacity: 0.55 + Math.random() * 0.35,
  }));
}

// Pétalos que caen sobre la invitación mientras se recorre. Se monta solo tras abrir el sobre
// (cliente), así que el azar del estado inicial no genera diferencias de hidratación.
export default function SelloRosaPetalos({ cantidad = 14 }: { cantidad?: number }) {
  const [petalos] = useState<Petalo[]>(() => crearPetalos(cantidad));

  return (
    <div className="sr-petalos" aria-hidden="true">
      {petalos.map((p, i) => (
        <span
          key={i}
          className="sr-petalo"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.25,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `-${p.delay}s`,
              "--sr-drift": `${p.drift}px`,
              "--sr-giro": `${p.giro}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
