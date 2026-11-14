import React from 'react'
import { Document, Font, Image, Page, StyleSheet, Text, View, renderToBuffer } from '@react-pdf/renderer'
import { LOGO_DATA_URI, LOGO_HEIGHT, LOGO_WIDTH } from './logo-data'
import type { QASection } from './qa'

// Enlaces y textos largos sin espacios: se parten para que no se salgan de la página.
Font.registerHyphenationCallback(word => (word.length > 24 ? word.match(/.{1,24}/g) ?? [word] : [word]))

const SITE_URL = 'www.mecorr.com.mx'
const SITE_EMAIL = 'contacto@mecorr.com.mx'
const LOGO_H = 44

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, color: '#1c1917', paddingTop: 0, paddingBottom: 64, paddingHorizontal: 0 },
  // Membrete: banda oscura con el logo; se repite en cada página.
  letterhead: {
    backgroundColor: '#0d0d1a', paddingVertical: 16, paddingHorizontal: 40, marginBottom: 22,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3 solid #e11d48',
  },
  logo: { width: (LOGO_WIDTH / LOGO_HEIGHT) * LOGO_H, height: LOGO_H },
  lhRight: { alignItems: 'flex-end' },
  lhTagline: { fontSize: 9, color: '#f1f1f8', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 },
  lhLine: { fontSize: 8.5, color: '#a5a5c0', marginTop: 1 },
  body: { marginHorizontal: 40 },
  title: { fontSize: 20, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  name: { fontSize: 11, color: '#44403c', marginBottom: 10 },
  done: { backgroundColor: '#fff1f2', borderLeft: '3 solid #e11d48', paddingVertical: 8, paddingHorizontal: 10, marginBottom: 18 },
  doneLabel: { fontSize: 8, color: '#9f1239', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  doneValue: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#1c1917' },
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', backgroundColor: '#e11d48',
    paddingVertical: 5, paddingHorizontal: 8, borderRadius: 3, marginBottom: 6,
  },
  row: { marginBottom: 7, paddingHorizontal: 4 },
  q: { fontSize: 8.5, color: '#78716c', marginBottom: 2 },
  a: { fontSize: 10.5, lineHeight: 1.35 },
  empty: { fontSize: 10, color: '#a8a29e', fontFamily: 'Helvetica-Oblique' },
  footer: {
    position: 'absolute', bottom: 22, left: 40, right: 40, paddingTop: 7, borderTop: '0.75 solid #e7e5e4',
    flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, color: '#78716c',
  },
})

/**
 * Helvetica solo trae Latin-1: se pasan a ASCII los guiones/comillas tipográficos y se quita lo que no
 * existe en la fuente (emojis, símbolos) en vez de dibujar cuadros.
 */
const clean = (s: string) =>
  s
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/[^\u0009\u000A\u0020-\u007E\u00A0-\u00FF]/g, '')
    .trim()

export interface PdfInput {
  nombre: string
  sections: QASection[]
  /** Fecha y hora en que el cliente terminó y envió el formulario (ya formateada, hora del centro de México). */
  finalizadoEn: string
}

function Doc({ nombre, sections, finalizadoEn }: PdfInput) {
  return (
    <Document title={`Datos de la invitación - ${clean(nombre)}`} author="MeCorr Estudio">
      <Page size="A4" style={styles.page}>
        <View style={styles.letterhead} fixed>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no es <img> */}
          <Image src={LOGO_DATA_URI} style={styles.logo} />
          <View style={styles.lhRight}>
            <Text style={styles.lhTagline}>Soluciones Digitales</Text>
            <Text style={styles.lhLine}>{SITE_URL}</Text>
            <Text style={styles.lhLine}>{SITE_EMAIL}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>Datos de tu invitación</Text>
          <Text style={styles.name}>{clean(nombre)}</Text>
          <View style={styles.done}>
            <Text style={styles.doneLabel}>Formulario finalizado</Text>
            <Text style={styles.doneValue}>{clean(finalizadoEn)}</Text>
          </View>

          {sections.map(sec => (
            <View key={sec.id} style={styles.section}>
              <Text style={styles.sectionTitle} minPresenceAhead={60}>{clean(sec.title)}</Text>
              {sec.items.length === 0 ? (
                <View style={styles.row}><Text style={styles.empty}>Sin respuestas (se dejó en blanco).</Text></View>
              ) : (
                sec.items.map((it, i) => {
                  const a = clean(it.a)
                  return (
                    <View key={i} style={styles.row} wrap={false}>
                      <Text style={styles.q}>{clean(it.q)}</Text>
                      {a ? <Text style={styles.a}>{a}</Text> : <Text style={styles.empty}>Sin respuesta</Text>}
                    </View>
                  )
                })
              )}
            </View>
          ))}
        </View>

        <View style={styles.footer} fixed>
          <Text>MeCorr Estudio · {SITE_URL}</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}

export async function renderQAPdf(input: PdfInput): Promise<Buffer> {
  return renderToBuffer(<Doc {...input} />)
}
