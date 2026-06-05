interface Props {
  youtubeId?: string;
  localVideo?: string;
}

export default function VideoSection({
  youtubeId = "",
  localVideo = "/videos/Video XV Años.mp4",
}: Props) {
  return (
    <section
      id="video"
      className="padding-section"
      style={{ backgroundColor: "rgba(255,255,255,.5)" }}
    >
      <div style={{ maxWidth: "100%", padding: "0 15px" }}>
        <div className="mb-10 text-center wow fadeInUp">
          <img src="/images/flores-01.png" width="160" alt="" />
        </div>
        <h1 className="titulo mb-20 color-titulos text-center wow fadeInUp">
          Nuestro Video
        </h1>

        <div className="wow fadeInUp" style={{ borderRadius: "12px", overflow: "hidden" }}>
          {youtubeId ? (
            <iframe
              width="100%"
              style={{ aspectRatio: "16/9", border: "none", display: "block" }}
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : localVideo ? (
            <video
              src={localVideo}
              controls
              playsInline
              style={{ width: "100%", display: "block" }}
            />
          ) : (
            <div
              style={{
                aspectRatio: "16/9",
                background: "rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "12px",
                border: "2px dashed rgba(0,0,0,0.15)",
              }}
            >
              <p style={{ color: "#999", fontSize: "14px", textAlign: "center", padding: "0 20px" }}>
                Agrega el ID de YouTube o la ruta del video en VideoSection.tsx
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
