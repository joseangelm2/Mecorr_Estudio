'use client'

import { useState, useRef, useEffect } from 'react'
import type { Project } from '@/types/invitation'
import { ELEGANCE_THEMES, DEFAULT_ELEGANCE_THEME, type EleganceTheme } from '@/lib/elegance-themes'
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

const BASE_PROJECT: Omit<Project, 'color_theme'> = {
  id: 'demo',
  slug: 'demo-elegance',
  template: 'elegance',
  status: 'published',
  created_at: '',
  updated_at: '',
  quinceanera_name: 'Alison Galván Méndez',
  guest_name: null,
  event_date: '2026-11-22T17:00:00',
  rsvp_phone: '524438569931',
  hashtag: 'XVAlison',
  music_url: '/images/elegance/musica.mp3',
  hero_photo_url: '/images/elegance/foto.jpg',
  parent_names: ['Elías Moises Galván Juárez', 'Esperanza Méndez Hernández'],
  padrinos: ['José Feliciano Hernández', 'María Carolina Escandón Cruz'],
  ceremony: {
    time: '5:00 PM',
    venue: 'Parroquia San Peregrino',
    address: 'Blvd. Solidaridad, Fuentes del Mezquital, 83250 Hermosillo, Son.',
    mapsUrl: 'https://maps.app.goo.gl/EKZpeKCqNpt8PqBo6',
  },
  reception: {
    time: '7:00 PM',
    venue: 'Salón de Evento Villa Toscana',
    address: 'C. Quintero Arce 280, Puerta Grande, 83246 Hermosillo, Son.',
    mapsUrl: 'https://maps.app.goo.gl/NEusLqQqZhirLnCAA',
  },
  itinerary: [],
  dress_code: { colors: 'Vestimenta Formal', notes: '' },
  photos: [
    '/images/elegance/11.jpg',
    '/images/elegance/21.jpg',
    '/images/elegance/31.jpg',
    '/images/elegance/41.jpg',
  ],
  gift_registry: {
    liverpoolLink: 'https://mesaderegalos.liverpool.com.mx/milistaderegalos/51309081',
    bankAccount: '4027 6657 1234 4321',
    bankBeneficiary: 'Alejandra Hernández Ramírez',
  },
  invitation_text: null,
  show_video: false,
  video_youtube_id: null,
  video_url: null,
  show_lluvia_sobres: true,
  lluvia_sobres_text: null,
  show_datos_bancarios: true,
  datos_bancarios_text: null,
  show_itinerary: true,
  confirmation_phrase: null,
  confirmation_highlight_date: null,
  extra_config: {},
}

const FALLBACKS = [11, 21, 31, 41, 12, 22, 32]

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

function ThemeSelector({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      borderRadius: 40,
      padding: '10px 18px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ color: '#F2D67F', fontSize: 11, fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}>
        Tema:
      </span>
      {ELEGANCE_THEMES.map(t => (
        <button
          key={t.id}
          title={t.label}
          onClick={() => onChange(t.id)}
          style={{
            width: 28, height: 28,
            borderRadius: '50%',
            background: t.swatch,
            border: active === t.id ? '2px solid #F2D67F' : '2px solid transparent',
            boxShadow: active === t.id ? '0 0 0 2px rgba(242,214,127,0.5)' : 'none',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  )
}

export default function ElegancePage() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const [themeId, setThemeId] = useState(DEFAULT_ELEGANCE_THEME.id)
  const audioRef = useRef<HTMLAudioElement>(null)

  const theme: EleganceTheme = ELEGANCE_THEMES.find(t => t.id === themeId) ?? DEFAULT_ELEGANCE_THEME
  const project: Project = { ...BASE_PROJECT, color_theme: themeId }

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
        <source src={project.music_url ?? '/images/elegance/musica.mp3'} type="audio/mpeg" />
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
        <ElegancePhotoGrid gridRetrato={[]} gridHorizontal={[]} />
        {project.show_itinerary && <GalleryPhoto src={photos[4]} />}
        {project.show_itinerary && <EleganceItinerary project={project} />}
        <GalleryPhoto src={photos[5]} />
        <EleganceWishes phone={project.rsvp_phone ?? ''} hashtag={hashtag} dressCodeNotes={project.dress_code?.notes || undefined} />
        <EleganceRSVP project={project} />
        <GalleryPhoto src={photos[6]} />
        <EleganceFooter />
      </div>
      {!envelopeOpen && <ThemeSelector active={themeId} onChange={id => { window.scrollTo({ top: 0, behavior: 'smooth' }); setThemeId(id) }} />}
    </div>
  )
}
