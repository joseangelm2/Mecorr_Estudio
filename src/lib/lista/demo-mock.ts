import type { EstadoInvitado, GrupoEvento, Invitado } from '@/types/invitation'

/** Slug ficticio: el panel real llama a `/i/<slug>/api/*`; el demo responde esas rutas en memoria. */
export const DEMO_LISTA_SLUG = 'demo-boda'

const PROJECT_ID = 'demo-project'
const ahora = () => new Date().toISOString()
const dias = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString()

const GRUPOS: GrupoEvento[] = [
  { id: 'g1', project_id: PROJECT_ID, nombre: 'Familia de la novia', color: '#C4956A', orden: 0, created_at: dias(30) },
  { id: 'g2', project_id: PROJECT_ID, nombre: 'Familia del novio', color: '#7C5C4A', orden: 1, created_at: dias(30) },
  { id: 'g3', project_id: PROJECT_ID, nombre: 'Amigos', color: '#8FA68E', orden: 2, created_at: dias(30) },
  { id: 'g4', project_id: PROJECT_ID, nombre: 'Trabajo', color: '#9AA5B8', orden: 3, created_at: dias(30) },
]

function invitado(
  n: number, titular: string, grupo_id: string, num: number, estado: EstadoInvitado,
  confirmacion: 'SI' | 'NO' | null = null, whatsapp: string | null = '4420000000',
): Invitado {
  return {
    id: `i${n}`, project_id: PROJECT_ID, grupo_id, titular, num_invitados: num, whatsapp,
    token: `demo-token-${n}`, estado, confirmacion,
    fecha_envio: estado === 'alta' ? null : dias(10 - (n % 5)),
    fecha_confirmacion: confirmacion ? dias(6 - (n % 4)) : null,
    mensaje_felicitacion: confirmacion === 'SI' && n % 3 === 0 ? '¡Felicidades, los queremos mucho!' : null,
    device_id: null, created_at: dias(20 - n), updated_at: dias(2),
  }
}

function semilla(): Invitado[] {
  return [
    invitado(1, 'Familia Medina Torres', 'g1', 4, 'confirmo', 'SI'),
    invitado(2, 'Tíos Ríos Herrera', 'g2', 2, 'confirmo', 'SI'),
    invitado(3, 'Abuela Carmen', 'g1', 1, 'confirmo', 'SI'),
    invitado(4, 'Sofía y Diego', 'g3', 2, 'confirmo', 'SI'),
    invitado(5, 'Familia Herrera Soto', 'g2', 5, 'enviado'),
    invitado(6, 'Mariana López', 'g3', 2, 'enviado'),
    invitado(7, 'Roberto Salinas', 'g4', 2, 'enviado'),
    invitado(8, 'Lucía Vargas', 'g4', 1, 'confirmo', 'NO'),
    invitado(9, 'Primos Ortega', 'g1', 3, 'alta', null, null),
    invitado(10, 'Javier Núñez', 'g3', 2, 'alta'),
    invitado(11, 'Elena Castillo', 'g4', 1, 'alta'),
    invitado(12, 'Tío Alberto', 'g2', 2, 'baja'),
  ].map(i => ({ ...i, grupo: GRUPOS.find(g => g.id === i.grupo_id) }))
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })

/**
 * Sustituye `window.fetch` para las rutas del panel de invitados del slug demo. Los datos viven en
 * memoria: se pueden agregar, confirmar, dar de baja o borrar, y se reinician al recargar.
 * Devuelve la función que restaura el `fetch` original.
 */
export function instalarMockLista(): () => void {
  const original = window.fetch.bind(window)
  let invitados = semilla()
  let grupos = [...GRUPOS]
  let seq = 100
  const prefijo = `/i/${DEMO_LISTA_SLUG}/`

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const raw = typeof input === 'string' ? input : input instanceof URL ? input.pathname : input.url
    const path = raw.split('?')[0]
    if (!path.startsWith(prefijo)) return original(input, init)

    const ruta = path.slice(prefijo.length)
    const metodo = (init?.method ?? 'GET').toUpperCase()
    const body = typeof init?.body === 'string' ? (JSON.parse(init.body) as Record<string, unknown>) : {}

    if (ruta === 'api/invitados' && metodo === 'GET') return json(invitados)
    if (ruta === 'api/grupos' && metodo === 'GET') return json(grupos)

    if (ruta === 'api/invitados' && metodo === 'POST') {
      const grupo_id = String(body.grupo_id)
      const nuevo: Invitado = {
        ...invitado(++seq, String(body.titular), grupo_id, Number(body.num_invitados) || 1, 'alta', null, (body.whatsapp as string) || null),
        created_at: ahora(), updated_at: ahora(),
        grupo: grupos.find(g => g.id === grupo_id),
      }
      invitados = [nuevo, ...invitados]
      return json(nuevo, 201)
    }

    if (ruta === 'api/grupos' && metodo === 'POST') {
      const nuevo: GrupoEvento = {
        id: `g${++seq}`, project_id: PROJECT_ID, nombre: String(body.nombre), color: String(body.color),
        orden: grupos.length, created_at: ahora(),
      }
      grupos = [...grupos, nuevo]
      return json(nuevo, 201)
    }

    const m = ruta.match(/^api\/invitados\/([^/]+)$/)
    if (m) {
      const id = m[1]
      if (metodo === 'DELETE') {
        invitados = invitados.filter(i => i.id !== id)
        return json({ ok: true })
      }
      if (metodo === 'PUT') {
        let actualizado: Invitado | undefined
        invitados = invitados.map(i => {
          if (i.id !== id) return i
          const merged = { ...i, ...body, updated_at: ahora() } as Invitado
          merged.grupo = grupos.find(g => g.id === merged.grupo_id)
          actualizado = merged
          return merged
        })
        return actualizado ? json(actualizado) : json({ error: 'No encontrado' }, 404)
      }
    }

    if (ruta === 'api/exportar') {
      const filas = invitados.map(i => `${i.titular},${grupos.find(g => g.id === i.grupo_id)?.nombre ?? ''},${i.num_invitados},${i.whatsapp ?? ''},${i.estado}`)
      return new Response(['titular,grupo,num_invitados,whatsapp,estado', ...filas].join('\n'), { headers: { 'Content-Type': 'text/csv' } })
    }
    if (ruta === 'api/importar') return json({ summary: 'Demo: la importación de CSV está disponible en la versión real.' })

    // Boletos en PDF: no se generan en el demo (el botón no hace nada).
    return json({ error: 'No disponible en el demo' }, 404)
  }

  return () => { window.fetch = original }
}
