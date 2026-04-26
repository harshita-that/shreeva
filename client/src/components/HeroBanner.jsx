import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: ((i * 137.5) % 100),
  y: ((i * 97.3) % 100),
  size: 1 + (i % 3) * 0.6,
  delay: (i * 0.4) % 5,
  dur: 4 + (i % 4),
}))

export default function HeroBanner() {
  const [visible, setVisible] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <section style={{
      minHeight: '100vh',
      background: '#0a0805',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(3.5rem,8vh,6rem) 1.5rem clamp(2.5rem,5vh,4rem)',
    }}>
      {/* ── Background image with slow zoom ── */}
      <img
        src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=1800&h=1000&fit=crop&q=75"
        alt=""
        aria-hidden="true"
        loading="eager"
        onLoad={() => setImgLoaded(true)}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center 30%',
          opacity: imgLoaded ? 0.22 : 0,
          filter: 'saturate(0.7)',
          transform: imgLoaded ? 'scale(1.06)' : 'scale(1)',
          transition: 'opacity 1.8s ease, transform 12s ease',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      {/* ── Multi-layer gradient overlay ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          linear-gradient(to bottom, rgba(10,8,5,0.7) 0%, rgba(10,8,5,0.3) 40%, rgba(10,8,5,0.5) 100%),
          radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(10,8,5,0.6) 100%)
        `,
      }} />

      {/* ── Gold shimmer particles ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {PARTICLES.map((p, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${p.x}%`, top: `${p.y}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            borderRadius: '50%', background: '#C9A84C', opacity: 0,
            animation: `particleFade ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes particleFade {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(2); }
        }
        @keyframes goldPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
          50% { box-shadow: 0 0 28px 6px rgba(201,168,76,0.25); }
        }
        .hero-el { opacity: 0; }
        .hero-visible .h1  { animation: heroFadeUp 1.2s cubic-bezier(.22,1,.36,1) 0.1s  forwards; }
        .hero-visible .h2  { animation: heroFadeUp 1.2s cubic-bezier(.22,1,.36,1) 0.5s  forwards; }
        .hero-visible .h3  { animation: heroFadeUp 1.2s cubic-bezier(.22,1,.36,1) 0.75s forwards; }
        .hero-visible .hdiv { animation: heroFadeUp 1.2s cubic-bezier(.22,1,.36,1) 0.9s forwards; }
        .hero-visible .hbtns { animation: heroFadeUp 1.2s cubic-bezier(.22,1,.36,1) 1.1s forwards; }
        .hero-visible .hscroll { animation: heroFadeUp 1.2s cubic-bezier(.22,1,.36,1) 1.4s forwards; }

        .hero-btn {
          display: inline-block;
          padding: 15px 40px;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 1px;
          transition: all 0.4s ease;
          cursor: pointer;
        }
        .hero-btn-primary {
          background: linear-gradient(135deg, #C9A84C 0%, #b8963e 60%, #d4b76a 100%);
          color: #1C1C1C;
          border: 1px solid transparent;
          font-weight: 600;
          animation: goldPulse 3s ease-in-out 2.5s infinite;
        }
        .hero-btn-primary:hover {
          background: linear-gradient(135deg, #d4b76a 0%, #C9A84C 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(201,168,76,0.4);
        }
        .hero-btn-outline {
          background: transparent;
          color: rgba(250,250,247,0.75);
          border: 1px solid rgba(201,168,76,0.45);
        }
        .hero-btn-outline:hover {
          border-color: #C9A84C;
          color: #C9A84C;
          transform: translateY(-2px);
        }
        .hero-ring {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: heroRingPulse 8s ease-in-out infinite;
        }
        @keyframes heroRingPulse {
          0%, 100% { opacity: 0.07; }
          50% { opacity: 0.14; }
        }
        .hscroll-text { color: rgba(250,250,247,0.25) !important; }
        .hscroll-svg rect { stroke: rgba(250,250,247,0.3) !important; }
      `}</style>

      {/* Decorative rings */}
      <div className="hero-ring" style={{ width: 500, height: 500, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', border: '1px solid rgba(201,168,76,0.1)', zIndex: 1 }} />
      <div className="hero-ring" style={{ width: 760, height: 760, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', border: '1px solid rgba(201,168,76,0.06)', zIndex: 1, animationDelay: '2s' }} />
      <div className="hero-ring" style={{ width: 1040, height: 1040, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', border: '1px solid rgba(201,168,76,0.04)', zIndex: 1, animationDelay: '4s' }} />

      {/* Content */}
      <div
        className={visible ? 'hero-visible' : ''}
        style={{ textAlign: 'center', zIndex: 2, maxWidth: '820px', position: 'relative' }}
      >
        {/* Eyebrow */}
        <p className="hero-el h1" style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '10px',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: '#C9A84C',
          marginBottom: '1.6rem',
        }}>
          Fine Gold Jewellery · Est. 1995
        </p>

        {/* Brand name */}
        <h1 className="hero-el h2" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(3.2rem, 9vw, 7.5rem)',
          fontWeight: 400,
          color: '#FAFAF7',
          lineHeight: 0.98,
          letterSpacing: '0.06em',
          marginBottom: '2rem',
        }}>
          Shreeva<br />
          <span style={{ fontStyle: 'italic', fontWeight: 300 }}>Jewellers</span>
        </h1>

        {/* Tagline */}
        <p className="hero-el h3" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.15rem, 2.8vw, 1.7rem)',
          fontStyle: 'italic',
          fontWeight: 300,
          color: 'rgba(250,250,247,0.65)',
          letterSpacing: '0.03em',
          marginBottom: '0.6rem',
        }}>
          Where Gold Becomes Legacy
        </p>

        {/* Subtext */}
        <p className="hero-el h3" style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '0.78rem',
          letterSpacing: '0.16em',
          color: 'rgba(250,250,247,0.32)',
          textTransform: 'uppercase',
          marginBottom: '2.8rem',
        }}>
          Crafted with precision. Designed for eternity.
        </p>

        {/* Gold divider */}
        <div className="hero-el hdiv" style={{
          width: '60px', height: '1px',
          background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
          margin: '0 auto 2.8rem',
        }} />

        {/* CTA Buttons */}
        <div className="hero-el hbtns" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/products" className="hero-btn hero-btn-primary">
            Explore Collection
          </Link>
          <Link to="/contact" className="hero-btn hero-btn-outline">
            Contact Us
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="hero-el hscroll" style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <span className="hscroll-text" style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase' }}>
            Scroll
          </span>
          <svg className="hscroll-svg" width="14" height="24" viewBox="0 0 14 24" fill="none" style={{ opacity: 0.4 }}>
            <rect x="1" y="1" width="12" height="22" rx="6" stroke="#FAFAF7" strokeWidth="1" />
            <circle cx="7" cy="7" r="2" fill="#C9A84C">
              <animate attributeName="cy" values="7;16;7" dur="2.2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </div>
    </section>
  )
}
