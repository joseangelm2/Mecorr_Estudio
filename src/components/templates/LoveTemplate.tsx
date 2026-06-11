'use client'

import '@/app/love/love.css'
import { useState, useRef } from 'react'
import type { Project } from '@/types/invitation'
import EsmeraldaScrollInit from '@/components/esmeralda/EsmeraldaScrollInit'
import LoveEnvelope from '@/components/love/LoveEnvelope'
import LoveContent from '@/components/love/LoveContent'

interface Props {
  project: Project
}

export default function LoveTemplate({ project }: Props) {
  const [open, setOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  function handleOpen() {
    setOpen(true)
    audioRef.current?.play().catch(() => {})
  }

  return (
    <div style={{ position: 'relative' }}>
      <EsmeraldaScrollInit />
      <audio ref={audioRef} id="music" loop>
        <source src={project.music_url ?? '/images/esmeralda/musica.mp3'} type="audio/mpeg" />
      </audio>
      {!open && <LoveEnvelope onOpen={handleOpen} />}
      <LoveContent project={project} />
    </div>
  )
}
