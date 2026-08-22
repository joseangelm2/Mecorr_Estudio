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
import FloatingMusicToggle from '@/components/FloatingMusicToggle'
import FloatingSectionNav from '@/components/FloatingSectionNav'

const NAV_CANDIDATES = [
  { id: 'portada', label: 'Portada' },
  { id: 'familia', label: 'Familia' },
  { id: 'cuenta-regresiva', label: 'Cuenta Regresiva' },
  { id: 'ubicaciones', label: 'Ubicaciones' },
  { id: 'regalos', label: 'Regalos' },
  { id: 'album', label: 'Álbum de Fotos' },
  { id: 'video', label: 'Video' },
  { id: 'itinerario', label: 'Itinerario' },
  { id: 'deseos', label: 'Buzón de Deseos' },
  { id: 'confirmar', label: 'Confirmar Asistencia' },
  { id: 'despedida', label: 'Despedida' },
]

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

  const hashtag = project.hashtag ?? ''

  return (
    <div style={{ position: 'relative' }}>
      <EleganceScrollInit />
      <audio ref={audioRef} loop>
        <source src={project.music_url ?? '/images/esmeralda/musica.mp3'} type="audio/mpeg" />
      </audio>
      {!envelopeOpen && <EleganceEnvelope onOpen={handleOpen} primaryColor={theme.colorPrincipal} />}
      {project.show_floating_controls !== false && (
        <>
          <FloatingMusicToggle audioRef={audioRef} colorVar="var(--color-principal, #b08968)" />
          <FloatingSectionNav candidates={NAV_CANDIDATES} colorVar="var(--color-principal, #b08968)" />
        </>
      )}
      <EleganceDecorations />
      <div className="contenido">
        <div id="portada">
          <EleganceHero project={project} />
          {(project.extra_config?.photo_after_hero as string) && <GalleryPhoto src={project.extra_config.photo_after_hero as string} />}
        </div>
        <div id="familia">
          <EleganceParents project={project} />
          {(project.extra_config?.photo_after_parents as string) && <GalleryPhoto src={project.extra_config.photo_after_parents as string} />}
        </div>
        <div id="cuenta-regresiva">
          <EleganceEventDate eventDate={project.event_date} />
        </div>
        <div id="ubicaciones">
          <EleganceLocations project={project} />
          {(project.extra_config?.photo_after_locations as string) && <GalleryPhoto src={project.extra_config.photo_after_locations as string} />}
        </div>
        <div id="regalos">
          <EleganceGifts project={project} />
          {(project.extra_config?.photo_after_gifts as string) && <GalleryPhoto src={project.extra_config.photo_after_gifts as string} />}
        </div>
        {(project.extra_config?.show_album as boolean) && (
          <div id="album">
            <ElegancePhotoGrid
              gridRetrato={(project.extra_config?.grid_retrato as string[]) ?? []}
              gridHorizontal={(project.extra_config?.grid_horizontal as string[]) ?? []}
            />
          </div>
        )}
        {project.show_video && (
          <div id="video">
            <EleganceVideo
              youtubeId={project.video_youtube_id ?? undefined}
              localVideo={project.video_url ?? undefined}
              audioRef={audioRef}
            />
          </div>
        )}
        {project.show_itinerary && project.itinerary.length > 0 && (
          <div id="itinerario">
            {(project.extra_config?.photo_before_itinerary as string) && <GalleryPhoto src={project.extra_config.photo_before_itinerary as string} />}
            <EleganceItinerary project={project} />
          </div>
        )}
        {(project.extra_config?.photo_after_itinerary as string) && <GalleryPhoto src={project.extra_config.photo_after_itinerary as string} />}
        <div id="deseos">
          <EleganceWishes phone={project.rsvp_phone ?? ''} hashtag={hashtag} mode={project.instagram_mode} slug={project.slug} dressCodeNotes={project.dress_code?.notes || undefined} showInstagramAlbum={project.show_instagram_album} />
        </div>
        <EleganceRSVP project={project} />
        {(project.extra_config?.photo_after_rsvp as string) && <GalleryPhoto src={project.extra_config.photo_after_rsvp as string} />}
        <div id="despedida">
          <EleganceFooter />
        </div>
      </div>
    </div>
  )
}
