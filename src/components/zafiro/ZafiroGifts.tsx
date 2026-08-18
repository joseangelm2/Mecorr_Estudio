"use client";

import { useRef, useState } from "react";
import type { Project } from "@/types/invitation";

interface Props {
  project: Project;
}

export default function ZafiroGifts({ project }: Props) {
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const phone = project.rsvp_phone ?? "";

  function sendWA(msg: string) {
    window.open(
      `https://api.whatsapp.com/send?phone=52${phone}&text=${encodeURIComponent(msg)}`,
      "_self"
    );
  }

  function handleCopy() {
    const account = (project.gift_registry?.bankAccount ?? "").replace(/\s/g, "");
    navigator.clipboard.writeText(account).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <>
      {/* Mesa de Regalos */}
      {project.gift_registry?.liverpoolLink && (
        <a className="extra show-p-y" href={project.gift_registry.liverpoolLink} target="_self">
          <img style={{ width: "50%", marginBottom: "3%" }} src="/images/zafiro/liverpool.png" alt="Liverpool" />
          <h3>Mesa de Regalos</h3>
          <p className="texto">Tu presencia ilumina nuestro evento. Si deseas regalarme algo, te comparto las siguientes opciones:</p>
          <div className="boton" style={{ marginTop: "1%" }}>Ver Lista de Deseos</div>
        </a>
      )}

      {/* Lluvia de Sobres */}
      {project.show_lluvia_sobres && (
        <div className="extra show-p-y">
          <img src="/images/zafiro/sobre.png" style={{ width: "25%" }} alt="Sobre" />
          <h3>Lluvia de Sobres</h3>
          <p className="texto">
            {project.lluvia_sobres_text ||
              "Es la tradición de regalar dinero en efectivo dentro de un sobre."}
          </p>
        </div>
      )}

      {/* Datos Bancarios */}
      {project.show_datos_bancarios && project.gift_registry?.bankAccount && (
        <div className="extra show-p-y" style={{ width: "100%" }}>
          <img src="/images/zafiro/mesa_regalos.png" style={{ width: "20%", marginBottom: "3%" }} alt="Transferencia" />
          <h3>Datos Bancarios</h3>
          <p className="texto">
            {project.datos_bancarios_text ||
              "Si lo prefieres puedes hacer una transferencia bancaria como regalo:"}
          </p>
          {!visible ? (
            <button onClick={() => setVisible(true)} className="boton" style={{ marginTop: "2%", cursor: "pointer" }}>
              Mostrar cuenta
            </button>
          ) : (
            <>
              <div className="texto" style={{ marginTop: "2%" }}>
                {project.gift_registry.bankBeneficiary && (
                  <p><b>Beneficiaria:</b> {project.gift_registry.bankBeneficiary}</p>
                )}
                <p><b>CLABE:</b> {project.gift_registry.bankAccount}</p>
              </div>
              <button onClick={handleCopy} className="boton" style={{ marginTop: "2%", cursor: "pointer" }}>
                {copied ? "¡Copiado!" : "Copiar CLABE"}
              </button>
            </>
          )}
        </div>
      )}

      {/* Código de Vestimenta */}
      {project.dress_code && (
        <div className="extra show-p-y">
          <img src="/images/zafiro/vestimenta.png" style={{ width: "30%", marginBottom: "3%" }} alt="Vestimenta" />
          <h3>Código de Vestimenta</h3>
          <p className="texto">{project.dress_code.colors || "Vestimenta Formal"}</p>
          {project.dress_code.notes && <p className="texto">{project.dress_code.notes}</p>}
        </div>
      )}

      {/* Buzón de Deseos */}
      <div id="whatsappLink" className="extra show-p-y">
        <img src="/images/zafiro/buzon.png" style={{ width: "25%", marginBottom: "3%" }} alt="Buzón" />
        <h3>Buzón de Deseos</h3>
        <p className="texto" style={{ width: "90%" }}>Déjame un lindo mensaje por mis XV años:</p>
        <textarea className="mensaje" ref={messageRef} placeholder="Escribe tu mensaje aquí" />
        <div
          className="boton"
          style={{ width: "30%" }}
          onClick={() => sendWA(messageRef.current?.value ?? "")}
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
          <img src="/images/zafiro/instagram.png" style={{ width: "50%", marginBottom: "4%" }} alt="Instagram" />
          <h3>Hashtag en Instagram</h3>
          <p className="texto">
            Comparte tus mejores momentos con el Hashtag <br />{project.hashtag}
          </p>
          <div className="boton" style={{ width: "30%" }}>Ver Fotos</div>
        </a>
      )}

      {/* Información Importante */}
      {project.dress_code?.notes && (
        <div className="extra show-p-y">
          <h3>Información Importante</h3>
          <p className="importante">❖ {project.dress_code.notes}</p>
        </div>
      )}
    </>
  );
}
