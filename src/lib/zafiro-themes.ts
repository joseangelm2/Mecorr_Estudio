import { shadeHex, hexToFilterFrom } from './color'

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
}

const PRESETS: Array<Pick<ZafiroTheme, 'id' | 'label' | 'primary'> & Partial<Pick<ZafiroTheme, 'primaryLight' | 'bgColor' | 'iconFilterDark'>>> = [
  { id: 'morado',    label: 'Morado (original)', primary: '#775197', primaryLight: '#e5bdff', bgColor: '#ead4ff', iconFilterDark: 'none' },
  { id: 'rosagold',  label: 'Rosa Gold',  primary: '#a8686a' },
  { id: 'azul',      label: 'Azul',       primary: '#12397A' },
  { id: 'lila',      label: 'Lila',       primary: '#8d77ab' },
  { id: 'rojo',      label: 'Rojo',       primary: '#ff3131' },
  { id: 'negro',     label: 'Negro',      primary: '#424242' },
  { id: 'mariposas', label: 'Mariposas',  primary: '#b4882d' },
  { id: 'blancooro', label: 'Blanco Oro', primary: '#d4b030' },
]

export const ZAFIRO_THEMES: ZafiroTheme[] = PRESETS.map(t => ({
  id: t.id,
  label: t.label,
  swatch: t.primary,
  primary: t.primary,
  primaryLight: t.primaryLight ?? shadeHex(t.primary, 45),
  bgColor: t.bgColor ?? shadeHex(t.primary, 62),
  iconFilterDark: t.iconFilterDark ?? hexToFilterFrom(shadeHex(t.primary, -20), ZAFIRO_ICON_BASE),
}))

export const DEFAULT_ZAFIRO_THEME = ZAFIRO_THEMES[0]
