"use client";

import { useState, useEffect } from "react";
import RosaGoldCarousel from "./RosaGoldCarousel";
import RosaGoldRSVP from "./RosaGoldRSVP";

const ITINERARIO = [
  { icon: "misa.png", label: "Ceremonia Religiosa", hour: "5:00 PM" },
  { icon: "recepcion.png", label: "Recepción Bienvenida", hour: "7:00 PM" },
  { icon: "coctel.png", label: "Coctelería", hour: "8:00 PM" },
  { icon: "comida.png", label: "Cena", hour: "9:00 PM" },
  { icon: "vals.png", label: "Vals", hour: "10:20 PM" },
  { icon: "baile.png", label: "Baile", hour: "11:30 PM" },
  { icon: "fin.png", label: "Fin del Evento", hour: "3:00 AM" },
];

function RosaGoldCountdown() {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date("November 22, 2026 15:00:00").getTime();
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
  }, []);

  return (
    <div className="rg-countdown-container">
      {[{ v: t.days, l: "Días" }, { v: t.hours, l: "Horas" }, { v: t.minutes, l: "Minutos" }, { v: t.seconds, l: "Segundos" }].map(({ v, l }) => (
        <div key={l} className="rg-countdown-item anim-right anim-pause-2">
          <div className="rg-countdown-value">{v}</div>
          <div className="rg-countdown-label">{l}</div>
        </div>
      ))}
    </div>
  );
}

export default function RosaGoldContent() {
  return (
    <div id="rg-main">
      {/* HERO */}
      <section className="rg-hero">
        <div className="rg-hero-content anim-fade-in">
          <div className="rg-name-container">
            <div className="rg-names">Aime Ferreira</div>
            <div className="rg-xv">15 AÑOS</div>
          </div>
        </div>
      </section>

      {/* MENSAJE */}
      <section className="rg-mensaje">
        <div className="rg-mensaje-recuadro">
          <div className="rg-announcement anim-up">¡Festeja con nosotros!</div>
          <hr style={{ width: "230px", margin: "8px auto", border: "none", borderTop: "1px solid #ce9e5f" }} />
          <div className="esp-peq" />
          <p className="rg-text anim-up anim-pause-1">
            Junto con mis padres, quiero compartir una noche llena de sueños, alegría y gratitud.<br /><br />
          </p>
          <div className="rg-text-container anim-up anim-pause-15">
            <div className="rg-line"><strong>TE INVITAMOS A CELEBRAR</strong><br /><br /><br /></div>
            <div className="rg-overlay">Mis 15 Años</div>
          </div>
          <br /><br />
          <p className="rg-text anim-up anim-pause-2">
            Te invito a mis quince primaveras, porque formas parte esencial de mi vida y nada me haría más feliz que compartir contigo este día. Con amor, te invito a celebrar mis quince años<br /><br />
          </p>
          <div className="rg-announcement-color anim-up anim-pause-25">Tu presencia hará de este día un recuerdo inolvidable.</div>
          <div className="esp-med" />
          <div className="anim-up anim-pause-3">
            <div className="rg-announcement" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>Mis Padres:</div>
            <div className="rg-text"><strong>Felipe Ferreira<br />Paola Mendoza</strong></div>
            <div className="esp-med" />
            <div className="rg-announcement" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>Mis Padrinos:</div>
            <div className="rg-text"><strong>Sergio García<br />Graciela Santos</strong></div>
          </div>
        </div>
      </section>

      {/* APARTA LA FECHA */}
      <section className="rg-aparta-fecha">
        <div className="rg-contenido-aparta">
          <div className="rg-announcement-white anim-up">Aparta la fecha</div>
          <div className="rg-datenew">
            <div className="rg-date-column"><div className="number anim-right anim-pause-1">22</div></div>
            <div className="rg-date-column">
              <div className="month anim-left anim-pause-1">NOV</div>
              <div className="year anim-left anim-pause-1">2026</div>
            </div>
          </div>
          <div className="esp-med" />
          <div className="rg-announcement-white anim-up anim-pause-2">¡Estoy emocionada!<br />faltan solo:</div>
          <RosaGoldCountdown />
        </div>
      </section>

      {/* VENUES */}
      <div className="esp-med" />
      <section className="rg-cuando-donde">
        <div className="rg-announcement anim-up">¿Cuándo y dónde?</div>
        <hr style={{ width: "230px", margin: "8px auto", border: "none", borderTop: "1px solid #ce9e5f" }} />
        <div className="esp-med" />

        <div className="rg-evento misa" style={{ width: "100%", maxWidth: "800px" }}>
          <div className="rg-columna rg-foto">
            <img src="/images/love/iglesia.jpg" alt="Parroquia San Peregrino" className="anim-right anim-pause-1" />
          </div>
          <div className="rg-columna rg-detalles anim-left anim-pause-1">
            <div className="rg-greeting">INICIAMOS CON LA</div>
            <div className="rg-announcement">Ceremonia Religiosa</div>
            <div className="esp-peq" />
            <div className="rg-text-details"><strong>Parroquia San Peregrino</strong><br />Blvd. Solidaridad, Hermosillo, Son.</div>
            <div className="esp-peq" />
            <div className="rg-hora"><strong> - 5:00 PM - </strong></div>
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <a href="https://maps.app.goo.gl/NETRS4DCUrBhgXGx9" target="_blank" rel="noopener noreferrer" className="rg-location-btn">VER UBICACIÓN</a>
            </div>
          </div>
        </div>

        <div className="rg-evento fiesta" style={{ width: "100%", maxWidth: "800px" }}>
          <div className="rg-columna rg-foto">
            <img src="/images/love/evento.jpg" alt="Villa Toscana" className="anim-left anim-pause-1" />
          </div>
          <div className="rg-columna rg-detalles anim-right anim-pause-1">
            <div className="rg-greeting">CONTINUAMOS CON LA</div>
            <div className="rg-announcement">Recepción</div>
            <div className="esp-peq" />
            <div className="rg-text-details"><strong>Salón de Evento Villa Toscana</strong><br />C. Quintero Arce 280, Hermosillo, Son.</div>
            <div className="esp-peq" />
            <div className="rg-hora"><strong> - 7:00 PM - </strong></div>
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <a href="https://maps.app.goo.gl/NEusLqQqZhirLnCAA" target="_blank" rel="noopener noreferrer" className="rg-location-btn">VER UBICACIÓN</a>
            </div>
          </div>
        </div>
      </section>

      {/* FRASE */}
      <section className="rg-frase1">
        <div className="rg-frase-content">
          <div className="rg-frase-sub anim-down">Cada amanecer trae consigo una promesa...</div>
          <div className="rg-frase-main anim-up anim-pause-1">Y hoy es el inicio de una hermosa historia por escribir...</div>
        </div>
      </section>

      {/* ITINERARIO */}
      <div className="rg-itinerario-container">
        <table style={{ width: "100%" }}><tbody><tr><td>
          <div className="rg-itinerario-header">
            <div className="rg-announcement-white anim-up">Itinerario</div>
          </div>
          <table className="rg-tabla-itinerario"><tbody>
            {ITINERARIO.map((ev) => (
              <tr key={ev.label}>
                <td className="rg-imagen-col anim-right">
                  <img src={`/images/esmeralda/${ev.icon}`} alt={ev.label} className="rg-icono-itinerario" />
                </td>
                <td>
                  <div className="rg-actividad anim-left">{ev.label}</div>
                  <div className="rg-horario anim-left">{ev.hour}</div>
                </td>
              </tr>
            ))}
          </tbody></table>
          <div className="esp-med" />
        </td></tr></tbody></table>
      </div>

      {/* GALERÍA */}
      <RosaGoldCarousel />

      {/* MESA DE REGALOS */}
      <div className="esp-med" />
      <section className="rg-cuando-donde">
        <div className="rg-announcement anim-up">Mesa de regalos</div>
        <hr style={{ width: "230px", margin: "8px auto", border: "none", borderTop: "1px solid #ce9e5f" }} />
        <div className="esp-med" />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", width: "100%" }}>
          <div className="rg-centrar anim-right">
            <img src="/images/esmeralda/liverpool.png" alt="Liverpool" style={{ height: "80px" }} />
            <div className="rg-text-details"><strong>Mesa de Regalos Liverpool</strong><br />Num. 51309081</div>
            <div style={{ marginTop: "12px" }}>
              <a href="https://mesaderegalos.liverpool.com.mx/milistaderegalos/51309081" target="_blank" rel="noopener noreferrer" className="rg-location-btn">LIVERPOOL</a>
            </div>
          </div>
          <div className="rg-centrar anim-left">
            <img src="/images/esmeralda/sobre.png" alt="Sobre" style={{ height: "80px" }} />
            <div className="rg-text-details"><strong>Lluvia de Sobres</strong><br />el día del evento</div>
          </div>
        </div>
      </section>

      {/* FRASE 2 */}
      <section className="rg-frase2">
        <div className="rg-frase2-content">
          <div className="rg-frase2-sub anim-down">COMPARTE CONMIGO TODAS TUS FOTOGRAFIAS DEL EVENTO</div>
          <div className="rg-frase2-white anim-down anim-pause-1">tu serás mi mejor fotograf@</div>
        </div>
      </section>

      {/* CONFIRMACIÓN */}
      <section className="rg-confirmacion">
        <div className="rg-mensaje-recuadro">
          <div className="rg-announcement anim-up">¿Asistirás?</div>
          <hr style={{ width: "230px", margin: "8px auto", border: "none", borderTop: "1px solid #ce9e5f" }} />
          <div className="esp-peq" />
          <p className="rg-text anim-up anim-pause-1">
            <strong>¡Será increíble contar con tu presencia!</strong><br />
            Por favor, confirma tu asistencia a este día tan especial para mi.<br />
            ¡Tu respuesta es muy importante!<br /><br />
          </p>
          <div className="anim-up anim-pause-15">
            <RosaGoldRSVP />
          </div>
          <div className="esp-med" />
          <div className="anim-up anim-pause-2">
            <div className="rg-announcement">Vestimenta</div>
            <img src="/images/esmeralda/vestimenta.png" alt="Vestimenta" className="rg-vestimenta-img" />
            <div className="esp-peq" />
            <div className="rg-greeting">Formal</div>
            <br />
            <div className="rg-announcement-color" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>Te Espero</div>
          </div>
        </div>
      </section>

      <div className="rg-footer">© Comparte Momentos</div>
    </div>
  );
}
