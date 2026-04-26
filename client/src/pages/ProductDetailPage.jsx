import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import BackButton from '../components/BackButton'
import api from '../api/axios.js'

/* ─── ALL EXISTING LOGIC — FULLY PRESERVED ─── */
const FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjBFREU2Ii8+PC9zdmc+'

const resolveImg = (url) => {
  if (!url) return FALLBACK
  if (url.startsWith('http')) return url
  const base = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'
  return `${base}${url}`
}

/* ─── Trust badges ─── */
const TRUST = [
  { icon: '✦', label: 'Certified Gold', sub: 'BIS Hallmarked' },
  { icon: '◈', label: 'Purity Assured', sub: '22K / 24K Gold' },
  { icon: '◎', label: 'Easy Enquiry',   sub: 'Same-day Response' },
]

/* ─── Lifestyle shots shown below main section ─── */
const LIFESTYLE = [
  {
    img: 'https://images.unsplash.com/photo-1573408301185-9146fe261cdc?w=1200&h=700&fit=crop&q=80',
    caption: 'Worn with intention. Made to last a lifetime.',
    align: 'left',
  },
  {
    img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=1200&h=700&fit=crop&q=80',
    caption: 'Every detail, a quiet act of devotion.',
    align: 'right',
  },
]

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct]           = useState(null)
  const [activeImgIdx, setActiveImgIdx] = useState(0)
  const [pricePulse, setPricePulse]     = useState(false)
  const [lastUpdated, setLastUpdated]   = useState(null)
  const [imgFading, setImgFading]       = useState(false)
  const [pageIn, setPageIn]             = useState(false)
  const [imgZoom, setImgZoom]           = useState(false)
  const enquiryRef = useRef(null)

  /* page fade-in */
  useEffect(() => { setTimeout(() => setPageIn(true), 60) }, [])

  /* ── EXISTING FETCH LOGIC — UNTOUCHED ── */
  useEffect(() => {
    const fetchProduct = () => {
      api.get(`/products/${id}`).then(res => {
        const data = res.data
        const prevPrice = product?.finalPrice
        setProduct(data)
        setLastUpdated(data.goldPriceLastUpdated)
        if (prevPrice && prevPrice !== data.finalPrice) {
          setPricePulse(true)
          setTimeout(() => setPricePulse(false), 1200)
        }
      }).catch(console.error)
    }
    fetchProduct()
    const productInterval = setInterval(fetchProduct, 15000)
    return () => clearInterval(productInterval)
  }, [id])
  /* ── END EXISTING LOGIC ── */

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)

  const switchImage = (idx) => {
    if (idx === activeImgIdx) return
    setImgFading(true)
    setTimeout(() => { setActiveImgIdx(idx); setImgFading(false) }, 280)
  }

  /* ── Loading state ── */
  if (!product) {
    return (
      <div style={{ background: '#FAFAF7', minHeight: '100vh' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <Navbar />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '20px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(201,168,76,0.15)', borderTop: '2px solid #C9A84C', animation: 'spin 0.9s linear infinite' }} />
          <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(28,28,28,0.35)' }}>Loading</p>
        </div>
        <Footer />
      </div>
    )
  }

  const breakdown = product.priceBreakdown || {}
  const images    = product.images || []

  return (
    <div style={{ background: '#FAFAF7', minHeight: '100vh', opacity: pageIn ? 1 : 0, transition: 'opacity 0.7s ease' }}>
      <style>{`
        /* Responsive grid */
        .pdp-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 768px)  { .pdp-grid { grid-template-columns: 1fr 1fr; gap: 3.5rem; align-items: start; } }
        @media (min-width: 1100px) { .pdp-grid { grid-template-columns: 520px 1fr; gap: 5rem; } }

        /* Thumbnail strip */
        .pdp-thumbs {
          display: flex;
          gap: 10px;
          margin-top: 12px;
          flex-wrap: nowrap;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .pdp-thumbs::-webkit-scrollbar { display: none; }

        /* Enquiry button */
        .pdp-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 38px;
          background: linear-gradient(135deg, #C9A84C 0%, #b8963e 60%, #d4b76a 100%);
          color: #1C1C1C;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          text-decoration: none;
          font-weight: 600;
          border-radius: 2px;
          border: none;
          cursor: pointer;
          transition: all 0.4s ease;
          box-shadow: 0 4px 20px rgba(201,168,76,0.2);
        }
        .pdp-cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(201,168,76,0.35);
        }
        .pdp-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          background: transparent;
          color: rgba(28,28,28,0.55);
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 2px;
          border: 1px solid rgba(28,28,28,0.16);
          cursor: pointer;
          transition: all 0.35s ease;
        }
        .pdp-cta-secondary:hover {
          border-color: #C9A84C;
          color: #C9A84C;
          transform: translateY(-2px);
        }

        /* Lifestyle section */
        .pdp-lifestyle {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 768px) {
          .pdp-lifestyle { grid-template-columns: 1fr 1fr; }
        }

        /* Price pulse */
        @keyframes pricePop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.06); color: #2d7a2d; }
          100% { transform: scale(1); }
        }
        .price-pulse { animation: pricePop 0.7s ease; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pdp-info-animate { animation: fadeSlideUp 0.9s ease 0.2s both; }
      `}</style>

      <Navbar />

      {/* ── NAV STRIP ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem clamp(1rem,4vw,3rem) 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <Breadcrumb crumbs={[
            { label: 'Home',       to: '/' },
            { label: 'Collection', to: '/products' },
            { label: product.name.length > 28 ? product.name.slice(0, 28) + '…' : product.name },
          ]} />
          <BackButton fallback="/products" label="Back to Collection" />
        </div>
      </div>

      {/* ── MAIN PRODUCT SECTION ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(2rem,4vw,3.5rem) clamp(1rem,4vw,3rem)' }}>
        <div className="pdp-grid">

          {/* ═══════════ LEFT — IMAGE GALLERY ═══════════ */}
          <div>
            {/* Main image — max-height capped, object-contain so nothing gets cropped */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxHeight: '540px',
                aspectRatio: '4 / 5',
                overflow: 'hidden',
                borderRadius: '6px',
                background: '#F5F1EA',
                boxShadow: '0 6px 36px rgba(28,28,28,0.09)',
                cursor: 'zoom-in',
              }}
              onMouseEnter={() => setImgZoom(true)}
              onMouseLeave={() => setImgZoom(false)}
            >
              <img
                src={resolveImg(images[activeImgIdx])}
                alt={product.name}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  /* object-contain so tall/square jewellery images aren't awkwardly cropped */
                  objectFit: 'contain',
                  objectPosition: 'center',
                  padding: '12px',
                  transform: imgZoom ? 'scale(1.04)' : 'scale(1)',
                  opacity: imgFading ? 0 : 1,
                  transition: 'opacity 0.28s ease, transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
                onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK }}
              />

              {/* Category badge */}
              <div style={{
                position: 'absolute', top: 16, left: 16, zIndex: 2,
                background: 'rgba(250,250,247,0.92)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '2px',
                padding: '4px 12px',
                fontFamily: "'Jost',sans-serif",
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#C9A84C',
              }}>
                {product.category}
              </div>

              {/* Image counter */}
              {images.length > 1 && (
                <div style={{
                  position: 'absolute', bottom: 16, right: 16, zIndex: 2,
                  fontFamily: "'Jost',sans-serif",
                  fontSize: '10px', letterSpacing: '0.1em',
                  color: 'rgba(250,250,247,0.6)',
                  background: 'rgba(28,28,28,0.4)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: '20px',
                  padding: '3px 10px',
                }}>
                  {activeImgIdx + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail row */}
            {images.length > 1 && (
              <div className="pdp-thumbs">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => switchImage(idx)}
                    aria-label={`View image ${idx + 1}`}
                    style={{
                      flexShrink: 0,
                      width: '72px', height: '72px',
                      overflow: 'hidden',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: activeImgIdx === idx
                        ? '2px solid #C9A84C'
                        : '2px solid transparent',
                      opacity: activeImgIdx === idx ? 1 : 0.5,
                      transition: 'border-color 0.25s, opacity 0.25s, transform 0.25s',
                      transform: activeImgIdx === idx ? 'scale(1.04)' : 'scale(1)',
                      padding: 0,
                      background: 'none',
                      boxShadow: activeImgIdx === idx ? '0 2px 12px rgba(201,168,76,0.25)' : 'none',
                    }}
                  >
                    <img
                      src={resolveImg(img)}
                      alt={`${product.name} view ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ═══════════ RIGHT — PRODUCT INFO ═══════════ */}
          <div className="pdp-info-animate" style={{ display: 'flex', flexDirection: 'column' }}>

            {/* Category eyebrow */}
            <p style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase',
              color: '#C9A84C', marginBottom: '12px',
            }}>
              {product.category}
            </p>

            {/* Product name */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
              fontWeight: 400,
              color: '#1C1C1C',
              lineHeight: 1.1,
              letterSpacing: '0.02em',
              marginBottom: '1.5rem',
            }}>
              {product.name}
            </h1>

            {/* Gold rule */}
            <div style={{ width: '56px', height: '1px', background: 'linear-gradient(90deg, #C9A84C, transparent)', marginBottom: '1.5rem' }} />

            {/* Description */}
            <p style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: '0.88rem',
              lineHeight: 1.85,
              color: 'rgba(28,28,28,0.6)',
              marginBottom: '2.2rem',
              maxWidth: '420px',
            }}>
              {product.description || 'A beautifully crafted piece from our exclusive collection, made with the finest gold and artisan precision.'}
            </p>

            {/* ── PRICE BREAKDOWN CARD ── */}
            <div style={{
              background: '#fff',
              border: '1px solid rgba(201,168,76,0.28)',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '1.75rem',
              boxShadow: '0 4px 24px rgba(28,28,28,0.05)',
            }}>
              {/* Card header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: '1px solid rgba(201,168,76,0.18)',
                background: 'rgba(201,168,76,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.5)' }} />
                  <span style={{
                    fontFamily: "'Jost',sans-serif", fontSize: '9px',
                    letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2d7a2d',
                  }}>Live Market Price</span>
                </div>
                {lastUpdated && (
                  <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '10px', color: 'rgba(28,28,28,0.35)' }}>
                    {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>

              {/* Breakdown rows */}
              <div style={{ padding: '6px 20px 0' }}>
                {[
                  { label: 'Gold Rate',      value: `${formatPrice(breakdown.goldPricePerGram)} / g` },
                  { label: 'Weight',         value: `${breakdown.goldWeight} g` },
                  { label: 'Gold Value',     value: formatPrice(breakdown.goldValue) },
                  { label: 'Making Charges', value: formatPrice(breakdown.makingCharges) },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    padding: '10px 0',
                    borderBottom: '1px solid rgba(201,168,76,0.1)',
                  }}>
                    <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.8rem', color: 'rgba(28,28,28,0.5)' }}>
                      {row.label}
                    </span>
                    <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.85rem', color: '#1C1C1C', letterSpacing: '0.02em' }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Final price — visually dominant */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 20px',
                background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.03) 100%)',
                borderTop: '1px solid rgba(201,168,76,0.25)',
              }}>
                <span style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'rgba(28,28,28,0.5)',
                }}>
                  Final Price
                </span>
                <span
                  className={pricePulse ? 'price-pulse' : ''}
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 'clamp(1.6rem, 3vw, 2rem)',
                    fontWeight: 600,
                    color: pricePulse ? '#2d7a2d' : '#C9A84C',
                    letterSpacing: '0.02em',
                    transition: 'color 0.5s ease',
                  }}
                >
                  {formatPrice(product.finalPrice)}
                </span>
              </div>
            </div>

            {/* ── CTA BUTTONS ── */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '2rem' }}>
              <Link to="/contact" className="pdp-cta-primary">
                ✦ Send Enquiry
              </Link>
              <Link to="/contact" className="pdp-cta-secondary">
                ♡ Wishlist
              </Link>
            </div>

            {/* ── TRUST BADGES ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              padding: '20px',
              background: '#F5F0E8',
              borderRadius: '6px',
              border: '1px solid rgba(201,168,76,0.18)',
            }}>
              {TRUST.map((t) => (
                <div key={t.label} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: '20px', color: '#C9A84C',
                    marginBottom: '6px', lineHeight: 1,
                  }}>
                    {t.icon}
                  </div>
                  <p style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: '#1C1C1C', fontWeight: 600, marginBottom: '2px',
                  }}>
                    {t.label}
                  </p>
                  <p style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: '9px', color: 'rgba(28,28,28,0.45)', letterSpacing: '0.05em',
                  }}>
                    {t.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* Gold spec strip */}
            <div style={{
              marginTop: '1.5rem', paddingTop: '1.5rem',
              borderTop: '1px solid rgba(201,168,76,0.15)',
              display: 'flex', gap: '24px', flexWrap: 'wrap',
            }}>
              {[
                { label: 'Purity',   value: '22 Karat Gold' },
                { label: 'Weight',   value: `${breakdown.goldWeight ?? '—'} g` },
                { label: 'Finish',   value: 'Hallmarked' },
              ].map(spec => (
                <div key={spec.label}>
                  <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '3px' }}>{spec.label}</p>
                  <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '13px', color: '#1C1C1C', letterSpacing: '0.04em' }}>{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── LIFESTYLE IMAGERY STRIP ── */}
      <div style={{ borderTop: '1px solid rgba(201,168,76,0.15)', marginTop: 'clamp(2rem,4vw,4rem)' }}>
        {LIFESTYLE.map((ls, i) => (
          <LifestyleBlock key={i} ls={ls} index={i} />
        ))}
      </div>

      <Footer />
    </div>
  )
}

/* ─── Lifestyle block with parallax-style scroll reveal ─── */
function LifestyleBlock({ ls, index }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        height: 'clamp(240px, 34vw, 400px)',
        overflow: 'hidden',
        background: '#0a0805',
        opacity: inView ? 1 : 0,
        transition: `opacity 1.1s ease ${index * 0.15}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={ls.img}
        alt={ls.caption}
        loading="lazy"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: ls.align === 'right' ? 'right center' : 'left center',
          opacity: hovered ? 0.45 : 0.55,
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'opacity 0.6s ease, transform 0.8s ease',
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: index % 2 === 0
          ? 'linear-gradient(to right, rgba(10,8,5,0.7) 0%, rgba(10,8,5,0.2) 60%, transparent 100%)'
          : 'linear-gradient(to left, rgba(10,8,5,0.7) 0%, rgba(10,8,5,0.2) 60%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
        padding: 'clamp(2rem,6vw,6rem)',
      }}>
        <div style={{
          maxWidth: '400px',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(24px)',
          transition: `opacity 1.2s ease ${0.3 + index * 0.15}s, transform 1.2s ease ${0.3 + index * 0.15}s`,
        }}>
          <div style={{ width: '32px', height: '1px', background: '#C9A84C', marginBottom: '20px', opacity: 0.8 }} />
          <p style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 'clamp(1.3rem, 2.8vw, 2rem)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: '#FAFAF7',
            lineHeight: 1.35,
            letterSpacing: '0.02em',
          }}>
            {ls.caption}
          </p>
        </div>
      </div>
    </div>
  )
}
