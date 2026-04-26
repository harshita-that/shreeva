import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import HeroBanner from '../components/HeroBanner'
import ImageCategoryGrid from '../components/ImageCategoryGrid'
import CategoryGrid from '../components/CategoryGrid'
import FeaturedProducts from '../components/FeaturedProducts'
import LuxuryStrip from '../components/LuxuryStrip'
import WhyUs from '../components/WhyUs'
import Footer from '../components/Footer'

/* ── Scroll-reveal hook ── */
function useFadeIn(threshold = 0.2) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ── Brand Story Section ── */
function BrandStory() {
  const [ref, visible] = useFadeIn(0.15)

  return (
    <section style={{
      padding: 'clamp(3rem,6vw,5rem) clamp(1rem,4vw,3rem)',
      background: '#F5F0E8',
    }}>
      <style>{`
        .bs-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
        }
        @media (min-width: 768px) {
          .bs-grid { grid-template-columns: 1fr 1fr; gap: 4.5rem; }
        }
      `}</style>

      <div ref={ref} className="bs-grid">
        {/* Left — story text */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : 'translateX(-24px)',
          transition: 'opacity 1s ease, transform 1s ease',
        }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '14px' }}>
            Our Story
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 500, color: '#1C1C1C', lineHeight: 1.18, letterSpacing: '0.01em', marginBottom: '1.25rem' }}>
            Crafting Elegance<br />Since Day One
          </h2>
          <div style={{ width: '40px', height: '1px', background: '#C9A84C', marginBottom: '1.25rem', opacity: 0.7 }} />
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '0.88rem', lineHeight: 1.85, color: 'rgba(28,28,28,0.62)', marginBottom: '0.85rem', maxWidth: '420px' }}>
            At Shreeva Jewellers, every piece begins not with metal — but with meaning.
            Rooted in decades of artisan tradition, we blend the timeless craft of Indian
            goldsmithing with a refined modern sensibility.
          </p>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '0.88rem', lineHeight: 1.85, color: 'rgba(28,28,28,0.62)', maxWidth: '420px' }}>
            Each ornament is a promise — of purity, of craftsmanship, and of the legacy
            it carries forward through generations.
          </p>
          <Link
            to="/products"
            style={{ display: 'inline-block', marginTop: '1.75rem', fontFamily: "'Jost', sans-serif", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1C1C1C', textDecoration: 'none', borderBottom: '1px solid #C9A84C', paddingBottom: '3px', opacity: 0.75, transition: 'opacity 0.25s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.75')}
          >
            Our Craft →
          </Link>
        </div>

        {/* Right — decorative quote panel */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : 'translateX(24px)',
          transition: 'opacity 1s ease 0.2s, transform 1s ease 0.2s',
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1',
            maxHeight: '380px',
            borderRadius: '6px',
            overflow: 'hidden',
            background: '#1C1C1C',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2.5rem',
          }}>
            {/* Decorative corners */}
            {[
              { top: 20, left: 20, borderTop: '1px solid rgba(201,168,76,0.5)', borderLeft: '1px solid rgba(201,168,76,0.5)' },
              { top: 20, right: 20, borderTop: '1px solid rgba(201,168,76,0.5)', borderRight: '1px solid rgba(201,168,76,0.5)' },
              { bottom: 20, left: 20, borderBottom: '1px solid rgba(201,168,76,0.5)', borderLeft: '1px solid rgba(201,168,76,0.5)' },
              { bottom: 20, right: 20, borderBottom: '1px solid rgba(201,168,76,0.5)', borderRight: '1px solid rgba(201,168,76,0.5)' },
            ].map((s, i) => (
              <div key={i} style={{ position: 'absolute', width: 36, height: 36, ...s }} />
            ))}
            {/* Gold ornament */}
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" style={{ marginBottom: '1.5rem', opacity: 0.7 }}>
              <circle cx="24" cy="24" r="18" stroke="#C9A84C" strokeWidth="0.8"/>
              <circle cx="24" cy="24" r="10" stroke="#C9A84C" strokeWidth="0.8"/>
              <line x1="24" y1="6" x2="24" y2="42" stroke="#C9A84C" strokeWidth="0.8"/>
              <line x1="6" y1="24" x2="42" y2="24" stroke="#C9A84C" strokeWidth="0.8"/>
              <circle cx="24" cy="24" r="2.5" fill="#C9A84C"/>
            </svg>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', fontStyle: 'italic', fontWeight: 400, color: '#FAFAF7', textAlign: 'center', lineHeight: 1.6, letterSpacing: '0.01em', maxWidth: '260px', marginBottom: '1.25rem' }}>
              "Gold is not just a metal —<br/>it is a story waiting to be worn."
            </p>
            <div style={{ width: '28px', height: '1px', background: '#C9A84C', opacity: 0.6 }} />
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,250,247,0.3)', marginTop: '0.85rem' }}>
              Shreeva Jewellers · Est. 1995
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── HomePage ── */
export default function HomePage() {
  return (
    <div style={{ background: '#FAFAF7' }}>
      <Navbar />
      <HeroBanner />
      <ImageCategoryGrid />
      <BrandStory />
      <CategoryGrid />
      <FeaturedProducts />
      <LuxuryStrip />
      <WhyUs />
      <Footer />
    </div>
  )
}
