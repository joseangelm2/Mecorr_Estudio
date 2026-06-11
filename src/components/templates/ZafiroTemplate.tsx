'use client'

import '@/app/zafiro/zafiro.css'
import { useState, useRef } from 'react'
import type { Project } from '@/types/invitation'
import VintageEnvelope from '@/components/vintage/VintageEnvelope'
import EsmeraldaScrollInit from '@/components/esmeralda/EsmeraldaScrollInit'
import ZafiroContent from '@/components/zafiro/ZafiroContent'

interface Props {
  project: Project
}

export default function ZafiroTemplate({ project }: Props) {
  const [open, setOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  function handleOpen() {
    setOpen(true)
    audioRef.current?.play().catch(() => {})
  }

  return (
    <div style={{ position: 'relative' }}>
      <EsmeraldaScrollInit />
      <audio ref={audioRef} loop>
        <source src={project.music_url ?? '/images/esmeralda/musica.mp3'} type="audio/mpeg" />
      </audio>
      {!open && <VintageEnvelope onOpen={handleOpen} primaryColor="#775197" />}
      <div className="top">
        <img className="top-img" src="/images/zafiro/452.png" alt="" />
      </div>
      <div className="bottom">
        <img className="bottom-img" src="/images/zafiro/453.png" alt="" />
      </div>
      <ZafiroContent project={project} />
    </div>
  )
}
