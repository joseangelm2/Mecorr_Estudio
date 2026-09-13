'use client'

import '@/app/esmeralda/esmeralda.css'
import { useState, useRef, useEffect } from 'react'
import type { Project } from '@/types/invitation'
import { ESMERALDA_THEMES, DEFAULT_ESMERALDA_THEME } from '@/lib/esmeralda-themes'
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
  const theme = ESMERALDA_THEMES.find(t => t.id === project.color_theme) ?? DEFAULT_ESMERALDA_THEME

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-principal', theme.colorPrincipal)
    root.style.setProperty('--color-elementos', theme.colorElementos)
    root.style.setProperty('--color-overlay', theme.colorOverlay)
    root.style.setProperty('--nombre-color', theme.nombreColor)
    root.style.setProperty('--subtitulos-color', theme.subtitulosColor)
    root.style.setProperty('--itinerario-card-color', theme.itinerarioCardColor)
    root.style.setProperty('--line-sobre', theme.lineSobre)
    root.style.setProperty('--text-sello-shadow1', theme.selloShadow1)
    root.style.setProperty('--text-sello-shadow2', theme.selloShadow2)
    root.style.setProperty('--button-background-color', theme.colorElementos)
    return () => {
      const vars = [
        '--color-principal', '--color-elementos', '--color-overlay', '--nombre-color',
        '--subtitulos-color', '--itinerario-card-color', '--line-sobre',
        '--text-sello-shadow1', '--text-sello-shadow2', '--button-background-color',
      ]
      vars.forEach(v => root.style.removeProperty(v))
    }
  }, [theme])

  function handleOpen() {
    setEnvelopeOpen(true)
    audioRef.current?.play().catch(() => {})
  }

  const hasFamilia = project.parent_names.filter(Boolean).length > 0 || project.padrinos.filter(Boolean).length > 0
  const hasUbicaciones = Boolean(project.ceremony || project.reception)
  const hasItinerario = project.show_itinerary && project.itinerary.length > 0

  return (
    <div style={{ position: 'relative', overflow: 'clip' }}>
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
        {hasFamilia && <div id="familia"><EsmeraldaParents project={project} /></div>}
        {hasUbicaciones && <div id="ubicaciones"><EsmeraldaLocations project={project} /></div>}
        <EsmeraldaPhotoGrid photos={project.photos} />
        {hasItinerario && <div id="itinerario"><EsmeraldaItinerario project={project} /></div>}
        <div id="regalos"><EsmeraldaGifts project={project} /></div>
        <div id="confirmar"><EsmeraldaRSVP project={project} /></div>
        <div id="despedida"><EsmeraldaFooter /></div>
      </div>
    </div>
  )
}
