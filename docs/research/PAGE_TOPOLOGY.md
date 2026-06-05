# Page Topology — XV Años Digital Invitation

## Layout Architecture
- Single-column mobile-first design
- Desktop: content column 30% width, centered, on a fixed background image
- Mobile: full-width
- Page is a scroll-locked document unlocked by clicking the envelope seal

## Fixed/Sticky Layers
| Layer | Element | z-index | Behavior |
|-------|---------|---------|----------|
| Envelope overlay | `#intro` | 99999999 | `position: absolute`, full-height, disappears on click |
| Sticky name banner | `#cintillo` | 10 | `position: fixed; top: 0`, fades in at scroll > 300px |
| Background wallpaper | `body::after` | -1 | Fixed full-viewport background image |

## Content Sections (flow order)
1. **HeroPhoto** — Full-width photo `IMG_8198.JPG` with animated scroll-down arrow overlay
2. **Celebracion** — bg: `rgba(255,255,255,.5)`, name + invitation text + parents + godparents
3. **Contador** — bg: `#a8686a`, countdown timer to Nov 22 2026
4. **Ceremonia** — bg: `rgba(255,255,255,.5)`, church icon + time + location + map link
5. **Recepcion** — bg: `rgba(255,255,255,.5)`, reception icon + time + location + map link
6. **Itinerario** — bg: `rgba(255,255,255,.5)`, scroll-driven vertical timeline
7. **Vestimenta** — bg: `rgba(255,255,255,.5)`, dress code icon + label
8. **Hashtag** — bg: `rgba(255,255,255,.5)`, hashtag icon + share CTA
9. **Fotos** — bg: `rgba(255,255,255,.5)`, Owl carousel (4 photos)
10. **Deseos/RSVP** — bg: `rgba(255,255,255,.5)` + backdrop-filter blur(10px), WhatsApp form
11. **FinalNombre** — bg: `IMG_8206.JPG` with dark gradient overlay, "¡Te Espero! Aime Ferreira"

## Interaction Models
| Section | Model |
|---------|-------|
| Intro envelope | Click-driven (seal click) |
| Sticky banner | Scroll-driven (threshold 300px) |
| WOW animations | Scroll-driven (IntersectionObserver via WOW.js) |
| Countdown | Time-driven (setInterval 1s) |
| Timeline | Scroll-driven (JS scroll listener) |
| Photo carousel | Time-driven (autoplay) + drag |
| RSVP form | Click-driven (form submit → WhatsApp) |

## Component Dependencies
- All sections depend on: Foundation CSS (globals.css), custom font "Titles" (marchila.otf)
- Carousel section depends on: Owl Carousel library (or equivalent)
- Timeline depends on: scroll listener logic
- WOW animations depend on: Intersection Observer or WOW-equivalent
- Countdown depends on: JS Date timer

## Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#a8686a` | Countdown bg, buttons, links, timeline active, carousel dots |
| Dark | `#222` | Body background, footer |
| Text | `#292929` | Body text |
| White translucent | `rgba(255,255,255,0.5)` | Section backgrounds |
| White | `#fff` | Countdown text, button text |
| Gradient text | `linear-gradient(to right, #a8686a 0%, #a8686a 100%)` | .color-titulos (h1 titles) |
| Timeline inactive | `#c5c3cb` | Timeline icon background |
| Form border | `#12397A` | Input borders |

## Typography
| Element | Font | Size |
|---------|------|------|
| h1-h6 (.titulo) | Marchila (custom OTF) | 30px default, 60px for name, 26px for subtitle |
| body text | Raleway, serif | 18px |
| links | Raleway, serif | 18px |
| Countdown circles | Marchila | 18px |
| Small labels | Raleway | 14px |
