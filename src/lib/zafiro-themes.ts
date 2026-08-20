import { shadeHex, hexToFilterFrom, hexToRgbTriplet } from './color'

// Native color baked into the zafiro icon/crown/background artwork (vestimenta.png,
// buzon.png, liverpool.png, corona.png, lila3.jpg, etc.) — used as the baseline to
// re-hue those assets toward each theme's dark tone.
export const ZAFIRO_ICON_BASE = '#775197'

export interface ZafiroTheme {
  id: string
  label: string
  swatch: string
  primary: string
  primaryLight: string
  bgColor: string
  iconFilterDark: string
  // Sobre (envelope) — familia de tonos derivados del primario
  envBg1: string
  envBg2: string
  envFlap: string
  envBody1: string
  envBody2: string
  envSeal1: string
  envSeal2: string
  envAccentRgb: string
  envGlowRgb: string
}

type PresetOverrides = Partial<Pick<ZafiroTheme,
  | 'primaryLight' | 'bgColor' | 'iconFilterDark'
  | 'envBg1' | 'envBg2' | 'envFlap' | 'envBody1' | 'envBody2'
  | 'envSeal1' | 'envSeal2' | 'envAccentRgb' | 'envGlowRgb'
>>

const PRESETS: Array<Pick<ZafiroTheme, 'id' | 'label' | 'primary'> & PresetOverrides> = [
  {
    id: 'morado', label: 'Morado (original)', primary: '#775197',
    primaryLight: '#e5bdff', bgColor: '#ead4ff', iconFilterDark: 'none',
    envBg1: '#1a0a2e', envBg2: '#0d0618', envFlap: '#3a1f5e',
    envBody1: '#2d1254', envBody2: '#4a1f7a',
    envSeal1: '#9b59d0', envSeal2: '#5c1e99',
    envAccentRgb: '200, 180, 255', envGlowRgb: '150, 80, 230',
  },
  { id: 'rosagold',  label: 'Rosa Gold',  primary: '#a8686a' },
  { id: 'azul',      label: 'Azul',       primary: '#12397A' },
  { id: 'lila',      label: 'Lila',       primary: '#8d77ab' },
  { id: 'rojo',      label: 'Rojo',       primary: '#ff3131' },
  { id: 'negro',     label: 'Negro',      primary: '#424242' },
  { id: 'mariposas', label: 'Mariposas',  primary: '#b4882d' },
  { id: 'blancooro', label: 'Blanco Oro', primary: '#d4b030' },
]

export const ZAFIRO_THEMES: ZafiroTheme[] = PRESETS.map(t => {
  const primaryLight = t.primaryLight ?? shadeHex(t.primary, 45)
  const envSeal1 = t.envSeal1 ?? shadeHex(t.primary, 14)
  return {
    id: t.id,
    label: t.label,
    swatch: t.primary,
    primary: t.primary,
    primaryLight,
    bgColor: t.bgColor ?? shadeHex(t.primary, 62),
    iconFilterDark: t.iconFilterDark ?? hexToFilterFrom(shadeHex(t.primary, -20), ZAFIRO_ICON_BASE),
    envBg1: t.envBg1 ?? shadeHex(t.primary, -35),
    envBg2: t.envBg2 ?? shadeHex(t.primary, -40),
    envFlap: t.envFlap ?? shadeHex(t.primary, -22),
    envBody1: t.envBody1 ?? shadeHex(t.primary, -27),
    envBody2: t.envBody2 ?? shadeHex(t.primary, -16),
    envSeal1,
    envSeal2: t.envSeal2 ?? shadeHex(t.primary, -10),
    envAccentRgb: t.envAccentRgb ?? hexToRgbTriplet(primaryLight),
    envGlowRgb: t.envGlowRgb ?? hexToRgbTriplet(envSeal1),
  }
})

export const DEFAULT_ZAFIRO_THEME = ZAFIRO_THEMES[0]
