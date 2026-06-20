'use client'

import { useRef } from 'react'

interface Props {
  onOpen?: () => void
  sealUrl?: string
}

export default function EspecialEnvelope({ onOpen, sealUrl = '/images/sello.png' }: Props) {
  const introRef = useRef<HTMLElement>(null)
  const sDerechoRef = useRef<HTMLImageElement>(null)
  const sIzquierdoRef = useRef<HTMLImageElement>(null)

  function openEnvelope() {
    introRef.current?.classList.add('desaparecer')
    sDerechoRef.current?.classList.add('efecto-derecha')
    sIzquierdoRef.current?.classList.add('efecto-izquierda')
    document.documentElement.classList.add('con-scroll')
    window.scrollTo(0, 0)
    onOpen?.()
  }

  return (
    <section ref={introRef} id="intro" className="bg-overlay-intro bg-intro">
      <img ref={sDerechoRef} id="s-derecho" className="sobre-derecho" src="/images/sobre-derecho.png" alt="" />
      <img ref={sIzquierdoRef} id="s-izquierdo" className="sobre-izquierdo" src="/images/sobre-izquierdo.png" alt="" />
      <button
        onClick={openEnvelope}
        style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, position: 'absolute', top: '45%', left: '40%', zIndex: 99999 }}
        aria-label="Abrir invitación"
      >
        <img className="sello-img" src={sealUrl} alt="Abrir" style={{ width: '120px', animation: 'pulse 4000ms infinite' }} />
      </button>
    </section>
  )
}
