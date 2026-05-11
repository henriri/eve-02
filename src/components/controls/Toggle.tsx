import { useState } from 'react'

interface Props {
  label: string
  id: string
  onActivate: (id: string) => void
}

export default function Toggle({ label, id, onActivate }: Props) {
  const [on, setOn] = useState(false)

  function handle() {
    const next = !on
    setOn(next)
    if (next) onActivate(id)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <div
        onClick={handle}
        style={{
          width: 28,
          height: 52,
          borderRadius: 4,
          background: on
            ? 'linear-gradient(180deg,#3a3835 0%,#2a2825 100%)'
            : 'linear-gradient(180deg,#c8c4bc 0%,#a8a49c 100%)',
          boxShadow: on
            ? 'inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1)'
            : '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.12s ease',
        }}
      >
        <div style={{
          position: 'absolute',
          left: '50%',
          top: on ? '60%' : '20%',
          transform: 'translate(-50%, -50%)',
          width: 20,
          height: 20,
          borderRadius: 3,
          background: on
            ? 'linear-gradient(180deg,#4a4845 0%,#2a2825 100%)'
            : 'linear-gradient(180deg,#f0ece4 0%,#d0ccc4 100%)',
          boxShadow: on
            ? 'inset 0 1px 3px rgba(0,0,0,0.5)'
            : '0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.6)',
          transition: 'top 0.12s ease, background 0.12s ease',
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
