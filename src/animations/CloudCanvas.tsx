import { useEffect, useRef } from 'react'
import { createNoise3D } from 'simplex-noise'

interface Props { color: string; speed: number; width: number; height: number }

const noise3D = createNoise3D()

export default function CloudCanvas({ color, speed, width, height }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const raf = useRef(0)
  const t   = useRef(0)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = width, H = height
    const scale = 0.006
    const dotSize = 3.5
    const spacing = 5

    function frame() {
      t.current += 0.003 * speed
      ctx.fillStyle = '#080806'
      ctx.fillRect(0, 0, W, H)

      for (let x = 0; x < W; x += spacing) {
        for (let y = 0; y < H; y += spacing) {
          const n = (noise3D(x * scale, y * scale * 0.7, t.current) + 1) / 2
          // dither threshold
          const bayer = ((x/spacing % 4) * 4 + (y/spacing % 4)) / 16
          if (n > bayer * 0.85) {
            const r = dotSize * n
            ctx.beginPath()
            ctx.arc(x, y, r * 0.9, 0, Math.PI * 2)
            ctx.fillStyle = color
            ctx.globalAlpha = 0.5 + n * 0.5
            ctx.fill()
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
