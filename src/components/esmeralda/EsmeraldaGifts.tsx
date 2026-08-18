"use client";

import { useRef, useState } from "react";
import type { Project } from "@/types/invitation";

interface Props {
  project: Project;
}

function CutLine() {
  return <div className="cut-line" />;
}

export default function EsmeraldaGifts({ project }: Props) {
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const phone = project.rsvp_phone ?? "";

  function enviarMensaje() {
    const msg = messageRef.current?.value ?? "";
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  function handleCopy() {
    const account = (project.gift_registry?.bankAccount ?? "").replace(/\s/g, "");
    navigator.clipboard.writeText(account).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      {/* Vestimenta */}
      {project.dress_code && (
        <>
          <CutLine />
          <section className="dress-code show-p-y no-print" style={{ marginTop: "4vw" }}>
            <h2>Código de Vestimenta</h2>
            <div className="dress-code-container">
              <img src="/images/esmeralda/vestimenta.png" alt="Vestimenta" />
              <p className="texto">{project.dress_code.colors || "Vestimenta Formal"}</p>
            </div>
          </section>
        </>
      )}

      {/* Lluvia de Sobres */}
      {project.show_lluvia_sobres && (
        <>
          <CutLine />
          <section id="gift-table" className="gift-container show-p-y no-print" style={{ marginTop: "4vw" }}>
            <h2>Lluvia de Sobres</h2>
            <div className="gift-object-container">
              <img src="/images/esmeralda/sobre.png" alt="Sobre" />
              <p className="texto">
                {project.lluvia_sobres_text ||
                  "Es la tradición de regalar dinero en efectivo dentro de un sobre"}
              </p>
            </div>
          </section>
        </>
      )}

      {/* Datos Bancarios */}
      {project.show_datos_bancarios && project.gift_registry?.bankAccount && (
        <>
          <CutLine />
          <section className="gift-liverpool-container show-p-y no-print" style={{ marginTop: "4vw" }}>
            <h2>Datos Bancarios</h2>
            <div className="gift-liverpool-object-container">
              <img src="/images/esmeralda/mesa_regalos.png" className="icon-image" alt="Transferencia" />
              <p className="texto">
                {project.datos_bancarios_text ||
                  "Si lo prefieres puedes hacer una transferencia bancaria como regalo:"}
              </p>
              {visible && (
                <div className="texto" style={{ marginTop: "2%" }}>
                  {project.gift_registry.bankBeneficiary && (
                    <p><b>Beneficiaria:</b> {project.gift_registry.bankBeneficiary}</p>
                  )}
                  <p><b>CLABE:</b> {project.gift_registry.bankAccount}</p>
                </div>
              )}
            </div>
            <div className="liverpool-container">
              {!visible ? (
                <button type="button" className="button" onClick={() => setVisible(true)} style={{ cursor: "pointer", border: "none" }}>
                  Mostrar cuenta
                </button>
              ) : (
                <button type="button" className="button" onClick={handleCopy} style={{ cursor: "pointer", border: "none" }}>
                  {copied ? "¡Copiado!" : "Copiar CLABE"}
                </button>
              )}
            </div>
          </section>
        </>
      )}

      {/* Mesa de Regalos Liverpool */}
      {project.gift_registry?.liverpoolLink && (
        <>
          <CutLine />
          <section className="gift-liverpool-container show-p-y no-print" style={{ marginTop: "4vw" }}>
            <h2>Mesa de Regalos</h2>
            <div className="gift-liverpool-object-container">
              <img src="/images/esmeralda/mesa_regalos.png" className="icon-image" alt="Mesa de regalos" />
              <p className="texto">Valoro enormemente tu compañía por encima de cualquier obsequio.</p>
            </div>
            <div className="liverpool-container">
              <img src="/images/esmeralda/liverpool.png" alt="Liverpool" />
              <a
                className="button"
                href={project.gift_registry.liverpoolLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver Lista de Deseos
              </a>
            </div>
          </section>
        </>
      )}

      {/* Buzón de Deseos */}
      <CutLine />
      <section className="gift-container show-p-y no-print" style={{ marginTop: "4vw" }}>
        <h2>Buzón de Deseos</h2>
        <div className="gift-object-container">
          <img src="/images/esmeralda/buzon.png" alt="Buzón" />
          <p className="texto">
            Si quieres dejarme un lindo mensaje por mis XV, puedes hacerlo
            escribiéndome un mensaje:
          </p>
          <textarea
            className="mensaje-buzon"
            ref={messageRef}
            placeholder="Escribe tu mensaje aquí"
          />
          <div className="button" onClick={enviarMensaje}>
            Enviar Mensaje
          </div>
        </div>
      </section>

      {/* Hashtag Instagram */}
      {project.hashtag && (
        <>
          <CutLine />
          <section className="gift-liverpool-container show-p-y no-print" style={{ marginTop: "4vw" }}>
            <h2>Hashtag en Instagram</h2>
            <div className="gift-liverpool-object-container">
              <img src="/images/esmeralda/instagram.png" className="icon-image" alt="Instagram" />
              <p className="texto" style={{ width: "90%", marginTop: "2%" }}>
                Comparte tus mejores momentos con el hastag en Instagram:{" "}
                <br />{project.hashtag}
              </p>
            </div>
            <div className="liverpool-container">
              <a
                className="button"
                href={`https://www.instagram.com/explore/tags/${project.hashtag.replace("#", "")}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver Fotos
              </a>
            </div>
          </section>
        </>
      )}
      <CutLine />
    </>
  );
}
