import AlbumQRCode from '@/components/AlbumQRCode'

interface Props {
  hashtag: string
  mode?: 'instagram' | 'album'
  slug: string
  decorationSrc?: string
}

export default function EspecialHashtag({ hashtag, mode = 'instagram', slug, decorationSrc = '/images/flores-01.png' }: Props) {
  return (
    <section id="hashtag" className="padding-section text-center">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="mb-10 wow fadeInUp">
            <img src={decorationSrc} width="100" alt="" />
          </div>
          <h2 className="titulo color-titulos mb-20 wow fadeInUp">Comparte el Momento</h2>
          {mode === 'album' ? (
            <div className="wow fadeInUp">
              <p className="color-textos mb-20">
                Escanea el código y sube tus fotos y videos del evento
              </p>
              <AlbumQRCode slug={slug} />
            </div>
          ) : (
            <>
              <p className="color-textos mb-20 wow fadeInUp">
                Comparte tus fotos y videos usando el hashtag
              </p>
              <p className="color-textos wow fadeInUp" style={{ fontSize: '24px', fontWeight: 600 }}>
                {hashtag}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
