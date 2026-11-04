'use client'

import '@/app/bodasilueta/bodasilueta.css'
import { useState, useRef, useEffect } from 'react'
import type { Project } from '@/types/invitation'
import { BODA_THEMES, DEFAULT_BODA_THEME, themeFromColor, themeVars } from '@/lib/bodasilueta-themes'
import { TITULO_FUENTES } from '@/lib/titulo-fuentes'
import { PAPEL_DEFAULT } from '@/lib/bodasilueta-deco'
import EsmeraldaScrollInit from '@/components/esmeralda/EsmeraldaScrollInit'
import BodaSiluetaEnvelope from '@/components/bodasilueta/BodaSiluetaEnvelope'
import BodaSiluetaContent from '@/components/bodasilueta/BodaSiluetaContent'
import BodaSiluetaPetalos from '@/components/bodasilueta/BodaSiluetaPetalos'
import FloatingMusicToggle from '@/components/FloatingMusicToggle'
import FloatingSectionNav from '@/components/FloatingSectionNav'
import StickyBanner from '@/components/StickyBanner'

const NAV_CANDIDATES = [
  { id: 'portada', label: 'Portada' },
  { id: 'cuenta-regresiva', label: 'Cuenta Regresiva' },
  { id: 'familia', label: 'Familia' },
  { id: 'ubicaciones', label: 'Ubicaciones' },
  { id: 'hospedaje', label: 'Hospedaje' },
  { id: 'itinerario', label: 'Itinerario' },
  { id: 'fotos', label: 'Fotos' },
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

export default function BodaSiluetaTemplate({ project }: Props) {
  const [open, setOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const extra = project.extra_config ?? {}

  // Misma personalización que Esmeralda Especial: paleta o color libre, fondo propio, color de
  // títulos (que también tiñe los botones), color del texto de botones, fuente, banner y pie.
  const customColor = (extra.custom_color as string) || ''
  const theme = project.color_theme === 'custom' && customColor
    ? themeFromColor(customColor)
    : BODA_THEMES.find(t => t.id === project.color_theme) ?? DEFAULT_BODA_THEME
  const titulosColor = (extra.titulos_color as string) || ''
  const botonTextoColor = (extra.boton_texto_color as string) || ''
  // Sin fondo propio se usa el papel blanco rugoso (a plena opacidad); con fondo propio, 50% como en el resto.
  const bgPropio = (extra.background_url as string) || ''
  const bgUrl = bgPropio || PAPEL_DEFAULT
  const bgOpacity = Number(extra.bg_opacity ?? (bgPropio ? 50 : 100)) / 100
  const bannerText = (extra.banner_text as string) || ''
  const tituloFuente = TITULO_FUENTES.find(f => f.id === extra.titulo_fuente)
  const petaloCantidad = extra.petalo_cantidad === undefined ? 14 : Number(extra.petalo_cantidad)
  const petaloUrl = (extra.petalo_url as string) || ''

  useEffect(() => {
    const root = document.documentElement
    const vars: Record<string, string> = { ...themeVars(theme), '--bs-bg-opacity': String(bgOpacity) }
    if (bgUrl) vars['--bs-bg-url'] = `url(${bgUrl})`
    if (titulosColor) {
      vars['--bs-titulos-color'] = titulosColor
      vars['--bs-boton-bg'] = titulosColor
      vars['--bs-boton-color'] = botonTextoColor || '#fff'
    } else if (botonTextoColor) {
      vars['--bs-boton-color'] = botonTextoColor
    }
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
    return () => Object.keys(vars).forEach(k => root.style.removeProperty(k))
  }, [theme, bgUrl, bgOpacity, titulosColor, botonTextoColor])

  function handleOpen() {
    setOpen(true)
    audioRef.current?.play().catch(() => {})
  }

  return (
    <div
      className={`t-bodasilueta${bgUrl ? ' bs-con-fondo' : ''}`}
      style={tituloFuente ? ({ '--bs-titulo-font': tituloFuente.css } as React.CSSProperties) : undefined}
    >
      <EsmeraldaScrollInit />
      <audio ref={audioRef} loop preload="auto">
        <source src={project.music_url ?? '/images/love/musica.mp3'} type="audio/mpeg" />
      </audio>
      {project.show_floating_controls !== false && (
        <>
          <FloatingMusicToggle audioRef={audioRef} colorVar="var(--bs-primary, #cb997e)" />
          <FloatingSectionNav candidates={NAV_CANDIDATES} colorVar="var(--bs-primary, #cb997e)" />
        </>
      )}
      {!open && <BodaSiluetaEnvelope onOpen={handleOpen} project={project} />}
      {open && petaloCantidad > 0 && <BodaSiluetaPetalos cantidad={petaloCantidad} imagenUrl={petaloUrl || undefined} />}
      {bannerText && <StickyBanner guestName={bannerText} />}
      <BodaSiluetaContent project={project} />
    </div>
  )
}
