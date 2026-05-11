export interface ProgramEvent { time: string; title: string }
export interface ProgramDay   { label: string; events: ProgramEvent[] }

export const PROGRAM: ProgramDay[] = [
  {
    label: 'Vendredi',
    events: [
      { time: '18:00', title: 'Orbite de stationnement' },
      { time: '21:00', title: '[placeholder]' },
      { time: '00:00', title: '[placeholder]' },
    ],
  },
  {
    label: 'Samedi',
    events: [
      { time: '11:00', title: '[placeholder]' },
      { time: '16:00', title: 'Apogée' },
      { time: '22:00', title: '[placeholder]' },
    ],
  },
  {
    label: 'Dimanche',
    events: [
      { time: '10:00', title: '[placeholder]' },
      { time: '16:00', title: '[placeholder]' },
      { time: '20:00', title: 'Rentrée atmosphérique' },
    ],
  },
  {
    label: 'Lundi',
    events: [
      { time: '09:00', title: 'Nominal.' },
      { time: '12:00', title: '[placeholder]' },
      { time: '14:00', title: 'We have AOS.' },
    ],
  },
]

export function buildMarquee(): string {
  return PROGRAM.flatMap(day =>
    [`— ${day.label.toUpperCase()} —`, ...day.events.map(e => `${e.time}  ${e.title}`)]
  ).join('    ')
}
