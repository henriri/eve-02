import { useEffect, useRef } from 'react'

interface Props { color: string; speed: number; width: number; height: number }

interface Particle {
  angle: number
  radius: number
  speed: number
  size: number
  opacity: number
  arm: number
}

export default function BlackHoleCanvas({ color, speed, width, height }: Props) {
  const ref  = useRef<HTMLCanvasElement>(null)
  const raf  = useRef(0)
  const pts  = useRef<Particle[]>([])
  const t    = useRef(0)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const cx = width / 2, cy = height / 2
    const COUNT = 320

    // init particles in spiral arms
    pts.current = Array.from({ length: COUNT }, (_, i) => {
      const arm    = i % 3
      const spread = Math.random() * Math.PI * 0.5
      const r      = 20 + Math.random() * Math.min(cx, cy) * 0.92
      return {
        angle:   arm * ((Math.PI * 2) / 3) + spread + (r * 0.018),
        radius:  r,
        speed:   (0.004 + Math.random() * 0.006) * (1 / (r * 0.012)),
        size:    0.6 + Math.random() * 2.2,
        opacity: 0.3 + Math.random() * 0.7,
        arm,
      }
    })

    function frame() {
      t.current += 0.016 * speed
      ctx.fillStyle = 'rgba(8,8,6,0.18)'
      ctx.fillRect(0, 0, width, height)

      for (const p of pts.current) {
        // orbital mechanics — faster closer to centre
        p.angle  += p.speed * speed * (1 + 8 / p.radius)
        p.radius -= 0.04 * speed

        // respawn when too close
        if (p.radius < 6) {
          p.radius = 30 + Math.random() * Math.min(cx, cy) * 0.9
          p.angle  = p.arm * ((Math.PI * 2) / 3) + Math.random() * Math.PI * 0.5 + p.radius * 0.018
          p.size   = 0.6 + Math.random() * 2.2
          p.opacity = 0.3 + Math.random() * 0.7
        }

        const x = cx + Math.cos(p.angle) * p.radius
        const y = cy + Math.sin(p.angle) * p.radius * 0.45  // flatten to ellipse

        const distFade = Math.min(1, p.radius / (Math.min(cx, cy) * 0.7))

        ctx.beginPath()
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = p.opacity * distFade
        ctx.fill()
      }

      // black hole core
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22)
      grad.addColorStop(0,   'rgba(8,8,6,1)')
      grad.addColorStop(0.6, 'rgba(8,8,6,0.9)')
      grad.addColorStop(1,   'rgba(8,8,6,0)')
      ctx.globalAlpha = 1
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(cx, cy, 22, 0, Math.PI * 2)
      ctx.fill()

      raf.current = requestAnimationFrame(frame)
    }
    frame()
    return () => cancelAnimationFrame(raf.current)
  }, [color, speed, width, height])

  return <canvas ref={ref} width={width} height={height} style={{ display:'block' }} />
}
