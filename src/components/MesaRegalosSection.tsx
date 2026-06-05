export default function MesaRegalosSection() {
  return (
    <section
      id="mesa-regalos"
      className="padding-section"
      style={{ backgroundColor: "rgba(255,255,255,.5)" }}
    >
      <div className="container" style={{ maxWidth: "100%", padding: "0 15px" }}>
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="mb-10 text-center wow fadeInUp">
              <img src="/images/flores-01.png" width="160" alt="" />
            </div>
            <h1 className="titulo mb-20 color-titulos text-center wow fadeInUp">
              Mesa de Regalos
            </h1>
            <p className="mb-30 color-textos text-center wow fadeInUp">
              Si deseas hacerme un regalo, con mucho cariño he preparado una
              selección de opciones para ti.
            </p>
            <div className="mb-10 text-center wow fadeInUp">
              <a
                href="https://mesaderegalos.liverpool.com.mx/milistaderegalos/51309081"
                target="_blank"
                rel="noopener noreferrer"
                className="link-abrir color-principal"
                style={{ border: "1px solid", display: "inline-block" }}
              >
                Ver Mesa de Regalos
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
