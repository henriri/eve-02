import { useEffect, useRef } from 'react'

interface Props { color: string; speed: number; width: number; height: number }

// Classic donut.c technique — 3D torus projected to 2D character grid
export default function TorusCanvas({ color, speed, width, height }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const raf = useRef(0)
  const A   = useRef(1)
  const B   = useRef(0)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const COLS = Math.floor(width  / 7)
    const ROWS = Math.floor(height / 12)
    const chars = '.,-~:;=!*#$@'

    ctx.font = '11px GeistMono, monospace'

    function frame() {
      A.current += 0.03 * speed
      B.current += 0.015 * speed

      const cosA = Math.cos(A.current), sinA = Math.sin(A.current)
      const cosB = Math.cos(B.current), sinB = Math.sin(B.current)

      const output: string[]   = new Array(COLS * ROWS).fill(' ')
      const zbuf:   number[]   = new Array(COLS * ROWS).fill(0)

      for (let theta = 0; theta < Math.PI * 2; theta += 0.07) {
        const cosT = Math.cos(theta), sinT = Math.sin(theta)
        for (let phi = 0; phi < Math.PI * 2; phi += 0.02) {
          const cosP = Math.cos(phi), sinP = Math.sin(phi)
          const circleX = 2 + cosT
          const x = circleX * (cosB * cosP + sinA * sinB * sinP) - sinT * cosA * sinB
          const y = circleX * (sinB * cosP - sinA * cosB * sinP) + sinT * cosA * cosB
          const z = cosA * circleX * sinP + sinT * sinA + 6
          const ooz = 1 / z
          const xp = Math.floor(COLS / 2 + 2.4 * COLS * ooz * x)
          const yp = Math.floor(ROWS / 2 + ROWS  * ooz * y)
          const L = cosP * cosT * sinB - cosA * cosT * sinP - sinA * sinT + cosB * (cosA * sinT - cosT * sinA * sinP)
          if (yp >= 0 && yp < ROWS && xp >= 0 && xp < COLS && ooz > zbuf[xp + COLS * yp]) {
            zbuf[xp + COLS * yp] = ooz
            const luminance = Math.max(0, Math.floor(L * 8))
            output[xp + COLS * yp] = chars[Math.min(luminance, chars.length - 1)]
          }
        }
      }

      ctx.fillStyle = '#080806'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = color
      ctx.globalAlpha = 0.9

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const ch = output[c + COLS * r]
          if (ch !== ' ') {
            ctx.fillText(ch, c * 7 + 4, r * 12 + 12)
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
