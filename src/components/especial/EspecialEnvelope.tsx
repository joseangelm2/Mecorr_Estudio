'use client'

import { useRef } from 'react'

interface Props {
  musicUrl?: string
  onOpen?: () => void
}

export default function EspecialEnvelope({ musicUrl, onOpen }: Props) {
  const introRef = useRef<HTMLElement>(null)
  const sDerechoRef = useRef<HTMLImageElement>(null)
  const sIzquierdoRef = useRef<HTMLImageElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  function openEnvelope() {
    introRef.current?.classList.add('desaparecer')
    sDerechoRef.current?.classList.add('efecto-derecha')
    sIzquierdoRef.current?.classList.add('efecto-izquierda')
    document.documentElement.classList.add('con-scroll')
    audioRef.current?.play().catch(() => {})
    onOpen?.()
  }

  return (
    <>
      {musicUrl && (
        <audio ref={audioRef} loop preload="auto" src={musicUrl} />
      )}
      <section ref={introRef} id="intro" className="bg-overlay-intro bg-intro">
        <img ref={sDerechoRef} id="s-derecho" className="sobre-derecho" src="/images/sobre-derecho.png" alt="" />
        <img ref={sIzquierdoRef} id="s-izquierdo" className="sobre-izquierdo" src="/images/sobre-izquierdo.png" alt="" />
        <button
          onClick={openEnvelope}
          style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, position: 'absolute', top: '45%', left: '40%', zIndex: 99999 }}
          aria-label="Abrir invitación"
        >
          <img className="sello-img" src="/images/sello.png" alt="Abrir" style={{ width: '120px', animation: 'pulse 4000ms infinite' }} />
        </button>
      </section>
    </>
  )
}
