'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    })

    setLoading(false)
    if (error) {
      setError('No se pudo enviar el correo. Intenta de nuevo.')
    } else {
      setSent(true)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-logo">
        <img src="/promo/logo_mecorr2.png" alt="MeCorr Estudio" />
        <h1>MeCorr Estudio</h1>
        <p>Recuperar contraseña</p>
      </div>

      <div className="admin-login-card">
        {sent ? (
          <div className="admin-login-success">
            Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.
          </div>
        ) : (
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

            {error && (
              <div className="admin-login-error">{error}</div>
            )}

            <button type="submit" disabled={loading} className="admin-login-btn">
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>
        )}

        <a href="/admin/login" className="admin-login-forgot">
          Volver a iniciar sesión
        </a>
      </div>
    </div>
  )
}
