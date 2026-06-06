# Sobre Template — Paleta, Mensaje e Scroll — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir elegir paleta de color e ingresar mensaje de invitación desde el admin, aplicarlos en la invitación publicada sin selector visible, y corregir el scroll al abrir el sobre.

**Architecture:** Se extrae la tabla de temas a `src/lib/themes.ts` (shared), se añaden dos campos al tipo `Project` y a `ProjectFormData`, se parchean los componentes `IntroEnvelope`, `CelebracionSection` y `SobreTemplate`, y se actualiza el formulario admin.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Supabase (datos ya migrados manualmente), Tailwind CSS v4.

---

## Prerequisito: Migración en Supabase

> **Antes de ejecutar cualquier tarea**, confirmar que la migración SQL ya fue ejecutada en Supabase SQL Editor:
>
> ```sql
> ALTER TABLE projects
>   ADD COLUMN color_theme TEXT NOT NULL DEFAULT 'rosagold',
>   ADD COLUMN invitation_text TEXT;
> ```

---

## Archivos involucrados

| Archivo | Acción |
|---|---|
| `src/lib/themes.ts` | Crear — constante `THEMES` compartida |
| `src/components/ColorSwitcher.tsx` | Modificar — importar `THEMES` desde `src/lib/themes.ts` |
| `src/types/invitation.ts` | Modificar — +2 campos en `Project` |
| `src/app/admin/actions.ts` | Modificar — +2 campos en `ProjectFormData` y `formDataToProject` |
| `src/components/IntroEnvelope.tsx` | Modificar — fix scroll + prop `showSwitcher` |
| `src/components/CelebracionSection.tsx` | Modificar — prop `invitationText` reemplaza texto hardcodeado |
| `src/app/sobre/sobre.css` | Modificar — clase `.invitation-text` |
| `src/components/templates/SobreTemplate.tsx` | Modificar — `'use client'`, `useEffect` color, props nuevas, sin `ColorSwitcher` |
| `src/components/admin/ProjectForm.tsx` | Modificar — color swatches en General, textarea en Contacto |

---

## Task 1: Extraer THEMES a `src/lib/themes.ts`

**Files:**
- Create: `src/lib/themes.ts`
- Modify: `src/components/ColorSwitcher.tsx`

- [ ] **Step 1: Crear `src/lib/themes.ts`**

```ts
export interface Theme {
  id: string
  label: string
  primary: string
  dark: string
  swatch: string
  filterValue: string
}

export const THEMES: Theme[] = [
  { id: 'rosagold',  label: 'Rosa Gold',   primary: '#a8686a', dark: '#96585a', swatch: '#a8686a', filterValue: 'hue-rotate(0deg) saturate(1)' },
  { id: 'azul',      label: 'Azul',         primary: '#12397A', dark: '#0e2d61', swatch: '#12397A', filterValue: 'hue-rotate(210deg) saturate(2) brightness(0.85)' },
  { id: 'lila',      label: 'Lila',         primary: '#8d77ab', dark: '#7a6598', swatch: '#8d77ab', filterValue: 'hue-rotate(260deg) saturate(1.3)' },
  { id: 'rojo',      label: 'Rojo',         primary: '#ff3131', dark: '#e02b2b', swatch: '#ff3131', filterValue: 'hue-rotate(350deg) saturate(1.8)' },
  { id: 'negro',     label: 'Negro',        primary: '#424242', dark: '#333333', swatch: '#424242', filterValue: 'grayscale(1) brightness(0.45)' },
  { id: 'mariposas', label: 'Mariposas',    primary: '#b4882d', dark: '#9e7726', swatch: '#b4882d', filterValue: 'hue-rotate(38deg) saturate(1.4)' },
  { id: 'blancooro', label: 'Blanco Oro',   primary: '#F4C430', dark: '#d4a800', swatch: '#FFD700', filterValue: 'hue-rotate(46deg) saturate(1.5) brightness(1.15)' },
]
```

- [ ] **Step 2: Actualizar `src/components/ColorSwitcher.tsx` para importar `THEMES`**

Reemplazar la definición local de `Theme` e `THEMES` con una importación:

```tsx
"use client";

import { useState, useEffect } from "react";
import { THEMES } from "@/lib/themes";
import type { Theme } from "@/lib/themes";

interface ColorSwitcherProps {
  defaultTheme?: string;
  variant?: "fixed" | "inline";
}

export default function ColorSwitcher({ defaultTheme = "rosagold", variant = "fixed" }: ColorSwitcherProps) {
  const [active, setActive] = useState(defaultTheme);

  function applyTheme(theme: Theme) {
    const root = document.documentElement;
    root.style.setProperty("--inv-primary", theme.primary);
    root.style.setProperty("--inv-primary-dark", theme.dark);
    root.style.setProperty("--inv-border", theme.primary);
    root.style.setProperty("--inv-filter", theme.filterValue);
    setActive(theme.id);
  }

  useEffect(() => {
    const initial = THEMES.find((t) => t.id === defaultTheme) ?? THEMES[0];
    applyTheme(initial);
  }, [defaultTheme]);

  return (
    <div className={`color-switcher${variant === "inline" ? " color-switcher--inline" : ""}`}>
      <div className="color-switcher-label">Paleta</div>
      <div className="color-switcher-swatches">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            className={`color-swatch${active === theme.id ? " active" : ""}`}
            style={{ background: theme.swatch }}
            title={theme.label}
            aria-label={`Tema ${theme.label}`}
            onClick={() => applyTheme(theme)}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verificar compilación**

```bash
npm run typecheck 2>&1 | grep -E "error|Error" | head -20
```

Esperado: sin errores de tipos.

- [ ] **Step 4: Commit**

```bash
git add src/lib/themes.ts src/components/ColorSwitcher.tsx
git commit -m "refactor: extract THEMES to src/lib/themes.ts and import in ColorSwitcher"
```

---

## Task 2: Actualizar tipos TypeScript

**Files:**
- Modify: `src/types/invitation.ts`
- Modify: `src/app/admin/actions.ts`

- [ ] **Step 1: Agregar campos a `Project` en `src/types/invitation.ts`**

Agregar justo antes del campo `extra_config`:

```ts
  color_theme: string
  invitation_text: string | null
```

El bloque final de `Project` queda:

```ts
  dress_code: { colors: string; notes: string } | null
  photos: string[]
  gift_registry: {
    liverpoolLink?: string
    bankAccount?: string
    bankBeneficiary?: string
  } | null
  color_theme: string
  invitation_text: string | null
  extra_config: Record<string, unknown>
```

- [ ] **Step 2: Agregar campos a `ProjectFormData` en `src/app/admin/actions.ts`**

Agregar al final de la interfaz `ProjectFormData`, antes del cierre `}`:

```ts
  color_theme: string
  invitation_text: string
```

- [ ] **Step 3: Actualizar `formDataToProject` en `src/app/admin/actions.ts`**

Agregar los dos campos nuevos al objeto retornado por `formDataToProject`, junto a `extra_config`:

```ts
    color_theme: data.color_theme || 'rosagold',
    invitation_text: data.invitation_text || null,
    extra_config: {},
```

El bloque `gift_registry` + `extra_config` queda:

```ts
    gift_registry: (data.liverpool_link || data.bank_account) ? {
      liverpoolLink: data.liverpool_link || undefined,
      bankAccount: data.bank_account || undefined,
      bankBeneficiary: data.bank_beneficiary || undefined,
    } : null,
    color_theme: data.color_theme || 'rosagold',
    invitation_text: data.invitation_text || null,
    extra_config: {},
```

- [ ] **Step 4: Verificar compilación**

```bash
npm run typecheck 2>&1 | grep -E "error|Error" | head -20
```

Esperado: sin errores.

- [ ] **Step 5: Commit**

```bash
git add src/types/invitation.ts src/app/admin/actions.ts
git commit -m "feat: add color_theme and invitation_text fields to Project type and actions"
```

---

## Task 3: Corregir scroll y agregar prop `showSwitcher` en `IntroEnvelope`

**Files:**
- Modify: `src/components/IntroEnvelope.tsx`

- [ ] **Step 1: Reemplazar el contenido completo de `src/components/IntroEnvelope.tsx`**

```tsx
"use client";

import { useRef } from "react";
import ColorSwitcher from "@/components/ColorSwitcher";

interface Props {
  musicUrl?: string;
  showSwitcher?: boolean;
}

export default function IntroEnvelope({
  musicUrl = "https://invitadigitalmanitas.com/musica/nocrezcasmas.mp3",
  showSwitcher = true,
}: Props) {
  const introRef = useRef<HTMLElement>(null);
  const sDerechoRef = useRef<HTMLImageElement>(null);
  const sIzquierdoRef = useRef<HTMLImageElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  function openEnvelope() {
    if (introRef.current) {
      introRef.current.classList.add("desaparecer");
    }
    if (sDerechoRef.current) {
      sDerechoRef.current.classList.add("efecto-derecha");
    }
    if (sIzquierdoRef.current) {
      sIzquierdoRef.current.classList.add("efecto-izquierda");
    }
    document.documentElement.classList.add("con-scroll");
    audioRef.current?.play().catch(() => {});
  }

  return (
    <>
      <audio
        ref={audioRef}
        id="sonido2"
        loop
        preload="auto"
        src={musicUrl}
      />
      <section
        ref={introRef}
        id="intro"
        className="bg-overlay-intro bg-intro"
      >
        <img
          ref={sDerechoRef}
          id="s-derecho"
          className="sobre-derecho"
          src="/images/sobre-derecho.png"
          alt=""
        />
        <img
          ref={sIzquierdoRef}
          id="s-izquierdo"
          className="sobre-izquierdo"
          src="/images/sobre-izquierdo.png"
          alt=""
        />
        <button
          onClick={openEnvelope}
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
            position: "absolute",
            top: "45%",
            left: "40%",
            zIndex: 99999,
          }}
          aria-label="Abrir invitación"
        >
          <img
            className="sello-img"
            src="/images/sello.png"
            alt="Abrir"
            style={{
              width: "120px",
              animation: "pulse 4000ms infinite",
            }}
          />
        </button>
        {showSwitcher && <ColorSwitcher variant="inline" defaultTheme="rosagold" />}
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verificar compilación**

```bash
npm run typecheck 2>&1 | grep -E "error|Error" | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/IntroEnvelope.tsx
git commit -m "fix: use document.documentElement for scroll unlock and add showSwitcher prop"
```

---

## Task 4: Agregar `invitationText` a `CelebracionSection` y CSS

**Files:**
- Modify: `src/components/CelebracionSection.tsx`
- Modify: `src/app/sobre/sobre.css`

- [ ] **Step 1: Actualizar `src/components/CelebracionSection.tsx`**

Agregar la prop `invitationText` y reemplazar el texto hardcodeado condicionalmente:

```tsx
interface Props {
  quinceaneraName?: string;
  parentNames?: string[];
  padrinos?: string[];
  invitationText?: string;
}

export default function CelebracionSection({
  quinceaneraName = "Aime Ferreira",
  parentNames = ["Felipe Ferreira", "Paola Mendoza"],
  padrinos = ["Sergio García", "Graciela Santos"],
  invitationText,
}: Props) {
```

Luego, en el JSX, reemplazar el párrafo con texto hardcodeado:

```tsx
// ANTES:
<p className="mb-30 color-textos text-center wow fadeInUp">
  Te invito a mis quince primaveras, porque formas parte esencial de
  mi vida y nada me haría más feliz que compartir contigo este día.
  Llegó el gran día soñado, donde comenzaré a crecer y comprender lo
  bello de la vida. Con amor, te invito a celebrar mis quince años
</p>

// DESPUÉS:
<p className="mb-30 color-textos text-center wow fadeInUp invitation-text-content">
  {invitationText || "Te invito a mis quince primaveras, porque formas parte esencial de mi vida y nada me haría más feliz que compartir contigo este día. Llegó el gran día soñado, donde comenzaré a crecer y comprender lo bello de la vida. Con amor, te invito a celebrar mis quince años"}
</p>
```

- [ ] **Step 2: Agregar clase `.invitation-text-content` en `src/app/sobre/sobre.css`**

Agregar al final del archivo:

```css
/* ======================================
   INVITATION TEXT
   ====================================== */

.invitation-text-content {
  white-space: pre-line;
}
```

(La fuente, color y alineado ya los hereda de `color-textos` y las reglas existentes de `p`.)

- [ ] **Step 3: Verificar compilación**

```bash
npm run typecheck 2>&1 | grep -E "error|Error" | head -20
```

- [ ] **Step 4: Commit**

```bash
git add src/components/CelebracionSection.tsx src/app/sobre/sobre.css
git commit -m "feat: add invitationText prop to CelebracionSection with fallback to default text"
```

---

## Task 5: Actualizar `SobreTemplate` — color dinámico, sin selector

**Files:**
- Modify: `src/components/templates/SobreTemplate.tsx`

- [ ] **Step 1: Reemplazar el contenido completo de `src/components/templates/SobreTemplate.tsx`**

```tsx
'use client'

import { useEffect } from "react";
import "@/app/sobre/sobre.css";
import { THEMES } from "@/lib/themes";
import type { Project } from "@/types/invitation";
import WowInit from "@/components/WowInit";
import IntroEnvelope from "@/components/IntroEnvelope";
import StickyBanner from "@/components/StickyBanner";
import HeroSection from "@/components/HeroSection";
import CelebracionSection from "@/components/CelebracionSection";
import ContadorSection from "@/components/ContadorSection";
import CeremoniaSection from "@/components/CeremoniaSection";
import RecepcionSection from "@/components/RecepcionSection";
import ItinerarioSection from "@/components/ItinerarioSection";
import VestimentaSection from "@/components/VestimentaSection";
import HashtagSection from "@/components/HashtagSection";
import FotosCarousel from "@/components/FotosCarousel";
import RSVPSection from "@/components/RSVPSection";
import FinalSection from "@/components/FinalSection";
import LluviaSobresSection from "@/components/LluviaDesobresSection";
import MesaRegalosSection from "@/components/MesaRegalosSection";
import VideoSection from "@/components/VideoSection";

interface Props {
  project: Project;
}

export default function SobreTemplate({ project }: Props) {
  const {
    quinceanera_name,
    guest_name,
    event_date,
    rsvp_phone,
    hashtag,
    music_url,
    hero_photo_url,
    parent_names,
    padrinos,
    ceremony,
    reception,
    itinerary,
    dress_code,
    photos,
    gift_registry,
    color_theme,
    invitation_text,
  } = project;

  useEffect(() => {
    const theme = THEMES.find(t => t.id === color_theme) ?? THEMES[0];
    const root = document.documentElement;
    root.style.setProperty("--inv-primary", theme.primary);
    root.style.setProperty("--inv-primary-dark", theme.dark);
    root.style.setProperty("--inv-border", theme.primary);
    root.style.setProperty("--inv-filter", theme.filterValue);
  }, [color_theme]);

  return (
    <>
      <WowInit />
      <IntroEnvelope musicUrl={music_url ?? undefined} showSwitcher={false} />
      <StickyBanner guestName={guest_name ?? undefined} />
      <HeroSection
        heroPhotoUrl={hero_photo_url ?? undefined}
        quinceaneraName={quinceanera_name}
      />
      <CelebracionSection
        quinceaneraName={quinceanera_name}
        parentNames={parent_names.length > 0 ? parent_names : undefined}
        padrinos={padrinos.length > 0 ? padrinos : undefined}
        invitationText={invitation_text ?? undefined}
      />
      <ContadorSection
        eventDate={event_date}
        quinceaneraName={quinceanera_name}
      />
      {ceremony && <CeremoniaSection ceremony={ceremony} />}
      {reception && <RecepcionSection reception={reception} />}
      {itinerary.length > 0 && <ItinerarioSection itinerary={itinerary} />}
      {dress_code && <VestimentaSection dressCode={dress_code} />}
      {hashtag && <HashtagSection hashtag={hashtag} />}
      {photos.length > 0 && <FotosCarousel photos={photos} />}
      {gift_registry?.liverpoolLink && (
        <MesaRegalosSection liverpoolLink={gift_registry.liverpoolLink} />
      )}
      {gift_registry?.bankAccount && (
        <LluviaSobresSection
          bankAccount={gift_registry.bankAccount}
          bankBeneficiary={gift_registry.bankBeneficiary}
        />
      )}
      <RSVPSection rsvpPhone={rsvp_phone ?? undefined} />
      <FinalSection
        quinceaneraName={quinceanera_name}
        finalPhotoUrl={hero_photo_url ?? undefined}
      />
      <VideoSection />
    </>
  );
}
```

- [ ] **Step 2: Verificar compilación**

```bash
npm run typecheck 2>&1 | grep -E "error|Error" | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/templates/SobreTemplate.tsx
git commit -m "feat: apply color_theme via CSS vars in SobreTemplate and hide ColorSwitcher in published view"
```

---

## Task 6: Actualizar `ProjectForm` — color swatches y textarea de mensaje

**Files:**
- Modify: `src/components/admin/ProjectForm.tsx`

- [ ] **Step 1: Agregar import de `THEMES` al inicio del archivo**

Después de los imports existentes, agregar:

```tsx
import { THEMES } from '@/lib/themes'
```

- [ ] **Step 2: Actualizar `toFormData` para incluir los campos nuevos**

En la rama `if (!project)`, agregar los campos al objeto retornado:

```ts
color_theme: 'rosagold',
invitation_text: '',
```

En la rama `return { slug: project.slug, ... }`, agregar:

```ts
color_theme: project.color_theme ?? 'rosagold',
invitation_text: project.invitation_text ?? '',
```

- [ ] **Step 3: Actualizar `ProjectFormData` default en `toFormData` (rama sin proyecto)**

El objeto completo de la rama `if (!project)` queda:

```ts
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
}
```

- [ ] **Step 4: Agregar selector de paleta en Tab 0 (General)**

Dentro del bloque `{activeTab === 0 && ...}`, después del `<select>` de template, agregar:

```tsx
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
```

- [ ] **Step 5: Agregar textarea de mensaje en Tab 1 (Contacto)**

Dentro del bloque `{activeTab === 1 && ...}`, después del campo "Nombre del invitado", agregar:

```tsx
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
```

- [ ] **Step 6: Verificar compilación**

```bash
npm run typecheck 2>&1 | grep -E "error|Error" | head -20
```

- [ ] **Step 7: Commit**

```bash
git add src/components/admin/ProjectForm.tsx
git commit -m "feat: add color palette picker and invitation message field to ProjectForm"
```

---

## Task 7: Verificación final

- [ ] **Step 1: Typecheck completo**

```bash
npm run typecheck 2>&1 | tail -5
```

Esperado: `Found 0 errors.`

- [ ] **Step 2: Verificar que el servidor dev responde sin errores**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin
```

Esperado: `200` (o `307` si no hay sesión activa).

- [ ] **Step 3: Commit final si hay cambios pendientes**

```bash
git status
```

Si hay cambios sin commitear, commitearlos. Si todo está commiteado, listo.
