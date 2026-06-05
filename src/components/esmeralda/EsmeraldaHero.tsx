export default function EsmeraldaHero() {
  return (
    <>
      <h1 className="event texto" style={{ textAlign: "center", marginTop: "5vw" }}>
        ¡Mis XV!
      </h1>

      {/* Circular profile photo with animated frame */}
      <div className="foto">
        <img className="principal" src="/images/esmeralda/foto.jpg" alt="Esmeralda" />
        <img className="aro-foto" src="/images/esmeralda/aro.png" alt="" />
        <img className="aro" src="/images/esmeralda/aro.gif" alt="" />
      </div>

      {/* 15 badge */}
      <div className="photo" style={{ marginTop: "-4%" }}>
        <img className="age" src="/images/esmeralda/15.png" alt="15" />
      </div>

      {/* Quote */}
      <p className="mensaje texto no-print" style={{ textAlign: "center" }}>
        &ldquo;Mis XV años serán un sueño hecho realidad, y quiero que tú formes parte
        de este capítulo único en mi vida&rdquo;
      </p>

      {/* Name banner */}
      <div className="name">
        <img className="tarjet" src="/images/esmeralda/banda.png" alt="" />
        <h2 className="person-name" style={{ textAlign: "center" }}>
          Esmeralda
        </h2>
      </div>

      {/* Date */}
      <h3 id="fecha" className="date texto" style={{ textAlign: "center", margin: "3vw 0" }}>
        22.NOV.2026
      </h3>
    </>
  );
}
