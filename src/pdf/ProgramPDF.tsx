import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { PROGRAM } from '../data/program'

Font.register({
  family: 'GeistMono',
  src: '/fonts/GeistMono-Regular.woff2',
})

const s = StyleSheet.create({
  page: {
    fontFamily: 'GeistMono',
    backgroundColor: '#F2EFE8',
    padding: '32pt 40pt',
    fontSize: 9,
    color: '#1A1816',
  },
  header: {
    marginBottom: 24,
    borderBottom: '1pt solid #C8C4BC',
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  meta: {
    fontSize: 8,
    color: '#6A6660',
    letterSpacing: 0.3,
    lineHeight: 1.6,
  },
  dayBlock: { marginBottom: 16 },
  dayLabel: {
    fontSize: 7,
    letterSpacing: 1.2,
    color: '#6A6660',
    textTransform: 'uppercase',
    marginBottom: 6,
    borderBottom: '0.5pt solid #C8C4BC',
    paddingBottom: 4,
  },
  eventRow: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 16,
  },
  eventTime: {
    width: 36,
    color: '#6A6660',
    fontSize: 8,
  },
  eventTitle: {
    flex: 1,
    fontSize: 9,
  },
  footer: {
    marginTop: 'auto',
    borderTop: '0.5pt solid #C8C4BC',
    paddingTop: 12,
    fontSize: 7,
    color: '#A8A49C',
    letterSpacing: 0.3,
  },
})

export default function ProgramPDF() {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.title}>Plan de vol — EVG—GS·01</Text>
          <Text style={s.meta}>46°06'N 7°16'E — Juin 2026</Text>
          <Text style={s.meta}>Analog timing device / Altitude based</Text>
        </View>
        {PROGRAM.map(day => (
          <View key={day.label} style={s.dayBlock}>
            <Text style={s.dayLabel}>{day.label}</Text>
            {day.events.map(ev => (
              <View key={ev.time} style={s.eventRow}>
                <Text style={s.eventTime}>{ev.time}</Text>
                <Text style={s.eventTitle}>{ev.title}</Text>
              </View>
            ))}
          </View>
        ))}
        <View style={s.footer}>
          <Text>Designed in Southtown — mmxxvi — Zone d'ombre. Communications suspendues.</Text>
        </View>
      </Page>
    </Document>
  )
}
