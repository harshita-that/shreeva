import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjBFREU2Ii8+PC9zdmc+'

/**
 * Resolve image URL:
 *  - Absolute (http/https) → as-is
 *  - Relative /uploads/...  → prepend backend base
 *  - Empty / undefined      → FALLBACK
 */
const resolveImg = (url) => {
  if (!url) return FALLBACK
  if (url.startsWith('http')) return url
  const base = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'
  return `${base}${url}`
}

export default function ProductCard({ product }) {
  const [pulse, setPulse]     = useState(false)
  const [prevPrice, setPrevPrice] = useState(product?.finalPrice)
  const [hovered, setHovered] = useState(false)

  /* price-change pulse — existing logic preserved */
  useEffect(() => {
    if (prevPrice && prevPrice !== product?.finalPrice) {
      setPulse(true)
      setTimeout(() => setPulse(false), 1200)
    }
    setPrevPrice(product?.finalPrice)
  }, [product?.finalPrice])

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)

  /* images array — index 0 = primary, index 1 = hover */
  const primaryImg = resolveImg(product.images?.[0])
  const hoverImg   = product.images?.[1] ? resolveImg(product.images[1]) : null

  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          background: '#FAFAF7',
          borderRadius: '10px',
          overflow: 'hidden',
          /* Controlled shadow — soft, not harsh */
          boxShadow: hovered
            ? '0 10px 36px rgba(201,168,76,0.16), 0 3px 12px rgba(28,28,28,0.1)'
            : '0 2px 10px rgba(28,28,28,0.07)',
          border: hovered
            ? '1.5px solid rgba(201,168,76,0.5)'
            : '1.5px solid transparent',
          transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
          transition: 'box-shadow 0.38s ease, transform 0.35s ease, border-color 0.35s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Image container — strict square aspect ratio ── */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',         /* square — prevents any height inconsistency */
          overflow: 'hidden',
          background: '#F0EDE6',
        }}>
          {/* Primary image */}
          <img
            src={primaryImg}
            alt={product.name}
            loading="lazy"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.55s ease',
            }}
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK }}
          />

          {/* Hover image (images[1]) — cross-fades in */}
          {hoverImg && (
            <img
              src={hoverImg}
              alt={`${product.name} — alternate view`}
              loading="lazy"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                opacity: hovered ? 1 : 0,
                transform: hovered ? 'scale(1.06)' : 'scale(1.02)',
                transition: 'opacity 0.45s ease, transform 0.55s ease',
              }}
              onError={(e) => {
                e.target.onerror = null
                e.target.style.opacity = '0'
                e.target.style.pointerEvents = 'none'
              }}
            />
          )}

          {/* Gold shimmer gradient on hover */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(201,168,76,0.1) 0%, transparent 45%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }} />
        </div>

        {/* ── Product info ── */}
        <div style={{ padding: '16px 18px 20px', textAlign: 'center' }}>
          {/* Category */}
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '9px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '5px',
          }}>
            {product.category}
          </p>

          {/* Name */}
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            fontWeight: 500,
            color: '#1C1C1C',
            lineHeight: 1.3,
            marginBottom: '10px',
            letterSpacing: '0.01em',
            /* Clamp to 2 lines max to keep card heights equal */
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.name}
          </h3>

          {/* Divider */}
          <div style={{ width: '28px', height: '1px', background: '#C9A84C', margin: '0 auto 10px', opacity: 0.55 }} />

          {/* Price */}
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '0.88rem',
            fontWeight: 400,
            letterSpacing: '0.04em',
            color: pulse ? '#2d7a2d' : '#C9A84C',
            transition: 'color 0.5s ease',
          }}>
            From {formatPrice(product.finalPrice)}
          </p>
        </div>
      </div>
    </Link>
  )
}
