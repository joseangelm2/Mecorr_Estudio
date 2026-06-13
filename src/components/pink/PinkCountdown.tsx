"use client";

import { useState, useEffect } from "react";

interface Props { eventDate: string }

export default function PinkCountdown({ eventDate }: Props) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function update() {
      const diff = new Date(eventDate).getTime() - Date.now();
      if (diff <= 0) return;
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [eventDate]);

  return (
    <div className="cuenta">
      {[{ v: t.days, u: "Días" }, { v: t.hours, u: "Horas" }, { v: t.minutes, u: "Minutos" }, { v: t.seconds, u: "Segundos" }].map(({ v, u }) => (
        <p key={u} className="segmento">
          <span className="numero">{v}</span>
          <span className="unidad">{u}</span>
        </p>
      ))}
    </div>
  );
}
