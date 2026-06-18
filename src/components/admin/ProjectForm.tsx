'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { generateSlug } from '@/lib/slug'
import { createProject, updateProject, type ProjectFormData } from '@/app/admin/actions'
import type { Project, TemplateId } from '@/types/invitation'
import { THEMES } from '@/lib/themes'
import { ELEGANCE_THEMES } from '@/lib/elegance-themes'

// Lazy: arrastra el cliente de Supabase — no necesario en el bundle inicial
const MediaUploader = dynamic(() => import('@/components/admin/MediaUploader'), { ssr: false })

const TEMPLATES: { value: TemplateId; label: string; emoji: string }[] = [
  { value: 'sobre', label: 'Sobre Animado', emoji: '💌' },
  { value: 'esmeralda', label: 'Esmeralda', emoji: '💚' },
  { value: 'pink', label: 'Pink', emoji: '🌸' },
  { value: 'love', label: 'Love', emoji: '❤️' },
  { value: 'zafiro', label: 'Zafiro', emoji: '💎' },
  { value: 'elegance', label: 'Elegance', emoji: '👑' },
  { value: 'hogwarts', label: 'Hogwarts', emoji: '🪄' },
  { value: 'sellorosa', label: 'Sello Rosa', emoji: '🌹' },
  { value: 'rosagold', label: 'Rosa Gold', emoji: '✨' },
  { value: 'magical', label: 'Magical', emoji: '🦋' },
]

const TABS = [
  { label: 'General', icon: '◈' },
  { label: 'Contacto', icon: '✉' },
  { label: 'Familia', icon: '♡' },
  { label: 'Ceremonia', icon: '⛪' },
  { label: 'Recepción', icon: '🥂' },
  { label: 'Itinerario', icon: '📋' },
  { label: 'Estilo', icon: '🎨' },
  { label: 'Media', icon: '🖼' },
]

function toFormData(project?: Project): ProjectFormData {
  if (!project) {
    return {
      slug: '', template: 'sobre', status: 'draft',
      quinceanera_name: '', guest_name: '', event_date: '',
      rsvp_phone: '', hashtag: '', music_url: '', hero_photo_url: '',
      parent_names: ['', ''], padrinos: ['', ''],
      ceremony_venue: '', ceremony_address: '', ceremony_time: '', ceremony_map_link: '', ceremony_photo_url: '',
      reception_venue: '', reception_address: '', reception_time: '', reception_map_link: '', reception_photo_url: '',
      itinerary: [{ time: '', description: '', icon: '' }],
      dress_code_colors: '', dress_code_notes: '',
      photos: [''],
      liverpool_link: '', bank_account: '', bank_beneficiary: '', gift_store: 'liverpool',
      parents_title: '', padrinos_title: '',
      color_theme: 'rosagold',
      invitation_text: '',
      show_video: false, video_youtube_id: '', video_url: '',
      show_lluvia_sobres: false, lluvia_sobres_text: '',
      show_datos_bancarios: false, datos_bancarios_text: '',
      show_itinerary: true,
      confirmation_phrase: '', confirmation_highlight_date: '',
    }
  }
  return {
    slug: project.slug,
    template: project.template,
    status: project.status,
    quinceanera_name: project.quinceanera_name,
    guest_name: project.guest_name ?? '',
    event_date: project.event_date ? project.event_date.slice(0, 16) : '',
    rsvp_phone: project.rsvp_phone ?? '',
    hashtag: project.hashtag ?? '',
    music_url: project.music_url ?? '',
    hero_photo_url: project.hero_photo_url ?? '',
    parent_names: project.parent_names.length ? project.parent_names : ['', ''],
    padrinos: project.padrinos.length ? project.padrinos : ['', ''],
    ceremony_venue: project.ceremony?.venue ?? '',
    ceremony_address: project.ceremony?.address ?? '',
    ceremony_time: project.ceremony?.time ?? '',
    ceremony_map_link: project.ceremony?.mapsUrl ?? project.ceremony?.mapLink ?? '',
    ceremony_photo_url: project.ceremony?.photoUrl ?? '',
    reception_venue: project.reception?.venue ?? '',
    reception_address: project.reception?.address ?? '',
    reception_time: project.reception?.time ?? '',
    reception_map_link: project.reception?.mapsUrl ?? project.reception?.mapLink ?? '',
    reception_photo_url: project.reception?.photoUrl ?? '',
    itinerary: project.itinerary.length
      ? project.itinerary.map(i => ({ time: i.time, description: i.description ?? i.title, icon: i.icon ?? i.iconSrc }))
      : [{ time: '', description: '', icon: '' }],
    dress_code_colors: project.dress_code?.colors ?? '',
    dress_code_notes: project.dress_code?.notes ?? '',
    photos: project.photos.length ? project.photos : [''],
    liverpool_link: project.gift_registry?.liverpoolLink ?? '',
    bank_account: project.gift_registry?.bankAccount ?? '',
    bank_beneficiary: project.gift_registry?.bankBeneficiary ?? '',
    gift_store: project.gift_registry?.giftStore ?? 'liverpool',
    parents_title:  (project.extra_config?.parents_title  as string) ?? '',
    padrinos_title: (project.extra_config?.padrinos_title as string) ?? '',
    color_theme: project.color_theme ?? 'rosagold',
    invitation_text: project.invitation_text ?? '',
    show_video: project.show_video ?? false,
    video_youtube_id: project.video_youtube_id ?? '',
    video_url: project.video_url ?? '',
    show_lluvia_sobres: project.show_lluvia_sobres ?? false,
    lluvia_sobres_text: project.lluvia_sobres_text ?? '',
    show_datos_bancarios: project.show_datos_bancarios ?? false,
    datos_bancarios_text: project.datos_bancarios_text ?? '',
    show_itinerary: project.show_itinerary ?? true,
    confirmation_phrase: project.confirmation_phrase ?? '',
    confirmation_highlight_date: project.confirmation_highlight_date ?? '',
  }
}

// ── Shared styles ────────────────────────────────────────────────
const input = "w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all bg-white"
const label = "block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide"

function Field({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={label}>{title}</label>
      {children}
    </div>
  )
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5 space-y-5">
      <div>
        <p className="text-base font-semibold text-gray-800">{title}</p>
        {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange, label: lbl }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${checked ? 'bg-rose-500' : 'bg-gray-200'}`}
      role="switch"
      aria-checked={checked}
    >
      <span className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
      <span className="sr-only">{lbl}</span>
    </button>
  )
}

interface Props { project?: Project }

export default function ProjectForm({ project }: Props) {
  const [activeTab, setActiveTab] = useState(0)
  const [form, setForm] = useState<ProjectFormData>(() => toFormData(project))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(field: keyof ProjectFormData, value: unknown) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    set('quinceanera_name', name)
    if (!project) set('slug', generateSlug(name))
  }

  function setArrayItem(field: 'parent_names' | 'padrinos' | 'photos', index: number, value: string) {
    setForm(prev => {
      const arr = [...(prev[field] as string[])]
      arr[index] = value
      return { ...prev, [field]: arr }
    })
  }

  function addArrayItem(field: 'parent_names' | 'padrinos' | 'photos') {
    setForm(prev => ({ ...prev, [field]: [...(prev[field] as string[]), ''] }))
  }

  function removeArrayItem(field: 'parent_names' | 'padrinos' | 'photos', index: number) {
    setForm(prev => {
      const arr = (prev[field] as string[]).filter((_, i) => i !== index)
      return { ...prev, [field]: arr.length ? arr : [''] }
    })
  }

  function setItineraryItem(index: number, key: 'time' | 'description' | 'icon', value: string) {
    setForm(prev => {
      const arr = [...prev.itinerary]
      arr[index] = { ...arr[index], [key]: value }
      return { ...prev, itinerary: arr }
    })
  }

  async function handleSubmit(status: 'draft' | 'published') {
    setLoading(true)
    setError(null)
    try {
      const data = { ...form, status }
      if (project) {
        await updateProject(project.id, data)
      } else {
        await createProject(data)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-100 p-1.5 rounded-2xl overflow-x-auto">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === i
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 0: General */}
      {activeTab === 0 && (
        <div className="space-y-7">
          <Field title="Nombre de la quinceañera *">
            <input type="text" value={form.quinceanera_name} onChange={handleNameChange} required className={input} placeholder="Ej. Valeria García" />
          </Field>

          <div className="grid grid-cols-2 gap-5">
            <Field title="URL (slug) *">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-rose-300 focus-within:border-rose-300 transition-all bg-white">
                <span className="px-4 py-3 text-sm text-gray-400 bg-gray-50 border-r border-gray-200 shrink-0">/i/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => set('slug', e.target.value)}
                  required
                  className="flex-1 px-4 py-3 text-base text-gray-900 placeholder-gray-300 focus:outline-none"
                  placeholder="valeria-garcia"
                />
              </div>
            </Field>
            <Field title="Fecha del evento *">
              <input type="datetime-local" value={form.event_date} onChange={e => set('event_date', e.target.value)} required className={input} />
            </Field>
          </div>

          <Field title="Template *">
            <div className="grid grid-cols-5 gap-3">
              {TEMPLATES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => set('template', t.value)}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 text-center transition-all ${
                    form.template === t.value
                      ? 'border-rose-400 bg-rose-50'
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <span className={`text-xs font-medium leading-tight ${form.template === t.value ? 'text-rose-600' : 'text-gray-500'}`}>{t.label}</span>
                </button>
              ))}
            </div>
          </Field>

          {(form.template === 'sobre' || form.template === 'elegance') && (
            <Field title="Paleta de color">
              <div className="flex flex-wrap gap-4">
                {(form.template === 'sobre' ? THEMES : ELEGANCE_THEMES).map(theme => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => set('color_theme', theme.id)}
                    className="flex flex-col items-center gap-2"
                    title={theme.label}
                  >
                    <span
                      className="w-10 h-10 rounded-full border-4 transition-all"
                      style={{
                        background: theme.swatch,
                        borderColor: form.color_theme === theme.id ? '#f43f5e' : 'transparent',
                        boxShadow: form.color_theme === theme.id ? '0 0 0 2px #fda4af' : '0 0 0 2px #e5e7eb',
                      }}
                    />
                    <span className={`text-xs font-medium ${form.color_theme === theme.id ? 'text-rose-500' : 'text-gray-400'}`}>{theme.label}</span>
                  </button>
                ))}
              </div>
            </Field>
          )}
        </div>
      )}

      {/* Tab 1: Contacto */}
      {activeTab === 1 && (
        <div className="space-y-6">
          <Field title="Nombre del invitado (banner)">
            <input type="text" value={form.guest_name} onChange={e => set('guest_name', e.target.value)} className={input} placeholder="Ej. Familia Martínez" />
          </Field>
          <Field title="Mensaje de invitación">
            <textarea value={form.invitation_text} onChange={e => set('invitation_text', e.target.value)} className={input} rows={4} placeholder="Con cariño te invitamos a compartir nuestro día más especial..." />
          </Field>
          <div className="grid grid-cols-2 gap-5">
            <Field title="WhatsApp RSVP (sin +)">
              <input type="text" value={form.rsvp_phone} onChange={e => set('rsvp_phone', e.target.value)} className={input} placeholder="5218001234567" />
            </Field>
            <Field title="Hashtag">
              <input type="text" value={form.hashtag} onChange={e => set('hashtag', e.target.value)} className={input} placeholder="#XVValeria" />
            </Field>
          </div>
          <Field title="Frase de confirmación">
            <textarea value={form.confirmation_phrase} onChange={e => set('confirmation_phrase', e.target.value)} className={input} rows={2} placeholder="Llena el formulario y no olvides dar clic en el botón de confirmación." />
          </Field>
          <Field title="Fecha resaltada en confirmación">
            <input type="date" value={form.confirmation_highlight_date} onChange={e => set('confirmation_highlight_date', e.target.value)} className={input} />
          </Field>
        </div>
      )}

      {/* Tab 2: Familia */}
      {activeTab === 2 && (
        <div className="space-y-6">
          {form.template === 'elegance' && (
            <SectionCard title="Títulos de sección" description="Personaliza los encabezados (dejar vacío = valor por defecto)">
              <div className="space-y-4">
                <Field title="Título sección Padres">
                  <input value={form.parents_title} onChange={e => set('parents_title', e.target.value)} className={input} placeholder="Mis Padres" />
                </Field>
                <Field title="Título sección Padrinos">
                  <input value={form.padrinos_title} onChange={e => set('padrinos_title', e.target.value)} className={input} placeholder="Mis Padrinos" />
                </Field>
              </div>
            </SectionCard>
          )}

          <SectionCard title="Padres" description="Nombres que aparecerán en la invitación">
            <div className="space-y-3">
              {form.parent_names.map((name, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input type="text" value={name} onChange={e => setArrayItem('parent_names', i, e.target.value)} className={input} placeholder={i === 0 ? 'Nombre del padre' : 'Nombre de la madre'} />
                  <button type="button" onClick={() => removeArrayItem('parent_names', i)} className="w-10 h-10 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 flex items-center justify-center transition-colors shrink-0">✕</button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('parent_names')} className="text-sm text-rose-500 hover:text-rose-600 font-medium flex items-center gap-2 mt-1">
                <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-xs">+</span>
                Agregar padre/madre
              </button>
            </div>
          </SectionCard>

          <SectionCard title="Padrinos" description="Lista de padrinos y madrinas">
            <div className="space-y-3">
              {form.padrinos.map((name, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input type="text" value={name} onChange={e => setArrayItem('padrinos', i, e.target.value)} className={input} placeholder={`Padrino ${i + 1} — Ej. Padrino de Corona`} />
                  <button type="button" onClick={() => removeArrayItem('padrinos', i)} className="w-10 h-10 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 flex items-center justify-center transition-colors shrink-0">✕</button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('padrinos')} className="text-sm text-rose-500 hover:text-rose-600 font-medium flex items-center gap-2 mt-1">
                <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-xs">+</span>
                Agregar padrino/madrina
              </button>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Tab 3: Ceremonia */}
      {activeTab === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <Field title="Nombre del lugar">
              <input type="text" value={form.ceremony_venue} onChange={e => set('ceremony_venue', e.target.value)} className={input} placeholder="Parroquia de San Juan" />
            </Field>
            <Field title="Hora">
              <input type="text" value={form.ceremony_time} onChange={e => set('ceremony_time', e.target.value)} className={input} placeholder="3:00 PM" />
            </Field>
          </div>
          <Field title="Dirección completa">
            <input type="text" value={form.ceremony_address} onChange={e => set('ceremony_address', e.target.value)} className={input} placeholder="Av. Reforma 123, Col. Centro, CDMX" />
          </Field>
          <Field title="Link de Google Maps">
            <input type="url" value={form.ceremony_map_link} onChange={e => set('ceremony_map_link', e.target.value)} className={input} placeholder="https://maps.google.com/..." />
          </Field>
          <Field title="Foto de la iglesia">
            {project?.id ? (
              <MediaUploader projectId={project.id} bucket="invitation-media" accept="image/*" onUploadComplete={url => set('ceremony_photo_url', url)} label="Subir foto de la iglesia" />
            ) : (
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">Guarda el proyecto primero para poder subir imágenes.</p>
            )}
            {form.ceremony_photo_url && (
              <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-100">
                <img src={form.ceremony_photo_url} alt="Iglesia" className="w-full max-h-48 object-cover" />
                <button type="button" onClick={() => set('ceremony_photo_url', '')} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white text-sm flex items-center justify-center hover:bg-black/70">✕</button>
              </div>
            )}
            <input type="url" value={form.ceremony_photo_url} onChange={e => set('ceremony_photo_url', e.target.value)} className={`${input} mt-3`} placeholder="O pega una URL directamente..." />
          </Field>
        </div>
      )}

      {/* Tab 4: Recepción */}
      {activeTab === 4 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <Field title="Nombre del salón">
              <input type="text" value={form.reception_venue} onChange={e => set('reception_venue', e.target.value)} className={input} placeholder="Salón Imperial" />
            </Field>
            <Field title="Hora">
              <input type="text" value={form.reception_time} onChange={e => set('reception_time', e.target.value)} className={input} placeholder="5:00 PM" />
            </Field>
          </div>
          <Field title="Dirección completa">
            <input type="text" value={form.reception_address} onChange={e => set('reception_address', e.target.value)} className={input} placeholder="Calle Flores 456, Col. Jardines, CDMX" />
          </Field>
          <Field title="Link de Google Maps">
            <input type="url" value={form.reception_map_link} onChange={e => set('reception_map_link', e.target.value)} className={input} placeholder="https://maps.google.com/..." />
          </Field>
          <Field title="Foto del salón">
            {project?.id ? (
              <MediaUploader projectId={project.id} bucket="invitation-media" accept="image/*" onUploadComplete={url => set('reception_photo_url', url)} label="Subir foto del salón" />
            ) : (
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">Guarda el proyecto primero para poder subir imágenes.</p>
            )}
            {form.reception_photo_url && (
              <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-100">
                <img src={form.reception_photo_url} alt="Salón" className="w-full max-h-48 object-cover" />
                <button type="button" onClick={() => set('reception_photo_url', '')} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white text-sm flex items-center justify-center hover:bg-black/70">✕</button>
              </div>
            )}
            <input type="url" value={form.reception_photo_url} onChange={e => set('reception_photo_url', e.target.value)} className={`${input} mt-3`} placeholder="O pega una URL directamente..." />
          </Field>
        </div>
      )}

      {/* Tab 5: Itinerario */}
      {activeTab === 5 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Define el programa del evento. El ícono puede ser un emoji, URL de imagen, o ruta de archivo.</p>
          {form.itinerary.map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-gray-50/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Paso {i + 1}</span>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, itinerary: prev.itinerary.filter((_, idx) => idx !== i) }))}
                  className="text-sm text-red-400 hover:text-red-600 transition-colors font-medium"
                >
                  Eliminar
                </button>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-3">
                <input type="text" value={item.time} onChange={e => setItineraryItem(i, 'time', e.target.value)} className={input} placeholder="3:00 PM" />
                <input type="text" value={item.description} onChange={e => setItineraryItem(i, 'description', e.target.value)} className={input} placeholder="Descripción del evento" />
              </div>
              <div className="flex gap-3 items-center">
                {item.icon && item.icon.length <= 4 ? (
                  <span className="w-12 h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-2xl shrink-0">{item.icon}</span>
                ) : item.icon?.startsWith('http') ? (
                  <img src={item.icon} alt="" className="w-12 h-12 rounded-xl border border-gray-200 object-contain bg-white shrink-0" />
                ) : null}
                <input type="text" value={item.icon} onChange={e => setItineraryItem(i, 'icon', e.target.value)} className={input} placeholder="⛪ Emoji o URL del ícono" />
              </div>
              {project?.id && (
                <MediaUploader projectId={project.id} bucket="invitation-media" onUploadComplete={url => setItineraryItem(i, 'icon', url)} label="Subir ícono personalizado" />
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setForm(prev => ({ ...prev, itinerary: [...prev.itinerary, { time: '', description: '', icon: '' }] }))}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-rose-300 hover:text-rose-400 transition-all font-medium"
          >
            + Agregar paso al itinerario
          </button>
        </div>
      )}

      {/* Tab 6: Estilo */}
      {activeTab === 6 && (
        <div className="space-y-6">
          <SectionCard title="Foto de portada" description="Imagen principal que aparece al abrir la invitación">
            {project?.id ? (
              <MediaUploader projectId={project.id} bucket="invitation-media" accept="image/*" onUploadComplete={url => set('hero_photo_url', url)} label="Subir foto de portada" />
            ) : (
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">Guarda el proyecto primero para poder subir imágenes.</p>
            )}
            {form.hero_photo_url && (
              <div className="relative rounded-xl overflow-hidden border border-gray-100">
                <img src={form.hero_photo_url} alt="Portada" className="w-full max-h-56 object-cover" />
                <button type="button" onClick={() => set('hero_photo_url', '')} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white text-sm flex items-center justify-center hover:bg-black/70">✕</button>
              </div>
            )}
            <input type="url" value={form.hero_photo_url} onChange={e => set('hero_photo_url', e.target.value)} className={input} placeholder="O pega una URL directamente..." />
          </SectionCard>

          <SectionCard title="Código de vestimenta">
            <Field title="Colores">
              <input type="text" value={form.dress_code_colors} onChange={e => set('dress_code_colors', e.target.value)} className={input} placeholder="Rosa pastel, blanco y dorado" />
            </Field>
            <Field title="Notas adicionales">
              <textarea value={form.dress_code_notes} onChange={e => set('dress_code_notes', e.target.value)} className={input} rows={3} placeholder="Preferiblemente ropa formal, evitar color negro..." />
            </Field>
          </SectionCard>
        </div>
      )}

      {/* Tab 7: Media */}
      {activeTab === 7 && (
        <div className="space-y-6">
          {/* Music */}
          <SectionCard title="Música de fondo">
            {project?.id ? (
              <MediaUploader projectId={project.id} bucket="invitation-audio" accept="audio/*" onUploadComplete={url => set('music_url', url)} label="Subir música (MP3)" />
            ) : (
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">Guarda el proyecto primero para poder subir archivos.</p>
            )}
            {form.music_url && <p className="text-sm text-green-600 flex items-center gap-1.5 font-medium">✓ Música cargada</p>}
            <input type="url" value={form.music_url} onChange={e => set('music_url', e.target.value)} className={input} placeholder="O pega la URL del archivo de audio..." />
          </SectionCard>

          {/* Gallery */}
          <SectionCard title="Galería de fotos" description="Mínimo 4 fotos para un buen carrusel">
            {project?.id && (
              <MediaUploader
                projectId={project.id}
                bucket="invitation-media"
                accept="image/*"
                onUploadComplete={url => setForm(prev => ({ ...prev, photos: [...prev.photos.filter(Boolean), url] }))}
                label="Subir foto a la galería"
              />
            )}
            <div className="space-y-3">
              {form.photos.map((url, i) => (
                <div key={i} className="flex gap-3 items-center">
                  {url ? (
                    <img src={url} alt="" className="w-12 h-12 object-cover rounded-xl border border-gray-200 shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-200 shrink-0 flex items-center justify-center text-gray-300 text-sm">{i + 1}</div>
                  )}
                  <input type="url" value={url} onChange={e => setArrayItem('photos', i, e.target.value)} className={input} placeholder="URL de imagen" />
                  <button type="button" onClick={() => removeArrayItem('photos', i)} className="w-10 h-10 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 flex items-center justify-center transition-colors shrink-0">✕</button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('photos')} className="text-sm text-rose-500 hover:text-rose-600 font-medium flex items-center gap-2 mt-1">
                <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-xs">+</span>
                Agregar URL manualmente
              </button>
            </div>
          </SectionCard>

          {/* Feature toggles */}
          <div className="space-y-4">
            {/* Video */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-base font-semibold text-gray-800">Sección de video</p>
                  <p className="text-sm text-gray-400 mt-0.5">YouTube o video subido</p>
                </div>
                <Toggle checked={form.show_video} onChange={v => set('show_video', v)} label="Mostrar video" />
              </div>
              {form.show_video && (
                <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
                  <Field title="ID de YouTube">
                    <input type="text" value={form.video_youtube_id} onChange={e => set('video_youtube_id', e.target.value)} className={input} placeholder="Ej. dQw4w9WgXcQ" />
                    <p className="text-xs text-gray-400 mt-1.5">Copia solo el ID de: youtube.com/watch?v=<strong>ESTE_ID</strong></p>
                  </Field>
                  <Field title="O subir video MP4">
                    {project?.id ? (
                      <MediaUploader projectId={project.id} bucket="invitation-media" accept="video/*" onUploadComplete={url => set('video_url', url)} label="Subir video (MP4)" />
                    ) : (
                      <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">Guarda el proyecto primero.</p>
                    )}
                    {form.video_url && <p className="text-sm text-green-600 font-medium mt-1.5">✓ Video cargado</p>}
                    <input type="url" value={form.video_url} onChange={e => set('video_url', e.target.value)} className={`${input} mt-3`} placeholder="O pega la URL del video..." />
                  </Field>
                </div>
              )}
            </div>

            {/* Lluvia de sobres */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-base font-semibold text-gray-800">Lluvia de sobres</p>
                  <p className="text-sm text-gray-400 mt-0.5">Sección para regalos en efectivo</p>
                </div>
                <Toggle checked={form.show_lluvia_sobres} onChange={v => set('show_lluvia_sobres', v)} label="Mostrar lluvia de sobres" />
              </div>
              {form.show_lluvia_sobres && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  <Field title="Texto personalizado">
                    <textarea value={form.lluvia_sobres_text} onChange={e => set('lluvia_sobres_text', e.target.value)} className={input} rows={3} placeholder="Si prefieres obsequiarme un sobre, será recibido con el mismo amor..." />
                  </Field>
                </div>
              )}
            </div>

            {/* Datos bancarios */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-base font-semibold text-gray-800">Datos bancarios</p>
                  <p className="text-sm text-gray-400 mt-0.5">CLABE para transferencias</p>
                </div>
                <Toggle checked={form.show_datos_bancarios} onChange={v => set('show_datos_bancarios', v)} label="Mostrar datos bancarios" />
              </div>
              {form.show_datos_bancarios && (
                <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Field title="Beneficiario">
                      <input type="text" value={form.bank_beneficiary} onChange={e => set('bank_beneficiary', e.target.value)} className={input} placeholder="María García López" />
                    </Field>
                    <Field title="CLABE (18 dígitos)">
                      <input type="text" value={form.bank_account} onChange={e => set('bank_account', e.target.value)} className={input} placeholder="000000000000000000" maxLength={18} />
                    </Field>
                  </div>
                  <Field title="Texto personalizado">
                    <textarea value={form.datos_bancarios_text} onChange={e => set('datos_bancarios_text', e.target.value)} className={input} rows={3} placeholder="Si deseas hacerme un regalo monetario..." />
                  </Field>
                </div>
              )}
            </div>

            {/* Itinerario toggle */}
            <div className="flex items-center justify-between px-5 py-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <div>
                <p className="text-base font-semibold text-gray-800">Programa del evento</p>
                <p className="text-sm text-gray-400 mt-0.5">Muestra el itinerario en la invitación</p>
              </div>
              <Toggle checked={form.show_itinerary} onChange={v => set('show_itinerary', v)} label="Mostrar itinerario" />
            </div>
          </div>

          {/* Mesa de regalos */}
          <SectionCard title="Mesa de regalos">
            <Field title="Tienda">
              <div className="flex flex-wrap gap-3">
                {([
                  { id: 'liverpool', label: 'Liverpool',        logo: '/images/elegance/liverpool.png' },
                  { id: 'amazon',    label: 'Amazon',           logo: '/images/elegance/amazon.svg'    },
                  { id: 'palacio',   label: 'Palacio de Hierro', logo: '/images/elegance/palacio.svg'  },
                  { id: 'generic',   label: 'Genérico',         logo: '/images/elegance/mesa_regalos.png' },
                ] as const).map(store => (
                  <button
                    key={store.id}
                    type="button"
                    onClick={() => set('gift_store', store.id)}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all"
                    style={{ borderColor: form.gift_store === store.id ? '#f43f5e' : '#e5e7eb', background: form.gift_store === store.id ? '#fff1f3' : 'white', minWidth: 90 }}
                  >
                    <img src={store.logo} alt={store.label} style={{ height: 36, objectFit: 'contain' }} />
                    <span className="text-xs text-gray-600 text-center leading-tight">{store.label}</span>
                  </button>
                ))}
              </div>
            </Field>
            <Field title={`Link de ${form.gift_store === 'liverpool' ? 'Liverpool' : form.gift_store === 'amazon' ? 'Amazon' : form.gift_store === 'palacio' ? 'Palacio de Hierro' : 'Mesa de Regalos'}`}>
              <input type="url" value={form.liverpool_link} onChange={e => set('liverpool_link', e.target.value)} className={input} placeholder="https://..." />
            </Field>
          </SectionCard>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 text-base rounded-xl px-4 py-3.5 flex items-center gap-2">
          <span>⚠</span> {error}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 flex items-center gap-3 pt-6 border-t border-gray-100">
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSubmit('draft')}
          className="px-5 py-3 border border-gray-200 text-gray-600 rounded-xl text-base font-medium hover:bg-gray-50 disabled:opacity-50 transition-all"
        >
          Guardar borrador
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSubmit('published')}
          className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-base font-medium disabled:opacity-50 transition-all shadow-sm shadow-rose-200"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Guardando...
            </span>
          ) : 'Guardar y publicar'}
        </button>
        {project && (
          <a
            href={`/i/${project.slug}`}
            target="_blank"
            rel="noreferrer"
            className="ml-auto px-5 py-3 text-rose-500 border border-rose-200 rounded-xl text-base font-medium hover:bg-rose-50 transition-all"
          >
            Ver invitación ↗
          </a>
        )}
      </div>
    </div>
  )
}
