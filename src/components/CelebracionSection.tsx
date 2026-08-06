interface Props {
  quinceaneraName?: string;
  parentNames?: string[];
  padrinos?: string[];
  invitationText?: string;
}

export default function CelebracionSection({
  quinceaneraName = "Aime Ferreira",
  parentNames = ["Felipe Ferreira", "Paola Mendoza"],
  padrinos = ["Sergio García", "Graciela Santos"],
  invitationText,
}: Props) {
  return (
    <section
      id="celebracion"
      className="padding-section"
      style={{ backgroundColor: "rgba(255,255,255,.5)" }}
    >
      <div
        className="container"
        style={{ maxWidth: "100%", padding: "0 15px" }}
      >
        <div className="row justify-content-center">
          <div className="col-md-10">
            <p
              className="mb-10 color-textos text-center wow fadeInUp"
              style={{ fontSize: "20px" }}
            >
              Mis XV Años
            </p>
            <h1
              className="titulo mb-20 color-titulos text-center wow fadeInUp"
              style={{ fontSize: "60px" }}
            >
              {quinceaneraName}
            </h1>
            <p className="mb-30 color-textos text-center wow fadeInUp invitation-text-content">
              {invitationText || "Te invito a mis quince primaveras, porque formas parte esencial de mi vida y nada me haría más feliz que compartir contigo este día. Llegó el gran día soñado, donde comenzaré a crecer y comprender lo bello de la vida. Con amor, te invito a celebrar mis quince años"}
            </p>
            <div className="mb-10 text-center wow fadeInUp">
              <img src="/images/flores-01.png" width="160" alt="" />
            </div>
            <h1 className="titulo mb-20 color-titulos text-center wow fadeInUp">
              Mis Padres
            </h1>
            <p className="mb-30 color-textos text-center wow fadeInUp">
              {parentNames.map((name, i) => (
                <span key={i}>
                  {name}
                  {i < parentNames.length - 1 && <br />}
                </span>
              ))}
            </p>
            {padrinos.length > 0 && (
              <>
                <div className="mb-10 text-center wow fadeInUp">
                  <img src="/images/flores-01.png" width="160" alt="" />
                </div>
                <h1 className="titulo mb-20 color-titulos text-center wow fadeInUp">
                  Mis Padrinos
                </h1>
                <p className="mb-30 color-textos text-center wow fadeInUp">
                  {padrinos.map((name, i) => (
                    <span key={i}>
                      {name}
                      {i < padrinos.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
