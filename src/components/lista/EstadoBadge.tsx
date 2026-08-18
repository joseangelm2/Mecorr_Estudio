import type { EstadoInvitado } from '@/types/invitation'

const ESTADOS: Record<EstadoInvitado, { label: string; bg: string; color: string }> = {
  alta:    { label: 'Alta',    bg: '#F4F0EE', color: '#78716C' },
  enviado: { label: 'Enviado', bg: '#EFF6FF', color: '#2563EB' },
  confirmo:{ label: 'Confirmó',bg: '#F0FDF4', color: '#16A34A' },
  baja:    { label: 'Baja',    bg: '#F5F5F4', color: '#A8A29E' },
}

export function EstadoBadge({ estado }: { estado: EstadoInvitado }) {
  const cfg = ESTADOS[estado]
  return (
    <span
      style={{
        background: cfg.bg,
        color: cfg.color,
        borderRadius: 20,
        padding: '3px 10px',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {cfg.label}
    </span>
  )
}
