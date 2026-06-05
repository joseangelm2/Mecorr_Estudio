# Behavior Bible — invitaelegante.com XV Años Invitation

## Global Behaviors

### 1. Initial State — Scroll Locked
- `html` has `overflow: hidden` by default, blocking scroll
- Body has `overflow-x: hidden`
- On desktop (>769px), content is 30% width centered on page

### 2. Envelope Intro (CLICK-DRIVEN)
- **Trigger:** Click on the seal image (`.sello`)
- **What happens:**
  1. `#intro` gets class `desaparecer` → `visibility: hidden; opacity: 0; transition: all 3s`
  2. `#s-derecho` gets class `efecto-derecha` → `right: -800px; transition: all 3s`
  3. `#s-izquierdo` gets class `efecto-izquierda` → `left: -800px; transition: all 3s`
  4. `html` gets class `con-scroll` → `overflow-y: scroll` (unlocks scrolling)
  5. Background music starts playing (audio element `#sonido2`)
- **Duration:** All transitions 3s

### 3. Sticky Name Banner (#cintillo)
- **Initial state:** `opacity: 0; transition-duration: 0.5s`
- **Trigger:** Window scroll > 300px
- **Scrolled state:** Gets class `cintillo-scrolled` → `opacity: 1; transition-duration: 0.5s`
- **Position:** `fixed; top: 0; z-index: 10; width: 100%` (desktop: 50% width)
- **Implementation:** JS scroll listener with threshold at 300px

### 4. WOW.js Scroll Animations (SCROLL-DRIVEN)
- **Library:** WOW.js with animate.css
- **Trigger:** Element enters viewport (offset: 100px)
- **Animation class:** `fadeInUp` applied to most content sections
- **Delays:** 0.4s or 0.6s (data-wow-delay attribute)
- **Initial state:** `visibility: hidden`
- **Active state:** `animation-name: fadeInUp; visibility: visible`

### 5. Countdown Timer (TIME-DRIVEN)
- **Target date:** November 22, 2026, 15:00:00
- **Update interval:** Every 1 second via setInterval
- **Elements:** `#days`, `#hours`, `#minutes`, `#seconds`
- **Displays:** Days, Hrs, Min, Seg

### 6. Owl Carousel — Photo Gallery (TIME/INTERACTION-DRIVEN)
- **Library:** Owl Carousel 2
- **Config:** loop: true, margin: 10, autoplay: true, autoHeight: true
- **Responsive:** 1 item at all breakpoints (0, 600, 1000)
- **nav:** disabled; dots shown
- **Active dot color:** #a8686a

### 7. Scroll-Driven Timeline (#itinerario)
- **Mechanism:** JS scroll listener with IntersectionObserver-like logic
- **When item is in view:** Gets class `active`
  - `.icon-holder` background changes from `#c5c3cb` to `#a8686a`
  - `.icon-holder::before` background changes from `#c5c3cb` to `#a8686a`
  - Icon image gets `filter: invert(100%)` (becomes white)
- **Progress bar:** `.list-progress .inner` height shrinks/grows based on scroll position
- **Transition:** `0.4s all` on icon-holder

### 8. RSVP Form — WhatsApp Redirect
- **Trigger:** Form submit
- **Action:** Opens WhatsApp with pre-filled message
- **Phone:** +521 4438569931
- **Message format:** "Hola, soy [nombre] y confirmo mi asistencia, asistiremos [cantidad], Mi Mensaje: [mensaje]"

## Responsive Behavior

### Desktop (>769px)
- `#body` constrained to `width: 30%`, centered with `margin: 0 auto`
- Background image fixed behind via `body::after` pseudo-element
- Fixed background spans from 35% to 65% of viewport (30% width at 35% left)
- `.invitado` (sticky banner) is `width: 50%` (centered over content)

### Mobile (≤768px)
- Full-width layout
- Background image covers full viewport via `body::after`
- `.invitado` is full width

## Section Order (top to bottom)
1. `#intro` — Envelope overlay (position: absolute, z-index: 99999999)
2. `#cintillo` — Sticky name banner (fixed, z-index: 10)
3. Hero photo section — Full-width photo + animated scroll arrow
4. `#celebracion` — Name, invitation text, parents, godparents
5. `#contador` — Countdown timer (background: #a8686a)
6. `#ceremonia` — Church ceremony details
7. `#recepcion` — Reception details
8. `#itinerario` — Scroll-driven vertical timeline
9. `#vestimenta` — Dress code
10. `#hashtag` — Share photos CTA
11. `#fotos` — Owl carousel photo gallery
12. `#deseos` — RSVP form with WhatsApp
13. `#nombre` — Final farewell with background photo

## Audio
- Background music: `https://invitadigitalmanitas.com/musica/nocrezcasmas.mp3`
- Auto-plays when envelope is opened
- Loops continuously
