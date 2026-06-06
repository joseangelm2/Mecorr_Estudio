interface Props {
  text?: string
}

export default function LluviaSobresSection({ text }: Props) {
  return (
    <section
      id="lluvia-sobres"
      className="padding-section"
      style={{ backgroundColor: 'rgba(255,255,255,.5)' }}
    >
      <div className="container" style={{ maxWidth: '100%', padding: '0 15px' }}>
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="mb-10 text-center wow fadeInUp">
              <img src="/promo/regalo.png" width="70" alt="Lluvia de Sobres" />
            </div>
            <h1 className="titulo mb-20 color-titulos text-center wow fadeInUp">
              Lluvia de Sobres
            </h1>
            <p className="mb-30 color-textos text-center wow fadeInUp invitation-text-content">
              {text ||
                'Si prefieres obsequiarme un sobre, será recibido con el mismo amor y gratitud. Tu presencia y cariño es el mejor regalo.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
