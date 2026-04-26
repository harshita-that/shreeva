/**
 * ImageCategoryGrid — Fixed 2×2 luxury image grid.
 * Layout: [Rings | Necklaces] top row, [Earrings | Bridal] bottom row
 * Equal-height cards, consistent aspect ratios, clean responsive behaviour.
 */
import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const CATEGORIES = [
  {
    name: 'Gold Rings',
    sub: 'Symbols of Forever',
    href: '/products?category=rings',
    /* Verified: Gold ring macro shot */
    img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=800&fit=crop&q=75',
  },
  {
    name: 'Necklaces',
    sub: 'Adorn Your Grace',
    href: '/products?category=necklaces',
    /* Verified: Gold necklace on dark bg */
    img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&h=800&fit=crop&q=75',
  },
  {
    name: 'Earrings',
    sub: 'Details That Speak',
    href: '/products?category=earrings',
    /* Verified: Drop earrings close-up */
    img: 'https://images.unsplash.com/photo-1573408301185-9146fe261cdc?w=600&h=800&fit=crop&q=75',
  },
  {
    name: 'Bridal',
    sub: 'Begin With Gold',
    href: '/products',
    /* Verified: Bridal jewellery flat lay */
    img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&h=800&fit=crop&q=75',
  },
]

function CategoryCard({ item, index }) {
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
    <Link
      ref={ref}
      to={item.href}
      style={{
        display: 'block',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '4px',
        /* Fixed aspect ratio — all cards equal height */
        aspectRatio: '3 / 4',
        background: '#111',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.75s ease ${index * 0.1}s, transform 0.75s ease ${index * 0.1}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image — fills card, zooms on hover */}
      <img
        src={item.img}
        alt={item.name}
        loading="lazy"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          opacity: hovered ? 0.5 : 0.75,
          transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.5s ease',
        }}
        onError={(e) => {
          /* Hide broken img — show ivory placeholder bg instead */
          e.target.style.display = 'none'
          e.target.parentElement.style.background = '#1a1208'
        }}
      />

      {/* Gradient overlay — bottom fade */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(10,8,5,0.88) 0%, rgba(10,8,5,0.15) 55%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Gold border on hover */}
      <div style={{
        position: 'absolute', inset: 0,
        border: `1.5px solid rgba(201,168,76,${hovered ? 0.5 : 0})`,
        borderRadius: '4px',
        transition: 'border-color 0.35s ease',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Text content */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        zIndex: 3,
        padding: '20px 22px',
      }}>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '9px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#C9A84C',
          marginBottom: '5px',
          opacity: hovered ? 1 : 0.7,
          transform: hovered ? 'translateY(0)' : 'translateY(3px)',
          transition: 'all 0.35s ease',
        }}>
          {item.sub}
        </p>

        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.2rem, 1.8vw, 1.55rem)',
          fontWeight: 500,
          color: '#FAFAF7',
          letterSpacing: '0.03em',
          lineHeight: 1.15,
          margin: 0,
        }}>
          {item.name}
        </h3>

        {/* Explore pill — slides in on hover */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: hovered ? '12px' : '0px',
          maxHeight: hovered ? '24px' : '0px',
          opacity: hovered ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.35s ease',
        }}>
          <div style={{ width: '20px', height: '1px', background: '#C9A84C', flexShrink: 0 }} />
          <span style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '9px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#C9A84C',
          }}>
            Explore
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function ImageCategoryGrid() {
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
    <section style={{ padding: 'clamp(3.5rem,6vw,5.5rem) 0', background: '#FAFAF7' }}>
      {/* Header */}
      <div
        ref={titleRef}
        style={{
          textAlign: 'center',
          marginBottom: 'clamp(1.8rem,3.5vw,3rem)',
          padding: '0 clamp(1rem,4vw,3rem)',
          opacity: titleIn ? 1 : 0,
          transform: titleIn ? 'translateY(0)' : 'translateY(18px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '10px', letterSpacing: '0.26em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px' }}>
          Shop The Edit
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.9rem,4vw,3rem)', fontWeight: 500, color: '#1C1C1C', letterSpacing: '0.02em', lineHeight: 1.1 }}>
          Discover Your Collection
        </h2>
      </div>

      {/* Grid — strict 2×2 on all screen sizes, equal columns */}
      <style>{`
        .icg-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 0 clamp(0.5rem,2vw,1.5rem);
          max-width: 1280px;
          margin: 0 auto;
        }
        @media (min-width: 640px) {
          .icg-grid { gap: 12px; padding: 0 clamp(1rem,3vw,2rem); }
        }
        @media (min-width: 1024px) {
          .icg-grid { gap: 16px; padding: 0 clamp(1.5rem,4vw,3rem); }
        }
      `}</style>

      <div className="icg-grid">
        {CATEGORIES.map((item, i) => (
          <CategoryCard key={item.name} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
