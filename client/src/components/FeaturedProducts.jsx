import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import api from '../api/axios.js'

function useFadeIn(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* Staggered card wrapper */
function RevealCard({ children, index }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
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
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`,
      }}
    >
      {children}
    </div>
  )
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [titleRef, titleIn] = useFadeIn(0.1)

  useEffect(() => {
    const fetchFeatured = () => {
      api.get('/products')
        .then(res => {
          const products = res.data.products || []
          setProducts(products.slice(0, 6))
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
    fetchFeatured()
    const interval = setInterval(fetchFeatured, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section style={{
      padding: 'clamp(3.5rem,6vw,5.5rem) clamp(1rem,4vw,3rem)',
      background: '#FAFAF7',
      borderTop: '1px solid rgba(201,168,76,0.15)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section header */}
        <div
          ref={titleRef}
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(3rem,5vw,5rem)',
            opacity: titleIn ? 1 : 0,
            transform: titleIn ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px' }}>
            Curated For You
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 400, color: '#1C1C1C', letterSpacing: '0.03em', lineHeight: 1.1, marginBottom: '14px' }}>
            Handpicked Pieces
          </h2>
          {/* 2px solid gold divider — consistent with global .gold-divider */}
          <div className="gold-divider" />
        </div>

        {/* Product grid — uses global .product-grid from index.css */}

        <div className="product-grid">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} style={{ borderRadius: '14px', overflow: 'hidden', background: '#F0EDE6' }}>
                <div style={{ aspectRatio: '4/5', background: 'linear-gradient(90deg,#ede8df 25%,#e4dfd6 50%,#ede8df 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
                <div style={{ padding: '18px 20px 22px', textAlign: 'center' }}>
                  <div style={{ height: '10px', width: '60px', background: '#e4dfd6', margin: '0 auto 10px', borderRadius: '4px' }} />
                  <div style={{ height: '18px', width: '120px', background: '#e4dfd6', margin: '0 auto 10px', borderRadius: '4px' }} />
                  <div style={{ height: '12px', width: '80px', background: '#e4dfd6', margin: '0 auto', borderRadius: '4px' }} />
                </div>
              </div>
            ))
          ) : products.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 0', fontFamily: "'Jost', sans-serif", fontSize: '0.85rem', color: 'rgba(28,28,28,0.35)', letterSpacing: '0.1em' }}>
              Collection coming soon
            </div>
          ) : (
            products.map((p, i) => (
              <RevealCard key={p._id} index={i}>
                <ProductCard product={p} />
              </RevealCard>
            ))
          )}
        </div>

        {/* View all — gold primary button */}
        <div style={{ textAlign: 'center', marginTop: 'clamp(2.5rem,4vw,4rem)' }}>
          <Link
            to="/products"
            className="smooth-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'Jost', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#1C1C1C',
              textDecoration: 'none',
              padding: '13px 36px',
              background: 'linear-gradient(135deg, #C9A84C, #b8963e)',
              border: '1px solid transparent',
              borderRadius: '2px',
              fontWeight: 600,
              boxShadow: '0 3px 16px rgba(201,168,76,0.2)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#1C1C1C'
              e.currentTarget.style.color = '#C9A84C'
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(28,28,28,0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #C9A84C, #b8963e)'
              e.currentTarget.style.color = '#1C1C1C'
              e.currentTarget.style.boxShadow = '0 3px 16px rgba(201,168,76,0.2)'
            }}
          >
            View Collection
            <span style={{ fontSize: '13px' }}>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
