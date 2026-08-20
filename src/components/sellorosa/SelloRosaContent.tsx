"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/types/invitation";
import { getRsvpContacts, getRsvpEmail } from "@/lib/rsvp";
import DressCodePalette from "@/components/DressCodePalette";
import SelloRosaRSVP from "./SelloRosaRSVP";

interface Props {
  project: Project
}

function resolveIcon(icon: string | undefined): string {
  if (!icon) return "/images/esmeralda/iglesia.png";
  if (icon.startsWith("http") || icon.startsWith("/")) return icon;
  return `/images/esmeralda/${icon}`;
}

function SelloRosaCountdown({ eventDate }: { eventDate: string }) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date(eventDate).getTime();
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) return;
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [eventDate]);

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

export default function SelloRosaContent({ project }: Props) {
  const [copied, setCopied] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);

  const eventDate = new Date(project.event_date);
  const day = eventDate.getDate().toString().padStart(2, "0");
  const month = eventDate.toLocaleString("es-MX", { month: "short" }).toUpperCase();
  const year = eventDate.getFullYear();

  const nameParts = project.quinceanera_name.split(" ");
  const firstName = nameParts[0];

  const events = (project.itinerary ?? []).map((ev, i) => ({
    label: ev.title,
    hour: ev.time,
    icon: resolveIcon(ev.icon ?? ev.iconSrc),
    reverse: i % 2 !== 0,
  }));

  function handleCopyAccount() {
    const account = project.gift_registry?.bankAccount ?? "";
    navigator.clipboard.writeText(account).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <main className="sr-main">
      {/* Hero */}
      <section className="sr-hero">
        <div className="sr-hero-content">
          <h1 className="sr-hero-title">{firstName}</h1>
          <div className="sr-hero-xv">XV Años</div>
          <div className="sr-hero-date">{day} · {month} · {year}</div>
        </div>
      </section>

      <div className="sr-divider" />

      {/* Invitación */}
      <section className="sr-section show-p-y">
        <h2 className="sr-section-title">Te Invito a mis XV</h2>
        <hr className="sr-section-line" />
        <p className="sr-text">
          {project.invitation_text ?? "Mis quince años serán un sueño hecho realidad, y quiero que tú formes parte de este capítulo único en mi vida. Con todo mi amor, te invito a celebrar conmigo este día tan especial."}
        </p>
      </section>

      {/* Countdown */}
      <SelloRosaCountdown eventDate={project.event_date} />

      {/* Padres & Padrinos */}
      {(project.parent_names?.length > 0 || project.padrinos?.length > 0) && (
        <div className="sr-parents show-p-y">
          {project.parent_names?.length > 0 && (
            <section className="sr-section">
              <h2 className="sr-section-title">{(project.extra_config?.parents_title as string) || "Mis Padres"}</h2>
              <hr className="sr-section-line" />
              <p className="sr-parent-name">
                {project.parent_names.map((name, i) => (
                  <span key={i}>{name}{i < project.parent_names.length - 1 ? <><br />&amp;<br /></> : null}</span>
                ))}
              </p>
            </section>
          )}
          {project.padrinos?.length > 0 && (
            <section className="sr-section" style={{ paddingTop: 0 }}>
              <h2 className="sr-section-title">{(project.extra_config?.padrinos_title as string) || "Padrinos"}</h2>
              <hr className="sr-section-line" />
              <p className="sr-parent-name">
                {project.padrinos.map((name, i) => (
                  <span key={i}>{name}{i < project.padrinos.length - 1 ? <><br />&amp;<br /></> : null}</span>
                ))}
              </p>
            </section>
          )}
        </div>
      )}

      {/* Venues */}
      <div className="sr-venues show-p-y">
        <section className="sr-section">
          <h2 className="sr-section-title">¿Dónde &amp; Cuándo?</h2>
          <hr className="sr-section-line" />
        </section>
        {project.ceremony && (
          <a href={project.ceremony.mapsUrl} target="_blank" rel="noopener noreferrer" className="sr-venue-card show-n-x">
            <img src={project.ceremony.photoUrl ?? "/images/love/iglesia.jpg"} alt={project.ceremony.venue} className="sr-venue-img" />
            <div className="sr-venue-name">{project.ceremony.venue}</div>
            <div className="sr-venue-address">{project.ceremony.address}</div>
            <div className="sr-venue-time">{project.ceremony.time}</div>
            <span className="sr-btn">Ver en el Mapa</span>
          </a>
        )}
        {project.reception && (
          <a href={project.reception.mapsUrl} target="_blank" rel="noopener noreferrer" className="sr-venue-card show-p-x">
            <img src={project.reception.photoUrl ?? "/images/love/evento.jpg"} alt={project.reception.venue} className="sr-venue-img" />
            <div className="sr-venue-name">{project.reception.venue}</div>
            <div className="sr-venue-address">{project.reception.address}</div>
            <div className="sr-venue-time">{project.reception.time}</div>
            <span className="sr-btn">Ver en el Mapa</span>
          </a>
        )}
      </div>

      <div className="sr-divider" />

      {/* Itinerario */}
      {project.show_itinerary && events.length > 0 && (
        <div className="sr-itinerario show-p-y">
          <section className="sr-section" style={{ background: "transparent", color: "white" }}>
            <h2 className="sr-section-title">Programa del Evento</h2>
            <hr className="sr-section-line" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)" }} />
          </section>
          <div style={{ padding: "0 16px 32px", maxWidth: "500px", margin: "0 auto" }}>
            {events.map((ev) => (
              <div key={ev.label} className={`sr-itinerario-item${ev.reverse ? " reverse" : ""}`}>
                <img src={ev.icon} alt={ev.label} className="sr-itinerario-icon" />
                <div className="sr-itinerario-info">
                  <div className="sr-itinerario-name">{ev.label}</div>
                  <div className="sr-itinerario-hour">{ev.hour}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vestimenta */}
      {project.dress_code && (
        <div className="sr-vestimenta show-p-y">
          <section className="sr-section">
            <h2 className="sr-section-title">Código de Vestimenta</h2>
            <hr className="sr-section-line" />
            <img src="/images/esmeralda/vestimenta.png" alt="Vestimenta" className="sr-vestimenta-img" />
            <p className="sr-text">{project.dress_code.colors}</p>
            {project.dress_code.notes && (
              <p className="sr-text" style={{ marginTop: "8px", fontSize: "13px", color: "#f5babc" }}>❖ {project.dress_code.notes}</p>
            )}
            <DressCodePalette project={project} />
          </section>
        </div>
      )}

      {/* Liverpool */}
      {project.gift_registry?.liverpoolLink && (
        <div className="sr-info show-p-y">
          <section className="sr-section">
            <h2 className="sr-section-title">Mesa de Regalos</h2>
            <hr className="sr-section-line" />
            <a href={project.gift_registry.liverpoolLink} target="_blank" rel="noopener noreferrer" className="sr-btn" style={{ display: "inline-block", marginBottom: "12px" }}>
              Ver Lista Liverpool
            </a>
          </section>
        </div>
      )}

      {/* Lluvia de Sobres */}
      {project.show_lluvia_sobres && (
        <div className="sr-info show-p-y">
          <section className="sr-section">
            <h2 className="sr-section-title">Lluvia de Sobres</h2>
            <hr className="sr-section-line" />
            <p className="sr-info-item">{project.lluvia_sobres_text ?? "Es la tradición de regalar dinero en efectivo dentro de un sobre."}</p>
          </section>
        </div>
      )}

      {/* Datos Bancarios */}
      {project.show_datos_bancarios && project.gift_registry?.bankAccount && (
        <div className="sr-info show-p-y">
          <section className="sr-section">
            <h2 className="sr-section-title">Datos Bancarios</h2>
            <hr className="sr-section-line" />
            {accountVisible && (
              <>
                <p className="sr-info-item"><b>Cuenta:</b> {project.gift_registry.bankAccount}</p>
                {project.gift_registry.bankBeneficiary && (
                  <p className="sr-info-item"><b>Beneficiaria:</b> {project.gift_registry.bankBeneficiary}</p>
                )}
              </>
            )}
            <button
              onClick={() => (accountVisible ? handleCopyAccount() : setAccountVisible(true))}
              className="sr-btn"
              style={{ marginTop: "12px", cursor: "pointer", background: "none", border: "1px solid rgba(255,255,255,0.4)", borderRadius: "8px", padding: "6px 16px" }}
            >
              {!accountVisible ? "Mostrar cuenta" : copied ? "¡Copiado!" : "Copiar número de cuenta"}
            </button>
          </section>
        </div>
      )}

      {/* Hashtag */}
      {project.show_instagram_album && project.hashtag && (
        <div className="sr-hashtag show-p-y">
          <div className="sr-hashtag-text">{project.hashtag}</div>
          <div style={{ marginTop: "16px" }}>
            <a
              href={`https://www.instagram.com/explore/tags/${project.hashtag.replace("#", "")}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="sr-btn"
              style={{ background: "rgba(255,255,255,0.3)", backdropFilter: "blur(4px)" }}
            >
              Ver Fotos
            </a>
          </div>
        </div>
      )}

      {/* Confirmación */}
      <div className="sr-info show-p-y">
        <section className="sr-section">
          <h2 className="sr-section-title">Información Importante</h2>
          <hr className="sr-section-line" />
          {project.dress_code?.notes && (
            <p className="sr-info-item">❖ {project.dress_code.notes}</p>
          )}
          {project.confirmation_phrase && (
            <p className="sr-info-item">❖ {project.confirmation_phrase}</p>
          )}
        </section>
      </div>

      {/* RSVP */}
      <div className="sr-rsvp show-p-y">
        <section className="sr-section">
          <h2 className="sr-section-title">Confirma tu Asistencia</h2>
          <hr className="sr-section-line" />
          {project.confirmation_phrase && (
            <p className="sr-text" style={{ marginBottom: "24px" }}>{project.confirmation_phrase}</p>
          )}
          <SelloRosaRSVP contacts={getRsvpContacts(project)} email={getRsvpEmail(project)} />
        </section>
      </div>

      <div className="sr-footer">MeCorr Estudio · {year}</div>
    </main>
  );
}
