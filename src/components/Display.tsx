import { useRef, useEffect, useState } from 'react'
import CloudCanvas      from '../animations/CloudCanvas'
import MountainCanvas   from '../animations/MountainCanvas'
import TorusCanvas      from '../animations/TorusCanvas'
import BlackHoleCanvas  from '../animations/BlackHoleCanvas'

interface Props {
  activeToggle: string | null
  displayColor: string
  speed: number
}

export default function Display({ activeToggle, displayColor, speed }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 600, h: 180 })

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setSize({ w: Math.floor(width), h: Math.floor(height) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const props = { color: displayColor, speed, width: size.w, height: size.h }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: 200,
        borderRadius: 3,
        background: 'var(--display-bg)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(0,0,0,0.5)',
      }}
    >
      {/* scanlines */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)',
      }} />

      {/* content */}
      <div style={{ position:'absolute', inset:0, zIndex:1 }}>
        {activeToggle === 'INIT'  && <CloudCanvas     {...props} />}
        {activeToggle === 'ALT'   && <MountainCanvas  {...props} />}
        {activeToggle === 'TOPO'  && <TorusCanvas     {...props} />}
        {activeToggle === 'VOID'  && <BlackHoleCanvas {...props} />}
        {!activeToggle && (
          <div style={{
            width:'100%', height:'100%',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{
              fontFamily:'var(--mono)', fontSize:10,
              color:'rgba(242,240,232,0.12)', letterSpacing:'0.2em',
            }}>EVG—GS·01</span>
          </div>
        )}
      </div>
    </div>
  )
}
