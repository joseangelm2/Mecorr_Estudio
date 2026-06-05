export default function VestimentaSection() {
  return (
    <section
      id="vestimenta"
      className="padding-section"
      style={{ backgroundColor: "rgba(255,255,255,.5)" }}
    >
      <div
        className="container"
        style={{ maxWidth: "100%", padding: "0 15px" }}
      >
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="mb-10 text-center wow fadeInUp">
              <img src="/images/flores-01.png" width="160" alt="" />
            </div>
            <h1 className="titulo mb-10 color-titulos text-center wow fadeInUp">
              Código de Vestimenta
            </h1>
            <div className="mb-10 text-center wow fadeInUp">
              <img src="/images/formal.png" width="120" alt="Formal" />
            </div>
            <p className="mb-0 color-textos text-center wow fadeInUp">
              Formal
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
