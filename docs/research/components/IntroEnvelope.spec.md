# IntroEnvelope Specification

## Overview
- **Target file:** `src/components/IntroEnvelope.tsx`
- **Screenshot:** `docs/design-references/intro-envelope.png`
- **Interaction model:** Click-driven (seal click unlocks the invitation)

## DOM Structure
- `section#intro.bg-overlay-intro.bg-intro` — full-viewport overlay
  - `img.sobre-derecho` — right envelope flap
  - `img.sobre-izquierdo` — left envelope flap
  - `a` (clickable seal) — `img.sello` centered seal

## Computed Styles

### #intro
- position: absolute
- width: 100%
- height: 100vh
- z-index: 99999999
- display: flex; justify-content: center; align-content: center; flex-direction: column
- backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px)
- background-image: url(/images/background-mob.jpg); background-size: cover; background-position: center

### .sobre-derecho (mobile)
- position: absolute; right: 0; top: 0; height: 100%

### .sobre-izquierdo (mobile)
- position: absolute; left: 0; top: 0; bottom: 0; margin: auto; height: 100%

### .sello
- position: absolute; width: 120px; top: 45%; left: 40%;
- cursor: pointer; animation: pulse 4000ms infinite

### .bg-overlay-intro::after
- position: absolute; z-index: -1; top: 0; left: 0; width: 100%; height: 100%
- background-color: #fff; opacity: 0.6; content: ""

## States & Behaviors

### Seal Click — Opens Invitation
- **Trigger:** Click on `.sello` image
- **State A (before):** `#intro` visible, html has `overflow: hidden`
- **State B (after):**
  - `#intro` gets class `desaparecer`: `visibility: hidden; opacity: 0; transition: all 3s`
  - `.sobre-derecho` gets class `efecto-derecha`: `right: -800px; transition: all 3s`
  - `.sobre-izquierdo` gets class `efecto-izquierda`: `left: -800px; transition: all 3s`
  - `html` gets class `con-scroll`: `overflow-y: scroll`
  - Audio starts playing
- **Transition:** 3s for all elements

### Seal Pulse Animation
- `animation: pulse 4000ms infinite` from animate.css
- Gentle pulsing scale animation

## Assets
- Right envelope: `/images/sobre-derecho.png`
- Left envelope: `/images/sobre-izquierdo.png`
- Seal stamp: `/images/sello.png`
- Background: `/images/background-mob.jpg`
- Audio: `https://invitadigitalmanitas.com/musica/nocrezcasmas.mp3`

## Text Content
None (visual only)

## Responsive Behavior
- Mobile: envelope images use `height: 100%`
- Desktop (>769px): envelope images use `width: 100%`
