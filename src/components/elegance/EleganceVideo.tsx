'use client'

import { useState } from 'react'

interface Props {
  youtubeId?: string
  localVideo?: string
  audioRef: React.RefObject<HTMLAudioElement | null>
}

export default function EleganceVideo({ youtubeId, localVideo, audioRef }: Props) {
  const [ytStarted, setYtStarted] = useState(false)

  function pauseMusic() {
    audioRef.current?.pause()
  }

  return (
    <div className="extra show-p-y" style={{ padding: '0', overflow: 'hidden', borderRadius: '0' }}>
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
      ) : localVideo ? (
        <video
          src={localVideo}
          controls
          playsInline
          style={{ width: '100%', display: 'block' }}
          onPlay={pauseMusic}
        />
      ) : null}
    </div>
  )
}
