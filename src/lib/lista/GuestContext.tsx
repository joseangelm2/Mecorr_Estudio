'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { buildAdminNotifUrl } from '@/lib/lista/whatsapp'

interface GuestContextValue {
  token: string | null
  slug: string
  titular: string
  rsvpPhone: string
  status: 'loading' | 'verified' | 'blocked' | 'confirmed'
  confirmacion: 'SI' | 'NO' | null
  error: string | null
  confirm: (choice: 'SI' | 'NO', mensaje: string) => Promise<void>
}

const GuestContext = createContext<GuestContextValue>({
  token: null,
  slug: '',
  titular: '',
  rsvpPhone: '',
  status: 'loading',
  confirmacion: null,
  error: null,
  confirm: async () => {},
})

interface ProviderProps {
  token: string | null
  slug: string
  rsvpPhone: string
  festejada: string
  children: React.ReactNode
}

export function GuestProvider({ token, slug, rsvpPhone, festejada, children }: ProviderProps) {
  const [titular, setTitular] = useState('')
  const [status, setStatus] = useState<GuestContextValue['status']>(token ? 'loading' : 'verified')
  const [confirmacion, setConfirmacion] = useState<'SI' | 'NO' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    async function verificar() {
      let deviceId = localStorage.getItem(`device_id_${slug}`)
      if (!deviceId) {
        deviceId = crypto.randomUUID()
        localStorage.setItem(`device_id_${slug}`, deviceId)
      }

      const res = await fetch(`/i/${slug}/api/verificar-dispositivo?token=${token}&device_id=${deviceId}`)
      const json = await res.json()

      if (!json.allowed) {
        setStatus('blocked')
        return
      }

      setTitular(json.titular ?? '')
      setStatus('verified')
    }

    verificar()
  }, [token, slug])

  const confirm = useCallback(async (choice: 'SI' | 'NO', mensaje: string) => {
    setError(null)

    const res = await fetch(`/i/${slug}/api/confirmar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, confirmacion: choice, mensaje }),
    })

    if (res.ok) {
      setConfirmacion(choice)
      setStatus('confirmed')
      const waUrl = buildAdminNotifUrl(rsvpPhone, titular || 'Un invitado', choice, festejada, mensaje)
      window.open(waUrl, '_blank')
    } else {
      const json = await res.json().catch(() => ({}))
      setError(json.error ?? 'Error al enviar. Intenta de nuevo.')
    }
  }, [token, slug, rsvpPhone, titular, festejada])

  return (
    <GuestContext.Provider value={{ token, slug, titular, rsvpPhone, status, confirmacion, error, confirm }}>
      {children}
    </GuestContext.Provider>
  )
}

export function useGuestContext() {
  return useContext(GuestContext)
}
