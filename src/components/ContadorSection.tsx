"use client";

import { useEffect, useState } from "react";

const DEFAULT_EVENT_DATE = "2026-11-22T15:00:00";
const DEFAULT_DISPLAY_DATE = "22 de noviembre 2026";
const DEFAULT_CALENDAR_LINK =
  "https://calendar.google.com/calendar/r/eventedit?text=XV+Años+Aime+Ferreira&dates=20261122T150000/20261123T020000&details=Ceremonia+y+Recepción";

interface Props {
  eventDate?: string;
  quinceaneraName?: string;
}

export default function ContadorSection({
  eventDate = DEFAULT_EVENT_DATE,
  quinceaneraName = "Aime Ferreira",
}: Props) {
  const targetDate = new Date(eventDate).getTime();

  const displayDate = (() => {
    const d = new Date(eventDate);
    if (isNaN(d.getTime())) return DEFAULT_DISPLAY_DATE;
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
    ];
    return `${d.getDate()} de ${months[d.getMonth()]} ${d.getFullYear()}`;
  })();

  const calendarLink = (() => {
    const d = new Date(eventDate);
    if (isNaN(d.getTime())) return DEFAULT_CALENDAR_LINK;
    const pad = (n: number) => String(n).padStart(2, "0");
    const start = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const endDate = new Date(d.getTime() + 11 * 60 * 60 * 1000);
    const end = `${endDate.getFullYear()}${pad(endDate.getMonth() + 1)}${pad(endDate.getDate())}T${pad(endDate.getHours())}${pad(endDate.getMinutes())}00`;
    const title = encodeURIComponent(`XV Años ${quinceaneraName}`);
    return `https://calendar.google.com/calendar/r/eventedit?text=${title}&dates=${start}/${end}&details=Ceremonia+y+Recepción`;
  })();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function tick() {
      const now = Date.now();
      const distance = targetDate - now;
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
  }, [targetDate]);

  return (
    <section
      id="contador"
      className="padding-section"
      style={{ background: "linear-gradient(to right, var(--inv-primary-dark), var(--inv-primary), var(--inv-primary-light))", transition: "background 0.4s" }}
    >
      <div style={{ padding: "0 15px" }}>
        <div className="row justify-content-center">
          <div className="col-md-10 wow fadeInUp">
            <h1
              className="titulo mb-10 text-white text-center"
            >
              {displayDate}
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
                href={calendarLink}
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
