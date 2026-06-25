import {
  Document, Page, View, Text, Image, StyleSheet,
} from '@react-pdf/renderer'
import type { Invitado } from '@/types/invitation'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: '#F7F5F2', padding: 32 },
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,.06)' },
  header: { backgroundColor: '#7C5C4A', padding: '18 24' },
  headerLabel: { fontSize: 8, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  headerEvent: { fontSize: 14, color: '#C4956A' },
  divider: { borderTop: '1.5 dashed #E7E5E3', marginHorizontal: 0 },
  body: { padding: '16 24' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  labelText: { fontSize: 9, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  valueText: { fontSize: 14, fontWeight: 'bold', color: '#1C1917' },
  seatsValue: { fontSize: 28, fontWeight: 'bold', color: '#7C5C4A' },
  qrSection: { alignItems: 'center', marginTop: 12 },
  qrCaption: { fontSize: 9, color: '#A8A29E', marginTop: 6, textAlign: 'center' },
})

interface Props {
  invitados: Invitado[]
  festejada: string
  eventDate: string
  venue: string
  qrDataUrls: Record<string, string>
}

export function BoletoPDF({ invitados, festejada, eventDate, venue, qrDataUrls }: Props) {
  const date = new Date(eventDate).toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <Document>
      {invitados.map(inv => (
        <Page key={inv.id} size={[300, 420]} style={styles.page}>
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerLabel}>Boleto de entrada</Text>
              <Text style={styles.headerTitle}>XV Años</Text>
              <Text style={styles.headerEvent}>{festejada}</Text>
            </View>

            {/* Divisor */}
            <View style={styles.divider} />

            {/* Body */}
            <View style={styles.body}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.labelText}>Invitado</Text>
                  <Text style={[styles.valueText, { maxWidth: 140 }]}>{inv.titular}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.labelText}>Asientos</Text>
                  <Text style={styles.seatsValue}>{inv.num_invitados}</Text>
                </View>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={styles.labelText}>Fecha</Text>
                <Text style={[styles.valueText, { fontSize: 11, textTransform: 'capitalize' }]}>{date}</Text>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={styles.labelText}>Lugar</Text>
                <Text style={[styles.valueText, { fontSize: 11 }]}>{venue}</Text>
              </View>

              {/* QR */}
              {qrDataUrls[inv.id] && (
                <View style={styles.qrSection}>
                  <Image src={qrDataUrls[inv.id]} style={{ width: 90, height: 90 }} />
                  <Text style={styles.qrCaption}>Escanea para ubicación</Text>
                </View>
              )}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  )
}
