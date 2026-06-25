'use client'

import { useCallback, useMemo } from 'react'

/** Recupera el JWT efímero guardado en sessionStorage tras el login con PIN. */
export function useListaAuth(slug: string) {
  const token = useMemo(() => {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem(`lista_token_${slug}`)
  }, [slug])

  const authHeader = useCallback((): Record<string, string> => {
    const t = sessionStorage.getItem(`lista_token_${slug}`)
    return t ? { Authorization: `Bearer ${t}` } : {}
  }, [slug])

  return { token, authHeader }
}
