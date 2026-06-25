# INDEX — Memory Palace

> Mapa del cuaderno. Toda entrada nueva se referencia aquí en una línea.

## Archivos activos
- [context](context.md) — misión y alcance
- [decisions](decisions.md) — decisiones de arquitectura
- [research](research.md) — investigación en curso
- [code-notes](code-notes.md) — decisiones de código (si aplica)
- [reviews](reviews.md) — hallazgos de revisión (si aplica)
- [blockers](blockers.md) — unknowns activos
- [glossary](glossary.md) — terminología del proyecto

## Últimas entradas
<!-- formato: - [YYYY-MM-DD] [agente] → archivo#anchor — título -->
- [2026-06-24] [orquestador] → context.md — Misión, alcance, stack, templates, DB y flujos de Goldrose
- [2026-06-24] [orquestador] → decisions.md — 9 ADRs: templates dinámicos, slugs, auth, temas CSS, RSVP, extra_config, storage
- [2026-06-24] [orquestador] → glossary.md — Terminología del dominio, templates, secciones y términos técnicos propios
- [2026-06-24] [revisor] → reviews.md — 10 findings: proxy auth, .wow en condicionales, sobre, scroll, itinerario, sello (1 pendiente)
- [2026-06-24] [coder] → code-notes.md — CSS vars dinámicas del sistema de temas (EspecialTemplate)
- [2026-06-24] [coder] → code-notes.md — Filtro del sello separado de filtro del fondo
- [2026-06-24] [coder] → code-notes.md — Timing del sobre: audio antes del desmontaje React
- [2026-06-24] [coder] → code-notes.md — .wow/IntersectionObserver: trampa de elementos dinámicos
- [2026-06-24] [coder] → code-notes.md — Scroll bloqueado hasta apertura del sobre
- [2026-06-24] [coder] → code-notes.md — history.scrollRestoration manual al cargar
- [2026-06-24] [coder] → code-notes.md — extra_config JSONB: patrón de lectura y escritura
- [2026-06-24] [coder] → code-notes.md — Proxy Supabase SSR: patrón setAll obligatorio
- [2026-06-24] [coder] → code-notes.md — RSVP sin persistencia: diseño por privacidad
- [2026-06-24] [coder] → code-notes.md — MediaUploader: dos buckets, sin deduplicación
- [2026-06-25] [orquestador] → decisions.md — Módulo ListaInvitados: agregar a projects, ruta inteligente, JWT efímero
- [2026-06-25] [coder] → decisions.md — ListaInvitados implementado completo (7 fases) en rama ListaInvitados; npm run check ✅
