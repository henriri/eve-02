interface Props {
  label: string
  id: string
  isOn: boolean
  onActivate: (id: string) => void
}

export default function Toggle({ label, id, isOn, onActivate }: Props) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
      {/* indicator dot */}
      <div style={{
        width: 5, height: 5, borderRadius: '50%',
        background: isOn ? 'var(--orange)' : 'transparent',
        border: isOn ? 'none' : '1px solid var(--border)',
        transition: 'background 0.15s',
        marginBottom: 2,
      }} />
      {/* rocker body */}
      <div
        onClick={() => onActivate(id)}
        style={{
          width: 30,
          height: 58,
          borderRadius: 16,
          background: isOn
            ? 'linear-gradient(180deg,#DEDAD2 0%,#C8C4BC 100%)'
            : 'linear-gradient(180deg,#EDEAE3 0%,#D8D4CC 100%)',
          boxShadow: isOn
            ? 'inset 0 3px 6px rgba(0,0,0,0.2), inset 0 1px 0 rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.7)'
            : '0 2px 4px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.9), inset 0 1px 0 rgba(255,255,255,0.6)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.12s ease',
        }}
      >
        {/* thumb pill */}
        <div style={{
          position: 'absolute',
          left: 4, right: 4,
          height: 26,
          borderRadius: 12,
          top: isOn ? 'calc(100% - 30px)' : 4,
          background: isOn
            ? 'linear-gradient(180deg,#C8C4BC 0%,#B8B4AC 100%)'
            : 'linear-gradient(180deg,#F5F2EB 0%,#E8E4DC 100%)',
          boxShadow: isOn
            ? 'inset 0 1px 3px rgba(0,0,0,0.2)'
            : '0 1px 3px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.8)',
          transition: 'top 0.12s ease, background 0.12s ease',
        }} />
      </div>
      {/* label */}
      <span style={{
        fontFamily: 'var(--mono)',
        fontSize: 8,
        letterSpacing: '0.08em',
        color: 'var(--light)',
        textTransform: 'lowercase',
        marginTop: 2,
      }}>{label}</span>
    </div>
  )
}
