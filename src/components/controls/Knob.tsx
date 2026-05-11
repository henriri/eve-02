import { useState, useRef, useEffect, useCallback } from 'react'

interface Props {
  label: string
  id: string
  onActivate: (id: string, value: number) => void
}

export default function Knob({ label, id, onActivate }: Props) {
  const [angle, setAngle] = useState(-135)  // -135 to +135 degrees
  const dragging = useRef(false)
  const lastY    = useRef(0)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    lastY.current    = e.clientY
    e.preventDefault()
  }, [])

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current) return
      const delta = lastY.current - e.clientY
      lastY.current = e.clientY
      setAngle(a => {
        const next = Math.max(-135, Math.min(135, a + delta * 2))
        const norm = (next + 135) / 270  // 0..1
        onActivate(id, norm)
        return next
      })
    }
    function onMouseUp() { dragging.current = false }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
    }
  }, [id, onActivate])

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <div
        onMouseDown={onMouseDown}
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #d8d4cc, #888480)',
          boxShadow: '0 3px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.4)',
          cursor: 'ns-resize',
          position: 'relative',
          userSelect: 'none',
        }}
      >
        {/* indicator dot */}
        <div style={{
          position: 'absolute',
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: 'var(--near-black)',
          top: '50%',
          left: '50%',
          transformOrigin: '50% 50%',
          transform: `rotate(${angle}deg) translateY(-15px) translate(-50%, -50%)`,
        }} />
      </div>
      <span style={{
        fontSize: 8,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--mid-grey)',
        fontFamily: 'var(--mono)',
      }}>{label}</span>
    </div>
  )
}
