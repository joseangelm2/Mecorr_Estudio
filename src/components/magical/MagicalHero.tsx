export default function MagicalHero() {
  return (
    <>
      <h1 className="event texto" style={{ textAlign: "center", marginTop: "5vw" }}>
        ✨ Mis XV ✨
      </h1>

      {/* Circular profile photo with animated frame */}
      <div className="foto">
        <img className="principal" src="/images/magical/foto.jpg" alt="Quinceañera" />
        <img className="aro-foto" src="/images/magical/aro.png" alt="" />
        <img className="aro" src="/images/magical/aro.gif" alt="" />
      </div>

      {/* 15 badge */}
      <div className="photo" style={{ marginTop: "-4%" }}>
        <img className="age" src="/images/magical/15.png" alt="15" />
      </div>

      {/* Quote */}
      <p className="mensaje texto no-print" style={{ textAlign: "center" }}>
        &ldquo;La magia no está en los sueños, sino en quienes los hacen
        realidad. Hoy, tú eres parte de mi magia&rdquo;
      </p>

      {/* Name banner */}
      <div className="name">
        <img className="tarjet" src="/images/magical/banda.png" alt="" />
        <h2 className="person-name" style={{ textAlign: "center" }}>
          Valentina
        </h2>
      </div>

      {/* Date */}
      <h3 id="fecha" className="date texto" style={{ textAlign: "center", margin: "3vw 0" }}>
        21.04.2023
      </h3>
    </>
  );
}
