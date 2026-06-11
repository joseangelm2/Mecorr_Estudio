"use client";

import { useRef } from "react";
import type { Project } from "@/types/invitation";

interface Props {
  project: Project
}

export default function MagicalGifts({ project }: Props) {
  const mensajeRef = useRef<HTMLTextAreaElement>(null);

  function enviarMensaje() {
    const msg = mensajeRef.current?.value ?? "";
    const url = `https://api.whatsapp.com/send?phone=52${project.rsvp_phone ?? ""}&text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  const hashtag = project.hashtag ?? "#XVMagical";
  const hashtagClean = hashtag.replace("#", "");

  return (
    <>
      {/* Vestimenta */}
      {project.dress_code && (
        <section className="dress-code show-p-y no-print" style={{ marginTop: "10%" }}>
          <h2>Código de Vestimenta</h2>
          <div className="dress-code-container">
            <img src="/images/magical/vestimenta.png" alt="Vestimenta" />
            <p className="texto">{project.dress_code.colors}</p>
            {project.dress_code.notes && (
              <p className="texto" style={{ fontSize: "3.5vw", marginTop: "2%" }}>❖ {project.dress_code.notes}</p>
            )}
          </div>
        </section>
      )}

      {/* Lluvia de Sobres */}
      {project.show_lluvia_sobres && (
        <section id="gift-table" className="gift-container show-p-y no-print" style={{ marginTop: "3%" }}>
          <h2>Lluvia de Sobres</h2>
          <div className="cut-line" />
          <div className="gift-object-container">
            <img src="/images/magical/sobre.png" alt="Sobre" />
            <p className="texto">{project.lluvia_sobres_text ?? "Es la tradición de regalar dinero en efectivo dentro de un sobre"}</p>
          </div>
        </section>
      )}

      {/* Datos Bancarios */}
      {project.show_datos_bancarios && project.gift_registry?.bankAccount && (
        <section className="gift-container show-p-y no-print" style={{ marginTop: "3%" }}>
          <h2>Datos Bancarios</h2>
          <div className="cut-line" />
          <div className="gift-object-container">
            <img src="/images/magical/mesa_regalos.png" className="icon-image" alt="Transferencia" />
            <p className="texto">{project.datos_bancarios_text ?? "Si lo prefieres, puedes hacer una transferencia bancaria:"}</p>
            <p className="texto"><b>Cuenta:</b> {project.gift_registry.bankAccount}</p>
            {project.gift_registry.bankBeneficiary && (
              <p className="texto"><b>Beneficiaria:</b> {project.gift_registry.bankBeneficiary}</p>
            )}
          </div>
        </section>
      )}

      {/* Mesa de Regalos Liverpool */}
      {project.gift_registry?.liverpoolLink && (
        <section className="gift-liverpool-container show-p-y no-print" style={{ marginTop: "3%" }}>
          <h2>Mesa de Regalos</h2>
          <div className="gift-liverpool-object-container">
            <img src="/images/magical/mesa_regalos.png" className="icon-image" alt="Mesa de regalos" />
            <p className="texto">Valoro enormemente tu compañía por encima de cualquier obsequio.</p>
          </div>
          <div className="liverpool-container">
            <img src="/images/magical/liverpool.png" alt="Liverpool" />
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

      {/* Buzón de Deseos */}
      <section className="gift-container show-p-y no-print" style={{ marginTop: "8%" }}>
        <h2>Buzón de Deseos</h2>
        <div className="cut-line" />
        <div className="gift-object-container">
          <img src="/images/magical/buzon.png" alt="Buzón" />
          <p className="texto">
            Si quieres dejarme un lindo mensaje por mis XV, puedes hacerlo escribiéndome un mensaje:
          </p>
          <textarea
            className="mensaje-buzon"
            ref={mensajeRef}
            placeholder="Escribe tu mensaje aquí"
          />
          <div className="button" onClick={enviarMensaje}>
            Enviar Mensaje
          </div>
        </div>
      </section>

      {/* Hashtag Instagram */}
      {hashtag && (
        <section className="gift-liverpool-container show-p-y no-print" style={{ marginTop: "8%" }}>
          <h2>Hashtag en Instagram</h2>
          <div className="gift-liverpool-object-container">
            <img src="/images/magical/instagram.png" className="icon-image" alt="Instagram" />
            <p className="texto" style={{ width: "90%", marginTop: "2%" }}>
              Comparte tus mejores momentos con el hashtag en Instagram:{" "}
              <br />{hashtag}
            </p>
          </div>
          <div className="liverpool-container">
            <a
              className="button"
              href={`https://www.instagram.com/explore/tags/${hashtagClean}/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver Fotos
            </a>
          </div>
        </section>
      )}
    </>
  );
}
