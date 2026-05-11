import { useState, useRef, useEffect, useCallback } from 'react'

interface Props {
  label: string
  id: string
  onActivate: (id: string, value: number) => void
}

export default function Fader({ label, id, onActivate }: Props) {
  const [pos, setPos]  = useState(0.2)  // 0=top 1=bottom
  const trackRef       = useRef<HTMLDivElement>(null)
  const dragging       = useRef(false)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    e.preventDefault()
  }, [])

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current || !trackRef.current) return
      const rect   = trackRef.current.getBoundingClientRect()
      const raw    = (e.clientY - rect.top) / rect.height
      const clamped = Math.max(0, Math.min(1, raw))
      setPos(clamped)
      onActivate(id, clamped)
    }
    function onMouseUp() { dragging.current = false }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
    }
  }, [id, onActivate])

  const TRACK_H = 80
  const THUMB_H = 16

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <div
        ref={trackRef}
        style={{
          width: 12,
          height: TRACK_H,
          borderRadius: 6,
          background: 'linear-gradient(180deg,#b8b4ac 0%,#888480 100%)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.35), inset 0 -1px 0 rgba(255,255,255,0.2)',
          position: 'relative',
          cursor: 'ns-resize',
        }}
        onMouseDown={onMouseDown}
      >
        <div style={{
          position: 'absolute',
          left: '50%',
          top: `calc(${pos * (TRACK_H - THUMB_H)}px)`,
          transform: 'translateX(-50%)',
          width: 22,
          height: THUMB_H,
          borderRadius: 3,
          background: 'linear-gradient(180deg,#f0ece4 0%,#c8c4bc 100%)',
          boxShadow: '0 2px 5px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.6)',
          cursor: 'ns-resize',
        }}>
          {/* grip lines */}
          {[0,1,2].map(i => (
            <div key={i} style={{
              position:'absolute', left:3, right:3,
              top: 4 + i*4, height:1,
              background:'rgba(0,0,0,0.2)',
            }} />
          ))}
        </div>
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
