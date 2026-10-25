'use client'

import { useEffect, useRef } from 'react'
import FloatingMusicToggle from '@/components/FloatingMusicToggle'
import FloatingSectionNav, { type NavCandidate } from '@/components/FloatingSectionNav'

interface Props {
  candidates: NavCandidate[]
  colorVar?: string
}

// Botones flotantes (menú de secciones + silenciar música) para las páginas demo.
// Las demos tienen su <audio> dentro de cada página/sobre, así que se busca en el DOM
// en vez de recibir un ref (las plantillas reales sí pasan su propio audioRef).
export default function DemoFloatingControls({ candidates, colorVar }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = document.querySelector('audio')
  }, [])

  return (
    <>
      <FloatingMusicToggle audioRef={audioRef} colorVar={colorVar} />
      <FloatingSectionNav candidates={candidates} colorVar={colorVar} />
    </>
  )
}
