'use client'

import { useState, type ReactNode } from 'react'
import { saveSection, submitForReview } from '@/app/registro/[token]/actions'
import { to12h, to24h } from '@/lib/registro/time'
import {
  isBoda,
  ITINERARY_KINDS,
  SECTION_META,
  SECTION_ORDER,
  type ClientData,
  type ItineraryKind,
  type SectionData,
  type SectionId,
} from '@/lib/registro/schema'

interface Props {
  token: string
  template: string
  initial: ClientData
}

const KIND_LABEL: Record<ItineraryKind, string> = {
  ceremonia: 'Ceremonia',
  recepcion: 'Recepción',
  coctel: 'Coctel',
  cena: 'Cena',
  vals: 'Vals',
  baile: 'Baile',
  fin: 'Fin del evento',
  otro: 'Otro',
}

const STORES = [
  { value: 'liverpool', label: 'Liverpool' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'palacio', label: 'El Palacio de Hierro' },
  { value: 'sears', label: 'Sears' },
  { value: 'generic', label: 'Otra tienda' },
] as const

const inputCls =
  'w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100'

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      {children}
      {hint && <span className="block text-xs text-gray-500">{hint}</span>}
    </label>
  )
}

function TextInput({
  value,
  onChange,
  ...rest
}: { value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return <input {...rest} value={value} onChange={e => onChange(e.target.value)} className={inputCls} />
}

function TimeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input type="time" value={to24h(value)} onChange={e => onChange(to12h(e.target.value))} className={inputCls} />
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="h-4 w-4 accent-rose-500" />
      <span className="text-sm text-gray-800">{label}</span>
    </label>
  )
}

function StringList({
  items,
  onChange,
  max,
  placeholder,
  addLabel,
}: {
  items: string[]
  onChange: (v: string[]) => void
  max: number
  placeholder: string
  addLabel: string
}) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <TextInput value={it} placeholder={placeholder} onChange={v => onChange(items.map((x, j) => (j === i ? v : x)))} />
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="px-2 text-sm text-red-500" aria-label="Quitar">
            ✕
          </button>
        </div>
      ))}
      {items.length < max && (
        <button type="button" onClick={() => onChange([...items, ''])} className="text-sm font-medium text-rose-600">
          + {addLabel}
        </button>
      )}
    </div>
  )
}

/** Pantalla final: sin opción de editar (el enlace ya está cerrado) y con la descarga de la copia en PDF. */
export function RegistroDone({ token, pdfReady }: { token: string; pdfReady: boolean }) {
  return (
    <div className="rg-root min-h-screen bg-gray-50 pb-10">
      <div className="bg-[#0d0d1a] px-5 py-4">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/promo/logo_mecorr.png" alt="MeCorr Estudio" className="h-10 w-auto" />
          <span className="text-xs text-white/70">Datos de tu invitación</span>
        </div>
      </div>
      <main className="mx-auto max-w-xl px-5 pt-6">
        <div className="rounded-2xl border border-green-200 bg-white p-6 text-center shadow-sm">
          <div className="text-4xl">🎉</div>
          <h1 className="mt-2 text-xl font-bold text-gray-900">¡Listo! Recibimos tus datos</h1>
          <p className="mt-2 text-sm text-gray-600">Revisaremos todo y te avisaremos cuando tu invitación esté lista.</p>
          {pdfReady && (
            <a
              href={`/registro/${token}/pdf`}
              download
              className="mt-5 block w-full rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white"
            >
              Descargar copia de mis respuestas (PDF)
            </a>
          )}
        </div>
      </main>
    </div>
  )
}

export function RegistroForm({ token, template, initial }: Props) {
  const boda = isBoda(template)
  const [data, setData] = useState<ClientData>(initial)
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  // El servidor cierra el enlace al enviar; pdfReady indica si ya hay copia en PDF para descargar.
  const [pdfReady, setPdfReady] = useState(false)

  const steps = SECTION_ORDER
  const reviewStep = steps.length
  const current = step < steps.length ? steps[step] : null

  function set<K extends SectionId>(
    section: K,
    patch: Partial<SectionData<K>> | ((prev: SectionData<K>) => Partial<SectionData<K>>),
  ) {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...(typeof patch === 'function' ? patch(prev[section]) : patch) },
    }))
  }

  async function saveCurrent(): Promise<boolean> {
    if (!current) return true
    setSaving(true)
    setError(null)
    const res = await saveSection(token, current, data[current])
    setSaving(false)
    if (!res.ok) {
      setError(res.error)
      return false
    }
    return true
  }

  async function next() {
    if (await saveCurrent()) {
      setStep(s => Math.min(s + 1, reviewStep))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function back() {
    setError(null)
    setStep(s => Math.max(s - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function submit() {
    setSaving(true)
    setError(null)
    const res = await submitForReview(token)
    setSaving(false)
    if (!res.ok) setError(res.error)
    else {
      setPdfReady(res.pdfReady)
      setDone(true)
    }
  }

  if (done) return <RegistroDone token={token} pdfReady={pdfReady} />

  const progress = Math.round((Math.min(step, reviewStep) / reviewStep) * 100)

  return (
    <div className="rg-root min-h-screen bg-gray-50 pb-28">
      <div className="bg-[#0d0d1a] px-5 py-4">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/promo/logo_mecorr.png" alt="MeCorr Estudio" className="h-10 w-auto" />
          <span className="text-xs text-white/70">Datos de tu invitación</span>
        </div>
      </div>

      <main className="mx-auto max-w-xl px-5 pt-6">
        {(
          <>
            <div className="mb-5">
              <div className="mb-1.5 flex justify-between text-xs text-gray-500">
                <span>{step < reviewStep ? `Paso ${step + 1} de ${steps.length}` : 'Último paso'}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                <div className="h-1.5 rounded-full bg-rose-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              {current ? (
                <>
                  <h1 className="text-lg font-bold text-gray-900">
                    {SECTION_META[current].title}
                    {SECTION_META[current].optional && (
                      <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 align-middle text-xs font-medium text-gray-600">Opcional</span>
                    )}
                  </h1>
                  <p className="mt-0.5 text-sm text-gray-500">{SECTION_META[current].description}</p>
                  {SECTION_META[current].optional ? (
                    <p className="mb-5 mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                      Esta sección es opcional: puedes dejarla en blanco y continuar.
                    </p>
                  ) : (
                    <div className="mb-5" />
                  )}
                  <div className="space-y-4">{renderSection(current)}</div>
                </>
              ) : (
                <>
                  <h1 className="text-lg font-bold text-gray-900">Revisa y envía</h1>
                  <p className="mb-4 mt-0.5 text-sm text-gray-500">
                    Ya guardamos cada paso. Toca uno para corregirlo o envía tus datos a MeCorr Estudio.
                  </p>
                  <ul className="divide-y divide-gray-100">
                    {steps.map((s, i) => (
                      <li key={s}>
                        <button type="button" onClick={() => setStep(i)} className="flex w-full items-center justify-between py-3 text-left text-sm">
                          <span className="text-gray-800">
                            {SECTION_META[s].title}
                            {SECTION_META[s].optional && <span className="ml-1 text-xs text-gray-400">(opcional)</span>}
                          </span>
                          <span className="text-rose-600">Editar</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            </div>
          </>
        )}
      </main>

      {(
        <div className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white/95 px-5 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-xl gap-3">
            {step > 0 && (
              <button type="button" onClick={back} disabled={saving} className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">
                Atrás
              </button>
            )}
            {step < reviewStep ? (
              <button
                type="button"
                onClick={next}
                disabled={saving}
                className="flex-1 rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? 'Guardando…' : 'Guardar y continuar'}
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={saving}
                className="flex-1 rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? 'Enviando…' : 'Enviar mis datos'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )

  function renderSection(section: SectionId): ReactNode {
    switch (section) {
      case 'datos': {
        const d = data.datos
        return (
          <>
            {boda ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nombre de la novia">
                    <TextInput value={d.novia} onChange={v => set('datos', { novia: v })} placeholder="Ej. Laura" />
                  </Field>
                  <Field label="Nombre del novio">
                    <TextInput value={d.novio} onChange={v => set('datos', { novio: v })} placeholder="Ej. Andrés" />
                  </Field>
                </div>
                <p className="-mt-2 text-xs text-gray-500">
                  Escríbelos como quieres que se vean en la invitación. La dirección web (enlace) de tu invitación la
                  define MeCorr Estudio y no cambia.
                </p>
              </>
            ) : (
              <Field
                label="¿Cómo quieres que se vea tu nombre?"
                hint="Escríbelo tal como quieres que aparezca en la invitación. La dirección web (enlace) de tu invitación la define MeCorr Estudio y no cambia."
              >
                <TextInput value={d.nombre} onChange={v => set('datos', { nombre: v })} placeholder="Ej. Valeria" />
              </Field>
            )}
            <Field label="Fecha y hora del evento">
              <input
                type="datetime-local"
                value={d.event_date}
                onChange={e => set('datos', { event_date: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Hashtag (opcional)">
              <TextInput value={d.hashtag} onChange={v => set('datos', { hashtag: v })} placeholder="#MisXV" />
            </Field>
            <Field label="Mensaje de invitación (opcional)" hint="Aparece en la portada de tu invitación.">
              <textarea
                value={d.invitation_text}
                onChange={e => set('datos', { invitation_text: e.target.value })}
                rows={4}
                className={inputCls}
              />
            </Field>
          </>
        )
      }

      case 'contacto': {
        const d = data.contacto
        return (
          <>
            <Field label="WhatsApp para confirmar asistencia" hint="Los invitados te confirmarán a este número.">
              <TextInput type="tel" value={d.rsvp_phone} onChange={v => set('contacto', { rsvp_phone: v })} placeholder="55 1234 5678" />
            </Field>
            {d.rsvp_phones.map((p, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <TextInput value={p.label} placeholder="Quién (ej. Mamá)" onChange={v => set('contacto', { rsvp_phones: d.rsvp_phones.map((x, j) => (j === i ? { ...x, label: v } : x)) })} />
                <TextInput type="tel" value={p.phone} placeholder="Teléfono" onChange={v => set('contacto', { rsvp_phones: d.rsvp_phones.map((x, j) => (j === i ? { ...x, phone: v } : x)) })} />
                <button type="button" className="px-2 text-red-500" onClick={() => set('contacto', { rsvp_phones: d.rsvp_phones.filter((_, j) => j !== i) })} aria-label="Quitar">✕</button>
              </div>
            ))}
            {d.rsvp_phones.length < 3 && (
              <button type="button" className="text-sm font-medium text-rose-600" onClick={() => set('contacto', { rsvp_phones: [...d.rsvp_phones, { label: '', phone: '' }] })}>
                + Agregar otro número
              </button>
            )}
            <Field label="Frase de confirmación" hint="Ej. Favor de confirmar asistencia antes del 1 de diciembre.">
              <TextInput value={d.confirmation_phrase} onChange={v => set('contacto', { confirmation_phrase: v })} />
            </Field>
            <Field label="Información importante (opcional)" hint="Ej. No niños, estacionamiento, sugerencia de hospedaje…">
              <textarea value={d.important_info_text} onChange={e => set('contacto', { important_info_text: e.target.value })} rows={3} className={inputCls} />
            </Field>
          </>
        )
      }

      case 'familia': {
        const d = data.familia
        return (
          <>
            <Field label={boda ? 'Padres de la novia' : 'Mis padres'}>
              <StringList items={d.parent_names} max={4} placeholder="Nombre completo" addLabel="Agregar nombre" onChange={v => set('familia', { parent_names: v })} />
            </Field>
            {boda && (
              <Field label="Padres del novio">
                <StringList items={d.padres_novio} max={4} placeholder="Nombre completo" addLabel="Agregar nombre" onChange={v => set('familia', { padres_novio: v })} />
              </Field>
            )}
            <Field label="Padrinos">
              <StringList items={d.padrinos} max={6} placeholder="Nombre completo" addLabel="Agregar padrino" onChange={v => set('familia', { padrinos: v })} />
            </Field>
            {template === 'bodasobre' && (
              <>
                <Field label="Frase para la sección de familia (opcional)">
                  <TextInput value={d.familia_frase} onChange={v => set('familia', { familia_frase: v })} />
                </Field>
              </>
            )}
          </>
        )
      }

      case 'lugares': {
        const d = data.lugares
        const placeEditor = (key: 'ceremony' | 'reception', title: string) => {
          const p = d[key]
          const up = (patch: Partial<typeof p>) => set('lugares', { [key]: { ...p, ...patch } })
          return (
            <fieldset className="space-y-3 rounded-xl border border-gray-200 p-4">
              <legend className="px-1 text-sm font-semibold text-gray-800">{title}</legend>
              <Field label="Nombre del lugar">
                <TextInput value={p.venue} onChange={v => up({ venue: v })} placeholder="Parroquia de San Miguel" />
              </Field>
              <Field label="Dirección">
                <TextInput value={p.address} onChange={v => up({ address: v })} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Hora">
                  <TimeInput value={p.time} onChange={v => up({ time: v })} />
                </Field>
                <Field label="Enlace de Google Maps">
                  <TextInput type="url" value={p.mapsUrl} onChange={v => up({ mapsUrl: v })} placeholder="https://maps.app.goo.gl/…" />
                </Field>
              </div>
            </fieldset>
          )
        }
        return (
          <>
            {placeEditor('ceremony', 'Ceremonia')}
            {placeEditor('reception', 'Recepción')}
            {boda && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-800">Hospedaje recomendado (opcional)</h2>
                {d.hospedajes.map((h, i) => {
                  const up = (patch: Partial<typeof h>) => set('lugares', { hospedajes: d.hospedajes.map((x, j) => (j === i ? { ...x, ...patch } : x)) })
                  return (
                    <fieldset key={i} className="space-y-3 rounded-xl border border-gray-200 p-4">
                      <div className="flex justify-between">
                        <span className="text-xs font-medium uppercase text-gray-500">Hotel {i + 1}</span>
                        <button type="button" className="text-xs text-red-500" onClick={() => set('lugares', { hospedajes: d.hospedajes.filter((_, j) => j !== i) })}>Quitar</button>
                      </div>
                      <TextInput value={h.nombre} placeholder="Nombre del hotel" onChange={v => up({ nombre: v })} />
                      <TextInput type="tel" value={h.telefono} placeholder="Teléfono" onChange={v => up({ telefono: v })} />
                      <TextInput type="url" value={h.mapsUrl} placeholder="Enlace de Google Maps" onChange={v => up({ mapsUrl: v })} />
                      <TextInput type="url" value={h.sitioWeb} placeholder="Sitio web" onChange={v => up({ sitioWeb: v })} />
                      <TextInput value={h.nota} placeholder="Nota (ej. tarifa especial para invitados)" onChange={v => up({ nota: v })} />
                    </fieldset>
                  )
                })}
                {d.hospedajes.length < 6 && (
                  <button
                    type="button"
                    className="text-sm font-medium text-rose-600"
                    onClick={() => set('lugares', { hospedajes: [...d.hospedajes, { nombre: '', fotoUrl: '', mapsUrl: '', sitioWeb: '', telefono: '', nota: '' }] })}
                  >
                    + Agregar hotel
                  </button>
                )}
              </div>
            )}
          </>
        )
      }

      case 'itinerario': {
        const items = data.itinerario.items
        const up = (i: number, patch: Partial<(typeof items)[number]>) =>
          set('itinerario', { items: items.map((x, j) => (j === i ? { ...x, ...patch } : x)) })
        return (
          <>
            {items.map((it, i) => (
              <div key={i} className="space-y-2 rounded-xl border border-gray-200 p-3">
                <div className="grid grid-cols-[110px_1fr] gap-2">
                  <TimeInput value={it.time} onChange={v => up(i, { time: v })} />
                  <TextInput value={it.description} placeholder="Ej. Ceremonia religiosa" onChange={v => up(i, { description: v })} />
                </div>
                <div className="flex items-center gap-2">
                  {boda && (
                    <select value={it.kind} onChange={e => up(i, { kind: e.target.value as ItineraryKind })} className={inputCls}>
                      {ITINERARY_KINDS.map(k => (
                        <option key={k} value={k}>{KIND_LABEL[k]}</option>
                      ))}
                    </select>
                  )}
                  <button type="button" className="shrink-0 px-2 text-sm text-red-500" onClick={() => set('itinerario', { items: items.filter((_, j) => j !== i) })}>
                    Quitar
                  </button>
                </div>
              </div>
            ))}
            {items.length < 14 && (
              <button
                type="button"
                className="w-full rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 hover:border-rose-400 hover:text-rose-600"
                onClick={() => set('itinerario', { items: [...items, { time: '', description: '', kind: 'otro', icon: '' }] })}
              >
                + Agregar al programa
              </button>
            )}
          </>
        )
      }

      case 'vestimenta': {
        const d = data.vestimenta
        return (
          <>
            <Field label="Código de vestimenta" hint="Ej. Formal / Etiqueta">
              <TextInput value={d.colors} onChange={v => set('vestimenta', { colors: v })} />
            </Field>
            <Field label="Notas (opcional)" hint="Ej. El blanco está reservado para la novia.">
              <textarea value={d.notes} onChange={e => set('vestimenta', { notes: e.target.value })} rows={3} className={inputCls} />
            </Field>
          </>
        )
      }

      case 'regalos': {
        const d = data.regalos
        const g = d.gift_registry
        const upG = (patch: Partial<typeof g>) => set('regalos', { gift_registry: { ...g, ...patch } })
        return (
          <>
            <fieldset className="space-y-3 rounded-xl border border-gray-200 p-4">
              <legend className="px-1 text-sm font-semibold text-gray-800">Mesa de regalos</legend>
              <select value={g.giftStore} onChange={e => upG({ giftStore: e.target.value as typeof g.giftStore })} className={inputCls}>
                {STORES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <TextInput type="url" value={g.liverpoolLink} placeholder="Enlace de tu mesa de regalos" onChange={v => upG({ liverpoolLink: v })} />
              {d.gift_registries.map((r, i) => (
                <div key={i} className="grid grid-cols-[130px_1fr_auto] gap-2">
                  <select
                    value={r.giftStore}
                    onChange={e => set('regalos', { gift_registries: d.gift_registries.map((x, j) => (j === i ? { ...x, giftStore: e.target.value as typeof r.giftStore } : x)) })}
                    className={inputCls}
                  >
                    {STORES.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <TextInput type="url" value={r.liverpoolLink} placeholder="Enlace" onChange={v => set('regalos', { gift_registries: d.gift_registries.map((x, j) => (j === i ? { ...x, liverpoolLink: v } : x)) })} />
                  <button type="button" className="px-2 text-red-500" onClick={() => set('regalos', { gift_registries: d.gift_registries.filter((_, j) => j !== i) })} aria-label="Quitar">✕</button>
                </div>
              ))}
              {d.gift_registries.length < 3 && (
                <button type="button" className="text-sm font-medium text-rose-600" onClick={() => set('regalos', { gift_registries: [...d.gift_registries, { giftStore: 'generic', liverpoolLink: '' }] })}>
                  + Agregar otra tienda
                </button>
              )}
            </fieldset>
            <Toggle checked={d.show_lluvia_sobres} onChange={v => set('regalos', { show_lluvia_sobres: v })} label="Mostrar “Lluvia de sobres”" />
            <Toggle checked={d.show_datos_bancarios} onChange={v => set('regalos', { show_datos_bancarios: v })} label="Mostrar mis datos bancarios" />
            {d.show_datos_bancarios && (
              <fieldset className="space-y-3 rounded-xl border border-gray-200 p-4">
                <legend className="px-1 text-sm font-semibold text-gray-800">Datos bancarios</legend>
                <TextInput value={g.bankBeneficiary} placeholder="Nombre del beneficiario" onChange={v => upG({ bankBeneficiary: v })} />
                <select value={g.bankAccountType} onChange={e => upG({ bankAccountType: e.target.value as typeof g.bankAccountType })} className={inputCls}>
                  <option value="clabe">CLABE interbancaria</option>
                  <option value="tarjeta">Número de tarjeta</option>
                </select>
                <TextInput inputMode="numeric" value={g.bankAccount} placeholder="Número" onChange={v => upG({ bankAccount: v })} />
              </fieldset>
            )}
          </>
        )
      }

      case 'musica': {
        const d = data.musica
        return (
          <>
            <Field label="Canción y artista" hint="Ej. “Perfect” — Ed Sheeran. Podemos usar la que más te guste.">
              <TextInput value={d.cancion} onChange={v => set('musica', { cancion: v })} placeholder="Nombre de la canción y artista" />
            </Field>
            <Field label="Enlace de YouTube o Spotify (opcional)" hint="Pega el enlace de la canción para que la encontremos rápido.">
              <TextInput type="url" value={d.enlace} onChange={v => set('musica', { enlace: v })} placeholder="https://open.spotify.com/track/…" />
            </Field>
          </>
        )
      }
    }
  }
}
