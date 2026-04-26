import { useEffect, useRef, useState } from 'react'

const collections = [
  {
    name: 'Gold Rings',
    subtitle: 'Symbols of Forever',
    href: '/products?category=Rings',
    accent: '#C9A84C',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" width="56" height="56">
        <circle cx="40" cy="40" r="26" stroke="#C9A84C" strokeWidth="1.2"/>
        <circle cx="40" cy="40" r="18" stroke="#C9A84C" strokeWidth="0.6"/>
        <circle cx="40" cy="40" r="4" fill="#C9A84C" opacity="0.7"/>
        <path d="M40 14 L40 20M40 60 L40 66M14 40 L20 40M60 40 L66 40" stroke="#C9A84C" strokeWidth="0.8"/>
      </svg>
    ),
  },
  {
    name: 'Necklaces',
    subtitle: 'Adorn Your Grace',
    href: '/products?category=Necklaces',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" width="56" height="56">
        <path d="M20 22 Q40 48 60 22" stroke="#C9A84C" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <circle cx="40" cy="52" r="7" stroke="#C9A84C" strokeWidth="1"/>
        <circle cx="40" cy="52" r="3" fill="#C9A84C" opacity="0.6"/>
        <path d="M33 52 L20 22M47 52 L60 22" stroke="#C9A84C" strokeWidth="0.7" strokeDasharray="2 3"/>
      </svg>
    ),
  },
  {
    name: 'Bridal',
    subtitle: 'Begin With Gold',
    href: '/products?category=Earrings',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" width="56" height="56">
        <path d="M40 18 L43 30 L56 30 L46 38 L50 50 L40 42 L30 50 L34 38 L24 30 L37 30 Z" stroke="#C9A84C" strokeWidth="1" fill="none" strokeLinejoin="round"/>
        <circle cx="40" cy="34" r="3" fill="#C9A84C" opacity="0.6"/>
        <path d="M28 60 Q40 56 52 60" stroke="#C9A84C" strokeWidth="0.8" strokeLinecap="round"/>
        <path d="M32 64 Q40 60 48 64" stroke="#C9A84C" strokeWidth="0.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Everyday',
    subtitle: 'Gold for Every Moment',
    href: '/products?category=Bracelets',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" width="56" height="56">
        <rect x="20" y="32" width="40" height="16" rx="8" stroke="#C9A84C" strokeWidth="1.2"/>
        <rect x="26" y="36" width="28" height="8" rx="4" stroke="#C9A84C" strokeWidth="0.6"/>
        <circle cx="40" cy="40" r="3" fill="#C9A84C" opacity="0.6"/>
        <path d="M32 26 L32 30M40 24 L40 30M48 26 L48 30" stroke="#C9A84C" strokeWidth="0.7" strokeLinecap="round"/>
      </svg>
    ),
  },
]

function CollectionCard({ item, index }) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fallback = setTimeout(() => setInView(true), 300 + index * 100)
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); clearTimeout(fallback) } },
      { threshold: 0 }
    )
    obs.observe(el)
    return () => { obs.disconnect(); clearTimeout(fallback) }
  }, [index])

  return (
    <a
      ref={ref}
      href={item.href}
      style={{
        display: 'block',
        textDecoration: 'none',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.75s ease ${index * 0.1}s, transform 0.75s ease ${index * 0.1}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          borderRadius: '10px',
          overflow: 'hidden',
          background: hovered ? '#161616' : '#1C1C1C',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered ? '0 10px 32px rgba(28,28,28,0.22)' : '0 2px 10px rgba(28,28,28,0.1)',
          transition: 'background 0.4s ease, transform 0.35s ease, box-shadow 0.35s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {/* Corner brackets */}
        {[
          { top: 16, left: 16, borderTop: true, borderLeft: true },
          { top: 16, right: 16, borderTop: true, borderRight: true },
          { bottom: 16, left: 16, borderBottom: true, borderLeft: true },
          { bottom: 16, right: 16, borderBottom: true, borderRight: true },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 28,
              height: 28,
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              borderTop: pos.borderTop ? `1px solid rgba(201,168,76,${hovered ? 0.7 : 0.35})` : 'none',
              borderLeft: pos.borderLeft ? `1px solid rgba(201,168,76,${hovered ? 0.7 : 0.35})` : 'none',
              borderRight: pos.borderRight ? `1px solid rgba(201,168,76,${hovered ? 0.7 : 0.35})` : 'none',
              borderBottom: pos.borderBottom ? `1px solid rgba(201,168,76,${hovered ? 0.7 : 0.35})` : 'none',
              transition: 'border-color 0.4s ease',
            }}
          />
        ))}

        {/* Icon */}
        <div
          style={{
            transform: hovered ? 'scale(1.08) translateY(-4px)' : 'scale(1) translateY(0)',
            transition: 'transform 0.5s ease',
            marginBottom: '1.4rem',
            opacity: hovered ? 1 : 0.75,
          }}
        >
          {item.icon}
        </div>

        {/* Divider */}
        <div
          style={{
            width: hovered ? '40px' : '24px',
            height: '1px',
            background: '#C9A84C',
            marginBottom: '1.1rem',
            opacity: 0.65,
            transition: 'width 0.4s ease',
          }}
        />

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '9px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '8px',
            opacity: hovered ? 1 : 0.65,
            transition: 'opacity 0.4s ease',
          }}
        >
          {item.subtitle}
        </p>

        {/* Name */}
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.1rem, 2.2vw, 1.45rem)',
            fontWeight: 500,
            color: '#FAFAF7',
            letterSpacing: '0.03em',
            textAlign: 'center',
            transition: 'color 0.4s ease',
          }}
        >
          {item.name}
        </h3>

        {/* Arrow (shows on hover) */}
        <div
          style={{
            marginTop: '1rem',
            fontFamily: "'Jost', sans-serif",
            fontSize: '10px',
            letterSpacing: '0.16em',
            color: '#C9A84C',
            opacity: hovered ? 0.85 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
          }}
        >
          EXPLORE →
        </div>
      </div>
    </a>
  )
}

export default function CategoryGrid() {
  const titleRef = useRef(null)
  const [titleIn, setTitleIn] = useState(false)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const fallback = setTimeout(() => setTitleIn(true), 400)
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTitleIn(true); obs.disconnect(); clearTimeout(fallback) } },
      { threshold: 0 }
    )
    obs.observe(el)
    return () => { obs.disconnect(); clearTimeout(fallback) }
  }, [])

  return (
    <section style={{
      padding: 'clamp(3.5rem,7vw,6rem) clamp(1rem,4vw,3rem)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section header */}
        <div
          ref={titleRef}
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(2rem,4.5vw,3.5rem)',
            opacity: titleIn ? 1 : 0,
            transform: titleIn ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px' }}>
            Browse By
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.9rem, 4.5vw, 3.2rem)', fontWeight: 500, color: '#1C1C1C', letterSpacing: '0.02em', lineHeight: 1.1 }}>
            Our Collections
          </h2>
        </div>

        <style>{`
          .cat-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          @media (min-width: 768px) {
            .cat-grid { grid-template-columns: repeat(4, 1fr); gap: 18px; }
          }
        `}</style>

        <div className="cat-grid">
          {collections.map((item, i) => (
            <CollectionCard key={item.name} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
