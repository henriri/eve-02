import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Display  from './Display'
import Receipt  from './Receipt'
import Toggle   from './controls/Toggle'
import Knob     from './controls/Knob'
import { soundToggle, soundPrint } from '../sounds/useSounds'

const TOGGLES = [
  { id: 'INIT',  label: 'init'  },
  { id: 'ALT',   label: 'alt'   },
  { id: 'TOPO',  label: 'topo'  },
  { id: 'VOID',  label: 'void'  },
  { id: 'PRINT', label: 'print' },
]

const COLOR_STOPS: Record<number, string> = {
  0: '#F2F0E8',
  1: '#E8A020',
  2: '#CCFF00',
}

export default function Device() {
  const [activeToggle, setActiveToggle]   = useState<string | null>(null)
  const [receiptOpen,  setReceiptOpen]    = useState(false)
  const [colorStop,    setColorStop]      = useState(0)
  const [speed,        setSpeed]          = useState(1)

  const handleToggle = useCallback((id: string) => {
    soundToggle()
    if (id === 'PRINT') {
      soundPrint()
      setReceiptOpen(prev => !prev)
      return
    }
    setActiveToggle(prev => prev === id ? null : id)
    setReceiptOpen(false)
  }, [])

  const handleColorKnob = useCallback((_id: string, value: number) => {
    const stop = Math.round(value * 2) as 0 | 1 | 2
    setColorStop(stop)
  }, [])

  const handleSpeedKnob = useCallback((_id: string, value: number) => {
    setSpeed(0.25 + value * 3.75)
  }, [])

  const displayColor = COLOR_STOPS[colorStop]

  return (
    <div style={{
      width: '100%',
      maxWidth: 680,
      position: 'relative',
    }}>
      {/* ── outer unit shell ── */}
      <div style={{
        background: 'linear-gradient(160deg,#F0EDE6 0%,#E4E0D8 100%)',
        borderRadius: 16,
        padding: 20,
        boxShadow: `
          var(--shadow-unit),
          inset 0 1px 0 rgba(255,255,255,0.85),
          inset 0 -1px 0 rgba(0,0,0,0.06)
        `,
      }}>

        {/* ── inner recessed panel ── */}
        <div style={{
          background: 'linear-gradient(180deg,#EDEAE3 0%,#E8E4DC 100%)',
          borderRadius: 10,
          padding: '20px 20px 24px',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(0,0,0,0.06)',
        }}>

          {/* main display */}
          <div style={{ marginBottom: 24 }}>
            <Display
              activeToggle={activeToggle}
              displayColor={displayColor}
              speed={speed}
            />
          </div>

          {/* controls row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 20,
            alignItems: 'start',
          }}>

            {/* left: toggles tray */}
            <div style={{
              background: 'linear-gradient(180deg,#EDEAE3 0%,#E4E0D8 100%)',
              borderRadius: 8,
              padding: '14px 16px 10px',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.7)',
            }}>
              <div style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'space-between',
              }}>
                {TOGGLES.map(t => (
                  <Toggle
                    key={t.id}
                    id={t.id}
                    label={t.label}
                    isOn={activeToggle === t.id || (t.id === 'PRINT' && receiptOpen)}
                    onActivate={handleToggle}
                  />
                ))}
              </div>
            </div>

            {/* right: knobs */}
            <div style={{
              display: 'flex',
              gap: 24,
              alignItems: 'center',
              padding: '8px 4px',
            }}>
              <Knob
                id="COLOR"
                label="freq."
                stops={3}
                onChange={handleColorKnob}
              />
              <Knob
                id="SPEED"
                label="gain"
                onChange={handleSpeedKnob}
              />
            </div>

          </div>

          {/* identity + secondary display row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 20,
            marginTop: 24,
            alignItems: 'end',
          }}>

            {/* identity */}
            <div>
              <div style={{
                fontFamily: 'var(--sans)',
                fontWeight: 700,
                fontSize: 22,
                letterSpacing: '-0.02em',
                color: 'var(--dark)',
                marginBottom: 8,
              }}>EVG — GS·01</div>
              <div style={{
                fontFamily: 'var(--sans)',
                fontSize: 11,
                color: 'var(--mid)',
                lineHeight: 1.7,
              }}>
                46°06 'N 7°16 'E — Juin 2026<br />
                Analog timing device / Altitude based<br />
                Field tested. Trusted by no one.<br />
                Designed in Southtown<br />
                <span style={{ fontStyle:'italic', color:'var(--light)' }}>mmxxvi</span>
              </div>
            </div>

            {/* secondary display (receipt slot) */}
            <div style={{
              width: 200,
              height: 52,
              borderRadius: 4,
              background: '#0A0806',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(0,0,0,0.4)',
              overflow: 'hidden',
              position: 'relative',
              flexShrink: 0,
            }}>
              {receiptOpen && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  style={{
                    position:'absolute', inset:0,
                    background: `repeating-linear-gradient(90deg,
                      ${displayColor}08 0px, ${displayColor}08 2px,
                      transparent 2px, transparent 6px)`,
                  }}
                />
              )}
            </div>

          </div>
        </div>
      </div>

      {/* receipt — slides out below device */}
      <Receipt
        isOpen={receiptOpen}
        displayColor={displayColor}
        activeToggle={activeToggle}
      />
    </div>
  )
}
