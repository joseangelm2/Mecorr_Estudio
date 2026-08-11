'use client'

import { useRef } from 'react'

interface Props {
  onSealClick?: () => void
  onOpen?: () => void
  sealUrl?: string
  envelopeRightUrl?: string
  envelopeLeftUrl?: string
  sealOffsetX?: number
  sealOffsetY?: number
}

export default function EspecialEnvelope({ onSealClick, onOpen, sealUrl = '/images/sello.png', envelopeRightUrl = '/images/sobre-derecho.png', envelopeLeftUrl = '/images/sobre-izquierdo.png', sealOffsetX = 0, sealOffsetY = 0 }: Props) {
  const introRef = useRef<HTMLElement>(null)
  const sDerechoRef = useRef<HTMLImageElement>(null)
  const sIzquierdoRef = useRef<HTMLImageElement>(null)

  function openEnvelope() {
    onSealClick?.()
    introRef.current?.classList.add('desaparecer')
    sDerechoRef.current?.classList.add('efecto-derecha')
    sIzquierdoRef.current?.classList.add('efecto-izquierda')
    document.documentElement.classList.add('con-scroll')
    window.scrollTo(0, 0)
    setTimeout(() => onOpen?.(), 3000)
  }

  return (
    <section ref={introRef} id="intro" className="bg-overlay-intro bg-intro">
      <img ref={sDerechoRef} id="s-derecho" className="sobre-derecho" src={envelopeRightUrl} alt="" />
      <img ref={sIzquierdoRef} id="s-izquierdo" className="sobre-izquierdo" src={envelopeLeftUrl} alt="" />
      <button
        onClick={openEnvelope}
        style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, position: 'absolute', top: '45%', left: '40%', transform: `translate(${sealOffsetX}px, ${sealOffsetY}px)`, zIndex: 99999 }}
        aria-label="Abrir invitación"
      >
        <img className="sello-img" src={sealUrl} alt="Abrir" style={{ width: '120px', animation: 'pulse 4000ms infinite' }} />
      </button>
    </section>
  )
}
