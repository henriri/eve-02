import { useState, useCallback } from 'react'
import Display  from './Display'
import Toggle   from './controls/Toggle'
import Knob     from './controls/Knob'
import Fader    from './controls/Fader'
import Button   from './controls/Button'

export default function Device() {
  const [activeDisplay, setActiveDisplay] = useState('DEFAULT')
  const [knobFreqValue, setKnobFreqValue] = useState(0.5)

  const handleActivate = useCallback((id: string) => {
    setActiveDisplay(id)
  }, [])

  const handleKnob = useCallback((id: string, value: number) => {
    if (id === 'FREQ') setKnobFreqValue(value)
    setActiveDisplay(id)
  }, [])

  const handleFader = useCallback((id: string, _value: number) => {
    setActiveDisplay(id)
  }, [])

  return (
    <div style={{
      width: '100%',
      maxWidth: 680,
      background: 'linear-gradient(160deg, #f0ece4 0%, #e0dcd4 100%)',
      borderRadius: 8,
      padding: '28px 32px 24px',
      boxShadow: `
        0 20px 60px rgba(0,0,0,0.25),
        0 4px 12px rgba(0,0,0,0.15),
        inset 0 1px 0 rgba(255,255,255,0.8),
        inset 0 -1px 0 rgba(0,0,0,0.1)
      `,
      position: 'relative',
    }}>

      {/* identity block */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: 'var(--sans)',
          fontWeight: 500,
          fontSize: 15,
          letterSpacing: '0.01em',
          color: 'var(--near-black)',
          marginBottom: 4,
        }}>
          EVG—GS·01
        </div>
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: 9,
          letterSpacing: '0.1em',
          color: 'var(--mid-grey)',
          lineHeight: 1.8,
        }}>
          Analog timing device / altitude-based<br />
          46°06'N 7°16'E — Juin 2026<br />
          Designed in Southtown
        </div>
      </div>

      {/* display recess */}
      <div style={{
        borderRadius: 6,
        padding: 4,
        background: 'linear-gradient(180deg,#888480 0%,#b8b4ac 100%)',
        boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.3)',
        marginBottom: 24,
      }}>
        <Display activeDisplay={activeDisplay} knobValue={knobFreqValue} />
      </div>

      {/* controls row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 0,
        justifyContent: 'space-between',
        padding: '0 4px',
      }}>

        {/* toggles group */}
        <div style={{ display:'flex', gap:16, alignItems:'flex-end' }}>
          <Toggle label="INIT" id="INIT" onActivate={handleActivate} />
          <Toggle label="ALT"  id="ALT"  onActivate={handleActivate} />
        </div>

        {/* separator */}
        <div style={{ width:1, height:60, background:'var(--warm-grey)', opacity:0.5 }} />

        {/* knobs group */}
        <div style={{ display:'flex', gap:20, alignItems:'flex-end' }}>
          <Knob label="FREQ" id="FREQ" onActivate={handleKnob} />
          <Knob label="GAIN" id="GAIN" onActivate={handleKnob} />
        </div>

        {/* separator */}
        <div style={{ width:1, height:60, background:'var(--warm-grey)', opacity:0.5 }} />

        {/* fader */}
        <Fader label="EXP" id="EXP" onActivate={handleFader} />

        {/* separator */}
        <div style={{ width:1, height:60, background:'var(--warm-grey)', opacity:0.5 }} />

        {/* buttons group */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'center' }}>
          <Button label="ORBIT" id="ORBIT" onActivate={handleActivate} />
          <Button
            label="FLIGHT PLAN"
            id="FLIGHT_PLAN"
            onActivate={handleActivate}
            orange
            wide
          />
        </div>

      </div>

      {/* bottom screws decoration */}
      {[{ left:12, bottom:10 }, { right:12, bottom:10 }].map((pos, i) => (
        <div key={i} style={{
          position:'absolute',
          width:8, height:8,
          borderRadius:'50%',
          background:'radial-gradient(circle at 35% 35%,#c8c4bc,#888480)',
          boxShadow:'0 1px 2px rgba(0,0,0,0.3)',
          ...pos,
        }} />
      ))}
    </div>
  )
}
