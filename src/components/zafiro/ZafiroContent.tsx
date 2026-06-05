"use client";

import { useState, useRef, useEffect } from "react";

const TARGET_DATE = new Date("2026-11-22T17:00:00");
const PHONE = "5214438569931";

function sendWA(msg: string) {
  window.open(`https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(msg)}`, "_self");
}

const EVENTS = [
  { name: "Misa", time: "05:00 PM", icon: "/images/esmeralda/iglesia.png", side: "izquierda" },
  { name: "Recepción", time: "07:00 PM", icon: "/images/esmeralda/recepcion.png", side: "derecha" },
  { name: "Coctelería", time: "08:00 PM", icon: "/images/esmeralda/coctel.png", side: "izquierda" },
  { name: "Cena", time: "09:00 PM", icon: "/images/esmeralda/comida.png", side: "derecha" },
  { name: "Vals", time: "10:20 PM", icon: "/images/esmeralda/vals.png", side: "izquierda" },
  { name: "Baile", time: "11:30 PM", icon: "/images/esmeralda/baile.png", side: "derecha" },
  { name: "Fin del Evento", time: "03:00 AM", icon: "/images/esmeralda/fin.png", side: "izquierda" },
] as const;

export default function ZafiroContent() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [attending, setAttending] = useState(true);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      const diff = TARGET_DATE.getTime() - Date.now();
      if (diff <= 0) return;
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  function handleRSVP(e: React.FormEvent) {
    e.preventDefault();
    const name = nameRef.current?.value ?? "";
    const msg = attending
      ? `Hola, soy ${name} y confirmo mi asistencia.`
      : `Hola, soy ${name} y lamentablemente, no podré asistir.`;
    sendWA(msg);
  }

  return (
    <div className="contenido">
      <div className="encabezado">
        <h2 className="nombre-principal" style={{ fontSize: "13vw" }}>Mis XV</h2>
      </div>

      <div className="frase">Hoy comienza un camino que conduce a un mundo nuevo de ilusión, esperanza y unos bellos sueños.</div>

      <div className="foto-con-degradado">
        <img className="foto-full" src="/images/esmeralda/foto.jpg" alt="Foto" />
      </div>

      <div className="encabezado">
        <h2 className="nombre-principal">Alison</h2>
        <h1 className="evento">Galván Méndez</h1>
      </div>

      <div className="frase show">
        &ldquo;Porque este día es muy importante para mí, quiero compartirlo con las personas que llevo en mi corazón. Tú eres una de ellas.&rdquo;
      </div>

      <div className="foto-con-degradado">
        <img className="foto-full show-p-y" src="/images/esmeralda/11.jpg" alt="" />
      </div>

      <div className="frase show-p-y" style={{ fontSize: "5.5vw", marginBottom: "-3%" }}>Con la bendición de Dios y de</div>

      <div className="familia show-p-y">
        <h3 style={{ fontStyle: "italic" }}>Mis Padres</h3>
        <p className="nombre">Elías Moises Galván Juárez</p>
        <p className="nombre">&amp;</p>
        <p className="nombre">Esperanza Méndez Hernández</p>
      </div>

      <div className="frase show-p-y" style={{ fontSize: "5.5vw" }}>Y la compañía de</div>

      <div className="familia show-p-y">
        <h3 style={{ fontStyle: "italic" }}>Mis Padrinos</h3>
        <p className="nombre">José Feliciano Hernández</p>
        <p className="nombre">&amp;</p>
        <p className="nombre">María Carolina Escandón Cruz</p>
      </div>

      <div className="foto-con-degradado">
        <img className="foto-full show-p-y" src="/images/esmeralda/21.jpg" alt="" />
      </div>

      <div className="frase show" style={{ fontSize: "5.5vw" }}>Celebremos juntos</div>

      <div className="encabezado show" style={{ marginBottom: "-5%" }}>
        <h3 className="evento">El día</h3>
      </div>

      <div className="fecha">
        <p className="dia">22</p>
        <div className="barra" />
        <p className="mes">Noviembre</p>
        <div className="barra" />
        <p className="anio">2026</p>
      </div>

      <div className="cuenta">
        {[
          { v: countdown.days, u: "Días" },
          { v: countdown.hours, u: "Horas" },
          { v: countdown.minutes, u: "Minutos" },
          { v: countdown.seconds, u: "Segundos" },
        ].map(({ v, u }) => (
          <p key={u} className="segmento">
            <span className="numero">{v}</span>
            <span className="unidad">{u}</span>
          </p>
        ))}
      </div>

      <div className="frase show" style={{ fontStyle: "italic" }}>
        Los momentos que disfrutas con tus seres queridos se transforman en recuerdos imborrables...
      </div>

      <img className="foto-full show-p-y" src="/images/esmeralda/iglesia.jpg" style={{ marginTop: "5%", borderRadius: "2vw" }} alt="" />

      <a className="ubicacion show-p-y" href="https://maps.app.goo.gl/EKZpeKCqNpt8PqBo6" target="_self">
        <div>
          <p className="lugar-titulo">Ceremonia Religiosa</p>
          <p className="lugar">Parroquia San Peregrino</p>
          <span className="direccion">Blvd. Solidaridad, Fuentes del Mezquital, 83250 Hermosillo, Son.</span>
          <span className="hora">5:00 PM</span>
          <div className="boton">Ir al Mapa</div>
        </div>
      </a>

      <img className="foto-full show-p-y" src="/images/esmeralda/evento.jpg" style={{ marginTop: "5%", borderRadius: "2vw" }} alt="" />

      <a className="ubicacion show-p-y" href="https://maps.app.goo.gl/NEusLqQqZhirLnCAA" target="_self">
        <div>
          <p className="lugar-titulo">Recepción</p>
          <p className="lugar">Salón de Evento Villa Toscana</p>
          <span className="direccion">C. Quintero Arce 280, Puerta Grande, 83246 Hermosillo, Son.</span>
          <span className="hora">7:00 PM</span>
          <div className="boton">Ir al Mapa</div>
        </div>
      </a>

      <div className="foto-con-degradado">
        <img className="foto-full show-p-y" src="/images/esmeralda/31.jpg" alt="" />
      </div>

      <a className="extra show-p-y" href="https://mesaderegalos.liverpool.com.mx/milistaderegalos/51309081" target="_self">
        <img style={{ width: "50%", marginBottom: "3%" }} src="/images/esmeralda/liverpool.png" alt="Liverpool" />
        <h3>Mesa de Regalos</h3>
        <p className="texto">Tu presencia ilumina nuestro evento. Si deseas regalarme algo, te comparto las siguientes opciones:</p>
        <div className="boton" style={{ marginTop: "1%" }}>Ver Lista de Deseos</div>
      </a>

      <div className="extra show-p-y">
        <img src="/images/esmeralda/sobre.png" style={{ width: "25%" }} alt="Sobre" />
        <h3>Lluvia de Sobres</h3>
        <p className="texto">Es la tradición de regalar dinero en efectivo dentro de un sobre.</p>
      </div>

      <div className="extra show-p-y">
        <img src="/images/esmeralda/vestimenta.png" style={{ width: "30%", marginBottom: "3%" }} alt="Vestimenta" />
        <h3>Código de Vestimenta</h3>
        <p className="texto">Vestimenta Formal</p>
      </div>

      <div className="foto-con-degradado">
        <img className="foto-full show-p-y" src="/images/esmeralda/41.jpg" alt="" />
      </div>

      <div className="encabezado">
        <h3 className="evento" style={{ textAlign: "center", marginTop: "5%", marginBottom: "-5%" }}>Álbum de fotos</h3>
      </div>

      <div id="grid">
        <div className="container-grid">
          <div className="dos-fotos">
            <img className="object-grid show-p-y" src="/images/esmeralda/21.jpg" alt="" />
            <img className="object-grid show-p-y" src="/images/esmeralda/31.jpg" alt="" />
          </div>
          <div className="column full-width show-p-y">
            <img className="object-grid" src="/images/esmeralda/41.jpg" alt="" />
          </div>
        </div>
      </div>

      <div className="foto-con-degradado">
        <img className="foto-full show-p-y" src="/images/esmeralda/12.jpg" alt="" />
      </div>

      <div className="itinerario show-p-y">
        <h3>Programa del Evento</h3>
        <div style={{ width: "100%" }}>
          {EVENTS.map((ev) => (
            <div key={ev.name} className={`evento ${ev.side}`} style={ev.name === "Misa" ? { marginTop: "4vw" } : undefined}>
              {ev.side === "izquierda" ? (
                <>
                  <div className="icono show-n-x"><div className="circulo"><img src={ev.icon} alt={ev.name} /></div></div>
                  <div className="item show-p-x"><h4 className="nombre">{ev.name}</h4><p className="hora">{ev.time}</p></div>
                </>
              ) : (
                <>
                  <div className="item show-n-x"><h4 className="nombre">{ev.name}</h4><p className="hora">{ev.time}</p></div>
                  <div className="icono show-p-x"><div className="circulo"><img src={ev.icon} alt={ev.name} /></div></div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="foto-con-degradado">
        <img className="foto-full show-p-y" src="/images/esmeralda/22.jpg" alt="" />
      </div>

      <div id="whatsappLink" className="extra show-p-y">
        <img src="/images/esmeralda/buzon.png" style={{ width: "25%", marginBottom: "3%" }} alt="Buzón" />
        <h3>Buzón de Deseos</h3>
        <p className="texto" style={{ width: "90%" }}>Déjame un lindo mensaje por mis XV años:</p>
        <textarea className="mensaje" ref={messageRef} placeholder="Escribe tu mensaje aquí" />
        <div className="boton" style={{ width: "30%" }} onClick={() => sendWA(messageRef.current?.value ?? "")}>
          Enviar Mensaje
        </div>
      </div>

      <a className="extra show-p-y" href="https://www.instagram.com/explore/tags/xvAlison/" target="_self">
        <img src="/images/esmeralda/instagram.png" style={{ width: "50%", marginBottom: "4%" }} alt="Instagram" />
        <h3>Hashtag en Instagram</h3>
        <p className="texto">Comparte tus mejores momentos con el Hashtag <br />#XVAlison</p>
        <div className="boton" style={{ width: "30%" }}>Ver Fotos</div>
      </a>

      <div className="extra show-p-y">
        <h3>Información Importante</h3>
        <p className="importante">❖ El color morado queda reservado exclusivamente para la Quinceañera.</p>
      </div>

      <section className="confirmacion-asistencia show-p-y">
        <img src="/images/esmeralda/buzon.png" style={{ width: "18%" }} alt="WhatsApp" />
        <h3>Confirma tu asistencia</h3>
        <form onSubmit={handleRSVP}>
          <label htmlFor="familia" className="texto">Nombre y Apellido:</label>
          <input type="text" id="familia" name="familia" maxLength={20} className="familia-input" placeholder="Escribe Tu Nombre" ref={nameRef} required />
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

      <div className="foto-con-degradado">
        <img className="foto-full show-p-y" src="/images/esmeralda/32.jpg" alt="" />
      </div>

      <div className="extra">
        <img src="/images/esmeralda/v1.png" style={{ width: "40%", marginBottom: "-8%" }} alt="" />
      </div>

      <div className="despedida">¡Te Esperamos!</div>
    </div>
  );
}
