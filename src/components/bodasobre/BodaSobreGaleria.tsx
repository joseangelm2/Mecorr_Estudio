"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  photos: string[];
  alt: string;
}

// Carrusel de fotos: tres fotos instantáneas (polaroid) encimadas e inclinadas hacia arriba a la
// izquierda. La de enfrente es la actual; las de atrás son las siguientes y se asoman por la esquina.
export default function BodaSobreGaleria({ photos, alt }: Props) {
  const [actual, setActual] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const toque = useRef<number | null>(null);
  const n = photos.length;

  function iniciar() {
    if (timer.current) clearInterval(timer.current);
    if (n < 2) return;
    timer.current = setInterval(() => setActual(p => (p + 1) % n), 3800);
  }

  useEffect(() => {
    iniciar();
    return () => { if (timer.current) clearInterval(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  function ir(i: number) {
    setActual(((i % n) + n) % n);
    iniciar();
  }

  return (
    <div className="bs-galeria">
      <div
        className="bs-galeria-pila"
        onClick={() => ir(actual + 1)}
        onTouchStart={e => { toque.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          if (toque.current === null) return;
          const dx = e.changedTouches[0].clientX - toque.current;
          toque.current = null;
          if (Math.abs(dx) > 40) ir(actual + (dx < 0 ? 1 : -1));
        }}
        role="group"
        aria-label="Carrusel de fotos"
      >
        {photos.map((src, i) => {
          const pos = (i - actual + n) % n;
          return (
            <figure key={`${src}-${i}`} className={`bs-instantanea bs-instantanea--${pos > 2 ? "fuera" : pos}`} aria-hidden={pos !== 0}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${alt} — foto ${i + 1}`} loading="lazy" draggable={false} />
            </figure>
          );
        })}
      </div>
      {n > 1 && (
        <div className="bs-galeria-puntos">
          {photos.map((_, i) => (
            <button key={i} type="button" className={i === actual ? "activo" : ""} onClick={() => ir(i)} aria-label={`Ir a la foto ${i + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}
