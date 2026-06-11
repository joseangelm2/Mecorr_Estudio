"use client";

function CutLine() {
  return <div className="cut-line" />;
}

export default function EsmeraldaGifts() {
  function enviarMensaje() {
    const msg = (document.getElementById("mensajeInput") as HTMLTextAreaElement)?.value ?? "";
    const url = `https://api.whatsapp.com/send?phone=5214438569931&text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  return (
    <>
      {/* Vestimenta */}
      <CutLine />
      <section className="dress-code show-p-y no-print" style={{ marginTop: "4vw" }}>
        <h2>Código de Vestimenta</h2>
        <div className="dress-code-container">
          <img src="/images/esmeralda/vestimenta.png" alt="Vestimenta" />
          <p className="texto">Vestimenta Formal</p>
        </div>
      </section>

      {/* Lluvia de Sobres */}
      <CutLine />
      <section id="gift-table" className="gift-container show-p-y no-print" style={{ marginTop: "4vw" }}>
        <h2>Lluvia de Sobres</h2>
        <div className="gift-object-container">
          <img src="/images/esmeralda/sobre.png" alt="Sobre" />
          <p className="texto">Es la tradición de regalar dinero en efectivo dentro de un sobre</p>
        </div>
      </section>

      {/* Mesa de Regalos Liverpool */}
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
            href="https://mesaderegalos.liverpool.com.mx/milistaderegalos/51309081"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver Lista de Deseos
          </a>
        </div>
      </section>

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
            id="mensajeInput"
            placeholder="Escribe tu mensaje aquí"
          />
          <div className="button" onClick={enviarMensaje}>
            Enviar Mensaje
          </div>
        </div>
      </section>

      {/* Hashtag Instagram */}
      <CutLine />
      <section className="gift-liverpool-container show-p-y no-print" style={{ marginTop: "4vw" }}>
        <h2>Hashtag en Instagram</h2>
        <div className="gift-liverpool-object-container">
          <img src="/images/esmeralda/instagram.png" className="icon-image" alt="Instagram" />
          <p className="texto" style={{ width: "90%", marginTop: "2%" }}>
            Comparte tus mejores momentos con el hastag en Instagram:{" "}
            <br />#XVEsmeralda
          </p>
        </div>
        <div className="liverpool-container">
          <a
            className="button"
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver Fotos
          </a>
        </div>
      </section>
      <CutLine />
    </>
  );
}
