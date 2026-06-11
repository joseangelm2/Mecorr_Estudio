"use client";

import { useState, useRef, useEffect } from "react";
import type { Project } from "@/types/invitation";

const DEFAULT_EVENTS = [
  { description: "Misa", time: "5:00 PM", icon: "misa.png" },
  { description: "Recepción", time: "7:00 PM", icon: "recepcion.png" },
  { description: "Coctelería", time: "8:00 PM", icon: "coctel.png" },
  { description: "Cena", time: "9:00 PM", icon: "comida.png" },
  { description: "Vals", time: "10:20 PM", icon: "vals.png" },
  { description: "Baile", time: "11:30 PM", icon: "baile.png" },
  { description: "Fin del Evento", time: "3:00 AM", icon: "fin.png" },
];

const DEFAULT_PHOTOS = [
  "/images/esmeralda/11.jpg", "/images/esmeralda/12.jpg",
  "/images/esmeralda/21.jpg", "/images/esmeralda/22.jpg",
  "/images/esmeralda/31.jpg", "/images/esmeralda/32.jpg",
  "/images/esmeralda/43.jpg", "/images/esmeralda/fotito.jpg",
  "/images/esmeralda/41.jpg",
];

function LoveCountdown({ eventDate }: { eventDate: string }) {
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
          {[{ v: t.days, l: " Días" }, { v: t.hours, l: " Horas" }, { v: t.minutes, l: " Minutos" }, { v: t.seconds, l: " Segundos" }].map(({ v, l }) => (
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

interface Props { project: Project }

export default function LoveContent({ project }: Props) {
  const mensajeRef = useRef<HTMLTextAreaElement>(null);
  const nombreRef = useRef<HTMLInputElement>(null);
  const [asistira, setAsistira] = useState(true);
  const [copied, setCopied] = useState(false);

  const phone = project.rsvp_phone ?? "";
  const photos = project.photos.length ? project.photos : DEFAULT_PHOTOS;
  const events = (project.show_itinerary && project.itinerary.length)
    ? project.itinerary.map((e, i) => ({ ...e, icon: e.icon || DEFAULT_EVENTS[i % DEFAULT_EVENTS.length]?.icon || "iglesia.png" }))
    : DEFAULT_EVENTS;

  const d = new Date(project.event_date);
  const dateStr = `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;

  const [firstName] = (project.quinceanera_name ?? "").split(" ");

  function enviarMensaje() {
    const msg = mensajeRef.current?.value ?? "";
    window.open(`https://api.whatsapp.com/send?phone=52${phone}&text=${encodeURIComponent(msg)}`, "_blank");
  }

  function copiarCuenta() {
    const account = (project.gift_registry?.bankAccount ?? "").replace(/\s/g, "");
    navigator.clipboard.writeText(account).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function confirmarAsistencia(e: React.FormEvent) {
    e.preventDefault();
    const nombre = nombreRef.current?.value ?? "";
    if (!confirm(asistira ? "¿Estás seguro de confirmar tu asistencia?" : "¿Estás seguro de no asistir?")) return;
    const msg = asistira
      ? `Hola, soy ${nombre} y confirmo mi asistencia.`
      : `Hola, soy ${nombre} y lamentablemente, no podré asistir.`;
    window.open(`https://api.whatsapp.com/send?phone=52${phone}&text=${encodeURIComponent(msg)}`, "_blank");
  }

  // Build photo grid: pairs of columns + leftover full-width
  const colPairs: [string, string][] = [];
  for (let i = 0; i + 1 < Math.min(photos.length, 6); i += 2) {
    colPairs.push([photos[i], photos[i + 1]]);
  }
  const extraPhotos = photos.slice(6, 10);

  return (
    <main>
      {/* Hero */}
      <section className="parallax-container parallax-1">
        <div className="hero-container">
          <div className="nombre"><h2 className="nombre-titulo">{firstName}</h2></div>
          <div className="date fecha-text"><h3>{dateStr}</h3></div>
          <div className="time"><LoveCountdown eventDate={project.event_date} /></div>
        </div>
      </section>

      {/* Frase + Ubicaciones */}
      <div className="contain">
        <div className="frase-container show-p-y">
          <h2 className="subtitulo">Te Invito a mis XV</h2>
          <hr className="separador" />
          {project.invitation_text ? (
            <p className="texto" style={{ width: "90%", margin: "auto" }}>{project.invitation_text}</p>
          ) : (
            <p className="texto" style={{ width: "90%", margin: "auto" }}>
              Mis XV años serán un sueño hecho realidad, y quiero que tú formes parte de este capítulo único en mi vida
            </p>
          )}
        </div>

        <div className="ubicaciones">
          <h2 className="subtitulo show-p-y">¿Dónde &amp; cuándo?</h2>
          <hr className="separador" />

          {project.ceremony && (
            <a
              style={{ marginTop: "5%" }}
              className="lugar show-n-x"
              href={project.ceremony.mapsUrl ?? project.ceremony.mapLink ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.ceremony.photoUrl && <img className="con-foto" src={project.ceremony.photoUrl} alt={project.ceremony.venue} />}
              <h4 className="nombre texto">{project.ceremony.venue}</h4>
              <h4 className="direccion texto">{project.ceremony.address}</h4>
              <h5 className="texto hora">{project.ceremony.time}</h5>
              <div className="button">Ir al Mapa</div>
            </a>
          )}

          {project.reception && (
            <a
              style={{ marginTop: "5%" }}
              className="lugar show-p-x"
              href={project.reception.mapsUrl ?? project.reception.mapLink ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.reception.photoUrl && <img className="con-foto" src={project.reception.photoUrl} alt={project.reception.venue} />}
              <h4 className="nombre texto">{project.reception.venue}</h4>
              <h4 className="direccion texto">{project.reception.address}</h4>
              <h5 className="texto hora">{project.reception.time}</h5>
              <div className="button">Ir al Mapa</div>
            </a>
          )}
        </div>
      </div>

      <section className="parallax-container parallax-2" />

      {/* Parents */}
      <div className="contain">
        <div className="familiares">
          {project.parent_names.filter(Boolean).length > 0 && (
            <section className="parents-container show-n-x">
              <h2 className="subtitulo">Mis Padres</h2>
              <hr className="separador" />
              <div className="parents">
                <p className="texto">
                  {project.parent_names.filter(Boolean).join("\n&\n").split("\n").map((t, i) => (
                    <span key={i}>{t === "&" ? <> &amp; </> : t}<br /></span>
                  ))}
                </p>
              </div>
            </section>
          )}
          {project.padrinos.filter(Boolean).length > 0 && (
            <section className="parents-container show-p-x" style={{ marginTop: "10%", marginBottom: "5%" }}>
              <h2 className="subtitulo">Padrinos</h2>
              <hr className="separador" />
              <div className="parents">
                <p className="texto">
                  {project.padrinos.filter(Boolean).join("\n&\n").split("\n").map((t, i) => (
                    <span key={i}>{t === "&" ? <> &amp; </> : t}<br /></span>
                  ))}
                </p>
              </div>
            </section>
          )}
        </div>
      </div>

      <section className="parallax-container parallax-3" />

      {/* Álbum */}
      <div className="contain album show-p-y">
        <h2 className="subtitulo">Álbum</h2>
        <hr className="separador" />
        <section id="grid">
          <div className="container-grid">
            {colPairs.map(([a, b], i) => (
              <div key={i} className="column">
                <img className="object-grid show-p-y" src={a} alt="" />
                <img className="object-grid show-p-y" src={b} alt="" />
              </div>
            ))}
            {extraPhotos.length >= 2 && (
              <div className="dos-fotos">
                <img className="object-grid show-p-y" src={extraPhotos[0]} alt="" />
                <img className="object-grid show-p-y" src={extraPhotos[1]} alt="" />
              </div>
            )}
            {extraPhotos[2] && (
              <div className="column full-width show-p-y">
                <img className="object-grid" src={extraPhotos[2]} alt="" />
              </div>
            )}
            {extraPhotos[3] && (
              <div className="column full-width show-p-y" style={{ marginTop: "-2%" }}>
                <img className="object-grid" src={extraPhotos[3]} alt="" />
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="parallax-container parallax-4" />

      {/* Itinerario */}
      {project.show_itinerary && (
        <div className="itinerario show-p-y">
          <h2 className="subtitulo">Programa del Evento</h2>
          <hr className="separador" />
          <div style={{ marginTop: "4vw" }}>
            {events.map((ev, i) => {
              const dir = i % 2 === 0 ? "izquierda" : "derecha";
              const iconSrc = ev.icon?.startsWith("http") || ev.icon?.startsWith("/") ? ev.icon : `/images/esmeralda/${ev.icon}`;
              return (
                <div key={i} className={`evento ${dir}`}>
                  <div className="icono"><div className="circulo"><img src={iconSrc} alt={ev.description} /></div></div>
                  <div className="item"><h4 className="nombre">{ev.description}</h4><p className="hora">{ev.time}</p></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <section className="parallax-container parallax-5" />

      {/* Extra sections */}
      <div className="contain">
        <div className="extra">
          {/* Dress Code */}
          {project.dress_code && (
            <section className="dress-code show-p-y" style={{ marginTop: "8%", marginBottom: "0" }}>
              <h2 className="subtitulo">Código de Vestimenta</h2>
              <hr className="separador" />
              <div className="dress-code-container">
                <img className="icon-extra" src="/images/esmeralda/vestimenta.png" alt="Vestimenta" />
                <p className="texto">{project.dress_code.colors || "Vestimenta Formal"}</p>
              </div>
            </section>
          )}

          {/* Lluvia de Sobres */}
          {project.show_lluvia_sobres && (
            <section className="gift-container show-p-y" style={{ marginTop: "8%", marginBottom: "0" }}>
              <h2 className="subtitulo">Lluvia de Sobres</h2>
              <hr className="separador" />
              <div className="gift-object-container">
                <img className="icon-extra" src="/images/esmeralda/sobre.png" alt="Sobre" />
                <p className="texto">{project.lluvia_sobres_text || "Es la tradición de regalar dinero en efectivo dentro de un sobre"}</p>
              </div>
            </section>
          )}

          {/* Mesa de Regalos */}
          {project.gift_registry?.liverpoolLink && (
            <section className="gift-liverpool-container show-p-y" style={{ marginTop: "8%", marginBottom: "0" }}>
              <h2 className="subtitulo">Mesa de Regalos</h2>
              <hr className="separador" />
              <div className="gift-liverpool-object-container">
                <img className="icon-extra" src="/images/esmeralda/mesa_regalos.png" alt="Mesa de regalos" />
                <p className="texto">Valoro enormemente tu compañía por encima de cualquier obsequio</p>
              </div>
              <div className="liverpool-container">
                <img src="/images/esmeralda/liverpool.png" alt="Liverpool" />
                <a className="button" href={project.gift_registry.liverpoolLink} target="_blank" rel="noopener noreferrer">Ver Lista de Deseos</a>
              </div>
            </section>
          )}

          {/* Datos Bancarios */}
          {project.show_datos_bancarios && project.gift_registry?.bankAccount && (
            <section className="gift-liverpool-container show-p-y" style={{ marginTop: "8%", marginBottom: "0" }}>
              <h2 className="subtitulo">Datos Bancarios</h2>
              <hr className="separador" />
              <div className="gift-liverpool-object-container">
                <p className="texto">{project.datos_bancarios_text || "Si lo prefieres puedes hacer una transferencia bancaria como regalo:"}</p>
                {project.gift_registry.bankBeneficiary && (
                  <><strong className="texto">Beneficiaria:</strong><p className="texto">{project.gift_registry.bankBeneficiary}</p></>
                )}
                <strong className="texto">CLABE:</strong>
                <p className="texto">{project.gift_registry.bankAccount}</p>
              </div>
              <div className="liverpool-container">
                <button className="button" onClick={copiarCuenta} style={{ width: "auto" }}>
                  {copied ? "¡Copiado!" : "Copiar"}
                </button>
              </div>
            </section>
          )}

          {/* Buzón de Deseos */}
          <section className="gift-container show-p-y" style={{ marginTop: "8%", marginBottom: "0" }}>
            <h2 className="subtitulo">Buzón de Deseos</h2>
            <hr className="separador" />
            <div className="gift-object-container">
              <img className="icon-extra" src="/images/esmeralda/buzon.png" alt="Buzón" />
              <p className="texto">Si quieres dejarme un lindo mensaje por mis XV, puedes hacerlo aquí:</p>
              <textarea ref={mensajeRef} className="mensaje" placeholder="Escribe tu mensaje aquí" />
              <button className="button" style={{ width: "60%" }} onClick={enviarMensaje}>Enviar Mensaje</button>
            </div>
          </section>

          {/* Hashtag */}
          {project.hashtag && (
            <section className="dress-code show-p-y" style={{ marginTop: "8%", marginBottom: "0" }}>
              <h2 className="subtitulo">Hashtag en Instagram</h2>
              <hr className="separador" />
              <div className="dress-code-container">
                <img className="icon-extra" src="/images/esmeralda/instagram.png" alt="Instagram" />
                <p className="texto">Comparte tus mejores momentos con el Hashtag en Instagram</p>
                <h2 className="subtitulo">{project.hashtag}</h2>
              </div>
              <div className="gift-object-container" style={{ width: "100%", marginTop: "3%" }}>
                <a className="button" href={`https://www.instagram.com/explore/tags/${project.hashtag.replace("#", "")}/`} target="_blank" rel="noopener noreferrer">Ver Fotos</a>
              </div>
            </section>
          )}

          {/* Important Info */}
          {project.dress_code?.notes && (
            <section className="dress-code show-p-y" style={{ marginTop: "8%", marginBottom: "0" }}>
              <h2 className="subtitulo">Información Importante</h2>
              <hr className="separador" />
              <p className="texto">❖ {project.dress_code.notes}</p>
            </section>
          )}

          {/* RSVP */}
          <section className="confirmacion-asistencia show-p-y" style={{ marginTop: "8%" }}>
            {project.confirmation_phrase ? (
              <h2>{project.confirmation_phrase}</h2>
            ) : (
              <h2>Favor de confirmar asistencia</h2>
            )}
            <form onSubmit={confirmarAsistencia}>
              <label htmlFor="lv-familia" className="texto">Nombre y Apellido:</label>
              <input ref={nombreRef} type="text" id="lv-familia" name="familia" maxLength={40} className="familia-input" required />
              <label className="texto" style={{ marginTop: "2%" }}>Confirmo que:</label>
              <div className="radio-group">
                <input type="radio" id="lv-asistire" name="confirmacion" value="asistire" checked={asistira} onChange={() => setAsistira(true)} />
                <label htmlFor="lv-asistire" className="texto">Asistiré</label>
              </div>
              <div className="radio-group">
                <input type="radio" id="lv-noAsistire" name="confirmacion" value="noAsistire" checked={!asistira} onChange={() => setAsistira(false)} />
                <label htmlFor="lv-noAsistire" className="texto">No Asistiré</label>
              </div>
              <input type="submit" className="button" value="Confirmar Asistencia" style={{ marginTop: "4%", cursor: "pointer" }} />
            </form>
          </section>
        </div>
      </div>

      <a className="footer" href="https://mecorrestudio.com" target="_blank" rel="noopener noreferrer">
        <span>MeCorr Estudio</span>
      </a>
    </main>
  );
}
