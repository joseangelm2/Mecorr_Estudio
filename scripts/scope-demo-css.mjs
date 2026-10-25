// Aísla el CSS de cada demo/plantilla para que no afecte a las demás cuando Next acumula
// hojas al navegar entre demos. Idempotente: si el archivo ya trae el marcador, lo omite.
//
// Uso: node scripts/scope-demo-css.mjs <archivo.css> <clase-scope>
//   ej. node scripts/scope-demo-css.mjs src/app/love/love.css t-love
//
// Reglas:
//  - html / body / :root / #body / .bg-invitacion (elementos que envuelven a la demo):
//    se les añade :has(.<scope>) → solo aplican si esa demo está en pantalla.
//  - cualquier otro selector se prefija con ".<scope> ".
//  - @keyframes se renombran a <nombre>-<scope> y se actualizan los `animation`.
//  - @font-face y @import no se tocan.
import { readFileSync, writeFileSync } from 'node:fs'
import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'

const [file, scope] = process.argv.slice(2)
if (!file || !scope) {
  console.error('Uso: node scripts/scope-demo-css.mjs <archivo.css> <clase-scope>')
  process.exit(1)
}

const MARK = `/* scoped:${scope} */`
const src = readFileSync(file, 'utf8')
if (src.includes('/* scoped:')) {
  console.log(`omitido (ya aislado): ${file}`)
  process.exit(0)
}

const isGlobalAnchor = (node) =>
  (node.type === 'tag' && (node.value === 'html' || node.value === 'body')) ||
  (node.type === 'pseudo' && node.value === ':root') ||
  (node.type === 'id' && node.value === 'body') ||
  (node.type === 'class' && node.value === 'bg-invitacion')

function scopeSelector(selector) {
  return selectorParser((root) => {
    root.each((sel) => {
      const first = sel.nodes[0]
      if (first && isGlobalAnchor(first)) {
        // Inserta :has() tras el último nodo del primer compuesto que no sea pseudo-elemento.
        let idx = 0
        while (
          idx < sel.nodes.length &&
          sel.nodes[idx].type !== 'combinator' &&
          !(sel.nodes[idx].type === 'pseudo' && sel.nodes[idx].value.startsWith('::'))
        ) idx++
        const has = selectorParser.pseudo({ value: ':has', nodes: [selectorParser.selector({ nodes: [selectorParser.className({ value: scope })] })] })
        sel.insertAfter(sel.nodes[idx - 1], has)
      } else {
        sel.prepend(selectorParser.combinator({ value: ' ' }))
        sel.prepend(selectorParser.className({ value: scope }))
      }
    })
  }).processSync(selector)
}

const css = postcss.parse(src)
const renames = new Map()
css.walkAtRules(/keyframes$/, (at) => {
  if (!renames.has(at.params)) renames.set(at.params, `${at.params}-${scope}`)
  at.params = renames.get(at.params)
})
css.walkDecls(/^(-webkit-)?animation(-name)?$/, (d) => {
  for (const [from, to] of renames) {
    d.value = d.value.replace(new RegExp(`(?<![\\w-])${from}(?![\\w-])`, 'g'), to)
  }
})
css.walkRules((rule) => {
  const parent = rule.parent
  if (parent?.type === 'atrule' && /keyframes$/.test(parent.name)) return
  if (parent?.type === 'atrule' && parent.name === 'font-face') return
  rule.selector = scopeSelector(rule.selector)
})
writeFileSync(file, `${MARK}\n${css.toString()}`)
console.log(`aislado: ${file} → .${scope} (${renames.size} keyframes)`)
