'use client'

import { useState } from 'react'
import { EstadoBadge } from './EstadoBadge'
import type { Invitado, EstadoInvitado } from '@/types/invitation'
import { buildWhatsAppUrl } from '@/lib/lista/whatsapp'

interface ActionConfig {
  label: string
  icon: string
  bg: string
  color: string
  border?: string
  onClick: () => void
}

interface Props {
  invitado: Invitado
  festejada: string
  slug: string
  isExpanded: boolean
  onToggle: () => void
  onEdit: () => void
  onConfirm: () => void
  onBaja: () => void
  onReactivar: () => void
  onDelete: () => void
  onDesvincular: () => void
  onEnviarBoleto: () => void
  onEnviarWA: () => void
}

const AVATAR_STYLES: Record<EstadoInvitado, { bg: string; color: string }> = {
  alta:    { bg: '#F4F0EE', color: '#78716C' },
  enviado: { bg: '#EFF6FF', color: '#2563EB' },
  confirmo:{ bg: '#F0FDF4', color: '#16A34A' },
  baja:    { bg: '#F5F5F4', color: '#A8A29E' },
}

export function InvitadoCard({
  invitado, festejada, slug,
  isExpanded, onToggle, onEdit, onConfirm, onBaja, onReactivar, onDelete, onDesvincular, onEnviarBoleto, onEnviarWA,
}: Props) {
  const avatar = AVATAR_STYLES[invitado.estado]
  const initials = invitado.titular.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const isBaja = invitado.estado === 'baja'

  function handleEnviarWA() {
    const url = buildWhatsAppUrl(invitado, festejada, slug)
    onEnviarWA()
    window.open(url, '_blank')
  }

  function getActions(): ActionConfig[] {
    const actions: ActionConfig[] = []
    const { estado, confirmacion, device_id, whatsapp } = invitado

    if (estado === 'alta') {
      actions.push(
        { label: 'Editar', icon: '✎', bg: '#fff', color: '#78716C', border: '#E7E5E3', onClick: onEdit },
        ...(whatsapp ? [{ label: 'Enviar WA', icon: '↗', bg: '#DCFCE7', color: '#16A34A', onClick: handleEnviarWA }] : []),
        { label: 'Eliminar', icon: '🗑', bg: '#FEF2F2', color: '#DC2626', onClick: onDelete },
      )
    } else if (estado === 'enviado') {
      actions.push(
        { label: 'Confirmar', icon: '✓', bg: '#F0FDF4', color: '#16A34A', onClick: onConfirm },
        { label: 'Editar', icon: '✎', bg: '#fff', color: '#78716C', border: '#E7E5E3', onClick: onEdit },
        ...(whatsapp ? [{ label: 'Enviar WA', icon: '↗', bg: '#DCFCE7', color: '#16A34A', onClick: handleEnviarWA }] : []),
        { label: 'Dar de baja', icon: '⬇', bg: '#FEF2F2', color: '#DC2626', onClick: onBaja },
        ...(device_id ? [{ label: 'Desvincular', icon: '🔓', bg: '#F7F5F2', color: '#A8A29E', border: '#E7E5E3', onClick: onDesvincular }] : []),
      )
    } else if (estado === 'confirmo') {
      if (confirmacion === 'SI') {
        actions.push(
          { label: 'Editar', icon: '✎', bg: '#fff', color: '#78716C', border: '#E7E5E3', onClick: onEdit },
          { label: 'Boleto', icon: '🎫', bg: '#FEF3C7', color: '#D97706', onClick: onEnviarBoleto },
          ...(whatsapp ? [{ label: 'Enviar WA', icon: '↗', bg: '#DCFCE7', color: '#16A34A', onClick: handleEnviarWA }] : []),
          ...(device_id ? [{ label: 'Desvincular', icon: '🔓', bg: '#F7F5F2', color: '#A8A29E', border: '#E7E5E3', onClick: onDesvincular }] : []),
        )
      } else {
        actions.push(
          { label: 'Editar', icon: '✎', bg: '#fff', color: '#78716C', border: '#E7E5E3', onClick: onEdit },
        )
      }
    } else if (estado === 'baja') {
      actions.push(
        { label: 'Reactivar', icon: '↩', bg: '#F7F5F2', color: '#78716C', border: '#E7E5E3', onClick: onReactivar },
        { label: 'Editar', icon: '✎', bg: '#fff', color: '#78716C', border: '#E7E5E3', onClick: onEdit },
      )
    }

    return actions
  }

  const actions = getActions()

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        marginBottom: 8,
        boxShadow: isExpanded ? '0 4px 20px rgba(124,92,74,.12)' : 'none',
        opacity: isBaja ? 0.7 : 1,
        overflow: 'hidden',
      }}
    >
      {/* Fila principal */}
      <div
        style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 12 }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 40, height: 40, borderRadius: 12,
            background: avatar.bg, color: avatar.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 14,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 14,
              fontWeight: 600,
              color: '#1C1917',
              margin: 0,
              textDecoration: isBaja ? 'line-through' : 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {invitado.titular}
          </p>
          <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            {invitado.grupo && (
              <span
                style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: invitado.grupo.color, flexShrink: 0,
                }}
              />
            )}
            <span
              style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 12,
                color: '#78716C', whiteSpace: 'nowrap',
              }}
            >
              {invitado.grupo?.nombre ?? '—'} · {invitado.num_invitados} inv.
            </span>
          </p>
        </div>

        <EstadoBadge estado={invitado.estado} />

        {/* Botón ··· */}
        <button
          onClick={onToggle}
          style={{
            width: 30, height: 30, borderRadius: 8,
            background: isExpanded ? '#7C5C4A' : '#F7F5F2',
            border: 'none', cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isExpanded ? '#fff' : '#A8A29E',
            fontSize: 16, letterSpacing: 2,
          }}
        >
          ···
        </button>
      </div>

      {/* Panel de acciones expandido */}
      {isExpanded && (
        <div
          style={{
            background: '#F7F5F2',
            borderTop: '1px solid #F0EEEB',
            padding: '10px 14px 12px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 7,
            animation: 'fadeIn 180ms ease',
          }}
        >
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              style={{
                flex: '1 1 44%',
                minWidth: 0,
                padding: '9px 12px',
                borderRadius: 11,
                background: action.bg,
                border: action.border ? `1px solid ${action.border}` : 'none',
                color: action.color,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
