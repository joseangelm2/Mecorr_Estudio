'use client'

import '@/app/cenicienta/cenicienta.css'
import { useState, useRef, useEffect } from 'react'
import type { Project } from '@/types/invitation'
import { CENICIENTA_THEMES, DEFAULT_CENICIENTA_THEME } from '@/lib/cenicienta-themes'
import CenicientaEnvelope from '@/components/cenicienta/CenicientaEnvelope'
import CenicientaScrollInit from '@/components/cenicienta/CenicientaScrollInit'
import CenicientaDecorations from '@/components/cenicienta/CenicientaDecorations'
import CenicientaHero from '@/components/cenicienta/CenicientaHero'
import CenicientaParents from '@/components/cenicienta/CenicientaParents'
import CenicientaEventDate from '@/components/cenicienta/CenicientaEventDate'
import CenicientaLocations from '@/components/cenicienta/CenicientaLocations'
import CenicientaGifts from '@/components/cenicienta/CenicientaGifts'
import CenicientaPhotoGrid from '@/components/cenicienta/CenicientaPhotoGrid'
import CenicientaItinerary from '@/components/cenicienta/CenicientaItinerary'
import CenicientaWishes from '@/components/cenicienta/CenicientaWishes'
import CenicientaRSVP from '@/components/cenicienta/CenicientaRSVP'
import CenicientaFooter from '@/components/cenicienta/CenicientaFooter'

const FALLBACKS = [11, 21, 31, 41, 12, 22, 32]

function getPhotos(project: Project): string[] {
  const photos = project.photos ?? []
  return FALLBACKS.map((fb, i) => photos[i] ?? `/images/cenicienta/${fb}.jpg`)
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

export default function CenicientaTemplate({ project }: Props) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const theme = CENICIENTA_THEMES.find(t => t.id === project.color_theme) ?? DEFAULT_CENICIENTA_THEME

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
      <CenicientaScrollInit />
      <audio ref={audioRef} loop>
        <source src={project.music_url ?? '/images/esmeralda/musica.mp3'} type="audio/mpeg" />
      </audio>
      {!envelopeOpen && <CenicientaEnvelope onOpen={handleOpen} primaryColor={theme.colorPrincipal} />}
      <CenicientaDecorations />
      <div className="contenido">
        <CenicientaHero project={project} />
        <GalleryPhoto src={photos[0]} />
        <CenicientaParents project={project} />
        <GalleryPhoto src={photos[1]} />
        <CenicientaEventDate eventDate={project.event_date} />
        <CenicientaLocations project={project} />
        <GalleryPhoto src={photos[2]} />
        <CenicientaGifts project={project} />
        <GalleryPhoto src={photos[3]} />
        <CenicientaPhotoGrid photos={photos} />
        {project.show_itinerary && <GalleryPhoto src={photos[4]} />}
        {project.show_itinerary && <CenicientaItinerary project={project} />}
        <GalleryPhoto src={photos[5]} />
        <CenicientaWishes phone={project.rsvp_phone ?? ''} hashtag={hashtag} dressCodeNotes={project.dress_code?.notes || undefined} />
        <CenicientaRSVP project={project} />
        <GalleryPhoto src={photos[6]} />
        <CenicientaFooter />
      </div>
    </div>
  )
}
