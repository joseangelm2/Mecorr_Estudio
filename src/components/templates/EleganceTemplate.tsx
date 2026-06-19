'use client'

import '@/app/elegance/elegance.css'
import { useState, useRef, useEffect } from 'react'
import type { Project } from '@/types/invitation'
import { ELEGANCE_THEMES, DEFAULT_ELEGANCE_THEME } from '@/lib/elegance-themes'
import EleganceEnvelope from '@/components/elegance/EleganceEnvelope'
import EleganceScrollInit from '@/components/elegance/EleganceScrollInit'
import EleganceDecorations from '@/components/elegance/EleganceDecorations'
import EleganceHero from '@/components/elegance/EleganceHero'
import EleganceParents from '@/components/elegance/EleganceParents'
import EleganceEventDate from '@/components/elegance/EleganceEventDate'
import EleganceLocations from '@/components/elegance/EleganceLocations'
import EleganceGifts from '@/components/elegance/EleganceGifts'
import ElegancePhotoGrid from '@/components/elegance/ElegancePhotoGrid'
import EleganceItinerary from '@/components/elegance/EleganceItinerary'
import EleganceWishes from '@/components/elegance/EleganceWishes'
import EleganceRSVP from '@/components/elegance/EleganceRSVP'
import EleganceFooter from '@/components/elegance/EleganceFooter'
import EleganceVideo from '@/components/elegance/EleganceVideo'

const FALLBACKS = [11, 21, 31, 41, 12, 22, 32, 13, 23, 33]

function getPhotos(project: Project): string[] {
  const photos = project.photos ?? []
  return FALLBACKS.map((fb, i) => photos[i] ?? `/images/elegance/${fb}.jpg`)
}

function GalleryPhoto({ src }: { src: string }) {
  return (
    <div className="foto-con-degradado">
      <img className="foto-full show-p-y" src={src} alt="" />
    </div>
  )
}

interface Props {
  project: Project
}

export default function EleganceTemplate({ project }: Props) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const theme = ELEGANCE_THEMES.find(t => t.id === project.color_theme) ?? DEFAULT_ELEGANCE_THEME

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-principal',    theme.colorPrincipal)
    root.style.setProperty('--bg-color',           theme.bgColor)
    root.style.setProperty('--color-overlay',      theme.overlay)
    root.style.setProperty('--img-filter',         theme.imgFilter)
    root.style.setProperty('--icon-filter',        theme.iconFilter)
    root.style.setProperty('--cuenta-color-fondo', theme.cuentaFondo)
    root.style.setProperty('--nombre-color',       theme.nombreColor)
    root.style.setProperty('--subtitulos-color',   theme.subtitulosColor)
    root.style.setProperty('--textos-color',       theme.textosColor)
    root.style.setProperty('--boton-color',        theme.botonColor)
    root.style.setProperty('--boton-texto-color',  theme.botonTextoColor)
    root.style.setProperty('--cuenta-color-texto', theme.cuentaTexto)
    root.style.setProperty('--cuenta-color-borde', theme.cuentaTexto)
    return () => {
      const vars = [
        '--color-principal', '--bg-color', '--color-overlay', '--img-filter', '--icon-filter', '--cuenta-color-fondo', '--nombre-color',
        '--subtitulos-color', '--textos-color', '--boton-color',
        '--boton-texto-color', '--cuenta-color-texto', '--cuenta-color-borde',
      ]
      vars.forEach(v => root.style.removeProperty(v))
    }
  }, [theme])

  function handleOpen() {
    setEnvelopeOpen(true)
    audioRef.current?.play().catch(() => {})
  }

  const photos = getPhotos(project)
  const hashtag = project.hashtag ?? ''

  return (
    <div style={{ position: 'relative' }}>
      <EleganceScrollInit />
      <audio ref={audioRef} loop>
        <source src={project.music_url ?? '/images/esmeralda/musica.mp3'} type="audio/mpeg" />
      </audio>
      {!envelopeOpen && <EleganceEnvelope onOpen={handleOpen} primaryColor={theme.colorPrincipal} />}
      <EleganceDecorations />
      <div className="contenido">
        <EleganceHero project={project} />
        <GalleryPhoto src={photos[0]} />
        <EleganceParents project={project} />
        <GalleryPhoto src={photos[1]} />
        <EleganceEventDate eventDate={project.event_date} />
        <EleganceLocations project={project} />
        <GalleryPhoto src={photos[2]} />
        <EleganceGifts project={project} />
        <GalleryPhoto src={photos[3]} />
        <ElegancePhotoGrid photos={photos} />
        {project.show_video && (
          <EleganceVideo
            youtubeId={project.video_youtube_id ?? undefined}
            localVideo={project.video_url ?? undefined}
            audioRef={audioRef}
          />
        )}
        {project.show_itinerary && <GalleryPhoto src={photos[4]} />}
        {project.show_itinerary && <EleganceItinerary project={project} />}
        <GalleryPhoto src={photos[5]} />
        <EleganceWishes phone={project.rsvp_phone ?? ''} hashtag={hashtag} dressCodeNotes={project.dress_code?.notes || undefined} />
        <EleganceRSVP project={project} />
        <GalleryPhoto src={photos[6]} />
        <EleganceFooter />
      </div>
    </div>
  )
}
