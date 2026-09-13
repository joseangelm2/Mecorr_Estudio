export interface EsmeraldaTheme {
  id: string
  label: string
  swatch: string
  colorPrincipal: string
  colorElementos: string
  colorOverlay: string
  nombreColor: string
  subtitulosColor: string
  itinerarioCardColor: string
  lineSobre: string
  selloShadow1: string
  selloShadow2: string
}

export const ESMERALDA_THEMES: EsmeraldaTheme[] = [
  {
    id: 'esmeralda-dorado',
    label: 'Esmeralda Dorado',
    swatch: '#098074',
    colorPrincipal: '#098074',
    colorElementos: 'rgb(26, 161, 134)',
    colorOverlay: 'rgba(9, 128, 116, 0.6)',
    nombreColor: '#b78946',
    subtitulosColor: '#f2c96a',
    itinerarioCardColor: 'rgba(32, 102, 64, 0.12)',
    lineSobre: '#b88585',
    selloShadow1: 'rgba(121, 172, 155, 0.7)',
    selloShadow2: 'rgba(192, 202, 196, 0.5)',
  },
  {
    id: 'azul-dorado',
    label: 'Azul Dorado',
    swatch: '#1B488F',
    colorPrincipal: '#1B488F',
    colorElementos: 'rgb(40, 94, 186)',
    colorOverlay: 'rgba(27, 72, 143, 0.6)',
    nombreColor: '#BA8100',
    subtitulosColor: '#F7BB52',
    itinerarioCardColor: 'rgba(18, 53, 119, 0.15)',
    lineSobre: '#5a76a8',
    selloShadow1: 'rgba(130, 160, 200, 0.7)',
    selloShadow2: 'rgba(190, 200, 215, 0.5)',
  },
  {
    id: 'morado-dorado',
    label: 'Morado Dorado',
    swatch: '#8772b9',
    colorPrincipal: '#8772b9',
    colorElementos: 'rgb(120, 98, 180)',
    colorOverlay: 'rgba(135, 114, 185, 0.6)',
    nombreColor: '#BA8100',
    subtitulosColor: '#F7BB52',
    itinerarioCardColor: 'rgba(66, 38, 122, 0.15)',
    lineSobre: '#9d8ac0',
    selloShadow1: 'rgba(165, 150, 205, 0.7)',
    selloShadow2: 'rgba(205, 200, 220, 0.5)',
  },
  {
    id: 'marino-dorado',
    label: 'Azul Marino',
    swatch: '#0D2461',
    colorPrincipal: '#0D2461',
    colorElementos: 'rgb(35, 65, 135)',
    colorOverlay: 'rgba(13, 36, 97, 0.65)',
    nombreColor: '#BA8100',
    subtitulosColor: '#F7BB52',
    itinerarioCardColor: 'rgba(9, 26, 74, 0.18)',
    lineSobre: '#4a5f96',
    selloShadow1: 'rgba(100, 125, 180, 0.7)',
    selloShadow2: 'rgba(180, 190, 210, 0.5)',
  },
  {
    id: 'rosa-dorado',
    label: 'Rosa Dorado',
    swatch: '#e27fc6',
    colorPrincipal: '#e27fc6',
    colorElementos: 'rgb(216, 110, 180)',
    colorOverlay: 'rgba(226, 127, 198, 0.55)',
    nombreColor: '#BA8100',
    subtitulosColor: '#F7BB52',
    itinerarioCardColor: 'rgba(170, 40, 130, 0.15)',
    lineSobre: '#d79bc7',
    selloShadow1: 'rgba(225, 170, 210, 0.7)',
    selloShadow2: 'rgba(225, 205, 220, 0.5)',
  },
  {
    id: 'rojo-dorado',
    label: 'Rojo Dorado',
    swatch: '#8B1A1A',
    colorPrincipal: '#8B1A1A',
    colorElementos: 'rgb(178, 45, 45)',
    colorOverlay: 'rgba(139, 26, 26, 0.7)',
    nombreColor: '#BA8100',
    subtitulosColor: '#F7BB52',
    itinerarioCardColor: 'rgba(92, 16, 16, 0.18)',
    lineSobre: '#b85d5d',
    selloShadow1: 'rgba(195, 140, 140, 0.7)',
    selloShadow2: 'rgba(210, 190, 190, 0.5)',
  },
  {
    id: 'turquesa-dorado',
    label: 'Turquesa Dorado',
    swatch: '#00a9c3',
    colorPrincipal: '#00a9c3',
    colorElementos: 'rgb(14, 181, 204)',
    colorOverlay: 'rgba(0, 169, 195, 0.55)',
    nombreColor: '#BA8100',
    subtitulosColor: '#F7BB52',
    itinerarioCardColor: 'rgba(0, 120, 140, 0.15)',
    lineSobre: '#6ccbdb',
    selloShadow1: 'rgba(130, 200, 210, 0.7)',
    selloShadow2: 'rgba(195, 215, 218, 0.5)',
  },
]

export const DEFAULT_ESMERALDA_THEME = ESMERALDA_THEMES[0]
