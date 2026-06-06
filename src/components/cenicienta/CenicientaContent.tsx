"use client";

import { useState, useRef, useEffect } from "react";
import type { Project } from "@/types/invitation";

const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const DEFAULT_ITINERARY = [
  { title: "Misa",            time: "05:00 PM", iconSrc: "/images/esmeralda/iglesia.png"  },
  { title: "Recepción",       time: "07:00 PM", iconSrc: "/images/esmeralda/recepcion.png" },
  { title: "Coctelería",      time: "08:00 PM", iconSrc: "/images/esmeralda/coctel.png"    },
  { title: "Cena",            time: "09:00 PM", iconSrc: "/images/esmeralda/comida.png"    },
  { title: "Vals",            time: "10:20 PM", iconSrc: "/images/esmeralda/vals.png"      },
  { title: "Baile",           time: "11:30 PM", iconSrc: "/images/esmeralda/baile.png"     },
  { title: "Fin del Evento",  time: "03:00 AM", iconSrc: "/images/esmeralda/fin.png"       },
];

function useCountdown(targetStr: string) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date(targetStr).getTime();
    function update() {
      const diff = target - Date.now();
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
  }, [targetStr]);
  return time;
}

function sendWhatsApp(phone: string, message: string) {
  window.open(
    `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`,
    "_self"
  );
}

interface Props {
  project: Project;
}

export default function CenicientaContent({ project }: Props) {
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [attending, setAttending] = useState(true);

  const countdown = useCountdown(project.event_date);

  const eventDate = new Date(project.event_date);
  const day = eventDate.getDate();
  const month = MONTHS_ES[eventDate.getMonth()];
  const year = eventDate.getFullYear();

  const phone = project.rsvp_phone ?? "";
  const hashtag = project.hashtag ?? "MisXV";
  const heroPhoto = project.hero_photo_url ?? "/images/esmeralda/foto.jpg";
  const photos = project.photos ?? [];

  // Gallery photos with fallbacks — indices map to demo images
  const FALLBACKS = [11, 21, 31, 41, 12, 22, 32];
  const p = (i: number) => photos[i] ?? `/images/esmeralda/${FALLBACKS[i % FALLBACKS.length]}.jpg`;

  const invitationText = project.invitation_text ??
    "Porque este día es muy importante para mí, quiero compartirlo con las personas que llevo en mi corazón. Tú eres una de ellas. Quisiera que estés presente en uno de los días más inolvidables de mi vida.";

  const itinerary = project.itinerary?.length ? project.itinerary : DEFAULT_ITINERARY;

  function handleRSVP(e: React.FormEvent) {
    e.preventDefault();
    const name = nameRef.current?.value ?? "";
    const msg = attending
      ? `Hola, soy ${name} y confirmo mi asistencia.`
      : `Hola, soy ${name} y lamentablemente, no podré asistir.`;
    sendWhatsApp(phone, msg);
  }

  // Split name: first word = first name display, rest = last names
  const nameParts = project.quinceanera_name.trim().split(" ");
  const firstName = nameParts[0];
  const lastNames = nameParts.slice(1).join(" ");

  return (
    <div className="contenido">
      <div className="encabezado">
        <h2 className="nombre-principal" style={{ fontSize: "13vw" }}>Mis XV</h2>
      </div>

      <div className="frase">
        Hoy comienza un camino que conduce a un mundo nuevo de ilusión, esperanza y unos bellos sueños.
      </div>

      <div className="foto-con-degradado">
        <img className="foto-full" src={heroPhoto} alt={project.quinceanera_name} />
      </div>

      <div className="encabezado">
        <h2 className="nombre-principal">{firstName}</h2>
        {lastNames && <h1 className="evento">{lastNames}</h1>}
      </div>

      <div className="frase show">
        &ldquo;{invitationText}&rdquo;
      </div>

      <div className="foto-con-degradado">
        <img className="foto-full show-p-y" src={p(0)} alt="" />
      </div>

      {project.parent_names?.length > 0 && (
        <>
          <div className="frase show-p-y" style={{ fontSize: "5.5vw", marginBottom: "-3%" }}>
            Con la bendición de Dios y de
          </div>
          <div className="familia show-p-y">
            <h3 style={{ fontStyle: "italic" }}>Mis Padres</h3>
            {project.parent_names.flatMap((name, i) => [
              i > 0 ? <p key={`sp${i}`} className="nombre">&amp;</p> : null,
              <p key={i} className="nombre">{name}</p>,
            ])}
          </div>
        </>
      )}

      {project.padrinos?.length > 0 && (
        <>
          <div className="frase show-p-y" style={{ fontSize: "5.5vw" }}>
            Y la compañía de
          </div>
          <div className="familia show-p-y">
            <h3 style={{ fontStyle: "italic" }}>Mis Padrinos</h3>
            {project.padrinos.flatMap((name, i) => [
              i > 0 ? <p key={`sp${i}`} className="nombre">&amp;</p> : null,
              <p key={i} className="nombre">{name}</p>,
            ])}
          </div>
        </>
      )}

      <div className="foto-con-degradado">
        <img className="foto-full show-p-y" src={p(1)} alt="" />
      </div>

      <div className="frase show" style={{ fontSize: "5.5vw" }}>Celebremos juntos</div>

      <div className="encabezado show" style={{ marginBottom: "-5%" }}>
        <h3 className="evento">El día</h3>
      </div>

      <div className="fecha">
        <p className="dia">{day}</p>
        <div className="barra" />
        <p className="mes">{month}</p>
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

      {project.ceremony && (
        <>
          <img
            className="foto-full show-p-y"
            src="/images/esmeralda/iglesia.jpg"
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

      {project.reception && (
        <>
          <img
            className="foto-full show-p-y"
            src="/images/esmeralda/evento.jpg"
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

      <div className="foto-con-degradado">
        <img className="foto-full show-p-y" src={p(2)} alt="" />
      </div>

      {project.gift_registry?.liverpoolLink && (
        <a className="extra show-p-y" href={project.gift_registry.liverpoolLink} target="_self">
          <img style={{ width: "50%", marginBottom: "3%" }} src="/images/esmeralda/liverpool.png" alt="Liverpool" />
          <h3>Mesa de Regalos</h3>
          <p className="texto">Tu presencia ilumina nuestro evento. Si deseas regalarme algo, te comparto las siguientes opciones:</p>
          <div className="boton" style={{ marginTop: "1%" }}>Ver Lista de Deseos</div>
        </a>
      )}

      <div className="extra show-p-y">
        <img src="/images/esmeralda/sobre.png" style={{ width: "25%" }} alt="Sobre" />
        <h3>Lluvia de Sobres</h3>
        <p className="texto">Es la tradición de regalar dinero en efectivo dentro de un sobre.</p>
      </div>

      {project.gift_registry?.bankAccount && (
        <div className="extra show-p-y" style={{ width: "100%" }}>
          <img src="/images/esmeralda/mesa_regalos.png" style={{ width: "20%", marginBottom: "3%" }} alt="Transferencia" />
          <h3>Datos Bancarios</h3>
          <p className="texto">No es necesario estar cerca, para hacer sentir el amor y el cariño... Así que si lo prefieres puedes hacer una transferencia bancaria:</p>
          <div className="texto" style={{ marginTop: "2%" }}>
            <p><b>Cuenta:</b> {project.gift_registry.bankAccount}</p>
            {project.gift_registry.bankBeneficiary && (
              <p><b>Beneficiaria:</b> {project.gift_registry.bankBeneficiary}</p>
            )}
          </div>
        </div>
      )}

      {project.dress_code && (
        <div className="extra show-p-y">
          <img src="/images/esmeralda/vestimenta.png" style={{ width: "30%", marginBottom: "3%" }} alt="Vestimenta" />
          <h3>Código de Vestimenta</h3>
          <p className="texto">{project.dress_code.colors}</p>
          {project.dress_code.notes && <p className="texto">{project.dress_code.notes}</p>}
        </div>
      )}

      <div className="foto-con-degradado">
        <img className="foto-full show-p-y" src={p(3)} alt="" />
      </div>

      <div className="encabezado">
        <h3 className="evento" style={{ textAlign: "center", marginTop: "5%", marginBottom: "-5%" }}>Álbum de fotos</h3>
      </div>
      <div id="grid">
        <div className="container-grid">
          <div className="dos-fotos">
            <img className="object-grid show-p-y" src={p(1)} alt="" />
            <img className="object-grid show-p-y" src={p(2)} alt="" />
          </div>
          <div className="column full-width show-p-y">
            <img className="object-grid" src={p(3)} alt="" />
          </div>
        </div>
      </div>

      <div className="foto-con-degradado">
        <img className="foto-full show-p-y" src={p(4)} alt="" />
      </div>

      <div className="itinerario show-p-y">
        <h3>Programa del Evento</h3>
        <div style={{ width: "100%" }}>
          {itinerary.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div key={i} className={`evento ${isLeft ? "izquierda" : "derecha"}`} style={i === 0 ? { marginTop: "4vw" } : undefined}>
                {isLeft ? (
                  <>
                    <div className="icono show-n-x"><div className="circulo"><img src={item.iconSrc} alt={item.title} /></div></div>
                    <div className="item show-p-x"><h4 className="nombre">{item.title}</h4><p className="hora">{item.time}</p></div>
                  </>
                ) : (
                  <>
                    <div className="item show-n-x"><h4 className="nombre">{item.title}</h4><p className="hora">{item.time}</p></div>
                    <div className="icono show-p-x"><div className="circulo"><img src={item.iconSrc} alt={item.title} /></div></div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="foto-con-degradado">
        <img className="foto-full show-p-y" src={p(5)} alt="" />
      </div>

      {phone && (
        <div id="whatsappLink" className="extra show-p-y">
          <img src="/images/esmeralda/buzon.png" style={{ width: "25%", marginBottom: "3%" }} alt="Buzón" />
          <h3>Buzón de Deseos</h3>
          <p className="texto" style={{ width: "90%" }}>Déjame un lindo mensaje por mis XV años, recibo tus palabras con cariño en este buzón:</p>
          <textarea className="mensaje" ref={messageRef} placeholder="Escribe tu mensaje aquí" />
          <div
            className="boton"
            style={{ width: "30%" }}
            onClick={() => sendWhatsApp(phone, messageRef.current?.value ?? "")}
          >
            Enviar Mensaje
          </div>
        </div>
      )}

      {hashtag && (
        <a className="extra show-p-y" href={`https://www.instagram.com/explore/tags/${hashtag}/`} target="_self">
          <img src="/images/esmeralda/instagram.png" style={{ width: "50%", marginBottom: "4%" }} alt="Instagram" />
          <h3>Hashtag en Instagram</h3>
          <p className="texto">Comparte tus mejores momentos con el Hashtag de Instagram <br />#{hashtag}</p>
          <div className="boton" style={{ width: "30%" }}>Ver Fotos</div>
        </a>
      )}

      <div className="extra show-p-y">
        <h3>Información Importante</h3>
        <p className="importante">❖ El color dorado queda reservado exclusivamente para la Quinceañera.</p>
      </div>

      {phone && (
        <section className="confirmacion-asistencia show-p-y">
          <img src="/images/esmeralda/buzon.png" style={{ width: "18%" }} alt="WhatsApp" />
          <h3>Confirma tu asistencia</h3>
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

      <div className="foto-con-degradado">
        <img className="foto-full show-p-y" src={p(6)} alt="" />
      </div>

      <div className="extra">
        <img src="/images/esmeralda/v3.png" style={{ width: "40%", marginBottom: "-8%" }} alt="" />
      </div>

      <div className="despedida">¡Te Esperamos!</div>
    </div>
  );
}
