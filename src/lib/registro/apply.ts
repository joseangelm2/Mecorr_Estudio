import type { Project, TimelineItem } from '@/types/invitation'
import { isBoda, type ClientData, type ItineraryKind, type SectionData, type SectionId } from './schema'

type Patch = Record<string, unknown>

/** Archivo de ícono (sin extensión) por tipo de evento en las plantillas de boda. */
const KIND_ICON: Record<ItineraryKind, string> = {
  ceremonia: 'iglesia',
  recepcion: 'recepcion',
  coctel: 'coctel',
  cena: 'comida',
  vals: 'vals',
  baile: 'baile',
  fin: 'fin',
  otro: 'recepcion',
}

export function iconForKind(template: Project['template'], kind: ItineraryKind): string {
  return isBoda(template) ? `/images/${template}/${KIND_ICON[kind]}.svg` : ''
}

export function kindFromIcon(icon: string | undefined): ItineraryKind {
  const name = (icon ?? '').split('/').pop()?.replace(/\.[a-z]+$/i, '') ?? ''
  const found = (Object.entries(KIND_ICON) as [ItineraryKind, string][]).find(([k, f]) => k !== 'otro' && f === name)
  return found ? found[0] : 'otro'
}

/** Escribe o, si el valor está vacío, quita la clave (así lo hace también el admin). */
function setExtra(extra: Record<string, unknown>, key: string, value: unknown) {
  const empty =
    value === undefined ||
    value === null ||
    value === '' ||
    value === false ||
    (Array.isArray(value) && value.length === 0)
  if (empty) delete extra[key]
  else extra[key] = value
}

const clean = (list: string[]) => list.map(s => s.trim()).filter(Boolean)

/**
 * Convierte los datos validados de una sección en el update de `projects`.
 * Solo toca las columnas/claves de esa sección; `extra_config` se fusiona con lo que
 * ya había para no borrar el diseño que puso el admin. Nunca toca status/template/slug/color_theme.
 */
export function buildUpdate<K extends SectionId>(project: Project, section: K, data: SectionData<K>): Patch {
  const extra: Record<string, unknown> = { ...(project.extra_config ?? {}) }
  const boda = isBoda(project.template)
  const patch: Patch = {}

  switch (section) {
    case 'datos': {
      const d = data as SectionData<'datos'>
      patch.quinceanera_name = boda
        ? [d.novia, d.novio].map(n => n.trim()).filter(Boolean).join(' & ')
        : d.nombre.trim()
      if (boda) {
        setExtra(extra, 'nombre_novia', d.novia.trim())
        setExtra(extra, 'nombre_novio', d.novio.trim())
      }
      patch.event_date = d.event_date
      patch.hashtag = d.hashtag || null
      patch.invitation_text = d.invitation_text || null
      break
    }
    case 'contacto': {
      const d = data as SectionData<'contacto'>
      patch.rsvp_phone = d.rsvp_phone || null
      setExtra(extra, 'rsvp_phones', d.rsvp_phones.filter(p => p.phone.trim()))
      setExtra(extra, 'rsvp_email', d.rsvp_email)
      patch.confirmation_phrase = d.confirmation_phrase || null
      patch.important_info_text = d.important_info_text || null
      break
    }
    case 'familia': {
      const d = data as SectionData<'familia'>
      patch.parent_names = clean(d.parent_names)
      patch.padrinos = clean(d.padrinos)
      if (boda) setExtra(extra, 'padres_novio', clean(d.padres_novio))
      if (project.template === 'bodasobre') {
        setExtra(extra, 'familia_frase', d.familia_frase)
      }
      break
    }
    case 'lugares': {
      const d = data as SectionData<'lugares'>
      const toLocation = (p: SectionData<'lugares'>['ceremony']) =>
        p.venue || p.address
          ? {
              venue: p.venue,
              address: p.address,
              time: p.time,
              mapsUrl: p.mapsUrl,
              mapLink: p.mapsUrl,
              photoUrl: p.photoUrl || undefined,
            }
          : null
      patch.ceremony = toLocation(d.ceremony)
      patch.reception = toLocation(d.reception)
      if (boda) setExtra(extra, 'hospedajes', d.hospedajes.filter(h => h.nombre.trim()))
      break
    }
    case 'itinerario': {
      const d = data as SectionData<'itinerario'>
      patch.itinerary = d.items
        .filter(i => i.time || i.description)
        .map((i): TimelineItem => {
          // En plantillas que no son de boda el ícono lo asigna el admin: viaja con cada ítem.
          const icon = isBoda(project.template) ? iconForKind(project.template, i.kind) : i.icon
          return { title: i.description, time: i.time, description: i.description, icon, iconSrc: icon }
        })
      break
    }
    case 'vestimenta': {
      const d = data as SectionData<'vestimenta'>
      patch.dress_code = d.colors || d.notes ? { colors: d.colors, notes: d.notes } : null
      break
    }
    case 'regalos': {
      const d = data as SectionData<'regalos'>
      const g = d.gift_registry
      patch.gift_registry =
        g.liverpoolLink || g.bankAccount
          ? {
              giftStore: g.giftStore,
              liverpoolLink: g.liverpoolLink || undefined,
              bankAccount: g.bankAccount || undefined,
              bankAccountType: g.bankAccountType,
              bankBeneficiary: g.bankBeneficiary || undefined,
            }
          : null
      setExtra(extra, 'gift_registries', d.gift_registries.filter(r => r.liverpoolLink))
      patch.show_lluvia_sobres = d.show_lluvia_sobres
      patch.show_datos_bancarios = d.show_datos_bancarios
      break
    }
    case 'musica': {
      const d = data as SectionData<'musica'>
      // Es una sugerencia para el admin: NO toca music_url (ese es el archivo de audio que reproduce la invitación).
      setExtra(extra, 'musica_sugerida', d.cancion.trim() || d.enlace ? { cancion: d.cancion.trim(), enlace: d.enlace } : '')
      break
    }
  }

  patch.extra_config = extra
  return patch
}

/** Valores iniciales del formulario a partir de lo que ya hay en el proyecto (para volver a editar). */
export function initialData(project: Project): ClientData {
  const extra = project.extra_config ?? {}
  const str = (v: unknown) => (typeof v === 'string' ? v : '')
  const list = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [])
  const musica = (extra.musica_sugerida && typeof extra.musica_sugerida === 'object' ? extra.musica_sugerida : {}) as Record<string, unknown>
  const boda = isBoda(project.template)
  const [novia = '', novio = ''] = boda ? project.quinceanera_name.split(/\s*&\s*/) : []
  const place = (l: Project['ceremony']) => ({
    venue: l?.venue ?? '',
    address: l?.address ?? '',
    time: l?.time ?? '',
    mapsUrl: l?.mapsUrl ?? l?.mapLink ?? '',
    photoUrl: l?.photoUrl ?? '',
  })
  const g = project.gift_registry
  const hospedajes = Array.isArray(extra.hospedajes) ? (extra.hospedajes as Record<string, unknown>[]) : []
  const phones = Array.isArray(extra.rsvp_phones) ? (extra.rsvp_phones as Record<string, unknown>[]) : []
  const regs = Array.isArray(extra.gift_registries) ? (extra.gift_registries as Record<string, unknown>[]) : []
  const stores = ['liverpool', 'amazon', 'palacio', 'sears', 'generic'] as const
  const store = (v: unknown) => stores.find(s => s === v) ?? 'generic'

  return {
    datos: {
      nombre: boda ? '' : project.quinceanera_name,
      novia: str(extra.nombre_novia) || novia,
      novio: str(extra.nombre_novio) || novio,
      event_date: project.event_date ? project.event_date.slice(0, 16) : '',
      hashtag: project.hashtag ?? '',
      invitation_text: project.invitation_text ?? '',
    },
    contacto: {
      rsvp_phone: project.rsvp_phone ?? '',
      rsvp_phones: phones.map(p => ({ label: str(p.label), phone: str(p.phone) })),
      rsvp_email: str(extra.rsvp_email),
      confirmation_phrase: project.confirmation_phrase ?? '',
      important_info_text: project.important_info_text ?? '',
    },
    familia: {
      parent_names: project.parent_names ?? [],
      padrinos: project.padrinos ?? [],
      padres_novio: list(extra.padres_novio),
      familia_frase: str(extra.familia_frase),
    },
    lugares: {
      ceremony: place(project.ceremony),
      reception: place(project.reception),
      hospedajes: hospedajes.map(h => ({
        nombre: str(h.nombre),
        fotoUrl: str(h.fotoUrl),
        mapsUrl: str(h.mapsUrl),
        sitioWeb: str(h.sitioWeb),
        telefono: str(h.telefono),
        nota: str(h.nota),
      })),
    },
    itinerario: {
      items: (project.itinerary ?? []).map(i => ({
        time: i.time ?? '',
        description: i.description ?? i.title ?? '',
        kind: kindFromIcon(i.icon ?? i.iconSrc),
        icon: i.icon ?? i.iconSrc ?? '',
      })),
    },
    vestimenta: { colors: project.dress_code?.colors ?? '', notes: project.dress_code?.notes ?? '' },
    regalos: {
      gift_registry: {
        giftStore: g?.giftStore ?? 'liverpool',
        liverpoolLink: g?.liverpoolLink ?? '',
        bankAccount: g?.bankAccount ?? '',
        bankAccountType: g?.bankAccountType ?? 'clabe',
        bankBeneficiary: g?.bankBeneficiary ?? '',
      },
      gift_registries: regs.map(r => ({ giftStore: store(r.giftStore), liverpoolLink: str(r.liverpoolLink) })),
      show_lluvia_sobres: project.show_lluvia_sobres ?? false,
      show_datos_bancarios: project.show_datos_bancarios ?? false,
    },
    musica: {
      cancion: str(musica.cancion),
      enlace: str(musica.enlace),
    },
  }
}
