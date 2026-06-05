interface Props {
  quinceaneraName?: string;
  finalPhotoUrl?: string;
}

export default function FinalSection({
  quinceaneraName = "Aime Ferreira",
  finalPhotoUrl = "/images/IMG_8206.JPG",
}: Props) {
  return (
    <section
      id="nombre"
      className="padding-final bg-overlay-contador bg-img"
      style={{
        backgroundImage: `url(${finalPhotoUrl})`,
      }}
    >
      <div
        className="container"
        style={{ maxWidth: "100%", padding: "0 15px" }}
      >
        <div className="row justify-content-center">
          <div className="col-md-10">
            <p className="mb-0 text-white sombra text-center">¡Te Espero!</p>
            <h1 className="titulo mb-0 text-white sombra text-center">
              {quinceaneraName}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
