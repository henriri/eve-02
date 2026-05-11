import { useEffect, useState, useRef } from 'react'

export function useAsciiLoop(frames: string[], bpm = 8): string {
  const [idx, setIdx] = useState(0)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!frames.length) return
    const ms = (60 / bpm) * 1000
    ref.current = setInterval(() => {
      setIdx(i => (i + 1) % frames.length)
    }, ms)
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [frames, bpm])

  return frames[idx] ?? ''
}
