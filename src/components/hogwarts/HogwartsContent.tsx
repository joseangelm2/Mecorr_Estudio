"use client";

import { useState, useRef, useEffect } from "react";

const TARGET_DATE = new Date("2026-11-22T17:00:00");

function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function update() {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
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

function sendWhatsApp(lada: string, number: string, message: string) {
  window.open(
    `https://api.whatsapp.com/send?phone=${lada}${number}&text=${encodeURIComponent(message)}`,
    "_self"
  );
}

export default function HogwartsContent() {
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [attending, setAttending] = useState(true);
  const countdown = useCountdown(TARGET_DATE);

  function handleRSVP(e: React.FormEvent) {
    e.preventDefault();
    const name = nameRef.current?.value ?? "";
    const msg = attending
      ? `Hola, soy ${name} y confirmo mi asistencia.`
      : `Hola, soy ${name} y lamentablemente, no podré asistir.`;
    sendWhatsApp("521", "4438569931", msg);
  }

  return (
    <div className="contenido">
      <div className="encabezado">
        <h2 className="nombre-principal" style={{ fontSize: "13vw" }}>Mis XV</h2>
      </div>

      <div className="frase">
        Hoy comienza un camino que conduce a un mundo nuevo de ilusión, esperanza y unos bellos sueños.
      </div>

      <div className="foto-con-degradado">
        <img className="foto-full" src="/images/esmeralda/foto.jpg" alt="Foto" />
      </div>

      <div className="encabezado">
        <h2 className="nombre-principal">Alison</h2>
        <h1 className="evento">Galván Méndez</h1>
      </div>

      <div className="frase show">
        &ldquo;Porque este día es muy importante para mí, quiero compartirlo con las personas que llevo en mi corazón. Tú eres una de ellas. Quisiera que estés presente en uno de los días más inolvidables de mi vida.&rdquo;
      </div>

      <div className="foto-con-degradado">
        <img className="foto-full show-p-y" src="/images/esmeralda/11.jpg" alt="" />
      </div>

      <div className="frase show-p-y" style={{ fontSize: "5.5vw", marginBottom: "-3%" }}>
        Con la bendición de Dios y de
      </div>

      <div className="familia show-p-y">
        <h3 style={{ fontStyle: "italic" }}>Mis Padres</h3>
        <p className="nombre">Elías Moises Galván Juárez</p>
        <p className="nombre">&amp;</p>
        <p className="nombre">Esperanza Méndez Hernández</p>
      </div>

      <div className="frase show-p-y" style={{ fontSize: "5.5vw" }}>
        Y la compañía de
      </div>

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
        <p className="segmento"><span className="numero">{countdown.days}</span><span className="unidad">Días</span></p>
        <p className="segmento"><span className="numero">{countdown.hours}</span><span className="unidad">Horas</span></p>
        <p className="segmento"><span className="numero">{countdown.minutes}</span><span className="unidad">Minutos</span></p>
        <p className="segmento"><span className="numero">{countdown.seconds}</span><span className="unidad">Segundos</span></p>
      </div>

      <div className="frase show" style={{ fontStyle: "italic" }}>
        Los momentos que disfrutas con tus seres queridos se transforman en recuerdos imborrables que perduran eternamente...
      </div>

      <img
        className="foto-full show-p-y"
        src="/images/esmeralda/iglesia.jpg"
        style={{ marginTop: "5%", marginBottom: "0%", borderRadius: "2vw" }}
        alt=""
      />

      <a className="ubicacion show-p-y" href="https://maps.app.goo.gl/EKZpeKCqNpt8PqBo6" target="_self">
        <div>
          <p className="lugar-titulo">Ceremonia Religiosa</p>
          <p className="lugar">Parroquia San Peregrino</p>
          <span className="direccion">Blvd. Solidaridad, Fuentes del Mezquital, 83250 Hermosillo, Son.</span>
          <span className="hora">5:00 PM</span>
          <div className="boton">Ir al Mapa</div>
        </div>
      </a>

      <img
        className="foto-full show-p-y"
        src="/images/esmeralda/evento.jpg"
        style={{ marginTop: "5%", marginBottom: "0%", borderRadius: "2vw" }}
        alt=""
      />

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

      <div className="extra show-p-y" style={{ width: "100%" }}>
        <img src="/images/esmeralda/mesa_regalos.png" style={{ width: "20%", marginBottom: "3%" }} alt="Transferencia" />
        <h3>Datos Bancarios</h3>
        <p className="texto">No es necesario estar cerca, para hacer sentir el amor y el cariño... Así que si lo prefieres puedes hacer una transferencia bancaria:</p>
        <div className="texto" style={{ marginTop: "2%" }}>
          <p><b>Cuenta:</b> 4027 6657 1234 4321</p>
          <p><b>Beneficiaria:</b> Alejandra Hernández Ramírez</p>
        </div>
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
          <div className="evento izquierda" style={{ marginTop: "4vw" }}>
            <div className="icono show-n-x"><div className="circulo"><img src="/images/esmeralda/iglesia.png" alt="Misa" /></div></div>
            <div className="item show-p-x"><h4 className="nombre">Misa</h4><p className="hora">05:00 PM</p></div>
          </div>
          <div className="evento derecha">
            <div className="item show-n-x"><h4 className="nombre">Recepción</h4><p className="hora">07:00 PM</p></div>
            <div className="icono show-p-x"><div className="circulo"><img src="/images/esmeralda/recepcion.png" alt="Recepción" /></div></div>
          </div>
          <div className="evento izquierda">
            <div className="icono show-n-x"><div className="circulo"><img src="/images/esmeralda/coctel.png" alt="Coctelería" /></div></div>
            <div className="item show-p-x"><h4 className="nombre">Coctelería</h4><p className="hora">08:00 PM</p></div>
          </div>
          <div className="evento derecha">
            <div className="item show-n-x"><h4 className="nombre">Cena</h4><p className="hora">09:00 PM</p></div>
            <div className="icono show-p-x"><div className="circulo"><img src="/images/esmeralda/comida.png" alt="Cena" /></div></div>
          </div>
          <div className="evento izquierda">
            <div className="icono show-n-x"><div className="circulo"><img src="/images/esmeralda/vals.png" alt="Vals" /></div></div>
            <div className="item show-p-x"><h4 className="nombre">Vals</h4><p className="hora">10:20 PM</p></div>
          </div>
          <div className="evento derecha">
            <div className="item show-n-x"><h4 className="nombre">Baile</h4><p className="hora">11:30 PM</p></div>
            <div className="icono show-p-x"><div className="circulo"><img src="/images/esmeralda/baile.png" alt="Baile" /></div></div>
          </div>
          <div className="evento izquierda">
            <div className="icono show-n-x"><div className="circulo"><img src="/images/esmeralda/fin.png" alt="Fin" /></div></div>
            <div className="item show-p-x"><h4 className="nombre">Fin del Evento</h4><p className="hora">03:00 AM</p></div>
          </div>
        </div>
      </div>

      <div className="foto-con-degradado">
        <img className="foto-full show-p-y" src="/images/esmeralda/22.jpg" alt="" />
      </div>

      <div id="whatsappLink" className="extra show-p-y">
        <img src="/images/esmeralda/buzon.png" style={{ width: "25%", marginBottom: "3%" }} alt="Buzón" />
        <h3>Buzón de Deseos</h3>
        <p className="texto" style={{ width: "90%" }}>Déjame un lindo mensaje por mis XV años, recibo tus palabras con cariño en este buzón:</p>
        <textarea className="mensaje" ref={messageRef} placeholder="Escribe tu mensaje aquí" />
        <div
          className="boton"
          style={{ width: "30%" }}
          onClick={() => sendWhatsApp("521", "4438569931", messageRef.current?.value ?? "")}
        >
          Enviar Mensaje
        </div>
      </div>

      <a className="extra show-p-y" href="https://www.instagram.com/explore/tags/xvAlison/" target="_self">
        <img src="/images/esmeralda/instagram.png" style={{ width: "50%", marginBottom: "4%" }} alt="Instagram" />
        <h3>Hashtag en Instagram</h3>
        <p className="texto">Comparte tus mejores momentos con el Hashtag de Instagram <br />#XVAlison</p>
        <div className="boton" style={{ width: "30%" }}>Ver Fotos</div>
      </a>

      <div className="extra show-p-y">
        <h3>Información Importante</h3>
        <p className="importante">❖ El color dorado queda reservado exclusivamente para la Quinceañera.</p>
      </div>

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

      <div className="foto-con-degradado">
        <img className="foto-full show-p-y" src="/images/esmeralda/32.jpg" alt="" />
      </div>

      <div className="extra">
        <img src="/images/esmeralda/v4.png" style={{ width: "40%", marginBottom: "-8%" }} alt="" />
      </div>

      <div className="despedida">¡Te Esperamos!</div>
    </div>
  );
}
