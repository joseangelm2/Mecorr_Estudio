"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("November 22, 2026 17:00:00").getTime();

export default function MagicalCountdown() {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function tick() {
      const distance = TARGET - Date.now();
      if (distance < 0) return;
      setT({
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance % 86400000) / 3600000),
        minutes: Math.floor((distance % 3600000) / 60000),
        seconds: Math.floor((distance % 60000) / 1000),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="time no-print">
      <img src="/images/magical/reloj.png" alt="Reloj mágico" />
      <section id="countdown">
        <div className="container">
          <div className="countdown-container">
            <p className="segment">
              <span className="number" id="days">{t.days}</span>
              <span className="unit"> Días</span>
            </p>
            <p className="segment">
              <span className="number" id="hours">{t.hours}</span>
              <span className="unit"> Horas</span>
            </p>
            <p className="segment">
              <span className="number" id="minutes">{t.minutes}</span>
              <span className="unit"> Minutos</span>
            </p>
            <p className="segment">
              <span className="number" id="seconds">{t.seconds}</span>
              <span className="unit"> Segundos</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
