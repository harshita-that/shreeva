import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation()

  const navLinks = [
    { to: '/',         label: 'Home' },
    { to: '/products', label: 'Collection' },
    { to: '/contact',  label: 'Contact' },
  ]

  const isActive = (to) => {
    if (to === '/') return pathname === '/'
    return pathname.startsWith(to)
  }

  return (
    <nav style={{
      background: '#FAFAF7',
      borderBottom: '1px solid rgba(201,168,76,0.25)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(1rem,4vw,3rem)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* Brand */}
          <Link
            to="/"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.2rem, 2.5vw, 1.55rem)',
              fontWeight: 600,
              color: '#1C1C1C',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              flexShrink: 0,
            }}
          >
            <img
              src="/logo.png"
              alt="Shreeva Jewellers"
              style={{ height: '32px', width: 'auto' }}
              onError={(e) => { e.target.style.display = 'none' }}
            />
            Shreeva Jewellers
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'none', alignItems: 'center', gap: '2.5rem' }} className="nav-desktop">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: isActive(link.to) ? '#C9A84C' : 'rgba(28,28,28,0.6)',
                  borderBottom: isActive(link.to) ? '1.5px solid #C9A84C' : '1.5px solid transparent',
                  paddingBottom: '2px',
                  transition: 'color 0.25s ease, border-color 0.25s ease',
                }}
                onMouseEnter={e => { if (!isActive(link.to)) e.currentTarget.style.color = '#1C1C1C' }}
                onMouseLeave={e => { if (!isActive(link.to)) e.currentTarget.style.color = 'rgba(28,28,28,0.6)' }}
              >
                {link.label}
              </Link>
            ))}

            {/* Admin link — subtle, separate */}
            <Link
              to="/admin"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '10px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: 'rgba(28,28,28,0.3)',
                padding: '5px 12px',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: '2px',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(28,28,28,0.3)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)' }}
            >
              Admin
            </Link>
          </div>

          {/* Hamburger */}
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}
            className="nav-hamburger"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span style={{ display: 'block', width: '22px', height: '1.5px', background: '#1C1C1C', transition: 'transform 0.3s ease, opacity 0.3s ease', transform: isOpen ? 'rotate(45deg) translateY(6.5px)' : 'none' }} />
            <span style={{ display: 'block', width: '22px', height: '1.5px', background: '#1C1C1C', transition: 'opacity 0.3s ease', opacity: isOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: '22px', height: '1.5px', background: '#1C1C1C', transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div style={{
        overflow: 'hidden',
        maxHeight: isOpen ? '240px' : '0',
        transition: 'max-height 0.35s ease',
        background: '#FAFAF7',
        borderTop: isOpen ? '1px solid rgba(201,168,76,0.15)' : 'none',
      }}>
        <div style={{ padding: '12px clamp(1rem,4vw,3rem) 16px', display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '1280px', margin: '0 auto' }}>
          {[...navLinks, { to: '/admin', label: 'Admin' }].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '12px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: isActive(link.to) ? '#C9A84C' : 'rgba(28,28,28,0.65)',
                padding: '10px 0',
                borderBottom: '1px solid rgba(201,168,76,0.08)',
                transition: 'color 0.2s ease',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* CSS to show/hide desktop vs hamburger */}
      <style>{`
        @media (min-width: 768px) {
          .nav-desktop    { display: flex !important; }
          .nav-hamburger  { display: none !important; }
        }
        @media (max-width: 767px) {
          .nav-desktop    { display: none !important; }
          .nav-hamburger  { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
