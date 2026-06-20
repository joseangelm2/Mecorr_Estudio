'use client'

import { useState } from 'react'

interface Props {
  youtubeId?: string
  localVideo?: string
  audioRef: React.RefObject<HTMLAudioElement | null>
}

export default function EspecialVideo({ youtubeId, localVideo, audioRef }: Props) {
  const [ytStarted, setYtStarted] = useState(false)

  function pauseMusic() {
    audioRef.current?.pause()
  }

  if (!youtubeId && !localVideo) return null

  return (
    <section className="padding-section">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="mb-10 text-center wow fadeInUp">
            <img src="/images/flores-01.png" width="100" alt="" />
          </div>
          <h2 className="titulo color-titulos mb-20 text-center wow fadeInUp">Video</h2>
          <div className="wow fadeInUp" style={{ overflow: 'hidden', borderRadius: '8px' }}>
            {youtubeId ? (
              <div style={{ position: 'relative', width: '100%' }}>
                {!ytStarted && (
                  <div
                    style={{ position: 'absolute', inset: 0, zIndex: 1, cursor: 'pointer' }}
                    onClick={() => { pauseMusic(); setYtStarted(true) }}
                  />
                )}
                <iframe
                  width="100%"
                  style={{ aspectRatio: '16/9', border: 'none', display: 'block' }}
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <video
                src={localVideo}
                controls
                playsInline
                style={{ width: '100%', display: 'block' }}
                onPlay={pauseMusic}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
