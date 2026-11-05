"use client";

import { useRef, useState, type CSSProperties } from "react";
import type { Project } from "@/types/invitation";
import BodaSobreMarco from "./BodaSobreMarco";

const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

// Trozo del sello roto: polígono (clip-path) de la misma imagen, con su trayectoria de salida.
interface Trozo {
  clip?: string;
  dx: number;
  dy: number;
  giro: number;
  escala: number;
  tam?: number;
  dur: number;
}

// Pocos trozos grandes e irregulares: cinco cuñas con grietas en zigzag que parten del centro del
// sello (las grietas se comparten entre vecinos, así que juntos reconstruyen el sello entero).
function crearTrozos(): Trozo[] {
  const trozos: Trozo[] = [];
  const n = 5;
  const c = [48 + Math.random() * 4, 48 + Math.random() * 4];
  // Reparto desigual del círculo en cuñas de distinto tamaño.
  const pesos = Array.from({ length: n }, () => 0.55 + Math.random() * 0.9);
  const total = pesos.reduce((a, b) => a + b, 0);
  const inicio = Math.random() * Math.PI * 2;
  let acum = 0;
  const rayos = pesos.map(w => {
    const a = inicio + (acum / total) * Math.PI * 2;
    acum += w;
    const r = 52 + Math.random() * 18;
    // Punto de la grieta a medio camino, desviado de lado para que no sea una línea recta.
    const t = 0.35 + Math.random() * 0.3;
    const lado = (Math.random() - 0.5) * 22;
    const zx = c[0] + Math.cos(a) * r * t - Math.sin(a) * lado;
    const zy = c[1] + Math.sin(a) * r * t + Math.cos(a) * lado;
    return { a, px: 50 + Math.cos(a) * r, py: 50 + Math.sin(a) * r, zx, zy };
  });
  const f = (v: number) => v.toFixed(1);
  for (let i = 0; i < n; i++) {
    const p = rayos[i], q = rayos[(i + 1) % n];
    const aq = q.a < p.a ? q.a + Math.PI * 2 : q.a;
    const am = (p.a + aq) / 2;
    const rm = 56 + Math.random() * 18; // punto intermedio del borde, a otra distancia
    const mx = 50 + Math.cos(am) * rm, my = 50 + Math.sin(am) * rm;
    const dist = 460 + Math.random() * 300;
    trozos.push({
      clip: `polygon(${f(c[0])}% ${f(c[1])}%, ${f(p.zx)}% ${f(p.zy)}%, ${f(p.px)}% ${f(p.py)}%, ${f(mx)}% ${f(my)}%, ${f(q.px)}% ${f(q.py)}%, ${f(q.zx)}% ${f(q.zy)}%)`,
      dx: Math.cos(am) * dist,
      dy: Math.sin(am) * dist + 140 + Math.random() * 120,
      giro: (Math.random() < 0.5 ? -1 : 1) * (160 + Math.random() * 280),
      escala: 1.4 + Math.random() * 1.0,
      dur: 1.9 + Math.random() * 0.7,
    });
  }
  // Unas pocas migajas doradas.
  for (let i = 0; i < 5; i++) {
    const a = Math.random() * Math.PI * 2;
    const dist = 380 + Math.random() * 420;
    trozos.push({
      dx: Math.cos(a) * dist,
      dy: Math.sin(a) * dist + 110 + Math.random() * 140,
      giro: (Math.random() - 0.5) * 540,
      escala: 0.7 + Math.random() * 1.2,
      tam: 6 + Math.random() * 9,
      dur: 1.5 + Math.random() * 0.6,
    });
  }
  return trozos;
}

interface Props {
  onOpen: () => void;
  project: Project;
}

// Sobre de boda: dos mitades de papel con el sello de cera al centro. Al tocar el sello las mitades
// se separan hacia los lados y dejan ver la invitación, que ya está detrás.
export default function BodaSobreEnvelope({ onOpen, project }: Props) {
  const [state, setState] = useState<"idle" | "opening" | "hidden">("idle");
  const selloRef = useRef<HTMLButtonElement>(null);
  const [roto, setRoto] = useState<{ trozos: Trozo[]; left: number; top: number; lado: number } | null>(null);

  function handleOpen() {
    if (state !== "idle") return;
    // El sello se quiebra donde está y sus pedazos salen volando de la escena.
    const r = selloRef.current?.getBoundingClientRect();
    if (r) setRoto({ trozos: crearTrozos(), left: r.left, top: r.top, lado: r.width });
    setState("opening");
    document.documentElement.classList.add("con-scroll");
    onOpen();
    setTimeout(() => setState("hidden"), 3500);
  }

  if (state === "hidden") return null;

  const d = new Date(project.event_date);
  const fecha = `${String(d.getDate()).padStart(2, "0")}.${MESES[d.getMonth()]}.${d.getFullYear()}`;
  const titulo = (project.extra_config?.mis_xv_text as string) || "¡Nos Casamos!";

  return (
    <div className={`bso-sobre${state === "opening" ? " abriendo" : ""}`}>
      <div className="bso-mitad bso-mitad--izq" />
      <div className="bso-mitad bso-mitad--der" />
      <div className="bso-contenido">
        <BodaSobreMarco project={project} portada />
        <p className="bso-titulo">{titulo}</p>
        <h1 className="bso-nombres">{project.quinceanera_name}</h1>
        <p className="bso-fecha">{fecha}</p>
        <button ref={selloRef} className={`bso-sello${roto ? " bso-sello--roto" : ""}`} onClick={handleOpen} aria-label="Abrir invitación">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/bodasobre/sello.png" alt="Abrir" />
        </button>
        <p className="bso-ayuda">Toca el sello para abrir</p>
      </div>
      {roto && (
        <div className="bso-trozos" style={{ left: roto.left, top: roto.top, width: roto.lado, height: roto.lado }} aria-hidden="true">
          {roto.trozos.map((t, i) => (
            <span
              key={i}
              className={t.tam ? "bso-migaja" : "bso-trozo"}
              style={
                {
                  "--dx": `${t.dx}px`,
                  "--dy": `${t.dy}px`,
                  "--giro": `${t.giro}deg`,
                  "--esc": t.escala,
                  animationDuration: `${t.dur}s`,
                  ...(t.tam ? { width: t.tam, height: t.tam } : { clipPath: t.clip }),
                } as unknown as CSSProperties
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {!t.tam && <img src="/images/bodasobre/sello.png" alt="" />}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
