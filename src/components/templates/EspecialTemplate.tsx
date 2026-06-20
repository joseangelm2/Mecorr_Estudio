'use client'

import '@/app/especial/especial.css'
import { useState, useRef, useEffect } from 'react'
import type { Project } from '@/types/invitation'
import { ESPECIAL_THEMES, DEFAULT_ESPECIAL_THEME } from '@/lib/especial-themes'
import EspecialScrollInit from '@/components/especial/EspecialScrollInit'
import EspecialEnvelope from '@/components/especial/EspecialEnvelope'
import EspecialHero from '@/components/especial/EspecialHero'
import EspecialParents from '@/components/especial/EspecialParents'
import EspecialEventDate from '@/components/especial/EspecialEventDate'
import EspecialLocations from '@/components/especial/EspecialLocations'
import EspecialItinerary from '@/components/especial/EspecialItinerary'
import EspecialDressCode from '@/components/especial/EspecialDressCode'
import EspecialHashtag from '@/components/especial/EspecialHashtag'
import EspecialPhotos from '@/components/especial/EspecialPhotos'
import EspecialVideo from '@/components/especial/EspecialVideo'
import EspecialGifts from '@/components/especial/EspecialGifts'
import EspecialRSVP from '@/components/especial/EspecialRSVP'
import EspecialFooter from '@/components/especial/EspecialFooter'
import StickyBanner from '@/components/StickyBanner'

interface Props {
  project: Project
}

export default function EspecialTemplate({ project }: Props) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const theme = ESPECIAL_THEMES.find(t => t.id === project.color_theme) ?? DEFAULT_ESPECIAL_THEME

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--inv-primary',       theme.primary)
    root.style.setProperty('--inv-primary-dark',  theme.primaryDark)
    root.style.setProperty('--inv-primary-light', theme.primaryLight)
    root.style.setProperty('--inv-border',        theme.primary)
    root.style.setProperty('--inv-filter',        theme.filterValue)
    root.style.setProperty('--inv-filter-light',  theme.filterLight)
    return () => {
      const vars = ['--inv-primary', '--inv-primary-dark', '--inv-primary-light', '--inv-border', '--inv-filter', '--inv-filter-light']
      vars.forEach(v => root.style.removeProperty(v))
    }
  }, [theme])

  function handleOpen() {
    setEnvelopeOpen(true)
  }

  return (
    <div>
      <EspecialScrollInit />
      <audio ref={audioRef} loop>
        <source src={project.music_url ?? '/images/esmeralda/musica.mp3'} type="audio/mpeg" />
      </audio>
      {!envelopeOpen && (
        <EspecialEnvelope
          musicUrl={project.music_url ?? undefined}
          onOpen={handleOpen}
        />
      )}
      <StickyBanner guestName={project.guest_name ?? project.quinceanera_name} />
      <EspecialHero project={project} />
      <EspecialParents project={project} />
      <EspecialEventDate eventDate={project.event_date} />
      <EspecialLocations project={project} />
      {project.show_itinerary && <EspecialItinerary project={project} />}
      {project.dress_code && <EspecialDressCode project={project} />}
      {project.hashtag && <EspecialHashtag hashtag={project.hashtag} />}
      {project.photos.length > 0 && <EspecialPhotos photos={project.photos} />}
      {project.show_video && (
        <EspecialVideo
          youtubeId={project.video_youtube_id ?? undefined}
          localVideo={project.video_url ?? undefined}
          audioRef={audioRef}
        />
      )}
      <EspecialGifts project={project} />
      <EspecialRSVP project={project} />
      <EspecialFooter project={project} />
    </div>
  )
}
