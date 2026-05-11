function makeField(density: number): string {
  const W = 38, H = 7
  const chars = ['.', '·', '*', '✦', '★']
  const lines: string[] = []
  for (let r = 0; r < H; r++) {
    let line = '  '
    for (let c = 0; c < W; c++) {
      line += Math.random() < density
        ? chars[Math.floor(Math.random() * chars.length)]
        : ' '
    }
    lines.push(line)
  }
  return lines.join('\n')
}

// pre-generate 5 frames at increasing densities
export const STARFIELD_FRAMES = [0.04, 0.09, 0.16, 0.24, 0.34].map(d =>
  `\n${makeField(d)}\n\n  GAIN ${Math.round(d * 250).toString().padStart(3,'0')}/085`
)
