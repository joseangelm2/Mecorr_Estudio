# Spec: Sobre Template — Paleta de color, mensaje de invitación y scroll

**Fecha:** 2026-06-05

---

## Objetivo

Cuatro mejoras al template "Sobre Animado":

1. El admin puede elegir una paleta de color al crear/editar un proyecto con template `sobre`.
2. La invitación publicada aplica esa paleta fija sin mostrar el selector al visitante.
3. El admin puede escribir un mensaje de invitación personalizado que aparece bajo el nombre en el Hero.
4. El scroll funciona correctamente al abrir el sobre en la ruta `/i/[slug]`.

---

## Base de datos

### Migración (ejecutar en Supabase → SQL Editor)

```sql
ALTER TABLE projects
  ADD COLUMN color_theme TEXT NOT NULL DEFAULT 'rosagold',
  ADD COLUMN invitation_text TEXT;
```

- `color_theme`: ID de paleta, uno de: `rosagold | azul | lila | rojo | negro | mariposas | blancooro`. Default `rosagold`.
- `invitation_text`: texto libre, nullable. Sólo usado por el template `sobre`.

---

## Tipos TypeScript

### `src/types/invitation.ts`

Agregar a la interfaz `Project`:

```ts
color_theme: string
invitation_text: string | null
```

### `src/app/admin/actions.ts` — `ProjectFormData`

Agregar:

```ts
color_theme: string
invitation_text: string
```

---

## Formulario admin (`src/components/admin/ProjectForm.tsx`)

### `toFormData`

Mapear los dos campos nuevos:

```ts
color_theme: project.color_theme ?? 'rosagold',
invitation_text: project.invitation_text ?? '',
```

### Tab "General" — selector de paleta

Mostrar el bloque solo cuando `form.template === 'sobre'`. Renderizar swatches cliqueables con los 7 colores del `ColorSwitcher`. El swatch activo tiene un borde/anillo resaltado.

```
Template: [Sobre Animado ▼]

Paleta de color:
  ● Rosa Gold  ○ Azul  ○ Lila  ○ Rojo  ○ Negro  ○ Mariposas  ○ Blanco Oro
```

Cada swatch al hacer clic: `set('color_theme', theme.id)`.

### Tab "Contacto" — mensaje de invitación

Agregar debajo del campo "Nombre del invitado":

```
Mensaje de invitación
[ textarea, 4 filas, placeholder: "Con cariño te invitamos a compartir nuestro día más especial..." ]
```

---

## Componentes

### `src/components/IntroEnvelope.tsx`

**Fix scroll:** cambiar

```ts
document.getElementById("html")?.classList.add("con-scroll");
```

por

```ts
document.documentElement.classList.add("con-scroll");
```

**Prop nueva:** `showSwitcher?: boolean` (default `true` para no romper `/sobre` demo).
Envolver el `<ColorSwitcher variant="inline" ...>` en `{showSwitcher && <ColorSwitcher ... />}`.

### `src/components/HeroSection.tsx`

**Prop nueva:** `invitationText?: string`

Si tiene valor, renderizar debajo del nombre:

```tsx
{invitationText && (
  <p className="invitation-text">{invitationText}</p>
)}
```

Agregar en `src/app/sobre/sobre.css`:

```css
.invitation-text {
  font-family: var(--font-raleway), "Raleway", sans-serif;
  font-size: 16px;
  color: var(--inv-primary);
  text-align: center;
  padding: 0 24px;
  margin-top: 8px;
}
```

### `src/components/templates/SobreTemplate.tsx`

1. Convertir a `'use client'` para poder usar `useEffect`.
2. En `useEffect`, leer `project.color_theme` y aplicar CSS variables:

```ts
useEffect(() => {
  const theme = THEMES.find(t => t.id === project.color_theme) ?? THEMES[0]
  const root = document.documentElement
  root.style.setProperty('--inv-primary', theme.primary)
  root.style.setProperty('--inv-primary-dark', theme.dark)
  root.style.setProperty('--inv-border', theme.primary)
  root.style.setProperty('--inv-filter', theme.filterValue)
}, [project.color_theme])
```

3. Pasar `showSwitcher={false}` a `<IntroEnvelope>`.
4. Pasar `invitationText={invitation_text ?? undefined}` a `<HeroSection>`.
5. Eliminar `<ColorSwitcher defaultTheme="rosagold" />` del JSX.

`THEMES` se importa o se duplica desde `ColorSwitcher.tsx` — preferible extraer a `src/lib/themes.ts` para compartir.

---

## Rutas demo (`/sobre`, `/sobrelila`, `/sobrenegro`, `/sobrered`)

Sin cambios. Siguen usando `IntroEnvelope` sin prop (default `showSwitcher=true`) y mostrando el selector para demostración.

---

## Flujo completo

```
Admin guarda proyecto (sobre + lila)
  → color_theme = 'lila' persiste en Supabase

Visitante abre /i/[slug]
  → SobreTemplate recibe project.color_theme = 'lila'
  → useEffect aplica --inv-primary = #8d77ab, etc.
  → IntroEnvelope sin selector (showSwitcher=false)
  → Al hacer clic en el sobre → document.documentElement.classList.add('con-scroll') → scroll funciona
  → HeroSection muestra invitation_text bajo el nombre
```

---

## Archivos a modificar

| Archivo | Cambio |
|---|---|
| Supabase SQL | ALTER TABLE — 2 columnas nuevas |
| `src/types/invitation.ts` | +2 campos en `Project` |
| `src/app/admin/actions.ts` | +2 campos en `ProjectFormData` y en create/update |
| `src/components/admin/ProjectForm.tsx` | Paleta en General, mensaje en Contacto |
| `src/lib/themes.ts` | Nuevo archivo — extrae THEMES de ColorSwitcher |
| `src/components/ColorSwitcher.tsx` | Importa THEMES desde `src/lib/themes.ts` |
| `src/components/IntroEnvelope.tsx` | Fix scroll + prop showSwitcher |
| `src/components/HeroSection.tsx` | Prop invitationText |
| `src/components/templates/SobreTemplate.tsx` | useEffect color + props nuevas + quitar ColorSwitcher |
| `src/app/sobre/sobre.css` | Agregar clase `.invitation-text` |
