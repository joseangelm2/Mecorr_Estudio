'use client'
import { useState, useEffect } from 'react'

interface Props {
  gridRetrato: string[]
  gridHorizontal: string[]
}

function CrossfadeSlider({ slides, aspectRatio }: { slides: string[]; aspectRatio: string }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const id = setInterval(() => setIdx(prev => (prev + 1) % slides.length), 4000)
    return () => clearInterval(id)
  }, [slides.length])

  if (!slides.length) return null

  return (
    <div style={{
      position: 'relative',
      width: '90%',
      margin: '3vw auto',
      borderRadius: '2vw',
      overflow: 'hidden',
      aspectRatio,
    }}>
      {slides.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          style={{
            position: i === 0 ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: idx === i ? 1 : 0,
            transition: 'opacity 1s ease',
            zIndex: idx === i ? 1 : 0,
          }}
        />
      ))}
    </div>
  )
}

export default function ElegancePhotoGrid({ gridRetrato, gridHorizontal }: Props) {
  const section1 = gridRetrato.filter(Boolean)
  const section2 = gridHorizontal.filter(Boolean)

  if (!section1.length && !section2.length) return null

  return (
    <>
      <div className="encabezado">
        <h3 style={{
          fontFamily: "var(--font-tangerine, 'Tangerine', serif)",
          fontSize: '10vw',
          color: 'var(--subtitulos-color)',
          textAlign: 'center',
          margin: '5% 0 4vw',
        }}>Álbum de fotos</h3>
      </div>
      {section1.length > 0 && <CrossfadeSlider slides={section1} aspectRatio="3/4" />}
      {section2.length > 0 && <CrossfadeSlider slides={section2} aspectRatio="16/9" />}
    </>
  )
}
