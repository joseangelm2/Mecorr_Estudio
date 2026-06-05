"use client";

import { useState, useRef, useEffect } from "react";

const PHONE = "5215656408416";

function LoveCountdown() {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date("November 22, 2026 17:00:00").getTime();
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
  }, []);

  return (
    <section id="countdown">
      <div className="container">
        <div className="countdown-container">
          {[
            { v: t.days, l: " Días" },
            { v: t.hours, l: " Horas" },
            { v: t.minutes, l: " Minutos" },
            { v: t.seconds, l: " Segundos" },
          ].map(({ v, l }) => (
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

const EVENTS = [
  { label: "Misa", hour: "5:00 PM", icon: "misa.png", dir: "izquierda" },
  { label: "Recepción", hour: "7:00 PM", icon: "recepcion.png", dir: "derecha" },
  { label: "Coctelería", hour: "8:00 PM", icon: "coctel.png", dir: "izquierda" },
  { label: "Cena", hour: "9:00 PM", icon: "comida.png", dir: "derecha" },
  { label: "Vals", hour: "10:20 PM", icon: "vals.png", dir: "izquierda" },
  { label: "Baile", hour: "11:30 PM", icon: "baile.png", dir: "derecha" },
  { label: "Fin del Evento", hour: "3:00 AM", icon: "fin.png", dir: "izquierda" },
];

export default function LoveContent() {
  const mensajeRef = useRef<HTMLTextAreaElement>(null);
  const nombreRef = useRef<HTMLInputElement>(null);
  const [asistira, setAsistira] = useState(true);

  function enviarMensaje() {
    const msg = mensajeRef.current?.value ?? "";
    window.open(`https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(msg)}`, "_blank");
  }

  function copiarCuenta() {
    void navigator.clipboard.writeText("4027665712348354").then(() => alert("Se copió: 4027665712348354"));
  }

  function confirmarAsistencia(e: React.FormEvent) {
    e.preventDefault();
    const nombre = nombreRef.current?.value ?? "";
    if (!confirm(asistira ? "¿Estás seguro de confirmar tu asistencia?" : "¿Estás seguro de no asistir?")) return;
    const msg = asistira
      ? `Hola, soy ${nombre} y confirmo mi asistencia.`
      : `Hola, soy ${nombre} y lamentablemente, no podré asistir.`;
    window.open(`https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <main>
      {/* Hero */}
      <section className="parallax-container parallax-1">
        <div className="hero-container">
          <div className="nombre"><h2 className="nombre-titulo">Lidia</h2></div>
          <div className="date fecha-text"><h3>22.NOV.2026</h3></div>
          <div className="time"><LoveCountdown /></div>
        </div>
      </section>

      {/* Frase + Ubicaciones */}
      <div className="contain">
        <div className="frase-container show-p-y">
          <h2 className="subtitulo">Te Invito a mis XV</h2>
          <hr className="separador" />
          <p className="texto" style={{ width: "90%", margin: "auto" }}>
            Mis XV años serán un sueño hecho realidad, y quiero que tú formes parte de este capítulo único en mi vida
          </p>
        </div>

        <div className="ubicaciones">
          <h2 className="subtitulo show-p-y">¿Dónde &amp; cuándo?</h2>
          <hr className="separador" />
          <a style={{ marginTop: "5%" }} className="lugar show-n-x" href="https://maps.app.goo.gl/NETRS4DCUrBhgXGx9" target="_blank" rel="noopener noreferrer">
            <img className="con-foto" src="/images/love/iglesia.jpg" alt="Parroquia San Peregrino" />
            <h4 className="nombre texto">Parroquia San Peregrino</h4>
            <h4 className="direccion texto">Blvd. Solidaridad, Fuentes del Mezquital, 83250 Hermosillo, Son.</h4>
            <h5 className="texto hora">5:00 PM</h5>
            <div className="button">Ir al Mapa</div>
          </a>
          <a style={{ marginTop: "5%" }} className="lugar show-p-x" href="https://maps.app.goo.gl/NEusLqQqZhirLnCAA" target="_blank" rel="noopener noreferrer">
            <img className="con-foto" src="/images/love/evento.jpg" alt="Salón Villa Toscana" />
            <h4 className="nombre texto">Salón de Evento Villa Toscana</h4>
            <h4 className="direccion texto">C. Quintero Arce 280, Puerta Grande, 83246 Hermosillo, Son.</h4>
            <h5 className="texto hora">7:00 PM</h5>
            <div className="button">Ir al Mapa</div>
          </a>
        </div>
      </div>

      <section className="parallax-container parallax-2" />

      {/* Parents */}
      <div className="contain">
        <div className="familiares">
          <section className="parents-container show-n-x">
            <h2 className="subtitulo">Mis Padres</h2>
            <hr className="separador" />
            <div className="parents">
              <p className="texto">Alfredo Carrasco Sandoval<br />&amp;<br />Ana Ortiz Torres</p>
            </div>
          </section>
          <section className="parents-container show-p-x" style={{ marginTop: "10%", marginBottom: "5%" }}>
            <h2 className="subtitulo">Padrinos</h2>
            <hr className="separador" />
            <div className="parents">
              <p className="texto">Alfredo Salgado<br />&amp;<br />Monserrath Torres</p>
            </div>
          </section>
        </div>
      </div>

      <section className="parallax-container parallax-3" />

      {/* Álbum */}
      <div className="contain album show-p-y">
        <h2 className="subtitulo">Álbum</h2>
        <hr className="separador" />
        <section id="grid">
          <div className="container-grid">
            {[["11", "12"], ["21", "22"], ["31", "32"]].map(([a, b]) => (
              <div key={a} className="column">
                <img className="object-grid show-p-y" src={`/images/esmeralda/${a}.jpg`} alt="" />
                <img className="object-grid show-p-y" src={`/images/esmeralda/${b}.jpg`} alt="" />
              </div>
            ))}
            <div className="dos-fotos">
              <img className="object-grid show-p-y" src="/images/esmeralda/43.jpg" alt="" />
              <img className="object-grid show-p-y" src="/images/esmeralda/fotito.jpg" alt="" />
            </div>
            <div className="column full-width show-p-y">
              <img className="object-grid" src="/images/esmeralda/41.jpg" alt="" />
            </div>
            <div className="column full-width show-p-y" style={{ marginTop: "-2%" }}>
              <img className="object-grid" src="/images/esmeralda/42.jpg" alt="" />
            </div>
          </div>
        </section>
      </div>

      <section className="parallax-container parallax-4" />

      {/* Itinerario */}
      <div className="itinerario show-p-y">
        <h2 className="subtitulo">Programa del Evento</h2>
        <hr className="separador" />
        <div style={{ marginTop: "4vw" }}>
          {EVENTS.map((ev) => (
            <div key={ev.label} className={`evento ${ev.dir}`}>
              <div className="icono"><div className="circulo"><img src={`/images/esmeralda/${ev.icon}`} alt={ev.label} /></div></div>
              <div className="item"><h4 className="nombre">{ev.label}</h4><p className="hora">{ev.hour}</p></div>
            </div>
          ))}
        </div>
      </div>

      <section className="parallax-container parallax-5" />

      {/* Extra sections */}
      <div className="contain">
        <div className="extra">
          <section className="dress-code show-p-y" style={{ marginTop: "8%", marginBottom: "0" }}>
            <h2 className="subtitulo">Código de Vestimenta</h2>
            <hr className="separador" />
            <div className="dress-code-container">
              <img className="icon-extra" src="/images/esmeralda/vestimenta.png" alt="Vestimenta" />
              <p className="texto">Vestimenta Formal</p>
            </div>
          </section>

          <section className="gift-container show-p-y" style={{ marginTop: "8%", marginBottom: "0" }}>
            <h2 className="subtitulo">Lluvia de Sobres</h2>
            <hr className="separador" />
            <div className="gift-object-container">
              <img className="icon-extra" src="/images/esmeralda/sobre.png" alt="Sobre" />
              <p className="texto">Es la tradición de regalar dinero en efectivo dentro de un sobre</p>
            </div>
          </section>

          <section className="gift-liverpool-container show-p-y" style={{ marginTop: "8%", marginBottom: "0" }}>
            <h2 className="subtitulo">Mesa de Regalos</h2>
            <hr className="separador" />
            <div className="gift-liverpool-object-container">
              <img className="icon-extra" src="/images/esmeralda/mesa_regalos.png" alt="Mesa de regalos" />
              <p className="texto">Valoro enormemente tu compañía por encima de cualquier obsequio</p>
            </div>
            <div className="liverpool-container">
              <img src="/images/esmeralda/liverpool.png" alt="Liverpool" />
              <a className="button" href="https://mesaderegalos.liverpool.com.mx/milistaderegalos/51309081" target="_blank" rel="noopener noreferrer">Ver Lista de Deseos</a>
            </div>
          </section>

          <section className="gift-liverpool-container show-p-y" style={{ marginTop: "8%", marginBottom: "0" }}>
            <h2 className="subtitulo">Datos Bancarios</h2>
            <hr className="separador" />
            <div className="gift-liverpool-object-container">
              <p className="texto">Si lo prefieres puedes hacer una transferencia bancaria como regalo:</p>
              <strong className="texto">Cuenta:</strong>
              <p className="texto">4027 6657 1234 8354</p>
            </div>
            <div className="liverpool-container">
              <button className="button" onClick={copiarCuenta} style={{ width: "auto" }}>Copiar</button>
            </div>
            <div className="gift-liverpool-object-container">
              <p className="texto"><strong>Beneficiaria:</strong></p>
              <p className="texto">Lidia García</p>
            </div>
          </section>

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

          <section className="dress-code show-p-y" style={{ marginTop: "8%", marginBottom: "0" }}>
            <h2 className="subtitulo">Hashtag en Instagram</h2>
            <hr className="separador" />
            <div className="dress-code-container">
              <img className="icon-extra" src="/images/esmeralda/instagram.png" alt="Instagram" />
              <p className="texto">Comparte tus mejores momentos con el Hashtag en Instagram</p>
              <h2 className="subtitulo">#XVlidia</h2>
            </div>
            <div className="gift-object-container" style={{ width: "100%", marginTop: "3%" }}>
              <a className="button" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Ver Fotos</a>
            </div>
          </section>

          <section className="dress-code show-p-y" style={{ marginTop: "8%", marginBottom: "0" }}>
            <h2 className="subtitulo">Información Importante</h2>
            <hr className="separador" />
            <p className="texto">❖ No se permiten niños.</p>
            <p className="texto">❖ El color rojo queda reservado exclusivamente para la quinceañera.</p>
          </section>

          <section className="confirmacion-asistencia show-p-y" style={{ marginTop: "8%" }}>
            <h2>Favor de confirmar asistencia antes del 14 de Octubre</h2>
            <form onSubmit={confirmarAsistencia}>
              <label htmlFor="familia" className="texto">Nombre y Apellido:</label>
              <input ref={nombreRef} type="text" id="familia" name="familia" maxLength={40} className="familia-input" required />
              <label className="texto" style={{ marginTop: "2%" }}>Confirmo que:</label>
              <div className="radio-group">
                <input type="radio" id="asistire" name="confirmacion" value="asistire" checked={asistira} onChange={() => setAsistira(true)} />
                <label htmlFor="asistire" className="texto">Asistiré</label>
              </div>
              <div className="radio-group">
                <input type="radio" id="noAsistire" name="confirmacion" value="noAsistire" checked={!asistira} onChange={() => setAsistira(false)} />
                <label htmlFor="noAsistire" className="texto">No Asistiré</label>
              </div>
              <input type="submit" className="button" value="Confirmar Asistencia" style={{ marginTop: "4%", cursor: "pointer" }} />
            </form>
          </section>
        </div>
      </div>

      <a className="footer" href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
        <span>Creaciones Manitas</span>
      </a>
    </main>
  );
}
