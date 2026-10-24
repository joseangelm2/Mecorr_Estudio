// Descarga los assets del demo2 de Esmeralda Especial a public/images/emspecial/.
// Uso: node scripts/download-demo2-assets.mjs
import { mkdir, writeFile } from 'node:fs/promises'
import { extname } from 'node:path'

const BASE = 'https://avnihxwxurhchgdkqmyn.supabase.co/storage/v1/object/public/invitation-media/543385c9-85cd-425f-a3de-ad7ab748086b/'
const OUT = 'public/images/emspecial'

// Diseño (decorativos, íconos, sobre, fondo, título). Las fotos de la festejada NO se incluyen.
// [nombre destino, archivo en el storage]
const ASSETS = [
  ['aro', '1792272188232.png'],
  ['banda', '1792271946369.png'],
  ['reloj', '1792272202784.png'],
  ['numero', '1792271951348.png'],
  ['regalo', '1792271902922.png'],
  ['aro-gif', '1792272193609.gif'],
  ['estrella', '1792271898015.png'],
  ['separador', '1792272528222.png'],
  ['background', '1792433832681.jpg'],
  ['decorativo1', '1792271909818.png'],
  ['decorativo2', '1792271915261.png'],
  ['decorativo3', '1792271921430.png'],
  ['decorativo4', '1792271924804.png'],
  ['decorativo5', '1792271929792.png'],
  ['mis-xv-image', '1792638665124.png'],
  ['icono-buzon', '1792272004155.png'],
  ['icono-tienda', '1792272015155.png'],
  ['envelope-right', '1792271892866.jpeg'],
  ['icono-instagram', '1792272009711.png'],
  ['icono-vestimenta', '1792272610572.png'],
  ['icono-mesa-regalos', '1792271999230.png'],
  ['icono-datos-bancarios', '1792556952131.png'],
  ['itin-1', '1792272468640.png'],
  ['itin-2', '1792272473377.png'],
  ['itin-3', '1792272480227.png'],
  ['itin-4', '1792272485002.png'],
  ['itin-5', '1792272489678.png'],
  ['itin-6', '1792272494519.png'],
  ['gift-sears', '1792450720061.png'],
]

await mkdir(OUT, { recursive: true })
for (const [name, file] of ASSETS) {
  const res = await fetch(BASE + file)
  if (!res.ok) { console.error('FALLO', res.status, file); continue }
  const dest = `${OUT}/${name}${extname(file)}`
  await writeFile(dest, Buffer.from(await res.arrayBuffer()))
  console.log('ok', dest)
}
