'use client'

import { useState } from 'react'

interface Props {
  youtubeId?: string;
  localVideo?: string;
}

function pauseBackgroundMusic() {
  const audio = document.getElementById('sonido2') as HTMLAudioElement | null
  audio?.pause()
}

export default function VideoSection({
  youtubeId = "",
  localVideo = "",
}: Props) {
  const [ytStarted, setYtStarted] = useState(false)
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
            <div style={{ position: 'relative' }}>
              {!ytStarted && (
                <div
                  style={{ position: 'absolute', inset: 0, zIndex: 1, cursor: 'pointer' }}
                  onClick={() => { pauseBackgroundMusic(); setYtStarted(true) }}
                />
              )}
              <iframe
                width="100%"
                style={{ aspectRatio: "16/9", border: "none", display: "block" }}
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : localVideo ? (
            <video
              src={localVideo}
              controls
              playsInline
              style={{ width: "100%", display: "block" }}
              onPlay={pauseBackgroundMusic}
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
