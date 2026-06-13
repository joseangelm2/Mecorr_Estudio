interface Props {
  photos: string[];
}

export default function LovePhotoGrid({ photos }: Props) {
  if (!photos.length) return null;

  const items = photos.slice(0, 10);
  const isOdd = items.length % 2 !== 0;

  return (
    <div className="contain album show-p-y">
      <h2 className="subtitulo">Álbum</h2>
      <img src="/images/love/9_separador.png" className="separador" alt="" />
      <section id="grid">
        <div className="container-grid">
          {items.slice(0, isOdd ? items.length - 1 : items.length).map((photo, i) => (
            <img key={i} className="object-grid show-p-y" src={photo} alt="" />
          ))}
        </div>
        {isOdd && (
          <img
            className="object-grid show-p-y"
            src={items[items.length - 1]}
            alt=""
            style={{ width: "100%", marginTop: "2vw" }}
          />
        )}
      </section>
    </div>
  );
}
