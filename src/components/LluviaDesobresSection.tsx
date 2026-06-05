interface Props {
  bankAccount?: string;
  bankBeneficiary?: string;
}

export default function LluviaSobresSection({
  bankAccount = "000 000 000 000 000 000",
  bankBeneficiary,
}: Props) {
  return (
    <section
      id="lluvia-sobres"
      className="padding-section"
      style={{ backgroundColor: "rgba(255,255,255,.5)" }}
    >
      <div className="container" style={{ maxWidth: "100%", padding: "0 15px" }}>
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="mb-10 text-center wow fadeInUp">
              <img src="/promo/regalo.png" width="70" alt="Lluvia de Sobres" />
            </div>
            <h1 className="titulo mb-20 color-titulos text-center wow fadeInUp">
              Lluvia de Sobres
            </h1>
            <p className="mb-30 color-textos text-center wow fadeInUp">
              Si prefieres obsequiarme un sobre, será recibido con el mismo
              amor y gratitud. Tu presencia y cariño es el mejor regalo.
            </p>
            <div className="mb-10 text-center wow fadeInUp">
              <p className="color-textos" style={{ fontSize: "16px" }}>
                {bankBeneficiary ? (
                  <>
                    <strong>Beneficiario:</strong>
                    <br />
                    {bankBeneficiary}
                    <br />
                  </>
                ) : null}
                <strong>Número de cuenta:</strong>
                <br />
                CLABE: {bankAccount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
