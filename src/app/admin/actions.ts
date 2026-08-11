'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import type { Project, TemplateId } from '@/types/invitation'

export interface ProjectFormData {
  slug: string
  template: TemplateId
  status: 'draft' | 'published'
  quinceanera_name: string
  guest_name: string
  event_date: string
  rsvp_phone: string
  hashtag: string
  music_url: string
  hero_photo_url: string
  parent_names: string[]
  padrinos: string[]
  ceremony_venue: string
  ceremony_address: string
  ceremony_time: string
  ceremony_map_link: string
  ceremony_photo_url: string
  reception_venue: string
  reception_address: string
  reception_time: string
  reception_map_link: string
  reception_photo_url: string
  itinerary: Array<{ time: string; description: string; icon: string }>
  dress_code_colors: string
  dress_code_notes: string
  photos: string[]
  liverpool_link: string
  bank_account: string
  bank_beneficiary: string
  gift_store: string
  parents_title: string
  padrinos_title: string
  color_theme: string
  invitation_text: string
  show_video: boolean
  video_youtube_id: string
  video_url: string
  show_lluvia_sobres: boolean
  lluvia_sobres_text: string
  show_datos_bancarios: boolean
  datos_bancarios_text: string
  show_itinerary: boolean
  confirmation_phrase: string
  confirmation_highlight_date: string
  especial_background_url: string
  especial_bg_opacity: string
  especial_decoration_url: string
  especial_decoration_style: string
  especial_banner_text: string
  especial_footer_text: string
  especial_show_dress_palette: boolean
  especial_dress_palette: Array<{ name: string; colors: string[] }>
  especial_gift_registries: Array<{ giftStore: string; liverpoolLink: string }>
  especial_rsvp_phones: Array<{ phone: string; label: string }>
  especial_rsvp_email: string
  especial_seal_url: string
  especial_seal_filter: string
  especial_seal_offset_x: string
  especial_seal_offset_y: string
  especial_dress_code_image_url: string
  especial_envelope_right_url: string
  especial_envelope_left_url: string
  // Módulo Lista de Invitados
  tiene_lista_invitados: boolean
  pin_admin: string  // PIN en texto plano; se hashea en el servidor
  sobre_final_photo_url: string
  elegance_photo_after_hero: string
  elegance_photo_after_parents: string
  elegance_photo_after_locations: string
  elegance_photo_after_gifts: string
  elegance_photo_before_itinerary: string
  elegance_photo_after_itinerary: string
  elegance_photo_after_rsvp: string
  elegance_show_album: boolean
  elegance_grid_retrato: string[]
  elegance_grid_horizontal: string[]
}

async function formDataToProject(data: ProjectFormData) {
  let pin_admin: string | null = null
  if (data.tiene_lista_invitados && data.pin_admin?.match(/^\d{4}$/)) {
    pin_admin = await bcrypt.hash(data.pin_admin, 10)
  }

  return {
    slug: data.slug,
    template: data.template,
    status: data.status,
    quinceanera_name: data.quinceanera_name,
    guest_name: data.guest_name || null,
    event_date: data.event_date,
    rsvp_phone: data.rsvp_phone || null,
    hashtag: data.hashtag || null,
    music_url: data.music_url || null,
    hero_photo_url: data.hero_photo_url || null,
    parent_names: data.parent_names.filter(Boolean),
    padrinos: data.padrinos.filter(Boolean),
    ceremony: (data.ceremony_venue || data.ceremony_address) ? {
      venue: data.ceremony_venue,
      address: data.ceremony_address,
      time: data.ceremony_time,
      mapsUrl: data.ceremony_map_link,
      mapLink: data.ceremony_map_link,
      photoUrl: data.ceremony_photo_url || undefined,
    } : null,
    reception: (data.reception_venue || data.reception_address) ? {
      venue: data.reception_venue,
      address: data.reception_address,
      time: data.reception_time,
      mapsUrl: data.reception_map_link,
      mapLink: data.reception_map_link,
      photoUrl: data.reception_photo_url || undefined,
    } : null,
    itinerary: data.itinerary
      .filter(i => i.time || i.description)
      .map(i => ({
        title: i.description,
        time: i.time,
        iconSrc: i.icon,
        description: i.description,
        icon: i.icon,
      })),
    dress_code: (data.dress_code_colors || data.dress_code_notes) ? {
      colors: data.dress_code_colors,
      notes: data.dress_code_notes,
    } : null,
    photos: data.photos.filter(Boolean),
    gift_registry: (data.liverpool_link || data.bank_account) ? {
      liverpoolLink: data.liverpool_link || undefined,
      bankAccount: data.bank_account || undefined,
      bankBeneficiary: data.bank_beneficiary || undefined,
      giftStore: (data.gift_store || 'liverpool') as 'liverpool' | 'amazon' | 'palacio' | 'generic',
    } : null,
    color_theme: data.color_theme || 'rosagold',
    invitation_text: data.invitation_text || null,
    show_video: data.show_video,
    video_youtube_id: data.video_youtube_id || null,
    video_url: data.video_url || null,
    show_lluvia_sobres: data.show_lluvia_sobres,
    lluvia_sobres_text: data.lluvia_sobres_text || null,
    show_datos_bancarios: data.show_datos_bancarios,
    datos_bancarios_text: data.datos_bancarios_text || null,
    show_itinerary: data.show_itinerary,
    confirmation_phrase: data.confirmation_phrase || null,
    confirmation_highlight_date: data.confirmation_highlight_date || null,
    extra_config: {
      ...(data.parents_title  ? { parents_title:  data.parents_title  } : {}),
      ...(data.padrinos_title ? { padrinos_title: data.padrinos_title } : {}),
      // especial fields
      ...(data.especial_background_url  ? { background_url:      data.especial_background_url  } : {}),
      ...(data.especial_bg_opacity !== '' && data.especial_bg_opacity !== '50'
        ? { bg_opacity: Number(data.especial_bg_opacity) } : {}),
      ...(data.especial_decoration_url  ? { decoration_url:      data.especial_decoration_url  } : {}),
      ...(data.especial_decoration_style !== 'flores' ? { decoration_style: data.especial_decoration_style } : {}),
      ...(data.especial_banner_text     ? { banner_text:         data.especial_banner_text     } : {}),
      ...(data.especial_footer_text     ? { footer_text:         data.especial_footer_text     } : {}),
      ...(data.especial_show_dress_palette ? { show_dress_palette: true } : {}),
      ...(data.especial_dress_palette.length > 0 ? { dress_palette: data.especial_dress_palette } : {}),
      ...(data.especial_gift_registries.filter(r => r.liverpoolLink).length > 0
        ? { gift_registries: data.especial_gift_registries.filter(r => r.liverpoolLink) }
        : {}),
      ...(data.especial_rsvp_phones.filter(p => p.phone).length > 0
        ? { rsvp_phones: data.especial_rsvp_phones.filter(p => p.phone) }
        : {}),
      ...(data.especial_rsvp_email ? { rsvp_email: data.especial_rsvp_email } : {}),
      ...(data.especial_seal_url    ? { seal_url:    data.especial_seal_url    } : {}),
      ...(data.especial_seal_filter !== '' ? { seal_filter: data.especial_seal_filter } : {}),
      ...(Number(data.especial_seal_offset_x) !== 0 ? { seal_offset_x: Number(data.especial_seal_offset_x) } : {}),
      ...(Number(data.especial_seal_offset_y) !== 0 ? { seal_offset_y: Number(data.especial_seal_offset_y) } : {}),
      ...(data.especial_dress_code_image_url  ? { dress_code_image_url:  data.especial_dress_code_image_url  } : {}),
      ...(data.especial_envelope_right_url    ? { envelope_right_url:    data.especial_envelope_right_url    } : {}),
      ...(data.especial_envelope_left_url     ? { envelope_left_url:     data.especial_envelope_left_url     } : {}),
      ...(data.sobre_final_photo_url           ? { final_photo_url:        data.sobre_final_photo_url           } : {}),
      ...(data.elegance_photo_after_hero       ? { photo_after_hero:       data.elegance_photo_after_hero       } : {}),
      ...(data.elegance_photo_after_parents    ? { photo_after_parents:    data.elegance_photo_after_parents    } : {}),
      ...(data.elegance_photo_after_locations  ? { photo_after_locations:  data.elegance_photo_after_locations  } : {}),
      ...(data.elegance_photo_after_gifts      ? { photo_after_gifts:      data.elegance_photo_after_gifts      } : {}),
      ...(data.elegance_photo_before_itinerary ? { photo_before_itinerary: data.elegance_photo_before_itinerary } : {}),
      ...(data.elegance_photo_after_itinerary  ? { photo_after_itinerary:  data.elegance_photo_after_itinerary  } : {}),
      ...(data.elegance_photo_after_rsvp       ? { photo_after_rsvp:       data.elegance_photo_after_rsvp       } : {}),
      ...(data.elegance_show_album ? { show_album: true } : {}),
      ...(data.elegance_grid_retrato.filter(Boolean).length > 0
        ? { grid_retrato: data.elegance_grid_retrato.filter(Boolean) }
        : {}),
      ...(data.elegance_grid_horizontal.filter(Boolean).length > 0
        ? { grid_horizontal: data.elegance_grid_horizontal.filter(Boolean) }
        : {}),
    },
    tiene_lista_invitados: data.tiene_lista_invitados,
    ...(pin_admin ? { pin_admin } : {}),
  }
}

export async function createProject(data: ProjectFormData): Promise<void> {
  const supabase = await createClient()
  const { data: created, error } = await supabase
    .from('projects')
    .insert(await formDataToProject(data))
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  redirect(`/admin/projects/${created.id}`)
}

export async function updateProject(id: string, data: ProjectFormData): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .update(await formDataToProject(data))
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/projects/${id}`)
  revalidatePath('/admin')
}

export async function togglePublish(id: string, newStatus: 'draft' | 'published'): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .update({ status: newStatus })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  redirect('/admin')
}

export async function uploadMedia(
  projectId: string,
  formData: FormData,
  bucket: 'invitation-media' | 'invitation-audio'
): Promise<string> {
  const supabase = await createClient()
  const file = formData.get('file') as File
  const ext = file.name.split('.').pop()
  const path = `${projectId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file)

  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return publicUrl
}
