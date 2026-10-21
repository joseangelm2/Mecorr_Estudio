// Fuentes disponibles para los títulos de Esmeralda Especial. Todas ya se cargan como
// variables CSS en src/app/i/[slug]/layout.tsx, así que elegir una no descarga nada nuevo.
export interface TituloFuente {
  id: string
  label: string
  css: string
}

export const TITULO_FUENTES: TituloFuente[] = [
  { id: 'carattere',   label: 'Carattere (original) — cursiva',         css: 'var(--font-carattere), "Carattere", cursive' },
  { id: 'beau',        label: 'Beau Rivage — cursiva elegante',         css: 'var(--font-beau), "Beau Rivage", cursive' },
  { id: 'meaculpa',    label: 'Mea Culpa — cursiva manuscrita',         css: 'var(--font-meaculpa), "Mea Culpa", cursive' },
  { id: 'dancing',     label: 'Dancing Script — cursiva redondeada',    css: 'var(--font-dancing), "Dancing Script", cursive' },
  { id: 'tangerine',   label: 'Tangerine — cursiva fina',               css: 'var(--font-tangerine), "Tangerine", cursive' },
  { id: 'cormorant',   label: 'Cormorant Garamond — serif clásica',     css: 'var(--font-cormorant), "Cormorant Garamond", serif' },
  { id: 'bellefair',   label: 'Bellefair — serif elegante',             css: 'var(--font-bellefair), "Bellefair", serif' },
  { id: 'oldstandard', label: 'Old Standard TT — serif tradicional',    css: 'var(--font-old-standard), "Old Standard TT", serif' },
  { id: 'raleway',     label: 'Raleway — sans moderna',                 css: 'var(--font-raleway), "Raleway", sans-serif' },
  { id: 'albert',      label: 'Albert Sans — sans limpia',              css: 'var(--font-albert), "Albert Sans", sans-serif' },
  { id: 'dmsans',      label: 'DM Sans — sans geométrica',              css: 'var(--font-dm-sans), "DM Sans", sans-serif' },
  { id: 'playfair',    label: 'Playfair Display — serif elegante',      css: 'var(--font-playfair), "Playfair Display", serif' },
  { id: 'librebodoni', label: 'Libre Bodoni — serif clásica',           css: 'var(--font-libre-bodoni), "Libre Bodoni", serif' },
]
