"use client";

import { useState, useRef, useEffect } from "react";
import type { Project } from "@/types/invitation";
import { useGuestContext } from '@/lib/lista/GuestContext'
import { TokenRSVPForm } from '@/components/lista/TokenRSVPForm'

interface Props {
  project: Project
}

const DEFAULT_PHOTOS = [
  "/images/esmeralda/11.jpg",
  "/images/esmeralda/21.jpg",
  "/images/esmeralda/31.jpg",
  "/images/esmeralda/41.jpg",
  "/images/esmeralda/12.jpg",
  "/images/esmeralda/22.jpg",
];

const DEFAULT_EVENTS = [
  { title: "Misa", time: "05:00 PM", icon: "/images/esmeralda/iglesia.png" },
  { title: "Recepción", time: "07:00 PM", icon: "/images/esmeralda/recepcion.png" },
  { title: "Coctelería", time: "08:00 PM", icon: "/images/esmeralda/coctel.png" },
  { title: "Cena", time: "09:00 PM", icon: "/images/esmeralda/comida.png" },
  { title: "Vals", time: "10:20 PM", icon: "/images/esmeralda/vals.png" },
  { title: "Baile", time: "11:30 PM", icon: "/images/esmeralda/baile.png" },
  { title: "Fin del Evento", time: "03:00 AM", icon: "/images/esmeralda/fin.png" },
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

function resolveIcon(icon: string | undefined): string {
  if (!icon) return "/images/esmeralda/iglesia.png";
  if (icon.startsWith("http") || icon.startsWith("/")) return icon;
  return `/images/esmeralda/${icon}`;
}

function sendWhatsApp(phone: string, message: string) {
  window.open(
    `https://api.whatsapp.com/send?phone=52${phone}&text=${encodeURIComponent(message)}`,
    "_self"
  );
}

export default function HogwartsContent({ project }: Props) {
  const guest = useGuestContext()
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [attending, setAttending] = useState(true);
  const [copied, setCopied] = useState(false);

  const eventDate = new Date(project.event_date);
  const countdown = useCountdown(eventDate);

  const photos = project.photos?.length ? project.photos : DEFAULT_PHOTOS;
  const events = project.itinerary?.length ? project.itinerary : DEFAULT_EVENTS;

  const day = eventDate.getDate().toString().padStart(2, "0");
  const month = eventDate.toLocaleString("es-MX", { month: "long" });
  const year = eventDate.getFullYear();

  const nameParts = project.quinceanera_name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  function handleRSVP(e: React.FormEvent) {
    e.preventDefault();
    const name = nameRef.current?.value ?? "";
    const msg = attending
      ? `Hola, soy ${name} y confirmo mi asistencia.`
      : `Hola, soy ${name} y lamentablemente, no podré asistir.`;
    sendWhatsApp(project.rsvp_phone ?? "", msg);
  }

  function handleCopyAccount() {
    const account = project.gift_registry?.bankAccount ?? "";
    navigator.clipboard.writeText(account).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="contenido">
      <div className="encabezado">
        <h2 className="nombre-principal" style={{ fontSize: "13vw" }}>Mis XV</h2>
      </div>

      <div className="frase">
        {project.invitation_text ?? "Hoy comienza un camino que conduce a un mundo nuevo de ilusión, esperanza y unos bellos sueños."}
      </div>

      <div className="foto-con-degradado">
        <img className="foto-full" src={project.hero_photo_url ?? "/images/esmeralda/foto.jpg"} alt="Foto" />
      </div>

      <div className="encabezado">
        <h2 className="nombre-principal">{firstName}</h2>
        {lastName && <h1 className="evento">{lastName}</h1>}
      </div>

      <div className="frase show">
        &ldquo;Porque este día es muy importante para mí, quiero compartirlo con las personas que llevo en mi corazón. Tú eres una de ellas. Quisiera que estés presente en uno de los días más inolvidables de mi vida.&rdquo;
      </div>

      {photos[0] && (
        <div className="foto-con-degradado">
          <img className="foto-full show-p-y" src={photos[0]} alt="" />
        </div>
      )}

      {/* Padres */}
      {project.parent_names?.length > 0 && (
        <>
          <div className="frase show-p-y" style={{ fontSize: "5.5vw", marginBottom: "-3%" }}>
            Con la bendición de Dios y de
          </div>
          <div className="familia show-p-y">
            <h3 style={{ fontStyle: "italic" }}>Mis Padres</h3>
            {project.parent_names.map((name, i) => (
              <p key={i} className="nombre">{i > 0 && i < project.parent_names.length ? <>&amp;</> : null}{name}</p>
            ))}
          </div>
        </>
      )}

      {/* Padrinos */}
      {project.padrinos?.length > 0 && (
        <>
          <div className="frase show-p-y" style={{ fontSize: "5.5vw" }}>Y la compañía de</div>
          <div className="familia show-p-y">
            <h3 style={{ fontStyle: "italic" }}>Mis Padrinos</h3>
            {project.padrinos.map((name, i) => (
              <p key={i} className="nombre">{i > 0 && i < project.padrinos.length ? <>&amp;</> : null}{name}</p>
            ))}
          </div>
        </>
      )}

      {photos[1] && (
        <div className="foto-con-degradado">
          <img className="foto-full show-p-y" src={photos[1]} alt="" />
        </div>
      )}

      {/* Fecha & Countdown */}
      <div className="frase show" style={{ fontStyle: "italic" }}>Celebremos juntos</div>
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
        <p className="segmento"><span className="numero">{countdown.days}</span><span className="unidad">Días</span></p>
        <p className="segmento"><span className="numero">{countdown.hours}</span><span className="unidad">Horas</span></p>
        <p className="segmento"><span className="numero">{countdown.minutes}</span><span className="unidad">Minutos</span></p>
        <p className="segmento"><span className="numero">{countdown.seconds}</span><span className="unidad">Segundos</span></p>
      </div>

      <div className="frase show" style={{ fontStyle: "italic" }}>
        Los momentos que disfrutas con tus seres queridos se transforman en recuerdos imborrables que perduran eternamente...
      </div>

      {/* Ceremonia */}
      {project.ceremony && (
        <>
          <img
            className="foto-full show-p-y"
            src={project.ceremony.photoUrl ?? "/images/esmeralda/iglesia.jpg"}
            style={{ marginTop: "5%", marginBottom: "0%", borderRadius: "2vw" }}
            alt=""
          />
          <a className="ubicacion show-p-y" href={project.ceremony.mapsUrl} target="_self">
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

      {/* Recepción */}
      {project.reception && (
        <>
          <img
            className="foto-full show-p-y"
            src={project.reception.photoUrl ?? "/images/esmeralda/evento.jpg"}
            style={{ marginTop: "5%", marginBottom: "0%", borderRadius: "2vw" }}
            alt=""
          />
          <a className="ubicacion show-p-y" href={project.reception.mapsUrl} target="_self">
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

      {/* Liverpool */}
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
          <p className="texto">{project.lluvia_sobres_text ?? "Es la tradición de regalar dinero en efectivo dentro de un sobre."}</p>
        </div>
      )}

      {/* Datos Bancarios */}
      {project.show_datos_bancarios && project.gift_registry?.bankAccount && (
        <div className="extra show-p-y" style={{ width: "100%" }}>
          <img src="/images/esmeralda/mesa_regalos.png" style={{ width: "20%", marginBottom: "3%" }} alt="Transferencia" />
          <h3>Datos Bancarios</h3>
          <p className="texto">{project.datos_bancarios_text ?? "No es necesario estar cerca, para hacer sentir el amor y el cariño... Así que si lo prefieres puedes hacer una transferencia bancaria:"}</p>
          <div className="texto" style={{ marginTop: "2%" }}>
            <p><b>Cuenta:</b> {project.gift_registry.bankAccount}</p>
            {project.gift_registry.bankBeneficiary && <p><b>Beneficiaria:</b> {project.gift_registry.bankBeneficiary}</p>}
          </div>
          <button
            onClick={handleCopyAccount}
            className="boton"
            style={{ marginTop: "3%", cursor: "pointer", background: "none", border: "none", padding: 0 }}
          >
            {copied ? "¡Copiado!" : "Copiar número de cuenta"}
          </button>
        </div>
      )}

      {/* Vestimenta */}
      {project.dress_code && (
        <div className="extra show-p-y">
          <img src="/images/esmeralda/vestimenta.png" style={{ width: "30%", marginBottom: "3%" }} alt="Vestimenta" />
          <h3>Código de Vestimenta</h3>
          <p className="texto">{project.dress_code.colors}</p>
          {project.dress_code.notes && <p className="texto">❖ {project.dress_code.notes}</p>}
        </div>
      )}

      {photos[3] && (
        <div className="foto-con-degradado">
          <img className="foto-full show-p-y" src={photos[3]} alt="" />
        </div>
      )}

      {/* Galería */}
      {photos.length > 1 && (
        <>
          <div className="encabezado">
            <h3 className="evento" style={{ textAlign: "center", marginTop: "5%", marginBottom: "-5%" }}>Álbum de fotos</h3>
          </div>
          <div id="grid">
            <div className="container-grid">
              <div className="dos-fotos">
                {photos[1] && <img className="object-grid show-p-y" src={photos[1]} alt="" />}
                {photos[2] && <img className="object-grid show-p-y" src={photos[2]} alt="" />}
              </div>
              {photos[3] && (
                <div className="column full-width show-p-y">
                  <img className="object-grid" src={photos[3]} alt="" />
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
      {project.show_itinerary && events.length > 0 && (
        <div className="itinerario show-p-y">
          <h3>Programa del Evento</h3>
          <div style={{ width: "100%" }}>
            {events.map((ev, i) => {
              const isLeft = i % 2 === 0;
              const iconSrc = resolveIcon("icon" in ev ? ev.icon : ev.iconSrc);
              return (
                <div key={i} className={`evento ${isLeft ? "izquierda" : "derecha"}`} style={i === 0 ? { marginTop: "4vw" } : {}}>
                  {isLeft ? (
                    <>
                      <div className="icono show-n-x"><div className="circulo"><img src={iconSrc} alt={ev.title} /></div></div>
                      <div className="item show-p-x"><h4 className="nombre">{ev.title}</h4><p className="hora">{ev.time}</p></div>
                    </>
                  ) : (
                    <>
                      <div className="item show-n-x"><h4 className="nombre">{ev.title}</h4><p className="hora">{ev.time}</p></div>
                      <div className="icono show-p-x"><div className="circulo"><img src={iconSrc} alt={ev.title} /></div></div>
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
        <div
          className="boton"
          style={{ width: "30%" }}
          onClick={() => sendWhatsApp(project.rsvp_phone ?? "", messageRef.current?.value ?? "")}
        >
          Enviar Mensaje
        </div>
      </div>

      {/* Hashtag */}
      {project.hashtag && (
        <a
          className="extra show-p-y"
          href={`https://www.instagram.com/explore/tags/${project.hashtag.replace("#", "")}/`}
          target="_self"
        >
          <img src="/images/esmeralda/instagram.png" style={{ width: "50%", marginBottom: "4%" }} alt="Instagram" />
          <h3>Hashtag en Instagram</h3>
          <p className="texto">Comparte tus mejores momentos con el Hashtag de Instagram <br />{project.hashtag}</p>
          <div className="boton" style={{ width: "30%" }}>Ver Fotos</div>
        </a>
      )}

      {/* Confirmación RSVP */}
      {guest.token ? (
        <TokenRSVPForm festejada={project.quinceanera_name} />
      ) : (
        <section className="confirmacion-asistencia show-p-y">
          <img src="/images/esmeralda/buzon.png" style={{ width: "18%" }} alt="WhatsApp" />
          <h3>Confirma tu asistencia</h3>
          {project.confirmation_phrase && (
            <p className="texto" style={{ marginBottom: "2%" }}>{project.confirmation_phrase}</p>
          )}
          <form onSubmit={handleRSVP}>
            <label htmlFor="familia" className="texto">Nombre y Apellido:</label>
            <input
              type="text"
              id="familia"
              name="familia"
              maxLength={20}
              className="familia-input"
              placeholder="Escribe Tu Nombre"
              ref={nameRef}
              required
            />
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
      )}

      <div className="despedida">¡Te Esperamos!</div>
      <div className="extra" style={{ paddingBottom: "6%" }}>
        <p style={{ fontSize: "3vw", opacity: 0.5 }}>© MeCorr Estudio</p>
      </div>
    </div>
  );
}
