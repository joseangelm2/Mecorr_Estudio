'use client'

import { useState } from 'react'
import { generateSlug } from '@/lib/slug'
import { createProject, updateProject, type ProjectFormData } from '@/app/admin/actions'
import type { Project, TemplateId } from '@/types/invitation'
import { THEMES } from '@/lib/themes'
import MediaUploader from '@/components/admin/MediaUploader'

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
  { value: 'magical', label: 'Magical' },
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
      color_theme: 'rosagold',
      invitation_text: '',
      show_video: false,
      video_youtube_id: '',
      video_url: '',
      show_lluvia_sobres: false,
      lluvia_sobres_text: '',
      show_datos_bancarios: false,
      datos_bancarios_text: '',
      confirmation_phrase: '',
      confirmation_highlight_date: '',
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
    color_theme: project.color_theme ?? 'rosagold',
    invitation_text: project.invitation_text ?? '',
    show_video: project.show_video ?? false,
    video_youtube_id: project.video_youtube_id ?? '',
    video_url: project.video_url ?? '',
    show_lluvia_sobres: project.show_lluvia_sobres ?? false,
    lluvia_sobres_text: project.lluvia_sobres_text ?? '',
    show_datos_bancarios: project.show_datos_bancarios ?? false,
    datos_bancarios_text: project.datos_bancarios_text ?? '',
    confirmation_phrase: project.confirmation_phrase ?? '',
    confirmation_highlight_date: project.confirmation_highlight_date ?? '',
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
          {form.template === 'sobre' && (
            <div>
              <label className={labelClass}>Paleta de color</label>
              <div className="flex flex-wrap gap-3 mt-1">
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => set('color_theme', theme.id)}
                    className="flex flex-col items-center gap-1"
                    title={theme.label}
                  >
                    <span
                      className="w-8 h-8 rounded-full border-2 transition-all"
                      style={{
                        background: theme.swatch,
                        borderColor: form.color_theme === theme.id ? '#1f2937' : 'transparent',
                        boxShadow: form.color_theme === theme.id ? '0 0 0 2px #f43f5e' : 'none',
                      }}
                    />
                    <span className="text-xs text-gray-500">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
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
            <label className={labelClass}>Mensaje de invitación</label>
            <textarea
              value={form.invitation_text}
              onChange={e => set('invitation_text', e.target.value)}
              className={inputClass}
              rows={4}
              placeholder="Con cariño te invitamos a compartir nuestro día más especial..."
            />
          </div>
          <div>
            <label className={labelClass}>Teléfono RSVP (WhatsApp, sin +)</label>
            <input type="text" value={form.rsvp_phone} onChange={e => set('rsvp_phone', e.target.value)} className={inputClass} placeholder="5218001234567" />
          </div>
          <div>
            <label className={labelClass}>Frase de confirmación</label>
            <textarea
              value={form.confirmation_phrase}
              onChange={e => set('confirmation_phrase', e.target.value)}
              className={inputClass}
              rows={3}
              placeholder="Llena el siguiente formulario y no olvides dar clic en el botón, nosotros revisaremos tu confirmación."
            />
          </div>
          <div>
            <label className={labelClass}>Fecha resaltada en confirmación</label>
            <input type="date" value={form.confirmation_highlight_date} onChange={e => set('confirmation_highlight_date', e.target.value)} className={inputClass} />
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
              <div>
                {project?.id && (
                  <MediaUploader
                    projectId={project.id}
                    bucket="invitation-media"
                    onUploadComplete={url => setItineraryItem(i, 'icon', url)}
                    label="Subir ícono"
                  />
                )}
                <input type="text" value={item.icon} onChange={e => setItineraryItem(i, 'icon', e.target.value)} className={`${inputClass} mt-1`} placeholder="Ícono (URL, emoji o ruta)" />
                {item.icon && !item.icon.startsWith('http') && item.icon.length <= 4 && (
                  <span className="text-2xl mt-1 block">{item.icon}</span>
                )}
                {item.icon && item.icon.startsWith('http') && (
                  <img src={item.icon} alt="ícono" className="mt-1 w-8 h-8 object-contain" />
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setForm(prev => ({ ...prev, itinerary: [...prev.itinerary, { time: '', description: '', icon: '' }] }))} className="text-sm text-rose-500 hover:text-rose-600">+ Agregar paso</button>
        </div>
      )}

      {/* Tab 6: Estilo */}
      {activeTab === 6 && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Foto de portada</label>
            {project?.id && (
              <MediaUploader
                projectId={project.id}
                bucket="invitation-media"
                onUploadComplete={url => set('hero_photo_url', url)}
                label="Subir foto"
              />
            )}
            <input type="text" value={form.hero_photo_url} onChange={e => set('hero_photo_url', e.target.value)} className={`${inputClass} mt-2`} placeholder="/images/hero.jpg o URL de Supabase" />
            {form.hero_photo_url && (
              <img src={form.hero_photo_url} alt="Portada" className="mt-2 w-32 h-20 object-cover rounded border border-gray-200" />
            )}
            {!project?.id && <p className="text-xs text-gray-400 mt-1">Guarda el proyecto primero para poder subir imágenes.</p>}
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
            <label className={labelClass}>Música de fondo</label>
            {project?.id && (
              <MediaUploader
                projectId={project.id}
                bucket="invitation-audio"
                accept="audio/*"
                onUploadComplete={url => set('music_url', url)}
                label="Subir archivo de música (MP3, etc.)"
              />
            )}
            <input type="text" value={form.music_url} onChange={e => set('music_url', e.target.value)} className={`${inputClass} mt-2`} placeholder="https://supabase.co/.../musica.mp3" />
            {!project?.id && <p className="text-xs text-gray-400 mt-1">Guarda el proyecto primero para poder subir archivos.</p>}
          </div>
          <div>
            <label className={labelClass}>Fotos de galería</label>
            {project?.id && (
              <div className="mb-2">
                <MediaUploader
                  projectId={project.id}
                  bucket="invitation-media"
                  onUploadComplete={url => setForm(prev => ({
                    ...prev,
                    photos: [...prev.photos.filter(Boolean), url],
                  }))}
                  label="Subir foto a galería"
                />
              </div>
            )}
            <div className="space-y-2">
              {form.photos.map((url, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="text" value={url} onChange={e => setArrayItem('photos', i, e.target.value)} className={inputClass} placeholder="URL de imagen" />
                  {url && <img src={url} alt="" className="w-8 h-8 object-cover rounded border border-gray-200 shrink-0" />}
                  <button type="button" onClick={() => removeArrayItem('photos', i)} className="text-red-400 hover:text-red-600 px-2 shrink-0">✕</button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('photos')} className="text-sm text-rose-500 hover:text-rose-600">+ Agregar URL manual</button>
            </div>
          </div>
          <div className="border-t pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.show_video}
                onChange={e => set('show_video', e.target.checked)}
                className="w-4 h-4 accent-rose-500"
              />
              <span className="text-sm font-medium text-gray-700">Mostrar sección de video</span>
            </label>
            {form.show_video && (
              <div className="mt-3 space-y-3 pl-6">
                <div>
                  <label className={labelClass}>ID de YouTube</label>
                  <input type="text" value={form.video_youtube_id} onChange={e => set('video_youtube_id', e.target.value)} className={inputClass} placeholder="dQw4w9WgXcQ" />
                  <p className="text-xs text-gray-400 mt-1">Solo el ID de la URL: youtube.com/watch?v=<strong>ESTE_TEXTO</strong></p>
                </div>
                <div>
                  <label className={labelClass}>O subir video (MP4)</label>
                  {project?.id && (
                    <MediaUploader
                      projectId={project.id}
                      bucket="invitation-media"
                      accept="video/*"
                      onUploadComplete={url => set('video_url', url)}
                      label="Subir video (MP4)"
                    />
                  )}
                  <input type="text" value={form.video_url} onChange={e => set('video_url', e.target.value)} className={`${inputClass} mt-2`} placeholder="https://supabase.co/.../video.mp4" />
                  {!project?.id && <p className="text-xs text-gray-400 mt-1">Guarda el proyecto primero para poder subir archivos.</p>}
                </div>
              </div>
            )}
          </div>
          <div className="border-t pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.show_lluvia_sobres}
                onChange={e => set('show_lluvia_sobres', e.target.checked)}
                className="w-4 h-4 accent-rose-500"
              />
              <span className="text-sm font-medium text-gray-700">Mostrar sección Lluvia de Sobres</span>
            </label>
            {form.show_lluvia_sobres && (
              <div className="mt-3 pl-6">
                <label className={labelClass}>Texto personalizado</label>
                <textarea
                  value={form.lluvia_sobres_text}
                  onChange={e => set('lluvia_sobres_text', e.target.value)}
                  className={inputClass}
                  rows={3}
                  placeholder="Si prefieres obsequiarme un sobre, será recibido con el mismo amor y gratitud..."
                />
              </div>
            )}
          </div>
          <div className="border-t pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.show_datos_bancarios}
                onChange={e => set('show_datos_bancarios', e.target.checked)}
                className="w-4 h-4 accent-rose-500"
              />
              <span className="text-sm font-medium text-gray-700">Mostrar sección Datos Bancarios</span>
            </label>
            {form.show_datos_bancarios && (
              <div className="mt-3 space-y-3 pl-6">
                <div>
                  <label className={labelClass}>Texto personalizado</label>
                  <textarea
                    value={form.datos_bancarios_text}
                    onChange={e => set('datos_bancarios_text', e.target.value)}
                    className={inputClass}
                    rows={3}
                    placeholder="Si deseas realizarme un regalo monetario, aquí encontrarás mis datos bancarios..."
                  />
                </div>
                <div>
                  <label className={labelClass}>Cuenta bancaria (CLABE)</label>
                  <input type="text" value={form.bank_account} onChange={e => set('bank_account', e.target.value)} className={inputClass} placeholder="000 000 000 000 000 000" />
                </div>
                <div>
                  <label className={labelClass}>Beneficiario</label>
                  <input type="text" value={form.bank_beneficiary} onChange={e => set('bank_beneficiary', e.target.value)} className={inputClass} placeholder="María García López" />
                </div>
              </div>
            )}
          </div>
          <div className="border-t pt-4">
            <label className={labelClass}>Regalo — Link de Liverpool</label>
            <input type="url" value={form.liverpool_link} onChange={e => set('liverpool_link', e.target.value)} className={inputClass} placeholder="https://liverpool.com.mx/..." />
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
