import { hexToRgbTriplet, shadeHex } from '@/lib/color'

export interface BodaTheme {
  id: string
  label: string
  swatch: string
  primary: string // acento: títulos, botones, bordes
  soft: string // tono claro: degradados
  bg: string // fondo de la invitación
  dark: string // tono oscuro: degradados
  deep: string // tono muy oscuro: velos sobre fotos
}

export const BODASOBRE_THEMES: BodaTheme[] = [
  { id: 'blanco', label: 'Blanco', swatch: '#a89270', primary: '#a89270', soft: '#e8dfcf', bg: '#fbf9f4', dark: '#7d6b4c', deep: '#3b3326' },
  { id: 'rosa', label: 'Rosa', swatch: '#cb997e', primary: '#cb997e', soft: '#f5babc', bg: '#fff0f3', dark: '#a4717a', deep: '#572d38' },
  { id: 'champagne', label: 'Champagne', swatch: '#b89b5e', primary: '#b89b5e', soft: '#e9d8a6', bg: '#fbf6e9', dark: '#8a7440', deep: '#4a3d1f' },
  { id: 'salvia', label: 'Salvia', swatch: '#7d9a84', primary: '#7d9a84', soft: '#c5d8c8', bg: '#f2f7f3', dark: '#56705d', deep: '#26362a' },
  { id: 'azul', label: 'Azul empolvado', swatch: '#6f8fb0', primary: '#6f8fb0', soft: '#bcd0e6', bg: '#eef4fa', dark: '#466484', deep: '#1f2f40' },
  { id: 'vino', label: 'Vino', swatch: '#a0485c', primary: '#a0485c', soft: '#e6b4be', bg: '#fbeff1', dark: '#6f2a3b', deep: '#3a121c' },
]

export const DEFAULT_BODASOBRE_THEME = BODASOBRE_THEMES[0] // Blanco (papel rugoso con flores blancas)

// Paleta derivada de un solo color elegido a mano (mismo criterio que Zafiro/Esmeralda Especial).
export function themeFromColor(hex: string): BodaTheme {
  return {
    id: 'custom',
    label: 'Personalizado',
    swatch: hex,
    primary: hex,
    soft: shadeHex(hex, 45),
    bg: shadeHex(hex, 90),
    dark: shadeHex(hex, -28),
    deep: shadeHex(hex, -90),
  }
}

// Variables CSS que consume bodasobre.css (con triples RGB para los rgba()).
export function themeVars(t: BodaTheme): Record<string, string> {
  return {
    '--bs-primary': t.primary,
    '--bs-soft': t.soft,
    '--bs-bg': t.bg,
    '--bs-dark': t.dark,
    '--bs-primary-rgb': hexToRgbTriplet(t.primary),
    '--bs-soft-rgb': hexToRgbTriplet(t.soft),
    '--bs-dark-rgb': hexToRgbTriplet(t.dark),
    '--bs-deep-rgb': hexToRgbTriplet(t.deep),
  }
}
