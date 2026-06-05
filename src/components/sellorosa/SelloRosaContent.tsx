"use client";

import { useState, useEffect } from "react";
import SelloRosaRSVP from "./SelloRosaRSVP";

const EVENTS = [
  { label: "Misa", hour: "5:00 PM", icon: "misa.png", reverse: false },
  { label: "Recepción", hour: "7:00 PM", icon: "recepcion.png", reverse: true },
  { label: "Coctelería", hour: "8:00 PM", icon: "coctel.png", reverse: false },
  { label: "Cena", hour: "9:00 PM", icon: "comida.png", reverse: true },
  { label: "Vals", hour: "10:20 PM", icon: "vals.png", reverse: false },
  { label: "Baile", hour: "11:30 PM", icon: "baile.png", reverse: true },
  { label: "Fin del Evento", hour: "3:00 AM", icon: "fin.png", reverse: false },
];

function SelloRosaCountdown() {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date("November 22, 2026 17:00:00").getTime();
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) return;
      setT({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="sr-countdown-wrapper">
      <div className="sr-countdown-title">Solo faltan</div>
      <div className="sr-countdown-grid">
        {[{ v: t.days, l: "Días" }, { v: t.hours, l: "Hrs" }, { v: t.minutes, l: "Min" }, { v: t.seconds, l: "Seg" }].map(({ v, l }) => (
          <div key={l} className="sr-countdown-item">
            <span className="sr-countdown-num">{v}</span>
            <span className="sr-countdown-label">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SelloRosaContent() {
  return (
    <main className="sr-main">
      <section className="sr-hero">
        <div className="sr-hero-content">
          <h1 className="sr-hero-title">Ximena</h1>
          <div className="sr-hero-xv">XV Años</div>
          <div className="sr-hero-date">22 · NOV · 2026</div>
        </div>
      </section>

      <div className="sr-divider" />

      <section className="sr-section show-p-y">
        <h2 className="sr-section-title">Te Invito a mis XV</h2>
        <hr className="sr-section-line" />
        <p className="sr-text">Mis quince años serán un sueño hecho realidad, y quiero que tú formes parte de este capítulo único en mi vida. Con todo mi amor, te invito a celebrar conmigo este día tan especial.</p>
      </section>

      <SelloRosaCountdown />

      <div className="sr-parents show-p-y">
        <section className="sr-section">
          <h2 className="sr-section-title">Mis Padres</h2>
          <hr className="sr-section-line" />
          <p className="sr-parent-name">Alfredo Carrasco Sandoval<br />&amp;<br />Ana Ortiz Torres</p>
        </section>
        <section className="sr-section" style={{ paddingTop: 0 }}>
          <h2 className="sr-section-title">Padrinos</h2>
          <hr className="sr-section-line" />
          <p className="sr-parent-name">Alfredo Salgado<br />&amp;<br />Monserrath Torres</p>
        </section>
      </div>

      <div className="sr-venues show-p-y">
        <section className="sr-section">
          <h2 className="sr-section-title">¿Dónde &amp; Cuándo?</h2>
          <hr className="sr-section-line" />
        </section>
        <a href="https://maps.app.goo.gl/NETRS4DCUrBhgXGx9" target="_blank" rel="noopener noreferrer" className="sr-venue-card show-n-x">
          <img src="/images/love/iglesia.jpg" alt="Parroquia San Peregrino" className="sr-venue-img" />
          <div className="sr-venue-name">Parroquia San Peregrino</div>
          <div className="sr-venue-address">Blvd. Solidaridad, Fuentes del Mezquital, Hermosillo</div>
          <div className="sr-venue-time">5:00 PM</div>
          <span className="sr-btn">Ver en el Mapa</span>
        </a>
        <a href="https://maps.app.goo.gl/NEusLqQqZhirLnCAA" target="_blank" rel="noopener noreferrer" className="sr-venue-card show-p-x">
          <img src="/images/love/evento.jpg" alt="Salón Villa Toscana" className="sr-venue-img" />
          <div className="sr-venue-name">Salón de Evento Villa Toscana</div>
          <div className="sr-venue-address">C. Quintero Arce 280, Puerta Grande, Hermosillo</div>
          <div className="sr-venue-time">7:00 PM</div>
          <span className="sr-btn">Ver en el Mapa</span>
        </a>
      </div>

      <div className="sr-divider" />

      <div className="sr-itinerario show-p-y">
        <section className="sr-section" style={{ background: "transparent", color: "white" }}>
          <h2 className="sr-section-title">Programa del Evento</h2>
          <hr className="sr-section-line" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)" }} />
        </section>
        <div style={{ padding: "0 16px 32px", maxWidth: "500px", margin: "0 auto" }}>
          {EVENTS.map((ev) => (
            <div key={ev.label} className={`sr-itinerario-item${ev.reverse ? " reverse" : ""}`}>
              <img src={`/images/esmeralda/${ev.icon}`} alt={ev.label} className="sr-itinerario-icon" />
              <div className="sr-itinerario-info">
                <div className="sr-itinerario-name">{ev.label}</div>
                <div className="sr-itinerario-hour">{ev.hour}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sr-vestimenta show-p-y">
        <section className="sr-section">
          <h2 className="sr-section-title">Código de Vestimenta</h2>
          <hr className="sr-section-line" />
          <img src="/images/esmeralda/vestimenta.png" alt="Vestimenta" className="sr-vestimenta-img" />
          <p className="sr-text">Vestimenta Formal</p>
          <p className="sr-text" style={{ marginTop: "8px", fontSize: "13px", color: "#f5babc" }}>❖ El color rosa queda reservado para la quinceañera</p>
        </section>
      </div>

      <div className="sr-hashtag show-p-y">
        <div className="sr-hashtag-text">#XVXimena</div>
        <div style={{ marginTop: "16px" }}>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="sr-btn" style={{ background: "rgba(255,255,255,0.3)", backdropFilter: "blur(4px)" }}>Ver Fotos</a>
        </div>
      </div>

      <div className="sr-info show-p-y">
        <section className="sr-section">
          <h2 className="sr-section-title">Información Importante</h2>
          <hr className="sr-section-line" />
          <p className="sr-info-item">❖ No se permiten niños.</p>
          <p className="sr-info-item">❖ El color rosa queda reservado exclusivamente para la quinceañera.</p>
          <p className="sr-info-item">❖ Favor de confirmar asistencia antes del 14 de Octubre.</p>
        </section>
      </div>

      <div className="sr-rsvp show-p-y">
        <section className="sr-section">
          <h2 className="sr-section-title">Confirma tu Asistencia</h2>
          <hr className="sr-section-line" />
          <p className="sr-text" style={{ marginBottom: "24px" }}>Tu presencia es el mejor regalo. Por favor confirma antes del 14 de Octubre.</p>
          <SelloRosaRSVP />
        </section>
      </div>

      <div className="sr-footer">Creaciones Manitas · 2026</div>
    </main>
  );
}
