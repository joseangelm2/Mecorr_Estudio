export function hexToFilter(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0
  if (max !== min) {
    const d = max - min
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break
      case g: h = ((b - r) / d + 2) * 60; break
      case b: h = ((r - g) / d + 4) * 60; break
    }
  }
  const s = max === 0 ? 0 : (max - min) / max
  return `hue-rotate(${Math.round(h)}deg) saturate(${(s * 2).toFixed(1)}) brightness(${(max * 1.5).toFixed(1)})`
}

export function shadeHex(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const r = Math.min(255, Math.max(0, (num >> 16) + amt))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt))
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt))
  return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)
}

export function hexToRgbTriplet(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break
      case g: h = ((b - r) / d + 2) * 60; break
      case b: h = ((r - g) / d + 4) * 60; break
    }
  }
  return { h, s, l }
}

/**
 * Filter to re-hue an image whose dominant color is `baseHex` so it approximates
 * `targetHex` instead. Unlike hexToFilter (which assumes a red/white baseline),
 * this rotates hue relative to the asset's actual native color.
 */
export function hexToFilterFrom(targetHex: string, baseHex: string): string {
  const t = hexToHsl(targetHex)
  const b = hexToHsl(baseHex)
  const hueRotate = ((t.h - b.h) % 360 + 360) % 360
  const saturate = b.s === 0 ? 1 : t.s / b.s
  const brightness = b.l === 0 ? 1 : t.l / b.l
  return `hue-rotate(${Math.round(hueRotate)}deg) saturate(${saturate.toFixed(2)}) brightness(${brightness.toFixed(2)})`
}
