'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

interface Props {
  slug: string
  size?: number
}

export default function AlbumQRCode({ slug, size = 180 }: Props) {
  const [dataUrl, setDataUrl] = useState('')
  const path = `/i/${slug}/album`

  useEffect(() => {
    const url = `${window.location.origin}${path}`
    QRCode.toDataURL(url, { width: size, margin: 1 }).then(setDataUrl)
  }, [path, size])

  if (!dataUrl) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <img src={dataUrl} alt="Código QR del álbum digital" width={size} height={size} style={{ borderRadius: '8px' }} />
      <a href={path} target="_blank" rel="noreferrer" style={{ fontSize: '13px', wordBreak: 'break-all', textAlign: 'center' }}>
        {path}
      </a>
    </div>
  )
}
