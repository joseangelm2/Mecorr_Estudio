interface Props {
  hashtag: string
}

export default function EspecialHashtag({ hashtag }: Props) {
  return (
    <section className="padding-section text-center">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="mb-10 wow fadeInUp">
            <img src="/images/flores-01.png" width="100" alt="" />
          </div>
          <h2 className="titulo color-titulos mb-20 wow fadeInUp">Comparte el Momento</h2>
          <p className="color-textos mb-20 wow fadeInUp">
            Comparte tus fotos y videos usando el hashtag
          </p>
          <p className="titulo color-titulos wow fadeInUp" style={{ fontSize: '24px' }}>
            {hashtag}
          </p>
        </div>
      </div>
    </section>
  )
}
