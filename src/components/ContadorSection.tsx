"use client";

import { useEffect, useState } from "react";

const TARGET_DATE = new Date("November 22, 2026 15:00:00").getTime();

export default function ContadorSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function tick() {
      const now = Date.now();
      const distance = TARGET_DATE - now;
      if (distance < 0) return;
      const day = 86400000;
      const hour = 3600000;
      const minute = 60000;
      const second = 1000;
      setTimeLeft({
        days: Math.floor(distance / day),
        hours: Math.floor((distance % day) / hour),
        minutes: Math.floor((distance % hour) / minute),
        seconds: Math.floor((distance % minute) / second),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="contador"
      className="padding-section"
      style={{ backgroundColor: "var(--inv-primary)", transition: "background-color 0.4s" }}
    >
      <div style={{ padding: "0 15px" }}>
        <div className="row justify-content-center">
          <div className="col-md-10 wow fadeInUp">
            <h1
              className="titulo mb-10 text-white text-center"
            >
              22 Noviembre 2026
            </h1>
            <h1
              className="titulo mb-30 text-white text-center"
              style={{ fontSize: "26px" }}
            >
              Faltan:
            </h1>
            <ul className="tiempo mb-30">
              <li>
                <span className="circulo-tiempo">{timeLeft.days}</span>
                Días
              </li>
              <li>
                <span className="circulo-tiempo">{timeLeft.hours}</span>
                Hrs
              </li>
              <li>
                <span className="circulo-tiempo">{timeLeft.minutes}</span>
                Min
              </li>
              <li>
                <span className="circulo-tiempo">{timeLeft.seconds}</span>
                Seg
              </li>
            </ul>
            <div className="mb-0 text-center">
              <a
                href="https://calendar.google.com/calendar/r/eventedit?text=XV+Años+Aime+Ferreira&dates=20261122T150000/20261123T020000&details=Ceremonia+y+Recepción"
                target="_blank"
                rel="noopener noreferrer"
                className="link-abrir"
                style={{ border: "1px solid #fff", cursor: "pointer", display: "inline-block" }}
              >
                <img
                  src="/images/calendario.png"
                  alt="Calendario"
                  style={{ width: 16, height: 16, display: "inline", marginRight: 6 }}
                />
                Agregar a calendario
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
