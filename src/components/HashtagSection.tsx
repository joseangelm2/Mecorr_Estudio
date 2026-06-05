interface Props {
  hashtag?: string;
}

export default function HashtagSection({ hashtag }: Props) {
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
        {hashtag ? (
          <p className="mb-10 color-textos text-center wow fadeInUp" style={{ fontSize: "22px" }}>
            #{hashtag}
          </p>
        ) : null}
        <p className="mb-0 color-textos text-center wow fadeInUp">
          Comparte con nosotros todas tus fotografías del evento.
        </p>
        <br />
        <div className="mb-20 text-center">
          <a
            href={hashtag ? `https://www.instagram.com/explore/tags/${hashtag}/` : ""}
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
