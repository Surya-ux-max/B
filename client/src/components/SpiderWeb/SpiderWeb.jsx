import './SpiderWeb.css'

/* ──────────────────────────────────────────────────────────
   SpiderWeb – Decorative animated SVG web, fixed to the
   right edge of the viewport.
   ────────────────────────────────────────────────────────── */

export default function SpiderWeb() {
  const cx     = 420   // SVG centre-x
  const cy     = 0     // SVG centre-y (top edge – web hangs down)
  const rings  = 7     // concentric rings
  const spokes = 8     // radial lines
  const maxR   = 420   // outermost radius

  const angles = Array.from({ length: spokes }, (_, i) => (i * 360) / spokes)

  const polar = (angle, r) => {
    const rad = ((angle - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  const ringPoints = (r) =>
    angles.map((a) => { const p = polar(a, r); return `${p.x},${p.y}` }).join(' ')

  const spokeLines = angles.map((a, i) => {
    const end = polar(a, maxR)
    return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} className="web-spoke" />
  })

  const ringPolygons = Array.from({ length: rings }, (_, i) => {
    const r = ((i + 1) / rings) * maxR
    return (
      <polygon
        key={i}
        points={ringPoints(r)}
        className="web-ring"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    )
  })

  const silkDrops = angles.flatMap((a, ai) =>
    Array.from({ length: rings }, (_, ri) => {
      const r = ((ri + 0.5) / rings) * maxR
      const p = polar(a, r)
      return (
        <circle
          key={`${ai}-${ri}`}
          cx={p.x}
          cy={p.y}
          r={2.8}
          className="web-dew"
          style={{ animationDelay: `${(ai * rings + ri) * 0.08}s` }}
        />
      )
    })
  )

  return (
    <div className="spider-web-wrapper" aria-hidden="true">
      <svg
        className="spider-web-svg"
        viewBox={`0 0 ${cx * 2} ${maxR}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMin meet"
      >
        <defs>
          <filter id="web-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#web-glow)">
          {spokeLines}
          {ringPolygons}
          {silkDrops}
        </g>
      </svg>

      {/* Spider hanging on silk thread */}
      <div className="spider-thread-wrap">
        <div className="spider-thread" />
        <div className="spider-body">
          <div className="spider-head" />
          <div className="spider-abdomen" />
          <div className="spider-legs left">
            <span /><span /><span /><span />
          </div>
          <div className="spider-legs right">
            <span /><span /><span /><span />
          </div>
        </div>
      </div>
    </div>
  )
}
