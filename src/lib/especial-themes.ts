export interface EspecialTheme {
  id: string
  label: string
  swatch: string
  primary: string
  primaryDark: string
  primaryLight: string
  filterValue: string
  filterLight: string
}

export const ESPECIAL_THEMES: EspecialTheme[] = [
  {
    id: 'rosa',
    label: 'Rosa',
    swatch: '#d4819a',
    primary: '#d4819a',
    primaryDark: '#bc6b83',
    primaryLight: '#e89ab2',
    filterValue: 'hue-rotate(340deg) saturate(1.2)',
    filterLight: 'hue-rotate(340deg) saturate(0.7) brightness(1.4)',
  },
  {
    id: 'dorado',
    label: 'Dorado',
    swatch: '#c8a84b',
    primary: '#c8a84b',
    primaryDark: '#b09038',
    primaryLight: '#e0c06a',
    filterValue: 'hue-rotate(38deg) saturate(1.4)',
    filterLight: 'hue-rotate(38deg) saturate(0.95) brightness(1.4)',
  },
  {
    id: 'azul',
    label: 'Azul',
    swatch: '#5b8fc9',
    primary: '#5b8fc9',
    primaryDark: '#4a7ab8',
    primaryLight: '#7aaad8',
    filterValue: 'hue-rotate(210deg) saturate(1.3) brightness(0.9)',
    filterLight: 'hue-rotate(210deg) saturate(0.9) brightness(1.35)',
  },
  {
    id: 'verde',
    label: 'Verde',
    swatch: '#6aab8a',
    primary: '#6aab8a',
    primaryDark: '#549474',
    primaryLight: '#88c2a2',
    filterValue: 'hue-rotate(140deg) saturate(1.1)',
    filterLight: 'hue-rotate(140deg) saturate(0.75) brightness(1.4)',
  },
  {
    id: 'lila',
    label: 'Lila',
    swatch: '#9b7ec8',
    primary: '#9b7ec8',
    primaryDark: '#8568b5',
    primaryLight: '#b298d8',
    filterValue: 'hue-rotate(260deg) saturate(1.2)',
    filterLight: 'hue-rotate(260deg) saturate(0.8) brightness(1.4)',
  },
  {
    id: 'marino',
    label: 'Azul Marino',
    swatch: '#1e3a6e',
    primary: '#2b4f8a',
    primaryDark: '#1e3a6e',
    primaryLight: '#3b6cb0',
    filterValue: 'hue-rotate(218deg) saturate(2) brightness(0.55)',
    filterLight: 'hue-rotate(218deg) saturate(0.85) brightness(1.2)',
  },
]

export const DEFAULT_ESPECIAL_THEME = ESPECIAL_THEMES[0]
