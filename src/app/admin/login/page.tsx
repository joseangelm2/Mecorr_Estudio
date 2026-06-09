'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="admin-login-page">
      {/* Logo */}
      <div className="admin-login-logo">
        <img src="/promo/logo_mecorr2.png" alt="MeCorr Estudio" />
        <h1>MeCorr Estudio</h1>
        <p>Panel de administración</p>
      </div>

      {/* Login card */}
      <div className="admin-login-card">
        <form onSubmit={handleSubmit}>
          <div className="admin-login-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@mecorr.com.mx"
              autoComplete="email"
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="admin-login-error">{error}</div>
          )}

          <button type="submit" disabled={loading} className="admin-login-btn">
            {loading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
