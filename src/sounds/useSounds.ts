// Web Audio API sound synthesis — zero dependencies
// All sounds are procedurally generated

let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function playClick(freq = 800, duration = 0.018, gain = 0.3) {
  const c = getCtx()
  const osc = c.createOscillator()
  const g   = c.createGain()
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = freq
  filter.Q.value = 0.5
  osc.connect(filter)
  filter.connect(g)
  g.connect(c.destination)
  osc.type = 'square'
  osc.frequency.value = freq
  g.gain.setValueAtTime(gain, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
  osc.start(c.currentTime)
  osc.stop(c.currentTime + duration)
}

function playNoiseBurst(duration = 0.012, gain = 0.15) {
  const c    = getCtx()
  const buf  = c.createBuffer(1, c.sampleRate * duration, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1)
  const src    = c.createBufferSource()
  const filter = c.createBiquadFilter()
  const g      = c.createGain()
  filter.type = 'bandpass'
  filter.frequency.value = 3000
  filter.Q.value = 1.2
  src.buffer = buf
  src.connect(filter)
  filter.connect(g)
  g.connect(c.destination)
  g.gain.setValueAtTime(gain, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
  src.start()
}

export function soundToggle() {
  playNoiseBurst(0.014, 0.2)
  playClick(1200, 0.01, 0.08)
}

export function soundKnobTick(position: number) {
  // pitch shifts slightly with position
  const freq = 600 + position * 400
  playClick(freq, 0.016, 0.18)
  playNoiseBurst(0.008, 0.06)
}

export function soundKnobSnap() {
  playClick(900, 0.022, 0.28)
  playNoiseBurst(0.018, 0.12)
}

export function soundPrint() {
  const c   = getCtx()
  const dur = 2.8
  // motor hum
  const osc = c.createOscillator()
  const lfo = c.createOscillator()
  const lfoG = c.createGain()
  const g    = c.createGain()
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 800
  lfo.frequency.value = 9
  lfoG.gain.value = 0.4
  lfo.connect(lfoG)
  lfoG.connect(g.gain)
  osc.type = 'sawtooth'
  osc.frequency.value = 55
  osc.connect(filter)
  filter.connect(g)
  g.connect(c.destination)
  g.gain.setValueAtTime(0.22, c.currentTime)
  g.gain.setValueAtTime(0.22, c.currentTime + dur - 0.3)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
  lfo.start(c.currentTime)
  osc.start(c.currentTime)
  lfo.stop(c.currentTime + dur)
  osc.stop(c.currentTime + dur)
  // paper noise layer
  const bufLen = c.sampleRate * dur
  const buf    = c.createBuffer(1, bufLen, c.sampleRate)
  const data   = buf.getChannelData(0)
  for (let i = 0; i < bufLen; i++) {
    const t = i / c.sampleRate
    data[i]  = (Math.random() * 2 - 1) * 0.3 * Math.abs(Math.sin(t * 9 * Math.PI))
  }
  const nSrc    = c.createBufferSource()
  const nFilter = c.createBiquadFilter()
  const nGain   = c.createGain()
  nFilter.type = 'bandpass'
  nFilter.frequency.value = 4000
  nFilter.Q.value = 0.8
  nSrc.buffer = buf
  nSrc.connect(nFilter)
  nFilter.connect(nGain)
  nGain.connect(c.destination)
  nGain.gain.setValueAtTime(0.18, c.currentTime)
  nGain.gain.setValueAtTime(0.18, c.currentTime + dur - 0.3)
  nGain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
  nSrc.start()
}
