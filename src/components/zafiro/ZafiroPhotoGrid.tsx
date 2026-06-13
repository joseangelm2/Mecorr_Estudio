interface Props {
  photos: string[];
}

export default function ZafiroPhotoGrid({ photos }: Props) {
  if (!photos.length) return null;

  const pairs: [string, string][] = [];
  for (let i = 0; i + 1 < photos.length; i += 2) {
    pairs.push([photos[i], photos[i + 1]]);
  }
  const lastPhoto = photos.length % 2 !== 0 ? photos[photos.length - 1] : null;

  return (
    <>
      <div className="encabezado">
        <h3 className="evento" style={{ textAlign: "center", marginTop: "5%", marginBottom: "-5%" }}>
          Álbum de fotos
        </h3>
      </div>
      <div id="grid">
        <div className="container-grid">
          {pairs.map(([a, b], i) => (
            <div key={i} className="dos-fotos">
              <img className="object-grid show-p-y" src={a} alt="" />
              <img className="object-grid show-p-y" src={b} alt="" />
            </div>
          ))}
          {lastPhoto && (
            <div className="column full-width show-p-y">
              <img className="object-grid" src={lastPhoto} alt="" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
