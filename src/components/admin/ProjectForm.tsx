'use client'

import { useState } from 'react'
import { generateSlug } from '@/lib/slug'
import { createProject, updateProject, type ProjectFormData } from '@/app/admin/actions'
import type { Project, TemplateId } from '@/types/invitation'

const TEMPLATES: { value: TemplateId; label: string }[] = [
  { value: 'sobre', label: 'Sobre Animado' },
  { value: 'esmeralda', label: 'Esmeralda' },
  { value: 'pink', label: 'Pink' },
  { value: 'love', label: 'Love' },
  { value: 'zafiro', label: 'Zafiro' },
  { value: 'cenicienta', label: 'Cenicienta' },
  { value: 'hogwarts', label: 'Hogwarts' },
  { value: 'sellorosa', label: 'Sello Rosa' },
  { value: 'rosagold', label: 'Rosa Gold' },
]

const TABS = ['General', 'Contacto', 'Familia', 'Ceremonia', 'Recepción', 'Itinerario', 'Estilo', 'Media']

function toFormData(project?: Project): ProjectFormData {
  if (!project) {
    return {
      slug: '', template: 'sobre', status: 'draft',
      quinceanera_name: '', guest_name: '', event_date: '',
      rsvp_phone: '', hashtag: '', music_url: '', hero_photo_url: '',
      parent_names: ['', ''], padrinos: ['', ''],
      ceremony_venue: '', ceremony_address: '', ceremony_time: '', ceremony_map_link: '',
      reception_venue: '', reception_address: '', reception_time: '', reception_map_link: '',
      itinerary: [{ time: '', description: '', icon: '' }],
      dress_code_colors: '', dress_code_notes: '',
      photos: [''],
      liverpool_link: '', bank_account: '', bank_beneficiary: '',
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
    reception_venue: project.reception?.venue ?? '',
    reception_address: project.reception?.address ?? '',
    reception_time: project.reception?.time ?? '',
    reception_map_link: project.reception?.mapsUrl ?? project.reception?.mapLink ?? '',
    itinerary: project.itinerary.length
      ? project.itinerary.map(i => ({
          time: i.time,
          description: i.description ?? i.title,
          icon: i.icon ?? i.iconSrc,
        }))
      : [{ time: '', description: '', icon: '' }],
    dress_code_colors: project.dress_code?.colors ?? '',
    dress_code_notes: project.dress_code?.notes ?? '',
    photos: project.photos.length ? project.photos : [''],
    liverpool_link: project.gift_registry?.liverpoolLink ?? '',
    bank_account: project.gift_registry?.bankAccount ?? '',
    bank_beneficiary: project.gift_registry?.bankBeneficiary ?? '',
  }
}

const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
const labelClass = "block text-sm font-medium text-gray-700 mb-1"

interface Props {
  project?: Project
}

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
    if (!project) {
      set('slug', generateSlug(name))
    }
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
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === i
                ? 'border-b-2 border-rose-500 text-rose-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 0: General */}
      {activeTab === 0 && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Nombre de la quinceañera *</label>
            <input type="text" value={form.quinceanera_name} onChange={handleNameChange} required className={inputClass} placeholder="Valeria García" />
          </div>
          <div>
            <label className={labelClass}>Slug (URL) *</label>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-400">/i/</span>
              <input type="text" value={form.slug} onChange={e => set('slug', e.target.value)} required className={inputClass} placeholder="valeria-garcia" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Template *</label>
            <select value={form.template} onChange={e => set('template', e.target.value as TemplateId)} className={inputClass}>
              {TEMPLATES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Fecha del evento *</label>
            <input type="datetime-local" value={form.event_date} onChange={e => set('event_date', e.target.value)} required className={inputClass} />
          </div>
        </div>
      )}

      {/* Tab 1: Contacto */}
      {activeTab === 1 && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Nombre del invitado (para banner)</label>
            <input type="text" value={form.guest_name} onChange={e => set('guest_name', e.target.value)} className={inputClass} placeholder="Familia Martínez" />
          </div>
          <div>
            <label className={labelClass}>Teléfono RSVP (WhatsApp, sin +)</label>
            <input type="text" value={form.rsvp_phone} onChange={e => set('rsvp_phone', e.target.value)} className={inputClass} placeholder="5218001234567" />
          </div>
          <div>
            <label className={labelClass}>Hashtag</label>
            <input type="text" value={form.hashtag} onChange={e => set('hashtag', e.target.value)} className={inputClass} placeholder="#XVValeria" />
          </div>
        </div>
      )}

      {/* Tab 2: Familia */}
      {activeTab === 2 && (
        <div className="space-y-6">
          <div>
            <label className={labelClass}>Padres</label>
            <div className="space-y-2">
              {form.parent_names.map((name, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={name} onChange={e => setArrayItem('parent_names', i, e.target.value)} className={inputClass} placeholder={`Padre ${i + 1}`} />
                  <button type="button" onClick={() => removeArrayItem('parent_names', i)} className="text-red-400 hover:text-red-600 px-2">✕</button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('parent_names')} className="text-sm text-rose-500 hover:text-rose-600">+ Agregar padre/madre</button>
            </div>
          </div>
          <div>
            <label className={labelClass}>Padrinos</label>
            <div className="space-y-2">
              {form.padrinos.map((name, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={name} onChange={e => setArrayItem('padrinos', i, e.target.value)} className={inputClass} placeholder={`Padrino ${i + 1}`} />
                  <button type="button" onClick={() => removeArrayItem('padrinos', i)} className="text-red-400 hover:text-red-600 px-2">✕</button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('padrinos')} className="text-sm text-rose-500 hover:text-rose-600">+ Agregar padrino/madrina</button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Ceremonia */}
      {activeTab === 3 && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Nombre del lugar</label>
            <input type="text" value={form.ceremony_venue} onChange={e => set('ceremony_venue', e.target.value)} className={inputClass} placeholder="Parroquia de San Juan" />
          </div>
          <div>
            <label className={labelClass}>Dirección</label>
            <input type="text" value={form.ceremony_address} onChange={e => set('ceremony_address', e.target.value)} className={inputClass} placeholder="Av. Reforma 123, Col. Centro" />
          </div>
          <div>
            <label className={labelClass}>Hora</label>
            <input type="text" value={form.ceremony_time} onChange={e => set('ceremony_time', e.target.value)} className={inputClass} placeholder="3:00 PM" />
          </div>
          <div>
            <label className={labelClass}>Link de Google Maps</label>
            <input type="url" value={form.ceremony_map_link} onChange={e => set('ceremony_map_link', e.target.value)} className={inputClass} placeholder="https://maps.google.com/..." />
          </div>
        </div>
      )}

      {/* Tab 4: Recepción */}
      {activeTab === 4 && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Nombre del lugar</label>
            <input type="text" value={form.reception_venue} onChange={e => set('reception_venue', e.target.value)} className={inputClass} placeholder="Salón Imperial" />
          </div>
          <div>
            <label className={labelClass}>Dirección</label>
            <input type="text" value={form.reception_address} onChange={e => set('reception_address', e.target.value)} className={inputClass} placeholder="Calle Flores 456, Col. Jardines" />
          </div>
          <div>
            <label className={labelClass}>Hora</label>
            <input type="text" value={form.reception_time} onChange={e => set('reception_time', e.target.value)} className={inputClass} placeholder="5:00 PM" />
          </div>
          <div>
            <label className={labelClass}>Link de Google Maps</label>
            <input type="url" value={form.reception_map_link} onChange={e => set('reception_map_link', e.target.value)} className={inputClass} placeholder="https://maps.google.com/..." />
          </div>
        </div>
      )}

      {/* Tab 5: Itinerario */}
      {activeTab === 5 && (
        <div className="space-y-4">
          {form.itinerary.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-md p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Paso {i + 1}</span>
                <button type="button" onClick={() => setForm(prev => ({ ...prev, itinerary: prev.itinerary.filter((_, idx) => idx !== i) }))} className="text-red-400 hover:text-red-600 text-sm">Eliminar</button>
              </div>
              <input type="text" value={item.time} onChange={e => setItineraryItem(i, 'time', e.target.value)} className={inputClass} placeholder="3:00 PM" />
              <input type="text" value={item.description} onChange={e => setItineraryItem(i, 'description', e.target.value)} className={inputClass} placeholder="Descripción del evento" />
              <input type="text" value={item.icon} onChange={e => setItineraryItem(i, 'icon', e.target.value)} className={inputClass} placeholder="Ícono (URL o emoji)" />
            </div>
          ))}
          <button type="button" onClick={() => setForm(prev => ({ ...prev, itinerary: [...prev.itinerary, { time: '', description: '', icon: '' }] }))} className="text-sm text-rose-500 hover:text-rose-600">+ Agregar paso</button>
        </div>
      )}

      {/* Tab 6: Estilo */}
      {activeTab === 6 && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Foto de portada (URL)</label>
            <input type="text" value={form.hero_photo_url} onChange={e => set('hero_photo_url', e.target.value)} className={inputClass} placeholder="/images/hero.jpg o URL de Supabase" />
          </div>
          <div>
            <label className={labelClass}>Colores de vestimenta</label>
            <input type="text" value={form.dress_code_colors} onChange={e => set('dress_code_colors', e.target.value)} className={inputClass} placeholder="Rosa pastel, blanco y dorado" />
          </div>
          <div>
            <label className={labelClass}>Notas adicionales de vestimenta</label>
            <textarea value={form.dress_code_notes} onChange={e => set('dress_code_notes', e.target.value)} className={inputClass} rows={3} placeholder="Preferiblemente ropa formal..." />
          </div>
        </div>
      )}

      {/* Tab 7: Media */}
      {activeTab === 7 && (
        <div className="space-y-6">
          <div>
            <label className={labelClass}>URL de música de fondo</label>
            <input type="text" value={form.music_url} onChange={e => set('music_url', e.target.value)} className={inputClass} placeholder="https://supabase.co/.../musica.mp3" />
          </div>
          <div>
            <label className={labelClass}>Fotos de galería (URLs)</label>
            <div className="space-y-2">
              {form.photos.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={url} onChange={e => setArrayItem('photos', i, e.target.value)} className={inputClass} placeholder="URL de imagen" />
                  <button type="button" onClick={() => removeArrayItem('photos', i)} className="text-red-400 hover:text-red-600 px-2">✕</button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('photos')} className="text-sm text-rose-500 hover:text-rose-600">+ Agregar foto</button>
            </div>
          </div>
          <div className="border-t pt-4">
            <label className={labelClass}>Regalo — Link de Liverpool</label>
            <input type="url" value={form.liverpool_link} onChange={e => set('liverpool_link', e.target.value)} className={inputClass} placeholder="https://liverpool.com.mx/..." />
          </div>
          <div>
            <label className={labelClass}>Cuenta bancaria</label>
            <input type="text" value={form.bank_account} onChange={e => set('bank_account', e.target.value)} className={inputClass} placeholder="1234 5678 9012 3456" />
          </div>
          <div>
            <label className={labelClass}>Beneficiario</label>
            <input type="text" value={form.bank_beneficiary} onChange={e => set('bank_beneficiary', e.target.value)} className={inputClass} placeholder="María García López" />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2">
          {error}
        </div>
      )}

      {/* Footer actions */}
      <div className="mt-8 flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSubmit('draft')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Guardar borrador
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSubmit('published')}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md text-sm font-medium disabled:opacity-50 transition-colors"
        >
          {loading ? 'Guardando...' : 'Guardar y Publicar'}
        </button>
        {project && (
          <a
            href={`/i/${project.slug}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-rose-500 border border-rose-300 rounded-md text-sm hover:bg-rose-50 transition-colors"
          >
            Vista previa ↗
          </a>
        )}
      </div>
    </div>
  )
}
