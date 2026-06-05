'use client'

import '@/app/sellorosa/sellorosa.css'
import { useState, useRef } from 'react'
import type { Project } from '@/types/invitation'
import EsmeraldaScrollInit from '@/components/esmeralda/EsmeraldaScrollInit'
import SelloRosaEnvelope from '@/components/sellorosa/SelloRosaEnvelope'
import SelloRosaContent from '@/components/sellorosa/SelloRosaContent'

interface Props {
  project: Project
}

export default function SelloRosaTemplate({ project: _project }: Props) {
  const [open, setOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  function handleOpen() {
    setOpen(true)
    audioRef.current?.play().catch(() => {})
  }

  return (
    <div>
      <EsmeraldaScrollInit />
      <audio ref={audioRef} loop preload="auto">
        <source src="/images/esmeralda/musica.mp3" type="audio/mpeg" />
      </audio>
      {!open && <SelloRosaEnvelope onOpen={handleOpen} />}
      <SelloRosaContent />
    </div>
  )
}
