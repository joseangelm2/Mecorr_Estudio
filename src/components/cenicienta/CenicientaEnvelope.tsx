'use client'

import VintageEnvelope from '@/components/vintage/VintageEnvelope'

interface Props {
  onOpen: () => void
  primaryColor: string
}

export default function CenicientaEnvelope({ onOpen, primaryColor }: Props) {
  return <VintageEnvelope onOpen={onOpen} primaryColor={primaryColor} />
}
