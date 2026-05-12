import { motion } from 'framer-motion'
import { pdf }    from '@react-pdf/renderer'
import { PrinterIcon, DownloadSimpleIcon } from '@phosphor-icons/react'
import { PROGRAM } from '../data/program'
import ProgramPDF  from '../pdf/ProgramPDF'

interface Props {
  isOpen: boolean
  displayColor: string
  activeToggle: string | null
}

export default function Receipt({ isOpen, displayColor, activeToggle }: Props) {

  async function handleSave() {
    const blob = await pdf(<ProgramPDF />).toBlob()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'plan-de-vol-EVG-GS01.pdf'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handlePrint() {
    window.print()
  }

  const bgColor = displayColor === '#F2F0E8' ? '#1A1816'
    : displayColor === '#E8A020' ? '#1A0E00'
    : '#0A1200'

  return (
    <motion.div
      initial={{ y: '-100%', opacity: 0 }}
      animate={isOpen
        ? { y: 0, opacity: 1 }
        : { y: '-100%', opacity: 0 }
      }
      transition={isOpen
        ? { type: 'spring', stiffness: 38, damping: 14, mass: 1.2 }
        : { duration: 0.3, ease: 'easeIn' }
      }
      style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 64px)',
        background: '#F5F2EB',
        borderRadius: '0 0 8px 8px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        zIndex: 10,
      }}
    >
      {/* receipt header */}
      <div style={{
        padding: '16px 20px 12px',
        borderBottom: '1px solid #E0DCD4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: 'var(--sans)',
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--dark)',
          letterSpacing: '-0.01em',
        }}>Plan de vol</span>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <button onClick={handlePrint} style={{ color:'var(--mid)', lineHeight:0 }}>
            <PrinterIcon size={18} weight="light" />
          </button>
          <button onClick={handleSave} style={{ color:'var(--mid)', lineHeight:0 }}>
            <DownloadSimpleIcon size={18} weight="light" />
          </button>
        </div>
      </div>

      {/* program content */}
      <div style={{ padding:'12px 20px' }}>
        {PROGRAM.map((day, di) => (
          <div key={day.label} style={{ marginBottom: di < PROGRAM.length-1 ? 14 : 0 }}>
            <div style={{
              fontFamily:'var(--mono)', fontSize:7,
              letterSpacing:'0.14em', textTransform:'uppercase',
              color:'var(--light)', marginBottom:6,
              borderBottom:'0.5px solid #E0DCD4', paddingBottom:4,
            }}>{day.label}</div>
            {day.events.map(ev => (
              <div key={ev.time} style={{
                display:'grid', gridTemplateColumns:'48px 1fr',
                gap:'0 16px', marginBottom:3,
              }}>
                <span style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--light)' }}>
                  {ev.time}
                </span>
                <span style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--dark)' }}>
                  {ev.title}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* display snapshot footer */}
      <div style={{
        height: 64,
        background: bgColor,
        margin: '8px 20px 20px',
        borderRadius: 4,
        display:'flex', alignItems:'center', justifyContent:'center',
        overflow:'hidden',
      }}>
        <span style={{
          fontFamily:'var(--mono)', fontSize:8,
          color: displayColor,
          opacity: 0.4,
          letterSpacing:'0.2em',
        }}>
          {activeToggle ?? 'EVG—GS·01'}
        </span>
      </div>
    </motion.div>
  )
}
