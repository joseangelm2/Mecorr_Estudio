"use client";

import { useRef, useState } from "react";
import type { Project } from "@/types/invitation";
import DressCodePalette from "@/components/DressCodePalette";

interface Props {
  project: Project;
}

export default function LoveGifts({ project }: Props) {
  const mensajeRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const phone = project.rsvp_phone ?? "";

  function enviarMensaje() {
    const msg = mensajeRef.current?.value ?? "";
    window.open(
      `https://api.whatsapp.com/send?phone=52${phone}&text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  }

  function copiarCuenta() {
    const account = (project.gift_registry?.bankAccount ?? "").replace(/\s/g, "");
    navigator.clipboard.writeText(account).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="contain">
      <div className="extra">

        {/* Código de Vestimenta */}
        {project.dress_code && (
          <section className="dress-code show-p-y" style={{ marginTop: "8%" }}>
            <h2 className="subtitulo">Código de Vestimenta</h2>
            <img src="/images/love/9_separador.png" className="separador" alt="" />
            <div className="dress-code-container">
              <img className="icon-extra" src="/images/love/vestimenta.png" alt="Vestimenta" />
              <p className="texto">{project.dress_code.colors || "Vestimenta Formal"}</p>
              <DressCodePalette project={project} />
            </div>
          </section>
        )}

        {/* Lluvia de Sobres */}
        {project.show_lluvia_sobres && (
          <section className="gift-container show-p-y" style={{ marginTop: "8%" }}>
            <h2 className="subtitulo">Lluvia de Sobres</h2>
            <img src="/images/love/9_separador.png" className="separador" alt="" />
            <div className="gift-object-container">
              <img className="icon-extra" src="/images/love/sobre.png" alt="Sobre" />
              <p className="texto">
                {project.lluvia_sobres_text ||
                  "Es la tradición de regalar dinero en efectivo dentro de un sobre"}
              </p>
            </div>
          </section>
        )}

        {/* Mesa de Regalos Liverpool */}
        {project.gift_registry?.liverpoolLink && (
          <section className="gift-liverpool-container show-p-y" style={{ marginTop: "8%" }}>
            <h2 className="subtitulo">Mesa de Regalos</h2>
            <img src="/images/love/9_separador.png" className="separador" alt="" />
            <div className="gift-liverpool-object-container">
              <img className="icon-extra" src="/images/love/mesa_regalos.png" alt="Mesa de regalos" />
              <p className="texto">Valoro enormemente tu compañía por encima de cualquier obsequio</p>
            </div>
            <div className="liverpool-container">
              <img src="/images/love/liverpool.png" alt="Liverpool" />
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
        )}

        {/* Datos Bancarios */}
        {project.show_datos_bancarios && project.gift_registry?.bankAccount && (
          <section className="gift-liverpool-container show-p-y" style={{ marginTop: "8%" }}>
            <h2 className="subtitulo">Datos Bancarios</h2>
            <img src="/images/love/9_separador.png" className="separador" alt="" />
            <div className="gift-liverpool-object-container">
              <p className="texto">
                {project.datos_bancarios_text ||
                  "Si lo prefieres puedes hacer una transferencia bancaria como regalo:"}
              </p>
              {visible && (
                <>
                  {project.gift_registry.bankBeneficiary && (
                    <>
                      <strong className="texto">Beneficiaria:</strong>
                      <p className="texto">{project.gift_registry.bankBeneficiary}</p>
                    </>
                  )}
                  <strong className="texto">CLABE:</strong>
                  <p className="texto">{project.gift_registry.bankAccount}</p>
                </>
              )}
            </div>
            <div className="liverpool-container">
              {!visible ? (
                <button className="button" onClick={() => setVisible(true)} style={{ width: "auto" }}>
                  Mostrar cuenta
                </button>
              ) : (
                <button className="button" onClick={copiarCuenta} style={{ width: "auto" }}>
                  {copied ? "¡Copiado!" : "Copiar"}
                </button>
              )}
            </div>
          </section>
        )}

        {/* Buzón de Deseos */}
        <section className="gift-container show-p-y" style={{ marginTop: "8%" }}>
          <h2 className="subtitulo">Buzón de Deseos</h2>
          <img src="/images/love/9_separador.png" className="separador" alt="" />
          <div className="gift-object-container">
            <img className="icon-extra" src="/images/love/buzon.png" alt="Buzón" />
            <p className="texto">
              Si quieres dejarme un lindo mensaje por mis XV, puedes hacerlo aquí:
            </p>
            <textarea ref={mensajeRef} className="mensaje" placeholder="Escribe tu mensaje aquí" />
            <button className="button" style={{ width: "60%" }} onClick={enviarMensaje}>
              Enviar Mensaje
            </button>
          </div>
        </section>

        {/* Hashtag Instagram */}
        {project.show_instagram_album && project.hashtag && (
          <section className="dress-code show-p-y" style={{ marginTop: "8%" }}>
            <h2 className="subtitulo">Hashtag en Instagram</h2>
            <img src="/images/love/9_separador.png" className="separador" alt="" />
            <div className="dress-code-container">
              <img className="icon-extra" src="/images/love/instagram.png" alt="Instagram" />
              <p className="texto">
                Comparte tus mejores momentos con el Hashtag en Instagram
              </p>
              <h2 className="subtitulo">{project.hashtag}</h2>
            </div>
            <div className="gift-object-container" style={{ width: "100%", marginTop: "3%" }}>
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
        )}

        {/* Información Importante */}
        {project.dress_code?.notes && (
          <section className="dress-code show-p-y" style={{ marginTop: "8%" }}>
            <h2 className="subtitulo">Información Importante</h2>
            <img src="/images/love/9_separador.png" className="separador" alt="" />
            {project.dress_code.notes.split("\n").filter(Boolean).map((note, i) => (
              <p key={i} className="texto">❖ {note.trim()}</p>
            ))}
          </section>
        )}

      </div>
    </div>
  );
}
