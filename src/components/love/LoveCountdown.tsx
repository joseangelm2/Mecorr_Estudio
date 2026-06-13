"use client";

import { useState, useEffect } from "react";

interface Props {
  eventDate: string;
}

export default function LoveCountdown({ eventDate }: Props) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(eventDate).getTime();
    function update() {
      const diff = target - Date.now();
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
    <section id="countdown">
      <div className="container">
        <div className="countdown-container">
          {[
            { v: t.days, l: "Días" },
            { v: t.hours, l: "Horas" },
            { v: t.minutes, l: "Minutos" },
            { v: t.seconds, l: "Segundos" },
          ].map(({ v, l }) => (
            <p key={l} className="segment">
              <span className="number">{v}</span>
              <span className="unit">{l}</span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
