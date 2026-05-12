import { useState, useRef, useEffect, useCallback } from 'react'
import { soundKnobTick, soundKnobSnap } from '../../sounds/useSounds'

interface Props {
  label: string
  id: string
  stops?: number      // if set: snaps to N evenly spaced stops
  onChange: (id: string, value: number) => void
}

export default function Knob({ label, id, stops, onChange }: Props) {
  const [angle, setAngle] = useState(-135)
  const dragging  = useRef(false)
  const lastY     = useRef(0)
  const lastStop  = useRef(-1)

  const snapAngle = (raw: number): number => {
    if (!stops) return raw
    const step = 270 / (stops - 1)
    const snap = Math.round((raw + 135) / step) * step - 135
    return Math.max(-135, Math.min(135, snap))
  }

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    lastY.current    = e.clientY
    e.preventDefault()
  }, [])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragging.current = true
    lastY.current    = e.touches[0].clientY
  }, [])

  useEffect(() => {
    function move(clientY: number) {
      if (!dragging.current) return
      const delta = lastY.current - clientY
      lastY.current = clientY
      setAngle(prev => {
        const raw  = Math.max(-135, Math.min(135, prev + delta * 2.2))
        const next = stops ? snapAngle(raw) : raw
        const norm = (next + 135) / 270

        if (stops) {
          const stopIdx = Math.round(norm * (stops - 1))
          if (stopIdx !== lastStop.current) {
            lastStop.current = stopIdx
            soundKnobSnap()
            onChange(id, norm)
          }
        } else {
          soundKnobTick(norm)
          onChange(id, norm)
        }
        return next
      })
    }
    function onMouseMove(e: MouseEvent)  { move(e.clientY) }
    function onTouchMove(e: TouchEvent)  { move(e.touches[0].clientY) }
    function onUp() { dragging.current = false }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onUp)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend',  onUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend',  onUp)
    }
  }, [id, stops, onChange])

  // tick marks ring
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const a = -135 + i * 27
    const r = 34
    const rad = (a - 90) * Math.PI / 180
    const x1 = 40 + Math.cos(rad) * (r - 4)
    const y1 = 40 + Math.sin(rad) * (r - 4)
    const x2 = 40 + Math.cos(rad) * r
    const y2 = 40 + Math.sin(rad) * r
    return { x1, y1, x2, y2, active: a <= angle }
  })

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <svg width={80} height={80} style={{ overflow:'visible', cursor:'ns-resize' }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {/* tick marks */}
        {ticks.map((tk, i) => (
          <line key={i}
            x1={tk.x1} y1={tk.y1} x2={tk.x2} y2={tk.y2}
            stroke={tk.active ? 'var(--dark)' : 'var(--border)'}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        ))}
        {/* knob body */}
        <circle cx={40} cy={40} r={26}
          fill="url(#knobGrad)"
          filter="url(#knobShadow)"
        />
        {/* indicator line */}
        <line
          x1={40} y1={40}
          x2={40 + Math.cos((angle - 90) * Math.PI / 180) * 18}
          y2={40 + Math.sin((angle - 90) * Math.PI / 180) * 18}
          stroke="var(--orange)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <defs>
          <radialGradient id="knobGrad" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#3A3835" />
            <stop offset="100%" stopColor="#1A1816" />
          </radialGradient>
          <filter id="knobShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.35" />
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2" />
          </filter>
        </defs>
      </svg>
      <span style={{
        fontFamily: 'var(--mono)',
        fontSize: 8,
        letterSpacing: '0.08em',
        color: 'var(--light)',
        textTransform: 'lowercase',
      }}>{label}</span>
    </div>
  )
}
