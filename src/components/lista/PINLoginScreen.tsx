'use client'

import { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  slug: string
  festejada: string
}

export function PINLoginScreen({ slug, festejada }: Props) {
  const router = useRouter()
  const [digits, setDigits] = useState<string[]>(['', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const pin = digits.join('')
  const complete = pin.length === 4

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = digit
    setDigits(next)
    setError('')

    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (pasted.length === 4) {
      setDigits(pasted.split(''))
      inputRefs.current[3]?.focus()
    }
    e.preventDefault()
  }

  async function handleSubmit() {
    if (!complete || loading) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/i/${slug}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      const json = await res.json()

      if (!res.ok) {
        setShake(true)
        setDigits(['', '', '', ''])
        setError(json.error ?? 'PIN incorrecto')
        inputRefs.current[0]?.focus()
        setTimeout(() => setShake(false), 600)
        return
      }

      // Guarda el JWT en sessionStorage para que sobreviva navegación dentro de la pestaña
      sessionStorage.setItem(`lista_token_${slug}`, json.token)
      router.push(`/i/${slug}/admin`)
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-6"
      style={{ background: '#F7F5F2' }}
    >
      {/* Ornamento superior */}
      <div style={{ width: 40, height: 1, background: '#C4956A', marginBottom: 16 }} />

      {/* Label */}
      <p
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          color: '#A8A29E',
          marginBottom: 8,
        }}
      >
        La fiesta de
      </p>

      {/* Nombre festejada */}
      <h1
        style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 44,
          fontWeight: 700,
          color: '#1C1917',
          marginBottom: 16,
          textAlign: 'center',
          lineHeight: 1.1,
        }}
      >
        {festejada}
      </h1>

      {/* Ornamento inferior */}
      <div style={{ width: 40, height: 1, background: '#C4956A', marginBottom: 52 }} />

      {/* Instrucción */}
      <p
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 14,
          color: '#78716C',
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        Ingresa tu PIN de acceso
      </p>

      {/* 4 cajas PIN */}
      <div
        className={shake ? 'animate-[shake_0.5s_ease]' : ''}
        style={{ display: 'flex', gap: 12, marginBottom: 24 }}
      >
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => updateDigit(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={() => setFocusedIdx(i)}
            onBlur={() => setFocusedIdx(null)}
            style={{
              width: 60,
              height: 68,
              borderRadius: 16,
              background: '#fff',
              border: digit || focusedIdx === i
                ? '2px solid #7C5C4A'
                : '1.5px solid #E7E5E3',
              textAlign: 'center',
              fontFamily: 'Playfair Display, serif',
              fontSize: 30,
              fontWeight: 700,
              color: '#1C1917',
              outline: 'none',
              transition: 'border 150ms',
            }}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <p
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 13,
            color: '#DC2626',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          {error}
        </p>
      )}

      {/* Botón Acceder */}
      <button
        onClick={handleSubmit}
        disabled={!complete || loading}
        style={{
          width: '100%',
          maxWidth: 320,
          padding: '17px 0',
          borderRadius: 16,
          background: complete && !loading ? '#7C5C4A' : '#C8C3BC',
          color: '#fff',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 15,
          fontWeight: 600,
          border: 'none',
          cursor: complete && !loading ? 'pointer' : 'not-allowed',
          transition: 'background 200ms',
        }}
      >
        {loading ? 'Verificando…' : 'Acceder'}
      </button>

      {/* Texto ayuda */}
      <p
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 12,
          color: '#A8A29E',
          marginTop: 22,
          textAlign: 'center',
        }}
      >
        Solicita tu PIN a la festejada
      </p>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          90% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}
