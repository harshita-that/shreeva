/**
 * LuxuryStrip — Full-width 5-column image grid.
 * 5-col on desktop, 3-col tablet, 2-col mobile. Zero side gaps.
 */
import { useEffect, useState, useRef } from 'react'

const PANELS = [
  {
    img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=800&fit=crop&q=75',
    label: 'Rings',
    sub: 'Symbols of Forever',
    href: '/products?category=rings',
  },
  {
    img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&h=800&fit=crop&q=75',
    label: 'Necklaces',
    sub: 'Adorn Your Grace',
    href: '/products?category=necklaces',
  },
  {
    img: 'https://images.unsplash.com/photo-1573408301185-9146fe261cdc?w=600&h=800&fit=crop&q=75',
    label: 'Earrings',
    sub: 'Details That Speak',
    href: '/products?category=earrings',
  },
  {
    img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&h=800&fit=crop&q=75',
    label: 'Pendants',
    sub: 'Close to the Heart',
    href: '/products',
  },
  {
    img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=800&fit=crop&q=75',
    label: 'Bridal',
    sub: 'Begin With Gold',
    href: '/products',
  },
]

function StripPanel({ panel, index }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <a
      ref={ref}
      href={panel.href}
      style={{
        display: 'block',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
        /* No border-radius — full-bleed edge-to-edge grid */
        background: '#111',
        aspectRatio: '3 / 4',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.75s ease ${index * 0.08}s, transform 0.75s ease ${index * 0.08}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <img
        src={panel.img}
        alt={panel.label}
        loading="lazy"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: hovered ? 0.5 : 0.72,
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          transition: 'opacity 0.5s ease, transform 0.65s ease',
        }}
        onError={(e) => {
          e.target.style.display = 'none'
          e.target.parentElement.style.background = '#1a140a'
        }}
      />

      {/* Bottom gradient */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(10,8,5,0.82) 0%, rgba(10,8,5,0.1) 50%, transparent 100%)',
      }} />

      {/* Text */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '0 16px 20px',
        textAlign: 'center',
        zIndex: 1,
      }}>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '8px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#C9A84C',
          marginBottom: '5px',
          opacity: hovered ? 1 : 0.7,
          transition: 'opacity 0.35s ease',
        }}>
          {panel.sub}
        </p>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1rem, 1.5vw, 1.4rem)',
          fontWeight: 500,
          color: '#FAFAF7',
          letterSpacing: '0.04em',
          lineHeight: 1.1,
          margin: 0,
        }}>
          {panel.label}
        </h3>
      </div>
    </a>
  )
}

export default function LuxuryStrip() {
  const titleRef = useRef(null)
  const [titleIn, setTitleIn] = useState(false)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTitleIn(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section style={{ background: '#FAFAF7', padding: 'clamp(3rem,5vw,4.5rem) 0 clamp(3rem,5vw,4.5rem)' }}>

      {/* Header — centred, with side padding */}
      <div
        ref={titleRef}
        style={{
          textAlign: 'center',
          marginBottom: 'clamp(1.5rem,3vw,2.5rem)',
          padding: '0 clamp(1rem,4vw,3rem)',
          opacity: titleIn ? 1 : 0,
          transform: titleIn ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px' }}>
          The Edit
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 500, color: '#1C1C1C', letterSpacing: '0.02em', lineHeight: 1.1, marginBottom: '14px' }}>
          Curated Treasures
        </h2>
        <div style={{ width: '36px', height: '2px', background: '#C9A84C', margin: '0 auto', opacity: 0.7, borderRadius: '1px' }} />
      </div>

      {/* Full-width 5-col grid — NO side padding, fills 100% */}
      <style>{`
        .ls-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          width: 100%;
        }
        @media (min-width: 480px)  { .ls-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 640px)  { .ls-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .ls-grid { grid-template-columns: repeat(5, 1fr); } }
        /* When 5 items in 2-col: make last item span full row */
        @media (min-width:480px) and (max-width:639px) {
          .ls-grid > a:last-child:nth-child(odd) { grid-column: span 2; }
        }
      `}</style>

      <div className="ls-grid">
        {PANELS.map((panel, i) => (
          <StripPanel key={panel.label} panel={panel} index={i} />
        ))}
      </div>
    </section>
  )
}
