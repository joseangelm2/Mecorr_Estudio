'use client'

import '@/app/sellorosa/sellorosa.css'
import { useState, useRef } from 'react'
import type { Project } from '@/types/invitation'
import EsmeraldaScrollInit from '@/components/esmeralda/EsmeraldaScrollInit'
import SelloRosaEnvelope from '@/components/sellorosa/SelloRosaEnvelope'
import SelloRosaContent from '@/components/sellorosa/SelloRosaContent'
import FloatingMusicToggle from '@/components/FloatingMusicToggle'
import FloatingSectionNav from '@/components/FloatingSectionNav'

const NAV_CANDIDATES = [
  { id: 'portada', label: 'Portada' },
  { id: 'cuenta-regresiva', label: 'Cuenta Regresiva' },
  { id: 'familia', label: 'Familia' },
  { id: 'ubicaciones', label: 'Ubicaciones' },
  { id: 'itinerario', label: 'Itinerario' },
  { id: 'vestimenta', label: 'Vestimenta' },
  { id: 'regalos', label: 'Regalos' },
  { id: 'lluvia-sobres', label: 'Lluvia de Sobres' },
  { id: 'datos-bancarios', label: 'Datos Bancarios' },
  { id: 'hashtag', label: 'Hashtag' },
  { id: 'confirmar', label: 'Confirmar Asistencia' },
]

interface Props {
  project: Project
}

export default function SelloRosaTemplate({ project }: Props) {
  const [open, setOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  function handleOpen() {
    setOpen(true)
    audioRef.current?.play().catch(() => {})
  }

  return (
    <div>
      <EsmeraldaScrollInit />
      <audio ref={audioRef} loop preload="auto">
        <source src={project.music_url ?? '/images/esmeralda/musica.mp3'} type="audio/mpeg" />
      </audio>
      {project.show_floating_controls !== false && (
        <>
          <FloatingMusicToggle audioRef={audioRef} colorVar="#cb997e" />
          <FloatingSectionNav candidates={NAV_CANDIDATES} colorVar="#cb997e" />
        </>
      )}
      {!open && <SelloRosaEnvelope onOpen={handleOpen} />}
      <SelloRosaContent project={project} />
    </div>
  )
}
