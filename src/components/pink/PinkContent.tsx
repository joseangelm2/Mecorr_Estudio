"use client";

import { useState, useRef, useEffect } from "react";
import type { Project } from "@/types/invitation";

const DEFAULT_PHOTOS = [
  "/images/esmeralda/21.jpg",
  "/images/esmeralda/31.jpg",
  "/images/esmeralda/41.jpg",
  "/images/esmeralda/12.jpg",
];

const DEFAULT_EVENTS = [
  { description: "Misa", time: "05:00 PM", icon: "/images/esmeralda/iglesia.png" },
  { description: "Recepción", time: "07:00 PM", icon: "/images/esmeralda/recepcion.png" },
  { description: "Coctelería", time: "08:00 PM", icon: "/images/esmeralda/coctel.png" },
  { description: "Cena", time: "09:00 PM", icon: "/images/esmeralda/comida.png" },
  { description: "Vals", time: "10:20 PM", icon: "/images/esmeralda/vals.png" },
  { description: "Baile", time: "11:30 PM", icon: "/images/esmeralda/baile.png" },
  { description: "Fin del Evento", time: "03:00 AM", icon: "/images/esmeralda/fin.png" },
];

function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    function update() {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    day: d.getDate(),
    month: d.toLocaleDateString("es-MX", { month: "long" }),
    year: d.getFullYear(),
  };
}

interface Props { project: Project }

export default function PinkContent({ project }: Props) {
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [attending, setAttending] = useState(true);
  const [copied, setCopied] = useState(false);

  const eventDate = new Date(project.event_date);
  const countdown = useCountdown(eventDate);
  const { day, month, year } = formatDate(project.event_date);

  const phone = project.rsvp_phone ?? "";
  const photos = project.photos.length ? project.photos : DEFAULT_PHOTOS;
  const events = (project.show_itinerary && project.itinerary.length)
    ? project.itinerary.map((e, i) => ({ ...e, icon: e.icon || DEFAULT_EVENTS[i % DEFAULT_EVENTS.length]?.icon || "/images/esmeralda/iglesia.png" }))
    : DEFAULT_EVENTS;

  const [nameParts] = (project.quinceanera_name ?? "").split(" ");
  const lastName = (project.quinceanera_name ?? "").split(" ").slice(1).join(" ");

  function sendWA(msg: string) {
    window.open(`https://api.whatsapp.com/send?phone=52${phone}&text=${encodeURIComponent(msg)}`, "_self");
  }

  function handleRSVP(e: React.FormEvent) {
    e.preventDefault();
    const name = nameRef.current?.value ?? "";
    const msg = attending
      ? `Hola, soy ${name} y confirmo mi asistencia.`
      : `Hola, soy ${name} y lamentablemente, no podré asistir.`;
    sendWA(msg);
  }

  function handleCopy() {
    const account = (project.gift_registry?.bankAccount ?? "").replace(/\s/g, "");
    navigator.clipboard.writeText(account).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const galleryPairs: string[][] = [];
  for (let i = 0; i < photos.length - 1; i += 2) galleryPairs.push([photos[i], photos[i + 1]]);
  const lastPhoto = photos.length % 2 !== 0 ? photos[photos.length - 1] : photos[photos.length - 1] ?? null;

  return (
    <div className="contenido">
      {/* Hero */}
      <div className="encabezado">
        <h2 className="nombre-principal" style={{ fontSize: "13vw" }}>Mis XV</h2>
      </div>

      {project.invitation_text && (
        <div className="frase">{project.invitation_text}</div>
      )}
      {!project.invitation_text && (
        <div className="frase">Hoy comienza un camino que conduce a un mundo nuevo de ilusión, esperanza y unos bellos sueños.</div>
      )}

      {project.hero_photo_url && (
        <div className="foto-con-degradado">
          <img className="foto-full" src={project.hero_photo_url} alt={project.quinceanera_name} />
        </div>
      )}

      <div className="encabezado">
        <h2 className="nombre-principal">{nameParts}</h2>
        {lastName && <h1 className="evento">{lastName}</h1>}
      </div>

      <div className="frase show">
        &ldquo;Porque este día es muy importante para mí, quiero compartirlo con las personas que llevo en mi corazón. Tú eres una de ellas.&rdquo;
      </div>

      {photos[0] && (
        <div className="foto-con-degradado">
          <img className="foto-full show-p-y" src={photos[0]} alt="" />
        </div>
      )}

      {/* Parents */}
      {project.parent_names.length > 0 && (
        <>
          <div className="frase show-p-y" style={{ fontSize: "5.5vw", marginBottom: "-3%" }}>Con la bendición de Dios y de</div>
          <div className="familia show-p-y">
            <h3 style={{ fontStyle: "italic" }}>Mis Padres</h3>
            {project.parent_names.filter(Boolean).map((n, i, arr) => (
              <span key={i}>
                <p className="nombre">{n}</p>
                {i < arr.length - 1 && <p className="nombre">&amp;</p>}
              </span>
            ))}
          </div>
        </>
      )}

      {project.padrinos.filter(Boolean).length > 0 && (
        <>
          <div className="frase show-p-y" style={{ fontSize: "5.5vw" }}>Y la compañía de</div>
          <div className="familia show-p-y">
            <h3 style={{ fontStyle: "italic" }}>Mis Padrinos</h3>
            {project.padrinos.filter(Boolean).map((n, i, arr) => (
              <span key={i}>
                <p className="nombre">{n}</p>
                {i < arr.length - 1 && <p className="nombre">&amp;</p>}
              </span>
            ))}
          </div>
        </>
      )}

      {photos[1] && (
        <div className="foto-con-degradado">
          <img className="foto-full show-p-y" src={photos[1]} alt="" />
        </div>
      )}

      {/* Date */}
      <div className="frase show" style={{ fontSize: "5.5vw" }}>Celebremos juntos</div>
      <div className="encabezado show" style={{ marginBottom: "-5%" }}>
        <h3 className="evento">El día</h3>
      </div>
      <div className="fecha">
        <p className="dia">{day}</p>
        <div className="barra" />
        <p className="mes" style={{ textTransform: "capitalize" }}>{month}</p>
        <div className="barra" />
        <p className="anio">{year}</p>
      </div>
      <div className="cuenta">
        {[{ v: countdown.days, u: "Días" }, { v: countdown.hours, u: "Horas" }, { v: countdown.minutes, u: "Minutos" }, { v: countdown.seconds, u: "Segundos" }].map(({ v, u }) => (
          <p key={u} className="segmento">
            <span className="numero">{v}</span>
            <span className="unidad">{u}</span>
          </p>
        ))}
      </div>

      <div className="frase show" style={{ fontStyle: "italic" }}>
        Los momentos que disfrutas con tus seres queridos se transforman en recuerdos imborrables que perduran eternamente...
      </div>

      {/* Ceremony */}
      {project.ceremony && (
        <>
          {project.ceremony.photoUrl && (
            <img className="foto-full show-p-y" src={project.ceremony.photoUrl} style={{ marginTop: "5%", borderRadius: "2vw" }} alt="" />
          )}
          <a className="ubicacion show-p-y" href={project.ceremony.mapsUrl ?? project.ceremony.mapLink ?? "#"} target="_self">
            <div>
              <p className="lugar-titulo">Ceremonia Religiosa</p>
              <p className="lugar">{project.ceremony.venue}</p>
              <span className="direccion">{project.ceremony.address}</span>
              <span className="hora">{project.ceremony.time}</span>
              <div className="boton">Ir al Mapa</div>
            </div>
          </a>
        </>
      )}

      {/* Reception */}
      {project.reception && (
        <>
          {project.reception.photoUrl && (
            <img className="foto-full show-p-y" src={project.reception.photoUrl} style={{ marginTop: "5%", borderRadius: "2vw" }} alt="" />
          )}
          <a className="ubicacion show-p-y" href={project.reception.mapsUrl ?? project.reception.mapLink ?? "#"} target="_self">
            <div>
              <p className="lugar-titulo">Recepción</p>
              <p className="lugar">{project.reception.venue}</p>
              <span className="direccion">{project.reception.address}</span>
              <span className="hora">{project.reception.time}</span>
              <div className="boton">Ir al Mapa</div>
            </div>
          </a>
        </>
      )}

      {photos[2] && (
        <div className="foto-con-degradado">
          <img className="foto-full show-p-y" src={photos[2]} alt="" />
        </div>
      )}

      {/* Mesa de Regalos */}
      {project.gift_registry?.liverpoolLink && (
        <a className="extra show-p-y" href={project.gift_registry.liverpoolLink} target="_self">
          <img style={{ width: "50%", marginBottom: "3%" }} src="/images/esmeralda/liverpool.png" alt="Liverpool" />
          <h3>Mesa de Regalos</h3>
          <p className="texto">Tu presencia ilumina nuestro evento. Si deseas regalarme algo, te comparto las siguientes opciones:</p>
          <div className="boton" style={{ marginTop: "1%" }}>Ver Lista de Deseos</div>
        </a>
      )}

      {/* Lluvia de Sobres */}
      {project.show_lluvia_sobres && (
        <div className="extra show-p-y">
          <img src="/images/esmeralda/sobre.png" style={{ width: "25%" }} alt="Sobre" />
          <h3>Lluvia de Sobres</h3>
          <p className="texto">{project.lluvia_sobres_text || "Es la tradición de regalar dinero en efectivo dentro de un sobre."}</p>
        </div>
      )}

      {/* Datos Bancarios */}
      {project.show_datos_bancarios && project.gift_registry?.bankAccount && (
        <div className="extra show-p-y" style={{ width: "100%" }}>
          <img src="/images/esmeralda/mesa_regalos.png" style={{ width: "20%", marginBottom: "3%" }} alt="Transferencia" />
          <h3>Datos Bancarios</h3>
          <p className="texto">{project.datos_bancarios_text || "Si lo prefieres puedes hacer una transferencia bancaria como regalo:"}</p>
          <div className="texto" style={{ marginTop: "2%" }}>
            {project.gift_registry.bankBeneficiary && <p><b>Beneficiaria:</b> {project.gift_registry.bankBeneficiary}</p>}
            <p><b>CLABE:</b> {project.gift_registry.bankAccount}</p>
          </div>
          <button onClick={handleCopy} className="boton" style={{ marginTop: "2%", cursor: "pointer" }}>
            {copied ? "¡Copiado!" : "Copiar CLABE"}
          </button>
        </div>
      )}

      {/* Dress Code */}
      {project.dress_code && (
        <div className="extra show-p-y">
          <img src="/images/esmeralda/vestimenta.png" style={{ width: "30%", marginBottom: "3%" }} alt="Vestimenta" />
          <h3>Código de Vestimenta</h3>
          <p className="texto">{project.dress_code.colors || "Vestimenta Formal"}</p>
          {project.dress_code.notes && <p className="texto">{project.dress_code.notes}</p>}
        </div>
      )}

      {/* Gallery */}
      {photos.length > 0 && (
        <>
          {photos[3] && (
            <div className="foto-con-degradado">
              <img className="foto-full show-p-y" src={photos[3]} alt="" />
            </div>
          )}
          <div className="encabezado">
            <h3 className="evento" style={{ textAlign: "center", marginTop: "5%", marginBottom: "-5%" }}>Álbum de fotos</h3>
          </div>
          <div id="grid">
            <div className="container-grid">
              {galleryPairs.map(([a, b], i) => (
                <div key={i} className="dos-fotos">
                  <img className="object-grid show-p-y" src={a} alt="" />
                  <img className="object-grid show-p-y" src={b} alt="" />
                </div>
              ))}
              {lastPhoto && (
                <div className="column full-width show-p-y">
                  <img className="object-grid" src={lastPhoto} alt="" />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {photos[4] && (
        <div className="foto-con-degradado">
          <img className="foto-full show-p-y" src={photos[4]} alt="" />
        </div>
      )}

      {/* Itinerario */}
      {project.show_itinerary && (
        <div className="itinerario show-p-y">
          <h3>Programa del Evento</h3>
          <div style={{ width: "100%" }}>
            {events.map((ev, i) => {
              const side = i % 2 === 0 ? "izquierda" : "derecha";
              const iconSrc = ev.icon?.startsWith("http") || ev.icon?.startsWith("/") ? ev.icon : `/images/esmeralda/${ev.icon || "iglesia.png"}`;
              return (
                <div key={i} className={`evento ${side}`} style={i === 0 ? { marginTop: "4vw" } : undefined}>
                  {side === "izquierda" ? (
                    <>
                      <div className="icono show-n-x"><div className="circulo"><img src={iconSrc} alt={ev.description} /></div></div>
                      <div className="item show-p-x"><h4 className="nombre">{ev.description}</h4><p className="hora">{ev.time}</p></div>
                    </>
                  ) : (
                    <>
                      <div className="item show-n-x"><h4 className="nombre">{ev.description}</h4><p className="hora">{ev.time}</p></div>
                      <div className="icono show-p-x"><div className="circulo"><img src={iconSrc} alt={ev.description} /></div></div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {photos[5] && (
        <div className="foto-con-degradado">
          <img className="foto-full show-p-y" src={photos[5]} alt="" />
        </div>
      )}

      {/* Buzón de Deseos */}
      <div id="whatsappLink" className="extra show-p-y">
        <img src="/images/esmeralda/buzon.png" style={{ width: "25%", marginBottom: "3%" }} alt="Buzón" />
        <h3>Buzón de Deseos</h3>
        <p className="texto" style={{ width: "90%" }}>Déjame un lindo mensaje por mis XV años, recibo tus palabras con cariño en este buzón:</p>
        <textarea className="mensaje" ref={messageRef} placeholder="Escribe tu mensaje aquí" />
        <div className="boton" style={{ width: "30%" }} onClick={() => sendWA(messageRef.current?.value ?? "")}>Enviar Mensaje</div>
      </div>

      {/* Hashtag */}
      {project.hashtag && (
        <a className="extra show-p-y" href={`https://www.instagram.com/explore/tags/${project.hashtag.replace("#", "")}/`} target="_self">
          <img src="/images/esmeralda/instagram.png" style={{ width: "50%", marginBottom: "4%" }} alt="Instagram" />
          <h3>Hashtag en Instagram</h3>
          <p className="texto">Comparte tus mejores momentos con el Hashtag <br />{project.hashtag}</p>
          <div className="boton" style={{ width: "30%" }}>Ver Fotos</div>
        </a>
      )}

      {/* Important info (dress code notes) */}
      {project.dress_code?.notes && (
        <div className="extra show-p-y">
          <h3>Información Importante</h3>
          <p className="importante">❖ {project.dress_code.notes}</p>
        </div>
      )}

      {/* RSVP */}
      <section className="confirmacion-asistencia show-p-y">
        <img src="/images/esmeralda/buzon.png" style={{ width: "18%" }} alt="WhatsApp" />
        <h3>Confirma tu asistencia</h3>
        {project.confirmation_phrase && (
          <p className="texto" style={{ marginBottom: "4%" }}>{project.confirmation_phrase}</p>
        )}
        <form onSubmit={handleRSVP}>
          <label htmlFor="familia" className="texto">Nombre y Apellido:</label>
          <input type="text" id="familia" name="familia" maxLength={40} className="familia-input" placeholder="Escribe Tu Nombre" ref={nameRef} required />
          <label className="texto" style={{ marginTop: "2%" }}>Confirmo que:</label>
          <div>
            <input type="radio" id="asistire" name="confirmacion" value="asistire" className="texto" checked={attending} onChange={() => setAttending(true)} />
            <label htmlFor="asistire" className="texto"> Asistiré</label>
          </div>
          <div>
            <input type="radio" id="noAsistire" name="confirmacion" value="noAsistire" className="texto" checked={!attending} onChange={() => setAttending(false)} />
            <label htmlFor="noAsistire" className="texto"> No Asistiré</label>
          </div>
          <input type="submit" className="boton" value="Enviar" style={{ marginTop: "2%", cursor: "pointer" }} />
        </form>
      </section>

      {photos[photos.length - 1] && photos.length > 5 && (
        <div className="foto-con-degradado">
          <img className="foto-full show-p-y" src={photos[photos.length - 1]} alt="" />
        </div>
      )}

      <div className="extra">
        <img src="/images/esmeralda/v2.png" style={{ width: "40%", marginBottom: "-8%" }} alt="" />
      </div>
      <div className="despedida">¡Te Esperamos!</div>
    </div>
  );
}
