/**
 * CinematicBanner — Full-width dark editorial banner between sections.
 * Uses Unsplash luxury jewellery imagery with a parallax-style overlay.
 * Non-breaking: injected as a new section, does not touch existing components.
 */
import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CinematicBanner() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Subtle parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const pct = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      setOffset(Math.round((pct - 0.5) * 60))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        height: 'clamp(320px, 44vw, 500px)',
        overflow: 'hidden',
        background: '#0e0e0e',
      }}
    >
      {/* Parallax background */}
      <img
        src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=1600&h=900&fit=crop&q=80"
        alt="Luxury jewellery"
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '120%',
          objectFit: 'cover',
          objectPosition: 'center',
          transform: `translateY(${offset}px)`,
          opacity: 0.38,
          transition: 'transform 0.1s linear',
        }}
      />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(14,14,14,0.85) 0%, rgba(14,14,14,0.4) 60%, rgba(201,168,76,0.08) 100%)',
      }} />

      {/* Gold top border */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 1.5rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 1.2s ease, transform 1.2s ease',
      }}>
        {/* Corner ornaments */}
        {[
          { top:24, left:24 },
          { top:24, right:24 },
          { bottom:24, left:24 },
          { bottom:24, right:24 },
        ].map((pos, i) => (
          <div key={i} style={{
            position:'absolute',
            width:36, height:36,
            ...pos,
            borderTop: (pos.top !== undefined) ? '1px solid rgba(201,168,76,0.4)' : 'none',
            borderBottom: (pos.bottom !== undefined) ? '1px solid rgba(201,168,76,0.4)' : 'none',
            borderLeft: (pos.left !== undefined) ? '1px solid rgba(201,168,76,0.4)' : 'none',
            borderRight: (pos.right !== undefined) ? '1px solid rgba(201,168,76,0.4)' : 'none',
          }} />
        ))}

        <p style={{
          fontFamily:"'Jost',sans-serif",
          fontSize:'10px',
          letterSpacing:'0.28em',
          textTransform:'uppercase',
          color:'#C9A84C',
          marginBottom:'1.2rem',
          opacity:0.9,
        }}>
          The Shreeva Promise
        </p>

        <h2 style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:'clamp(2rem,5.5vw,4rem)',
          fontWeight:400,
          color:'#FAFAF7',
          lineHeight:1.12,
          letterSpacing:'0.04em',
          marginBottom:'1.4rem',
          maxWidth:'700px',
        }}>
          Gold that speaks<br />
          before words do.
        </h2>

        <div style={{ width:'40px', height:'1px', background:'#C9A84C', margin:'0 auto 1.8rem', opacity:0.7 }} />

        <p style={{
          fontFamily:"'Jost',sans-serif",
          fontSize:'0.8rem',
          letterSpacing:'0.08em',
          color:'rgba(250,250,247,0.45)',
          marginBottom:'2.2rem',
          maxWidth:'360px',
          lineHeight:1.8,
          textAlign:'center',
        }}>
          Every ornament is a promise of purity, craftsmanship,
          and the legacy it carries forward through generations.
        </p>

        <Link
          to="/products"
          style={{
            display:'inline-block',
            padding:'13px 38px',
            fontFamily:"'Jost',sans-serif",
            fontSize:'11px',
            letterSpacing:'0.22em',
            textTransform:'uppercase',
            color:'#1C1C1C',
            textDecoration:'none',
            background:'#C9A84C',
            border:'1px solid #C9A84C',
            borderRadius:'1px',
            whiteSpace:'nowrap',
            transition:'background 0.4s ease, color 0.4s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A84C' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.color = '#1C1C1C' }}
        >
          View Collection
        </Link>
      </div>
    </section>
  )
}
