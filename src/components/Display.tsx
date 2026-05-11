import { useRef } from 'react'
import { useAsciiLoop } from '../ascii/useAsciiLoop'
import { COUNTDOWN_FRAMES }  from '../ascii/countdown'
import { MOUNTAIN_FRAMES }   from '../ascii/mountain'
import { TORUS_FRAMES }      from '../ascii/torusAscii'
import { STARFIELD_FRAMES }  from '../ascii/starfield'
import { CREVASSE_FRAMES }   from '../ascii/crevasse'
import { ORBIT_FRAMES }      from '../ascii/orbit'
import { buildMarquee }      from '../data/program'

interface Props { activeDisplay: string; knobValue?: number }

const DEFAULT_FRAMES = [
`
  EVG—GS·01
  ─────────────────────────────
  SYSTÈME ACTIF
  46°06'N  7°16'E  —  1500M
  JUIN 2026

  . . . . . . . . . . . . . .
`,
`
  EVG—GS·01
  ─────────────────────────────
  SYSTÈME ACTIF
  46°06'N  7°16'E  —  1500M
  JUIN 2026

  · · · · · · · · · · · · · ·
`,
]

function getFrames(id: string): string[] {
  switch (id) {
    case 'INIT':    return COUNTDOWN_FRAMES
    case 'ALT':     return MOUNTAIN_FRAMES
    case 'FREQ':    return TORUS_FRAMES
    case 'GAIN':    return STARFIELD_FRAMES
    case 'EXP':     return CREVASSE_FRAMES
    case 'ORBIT':   return ORBIT_FRAMES
    default:        return DEFAULT_FRAMES
  }
}

export default function Display({ activeDisplay, knobValue }: Props) {
  const isMarquee = activeDisplay === 'FLIGHT_PLAN'
  const marqueeRef = useRef<HTMLDivElement>(null)

  const frames = getFrames(activeDisplay)
  // knob FREQ controls animation speed
  const bpm    = activeDisplay === 'FREQ'
    ? Math.max(2, Math.round((knobValue ?? 0.5) * 24))
    : 6

  const frame = useAsciiLoop(isMarquee ? [] : frames, bpm)
  const marqueeText = buildMarquee() + '    ' + buildMarquee()  // doubled for seamless loop

  return (
    <div style={{
      width: '100%',
      height: 180,
      borderRadius: 4,
      background: 'var(--crt-bg)',
      boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.06)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* scanlines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* phosphor glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, rgba(232,160,32,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {isMarquee ? (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          zIndex: 3,
        }}>
          <div
            ref={marqueeRef}
            style={{
              whiteSpace: 'nowrap',
              fontFamily: 'var(--mono)',
              fontSize: 13,
              color: 'var(--orange)',
              letterSpacing: '0.08em',
              animation: 'marquee 28s linear infinite',
              willChange: 'transform',
              padding: '0 20px',
            }}
          >
            {marqueeText}
          </div>
        </div>
      ) : (
        <pre style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          fontFamily: 'var(--mono)',
          fontSize: 12,
          lineHeight: 1.5,
          color: 'var(--phosphor)',
          padding: '12px 16px',
          whiteSpace: 'pre',
          overflow: 'hidden',
          filter: 'brightness(1.1) contrast(1.05)',
        }}>
          {frame}
        </pre>
      )}
    </div>
  )
}
