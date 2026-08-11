'use client'

import '@/app/especial/especial.css'
import { useState, useRef, useEffect } from 'react'
import type { Project } from '@/types/invitation'
import { ESPECIAL_THEMES, DEFAULT_ESPECIAL_THEME } from '@/lib/especial-themes'
import { hexToFilter, shadeHex } from '@/lib/color'
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
  const customColor = (project.extra_config?.custom_color as string) || ''
  const theme = project.color_theme === 'custom' && customColor
    ? {
        id: 'custom',
        label: 'Personalizado',
        swatch: customColor,
        primary: customColor,
        primaryDark: shadeHex(customColor, -12),
        primaryLight: shadeHex(customColor, 15),
        filterValue: hexToFilter(customColor),
        filterLight: '',
      }
    : ESPECIAL_THEMES.find(t => t.id === project.color_theme) ?? DEFAULT_ESPECIAL_THEME
  const bgUrl = (project.extra_config?.background_url as string) || null
  const decorationSrc = (project.extra_config?.decoration_url as string) || '/images/flores-01.png'
  const sealUrl = (project.extra_config?.seal_url as string) || '/images/sello.png'
  const sealFilter = (project.extra_config?.seal_filter as string) ?? ''
  const sealOffsetX = Number(project.extra_config?.seal_offset_x) || 0
  const sealOffsetY = Number(project.extra_config?.seal_offset_y) || 0
  const bgOpacity = Number(project.extra_config?.bg_opacity ?? 50) / 100
  const envelopeRightUrl = (project.extra_config?.envelope_right_url as string) || '/images/sobre-derecho.png'
  const envelopeLeftUrl  = (project.extra_config?.envelope_left_url  as string) || '/images/sobre-izquierdo.png'
  const showDressCode = Boolean(project.dress_code) || project.extra_config?.show_dress_palette === true

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--inv-primary',       theme.primary)
    root.style.setProperty('--inv-primary-dark',  theme.primaryDark)
    root.style.setProperty('--inv-primary-light', theme.primaryLight)
    root.style.setProperty('--inv-border',        theme.primary)
    root.style.setProperty('--inv-filter',        theme.filterValue)
    root.style.setProperty('--inv-seal-filter',   sealFilter !== '' ? sealFilter : theme.filterValue)
    root.style.setProperty('--inv-bg-opacity',    String(bgOpacity))
    if (bgUrl) {
      root.style.setProperty('--inv-bg-url', `url(${bgUrl})`)
    }
    return () => {
      const vars = ['--inv-primary', '--inv-primary-dark', '--inv-primary-light', '--inv-border', '--inv-filter', '--inv-seal-filter', '--inv-bg-opacity', '--inv-bg-url']
      vars.forEach(v => root.style.removeProperty(v))
    }
  }, [theme, bgUrl, sealFilter, bgOpacity])

  return (
    <div>
      <EspecialScrollInit />
      <audio ref={audioRef} loop>
        <source src={project.music_url ?? '/images/esmeralda/musica.mp3'} type="audio/mpeg" />
      </audio>
      {!envelopeOpen && (
        <EspecialEnvelope
          onSealClick={() => audioRef.current?.play().catch(() => {})}
          onOpen={() => setEnvelopeOpen(true)}
          sealUrl={sealUrl}
          envelopeRightUrl={envelopeRightUrl}
          envelopeLeftUrl={envelopeLeftUrl}
          sealOffsetX={sealOffsetX}
          sealOffsetY={sealOffsetY}
        />
      )}
      <StickyBanner guestName={project.guest_name ?? project.quinceanera_name} />
      <EspecialHero project={project} decorationSrc={decorationSrc} />
      <EspecialParents project={project} decorationSrc={decorationSrc} />
      <EspecialEventDate eventDate={project.event_date} />
      <EspecialLocations project={project} decorationSrc={decorationSrc} />
      {project.show_itinerary && project.itinerary.length > 0 && <EspecialItinerary project={project} decorationSrc={decorationSrc} />}
      {showDressCode && <EspecialDressCode project={project} decorationSrc={decorationSrc} />}
      {project.hashtag && <EspecialHashtag hashtag={project.hashtag} decorationSrc={decorationSrc} />}
      {project.photos.length > 0 && <EspecialPhotos photos={project.photos} decorationSrc={decorationSrc} />}
      {project.show_video && (
        <EspecialVideo
          youtubeId={project.video_youtube_id ?? undefined}
          localVideo={project.video_url ?? undefined}
          audioRef={audioRef}
          decorationSrc={decorationSrc}
        />
      )}
      <EspecialGifts project={project} decorationSrc={decorationSrc} />
      <EspecialRSVP project={project} decorationSrc={decorationSrc} />
      <EspecialFooter project={project} />
    </div>
  )
}
