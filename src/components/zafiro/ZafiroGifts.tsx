"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Project } from "@/types/invitation";
import DressCodePalette from "@/components/DressCodePalette";

interface Props {
  project: Project;
}

const STORE_ICONS: Record<string, string> = {
  liverpool: "/images/zafiro/liverpool.png",
  sears:     "/images/zafiro/Sears-morado-transparente.png",
  amazon:    "/images/zafiro/mesa_regalos.png",
  palacio:   "/images/zafiro/mesa_regalos.png",
  generic:   "/images/zafiro/mesa_regalos.png",
};

// Tamaño intrínseco de cada logo — next/image lo usa para reservar el aspect-ratio
// correcto (el ancho visual real lo sigue dando el style width:"%" de cada <img>).
const STORE_ICON_SIZE: Record<string, { width: number; height: number }> = {
  liverpool: { width: 512, height: 154 },
  sears:     { width: 500, height: 501 },
  amazon:    { width: 128, height: 128 },
  palacio:   { width: 128, height: 128 },
  generic:   { width: 128, height: 128 },
};

const STORE_LABELS: Record<string, string> = {
  liverpool: "Liverpool",
  sears:     "Sears",
  amazon:    "Amazon",
  palacio:   "El Palacio de Hierro",
  generic:   "Mesa de Regalos",
};

export default function ZafiroGifts({ project }: Props) {
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const phone = project.rsvp_phone ?? "";
  const accountLabel = project.gift_registry?.bankAccountType === "tarjeta" ? "TARJETA" : "CLABE";
  const giftStore = project.gift_registry?.giftStore ?? "liverpool";
  const storeIcon = STORE_ICONS[giftStore] ?? STORE_ICONS.liverpool;
  const storeLabel = STORE_LABELS[giftStore] ?? STORE_LABELS.liverpool;
  const storeIconSize = STORE_ICON_SIZE[giftStore] ?? STORE_ICON_SIZE.liverpool;

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
          <Image
            style={{ width: "50%", height: "auto", marginBottom: "3%", filter: "var(--zafiro-dark-filter)" }}
            src={storeIcon}
            alt={storeLabel}
            width={storeIconSize.width}
            height={storeIconSize.height}
          />
          <h3>Mesa de Regalos</h3>
          {project.mesa_regalos_text && <p className="texto">{project.mesa_regalos_text}</p>}
          <div className="boton" style={{ marginTop: "1%" }}>Ver Lista de Deseos</div>
        </a>
      )}

      {/* Lluvia de Sobres */}
      {project.show_lluvia_sobres && (
        <div className="extra show-p-y">
          <Image
            src="/images/zafiro/sobre.png"
            style={{ width: "25%", height: "auto", filter: "var(--zafiro-dark-filter)" }}
            alt="Sobre"
            width={512}
            height={512}
          />
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
          <Image
            src="/images/zafiro/mesa_regalos.png"
            style={{ width: "20%", height: "auto", marginBottom: "3%", filter: "var(--zafiro-dark-filter)" }}
            alt="Transferencia"
            width={128}
            height={128}
          />
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
                <p><b>{accountLabel}:</b> {project.gift_registry.bankAccount}</p>
              </div>
              <button onClick={handleCopy} className="boton" style={{ marginTop: "2%", cursor: "pointer" }}>
                {copied ? "¡Copiado!" : `Copiar ${accountLabel}`}
              </button>
            </>
          )}
        </div>
      )}

      {/* Código de Vestimenta */}
      {project.dress_code && (
        <div className="extra show-p-y">
          <Image
            src="/images/zafiro/vestimenta.png"
            style={{ width: "30%", height: "auto", marginBottom: "3%", filter: "var(--zafiro-dark-filter)" }}
            alt="Vestimenta"
            width={400}
            height={331}
          />
          <h3>Código de Vestimenta</h3>
          <p className="texto">{project.dress_code.colors || "Vestimenta Formal"}</p>
          {project.dress_code.notes && <p className="texto">{project.dress_code.notes}</p>}
          <DressCodePalette project={project} />
        </div>
      )}

      {/* Buzón de Deseos */}
      <div id="whatsappLink" className="extra show-p-y">
        <Image
          src="/images/zafiro/buzon.png"
          style={{ width: "25%", height: "auto", marginBottom: "3%", filter: "var(--zafiro-dark-filter)" }}
          alt="Buzón"
          width={128}
          height={128}
        />
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
      {project.show_instagram_album && project.hashtag && (
        <a
          className="extra show-p-y"
          href={`https://www.instagram.com/explore/tags/${project.hashtag.replace("#", "")}/`}
          target="_self"
        >
          <Image
            src="/images/zafiro/instagram.png"
            style={{ width: "50%", height: "auto", marginBottom: "4%" }}
            alt="Instagram"
            width={400}
            height={129}
          />
          <h3>Hashtag en Instagram</h3>
          <p className="texto">
            Comparte tus mejores momentos con el Hashtag <br />{project.hashtag}
          </p>
          <div className="boton" style={{ width: "30%" }}>Ver Fotos</div>
        </a>
      )}

      {/* Información Importante */}
      {project.important_info_text && (
        <div className="extra show-p-y">
          <h3>Información Importante</h3>
          <p className="importante">❖ {project.important_info_text}</p>
        </div>
      )}
    </>
  );
}
