'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError('No se pudo actualizar la contraseña. El enlace pudo haber expirado, solicita uno nuevo.')
    } else {
      setDone(true)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-logo">
        <img src="/promo/logo_mecorr2.png" alt="MeCorr Estudio" />
        <h1>MeCorr Estudio</h1>
        <p>Restablecer contraseña</p>
      </div>

      <div className="admin-login-card">
        {done ? (
          <>
            <div className="admin-login-success">
              Tu contraseña se actualizó correctamente.
            </div>
            <a href="/admin/login" className="admin-login-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Iniciar sesión
            </a>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="admin-login-field">
              <label htmlFor="password">Nueva contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <div className="admin-login-field">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="admin-login-error">{error}</div>
            )}

            <button type="submit" disabled={loading} className="admin-login-btn">
              {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
