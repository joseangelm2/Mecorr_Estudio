"use client";

import { useRef, useState } from "react";
import type { Project } from "@/types/invitation";
import DressCodePalette from "@/components/DressCodePalette";

interface Props {
  project: Project;
}

function CutLine() {
  return <div className="cut-line" />;
}

const STORE_ICONS: Record<string, string> = {
  liverpool: "/images/esmeralda/liverpool.png",
  amazon:    "/images/esmeralda/amazon.svg",
  palacio:   "/images/esmeralda/palacio.svg",
  sears:     "/images/esmeralda/sears.svg",
  generic:   "/images/esmeralda/mesa_regalos.png",
};

const STORE_LABELS: Record<string, string> = {
  liverpool: "Liverpool",
  amazon:    "Amazon",
  palacio:   "El Palacio de Hierro",
  sears:     "Sears",
  generic:   "Mesa de Regalos",
};

export default function EsmeraldaGifts({ project }: Props) {
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const phone = project.rsvp_phone ?? "";
  const accountLabel = project.gift_registry?.bankAccountType === "tarjeta" ? "TARJETA" : "CLABE";
  const giftStore = project.gift_registry?.giftStore ?? "liverpool";
  const storeLabel = STORE_LABELS[giftStore] ?? "Liverpool";
  // El logo de la tienda sigue la tienda elegida (Liverpool/Amazon/Palacio/Sears/
  // Genérico), igual que en Elegance/Zafiro/Especial. "icono_tienda_url" permite
  // además subir un logo propio que reemplaza al de la tienda, si se desea.
  const storeIcon = (project.extra_config?.icono_tienda_url as string) || STORE_ICONS[giftStore] || STORE_ICONS.liverpool;
  // Esmeralda Especial: además de la mesa principal (Mesa de regalos del tab General),
  // admite mesas adicionales (extra_config.gift_registries) — todas se listan en la
  // misma sección, cada una con su logo de tienda y su botón.
  const extraRegistries = project.template === "esmeralda-especial"
    ? ((project.extra_config?.gift_registries as { giftStore: string; liverpoolLink: string; iconUrl?: string }[] | undefined) ?? [])
        .filter((r) => r.liverpoolLink)
    : [];
  const registries = [
    ...(project.gift_registry?.liverpoolLink
      ? [{ link: project.gift_registry.liverpoolLink, icon: storeIcon, label: storeLabel }]
      : []),
    ...extraRegistries.map((r) => ({
      link: r.liverpoolLink,
      icon: r.iconUrl || STORE_ICONS[r.giftStore] || STORE_ICONS.liverpool,
      label: STORE_LABELS[r.giftStore] || "Mesa de Regalos",
    })),
  ];
  const iconoVestimenta = (project.extra_config?.icono_vestimenta_url as string) || "/images/esmeralda/vestimenta.png";
  const iconoSobre = (project.extra_config?.icono_sobre_url as string) || "/images/esmeralda/sobre.png";
  const iconoDatosBancarios = (project.extra_config?.icono_datos_bancarios_url as string) || "/images/esmeralda/mesa_regalos.png";
  const iconoMesaRegalos = (project.extra_config?.icono_mesa_regalos_url as string) || "/images/esmeralda/mesa_regalos.png";
  const iconoBuzon = (project.extra_config?.icono_buzon_url as string) || "/images/esmeralda/buzon.png";
  const iconoInstagram = (project.extra_config?.icono_instagram_url as string) || "/images/esmeralda/instagram.png";

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
              <img src={iconoVestimenta} alt="Vestimenta" />
              <p className="texto">{project.dress_code.colors || "Vestimenta Formal"}</p>
              <DressCodePalette project={project} />
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
              <img src={iconoSobre} alt="Sobre" />
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
              <img src={iconoDatosBancarios} className="icon-image" alt="Transferencia" />
              <p className="texto">
                {project.datos_bancarios_text ||
                  "Si lo prefieres puedes hacer una transferencia bancaria como regalo:"}
              </p>
              {visible && (
                <div className="texto" style={{ marginTop: "2%" }}>
                  {project.gift_registry.bankBeneficiary && (
                    <p><b>Beneficiaria:</b> {project.gift_registry.bankBeneficiary}</p>
                  )}
                  <p><b>{accountLabel}:</b> {project.gift_registry.bankAccount}</p>
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
                  {copied ? "¡Copiado!" : `Copiar ${accountLabel}`}
                </button>
              )}
            </div>
          </section>
        </>
      )}

      {/* Mesa de Regalos Liverpool */}
      {registries.length > 0 && (
        <>
          <CutLine />
          <section className="gift-liverpool-container show-p-y no-print" style={{ marginTop: "4vw" }}>
            <h2>{registries.length > 1 ? "Mesas de Regalos" : "Mesa de Regalos"}</h2>
            <div className="gift-liverpool-object-container">
              <img src={iconoMesaRegalos} className="icon-image" alt="Mesa de regalos" />
              <p className="texto">Valoro enormemente tu compañía por encima de cualquier obsequio.</p>
            </div>
            <div className="liverpool-container">
              {registries.map((r, i) => (
                <div
                  key={i}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: i > 0 ? "6vw" : 0 }}
                >
                  <img src={r.icon} alt={r.label} />
                  <a
                    className="button"
                    href={r.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver Lista de Deseos
                  </a>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Buzón de Deseos */}
      <CutLine />
      <section className="gift-container show-p-y no-print" style={{ marginTop: "4vw" }}>
        <h2>Buzón de Deseos</h2>
        <div className="gift-object-container">
          <img src={iconoBuzon} alt="Buzón" />
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
      {project.show_instagram_album && project.hashtag && (
        <>
          <CutLine />
          <section className="gift-liverpool-container show-p-y no-print" style={{ marginTop: "4vw" }}>
            <h2>Hashtag en Instagram</h2>
            <div className="gift-liverpool-object-container">
              <img src={iconoInstagram} className="icon-image" alt="Instagram" />
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
