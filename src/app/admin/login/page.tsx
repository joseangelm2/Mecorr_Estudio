'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
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
      // Full reload para que el browser envíe la cookie de sesión al proxy
      window.location.href = '/admin'
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

        <a href="/admin/forgot-password" className="admin-login-forgot">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </div>
  )
}
