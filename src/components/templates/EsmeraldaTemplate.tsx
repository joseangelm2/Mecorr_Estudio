'use client'

import '@/app/esmeralda/esmeralda.css'
import { useState, useRef } from 'react'
import type { Project } from '@/types/invitation'
import EnvelopeSobre from '@/components/esmeralda/EnvelopeSobre'
import EsmeraldaHero from '@/components/esmeralda/EsmeraldaHero'
import EsmeraldaCountdown from '@/components/esmeralda/EsmeraldaCountdown'
import EsmeraldaParents from '@/components/esmeralda/EsmeraldaParents'
import EsmeraldaLocations from '@/components/esmeralda/EsmeraldaLocations'
import EsmeraldaPhotoGrid from '@/components/esmeralda/EsmeraldaPhotoGrid'
import EsmeraldaItinerario from '@/components/esmeralda/EsmeraldaItinerario'
import EsmeraldaGifts from '@/components/esmeralda/EsmeraldaGifts'
import EsmeraldaRSVP from '@/components/esmeralda/EsmeraldaRSVP'
import EsmeraldaFooter from '@/components/esmeralda/EsmeraldaFooter'
import EsmeraldaDecorations from '@/components/esmeralda/EsmeraldaDecorations'
import EsmeraldaScrollInit from '@/components/esmeralda/EsmeraldaScrollInit'
import FloatingMusicToggle from '@/components/FloatingMusicToggle'
import FloatingSectionNav from '@/components/FloatingSectionNav'

const NAV_CANDIDATES = [
  { id: 'portada', label: 'Portada' },
  { id: 'familia', label: 'Familia' },
  { id: 'countdown', label: 'Cuenta Regresiva' },
  { id: 'ubicaciones', label: 'Ubicaciones' },
  { id: 'grid', label: 'Fotos' },
  { id: 'itinerario', label: 'Itinerario' },
  { id: 'regalos', label: 'Regalos' },
  { id: 'confirmar', label: 'Confirmar Asistencia' },
  { id: 'despedida', label: 'Despedida' },
]

interface Props {
  project: Project
}

export default function EsmeraldaTemplate({ project }: Props) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  function handleOpen() {
    setEnvelopeOpen(true)
    audioRef.current?.play().catch(() => {})
  }

  return (
    <div style={{ position: 'relative' }}>
      <EsmeraldaScrollInit />
      <audio ref={audioRef} id="music" loop>
        <source src={project.music_url ?? '/images/esmeralda/musica.mp3'} type="audio/mpeg" />
      </audio>
      <EsmeraldaDecorations />
      {project.show_floating_controls !== false && (
        <>
          <FloatingMusicToggle audioRef={audioRef} colorVar="var(--color-principal, #098074)" />
          <FloatingSectionNav candidates={NAV_CANDIDATES} colorVar="var(--color-principal, #098074)" />
        </>
      )}
      {!envelopeOpen && <EnvelopeSobre onOpen={handleOpen} />}
      <div className="background">
        <div id="portada"><EsmeraldaHero project={project} /></div>
        <EsmeraldaCountdown eventDate={project.event_date} />
        <div id="familia"><EsmeraldaParents project={project} /></div>
        <div id="ubicaciones"><EsmeraldaLocations project={project} /></div>
        <EsmeraldaPhotoGrid photos={project.photos} />
        <div id="itinerario"><EsmeraldaItinerario project={project} /></div>
        <div id="regalos"><EsmeraldaGifts project={project} /></div>
        <div id="confirmar"><EsmeraldaRSVP project={project} /></div>
        <div id="despedida"><EsmeraldaFooter /></div>
      </div>
    </div>
  )
}
