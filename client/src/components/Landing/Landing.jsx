import { useEffect, useRef } from 'react'
import './Landing.css'

/* ── Spider-web canvas ─────────────────────────────────────── */
function SpiderWebCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    /* ── Node physics ── */
    const NODE_COUNT = 80
    const CONNECT_DIST = 160
    const mouse = { x: -9999, y: -9999 }

    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }))

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const src = e.touches ? e.touches[0] : e
      mouse.x = src.clientX - rect.left
      mouse.y = src.clientY - rect.top
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove, { passive: true })

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      /* update positions */
      nodes.forEach((n) => {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1

        /* subtle mouse repulsion */
        const dx = n.x - mouse.x
        const dy = n.y - mouse.y
        const dist = Math.hypot(dx, dy)
        if (dist < 100) {
          n.x += (dx / dist) * 1.5
          n.y += (dy / dist) * 1.5
        }
      })

      /* draw threads */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.hypot(dx, dy)
          if (d < CONNECT_DIST) {
            const alpha = 1 - d / CONNECT_DIST
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(0,0,0,${alpha * 0.55})`
            ctx.lineWidth = alpha * 1.2
            ctx.stroke()
          }
        }
      }

      /* draw nodes */
      nodes.forEach((n) => {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,0,0,0.55)'
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="landing__canvas" aria-hidden="true" />
}

/* ── Corner radial webs ─────────────────────────────────────── */
function CornerWeb({ position }) {
  const size = 260
  const cx = position === 'top-left' || position === 'bottom-left' ? 0 : size
  const cy = position === 'top-left' || position === 'top-right' ? 0 : size
  const rings = [60, 110, 160, 210]
  const rays = 8

  return (
    <svg
      className={`landing__corner-web landing__corner-web--${position}`}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
    >
      {/* rays */}
      {Array.from({ length: rays }, (_, i) => {
        const angle = (i / rays) * Math.PI * 2
        const maxR = rings[rings.length - 1]
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(angle) * maxR}
            y2={cy + Math.sin(angle) * maxR}
            stroke="rgba(0,0,0,0.45)"
            strokeWidth="1"
          />
        )
      })}
      {/* concentric arcs */}
      {rings.map((r) => (
        <circle
          key={r}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(0,0,0,0.35)"
          strokeWidth="1"
        />
      ))}
    </svg>
  )
}

/* ── Landing section ────────────────────────────────────────── */
export default function Landing() {
  return (
    <section id="landing" className="landing" aria-label="Hero">
      {/* animated particle web */}
      <SpiderWebCanvas />

      {/* static corner webs */}
      <CornerWeb position="top-left" />
      <CornerWeb position="top-right" />
      <CornerWeb position="bottom-left" />
      <CornerWeb position="bottom-right" />

      {/* hero content */}
      <div className="landing__content">
        <div className="landing__badge">
          <span className="landing__badge-dot" />
          Available for work
        </div>

        <h1 className="landing__name">
          <span className="landing__name-first">Tarunika</span>
          <span className="landing__name-last"> B</span>
        </h1>

        <p className="landing__role">Full Stack Developer</p>

        <p className="landing__tagline">
          Building sleek, scalable web experiences — pixel perfect to production.
        </p>

        <div className="landing__actions">
          <a href="#projects" className="landing__btn landing__btn--primary">
            View Projects
          </a>
          <a href="#contact" className="landing__btn landing__btn--ghost">
            Let's Talk
          </a>
        </div>
      </div>

      {/* scroll hint */}
      <div className="landing__scroll-hint" aria-hidden="true">
        <span className="landing__scroll-line" />
        <span className="landing__scroll-text">scroll</span>
      </div>
    </section>
  )
}
