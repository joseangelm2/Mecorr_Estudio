'use client'

import '@/app/rosagold/rosagold.css'
import { useRef } from 'react'
import type { Project } from '@/types/invitation'
import WelcomeModal from '@/components/rosagold/WelcomeModal'
import RosaGoldContent from '@/components/rosagold/RosaGoldContent'
import FloatingMusicToggle from '@/components/FloatingMusicToggle'
import FloatingSectionNav from '@/components/FloatingSectionNav'

const NAV_CANDIDATES = [
  { id: 'portada', label: 'Portada' },
  { id: 'familia', label: 'Familia' },
  { id: 'cuenta-regresiva', label: 'Cuenta Regresiva' },
  { id: 'ubicaciones', label: 'Ubicaciones' },
  { id: 'itinerario', label: 'Itinerario' },
  { id: 'fotos', label: 'Fotos' },
  { id: 'regalos', label: 'Regalos' },
  { id: 'datos-bancarios', label: 'Datos Bancarios' },
  { id: 'hashtag', label: 'Hashtag' },
  { id: 'deseos', label: 'Buzón de Deseos' },
  { id: 'confirmar', label: 'Confirmar Asistencia' },
]

interface Props {
  project: Project
}

export default function RosaGoldTemplate({ project }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)

  function handleEnter() {
    audioRef.current?.play().catch(() => {})
  }

  return (
    <div>
      <audio ref={audioRef} id="background-music" loop preload="auto">
        <source src={project.music_url ?? '/images/esmeralda/musica.mp3'} type="audio/mpeg" />
      </audio>
      {project.show_floating_controls !== false && (
        <>
          <FloatingMusicToggle audioRef={audioRef} colorVar="#ce9e5f" />
          <FloatingSectionNav candidates={NAV_CANDIDATES} colorVar="#ce9e5f" />
        </>
      )}
      <WelcomeModal onEnter={handleEnter} />
      <RosaGoldContent project={project} />
    </div>
  )
}
