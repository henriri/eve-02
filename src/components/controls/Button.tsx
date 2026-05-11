interface Props {
  label: string
  id: string
  onActivate: (id: string) => void
  orange?: boolean
  wide?: boolean
}

export default function Button({ label, id, onActivate, orange = false, wide = false }: Props) {
  function handleDown() { onActivate(id) }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <div
        style={{
          width: wide ? 110 : 52,
          height: 28,
          borderRadius: 4,
          background: orange
            ? 'linear-gradient(180deg,#e05520 0%,#a83208 100%)'
            : 'linear-gradient(180deg,#c8c4bc 0%,#a0a09a 100%)',
          boxShadow: orange
            ? '0 3px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,180,100,0.4)'
            : '0 3px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.45)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          transition: 'transform 0.06s, box-shadow 0.06s',
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = ''
          el.style.boxShadow = orange
            ? '0 3px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,180,100,0.4)'
            : '0 3px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.45)'
        }}
        onMouseDown={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(1px)'
          el.style.boxShadow = orange
            ? '0 1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,180,100,0.2)'
            : '0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
          onActivate(id)
        }}
        onMouseUp={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = ''
        }}
      >
        <span style={{
          fontSize: orange ? 9 : 8,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: orange ? 'rgba(255,240,220,0.95)' : 'var(--dark-grey)',
          fontFamily: 'var(--mono)',
          fontWeight: orange ? 700 : 400,
          pointerEvents: 'none',
        }}>{label}</span>
      </div>
    </div>
  )
}
