'use client'

import '@/app/magical/magical.css'
import { useState, useRef } from 'react'
import type { Project } from '@/types/invitation'
import MagicalEnvelope from '@/components/magical/MagicalEnvelope'
import MagicalHero from '@/components/magical/MagicalHero'
import MagicalCountdown from '@/components/magical/MagicalCountdown'
import MagicalParents from '@/components/magical/MagicalParents'
import MagicalLocations from '@/components/magical/MagicalLocations'
import MagicalPhotoGrid from '@/components/magical/MagicalPhotoGrid'
import MagicalItinerario from '@/components/magical/MagicalItinerario'
import MagicalGifts from '@/components/magical/MagicalGifts'
import MagicalRSVP from '@/components/magical/MagicalRSVP'
import MagicalFooter from '@/components/magical/MagicalFooter'
import MagicalDecorations from '@/components/magical/MagicalDecorations'
import MagicalScrollInit from '@/components/magical/MagicalScrollInit'
import FloatingMusicToggle from '@/components/FloatingMusicToggle'
import FloatingSectionNav from '@/components/FloatingSectionNav'

const NAV_CANDIDATES = [
  { id: 'portada', label: 'Portada' },
  { id: 'countdown', label: 'Cuenta Regresiva' },
  { id: 'familia', label: 'Familia' },
  { id: 'ubicaciones', label: 'Ubicaciones' },
  { id: 'grid', label: 'Fotos' },
  { id: 'itinerario', label: 'Itinerario' },
  { id: 'regalos', label: 'Regalos' },
  { id: 'confirmar', label: 'Confirmar Asistencia' },
  { id: 'despedida', label: 'Despedida' },
]

const FALLBACK_PHOTOS = [
  '/images/magical/11.jpg',
  '/images/magical/12.jpg',
  '/images/magical/21.jpg',
  '/images/magical/22.jpg',
  '/images/magical/31.jpg',
  '/images/magical/32.jpg',
  '/images/magical/41.jpg',
  '/images/magical/42.jpg',
  '/images/magical/43.jpg',
]

interface Props {
  project: Project
}

export default function MagicalTemplate({ project }: Props) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const photos = project.photos?.length ? project.photos : FALLBACK_PHOTOS

  function handleOpen() {
    setEnvelopeOpen(true)
    audioRef.current?.play().catch(() => {})
  }

  return (
    <div style={{ position: 'relative' }}>
      <MagicalScrollInit />
      <audio ref={audioRef} id="music" loop>
        <source src={project.music_url ?? '/images/magical/musica.mp3'} type="audio/mpeg" />
      </audio>
      <MagicalDecorations />
      {project.show_floating_controls !== false && (
        <>
          <FloatingMusicToggle audioRef={audioRef} colorVar="var(--color-principal, #2d1b69)" />
          <FloatingSectionNav candidates={NAV_CANDIDATES} colorVar="var(--color-principal, #2d1b69)" />
        </>
      )}
      {!envelopeOpen && <MagicalEnvelope onOpen={handleOpen} />}
      <div className="background">
        <div id="portada"><MagicalHero project={project} /></div>
        <MagicalCountdown eventDate={project.event_date} />
        <div id="familia"><MagicalParents project={project} /></div>
        <div id="ubicaciones"><MagicalLocations project={project} /></div>
        <MagicalPhotoGrid photos={photos} />
        {project.show_itinerary && <div id="itinerario"><MagicalItinerario project={project} /></div>}
        <div id="regalos"><MagicalGifts project={project} /></div>
        <div id="confirmar"><MagicalRSVP project={project} /></div>
        <div id="despedida"><MagicalFooter /></div>
      </div>
    </div>
  )
}
