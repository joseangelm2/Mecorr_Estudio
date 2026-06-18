interface Props {
  photos: string[]
}

export default function ElegancePhotoGrid({ photos }: Props) {
  return (
    <>
      <div className="encabezado">
        <h3 style={{
          fontFamily: "var(--font-tangerine, 'Tangerine', serif)",
          fontSize: '10vw',
          color: 'var(--subtitulos-color)',
          textAlign: 'center',
          margin: '5% 0 4vw',
        }}>Álbum de fotos</h3>
      </div>
      <div id="grid">
        <div className="container-grid">
          <div className="dos-fotos">
            <img className="object-grid show-p-y" src={photos[7]} alt="" />
            <img className="object-grid show-p-y" src={photos[8]} alt="" />
          </div>
          <div className="column full-width show-p-y">
            <img className="object-grid" src={photos[9]} alt="" />
          </div>
        </div>
      </div>
    </>
  )
}
