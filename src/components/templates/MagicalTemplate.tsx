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
      {!envelopeOpen && <MagicalEnvelope onOpen={handleOpen} />}
      <div className="background">
        <MagicalHero project={project} />
        <MagicalCountdown eventDate={project.event_date} />
        <MagicalParents project={project} />
        <MagicalLocations project={project} />
        <MagicalPhotoGrid photos={photos} />
        {project.show_itinerary && <MagicalItinerario project={project} />}
        <MagicalGifts project={project} />
        <MagicalRSVP project={project} />
        <MagicalFooter />
      </div>
    </div>
  )
}
