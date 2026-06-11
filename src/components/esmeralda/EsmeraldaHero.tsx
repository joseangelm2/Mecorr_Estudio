export default function EsmeraldaHero() {
  return (
    <>
      <h1 className="event texto" style={{ textAlign: "center", marginTop: "5vw" }}>
        ¡Mis XV!
      </h1>

      {/* Foto — entra primero, sube desde abajo */}
      <div className="foto show-hero-up" style={{ transitionDelay: "3.5s" }}>
        <img className="principal" src="/images/esmeralda/foto.jpg" alt="Esmeralda" />
        <img className="aro-foto" src="/images/esmeralda/aro.png" alt="" />
        <img className="aro" src="/images/esmeralda/aro.gif" alt="" />
      </div>

      {/* Globo de 15 — sube a los pies de la foto */}
      <div className="photo show-hero-up" style={{ marginTop: "-4%", transitionDelay: "4.2s" }}>
        <img className="age" src="/images/esmeralda/15.png" alt="15" />
      </div>

      {/* Frase — entra desde la izquierda */}
      <p className="mensaje texto no-print show-hero-left" style={{ textAlign: "center", transitionDelay: "4.9s" }}>
        &ldquo;Mis XV años serán un sueño hecho realidad, y quiero que tú formes parte
        de este capítulo único en mi vida&rdquo;
      </p>

      {/* Nombre — entra desde la izquierda */}
      <div className="name show-hero-left" style={{ transitionDelay: "5.6s" }}>
        <img className="tarjet" src="/images/esmeralda/banda.png" alt="" />
        <h2 className="person-name" style={{ textAlign: "center" }}>
          Esmeralda
        </h2>
      </div>

      {/* Fecha — entra desde la izquierda, última */}
      <h3 id="fecha" className="date texto show-hero-left" style={{ textAlign: "center", margin: "3vw 0", transitionDelay: "6.3s" }}>
        22.NOV.2026
      </h3>
    </>
  );
}
