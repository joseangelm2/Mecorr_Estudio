'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useListaAuth } from './useListaAuth'
import { InvitadoCard } from './InvitadoCard'
import { ModalAgregarInvitado } from './ModalAgregarInvitado'
import { ModalNuevoGrupo } from './ModalNuevoGrupo'
import { DashboardTab } from './DashboardTab'
import { BoletosTab } from './BoletosTab'
import type { Invitado, GrupoEvento, EstadoInvitado } from '@/types/invitation'
import { createClient } from '@supabase/supabase-js'

type Tab = 'dashboard' | 'lista' | 'boletos'
type FiltroEstado = 'todos' | EstadoInvitado

interface Props {
  slug: string
  festejada: string
  eventDate: string
  rsvpPhone: string
  mapsUrl: string
}

export function AdminShell({ slug, festejada, eventDate, rsvpPhone, mapsUrl }: Props) {
  const router = useRouter()
  const { authHeader } = useListaAuth(slug)

  const [tab, setTab] = useState<Tab>('dashboard')
  const [invitados, setInvitados] = useState<Invitado[]>([])
  const [grupos, setGrupos] = useState<GrupoEvento[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos')
  const [filtroGrupo, setFiltroGrupo] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingInvitado, setEditingInvitado] = useState<Invitado | null>(null)
  const [showGrupoModal, setShowGrupoModal] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{ id: string; label: string; action: () => void } | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(async () => {
    const headers = authHeader()
    const [invRes, grupoRes] = await Promise.all([
      fetch(`/i/${slug}/api/invitados`, { headers }),
      fetch(`/i/${slug}/api/grupos`, { headers }),
    ])

    if (invRes.status === 401) {
      router.push(`/i/${slug}`)
      return
    }

    if (invRes.ok) setInvitados(await invRes.json())
    if (grupoRes.ok) setGrupos(await grupoRes.json())
    setLoading(false)
  }, [slug, authHeader, router])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  }, [fetchData])

  // Supabase Realtime — actualiza cuando un invitado confirma desde su celular
  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const channel = supabase
      .channel(`invitados-${slug}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invitados' }, () => {
        fetchData()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [slug, fetchData])

  // Cerrar panel al hacer scroll en la lista
  function handleListScroll() {
    setExpandedId(null)
  }

  // ─── API calls ─────────────────────────────────────────────────────────────

  async function apiPut(id: string, body: object) {
    const res = await fetch(`/i/${slug}/api/invitados/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const updated = await res.json()
      setInvitados(prev => prev.map(inv => inv.id === id ? updated : inv))
    }
  }

  async function handleSaveInvitado(data: {
    titular: string; grupo_id: string; num_invitados: number; whatsapp: string
  }) {
    if (editingInvitado) {
      await apiPut(editingInvitado.id, data)
    } else {
      const res = await fetch(`/i/${slug}/api/invitados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const created = await res.json()
        setInvitados(prev => [created, ...prev])
      }
    }
    setEditingInvitado(null)
  }

  async function handleSaveGrupo(nombre: string, color: string) {
    const res = await fetch(`/i/${slug}/api/grupos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ nombre, color }),
    })
    if (res.ok) {
      const created = await res.json()
      setGrupos(prev => [...prev, created])
    }
  }

  async function handleConfirmar(id: string) {
    setConfirmDialog({
      id,
      label: '¿Confirmar asistencia de este invitado?',
      action: async () => {
        await apiPut(id, { estado: 'confirmo', confirmacion: 'SI', fecha_confirmacion: new Date().toISOString() })
        setConfirmDialog(null)
      },
    })
  }

  async function handleBaja(id: string) {
    setConfirmDialog({
      id,
      label: '¿Dar de baja a este invitado?',
      action: async () => {
        await apiPut(id, { estado: 'baja' })
        setConfirmDialog(null)
      },
    })
  }

  async function handleReactivar(id: string) {
    await apiPut(id, { estado: 'alta' })
  }

  async function handleDelete(id: string) {
    setConfirmDialog({
      id,
      label: 'Eliminar este invitado permanentemente',
      action: async () => {
        const res = await fetch(`/i/${slug}/api/invitados/${id}`, {
          method: 'DELETE',
          headers: authHeader(),
        })
        if (res.ok) setInvitados(prev => prev.filter(inv => inv.id !== id))
        setConfirmDialog(null)
      },
    })
  }

  async function handleDesvincular(id: string) {
    await apiPut(id, { device_id: null })
  }

  async function handleEnviarBoleto(invitado: Invitado) {
    const res = await fetch(`/i/${slug}/admin/boletos/${invitado.id}`, { headers: authHeader() })
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `boleto-${invitado.titular.replace(/\s+/g, '-')}.pdf`
      a.click()
    }
  }

  // ─── Filtros ────────────────────────────────────────────────────────────────

  const filtrados = invitados.filter(inv => {
    if (filtroEstado !== 'todos' && inv.estado !== filtroEstado) return false
    if (filtroGrupo && inv.grupo_id !== filtroGrupo) return false
    return true
  })

  const FILTROS: { key: FiltroEstado; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'alta', label: 'Alta' },
    { key: 'enviado', label: 'Enviado' },
    { key: 'confirmo', label: 'Confirmó' },
    { key: 'baja', label: 'Baja' },
  ]

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', background: '#F7F5F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 28, height: 28, border: '3px solid #E7E5E3', borderTopColor: '#7C5C4A', borderRadius: '50%', animation: 'spin 800ms linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#F7F5F2', paddingBottom: 80 }}>

      {/* ── TAB: DASHBOARD ── */}
      {tab === 'dashboard' && (
        <DashboardTab
          invitados={invitados}
          grupos={grupos}
          festejada={festejada}
          eventDate={eventDate}
          onAddGrupo={() => setShowGrupoModal(true)}
          onSelectGrupo={grupoId => { setFiltroGrupo(grupoId); setTab('lista') }}
        />
      )}

      {/* ── TAB: LISTA ── */}
      {tab === 'lista' && (
        <div>
          {/* Header sticky */}
          <div style={{ position: 'sticky', top: 0, background: '#F7F5F2', zIndex: 10, padding: '56px 20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#1C1917', margin: 0 }}>Invitados</h1>
              <button
                onClick={() => { setEditingInvitado(null); setShowAddModal(true) }}
                style={{ background: '#7C5C4A', color: '#fff', border: 'none', borderRadius: 20, padding: '7px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                + Agregar
              </button>
            </div>

            {/* Banner de filtro de grupo activo */}
            {filtroGrupo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', borderRadius: 10, padding: '6px 12px', marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: grupos.find(g => g.id === filtroGrupo)?.color ?? '#C4956A' }} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#1C1917', flex: 1 }}>
                  {grupos.find(g => g.id === filtroGrupo)?.nombre}
                </span>
                <button onClick={() => setFiltroGrupo(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A8A29E', fontSize: 16 }}>×</button>
              </div>
            )}

            {/* Acciones de importar/exportar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <a
                href={`/i/${slug}/api/exportar`}
                onClick={e => {
                  e.preventDefault()
                  fetch(`/i/${slug}/api/exportar`, { headers: authHeader() })
                    .then(r => r.blob()).then(blob => {
                      const a = document.createElement('a')
                      a.href = URL.createObjectURL(blob)
                      a.download = `invitados-${slug}.csv`
                      a.click()
                    })
                }}
                style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#7C5C4A', textDecoration: 'none', padding: '5px 10px', border: '1px solid #7C5C4A', borderRadius: 8 }}
              >
                ⬇ Exportar CSV
              </a>
              <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#7C5C4A', padding: '5px 10px', border: '1px solid #7C5C4A', borderRadius: 8, cursor: 'pointer' }}>
                ⬆ Importar
                <input type="file" accept=".csv" style={{ display: 'none' }} onChange={async e => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const fd = new FormData()
                  fd.append('file', file)
                  const res = await fetch(`/i/${slug}/api/importar`, { method: 'POST', headers: authHeader(), body: fd })
                  const json = await res.json()
                  alert(json.summary)
                  fetchData()
                }} />
              </label>
            </div>

            {/* Pills de filtro por estado */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8 }}>
              {FILTROS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFiltroEstado(f.key)}
                  style={{
                    padding: '6px 14px', borderRadius: 20, border: filtroEstado === f.key ? 'none' : '1px solid #E7E5E3',
                    background: filtroEstado === f.key ? '#7C5C4A' : '#fff',
                    color: filtroEstado === f.key ? '#fff' : '#78716C',
                    fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de cards */}
          <div
            ref={listRef}
            onScroll={handleListScroll}
            style={{ padding: '12px 20px' }}
          >
            {filtrados.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#A8A29E', fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>
                Sin invitados{filtroEstado !== 'todos' ? ` en estado "${filtroEstado}"` : ''}
              </div>
            ) : (
              filtrados.map(inv => (
                <InvitadoCard
                  key={inv.id}
                  invitado={inv}
                  festejada={festejada}
                  slug={slug}
                  isExpanded={expandedId === inv.id}
                  onToggle={() => setExpandedId(prev => prev === inv.id ? null : inv.id)}
                  onEdit={() => { setEditingInvitado(inv); setShowAddModal(true); setExpandedId(null) }}
                  onConfirm={() => handleConfirmar(inv.id)}
                  onBaja={() => handleBaja(inv.id)}
                  onReactivar={() => handleReactivar(inv.id)}
                  onDelete={() => handleDelete(inv.id)}
                  onDesvincular={() => handleDesvincular(inv.id)}
                  onEnviarBoleto={() => handleEnviarBoleto(inv)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TAB: BOLETOS ── */}
      {tab === 'boletos' && (
        <BoletosTab
          invitados={invitados}
          slug={slug}
          festejada={festejada}
          authHeader={authHeader}
        />
      )}

      {/* ── BOTTOM NAV ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#fff', borderTop: '1px solid #E7E5E3',
        display: 'flex', height: 60, zIndex: 20,
      }}>
        {([['dashboard', '📊', 'Dashboard'], ['lista', '👥', 'Lista'], ['boletos', '🎫', 'Boletos']] as const).map(
          ([key, icon, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                flex: 1, border: 'none', background: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                color: tab === key ? '#7C5C4A' : '#A8A29E',
                fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: tab === key ? 600 : 400,
                borderTop: tab === key ? '2px solid #7C5C4A' : '2px solid transparent',
              }}
            >
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span>{label}</span>
            </button>
          )
        )}
      </nav>

      {/* ── MODALES ── */}
      {showAddModal && (
        <ModalAgregarInvitado
          grupos={grupos}
          editing={editingInvitado}
          onClose={() => { setShowAddModal(false); setEditingInvitado(null) }}
          onSave={handleSaveInvitado}
        />
      )}

      {showGrupoModal && (
        <ModalNuevoGrupo
          onClose={() => setShowGrupoModal(false)}
          onSave={handleSaveGrupo}
        />
      )}

      {/* ── CONFIRM DIALOG ── */}
      {confirmDialog && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(28,25,23,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, width: '100%', maxWidth: 360 }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#1C1917', margin: '0 0 20px', textAlign: 'center' }}>
              {confirmDialog.label}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmDialog(null)} style={{ flex: 1, padding: 14, borderRadius: 12, border: '1px solid #E7E5E3', background: '#fff', color: '#78716C', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={confirmDialog.action} style={{ flex: 1, padding: 14, borderRadius: 12, border: 'none', background: '#DC2626', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
