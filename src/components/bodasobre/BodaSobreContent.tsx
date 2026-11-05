"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/types/invitation";
import { getRsvpContacts, getRsvpEmail } from "@/lib/rsvp";
import BodaSobreGaleria from "./BodaSobreGaleria";
import DressCodePalette from "@/components/DressCodePalette";
import { VESTIMENTA_IMAGEN_DEFAULT, VESTIMENTA_PALETA_DEFAULT } from "@/lib/bodasobre-vestimenta";
import BodaSobreRSVP from "./BodaSobreRSVP";
import { decoracionBoda } from "@/lib/bodasobre-deco";
import BodaSobreMarco from "./BodaSobreMarco";

const IMG = "/images/bodasobre";

interface Props {
  project: Project
}

interface Hospedaje {
  nombre: string
  fotoUrl?: string
  mapsUrl?: string
  sitioWeb?: string
  telefono?: string
  nota?: string
}

interface MesaRegalos {
  giftStore: string
  link: string
  iconUrl?: string
}

const TIENDAS: Record<string, { label: string; icon: string }> = {
  liverpool: { label: "Liverpool", icon: `${IMG}/tiendas/liverpool.png` },
  amazon: { label: "Amazon", icon: `${IMG}/tiendas/amazon.svg` },
  palacio: { label: "El Palacio de Hierro", icon: `${IMG}/tiendas/palacio.svg` },
  sears: { label: "Sears", icon: `${IMG}/tiendas/sears.svg` },
  generic: { label: "Mesa de Regalos", icon: `${IMG}/tiendas/mesa_regalos.png` },
};

function resolveIcon(icon: string | undefined): string {
  if (!icon) return `${IMG}/iglesia.svg`;
  if (icon.startsWith("http") || icon.startsWith("/")) return icon;
  return `${IMG}/${icon}`;
}

function soloDigitos(tel: string): string {
  return tel.replace(/[^\d+]/g, "");
}

function Cuenta({ eventDate }: { eventDate: string }) {
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
    <div id="cuenta-regresiva" className="bs-countdown-wrapper">
      <div className="bs-countdown-title">Solo faltan</div>
      <div className="bs-countdown-grid">
        {[{ v: t.days, l: "Días" }, { v: t.hours, l: "Hrs" }, { v: t.minutes, l: "Min" }, { v: t.seconds, l: "Seg" }].map(({ v, l }) => (
          <div key={l} className="bs-countdown-item">
            <span className="bs-countdown-num">{v}</span>
            <span className="bs-countdown-label">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Nombres({ lista }: { lista: string[] }) {
  return (
    <p className="bs-parent-name">
      {lista.map((n, i) => (
        <span key={i}>{n}{i < lista.length - 1 ? <><br />&amp;<br /></> : null}</span>
      ))}
    </p>
  );
}

export default function BodaSobreContent({ project }: Props) {
  const [copied, setCopied] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);
  const extra = project.extra_config ?? {};
  const year = new Date(project.event_date).getFullYear();
  const accountLabel = project.gift_registry?.bankAccountType === "tarjeta" ? "TARJETA" : "CLABE";

  // Familias: padres de la novia (parent_names), padres del novio y padrinos.
  const padresNovia = (project.parent_names ?? []).filter(Boolean);
  const padresNovio = ((extra.padres_novio as string[] | undefined) ?? []).filter(Boolean);
  const padrinos = (project.padrinos ?? []).filter(Boolean);
  const tituloNovia = (extra.parents_title as string) || "Padres de la novia";
  const tituloNovio = (extra.padres_novio_title as string) || "Padres del novio";
  const tituloPadrinos = (extra.padrinos_title as string) || "Padrinos";

  const photos = (project.photos ?? []).filter(Boolean);
  const finalPhoto = (extra.final_photo_url as string) || photos[photos.length - 1] || project.hero_photo_url || "";

  const hospedajes = ((extra.hospedajes as Hospedaje[] | undefined) ?? []).filter((h) => h?.nombre);
  const tituloHospedaje = (extra.hospedaje_title as string) || "Hospedaje";
  const textoHospedaje = (extra.hospedaje_text as string) || "Te sugerimos estos lugares cercanos para que descanses durante la celebración.";

  // Mesas de regalos: la principal y las adicionales (cada una con su ícono opcional).
  const mesas: MesaRegalos[] = [];
  if (project.gift_registry?.liverpoolLink) {
    mesas.push({
      giftStore: project.gift_registry.giftStore ?? "liverpool",
      link: project.gift_registry.liverpoolLink,
      iconUrl: (extra.icono_tienda_url as string) || undefined,
    });
  }
  for (const r of (extra.gift_registries as Array<{ giftStore: string; liverpoolLink: string; iconUrl?: string }> | undefined) ?? []) {
    if (r?.liverpoolLink) mesas.push({ giftStore: r.giftStore, link: r.liverpoolLink, iconUrl: r.iconUrl });
  }

  const iconoVestimenta = (extra.icono_vestimenta_url as string) || `${IMG}/vestimenta.svg`;
  const iconoMesa = (extra.icono_mesa_regalos_url as string) || "";
  const iconoSobre = (extra.icono_sobre_url as string) || "";
  const iconoBanco = (extra.icono_datos_bancarios_url as string) || "";
  const iconoInstagram = (extra.icono_instagram_url as string) || "";

  const { separador } = decoracionBoda(project);
  const footerText = (extra.footer_text as string) || "";

  const events = (project.itinerary ?? []).map((ev, i) => ({
    label: ev.title,
    hour: ev.time,
    icon: resolveIcon(ev.icon ?? ev.iconSrc),
    // El ícono de iglesia de fábrica es dorado; los demás son blancos. Solo ese se tiñe de blanco
    // (los íconos que suba cada invitación se respetan tal cual).
    blanco: resolveIcon(ev.icon ?? ev.iconSrc) === `${IMG}/iglesia.svg`,
    reverse: i % 2 !== 0,
  }));

  // "Favor de confirmar asistencia antes del 1 de Diciembre": solo se muestra la fecha, en grande.
  const mFecha = (project.confirmation_phrase ?? "").match(/^(.*?)\s+((?:antes|hasta|a más tardar)\b.*)$/i);
  const fraseConfirma = mFecha
    ? { frase: mFecha[1], fecha: mFecha[2].charAt(0).toUpperCase() + mFecha[2].slice(1) }
    : { frase: project.confirmation_phrase ?? "", fecha: "" };
  // "Valeria & Andrés" → novia y novio (en ese orden), para rotular los botones de confirmación.
  const nombresPareja = (project.quinceanera_name ?? "").split(/\s*(?:&|\sy\s|\se\s)\s*/i).map(n => n.trim()).filter(Boolean);

  function handleCopyAccount() {
    const account = project.gift_registry?.bankAccount ?? "";
    navigator.clipboard.writeText(account).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const divisor = separador
    ? <img className="bs-deco-separador" src={separador} alt="" />
    : <div className="bs-divider" />;

  return (
    <main className="bs-main">
      <BodaSobreMarco project={project} />

      {/* Primera pantalla tras abrir: frase, cuenta regresiva y familias (compactas para caber juntas) */}
      <div id="portada" className="bs-inicio">
        <div className="bs-inicio-primera">
        <h2 className="bs-section-title bs-inicio-titulo">Nos casamos</h2>
        <div className="bs-inicio-frase">
          <p className="bs-text">
            {project.invitation_text ?? "Con la bendición de Dios y de nuestras familias, queremos compartir contigo el día más especial de nuestras vidas."}
          </p>
        </div>

        {project.hero_photo_url && (
          <div className="bs-inicio-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.hero_photo_url} alt="" className="bs-inicio-foto" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/bodasobre/anillos.png" alt="" className="bs-inicio-anillos" />
          </div>
        )}
        </div>

        <Cuenta eventDate={project.event_date} />

        {(padresNovia.length > 0 || padresNovio.length > 0 || padrinos.length > 0) && (
          <div id="familia" className="bs-familias-bloque show-p-y">
            <p className="bs-familias-frase">
              {(extra.familia_frase as string) || "Las personas que nos guiaron a este momento de nuestras vidas"}
            </p>
            <div className="bs-familias">
            {[
              { titulo: tituloNovia, nombres: padresNovia, foto: (extra.familia_foto_novia as string) || "" },
              { titulo: tituloNovio, nombres: padresNovio, foto: (extra.familia_foto_novio as string) || "" },
              { titulo: tituloPadrinos, nombres: padrinos, foto: (extra.familia_foto_padrinos as string) || "" },
            ]
              .filter(f => f.nombres.length > 0)
              .map(f => (
                <figure key={f.titulo} className="bs-familia">
                  <div className="bs-familia-foto">
                    {f.foto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={f.foto} alt={f.titulo} />
                    ) : (
                      <span aria-hidden="true">♥</span>
                    )}
                  </div>
                  <figcaption>
                    <h3 className="bs-familia-titulo">{f.titulo}</h3>
                    {f.nombres.map((n, k) => (
                      <p key={k} className="bs-familia-nombre">{n}</p>
                    ))}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>

      {divisor}

      {/* Ceremonia y recepción */}
      {(project.ceremony || project.reception) && (
        <div id="ubicaciones" className="bs-venues show-p-y">
          <section className="bs-section">
            <h2 className="bs-section-title">¿Dónde &amp; Cuándo?</h2>
            <hr className="bs-section-line" />
          </section>
          {project.ceremony && (
            <a href={project.ceremony.mapsUrl} target="_blank" rel="noopener noreferrer" className="bs-venue-card show-n-x">
              {project.ceremony.photoUrl && <img src={project.ceremony.photoUrl} alt={project.ceremony.venue} className="bs-venue-img" />}
              <div className="bs-venue-name">{project.ceremony.venue}</div>
              <div className="bs-venue-address">{project.ceremony.address}</div>
              <div className="bs-venue-time">{project.ceremony.time}</div>
              <span className="bs-btn">Ver en el Mapa</span>
            </a>
          )}
          {project.reception && (
            <a href={project.reception.mapsUrl} target="_blank" rel="noopener noreferrer" className="bs-venue-card show-p-x">
              {project.reception.photoUrl && <img src={project.reception.photoUrl} alt={project.reception.venue} className="bs-venue-img" />}
              <div className="bs-venue-name">{project.reception.venue}</div>
              <div className="bs-venue-address">{project.reception.address}</div>
              <div className="bs-venue-time">{project.reception.time}</div>
              <span className="bs-btn">Ver en el Mapa</span>
            </a>
          )}
        </div>
      )}

      {divisor}

      {/* Hospedaje: lugares recomendados, cada uno con foto, mapa, sitio web y teléfono */}
      {hospedajes.length > 0 && (
        <div id="hospedaje" className="bs-hospedaje show-p-y">
          <section className="bs-section" style={{ paddingBottom: 12 }}>
            <h2 className="bs-section-title">{tituloHospedaje}</h2>
            <hr className="bs-section-line" />
            <p className="bs-text">{textoHospedaje}</p>
          </section>
          <div className="bs-hospedaje-lista">
            {hospedajes.map((h, i) => (
              <article key={`${h.nombre}-${i}`} className="bs-hotel">
                {h.fotoUrl && <img className="bs-hotel-foto" src={h.fotoUrl} alt={h.nombre} loading="lazy" />}
                <div className="bs-hotel-cuerpo">
                  <h3 className="bs-hotel-nombre">{h.nombre}</h3>
                  {h.nota && <p className="bs-hotel-nota">{h.nota}</p>}
                  {h.telefono && (
                    <a className="bs-hotel-tel" href={`tel:${soloDigitos(h.telefono)}`}>☎ {h.telefono}</a>
                  )}
                  <div className="bs-hotel-acciones">
                    {h.mapsUrl && <a className="bs-btn" href={h.mapsUrl} target="_blank" rel="noopener noreferrer">Ver en el Mapa</a>}
                    {h.sitioWeb && <a className="bs-btn" href={h.sitioWeb} target="_blank" rel="noopener noreferrer">Sitio web</a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {hospedajes.length > 0 && divisor}

      {/* Itinerario */}
      {project.show_itinerary && events.length > 0 && (
        <div id="itinerario" className="bs-itinerario show-p-y">
          <section className="bs-section" style={{ background: "transparent", color: "white" }}>
            <h2 className="bs-section-title" style={{ color: "white" }}>Programa del Evento</h2>
            <hr className="bs-section-line" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)" }} />
          </section>
          <div style={{ padding: "0 16px 32px", maxWidth: "500px", margin: "0 auto" }}>
            {events.map((ev) => (
              <div key={ev.label} className={`bs-itinerario-item${ev.reverse ? " reverse" : ""}`}>
                <img src={ev.icon} alt={ev.label} className={`bs-itinerario-icon${ev.blanco ? " bs-icono-blanco" : ""}`} />
                <div className="bs-itinerario-info">
                  <div className="bs-itinerario-name">{ev.label}</div>
                  <div className="bs-itinerario-hour">{ev.hour}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Galería */}
      {photos.length > 0 && (
        <div id="fotos" className="bs-fotos show-p-y">
          <section className="bs-section" style={{ paddingBottom: 16 }}>
            <h2 className="bs-section-title">Momentos</h2>
            <hr className="bs-section-line" />
          </section>
          <BodaSobreGaleria photos={photos} alt={project.quinceanera_name} />
        </div>
      )}

      {photos.length > 0 && divisor}

      {/* Vestimenta */}
      {project.dress_code && (
        <div id="vestimenta" className="bs-vestimenta show-p-y">
          <section className="bs-section">
            <h2 className="bs-section-title">Código de Vestimenta</h2>
            <hr className="bs-section-line" />
            <img src={iconoVestimenta} alt="Vestimenta" className="bs-vestimenta-img" />
            <p className="bs-text">{project.dress_code.colors}</p>
            {project.dress_code.notes && (
              <p className="bs-text" style={{ marginTop: "8px", fontSize: "13px", color: "var(--bs-primary, #cb997e)" }}>❖ {project.dress_code.notes}</p>
            )}
            <DressCodePalette
              project={{
                ...project,
                extra_config: {
                  ...extra,
                  // Por defecto se muestran la paleta y la imagen de referencia; el admin puede cambiarlas u ocultarlas.
                  show_dress_palette: extra.show_dress_palette ?? true,
                  dress_palette: (extra.dress_palette as unknown[] | undefined)?.length ? extra.dress_palette : VESTIMENTA_PALETA_DEFAULT,
                  dress_code_image_url: extra.dress_code_image_url ?? VESTIMENTA_IMAGEN_DEFAULT,
                },
              }}
            />
          </section>
        </div>
      )}

      {project.dress_code && divisor}

      {/* Mesas de regalos (una o varias) */}
      {mesas.length > 0 && (
        <div id="regalos" className="bs-info show-p-y">
          <section className="bs-section">
            <h2 className="bs-section-title">{mesas.length > 1 ? "Mesas de Regalos" : "Mesa de Regalos"}</h2>
            <hr className="bs-section-line" />
            {iconoMesa && <img src={iconoMesa} alt="" className="bs-icono-seccion" />}
            <div className="bs-mesas">
              {mesas.map((m, i) => {
                const tienda = TIENDAS[m.giftStore] ?? TIENDAS.generic;
                return (
                  <a key={`${m.link}-${i}`} href={m.link} target="_blank" rel="noopener noreferrer" className="bs-mesa">
                    <img src={m.iconUrl || tienda.icon} alt={tienda.label} className="bs-mesa-icono" />
                    <span className="bs-btn">Ver lista {tienda.label}</span>
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* Lluvia de sobres */}
      {project.show_lluvia_sobres && (
        <div id="lluvia-sobres" className="bs-info show-p-y">
          <section className="bs-section">
            <h2 className="bs-section-title">Lluvia de Sobres</h2>
            <hr className="bs-section-line" />
            {iconoSobre && <img src={iconoSobre} alt="" className="bs-icono-seccion" />}
            <p className="bs-info-item">{project.lluvia_sobres_text ?? "Es la tradición de regalar dinero en efectivo dentro de un sobre."}</p>
          </section>
        </div>
      )}

      {/* Datos bancarios */}
      {project.show_datos_bancarios && project.gift_registry?.bankAccount && (
        <div id="datos-bancarios" className="bs-info show-p-y">
          <section className="bs-section">
            <h2 className="bs-section-title">Datos Bancarios</h2>
            <hr className="bs-section-line" />
            {iconoBanco && <img src={iconoBanco} alt="" className="bs-icono-seccion" />}
            {accountVisible && (
              <>
                <p className="bs-info-item"><b>{accountLabel}:</b> {project.gift_registry.bankAccount}</p>
                {project.gift_registry.bankBeneficiary && (
                  <p className="bs-info-item"><b>Beneficiario:</b> {project.gift_registry.bankBeneficiary}</p>
                )}
              </>
            )}
            <button
              onClick={() => (accountVisible ? handleCopyAccount() : setAccountVisible(true))}
              className="bs-btn"
              style={{ marginTop: "12px" }}
            >
              {!accountVisible ? "Mostrar cuenta" : copied ? "¡Copiado!" : `Copiar ${accountLabel}`}
            </button>
          </section>
        </div>
      )}

      {/* Hashtag */}
      {project.show_instagram_album && project.hashtag && (
        <div id="hashtag" className="bs-hashtag show-p-y">
          {iconoInstagram && <img src={iconoInstagram} alt="" className="bs-icono-seccion" />}
          <div className="bs-hashtag-text">{project.hashtag}</div>
          <div style={{ marginTop: "16px" }}>
            <a
              href={`https://www.instagram.com/explore/tags/${project.hashtag.replace("#", "")}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="bs-btn"
              style={{ background: "rgba(255,255,255,0.3)", backdropFilter: "blur(4px)" }}
            >
              Ver Fotos
            </a>
          </div>
        </div>
      )}

      {/* Información importante: solo el texto propio. La vestimenta y la frase de confirmación ya
          se muestran en su sección, así que no se repiten aquí. */}
      {project.important_info_text && (
        <div className="bs-info show-p-y">
          <section className="bs-section">
            <h2 className="bs-section-title">Información Importante</h2>
            <hr className="bs-section-line" />
            <p className="bs-info-item">{project.important_info_text}</p>
          </section>
        </div>
      )}

      {/* Foto de cierre */}
      {finalPhoto && (
        <div className="bs-cierre show-p-y" style={{ backgroundImage: `url(${finalPhoto})` }}>
          <div className="bs-cierre-texto">
            <span>¡Los esperamos!</span>
            <strong>{project.quinceanera_name}</strong>
          </div>
        </div>
      )}

      {/* Confirmación de asistencia */}
      <div id="confirmar" className="bs-rsvp show-p-y">
        <section className="bs-section">
          <h2 className="bs-section-title">Confirma tu Asistencia</h2>
          <hr className="bs-section-line" />
          {project.confirmation_phrase && (
            <div className="bs-confirma">
              {/* Con fecha límite solo se muestra la fecha; sin ella, la frase completa. */}
              {fraseConfirma.fecha
                ? <p className="bs-confirma-fecha">{fraseConfirma.fecha}</p>
                : <p className="bs-text bs-confirma-frase">{fraseConfirma.frase}</p>}
            </div>
          )}
          <BodaSobreRSVP contacts={getRsvpContacts(project)} email={getRsvpEmail(project)} festejada={project.quinceanera_name} nombres={nombresPareja} />
        </section>
      </div>

      {footerText && <p className="bs-text" style={{ textAlign: "center", padding: "16px 24px" }}>{footerText}</p>}
      <div className="bs-footer">MeCorr Estudio · {year}</div>
    </main>
  );
}
