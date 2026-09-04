export interface EleganceTheme {
  id: string
  label: string
  swatch: string
  colorPrincipal: string
  bgColor: string
  cuentaFondo: string
  nombreColor: string
  subtitulosColor: string
  textosColor: string
  cuentaTexto: string
  overlay: string
  botonColor: string
  botonTextoColor: string
  imgFilter: string
  iconFilter: string
}

const GOLD_IMG_FILTER = 'sepia(1) saturate(4) hue-rotate(8deg) brightness(0.9)'

export const ELEGANCE_THEMES: EleganceTheme[] = [
  {
    id: 'azul-dorado',
    label: 'Azul Dorado',
    swatch: '#1B488F',
    colorPrincipal: '#1B488F',
    bgColor: '#1B488F',
    cuentaFondo: '#123577',
    nombreColor: '#BA8100',
    subtitulosColor: '#F7BB52',
    textosColor: '#F2D67F',
    cuentaTexto: '#F2D67F',
    overlay: 'rgba(27, 72, 143, 0.55)',
    botonColor: '#F2D67F',
    botonTextoColor: '#BA8100',
    imgFilter: 'none',
    iconFilter: 'brightness(0) invert(1) sepia(1) hue-rotate(181deg) saturate(4) brightness(0.52)',
  },
  {
    id: 'morado-dorado',
    label: 'Morado Dorado',
    swatch: '#8772b9',
    colorPrincipal: '#8772b9',
    bgColor: '#8772b9',
    cuentaFondo: '#2A1266',
    nombreColor: '#BA8100',
    subtitulosColor: '#F7BB52',
    textosColor: '#F2D67F',
    cuentaTexto: '#F2D67F',
    overlay: 'rgba(135, 114, 185, 0.65)',
    botonColor: '#F2D67F',
    botonTextoColor: '#BA8100',
    imgFilter: 'none',
    iconFilter: 'brightness(0) invert(1) sepia(1) hue-rotate(227deg) saturate(2) brightness(0.80)',
  },
  {
    id: 'marino-dorado',
    label: 'Azul Marino',
    swatch: '#0D2461',
    colorPrincipal: '#0D2461',
    bgColor: '#0D2461',
    cuentaFondo: '#091A4A',
    nombreColor: '#BA8100',
    subtitulosColor: '#F7BB52',
    textosColor: '#F2D67F',
    cuentaTexto: '#F2D67F',
    overlay: 'rgba(13, 36, 97, 0.55)',
    botonColor: '#F2D67F',
    botonTextoColor: '#BA8100',
    imgFilter: 'none',
    iconFilter: 'brightness(0) invert(1) sepia(1) hue-rotate(189deg) saturate(5) brightness(0.35)',
  },
  {
    id: 'esmeralda-dorado',
    label: 'Esmeralda Dorado',
    swatch: '#0D5C4A',
    colorPrincipal: '#0D5C4A',
    bgColor: '#0D5C4A',
    cuentaFondo: '#0A3D31',
    nombreColor: '#BA8100',
    subtitulosColor: '#F7BB52',
    textosColor: '#F2D67F',
    cuentaTexto: '#F2D67F',
    overlay: 'rgba(13, 92, 74, 0.55)',
    botonColor: '#F2D67F',
    botonTextoColor: '#BA8100',
    imgFilter: 'none',
    iconFilter: 'brightness(0) invert(1) sepia(1) hue-rotate(131deg) saturate(5) brightness(0.40)',
  },
  {
    id: 'blanco-dorado',
    label: 'Blanco Dorado',
    swatch: '#FAF6EE',
    colorPrincipal: '#FAF6EE',
    bgColor: '#FAF6EE',
    cuentaFondo: '#EDE3CC',
    nombreColor: '#7A5200',
    subtitulosColor: '#B8860B',
    textosColor: '#8B6914',
    cuentaTexto: '#5C3D00',
    overlay: 'rgba(250, 246, 238, 0.93)',
    botonColor: 'linear-gradient(180deg, #fffbe0 0%, #f5c842 12%, #c8880c 28%, #ffd700 44%, #7a4e00 56%, #e8a800 68%, #b8780a 80%, #ffe585 92%, #c89010 100%)',
    botonTextoColor: '#FFFFFF',
    imgFilter: GOLD_IMG_FILTER,
    iconFilter: 'invert(100%)',
  },
  {
    id: 'rosa-dorado',
    label: 'Rosa Dorado',
    swatch: '#e27fc6',
    colorPrincipal: '#e27fc6',
    bgColor: '#f7d5f0',
    cuentaFondo: '#551040',
    nombreColor: '#BA8100',
    subtitulosColor: '#F7BB52',
    textosColor: '#F2D67F',
    cuentaTexto: '#F2D67F',
    overlay: 'rgba(226, 127, 198, 0.50)',
    botonColor: '#F2D67F',
    botonTextoColor: '#BA8100',
    imgFilter: 'none',
    iconFilter: 'brightness(0) invert(1) sepia(1) hue-rotate(278deg) saturate(6) brightness(0.55)',
  },
  {
    id: 'rojo-dorado',
    label: 'Rojo Dorado',
    swatch: '#8B1A1A',
    colorPrincipal: '#8B1A1A',
    bgColor: '#8B1A1A',
    cuentaFondo: '#5C1010',
    nombreColor: '#BA8100',
    subtitulosColor: '#F7BB52',
    textosColor: '#F2D67F',
    cuentaTexto: '#F2D67F',
    overlay: 'rgba(139, 26, 26, 0.55)',
    botonColor: '#F2D67F',
    botonTextoColor: '#BA8100',
    imgFilter: 'none',
    iconFilter: 'brightness(0) invert(1) sepia(1) hue-rotate(325deg) saturate(5) brightness(0.42)',
  },
  {
    id: 'turquesa-dorado',
    label: 'Turquesa Dorado',
    swatch: '#00a9c3',
    colorPrincipal: '#00a9c3',
    bgColor: '#00a9c3',
    cuentaFondo: '#00788C',
    nombreColor: '#BA8100',
    subtitulosColor: '#F7BB52',
    textosColor: '#F2D67F',
    cuentaTexto: '#F2D67F',
    overlay: 'rgba(0, 169, 195, 0.55)',
    botonColor: '#F2D67F',
    botonTextoColor: '#BA8100',
    imgFilter: 'none',
    iconFilter: 'brightness(0) invert(1) sepia(1) hue-rotate(151deg) saturate(5) brightness(0.55)',
  },
]

export const DEFAULT_ELEGANCE_THEME = ELEGANCE_THEMES.find(t => t.id === 'blanco-dorado')!
