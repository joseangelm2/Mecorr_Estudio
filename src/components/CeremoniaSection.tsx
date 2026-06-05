export default function CeremoniaSection() {
  return (
    <section
      id="ceremonia"
      className="padding-section"
      style={{ backgroundColor: "rgba(255,255,255,.5)" }}
    >
      <div
        className="container"
        style={{ maxWidth: "100%", padding: "0 15px" }}
      >
        <div className="mb-10 text-center wow fadeInUp">
          <img src="/images/flores-01.png" width="160" alt="" />
        </div>
        <h1 className="titulo color-titulos mb-20 text-center wow fadeInUp">
          Ceremonia
        </h1>
        <div className="mb-20 text-center wow fadeInUp">
          <img src="/images/iglesia.png" width="60" alt="Ceremonia" />
        </div>
        <div className="row">
          <div className="col-md-12 wow fadeInUp">
            <p className="color-textos mb-30 text-center">
              <strong style={{ fontSize: "22px" }}>15:00</strong>
              <br />
              Catedral de Morelia
              <br />
              Centro de Morelia
            </p>
            <div className="mb-20 text-center">
              <a
                href="https://maps.app.goo.gl/3Yw9GdtUXRA9KNz4A"
                target="_blank"
                rel="noopener noreferrer"
                className="link-abrir color-principal"
              >
                Ver ubicación
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
