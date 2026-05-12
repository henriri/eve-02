import { useEffect, useRef } from 'react'

interface Props { color: string; speed: number; width: number; height: number }

export default function MountainCanvas({ color, speed, width, height }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const raf = useRef(0)
  const t   = useRef(0)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const spacing = 5
    const dotMax  = 3.5

    // layers: [yBase, amplitude, frequency, speed multiplier, opacity]
    const layers = [
      [height * 0.75, 60, 0.012, 0.4, 0.9],
      [height * 0.65, 45, 0.018, 0.6, 0.7],
      [height * 0.55, 35, 0.025, 0.9, 0.5],
      [height * 0.45, 25, 0.034, 1.2, 0.35],
    ]

    function getHeight(layer: number[], x: number): number {
      const [base, amp, freq, spd] = layer
      return (base as number) -
        Math.sin(x * (freq as number) + t.current * (spd as number) * speed) * (amp as number) * 0.5 -
        Math.sin(x * (freq as number) * 1.7 + t.current * (spd as number) * speed * 0.6) * (amp as number) * 0.35 -
        Math.sin(x * (freq as number) * 0.5 + t.current * (spd as number) * speed * 0.3) * (amp as number) * 0.6
    }

    function frame() {
      t.current += 0.016 * speed
      ctx.fillStyle = '#080806'
      ctx.fillRect(0, 0, width, height)

      for (let x = 0; x < width; x += spacing) {
        for (let li = 0; li < layers.length; li++) {
          const layer = layers[li]
          const yTop  = getHeight(layer, x)
          for (let y = yTop; y < height; y += spacing) {
            const distFromTop = y - yTop
            const fade = Math.max(0, 1 - distFromTop / (height * 0.35))
            const bayer = ((x/spacing % 4) * 4 + (y/spacing % 4)) / 16
            if (fade > bayer * 0.9) {
              const r = dotMax * fade
              ctx.beginPath()
              ctx.arc(x, y, r, 0, Math.PI * 2)
              ctx.fillStyle = color
              ctx.globalAlpha = (layer[4] as number) * fade
              ctx.fill()
            }
          }
        }
      }
      ctx.globalAlpha = 1
      raf.current = requestAnimationFrame(frame)
    }
    frame()
    return () => cancelAnimationFrame(raf.current)
  }, [color, speed, width, height])

  return <canvas ref={ref} width={width} height={height} style={{ display:'block' }} />
}
