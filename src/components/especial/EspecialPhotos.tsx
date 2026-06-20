'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  photos: string[]
  decorationSrc?: string
}

export default function EspecialPhotos({ photos, decorationSrc = '/images/flores-01.png' }: Props) {
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function startAuto() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % photos.length)
    }, 3000)
  }

  useEffect(() => {
    if (!photos.length) return
    startAuto()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [photos.length])

  function goTo(index: number) {
    setCurrent(index)
    startAuto()
  }

  if (!photos.length) return null

  return (
    <section id="fotos" className="padding-section" style={{ backgroundColor: 'rgba(255,255,255,.5)' }}>
      <div style={{ maxWidth: '100%', padding: '0 15px' }}>
        <div className="mb-10 text-center wow fadeInUp">
          <img src={decorationSrc} width="160" alt="" />
        </div>
        <h2 className="titulo color-titulos mb-30 text-center wow fadeInUp">Momentos</h2>
      </div>
      <div className="wow fadeInUp" style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            transition: 'transform 0.25s ease',
            transform: `translateX(-${current * (100 / photos.length)}%)`,
            width: `${photos.length * 100}%`,
          }}
        >
          {photos.map((src, i) => (
            <div key={i} style={{ width: `${100 / photos.length}%`, flexShrink: 0 }}>
              <img src={src} width="100%" alt={`Momento ${i + 1}`} />
            </div>
          ))}
        </div>
        <div className="owl-fotos" style={{ marginTop: '12px' }}>
          <div className="owl-dots">
            {photos.map((_, i) => (
              <button
                key={i}
                role="button"
                className={`owl-dot${i === current ? ' active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Foto ${i + 1}`}
              >
                <span />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
