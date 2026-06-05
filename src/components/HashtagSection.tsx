export default function HashtagSection() {
  return (
    <section
      id="hashtag"
      className="padding-section"
      style={{ backgroundColor: "rgba(255,255,255,.5)" }}
    >
      <div
        className="container"
        style={{ maxWidth: "100%", padding: "0 15px" }}
      >
        <div className="mb-10 text-center wow fadeInUp">
          <img src="/images/hashtag.png" width="60" alt="Hashtag" />
        </div>
        <p className="mb-0 color-textos text-center wow fadeInUp">
          Comparte con nosotros todas tus fotografías del evento.
        </p>
        <br />
        <div className="mb-20 text-center">
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="link-abrir color-principal"
          >
            Compartir Fotos
          </a>
        </div>
      </div>
    </section>
  );
}
