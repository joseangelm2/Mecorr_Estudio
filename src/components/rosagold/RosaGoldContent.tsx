"use client";

import { useState, useEffect, useRef } from "react";
import type { Project } from "@/types/invitation";
import { getRsvpContacts, getRsvpEmail } from "@/lib/rsvp";
import RosaGoldCarousel from "./RosaGoldCarousel";
import RosaGoldRSVP from "./RosaGoldRSVP";

function RosaGoldCountdown({ eventDate }: { eventDate: string }) {
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

interface Props { project: Project }

export default function RosaGoldContent({ project }: Props) {
  const [copied, setCopied] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);
  const mensajeRef = useRef<HTMLTextAreaElement>(null);

  const d = new Date(project.event_date);
  const day = d.getDate();
  const monthStr = d.toLocaleDateString("es-MX", { month: "short" }).toUpperCase();
  const year = d.getFullYear();

  const events = project.itinerary.map((e) => ({ ...e, icon: e.icon || "misa.png" }));

  const phone = project.rsvp_phone ?? "";

  function handleCopy() {
    const account = (project.gift_registry?.bankAccount ?? "").replace(/\s/g, "");
    navigator.clipboard.writeText(account).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function enviarMensaje() {
    const msg = mensajeRef.current?.value ?? "";
    window.open(`https://api.whatsapp.com/send?phone=52${phone}&text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <div id="rg-main">
      {/* HERO */}
      <section className="rg-hero">
        <div className="rg-hero-content anim-fade-in">
          <div className="rg-name-container">
            <div className="rg-names">{project.quinceanera_name}</div>
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
            {project.invitation_text || "Junto con mis padres, quiero compartir una noche llena de sueños, alegría y gratitud."}
            <br /><br />
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

          {/* Parents */}
          <div className="anim-up anim-pause-3">
            {project.parent_names.filter(Boolean).length > 0 && (
              <>
                <div className="rg-announcement" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>{(project.extra_config?.parents_title as string) || "Mis Padres"}:</div>
                <div className="rg-text">
                  <strong>{project.parent_names.filter(Boolean).join("\n").split("\n").map((n, i) => <span key={i}>{n}<br /></span>)}</strong>
                </div>
                <div className="esp-med" />
              </>
            )}
            {project.padrinos.filter(Boolean).length > 0 && (
              <>
                <div className="rg-announcement" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>{(project.extra_config?.padrinos_title as string) || "Mis Padrinos"}:</div>
                <div className="rg-text">
                  <strong>{project.padrinos.filter(Boolean).join("\n").split("\n").map((n, i) => <span key={i}>{n}<br /></span>)}</strong>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* APARTA LA FECHA */}
      <section className="rg-aparta-fecha">
        <div className="rg-contenido-aparta">
          <div className="rg-announcement-white anim-up">Aparta la fecha</div>
          <div className="rg-datenew">
            <div className="rg-date-column"><div className="number anim-right anim-pause-1">{day}</div></div>
            <div className="rg-date-column">
              <div className="month anim-left anim-pause-1">{monthStr}</div>
              <div className="year anim-left anim-pause-1">{year}</div>
            </div>
          </div>
          <div className="esp-med" />
          <div className="rg-announcement-white anim-up anim-pause-2">¡Estoy emocionada!<br />faltan solo:</div>
          <RosaGoldCountdown eventDate={project.event_date} />
        </div>
      </section>

      {/* VENUES */}
      <div className="esp-med" />
      <section className="rg-cuando-donde">
        <div className="rg-announcement anim-up">¿Cuándo y dónde?</div>
        <hr style={{ width: "230px", margin: "8px auto", border: "none", borderTop: "1px solid #ce9e5f" }} />
        <div className="esp-med" />

        {project.ceremony && (
          <div className="rg-evento misa" style={{ width: "100%", maxWidth: "800px" }}>
            <div className="rg-columna rg-foto">
              {project.ceremony.photoUrl && <img src={project.ceremony.photoUrl} alt={project.ceremony.venue} className="anim-right anim-pause-1" />}
            </div>
            <div className="rg-columna rg-detalles anim-left anim-pause-1">
              <div className="rg-greeting">INICIAMOS CON LA</div>
              <div className="rg-announcement">Ceremonia Religiosa</div>
              <div className="esp-peq" />
              <div className="rg-text-details"><strong>{project.ceremony.venue}</strong><br />{project.ceremony.address}</div>
              <div className="esp-peq" />
              <div className="rg-hora"><strong> - {project.ceremony.time} - </strong></div>
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <a href={project.ceremony.mapsUrl ?? project.ceremony.mapLink ?? "#"} target="_blank" rel="noopener noreferrer" className="rg-location-btn">VER UBICACIÓN</a>
              </div>
            </div>
          </div>
        )}

        {project.reception && (
          <div className="rg-evento fiesta" style={{ width: "100%", maxWidth: "800px" }}>
            <div className="rg-columna rg-foto">
              {project.reception.photoUrl && <img src={project.reception.photoUrl} alt={project.reception.venue} className="anim-left anim-pause-1" />}
            </div>
            <div className="rg-columna rg-detalles anim-right anim-pause-1">
              <div className="rg-greeting">CONTINUAMOS CON LA</div>
              <div className="rg-announcement">Recepción</div>
              <div className="esp-peq" />
              <div className="rg-text-details"><strong>{project.reception.venue}</strong><br />{project.reception.address}</div>
              <div className="esp-peq" />
              <div className="rg-hora"><strong> - {project.reception.time} - </strong></div>
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <a href={project.reception.mapsUrl ?? project.reception.mapLink ?? "#"} target="_blank" rel="noopener noreferrer" className="rg-location-btn">VER UBICACIÓN</a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* FRASE */}
      <section className="rg-frase1">
        <div className="rg-frase-content">
          <div className="rg-frase-sub anim-down">Cada amanecer trae consigo una promesa...</div>
          <div className="rg-frase-main anim-up anim-pause-1">Y hoy es el inicio de una hermosa historia por escribir...</div>
        </div>
      </section>

      {/* ITINERARIO */}
      {project.show_itinerary && events.length > 0 && (
        <div className="rg-itinerario-container">
          <table style={{ width: "100%" }}><tbody><tr><td>
            <div className="rg-itinerario-header">
              <div className="rg-announcement-white anim-up">Itinerario</div>
            </div>
            <table className="rg-tabla-itinerario"><tbody>
              {events.map((ev, i) => {
                const iconSrc = ev.icon?.startsWith("http") || ev.icon?.startsWith("/") ? ev.icon : `/images/esmeralda/${ev.icon}`;
                return (
                  <tr key={i}>
                    <td className="rg-imagen-col anim-right">
                      <img src={iconSrc} alt={ev.description} className="rg-icono-itinerario" />
                    </td>
                    <td>
                      <div className="rg-actividad anim-left">{ev.description}</div>
                      <div className="rg-horario anim-left">{ev.time}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody></table>
            <div className="esp-med" />
          </td></tr></tbody></table>
        </div>
      )}

      {/* GALERÍA */}
      <RosaGoldCarousel photos={project.photos.length ? project.photos : undefined} />

      {/* MESA DE REGALOS */}
      <div className="esp-med" />
      <section className="rg-cuando-donde">
        <div className="rg-announcement anim-up">Mesa de regalos</div>
        <hr style={{ width: "230px", margin: "8px auto", border: "none", borderTop: "1px solid #ce9e5f" }} />
        <div className="esp-med" />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", width: "100%" }}>
          {project.gift_registry?.liverpoolLink && (
            <div className="rg-centrar anim-right">
              <img src="/images/esmeralda/liverpool.png" alt="Liverpool" style={{ height: "80px" }} />
              <div className="rg-text-details"><strong>Mesa de Regalos Liverpool</strong></div>
              <div style={{ marginTop: "12px" }}>
                <a href={project.gift_registry.liverpoolLink} target="_blank" rel="noopener noreferrer" className="rg-location-btn">LIVERPOOL</a>
              </div>
            </div>
          )}
          {project.show_lluvia_sobres && (
            <div className="rg-centrar anim-left">
              <img src="/images/esmeralda/sobre.png" alt="Sobre" style={{ height: "80px" }} />
              <div className="rg-text-details">
                <strong>Lluvia de Sobres</strong>
                {project.lluvia_sobres_text && <><br />{project.lluvia_sobres_text}</>}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* DATOS BANCARIOS */}
      {project.show_datos_bancarios && project.gift_registry?.bankAccount && (
        <section className="rg-cuando-donde" style={{ marginTop: "20px" }}>
          <div className="rg-announcement anim-up">Datos Bancarios</div>
          <hr style={{ width: "230px", margin: "8px auto", border: "none", borderTop: "1px solid #ce9e5f" }} />
          <div className="esp-peq" />
          <p className="rg-text anim-up">{project.datos_bancarios_text || "Si lo prefieres puedes hacer una transferencia bancaria como regalo:"}</p>
          {accountVisible && (
            <>
              {project.gift_registry.bankBeneficiary && (
                <p className="rg-text"><strong>Beneficiaria:</strong> {project.gift_registry.bankBeneficiary}</p>
              )}
              <p className="rg-text" style={{ letterSpacing: "2px", fontWeight: 600 }}>
                CLABE: {project.gift_registry.bankAccount}
              </p>
            </>
          )}
          <button
            onClick={() => (accountVisible ? handleCopy() : setAccountVisible(true))}
            className="rg-location-btn"
            style={{ cursor: "pointer" }}
          >
            {!accountVisible ? "Mostrar cuenta" : copied ? "¡Copiado!" : "Copiar CLABE"}
          </button>
          <div className="esp-med" />
        </section>
      )}

      {/* FRASE 2 */}
      <section className="rg-frase2">
        <div className="rg-frase2-content">
          <div className="rg-frase2-sub anim-down">COMPARTE CONMIGO TODAS TUS FOTOGRAFIAS DEL EVENTO</div>
          <div className="rg-frase2-white anim-down anim-pause-1">tu serás mi mejor fotograf@</div>
        </div>
      </section>

      {/* HASHTAG */}
      {project.show_instagram_album && project.hashtag && (
        <section className="rg-cuando-donde" style={{ paddingTop: "30px" }}>
          <div className="rg-announcement anim-up">Hashtag en Instagram</div>
          <hr style={{ width: "230px", margin: "8px auto", border: "none", borderTop: "1px solid #ce9e5f" }} />
          <div className="esp-peq" />
          <img src="/images/esmeralda/instagram.png" alt="Instagram" style={{ height: "60px", margin: "10px auto", display: "block" }} />
          <p className="rg-text anim-up">Comparte tus mejores momentos con el hashtag</p>
          <div className="rg-announcement-color anim-up" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>{project.hashtag}</div>
          <div style={{ textAlign: "center", marginTop: "12px" }}>
            <a href={`https://www.instagram.com/explore/tags/${project.hashtag.replace("#", "")}/`} target="_blank" rel="noopener noreferrer" className="rg-location-btn">VER FOTOS</a>
          </div>
          <div className="esp-med" />
        </section>
      )}

      {/* BUZÓN DE DESEOS */}
      <section className="rg-cuando-donde" style={{ paddingTop: "30px" }}>
        <div className="rg-announcement anim-up">Buzón de Deseos</div>
        <hr style={{ width: "230px", margin: "8px auto", border: "none", borderTop: "1px solid #ce9e5f" }} />
        <div className="esp-peq" />
        <img src="/images/esmeralda/buzon.png" alt="Buzón" style={{ height: "70px", margin: "10px auto", display: "block" }} />
        <p className="rg-text anim-up">Déjame un lindo mensaje por mis XV años:</p>
        <div style={{ maxWidth: "400px", margin: "0 auto", paddingBottom: "20px" }}>
          <textarea ref={mensajeRef} className="rg-form-campo" rows={4} placeholder="Escribe tu mensaje aquí..." style={{ marginBottom: "10px" }} />
          <div style={{ textAlign: "center" }}>
            <button onClick={enviarMensaje} className="rg-btn-form">Enviar Mensaje</button>
          </div>
        </div>
      </section>

      {/* CONFIRMACIÓN */}
      <section className="rg-confirmacion">
        <div className="rg-mensaje-recuadro">
          <div className="rg-announcement anim-up">¿Asistirás?</div>
          <hr style={{ width: "230px", margin: "8px auto", border: "none", borderTop: "1px solid #ce9e5f" }} />
          <div className="esp-peq" />
          <p className="rg-text anim-up anim-pause-1">
            {project.confirmation_phrase || <><strong>¡Será increíble contar con tu presencia!</strong><br />Por favor, confirma tu asistencia a este día tan especial para mi.<br /></>}
            <br />
          </p>
          <div className="anim-up anim-pause-15">
            <RosaGoldRSVP contacts={getRsvpContacts(project)} email={getRsvpEmail(project)} />
          </div>
          <div className="esp-med" />
          {project.dress_code && (
            <div className="anim-up anim-pause-2">
              <div className="rg-announcement">Vestimenta</div>
              <img src="/images/esmeralda/vestimenta.png" alt="Vestimenta" className="rg-vestimenta-img" />
              <div className="esp-peq" />
              <div className="rg-greeting">{project.dress_code.colors || "Formal"}</div>
              {project.dress_code.notes && <><br /><div className="rg-text">{project.dress_code.notes}</div></>}
              <br />
              <div className="rg-announcement-color" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>Te Espero</div>
            </div>
          )}
        </div>
      </section>

      <div className="rg-footer">© MeCorr Estudio</div>
    </div>
  );
}
