'use client'

import '@/app/pink/pink.css'
import { useState, useRef } from 'react'
import type { Project } from '@/types/invitation'
import VintageEnvelope from '@/components/vintage/VintageEnvelope'
import EsmeraldaScrollInit from '@/components/esmeralda/EsmeraldaScrollInit'
import PinkContent from '@/components/pink/PinkContent'

const PRIMARY = '#c48602'

interface Props {
  project: Project
}

export default function PinkTemplate({ project }: Props) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  function handleOpen() {
    setEnvelopeOpen(true)
    audioRef.current?.play().catch(() => {})
  }

  return (
    <div style={{ position: 'relative' }}>
      <EsmeraldaScrollInit />
      <audio ref={audioRef} loop>
        <source src={project.music_url ?? '/images/esmeralda/musica.mp3'} type="audio/mpeg" />
      </audio>

      {!envelopeOpen && (
        <VintageEnvelope onOpen={handleOpen} primaryColor={PRIMARY} />
      )}

      <div className="top">
        <img className="top-img" src="/images/pink/452.png" alt="" />
      </div>
      <div className="bottom">
        <img className="bottom-img" src="/images/pink/453.png" alt="" />
      </div>

      <PinkContent project={project} />
    </div>
  )
}
