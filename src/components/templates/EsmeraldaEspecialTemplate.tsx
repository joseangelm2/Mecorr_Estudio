'use client'

import '@/app/esmeralda-especial/esmeralda-especial.css'
import { useState, useRef, useEffect } from 'react'
import type { Project } from '@/types/invitation'
import { ESMERALDA_THEMES, DEFAULT_ESMERALDA_THEME } from '@/lib/esmeralda-themes'
import { shadeHex, hexToRgbTriplet } from '@/lib/color'
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
import StickyBanner from '@/components/StickyBanner'
import { TITULO_FUENTES } from '@/lib/titulo-fuentes'

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

export default function EsmeraldaEspecialTemplate({ project }: Props) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Mismo patrón de color personalizado que Zafiro/Especial: el morado base de
  // cada preset es "<color> Dorado", así que el acento dorado (nombreColor /
  // subtitulosColor) se mantiene fijo y solo se deriva el resto del color elegido.
  const customColor = (project.extra_config?.custom_color as string) || ''
  const theme = project.color_theme === 'custom' && customColor
    ? {
        id: 'custom',
        label: 'Personalizado',
        swatch: customColor,
        colorPrincipal: customColor,
        colorElementos: `rgb(${hexToRgbTriplet(shadeHex(customColor, 25))})`,
        colorOverlay: `rgba(${hexToRgbTriplet(customColor)}, 0.6)`,
        nombreColor: '#BA8100',
        subtitulosColor: '#F7BB52',
        itinerarioCardColor: `rgba(${hexToRgbTriplet(shadeHex(customColor, -40))}, 0.15)`,
        lineSobre: shadeHex(customColor, 40),
        selloShadow1: `rgba(${hexToRgbTriplet(shadeHex(customColor, 40))}, 0.7)`,
        selloShadow2: `rgba(${hexToRgbTriplet(shadeHex(customColor, 60))}, 0.5)`,
      }
    : ESMERALDA_THEMES.find(t => t.id === project.color_theme) ?? DEFAULT_ESMERALDA_THEME

  const bgUrl = (project.extra_config?.background_url as string) || ''
  const bgOpacity = Number(project.extra_config?.bg_opacity ?? 50) / 100
  const envelopeImageUrl = (project.extra_config?.envelope_right_url as string) || ''
  const bannerText = (project.extra_config?.banner_text as string) || ''
  const footerText = (project.extra_config?.footer_text as string) || ''
  // Color de títulos — opcional, independiente del tema. Cuando está presente,
  // reemplaza el dorado fijo de los h2 de sección (Mis Padres, Padrinos, Datos
  // Bancarios, etc.), el h1 "event" y el nombre de la quinceañera (.person-name),
  // y además tiñe el fondo de los botones (.button, degradado dorado por defecto).
  const titulosColor = (project.extra_config?.titulos_color as string) || ''
  const subtitulosColor = titulosColor || theme.subtitulosColor
  const nombreColorFinal = titulosColor || theme.nombreColor
  // Color de texto de los botones — independiente del color de fondo de arriba.
  const botonTextoColor = (project.extra_config?.boton_texto_color as string) || ''
  // Fuente de títulos (h1/h2). Se pone en el div raíz y no en :root porque las
  // variables --font-* las define el layout de /i/[slug], no el <html>.
  const tituloFuente = TITULO_FUENTES.find(f => f.id === project.extra_config?.titulo_fuente)

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-principal', theme.colorPrincipal)
    root.style.setProperty('--color-elementos', theme.colorElementos)
    root.style.setProperty('--color-overlay', theme.colorOverlay)
    root.style.setProperty('--nombre-color', nombreColorFinal)
    root.style.setProperty('--subtitulos-color', subtitulosColor)
    root.style.setProperty('--itinerario-card-color', theme.itinerarioCardColor)
    root.style.setProperty('--line-sobre', theme.lineSobre)
    root.style.setProperty('--text-sello-shadow1', theme.selloShadow1)
    root.style.setProperty('--text-sello-shadow2', theme.selloShadow2)
    root.style.setProperty('--button-background-color', theme.colorElementos)
    root.style.setProperty('--esp-bg-opacity', String(bgOpacity))
    if (bgUrl) {
      root.style.setProperty('--esp-bg-url', `url(${bgUrl})`)
    }
    if (titulosColor) {
      root.style.setProperty('--esp-boton-bg', titulosColor)
      root.style.setProperty('--esp-boton-color', botonTextoColor || '#fff')
    } else if (botonTextoColor) {
      root.style.setProperty('--esp-boton-color', botonTextoColor)
    }
    return () => {
      const vars = [
        '--color-principal', '--color-elementos', '--color-overlay', '--nombre-color',
        '--subtitulos-color', '--itinerario-card-color', '--line-sobre',
        '--text-sello-shadow1', '--text-sello-shadow2', '--button-background-color',
        '--esp-bg-opacity', '--esp-bg-url', '--esp-boton-bg', '--esp-boton-color',
      ]
      vars.forEach(v => root.style.removeProperty(v))
    }
  }, [theme, bgUrl, bgOpacity, titulosColor, subtitulosColor, nombreColorFinal, botonTextoColor])

  function handleOpen() {
    setEnvelopeOpen(true)
    audioRef.current?.play().catch(() => {})
  }

  const hasFamilia = project.parent_names.filter(Boolean).length > 0 || project.padrinos.filter(Boolean).length > 0
  const hasUbicaciones = Boolean(project.ceremony || project.reception)
  const hasItinerario = project.show_itinerary && project.itinerary.length > 0

  return (
    <div className="t-esmeralda-especial" style={{ position: 'relative', overflow: 'clip', ...(tituloFuente ? ({ '--esp-titulo-font': tituloFuente.css } as React.CSSProperties) : {}) }}>
      <EsmeraldaScrollInit />
      <audio ref={audioRef} id="music" loop>
        <source src={project.music_url ?? '/images/love/musica.mp3'} type="audio/mpeg" />
      </audio>
      <EsmeraldaDecorations project={project} />
      {project.show_floating_controls !== false && (
        <>
          <FloatingMusicToggle audioRef={audioRef} colorVar="var(--color-principal, #098074)" />
          <FloatingSectionNav candidates={NAV_CANDIDATES} colorVar="var(--color-principal, #098074)" />
        </>
      )}
      {!envelopeOpen && <EnvelopeSobre onOpen={handleOpen} imageUrl={envelopeImageUrl || undefined} />}
      {bannerText && <StickyBanner guestName={bannerText} />}
      <div className="background">
        <div id="portada"><EsmeraldaHero project={project} /></div>
        <EsmeraldaCountdown eventDate={project.event_date} project={project} />
        {hasFamilia && <div id="familia"><EsmeraldaParents project={project} /></div>}
        {hasUbicaciones && <div id="ubicaciones"><EsmeraldaLocations project={project} /></div>}
        <EsmeraldaPhotoGrid photos={project.photos} />
        {hasItinerario && <div id="itinerario"><EsmeraldaItinerario project={project} /></div>}
        <div id="regalos"><EsmeraldaGifts project={project} /></div>
        <div id="confirmar"><EsmeraldaRSVP project={project} /></div>
        <div id="despedida">
          {footerText && (
            <p className="mensaje texto no-print" style={{ textAlign: 'center' }}>{footerText}</p>
          )}
          <EsmeraldaFooter />
        </div>
      </div>
    </div>
  )
}
